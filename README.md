# MCS-AMHS 后端

> 村田机械 MCS-AMHS 车间设备运行状态与仓储库存预警管理系统 - 后端部分

![Java](https://img.shields.io/badge/Java-17-orange?logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.5-6DB33F?logo=spring)
![MyBatis-Plus](https://img.shields.io/badge/MyBatis--Plus-3.5.1-red)

## 项目简介

本项目是**村田机械 MCS-AMHS 系统**的后端部分，提供 RESTful API 接口，支持设备状态数据和库存预警数据的管理。

基于 [mall-tiny](https://github.com/macrozheng/mall-tiny) 脚手架开发。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| SpringBoot | 2.7.5 | 容器+MVC框架 |
| SpringSecurity | 5.7.4 | 认证和授权框架 |
| MyBatis-Plus | 3.5.1 | ORM框架 |
| MySQL | 8.4 | 数据库 |
| Redis | 5.0 | 分布式缓存 |
| Druid | 1.2.14 | 数据库连接池 |
| JWT | 0.9.1 | Token认证 |
| Swagger-UI | 3.0.0 | API文档 |

## 快速开始

### 环境要求

- JDK 17+
- Maven 3.6+
- MySQL 8.0+
- Redis 5.0+

### 数据库配置

1. 创建数据库 `mall_tiny`
2. 导入 `sql/mall_tiny.sql` 脚本

### 启动服务

```bash
# 编译项目
mvn clean compile

# 运行服务
mvn spring-boot:run
# 或
mvn spring-boot:run -DskipTests
```

访问 http://localhost:8080

### API 文档

启动后访问 Swagger UI：http://localhost:8080/swagger-ui/

## 测试账号

- 用户名: `testuser`
- 密码: `123456`

## API 接口

### 认证接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/admin/login` | POST | 用户登录 |
| `/admin/register` | POST | 用户注册 |
| `/admin/info` | GET | 获取用户信息 |
| `/admin/logout` | POST | 用户登出 |

### 使用示例

**登录**
```bash
curl -X POST http://localhost:8080/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'
```

**响应**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "tokenHead": "Bearer ",
    "token": "eyJhbGciOiJIUzUxMiJ9..."
  }
}
```

## 项目结构

```
src/main/java/com/macro/mall/tiny/
├── common/                 # 通用代码
│   ├── api/               # 统一响应封装
│   ├── config/            # 通用配置
│   ├── domain/            # 通用对象
│   ├── exception/         # 全局异常处理
│   └── service/           # 通用服务
├── config/                # SpringBoot配置
├── modules/               # 业务模块
│   └── ums/               # 权限管理模块
│       ├── controller/    # REST接口
│       ├── dto/           # 数据传输对象
│       ├── mapper/        # 数据库映射
│       ├── model/         # 实体类
│       └── service/       # 业务逻辑
└── security/              # SpringSecurity相关
    ├── annotation/        # 自定义注解
    ├── aspect/            # AOP切面
    ├── component/         # 安全组件
    ├── config/            # 安全配置
    └── util/              # 工具类
```

## 相关项目

- **前端**: [MCS-AMHS Frontend](https://github.com/ztwzzykxj/-MCS-AMHS-/tree/main)

## 实习项目任务书

本项目是为**天津卓信软件开发有限公司**完成的实习任务：

| 任务 | 描述 |
|------|------|
| 任务一 | 工业数据可视化看板开发 |
| 任务二 | RBAC 权限控制模块 |
| 任务三 | AI 智能助手微模块 |
| 任务四 | 自动化回归测试 |

## License

Apache License 2.0
