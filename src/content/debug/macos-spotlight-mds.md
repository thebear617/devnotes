---
title: "macOS：Spotlight - 索引进程重启"
date: "2026-07-11"
updated: "2026-07-11"
slug: "macos-spotlight-index-restart"
category: "系统与平台"
subcategory: "操作系统"
description: "macOS Spotlight 搜索结果陈旧或缺失时，重启 mds 进程即可快速恢复，索引损坏时再重建数据库。"
---
<p>macOS 聚焦搜索（Spotlight）偶尔会"罢工"——搜不到刚拉取/安装的应用，或结果陈旧。一条 <code>sudo killall mds</code> 就能让它在几秒内恢复。下面拆开看"问题 / 解法 / 原理"。</p>

<h2>① 我出现的问题</h2>
<p>在 macOS 上用聚焦搜索（右上角放大镜或 <code>⌘Space</code>）时：</p>
<ul>
  <li>搜不到我<strong>刚拉取或安装</strong>的应用程序和文件；</li>
  <li>搜出来的结果是<strong>陈旧缓存</strong>——文件明明已经在磁盘上，聚焦却像"眼盲"了一样捞不到。</li>
</ul>

<h2>② 解决方法</h2>
<p>一行命令，重启底层索引引擎：</p>
<p><code>sudo killall mds</code></p>
<p>进阶：如果 kill 之后仍不正常，说明<strong>索引数据库本身损坏</strong>，需要重建索引（慢、吃 CPU）：</p>
<p><code>sudo mdutil -E /</code></p>
<p>一句话区分两者：</p>
<ul>
  <li><code>killall mds</code> = 换了个<strong>清醒的图书管理员</strong>来查目录。速度快，专治进程卡死。</li>
  <li><code>mdutil -E</code> = 把整座图书馆的<strong>目录卡片烧掉重写</strong>。速度慢，专治索引库损坏。</li>
</ul>

<h2>③ 解决的原因</h2>
<p><code>mds</code> 全称 <strong>Metadata Server（元数据服务器）</strong>，是负责 Spotlight 搜索的核心守护进程。你每次搜索，都是向后台这个默默运行的 <code>mds</code> 进程发请求，由它去庞大的索引数据库里捞结果。</p>
<p>作为开发者，电脑里经常瞬时产生大量文件 I/O（克隆大型 GitHub 仓库、编译生成缓存、更新依赖库），<code>mds</code> 偶尔会"消化不良"：</p>
<ul>
  <li>陷入<strong>死锁</strong>：读某个权限异常或格式损坏的文件时卡住；</li>
  <li><strong>内存泄漏 / 过载</strong>：海量小文件把内存吃爆，进程假死（Hang）；</li>
  <li><strong>缓存错乱</strong>：索引库已更新，但进程内存里的搜索树跑偏，导致它"眼盲"。</li>
</ul>
<p>当你执行 <code>sudo killall mds</code>：</p>
<ol>
  <li><strong>强制斩杀</strong>——系统无视它卡在什么状态，直接把它从内存清掉；</li>
  <li><strong>系统级复活</strong>——macOS 的服务管理器 <code>launchd</code> 一直在监控核心进程，一旦发现 <code>mds</code> 意外死亡，会<strong>立刻自动拉起一个新的 <code>mds</code> 进程</strong>。</li>
</ol>
<p>新启动的 <code>mds</code> 头脑清醒，重新连接到硬盘上的索引数据库，顺利读到你那个应用程序的真实元数据，搜索功能自然就恢复了。</p>
