# 豆包生图 API 配置

> 火山引擎 Seedream 4.5 模型

---

## 基本信息

| 项目 | 值 |
|------|------|
| **API Key** | `[REDACTED_KEY]` |
| **端点** | `https://ark.cn-beijing.volces.com/api/v3/images/generations` |
| **模型** | `doubao-seedream-4-5-251128` (Seedream 4.5) |
| **接入点** | `ep-20251205202908-h9vmw` |

---

## 快速调用

### curl 示例

```bash
curl -X POST 'https://ark.cn-beijing.volces.com/api/v3/images/generations' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer [REDACTED_KEY]' \
  -d '{
    "model": "ep-20251205202908-h9vmw",
    "prompt": "一只可爱的橘猫在阳光下打盹，温暖的氛围，高质量摄影",
    "size": "2048x2048",
    "watermark": false
  }'
```

### Python 示例

```python
import requests

url = "https://ark.cn-beijing.volces.com/api/v3/images/generations"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer [REDACTED_KEY]"
}
data = {
    "model": "ep-20251205202908-h9vmw",
    "prompt": "一只可爱的橘猫在阳光下打盹，温暖的氛围，高质量摄影",
    "size": "2048x2048",
    "watermark": False
}

response = requests.post(url, json=data, headers=headers)
result = response.json()
print(result['data'][0]['url'])
```

### Node.js 示例

```javascript
const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer [REDACTED_KEY]'
  },
  body: JSON.stringify({
    model: 'ep-20251205202908-h9vmw',
    prompt: '一只可爱的橘猫在阳光下打盹，温暖的氛围，高质量摄影',
    size: '2048x2048',
    watermark: false
  })
});

const result = await response.json();
console.log(result.data[0].url);
```

---

## 参数说明

### 必需参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `model` | string | 接入点 ID：`ep-20251205202908-h9vmw` |
| `prompt` | string | 图片描述（支持中英文）|

### 可选参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `size` | string | - | 图片尺寸 |
| `watermark` | boolean | `true` | 是否添加水印 |
| `n` | integer | 1 | 生成数量（1-4）|
| `response_format` | string | `url` | 返回格式：`url` 或 `b64_json` |

---

## 尺寸规格

### 推荐尺寸

| 用途 | 尺寸 | 像素数 |
|------|------|--------|
| 正方形 | `2048x2048` | 4,194,304 |
| 4K 横屏 | `4096x2160` | 8,847,360 |
| 4K 竖屏 | `2160x4096` | 8,847,360 |
| 宽屏 | `2560x1440` | 3,686,400 |
| 竖屏 | `1440x2560` | 3,686,400 |

### 限制条件

- **最小像素：** 3,686,400 (约 1920x1920)
- **最大像素：** 16,777,216 (4096x4096)
- **宽高比范围：** [1/16, 16]
- **支持尺寸：** 自定义（满足上述条件即可）

---

## 水印说明

| watermark | 效果 |
|-----------|------|
| `false` | 无水印 |
| `true` | 右下角添加"AI生成"水印 |

---

## 返回格式

### 成功响应

```json
{
  "created": 1709049600,
  "data": [
    {
      "url": "https://xxx.volces.com/xxx.png",
      "revised_prompt": "xxx"
    }
  ]
}
```

### 字段说明

| 字段 | 说明 |
|------|------|
| `url` | 图片下载链接（24 小时有效）|
| `revised_prompt` | 优化后的 prompt（如果模型调整了）|

---

## 常见尺寸调用示例

### 正方形 2K（默认推荐）

```bash
curl -X POST 'https://ark.cn-beijing.volces.com/api/v3/images/generations' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer [REDACTED_KEY]' \
  -d '{
    "model": "ep-20251205202908-h9vmw",
    "prompt": "赛博朋克风格的城市街道，霓虹灯闪烁，雨夜",
    "size": "2048x2048",
    "watermark": false
  }'
```

### 4K 横屏（适合壁纸）

```bash
curl -X POST 'https://ark.cn-beijing.volces.com/api/v3/images/generations' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer [REDACTED_KEY]' \
  -d '{
    "model": "ep-20251205202908-h9vmw",
    "prompt": "壮丽的雪山日出，金色的阳光洒在雪峰上，超高清摄影",
    "size": "4096x2160",
    "watermark": false
  }'
```

### 宽屏（适合展示）

```bash
curl -X POST 'https://ark.cn-beijing.volces.com/api/v3/images/generations' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer [REDACTED_KEY]' \
  -d '{
    "model": "ep-20251205202908-h9vmw",
    "prompt": "现代简约风格的客厅设计，大窗户，自然光",
    "size": "2560x1440",
    "watermark": false
  }'
```

---

## Prompt 优化建议

### 推荐格式

```
[主体] + [场景/环境] + [风格] + [质量描述]
```

### 示例

