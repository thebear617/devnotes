import fs from 'node:fs/promises';
import path from 'node:path';
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

const ROOT = path.resolve(process.cwd(), 'src/content');
const markdownProcessor = createMarkdownProcessor({
  remarkPlugins: [remarkFootnoteIndent, remarkMath],
  rehypePlugins: [rehypeKatex, rehypeMark, rehypeTableWrap, rehypePopover, rehypeSourcePosition],
  remarkRehype: { handlers: { footnoteReference: footnoteReferenceWithLabel } },
});

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
    defaultFrontmatter: parser.defaultFrontmatter,
    fields: parser.fields,
  };
}

export default function localCms() {
  return {
    name: 'devnotes-local-cms',
    configureServer(server) {
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
            const errors = postParser.validate(data.frontmatter || {}, targetPath);
            if (errors.length || !targetPath) return json(response, 400, { errors: errors.length ? errors : ['文章路径不在允许的内容目录内'] });
            await fs.mkdir(path.dirname(safePath(postParser, targetPath)), { recursive: true });
            await fs.writeFile(safePath(postParser, targetPath), postParser.serialize(data.frontmatter, data.body || ''), 'utf8');
            lastSelfWriteAt = Date.now();
            return json(response, 200, { ok: true, collection: postParser.id, path: targetPath });
          }

          return json(response, 404, { error: 'Not found' });
        } catch (error) {
          return json(response, 400, { error: error.message });
        }
      });
    },
  };
}
