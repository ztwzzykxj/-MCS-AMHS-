# MCS-AMHS 自动化测试套件

> 村田机械 MCS-AMHS 系统 - Playwright 自动化回归测试

## 测试覆盖

### 1. 登录鉴权测试 (`tests/pages/auth.spec.ts`)
- ✅ 页面加载正常
- ✅ 有效账号登录成功
- ✅ 无效账号登录失败
- ✅ 空账号登录验证
- ✅ 登出功能
- ✅ 认证状态测试

### 2. Dashboard 测试 (`tests/pages/dashboard.spec.ts`)
- ✅ Dashboard 页面加载
- ✅ 设备状态指标卡片
- ✅ 设备状态趋势图
- ✅ 库存预警列表
- ✅ 设备实时状态表格
- ✅ 侧边栏菜单
- ✅ 响应式布局

### 3. AI 助手测试 (`tests/components/ai-assistant.spec.ts`)
- ✅ 悬浮按钮可见
- ✅ 打开/关闭聊天窗口
- ✅ 输入框输入
- ✅ 清除对话功能
- ✅ 发送按钮状态
- ✅ 响应式布局

### 4. 冒烟测试 (`tests/pages/smoke.spec.ts`)
- ✅ SMOKE-001: 用户登录流程
- ✅ SMOKE-002: Dashboard 核心数据展示
- ✅ SMOKE-003: AI 助手开关
- ✅ SMOKE-004: 侧边栏菜单导航
- ✅ SMOKE-005: 页面响应式

## 快速开始

### 安装依赖

```bash
npm install
```

### 运行所有测试

```bash
npm test
```

### 运行冒烟测试（一键）

```bash
npm run test:smoke
```

### 运行特定测试

```bash
# 登录测试
npm run test:auth

# Dashboard 测试
npm run test:dashboard

# AI 助手测试
npm run test:ai
```

### 生成测试报告

```bash
npm run test:report
```

### 有头模式运行（可视化）

```bash
npm run test:headed
```

## 测试配置

测试配置文件：`playwright.config.ts`

支持的浏览器：
- Chromium (Desktop)
- Firefox (Desktop)
- WebKit (Desktop)
- Mobile Chrome (Pixel 5)

## 测试报告

测试完成后，报告自动生成在 `playwright-report/` 目录：

```bash
# 查看 HTML 报告
open playwright-report/index.html
```

## CI 集成

### Git Hooks (pre-commit)

在 `.git/hooks/pre-commit` 添加：

```bash
#!/bin/bash
npm run test:smoke
```

### GitHub Actions

在 `.github/workflows/test.yml` 添加：

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - run: npx playwright install chromium
      - run: npm test
```

## 测试数据

测试账号位于 `tests/fixtures/test.data.ts`：

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin2 | 123456 | 超级管理员 |
| testuser | 123456 | 车间操作员 |

## 编写新测试

```typescript
import { test, expect } from '@playwright/test';

test('我的新测试', async ({ page }) => {
  await page.goto('/');
  // 测试代码...
});
```

## 常见问题

### 测试超时
增加超时时间：
```typescript
test('超时测试', async ({ page }) => {
  await page.goto('/', { timeout: 30000 });
});
```

### 元素找不到
使用 `waitForSelector` 等待元素：
```typescript
await page.waitForSelector('#my-element', { state: 'visible' });
```

## License

MIT License