| 类型 | Prompt |
|------|--------|
| 人物 | `一位优雅的女性，穿着红色晚礼服，站在古典建筑前，电影级光影，8K 超高清` |
| 风景 | `壮丽的雪山日出，金色的阳光洒在雪峰上，云海翻涌，国家地理摄影风格` |
| 动物 | `一只可爱的橘猫在阳光下打盹，温暖的氛围，高质量摄影` |
| 建筑 | `现代极简风格的别墅，落地窗，泳池，蓝天白云，建筑摄影` |
| 抽象 | `流动的色彩，彩虹渐变，梦幻抽象艺术，高对比度` |

### 质量关键词

- `高质量`
- `超高清`
- `8K`
- `专业摄影`
- `电影级`
- `精细细节`

---

## 错误处理

### 常见错误

| 错误码 | 原因 | 解决方法 |
|--------|------|----------|
| 401 | API Key 无效 | 检查 Authorization header |
| 400 | 尺寸不合规 | 确保像素数 >= 3,686,400 |
| 429 | 请求过于频繁 | 降低请求频率 |
| 500 | 服务器错误 | 稍后重试 |

### 错误示例

```json
{
  "error": {
    "message": "Invalid size: minimum pixels is 3686400",
    "type": "invalid_request_error"
  }
}
```

---

## 注意事项

1. **端点选择：** 必须用 `/api/v3/images/generations`，不能用 chat/completions
2. **图片链接：** 24 小时内有效，需及时下载
3. **并发限制：** 注意 API 调用频率
4. **成本：** 按像素计费，4K 比 2K 贵约 2 倍

---

## 快速测试

```bash
# 生成一张测试图片
curl -X POST 'https://ark.cn-beijing.volces.com/api/v3/images/generations' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer [REDACTED_KEY]' \
  -d '{
    "model": "ep-20251205202908-h9vmw",
    "prompt": "一只可爱的橘猫",
    "size": "2048x2048",
    "watermark": false
  }' | jq -r '.data[0].url' | xargs curl -o test.png
```

---

## 其他可用模型

| 接入点 | 模型 | 说明 |
|--------|------|------|
| `ep-20260126204826-llkht` | GLM4.7 | 对话模型 |
| `ep-20260105211457-nccvj` | 豆包1.8 | 对话模型 |
| `ep-20251205202908-h9vmw` | Seedream 4.5 | 生图模型 |
| `ep-m-20251021214205-rnprp` | doubao-seed-1.6 | 视觉模型 |
| `ep-m-20251015115744-2lbkr` | kimi-k2 | 对话模型 |

---

---

## 其他 API Keys 配置

### Windows 环境变量设置

在 PowerShell 中运行：

```powershell
# Brave Search API
[Environment]::SetEnvironmentVariable("BRAVE_API_KEY", "你的密钥", "User")

# Tavily Search API
[Environment]::SetEnvironmentVariable("TAVILY_API_KEY", "tvly-dev-你的密钥", "User")

# Inference.sh API (AI 生图)
[Environment]::SetEnvironmentVariable("INFERENCE_SH_API_KEY", "你的密钥", "User")
```

### WSL/Linux 环境变量设置

在 `~/.bashrc` 或 `~/.zshrc` 中添加：

```bash
# Brave Search API
export BRAVE_API_KEY="你的密钥"

# Tavily Search API
export TAVILY_API_KEY="tvly-dev-你的密钥"

# Inference.sh API (AI 生图)
export INFERENCE_SH_API_KEY="你的密钥"
```

或者添加到 `~/.openclaw/.env`：

```bash
BRAVE_API_KEY=你的密钥
TAVILY_API_KEY=tvly-dev-你的密钥
INFERENCE_SH_API_KEY=你的密钥
```

---

### Tavily Search API

| 项目 | 值 |
|------|------|
| **API Key** | `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` |
| **端点** | `https://api.tavily.com/search` |
| **用途** | AI 优化的搜索 API |

**调用示例：**

```bash
curl -X POST 'https://api.tavily.com/search' \
  -H 'Content-Type: application/json' \
  -d '{
    "api_key": "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",
    "query": "Vue 3 Composition API 教程",
    "search_depth": "basic"
  }'
```

---

### Brave Search API

| 项目 | 说明 |
|------|------|
| **注册地址** | https://brave.com/search/api/ |
| **免费额度** | 2000 次/月 |
| **用途** | 网页搜索 |

**调用示例：**

```bash
curl -X POST 'https://api.search.brave.com/res/v1/web/search' \
  -H 'Accept: application/json' \
  -H 'Accept-Encoding: gzip' \
  -H 'X-Subscription-Token: 你的BRAVE_API_KEY' \
  -d '{
    "q": "OpenClaw AI Agent"
  }'
```

---

### Inference.sh API (AI 生图)

| 项目 | 说明 |
|------|------|
| **注册地址** | https://inference.sh/ |
| **用途** | 多模型 AI 生图 |
| **支持模型** | FLUX、Gemini、Grok、Seedream 等 50+ 模型 |

---

## API Keys 汇总

| API | Key | 用途 |
|-----|-----|------|
| 豆包生图 | `[REDACTED_KEY]` | AI 图片生成 |
| Tavily | `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` | AI 搜索 |
| Brave | 需注册获取 | 网页搜索 |
| Inference.sh | 需注册获取 | AI 生图 |

---

*创建日期：2026-02-27*
*API Key 状态：有效（测试环境）*
