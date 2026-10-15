import { test, expect } from '@playwright/test';
import { TEST_USERS, SELECTORS } from '../fixtures/test.data';

/**
 * 登录鉴权测试套件
 * 核心路径：用户登录 -> 获取 Token -> 访问受保护资源
 */
test.describe('登录鉴权测试', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
  });

  test('页面加载正常', async ({ page }) => {
    await expect(page).toHaveTitle(/MCS-AMHS/i);
    await expect(page.locator(SELECTORS.login.usernameInput)).toBeVisible();
    await expect(page.locator(SELECTORS.login.passwordInput)).toBeVisible();
  });

  test('使用有效账号登录成功', async ({ page }) => {
    await page.fill(SELECTORS.login.usernameInput, TEST_USERS.admin.username);
    await page.fill(SELECTORS.login.passwordInput, TEST_USERS.admin.password);
    await page.click(SELECTORS.login.submitButton);
    
    // 等待登录成功，跳转到首页
    await page.waitForURL('http://localhost:5173/', { timeout: 10000 });
    
    // 验证登录后页面
    await expect(page.locator('h1')).toContainText('车间设备');
  });

  test('使用无效账号登录失败', async ({ page }) => {
    await page.fill(SELECTORS.login.usernameInput, 'invaliduser');
    await page.fill(SELECTORS.login.passwordInput, 'wrongpassword');
    await page.click(SELECTORS.login.submitButton);
    
    // 等待错误提示出现
    await expect(page.locator(SELECTORS.login.errorMessage)).toBeVisible({ timeout: 5000 });
  });

  test('空账号登录失败', async ({ page }) => {
    await page.click(SELECTORS.login.submitButton);
    
    // HTML5 原生验证应该阻止提交
    const usernameInput = page.locator(SELECTORS.login.usernameInput);
    await expect(usernameInput).toHaveAttribute('required');
  });

  test('登出功能正常', async ({ page }) => {
    // 先登录
    await page.fill(SELECTORS.login.usernameInput, TEST_USERS.admin.username);
    await page.fill(SELECTORS.login.passwordInput, TEST_USERS.admin.password);
    await page.click(SELECTORS.login.submitButton);
    await page.waitForURL('http://localhost:5173/', { timeout: 10000 });
    
    // 查找并点击登出按钮（如果有的话）
    const logoutButton = page.locator('button:has-text("登出"), button:has-text("Logout"), button:has-text("Sign Out")');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      // 验证跳转到登录页
      await expect(page).toHaveURL(/\/signin/);
    }
  });
});

/**
 * 认证状态测试
 */
test.describe('认证状态测试', () => {
  
  test('未登录用户访问首页被重定向到登录页', async ({ page }) => {
    // 清除所有存储
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    
    await page.goto('/');
    
    // 应该重定向到登录页
    await expect(page).toHaveURL(/\/signin/);
  });

  test('已登录用户可以访问首页', async ({ page }) => {
    // 先登录
    await page.goto('/signin');
    await page.fill(SELECTORS.login.usernameInput, TEST_USERS.admin.username);
    await page.fill(SELECTORS.login.passwordInput, TEST_USERS.admin.password);
    await page.click(SELECTORS.login.submitButton);
    await page.waitForURL('http://localhost:5173/', { timeout: 10000 });
    
    // 直接访问首页应该可以正常显示
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });
});
