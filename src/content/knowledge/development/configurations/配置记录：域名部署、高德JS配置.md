---
title: "配置记录：自定义域名 - 高德地图 API 联动"
date: "2026-07-05"
updated: "2026-08-15"
slug: "static-site-deployment-config"
category: "开发"
subcategory: "配置记录"
description: ""
---

## 一、域名购买及部署

### 步骤

1. 在腾讯云购买域名 thebear617.cn，记得勾选禁止转移锁，完成实名认证
2. 在 GitHub 创建想要部署的仓库，push 代码
3. 在 Vercel 上 Import 对应代码仓库，然后创建 Project，直接部署
4. 在 Vercel 项目 Settings → Domains 添加 www.thebear617.cn 和 thebear617.cn
5. 在腾讯云 DNS 添加 A 记录和 CNAME 记录，按 Vercel 给的配即可，等待 Vercel 验证通过，自动签发 SSL，域名上线

## 二、高德地图 API 配置

这条记录用于保存 Astro 静态站点接入高德地图 JS API 后，部署到自定义域名时需要完成的三端配置。关键原则是：`PUBLIC_` 环境变量会在构建阶段注入前端产物，所以变量必须同时配置在实际负责构建的托管平台中。

### 步骤

#### 1. 先看实际部署平台是啥

不要只看代码仓库判断线上站点由谁部署。自定义域名可能已经指向 Vercel，而 GitHub Pages 只是另一份部署产物。

- **Vercel 自定义域名**：`https://pig.thebear617.cn/food-map/`，由 Vercel 提供页面。
- **GitHub Pages**：`https://thebear617.github.io/pig-home/food-map/`，由 GitHub Actions 构建并发布。

如果用户访问的是自定义域名，就必须在 Vercel 配置环境变量；只在 GitHub 添加 Secret 不会影响 Vercel 的构建。

#### 2. 高德地图控制台配置

1. 进入[高德开放平台控制台](https://console.amap.com/)，创建或打开对应应用。
2. 创建 **Web 端（JS API）** 的 Key。不要误用只给 Web 服务 API 使用的 Key。
3. 记录对应的安全密钥（`securityJsCode`），但不要把 Key 或安全密钥写入 Git 仓库、Markdown 笔记或聊天记录。
4. 在安全设置的域名白名单中添加实际访问域名，填写纯域名，不带协议和路径：`pig.thebear617.cn`。如果同时使用 GitHub Pages，也添加 `thebear617.github.io`。

#### 3. Vercel 配置

1. 打开 [Vercel Dashboard](https://vercel.com/dashboard)，进入负责 `pig.thebear617.cn` 的项目。
2. 进入 **Settings → Environment Variables**。
3. 在 **Production** 环境添加以下两条变量：

| Key | Value |
| --- | --- |
| `PUBLIC_AMAP_JS_KEY` | 高德 Web 端 JS API Key |
| `PUBLIC_AMAP_JS_SECURITY_CODE` | 高德安全密钥 |

- 保持 **Sensitive** 开启。
- Production 不需要选择 Custom Preview Branch。
- 变量名必须完全一致，不加引号、空格或中文。
- 保存后进入 **Deployments → 最新部署 → ⋯ → Redeploy**。如果提供缓存选项，关闭 **Use existing Build Cache**。

环境变量不会自动注入已经完成的旧部署；添加变量后必须重新构建。

#### 4.GitHub Actions 配置（

1. 打开仓库 [`thebear617/pig-home` 的 Actions Secrets 页面](https://github.com/thebear617/pig-home/settings/secrets/actions)。
2. 进入 **Secrets → New repository secret**，添加同名的两条 Secret：

- `PUBLIC_AMAP_JS_KEY`
- `PUBLIC_AMAP_JS_SECURITY_CODE`

这里选择 **Secrets**，不要选择 Variables。仓库工作流在 `.github/workflows/deploy.yml` 的构建步骤中读取：

```yaml
PUBLIC_AMAP_JS_KEY: ${{ secrets.PUBLIC_AMAP_JS_KEY }}
PUBLIC_AMAP_JS_SECURITY_CODE: ${{ secrets.PUBLIC_AMAP_JS_SECURITY_CODE }}
```

保存后进入 **Actions → Deploy to GitHub Pages → Run workflow**，选择 `main` 分支并运行。确认 `build` 与 `deploy` 两个任务都成功。

### 注意事项

1. **看域名响应头**：确认当前访问的是 Vercel 还是 GitHub Pages，先确定应该检查哪一套环境变量。
2. **看构建产物**：如果页面完全没有高德脚本加载逻辑，说明构建时没有注入变量。
3. **看浏览器控制台和 Network**：页面里的“请配置前端 JS API Key”是统一兜底提示，任何高德脚本加载失败都可能显示这句话，不能单凭提示判断变量为空。
4. **如果高德返回 `Error key!`**：重新复制 Key，确认使用的是 JS API Key，并检查是否带有前导空格、尾随空格、换行或引号。
5. **检查 Key 长度**：本次实际踩到的坑是 Vercel Value 开头多了一个空白字符，导致构建后的 Key 比正确值多 1 个字符，高德因此判定 Key 无效。
6. **Key 有效但仍被拒绝**：回到高德控制台检查域名白名单，确认已添加当前浏览器地址栏中的纯域名。


### 高德地图的域名白名单千万别设置

1. **不设置域名白名单**：本地开发地址和线上自定义域名都可以正常加载高德地图底图与标点。
2. **设置域名白名单**：只有白名单中的域名可以正常访问地图图层；线上域名仍能显示底图，本地开发地址无法显示底图，但自定义标点仍可能正常出现。

这说明地图底图瓦片请求会校验当前页面的访问域名，而自定义标点是页面代码在地图实例上创建的覆盖物，两者的加载链路不同。因此，“本地只有标点、没有底图”并不一定代表 Key 没有注入，更可能是本地来源不在域名白名单中。

**实践建议**：生产环境保留域名白名单；本地开发使用单独的开发 Key，或在仅用于本地调试的 Key 上不设置白名单，不要为了本地调试而放开生产 Key 的限制。
