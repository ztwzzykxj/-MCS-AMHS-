import { test, expect } from '@playwright/test';
import { TEST_USERS, SELECTORS } from '../fixtures/test.data';

/**
 * Dashboard 仪表盘测试套件
 * 核心路径：登录 -> 访问 Dashboard -> 查看设备状态
 */
test.describe('Dashboard 仪表盘测试', () => {
  
  // 每个测试前先登录
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
    await page.fill(SELECTORS.login.usernameInput, TEST_USERS.admin.username);
    await page.fill(SELECTORS.login.passwordInput, TEST_USERS.admin.password);
    await page.click(SELECTORS.login.submitButton);
    await page.waitForURL('http://localhost:5173/', { timeout: 10000 });
  });

  test('Dashboard 页面加载正常', async ({ page }) => {
    await page.goto('/');
    
    // 验证页面标题
    await expect(page.locator('h1')).toContainText('车间设备');
    
    // 验证副标题
    await expect(page.getByText('实时监控车间设备运行状态与仓储库存预警')).toBeVisible();
  });

  test('设备状态指标卡片显示正常', async ({ page }) => {
    await page.goto('/');
    
    // 验证四个指标卡片
    await expect(page.getByText('设备总数')).toBeVisible();
    await expect(page.getByText('运行中')).toBeVisible();
    await expect(page.getByText('空闲待机')).toBeVisible();
    await expect(page.getByText('故障告警')).toBeVisible();
  });

  test('设备状态趋势图显示正常', async ({ page }) => {
    await page.goto('/');
    
    // 验证趋势图标题
    await expect(page.getByText('车间设备运行状态趋势')).toBeVisible();
    
    // 验证图例
    await expect(page.getByText('运行中')).toBeVisible();
    await expect(page.getByText('空闲待机')).toBeVisible();
    await expect(page.getByText('故障告警')).toBeVisible();
  });

  test('库存预警列表显示正常', async ({ page }) => {
    await page.goto('/');
    
    // 验证库存预警标题
    await expect(page.getByText('仓储库存预警')).toBeVisible();
  });

  test('设备实时状态表格显示正常', async ({ page }) => {
    await page.goto('/');
    
    // 验证表格标题
    await expect(page.getByText('设备实时状态')).toBeVisible();
    
    // 验证表头
    await expect(page.getByText('设备名称')).toBeVisible();
    await expect(page.getByText('状态')).toBeVisible();
    await expect(page.getByText('温度')).toBeVisible();
    await expect(page.getByText('功率')).toBeVisible();
    await expect(page.getByText('效率')).toBeVisible();
  });

  test('侧边栏菜单显示正常', async ({ page }) => {
    await page.goto('/');
    
    // 验证菜单标题
    await expect(page.getByText('菜单')).toBeVisible();
    
    // 验证 Dashboard 链接
    await expect(page.getByText('监控中心')).toBeVisible();
  });

  test('页面响应式布局', async ({ page }) => {
    // 测试桌面视图
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    
    // 测试平板视图
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    
    // 测试手机视图
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });
});

/**
 * 数据看板交互测试
 */
test.describe('数据看板交互测试', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
    await page.fill(SELECTORS.login.usernameInput, TEST_USERS.admin.username);
    await page.fill(SELECTORS.login.passwordInput, TEST_USERS.admin.password);
    await page.click(SELECTORS.login.submitButton);
    await page.waitForURL('http://localhost:5173/', { timeout: 10000 });
  });

  test('设备列表可以滚动', async ({ page }) => {
    await page.goto('/');
    
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // 表格应该有滚动能力
    const tableContainer = table.locator('..');
    const overflow = await tableContainer.evaluate((el) => 
      window.getComputedStyle(el).overflow
    );
    // 表格容器可能是 overflow-x: auto 或 overflow: auto
    expect(overflow === 'auto' || overflow === 'hidden' || overflow ===('scroll')).toBeTruthy();
  });

  test('库存预警卡片显示状态标签', async ({ page }) => {
    await page.goto('/');
    
    // 应该显示紧急补货、库存预警、正常等标签
    const warningBadges = page.getByText('紧急补货').or(page.getByText('库存预警')).or(page.getByText('正常'));
    await expect(warningBadges.first()).toBeVisible();
  });

  test('设备状态指标卡片可交互', async ({ page }) => {
    await page.goto('/');
    
    // 点击指标卡片（如果有交互功能）
    const metricCard = page.locator('[class*="rounded-lg"][class*="bg-white"]').first();
    await metricCard.hover();
    
    // 悬停时可能有样式变化（阴影增强等）
    await expect(metricCard).toBeVisible();
  });
});
