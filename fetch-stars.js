#!/usr/bin/env node
/**
 * fetch-stars.js
 * 从 GitHub API 拉取 depot1a 的真实 Star 列表，生成 events.json
 *
 * 使用方法：
 *   node fetch-stars.js
 *
 * 如果有 GitHub Token（可选，提高 API 限额）：
 *   GITHUB_TOKEN=ghp_xxx node fetch-stars.js
 */

import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// 配置
const USERNAME = "depot1a";
const PER_PAGE = 100;
const OUTPUT_FILE = "events.json";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * 从 GitHub API 分页获取所有 Starred 仓库
 * 关键：Accept header 必须加 application/vnd.github.v3.star+json 才能拿到 starred_at
 */
async function fetchAllStarred(username) {
  const starred = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `https://api.github.com/users/${username}/starred?per_page=${PER_PAGE}&page=${page}&sort=created`;

    const headers = {
      Accept: "application/vnd.github.v3.star+json",
      "User-Agent": "stargazers-log-fetcher",
    };

    // 如果设置了 GITHUB_TOKEN，加上 Authorization 提高限额
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    console.log(`📡 正在拉取第 ${page} 页...`);

    const res = await fetch(url, { headers });

    if (!res.ok) {
      if (res.status === 403) {
        console.error("❌ API 速率限制了！设置 GITHUB_TOKEN 环境变量可以提高限额。");
      }
      throw new Error(`GitHub API 返回 ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (data.length === 0) {
      hasMore = false;
    } else {
      starred.push(...data);
      console.log(`   本页获取 ${data.length} 条，累计 ${starred.length} 条`);
      page++;

      // 防止死循环，最多 100 页（10000 条 Star，足够了）
      if (page > 100) hasMore = false;
    }
  }

  return starred;
}

/**
 * 把 GitHub API 返回的数据转换成 events.json 格式
 */
function convertToEvents(starredData) {
  return starredData.map((item) => ({
    type: "starred",
    created_at: item.starred_at, // 这就是为什么要加特殊 Accept header
    repository: {
      name: item.repo.name,
      url: item.repo.html_url,
      description: item.repo.description || "(没有描述)",
    },
  }));
}

/**
 * 主函数
 */
async function main() {
  console.log(`🚀 开始同步 ${USERNAME} 的 GitHub Star 列表...\n`);

  try {
    // 1. 拉取数据
    const starredData = await fetchAllStarred(USERNAME);
    console.log(`\n✅ 共获取 ${starredData.length} 个 Starred 仓库`);

    // 2. 转换格式
    const events = convertToEvents(starredData);

    // 3. 写入文件（从新到旧排序）
    const sortedEvents = events.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    const outputPath = join(__dirname, OUTPUT_FILE);
    writeFileSync(outputPath, JSON.stringify(sortedEvents, null, 2), "utf-8");
    console.log(`📝 已写入 ${outputPath}`);
    console.log(`\n🎉 完成！运行 'npx serve .' 预览效果，然后 git add + commit + push 即可。`);
  } catch (err) {
    console.error("❌ 出错了:", err.message);
    process.exit(1);
  }
}

main();
