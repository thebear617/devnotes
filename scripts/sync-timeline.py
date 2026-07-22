#!/usr/bin/env python3
"""同步各站点的大版本变更到 DevNotes 开发时间线。"""

import json
import re
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent.parent
TIMELINE_DIR = ROOT / "devnotes" / "src" / "content" / "timeline"

SITES = {
    "home": "猪窝",
    "personal": "熊窝",
    "devnotes": "开发笔记",
    "reanotes": "科研笔记",
    "lifenotes": "常识笔记",
    "cats": "猫猫",
}
ZH_TO_REPO = {zh: repo for repo, zh in SITES.items()}

VER_RE = re.compile(r"v(\d+)\.(\d+)\.(\d+)")
RELEASE_PATTERNS = (
    re.compile(r"^\w+\((v\d+\.\d+\.\d+)\):"),
    re.compile(r"^\w+\(release\):\s*(v\d+\.\d+\.\d+)\b"),
    re.compile(r"^(v\d+\.\d+\.\d+):"),
    re.compile(r"^(?:feat|fix|chore|refactor|style|init):\s*(?:发布\s+)?(v\d+\.\d+\.\d+)\b"),
)


def run(cmd):
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.stdout


def parse_ver(value):
    match = VER_RE.search(value)
    return tuple(int(part) for part in match.groups()) if match else None


def release_version(subject):
    """提取仓库自身的正式版本，忽略时间线等文档标题中的跨仓库版本号。"""
    for pattern in RELEASE_PATTERNS:
        match = pattern.search(subject)
        if match:
            return match.group(1)
    return None


def unquote_yaml(value):
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] == "'":
        return value[1:-1].replace("''", "'")
    if len(value) >= 2 and value[0] == value[-1] == '"':
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value[1:-1]
    return value


def read_frontmatter(path):
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return {}
    try:
        header = text.split("---\n", 2)[1]
    except IndexError:
        return {}
    data = {}
    for line in header.splitlines():
        key, sep, value = line.partition(":")
        if sep and key.strip() in {"title", "date", "site", "slug"}:
            data[key.strip()] = unquote_yaml(value)
    return data


def timeline_all_versions():
    """返回 {repo: set of (major, minor, patch)} 时间线已记录的所有完整版本。"""
    versions = {}
    for path in TIMELINE_DIR.glob("*.md"):
        data = read_frontmatter(path)
        repo = ZH_TO_REPO.get(data.get("site", ""))
        version = parse_ver(data.get("title", ""))
        if not repo or not version:
            continue
        versions.setdefault(repo, set()).add(version)
    return versions


def repo_version_commits(repo):
    """返回 {(major, minor, patch): (full_ver, subject, sha)}，按完整版本号分桶，每个版本号取最新 commit。"""
    output = run([
        "git", "-C", str(ROOT / repo), "log", "main", "--format=%H%x00%s"
    ])
    commits = {}
    for line in output.splitlines():
        if not line.strip():
            continue
        sha, _, subject = line.partition("\x00")
        full_version = release_version(subject)
        if not full_version:
            continue
        version = parse_ver(full_version)
        if version not in commits:
            commits[version] = (full_version, subject, sha)
    return commits


def commit_meta(repo, sha):
    body = run([
        "git", "-C", str(ROOT / repo), "log", "-1", "--format=%B", sha
    ]).strip()
    date = run([
        "git", "-C", str(ROOT / repo), "log", "-1",
        "--format=%ad", "--date=short", sha,
    ]).strip()
    return body, date


def parse_subject(subject):
    match = re.match(r"^\w+\(v[\d.]+\):\s*(.*)$", subject)
    if match:
        return match.group(1).strip()
    match = re.match(r"^\w+:\s*(.*)$", subject)
    return match.group(1).strip() if match else subject.strip()


def category(subject):
    if re.search(r"重构|迁移|统一|改造|改名|升级", subject):
        return "架构"
    if re.search(r"上线|诞生", subject):
        return "站点"
    if re.search(r"内容|文章", subject):
        return "内容"
    return "功能"


def body_rest(full_body):
    parts = full_body.split("\n", 1)
    return parts[1].strip() if len(parts) > 1 else ""


def file_stats(repo, old_sha, new_sha):
    if not old_sha:
        return {"files_changed": 0, "insertions": 0, "deletions": 0}
    output = run([
        "git", "-C", str(ROOT / repo), "diff", "--shortstat", old_sha, new_sha
    ]).strip()
    files = re.search(r"(\d+) file", output)
    insertions = re.search(r"(\d+) insertion", output)
    deletions = re.search(r"(\d+) deletion", output)
    return {
        "files_changed": int(files.group(1)) if files else 0,
        "insertions": int(insertions.group(1)) if insertions else 0,
        "deletions": int(deletions.group(1)) if deletions else 0,
    }


