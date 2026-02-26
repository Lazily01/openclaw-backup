// Midscene.js 配置文件
// 使用豆包视觉模型进行测试

module.exports = {
  // 模型配置
  model: {
    provider: 'doubao',
    model: 'doubao-seed-1.6-vision',
    apiKey: process.env.DOUBAO_API_KEY,
    endpoint: 'https://ark.cn-beijing.volces.com/api/v3',
  },

  // 缓存配置（提升测试速度）
  cache: {
    enabled: true,
    ttl: 3600, // 1 小时
  },

  // 报告配置
  report: {
    enabled: true,
    outputDir: './test-reports',
  },

  // 超时配置
  timeout: {
    action: 30000, // 单个操作超时 30 秒
    page: 60000, // 页面加载超时 60 秒
  },

  // 调试配置
  debug: {
    screenshots: true, // 保存截图
    logs: true, // 输出日志
  },
};
