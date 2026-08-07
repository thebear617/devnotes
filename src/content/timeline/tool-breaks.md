---
title: '安装 Breaks：支持热力图与离开检测的番茄钟'
date: '2026-08-08'
tags: [工具, 功能]
site: 工具
slug: 'tool-breaks'
---

Breaks 是一款常驻 Mac 菜单栏的小型番茄钟，用 SwiftUI 开发，沙盒化、无遥测、数据全部留在本地 UserDefaults。作者的自述是"它足够安静，会记住你专注了什么，还真的关心休息有没有效"——比传统番茄钟更贴近真实使用需求。

## 特点
- 热力图与统计：热力图可视化专注分布，自动保存每天的番茄钟数量，可按项目查看周/月/全部时长与 7 天图表
- 离开检测：检测到中途离开工作会询问该段时间是否计入，避免无效计时
- 专注日志：记录每日专注主题，给每段时间打标签（good / messy / skipped），支持 Markdown 导出
- 连续天数（streak）：带每周宽限预算，错过一两天不会立刻断签
- 周期模板：Pomodoro、52/17、Deep Work、Flowtime、Ultradian、Quick 六种预设，时长均可自定义
- 全局热键：可自定义，应用未聚焦时也能用
- 可选日历导出（EventKit），睡眠唤醒后计时不漂移
- 沙盒化与隐私：无分析、无账号、无遥测，数据不离开本机

## 链接
- GitHub：https://github.com/GjinPrelvukaj/Breaks
- 官网：https://gjinprelvukaj.github.io/Breaks/
- App Store：https://apps.apple.com/xk/app/breaks-pomodoro-timer/id6766944942