def collect_additions():
    existing_all = timeline_all_versions()
    additions = []
    notes = []
    new_sites = []

    for repo, zh in SITES.items():
        commits = repo_version_commits(repo)
        if not commits:
            continue
        existing = existing_all.get(repo, set())
        if not existing:
            newest_ver = max(commits)
            newest_full = commits[newest_ver][0]
            notes.append(f"  {repo} ({zh}) → 时间线无记录（仓库最新 {newest_full}）")
            new_sites.append({"repo": repo, "zh": zh})
            continue

        tmin = min(existing)
        gaps = sorted(v for v in commits if v >= tmin and v not in existing)

        for v in gaps:
            full_ver, subject, sha = commits[v]
            all_vs = sorted(commits.keys())
            idx = all_vs.index(v)
            old_sha = commits[all_vs[idx - 1]][2] if idx > 0 else ""
            full_body, date = commit_meta(repo, sha)
            matter = parse_subject(subject)
            body = body_rest(full_body) or f"{zh}升级到 {full_ver}：{matter}。"
            entry_id = f"{repo}-v{full_ver[1:].replace('.', '')}"
            additions.append({
                "repo": repo, "zh": zh, "full_ver": full_ver,
                "major_minor": list(v), "sha": sha, "old_sha": old_sha,
                "date": date, "subject": subject, "matter": matter,
                "id": entry_id,
                "title": f"{zh} {full_ver}：{matter}",
                "tags": [zh, category(subject)],
                "body": body,
                "file_stats": file_stats(repo, old_sha, sha),
            })
            notes.append(f"  {repo} ({zh}) → 版本缺口 {full_ver} → 将新增")

    additions.sort(key=lambda item: (item["date"], parse_ver(item["full_ver"])), reverse=True)
    return additions, notes, new_sites


def yaml_quote(value):
    return "'" + value.replace("'", "''") + "'"


def entry_to_markdown(entry):
    tags = ", ".join(entry["tags"])
    return (
        "---\n"
        f"title: {yaml_quote(entry['title'])}\n"
        f"date: {yaml_quote(entry['date'])}\n"
        f"tags: [{tags}]\n"
        f"site: {entry['zh']}\n"
        f"slug: {yaml_quote(entry['id'])}\n"
        "---\n\n"
        f"{entry['body'].rstrip()}\n"
    )


def output_json(additions, new_sites):
    print(json.dumps({"gaps": additions, "new_sites": new_sites}, ensure_ascii=False, indent=2))


def print_status():
    all_versions = timeline_all_versions()
    print("站点        时间轴最高      仓库最新")
    print("-" * 44)
    for repo, zh in SITES.items():
        commits = repo_version_commits(repo)
        existing = all_versions.get(repo, set())
        current = max(existing) if existing else None
        current_text = f"v{current[0]}.{current[1]}.{current[2]}" if current else "（无）"
        if commits and existing:
            tmin = min(existing)
            gaps = [v for v in commits if v >= tmin and v not in existing]
            flag = "  ← 有缺口" if gaps else ""
            newest_text = commits[max(commits)][0]
        else:
            newest_text = "（无）"
            flag = ""
        print(f"{repo:<10} {current_text:<14} {newest_text}{flag}")


def write_entries(additions):
    TIMELINE_DIR.mkdir(parents=True, exist_ok=True)
    written = []
    for entry in additions:
        path = TIMELINE_DIR / f"{entry['id']}.md"
        if path.exists():
            raise RuntimeError(f"拒绝覆盖已有时间线条目：{path.relative_to(ROOT)}")
        path.write_text(entry_to_markdown(entry), encoding="utf-8")
        written.append(path)
    return written


def main():
    if "--status" in sys.argv:
        print_status()
        return

    json_mode = "--json" in sys.argv
    dry_run = "--dry-run" in sys.argv
    additions, notes, new_sites = collect_additions()

    if json_mode:
        output_json(additions, new_sites)
        return

    for note in notes:
        print(note)
    if not additions:
        print("\n无新增记录（DevNotes 开发时间线已与各仓库大版本对齐）。")
        return
    if dry_run:
        print("\n[dry-run] 将创建以下 Markdown 条目，未修改文件：\n")
        for entry in additions:
            print(f"# {entry['id']}.md")
            print(entry_to_markdown(entry))
        return

    written = write_entries(additions)
    print(f"\n已新增 {len(written)} 条记录到 devnotes/src/content/timeline/（未 commit / 未 push）。")
    for path in written:
        print(f"  - {path.name}")


if __name__ == "__main__":
    main()
