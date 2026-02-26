#!/usr/bin/env node

/**
 * 简单的 AI 助手脚本
 * 用法: echo "问题" | node ask-ai.mjs
 */

import { execSync } from 'child_process';

const QUESTION = process.stdin.read().toString().trim();

if (!QUESTION) {
  console.error('错误: 请提供问题');
  process.exit(1);
}

// 使用 OpenClaw 的默认模型（GLM-4.7）
const MODEL = 'zai/glm-4.7';

try {
  // 调用 OpenAI 兼容的 API
  const result = execSync(
    `curl -s -X POST https://ark.cn-beijing.volces.com/api/v3/chat/completions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer 2073fda9-6860-4979-93a5-6ca8d7ec4c5b" \
    -d '{
      "model": "ep-20260126204826-llkht",
      "messages": [
        {
          "role": "system",
          "content": "你是简洁的 AI 助手，只回答核心内容，不要废话。"
        },
        {
          "role": "user",
          "content": ${JSON.stringify(QUESTION)}
        }
      ],
      "max_tokens": 200,
      "temperature": 0.3
    }'`,
    { encoding: 'utf-8' }
  );

  const response = JSON.parse(result);
  const answer = response.choices?.[0]?.message?.content || '无法解析回答';

  console.log(answer.trim());
} catch (error) {
  console.error('错误:', error.message);
  process.exit(1);
}
