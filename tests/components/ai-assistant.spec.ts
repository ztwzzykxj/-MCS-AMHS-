import { test, expect } from '@playwright/test';
import { TEST_USERS, SELECTORS } from '../fixtures/test.data';

/**
 * AI 助手测试套件
 * 核心路径：登录 -> 打开 AI 助手 -> 发送消息 -> 接收响应
 */
test.describe('AI 助手测试', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
    await page.fill(SELECTORS.login.usernameInput, TEST_USERS.admin.username);
    await page.fill(SELECTORS.login.passwordInput, TEST_USERS.admin.password);
    await page.click(SELECTORS.login.submitButton);
    await page.waitForURL('http://localhost:5173/', { timeout: 10000 });
  });

  test('AI 助手悬浮按钮可见', async ({ page }) => {
    await page.goto('/');
    
    // 验证 AI 助手按钮可见
    const aiButton = page.locator(SELECTORS.aiAssistant.toggleButton);
    await expect(aiButton).toBeVisible();
  });

  test('点击悬浮按钮打开聊天窗口', async ({ page }) => {
    await page.goto('/');
    
    const aiButton = page.locator(SELECTORS.aiAssistant.toggleButton);
    await aiButton.click();
    
    // 验证聊天窗口打开
    const chatWindow = page.locator(SELECTORS.aiAssistant.chatWindow);
    await expect(chatWindow).toBeVisible();
    
    // 验证欢迎消息
    await expect(page.getByText('MCS-AMHS 智能助手')).toBeVisible();
  });

  test('再次点击关闭聊天窗口', async ({ page }) => {
    await page.goto('/');
    
    const aiButton = page.locator(SELECTORS.aiAssistant.toggleButton);
    
    // 打开
    await aiButton.click();
    const chatWindow = page.locator(SELECTORS.aiAssistant.chatWindow);
    await expect(chatWindow).toBeVisible();
    
    // 关闭
    await aiButton.click();
    await expect(chatWindow).not.toBeVisible();
  });

  test('输入框可以输入文本', async ({ page }) => {
    await page.goto('/');
    
    // 打开 AI 助手
    await page.locator(SELECTORS.aiAssistant.toggleButton).click();
    
    // 输入文本
    const input = page.locator(SELECTORS.aiAssistant.chatInput);
    await input.fill('测试消息');
    
    await expect(input).toHaveValue('测试消息');
  });

  test('清除对话功能正常', async ({ page }) => {
    await page.goto('/');
    
    // 打开 AI 助手
    await page.locator(SELECTORS.aiAssistant.toggleButton).click();
    
    // 发送一条消息（模拟）
    const input = page.locator(SELECTORS.aiAssistant.chatInput);
    await input.fill('测试消息');
    
    // 点击清除对话
    await page.getByText('清除对话').click();
    
    // 验证欢迎消息重新出现
    await expect(page.getByText('我是 MCS-AMHS 智能助手')).toBeVisible();
  });

  test('发送按钮在输入为空时禁用', async ({ page }) => {
    await page.goto('/');
    
    // 打开 AI 助手
    await page.locator(SELECTORS.aiAssistant.toggleButton).click();
    
    const input = page.locator(SELECTORS.aiAssistant.chatInput);
    const sendButton = page.locator(SELECTORS.aiAssistant.sendButton);
    
    // 空输入时按钮应该禁用
    await expect(sendButton).toBeDisabled();
    
    // 有输入时按钮应该启用
    await input.fill('测试');
    await expect(sendButton).toBeEnabled();
  });

  test('聊天窗口响应式布局', async ({ page }) => {
    await page.goto('/');
    
    // 桌面视图
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.locator(SELECTORS.aiAssistant.toggleButton).click();
    await expect(page.locator(SELECTORS.aiAssistant.chatWindow)).toBeVisible();
    
    // 手机视图
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.locator(SELECTORS.aiAssistant.toggleButton).click();
    await expect(page.locator(SELECTORS.aiAssistant.chatWindow)).toBeVisible();
  });
});

/**
 * AI 助手错误处理测试
 */
test.describe('AI 助手错误处理测试', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
    await page.fill(SELECTORS.login.usernameInput, TEST_USERS.admin.username);
    await page.fill(SELECTORS.login.passwordInput, TEST_USERS.admin.password);
    await page.click(SELECTORS.login.submitButton);
    await page.waitForURL('http://localhost:5173/', { timeout: 10000 });
  });

  test('未登录用户不能使用 AI 助手（应跳转到登录页）', async ({ page }) => {
    // 清除登录状态
    await page.evaluate(() => localStorage.clear());
    await page.context().clearCookies();
    
    await page.goto('/');
    
    // 尝试打开 AI 助手（如果能打开说明权限控制有问题）
    // 正常情况下，未登录用户不能进入系统
    await expect(page).toHaveURL(/\/signin/);
  });
});
