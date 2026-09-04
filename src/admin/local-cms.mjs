import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import { execFile } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import remarkFootnoteIndent from '../plugins/remark-footnote-indent.mjs';
import rehypeKatex from 'rehype-katex';
import rehypeMark from '../plugins/rehype-mark.mjs';
import rehypePopover from '../plugins/rehype-popover.mjs';
import rehypeTableWrap from '../plugins/rehype-table-wrap.mjs';
import rehypeSourcePosition from '../plugins/rehype-source-position.mjs';
import footnoteReferenceWithLabel from '../plugins/footnote-reference-with-label.mjs';
import { parserMap, parsers } from './parsers/index.mjs';

const ROOT = process.env.CMS_CONTENT_ROOT ? path.resolve(process.env.CMS_CONTENT_ROOT) : path.resolve(process.cwd(), 'src/content');
const DEV_SERVER_LOCK = path.resolve(process.cwd(), '.astro', 'devnotes-dev-server.lock');
const execFileAsync = promisify(execFile);
const markdownProcessor = createMarkdownProcessor({
  remarkPlugins: [remarkFootnoteIndent, remarkMath],
  rehypePlugins: [rehypeKatex, rehypeMark, rehypeTableWrap, rehypePopover, rehypeSourcePosition],
  remarkRehype: { handlers: { footnoteReference: footnoteReferenceWithLabel } },
});

function readDevServerLock() {
  try {
    return JSON.parse(fsSync.readFileSync(DEV_SERVER_LOCK, 'utf8'));
  } catch {
    return null;
  }
}

function isProcessRunning(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === 'EPERM';
  }
}

function claimDevServerLock() {
  fsSync.mkdirSync(path.dirname(DEV_SERVER_LOCK), { recursive: true });

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const handle = fsSync.openSync(DEV_SERVER_LOCK, 'wx');
      try {
        fsSync.writeFileSync(handle, `${JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() })}\n`);
      } finally {
        fsSync.closeSync(handle);
      }
      process.once('exit', () => {
        const owner = readDevServerLock();
        if (owner?.pid === process.pid) fsSync.rmSync(DEV_SERVER_LOCK, { force: true });
      });
      return;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      const owner = readDevServerLock();
      if (owner?.pid === process.pid) return;
      if (isProcessRunning(owner?.pid)) {
        throw new Error(`DevNotes 开发服务已在运行（PID ${owner.pid}）。请复用现有服务，不要在同一项目启动第二个 Astro 开发服务。`);
      }
      fsSync.rmSync(DEV_SERVER_LOCK, { force: true });
    }
  }

  throw new Error('无法创建 DevNotes 开发服务锁');
}

function usesIsolatedVerificationCache(server) {
  const serverRoot = typeof server.config?.root === 'string' ? path.resolve(server.config.root) : path.resolve(process.cwd());
  return process.env.CMS_ISOLATED_DEV === '1' && serverRoot !== path.resolve(process.cwd());
}

function getParser(collection) {
  return parserMap.get(collection) || null;
}

function safePath(parser, value) {
  if (!parser || typeof value !== 'string' || !value.endsWith('.md')) return null;
  const normalized = value.replaceAll('\\', '/');
  if (normalized.includes('\0') || normalized.startsWith('/')) return null;
  const base = path.resolve(ROOT, parser.root);
  const absolute = path.resolve(base, normalized);
  if (absolute !== base && !absolute.startsWith(`${base}${path.sep}`)) return null;
  return absolute;
}

function normalizeRelativePath(parser, value) {
  const absolute = safePath(parser, value);
  if (!absolute) return null;
  return path.relative(path.resolve(ROOT, parser.root), absolute).split(path.sep).join('/');
}

function trashDirectory() {
  return process.platform === 'darwin'
    ? path.join(os.homedir(), '.Trash')
    : path.join(os.homedir(), '.local', 'share', 'Trash', 'files');
}

async function moveToTrash(filePath) {
  if (process.platform === 'darwin') {
    const script = [
      'on run argv',
      '  set targetFile to POSIX file (item 1 of argv) as alias',
      '  tell application "Finder"',
      '    delete targetFile',
      '  end tell',
      'end run',
    ].join('\n');
    await execFileAsync('/usr/bin/osascript', ['-e', script, filePath]);
    return filePath;
  }

  const directory = trashDirectory();
  await fs.mkdir(directory, { recursive: true });
  const originalName = path.basename(filePath);
  const parsed = path.parse(originalName);
  let target = path.join(directory, originalName);
  let suffix = 1;
  while (true) {
    try {
      await fs.access(target);
      target = path.join(directory, `${parsed.name} (${suffix})${parsed.ext}`);
      suffix += 1;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      break;
    }
  }
  try {
    await fs.rename(filePath, target);
  } catch (error) {
    if (error.code !== 'EXDEV') throw error;
    await fs.copyFile(filePath, target);
    try {
      await fs.unlink(filePath);
    } catch (removeError) {
      await fs.rm(target, { force: true }).catch(() => {});
      throw removeError;
    }
  }
  return target;
}

async function walk(parser, relative = '') {
  const directory = path.join(ROOT, parser.root, relative);
  let entries = [];
  try { entries = await fs.readdir(directory, { withFileTypes: true }); } catch { return []; }
  const result = [];
  for (const entry of entries) {
    const next = path.join(relative, entry.name);
    if (entry.isDirectory()) result.push(...await walk(parser, next));
    else if (entry.isFile() && entry.name.endsWith('.md')) {
      const relativePath = next.split(path.sep).join('/');
      const source = await fs.readFile(path.join(ROOT, parser.root, relativePath), 'utf8');
      const { frontmatter } = parser.parse(source);
      result.push({ collection: parser.id, path: relativePath, title: frontmatter.title || entry.name.replace(/\.md$/, ''), ...frontmatter });
    }
  }
  return result;
}

