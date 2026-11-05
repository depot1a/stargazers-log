# stargazers-log

A log of the repositories I've starred on GitHub.

## 🎯 这个项目是干什么的

一个**纯静态**的 GitHub Star 收藏展示页。把你在 GitHub 上点过的 ⭐ 仓库整理成一个好看的网页，方便你自己回顾，也能分享给别人。

访问地址：`https://depot1a.github.io/stargazers-log/`

## 📁 项目结构

```
stargazers-log/
├── index.html        # 网页骨架
├── style.css         # 样式
├── script.js         # 前端逻辑（读取 events.json 渲染列表）
├── events.json       # ⭐ 数据源（由 fetch-stars.js 自动生成）
├── fetch-stars.js    # 🔧 自动同步脚本（调用 GitHub API）
├── package.json      # 项目配置
├── .nojekyll         # 让 GitHub Pages 跳过 Jekyll
└── README.md
```

## 🚀 快速开始

### 1. 同步你的 Star 数据

```bash
# 一键同步
node fetch-stars.js
```

脚本会自动从 GitHub API 拉取你所有 Starred 的仓库，按时间从新到旧排序，写入 `events.json`。

> 💡 **有 Star 时间戳？** 脚本已经处理了 —— 通过特殊的 Accept header 从 GitHub API 拿到每个仓库的 `starred_at` 时间。

> 🔑 **需要更高 API 限额？** GitHub 未登录请求每小时限额 60 次。可以设 Token 提高到 5000 次/小时：
> ```bash
> # Windows PowerShell
> $env:GITHUB_TOKEN = "ghp_你的token"
> node fetch-stars.js
> ```
> Token 在 [https://github.com/settings/tokens](https://github.com/settings/tokens) 创建，不需要选任何 scope（只读公开信息）。

### 2. 本地预览

```bash
# 用任意 HTTP 服务器都行
npx --yes serve .
# 或者
python -m http.server 8080
```

然后浏览器打开 `http://localhost:3000` 看看效果。

### 3. 部署到 GitHub Pages

1. 推送到 GitHub：
   ```bash
   git add .
   git commit -m "Sync starred repositories"
   git push
   ```

2. 在仓库页面 **Settings → Pages**：
   - Source 选 `Deploy from a branch`
   - Branch 选 `main` + `/ (root)`
   - 点 Save

3. 等一两分钟，访问 `https://depot1a.github.io/stargazers-log/` 就能看到了！

## 🔄 日常使用流程

```bash
# 1. 在 GitHub 上 Star 了新仓库（网页操作）
# 2. 同步数据
node fetch-stars.js
# 3. 推送
git add events.json
git commit -m "Update starred repos"
git push
# 4. 完成！GitHub Pages 会自动更新网页
```

## 🛠️ 怎么继续改进

- [ ] 加搜索框（按仓库名/描述过滤）
- [ ] 加暗色模式
- [ ] 按编程语言分类
- [ ] 加统计图表（总共 Star 了多少、分布在哪类）
- [ ] **加 GitHub Actions 自动同步**（脚本每天自动跑，完全不用手动）

---

Built with plain HTML/CSS/JS, no build step required. 🎉
