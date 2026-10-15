/**
 * 测试数据 - 公共测试账号和测试数据
 */

export const TEST_USERS = {
  admin: {
    username: 'admin2',
    password: '123456',
    role: '超级管理员',
  },
  operator: {
    username: 'testuser',
    password: '123456',
    role: '车间操作员',
  },
};

export const API_BASE_URL = 'http://localhost:8080';

export const TEST_DATA = {
  // 设备数据
  equipment: {
    validId: 1,
    invalidId: 99999,
    status: ['running', 'idle', 'fault', 'offline'] as const,
  },
  
  // 库存数据
  inventory: {
    validMaterialCode: '轴承 #2025',
    lowStockThreshold: 50,
    criticalStockThreshold: 20,
  },
  
  // AI 助手测试
  aiAssistant: {
    validQueries: [
      '查询设备状态',
      '今天有哪些设备报警',
      '库存预警情况如何',
    ],
    invalidQuery: '', // 空字符串
  },
};

export const SELECTORS = {
  // 登录页面
  login: {
    usernameInput: 'input[placeholder*="username"]',
    passwordInput: 'input[placeholder*="password"]',
    submitButton: 'button:has-text("Sign in"), button[type="submit"]',
    errorMessage: '.text-error-500',
  },
  
  // Dashboard
  dashboard: {
    title: 'h1',
    equipmentMetricsCard: '[class*="rounded-lg"][class*="bg-white"]',
    deviceRunningCount: '[class*="text-3xl"]',
  },
  
  // 侧边栏
  sidebar: {
    menuToggle: 'button[aria-label="Toggle sidebar"]',
    menuItems: 'nav a, nav button',
    dashboardLink: 'a[href="/"]',
    signInLink: 'a[href="/signin"]',
  },
  
  // AI 助手
  aiAssistant: {
    toggleButton: 'button[title="AI 助手"]',
    chatInput: 'input[placeholder*="问题"]',
    sendButton: 'button:has-text("发送")',
    chatWindow: '[class*="fixed"][class*="bottom-24"]',
    message: '[class*="rounded-lg"][class*="px-3"]',
  },
};
