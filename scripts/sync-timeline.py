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

FULL_RE = re.compile(r"\b(v\d+\.\d+\.\d+)\b")
VER_RE = re.compile(r"v(\d+)\.(\d+)\.(\d+)")


def run(cmd):
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.stdout


def parse_ver(value):
    match = VER_RE.search(value)
    return tuple(int(part) for part in match.groups()) if match else None


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


def timeline_versions():
    """返回时间线已记录的版本桶和每站最高完整版本。"""
    buckets = {}
    maximums = {}
    for path in TIMELINE_DIR.glob("*.md"):
        data = read_frontmatter(path)
        repo = ZH_TO_REPO.get(data.get("site", ""))
        version = parse_ver(data.get("title", ""))
        if not repo or not version:
            continue
        buckets.setdefault(repo, set()).add(version[:2])
        if repo not in maximums or version > maximums[repo]:
            maximums[repo] = version
    return buckets, maximums


def repo_version_commits(repo):
    """按 (major, minor) 分桶，每个桶取 git log 中最新的版本 commit。"""
    output = run([
        "git", "-C", str(ROOT / repo), "log", "main", "--format=%H%x00%s"
    ])
    commits = {}
    for line in output.splitlines():
        if not line.strip():
            continue
        sha, _, subject = line.partition("\x00")
        match = FULL_RE.search(subject)
        if not match:
            continue
        version = parse_ver(match.group(1))
        bucket = version[:2]
        if bucket not in commits:
            commits[bucket] = (match.group(1), subject, sha)
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
    existing_buckets, _ = timeline_versions()
    additions = []
    notes = []
    new_sites = []

    for repo, zh in SITES.items():
        commits = repo_version_commits(repo)
        if not commits:
            continue
        existing = existing_buckets.get(repo, set())
        if not existing:
            newest = max(commits)
            notes.append(
                f"  {repo} ({zh}) → 时间线无记录（仓库最新 v{newest[0]}.{newest[1]}）"
            )
            new_sites.append({"repo": repo, "zh": zh})
            continue

        first_recorded = min(existing)
        gaps = [bucket for bucket in sorted(commits) if bucket >= first_recorded and bucket not in existing]
        for bucket in gaps:
            full_ver, subject, sha = commits[bucket]
            lower = [candidate for candidate in commits if candidate < bucket]
            old_sha = commits[max(lower)][2] if lower else ""
            full_body, date = commit_meta(repo, sha)
            matter = parse_subject(subject)
            body = body_rest(full_body) or f"{zh}升级到 {full_ver}：{matter}。"
            entry_id = f"{repo}-v{full_ver[1:].replace('.', '')}"
            additions.append({
                "repo": repo,
                "zh": zh,
                "full_ver": full_ver,
                "major_minor": list(bucket),
                "sha": sha,
                "old_sha": old_sha,
                "date": date,
                "subject": subject,
                "matter": matter,
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
    buckets, maximums = timeline_versions()
    print("站点        时间轴最高      仓库最新")
    print("-" * 44)
    for repo, zh in SITES.items():
        commits = repo_version_commits(repo)
        current = maximums.get(repo)
        current_text = f"v{current[0]}.{current[1]}.{current[2]}" if current else "（无）"
        if commits:
            newest_bucket = max(commits)
            newest_text = commits[newest_bucket][0]
            flag = "  ← 有缺口" if newest_bucket not in buckets.get(repo, set()) else ""
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
