// 快速测试脚本
// 用于快速验证 Midscene.js 是否正常工作

const { chromium } = require('playwright');
const { WebAgent } = require('@midscene/web');

async function quickTest() {
  console.log('🧪 开始快速测试...');

  // 启动浏览器
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // 1. 打开测试页面
    console.log('📍 打开测试页面...');
    await page.goto('https://example.com');

    // 2. 使用 AI 提取页面信息
    console.log('🤖 使用 AI 分析页面...');
    const pageTitle = await page.aiQuery('string, 页面标题');
    console.log('✅ 页面标题:', pageTitle);

    // 3. 断言验证
    await page.aiAssert('页面包含 "Example Domain" 文字');
    console.log('✅ 断言通过');

    // 4. 截图
    await page.screenshot({ path: './test-reports/quick-test.png' });
    console.log('📸 截图已保存');

    console.log('✅ 测试完成！');
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// 运行测试
quickTest().catch(console.error);