function json(response, status, data) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(data));
}

function currentLocalDate() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function currentLocalDateTime() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${currentLocalDate()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

async function readBody(request) {
  let raw = '';
  for await (const chunk of request) raw += chunk;
  return JSON.parse(raw || '{}');
}

function publicParser(parser) {
  return {
    id: parser.id,
    label: parser.label,
    description: parser.description,
    root: parser.root,
    defaultPath: parser.defaultPath,
    pathStrategy: parser.pathStrategy || null,
    defaultFrontmatter: parser.defaultFrontmatter,
    fields: parser.fields,
  };
}

export default function localCms() {
  return {
    name: 'devnotes-local-cms',
    configureServer(server) {
      if (server.config.command === 'serve' && !server.config.server.middlewareMode && !usesIsolatedVerificationCache(server)) claimDevServerLock();

      // CMS writes trigger the dev server's content-change broadcast, which full-reloads the admin page itself.
      // Swallow update signals shortly after a self-write so saving does not refresh the editor.
      let lastSelfWriteAt = 0;
      const SUPPRESS_WINDOW_MS = 2500;
      const hot = server.hot || server.ws;
      if (hot) {
        const originalSend = hot.send.bind(hot);
        hot.send = (...args) => {
          const payload = typeof args[0] === 'string' ? { type: args[0] } : (args[0] || {});
          if ((payload.type === 'full-reload' || payload.type === 'update') && Date.now() - lastSelfWriteAt < SUPPRESS_WINDOW_MS) {
            console.log(`[local-cms] swallowed ${payload.type} broadcast caused by CMS save`);
            return;
          }
          return originalSend(...args);
        };
      }

      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url || '/', 'http://localhost').pathname;
        if (pathname !== '/admin' && pathname !== '/admin/') return next();
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        next();
      });

      server.middlewares.use('/admin/api', async (request, response) => {
        try {
          const url = new URL(request.url, 'http://localhost');
          if (request.method === 'GET' && url.pathname === '/collections') {
            return json(response, 200, { collections: parsers.map(publicParser) });
          }

          const collection = url.searchParams.get('collection');
          const parser = getParser(collection);
          if (request.method === 'GET' && url.pathname === '/entries' && parser) {
            const entries = await walk(parser);
            return json(response, 200, { collection, entries: entries.sort((left, right) => String(left.title).localeCompare(String(right.title), 'zh-CN')) });
          }

          const relativePath = normalizeRelativePath(parser, url.searchParams.get('path'));
          if (request.method === 'GET' && url.pathname === '/entry' && parser && relativePath) {
            const source = await fs.readFile(safePath(parser, relativePath), 'utf8');
            const parsed = parser.parse(source);
            return json(response, 200, { collection, path: relativePath, ...parsed });
          }

          if (request.method === 'DELETE' && url.pathname === '/entry' && parser && relativePath) {
            const absolutePath = safePath(parser, relativePath);
            try {
              await fs.access(absolutePath);
            } catch (error) {
              if (error.code === 'ENOENT') return json(response, 404, { error: '文章不存在' });
              throw error;
            }
            await moveToTrash(absolutePath);
            lastSelfWriteAt = Date.now();
            return json(response, 200, { ok: true, collection: parser.id, path: relativePath });
          }

          if (request.method === 'POST' && url.pathname === '/preview') {
            const data = await readBody(request);
            const postParser = getParser(data.collection || collection);
            if (!postParser) return json(response, 404, { error: 'Unknown collection' });
            const processor = await markdownProcessor;
            const rendered = await processor.render(String(data.body || ''));
            return json(response, 200, { html: rendered.code });
          }

          if (request.method === 'POST' && url.pathname === '/entry') {
            const data = await readBody(request);
            const postParser = getParser(data.collection || collection);
            if (!postParser) return json(response, 404, { error: 'Unknown collection' });
            const targetPath = normalizeRelativePath(postParser, data.path);
            const previousPath = data.previousPath ? normalizeRelativePath(postParser, data.previousPath) : null;
            if (data.previousPath && !previousPath) return json(response, 400, { error: '原文章路径不在允许的内容目录内' });
            const frontmatter = { ...(data.frontmatter || {}), updated: currentLocalDateTime() };
            const errors = postParser.validate(frontmatter, targetPath);
            if (errors.length || !targetPath) return json(response, 400, { errors: errors.length ? errors : ['文章路径不在允许的内容目录内'] });
            const targetFile = safePath(postParser, targetPath);
            if (previousPath && previousPath !== targetPath) {
              const previousFile = safePath(postParser, previousPath);
              try {
                await fs.access(previousFile);
              } catch (error) {
                if (error.code === 'ENOENT') return json(response, 404, { error: '原文章不存在' });
                throw error;
              }
              try {
                await fs.access(targetFile);
                return json(response, 409, { error: '目标路径已存在，请先更换文件路径' });
              } catch (error) {
                if (error.code !== 'ENOENT') throw error;
              }
              await fs.mkdir(path.dirname(targetFile), { recursive: true });
              await fs.rename(previousFile, targetFile);
            } else {
              await fs.mkdir(path.dirname(targetFile), { recursive: true });
            }
            await fs.writeFile(targetFile, postParser.serialize(frontmatter, data.body || ''), 'utf8');
            lastSelfWriteAt = Date.now();
            return json(response, 200, { ok: true, collection: postParser.id, path: targetPath, frontmatter });
          }

          return json(response, 404, { error: 'Not found' });
        } catch (error) {
          return json(response, 400, { error: error.message });
        }
      });
    },
  };
}
