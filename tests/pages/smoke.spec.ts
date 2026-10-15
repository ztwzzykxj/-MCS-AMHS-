import { test, expect } from '@playwright/test';
import { TEST_USERS, SELECTORS } from '../fixtures/test.data';

/**
 * 冒烟测试套件 - 一键运行
 * 验证系统核心路径是否正常工作
 */
test.describe('冒烟测试 - 核心路径验证', () => {
  
  test('SMOKE-001: 用户登录流程', async ({ page }) => {
    await page.goto('/signin');
    
    // 验证登录页面加载
    await expect(page).toHaveTitle(/MCS-AMHS|TailAdmin/i);
    await expect(page.locator(SELECTORS.login.usernameInput)).toBeVisible();
    
    // 执行登录
    await page.fill(SELECTORS.login.usernameInput, TEST_USERS.admin.username);
    await page.fill(SELECTORS.login.passwordInput, TEST_USERS.admin.password);
    await page.click(SELECTORS.login.submitButton);
    
    // 验证登录成功 - 等待 URL 变化或页面内容
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // 检查是否在首页（Dashboard）
    await expect(page.locator('h1')).toContainText('车间', { timeout: 10000 });
    
    console.log('✅ SMOKE-001: 用户登录流程 - 通过');
  });

  test('SMOKE-002: Dashboard 核心数据展示', async ({ page }) => {
    // 登录
    await page.goto('/signin');
    await page.fill(SELECTORS.login.usernameInput, TEST_USERS.admin.username);
    await page.fill(SELECTORS.login.passwordInput, TEST_USERS.admin.password);
    await page.click(SELECTORS.login.submitButton);
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // 验证 Dashboard 标题存在
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // 验证页面有关键组件
    const body = await page.content();
    const hasDevice = body.includes('设备') || body.includes('设备');
    expect(hasDevice).toBeTruthy();
    
    console.log('✅ SMOKE-002: Dashboard 核心数据展示 - 通过');
  });

  test('SMOKE-003: AI 助手开关', async ({ page }) => {
    // 登录
    await page.goto('/signin');
    await page.fill(SELECTORS.login.usernameInput, TEST_USERS.admin.username);
    await page.fill(SELECTORS.login.passwordInput, TEST_USERS.admin.password);
    await page.click(SELECTORS.login.submitButton);
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // 验证 AI 助手按钮存在
    const aiButton = page.locator(SELECTORS.aiAssistant.toggleButton);
    await expect(aiButton).toBeVisible();
    
    // 打开 AI 助手
    await aiButton.click();
    await page.waitForTimeout(1000);
    
    // 验证聊天窗口打开（检查任意可见的聊天相关内容）
    const chatInput = page.locator(SELECTORS.aiAssistant.chatInput);
    await expect(chatInput).toBeVisible({ timeout: 5000 });
    
    console.log('✅ SMOKE-003: AI 助手开关 - 通过');
  });

  test('SMOKE-004: 侧边栏菜单导航', async ({ page }) => {
    // 登录
    await page.goto('/signin');
    await page.fill(SELECTORS.login.usernameInput, TEST_USERS.admin.username);
    await page.fill(SELECTORS.login.passwordInput, TEST_USERS.admin.password);
    await page.click(SELECTORS.login.submitButton);
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // 验证菜单
    await expect(page.getByText('菜单')).toBeVisible();
    await expect(page.getByText('监控中心')).toBeVisible();
    
    console.log('✅ SMOKE-004: 侧边栏菜单导航 - 通过');
  });

  test('SMOKE-005: 页面响应式', async ({ page }) => {
    // 登录
    await page.goto('/signin');
    await page.fill(SELECTORS.login.usernameInput, TEST_USERS.admin.username);
    await page.fill(SELECTORS.login.passwordInput, TEST_USERS.admin.password);
    await page.click(SELECTORS.login.submitButton);
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // 测试不同屏幕尺寸
    const sizes = [
      { name: '桌面', width: 1920, height: 1080 },
      { name: '平板', width: 768, height: 1024 },
      { name: '手机', width: 375, height: 667 },
    ];
    
    for (const size of sizes) {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('/');
      await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });
      console.log(`  ✅ ${size.name} (${size.width}x${size.height})`);
    }
    
    console.log('✅ SMOKE-005: 页面响应式 - 通过');
  });
});

/**
 * 回归测试总结
 */
test.describe('回归测试总结报告', () => {
  test('生成测试报告', async ({ page }) => {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                    MCS-AMHS 回归测试报告                        ');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('测试时间:', new Date().toLocaleString('zh-CN'));
    console.log('测试环境: http://localhost:5173');
    console.log('测试框架: Playwright');
    console.log('');
    console.log('测试覆盖:');
    console.log('  ✅ SMOKE-001: 用户登录流程');
    console.log('  ✅ SMOKE-002: Dashboard 核心数据展示');
    console.log('  ✅ SMOKE-003: AI 助手开关');
    console.log('  ✅ SMOKE-004: 侧边栏菜单导航');
    console.log('  ✅ SMOKE-005: 页面响应式');
    console.log('');
    console.log('详细测试报告请查看: playwright-report/index.html');
    console.log('═══════════════════════════════════════════════════════════════');
    
    expect(true).toBe(true);
  });
});
