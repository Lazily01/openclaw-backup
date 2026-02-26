// Web 测试模板
// 使用 Midscene.js + Playwright 进行视觉驱动测试

import { test, expect } from '@playwright/test';
import { PlaywrightAiFixture } from '@midscene/web/playwright';

// 配置测试
test.describe('Web 自动化测试', () => {
  test('示例：登录功能测试', async ({ page }) => {
    // 1. 打开登录页面
    await page.goto('https://example.com/login');

    // 2. 使用自然语言执行操作
    await page.aiAct('输入用户名 "testuser" 和密码 "password123"，点击登录按钮');

    // 3. 等待页面跳转
    await page.aiWaitFor('页面加载完成');

    // 4. 断言验证
    await page.aiAssert('页面显示欢迎信息');
    await page.aiAssert('页面标题包含"首页"');

    // 5. 提取数据验证
    const userName = await page.aiQuery('string, 当前登录用户的名称');
    expect(userName).toContain('testuser');
  });

  test('示例：表单填写测试', async ({ page }) => {
    await page.goto('https://example.com/form');

    // 填写表单
    await page.aiType('姓名输入框', '张三');
    await page.aiType('邮箱输入框', 'zhangsan@example.com');
    await page.aiSelect('城市下拉框', '北京');
    await page.aiTap('提交按钮');

    // 验证提交成功
    await page.aiAssert('显示提交成功提示');
  });

  test('示例：列表操作测试', async ({ page }) => {
    await page.goto('https://example.com/list');

    // 提取列表数据
    const items = await page.aiQuery('string[], 列表中的所有项目名称');
    console.log('列表项:', items);

    // 点击第一个项目
    await page.aiTap('列表中的第一个项目');

    // 验证详情页
    await page.aiAssert('显示项目详情页');
  });
});
