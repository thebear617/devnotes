---
title: '安装 Oh My Zsh：经典 ZSH 配置管理框架'
date: '2026-07-17'
tags: [工具, 功能]
site: 工具
slug: 'tool-ohmyzsh'
---

安装了 Oh My Zsh，一个管理 ZSH 配置的经典框架。它内置主题、插件与大量社区维护的开箱即用功能，极大简化了 shell 环境的定制——但本质是个「配置框架」，并不会自动提供一个完整的「配置档案切换器」，切换逻辑通常要自己在 <code>~/.zshrc</code> 里写。

## 用法一：直接修改当前配置

在 <code>~/.zshrc</code> 里切换主题、插件和别名：

    ZSH_THEME="robbyrussell"

    plugins=(
      git
      npm
      docker
    )

    alias ll="ls -lah"
    alias c="clear"

改完执行 <code>source ~/.zshrc</code> 即可生效。

## 用法二：多套配置方案

分别建立不同场景的配置文件，再在 <code>~/.zshrc</code> 中选载：

    ~/.zshrc.work
    ~/.zshrc.dev
    ~/.zshrc.minimal

<code>~/.zshrc</code> 中用变量选择加载哪一套：

    ZSH_PROFILE="dev"

    case "$ZSH_PROFILE" in
      work)    source ~/.zshrc.work ;;
      dev)     source ~/.zshrc.dev ;;
      minimal) source ~/.zshrc.minimal ;;
    esac

例如开发配置 <code>~/.zshrc.dev</code>：

    ZSH_THEME="robbyrussell"

    plugins=(
      git
      npm
      docker
    )

    alias gs="git status"
    alias devserver="npm run dev"

工作配置 <code>~/.zshrc.work</code> 则可以是：

    ZSH_THEME="agnoster"

    plugins=(
      git
      macos
    )

    alias notes="cd ~/notes"

切换时改 <code>ZSH_PROFILE="work"</code>（或对应值），再运行 <code>source ~/.zshrc</code> 即可。

## 核心组织维度

围绕以下维度即可组织出不同的配置方案：

    Oh My Zsh
    ├── 主题
    ├── 插件
    ├── 别名
    ├── 环境变量
    └── 自定义函数

只是「切换」这一步通常需要自己在 <code>.zshrc</code> 里写。

## 项目
- GitHub：https://github.com/ohmyzsh/ohmyzsh
