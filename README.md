# MCS-AMHS 前端

> 村田机械 MCS-AMHS 车间设备运行状态与仓储库存预警管理系统 - 前端部分

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?logo=tailwindcss)

## 项目简介

本项目是**村田机械 MCS-AMHS 系统**的前端部分，用于展示车间设备运行状态监控和仓储库存预警功能。

基于 [TailAdmin](https://github.com/TailAdmin/free-react-tailwind-admin-dashboard) 免费模板开发。

## 功能特性

- 📊 **设备状态看板** - 实时展示设备总数、运行中、空闲、故障等状态
- 📈 **设备运行趋势图** - Canvas 绘制的 24 小时设备状态变化曲线
- ⚠️ **仓储库存预警** - 显示库存不足的物料及紧急程度
- 📋 **设备实时状态表** - 设备详细信息列表（温度、功率、效率等）
- 🔐 **用户认证** - 对接后端 API 实现登录功能
- 🌐 **国际化支持** - 中文界面

## 技术栈

- **框架**: React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS v4
- **构建工具**: Vite
- **路由**: React Router
- **国际化**: i18next
- **图表**: Canvas 自定义绘制

## 快速开始

### 环境要求

- Node.js 20.x 或更高版本
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

## 测试账号

- 用户名: `testuser`
- 密码: `123456`

## 项目结构

```
src/
├── components/
│   └── ecommerce/          # 设备看板相关组件
│       ├── EquipmentList.tsx
│       ├── EquipmentMetrics.tsx
│       ├── EquipmentStatusChart.tsx
│       └── InventoryWarning.tsx
├── pages/
│   └── Dashboard/
│       └── Ecommerce.tsx   # 监控中心主页面
├── services/
│   └── api.ts              # API 服务层
├── types/
│   └── api.ts              # API 类型定义
├── layout/                 # 布局组件
├── locales/                # 国际化语言包
└── icons/                  # SVG 图标
```

## 相关项目

- **后端**: [MCS-AMHS Backend](https://github.com/ztwzzykxj/-MCS-AMHS-/tree/backend)

## 实习项目任务书

本项目是为**天津卓信软件开发有限公司**完成的实习任务：

| 任务 | 描述 |
|------|------|
| 任务一 | 工业数据可视化看板开发 |
| 任务二 | RBAC 权限控制模块 |
| 任务三 | AI 智能助手微模块 |
| 任务四 | 自动化回归测试 |

## License

MIT License
