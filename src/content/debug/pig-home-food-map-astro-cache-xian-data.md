---
title: "猪窝：美食地图 - 缓存错误与区域数据缺失"
date: "2026-08-08"
updated: "2026-08-08"
slug: "pig-food-map-cache-region-data"
category: "站点与应用"
subcategory: "内容数据"
description: "猪窝美食地图同时出现 Astro 缓存失配和西安记录缺失，需要重建缓存并从清理提交前恢复数据。"
---
<h2>现象</h2>
<p>美食地图页面出现 Astro 错误：<code>Failed to load url /.astro/content-assets.mjs</code>，页面无法正常加载。缓存问题恢复后，又发现城市切换里只剩南宁，西安记录全部消失。</p>
<h2>根因</h2>
<ol>
  <li><code>.astro/</code> 是 Astro 运行时生成缓存。内容变更后开发服务器处于失配状态，运行时引用了尚未生成的 <code>content-assets.mjs</code>。</li>
  <li>Home 的一次清理提交删除了旧的美食 Markdown，也连带删除了 18 条西安记录；数据集合只剩 3 条南宁记录，所以页面没有西安可切换。</li>
</ol>
<h2>处理</h2>
<ol>
  <li>停止并重启 Astro 开发服务器；如果仍报同样错误，删除可重建的 <code>.astro/</code> 后重新启动，让 Astro 重新生成缓存。</li>
  <li>从清理提交之前恢复 18 条西安记录，保留当前 3 条南宁记录。</li>
  <li>恢复后核对结果：共 21 条，南宁 3 条、西安 18 条。</li>
</ol>
<p><strong>排查要点：</strong>先区分 Astro 生成缓存错误和地图 API 错误；页面能返回 200 也要继续检查内容集合是否完整，避免只验证页面外壳。</p>
