# WASM 图像处理应用

一个集成了 WebAssembly (WASM) 的 Next.js 应用，提供图像处理功能。

## 功能特性

- 基于 Next.js 14 和 App Router
- 通过 Rust 实现的 WASM 集成
- 完整的 UI 组件库 (shadcn/ui)
- 响应式设计
- 支持深色/浅色主题
- 多种图像处理功能（滤镜、裁剪、压缩等）

## 技术栈

- **前端框架**: Next.js 14
- **编程语言**: TypeScript, Rust
- **样式系统**: Tailwind CSS
- **UI 组件库**: shadcn/ui
- **构建工具**: wasm-pack, pnpm

## 快速开始

### 环境要求

- Node.js (推荐 v18+ 版本)
- pnpm (或 npm/yarn)
- Rust 工具链 (用于 WASM 开发)

### 安装步骤

1. 克隆仓库
2. 安装依赖:

```bash
pnpm install
```

3. 安装 Rust 和 wasm-pack：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install wasm-pack
```

4. 构建 WASM 模块:

```bash
cd wasm
wasm-pack build --target web
```

5. 启动开发服务器:

```bash
pnpm dev
```

## 架构设计

项目采用 C4 模型进行架构设计，文档位于`docs/`目录下：

- `system_context.puml`: 系统上下文图
- `containers.puml`: 容器图
- `components.puml`: 组件图
- `code.puml`: 代码图

## 开发指南

### 前端开发

```bash
# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 代码格式化
pnpm format
```

### WASM 开发

```bash
# 进入WASM目录
cd wasm

# 开发模式构建
wasm-pack build --target web --dev

# 发布模式构建
wasm-pack build --target web --release
```

## 项目结构

```
wasm-image-processor/
├── app/               # Next.js应用路由和页面
├── components/        # 可复用UI组件
├── docs/              # 架构设计文档
├── hooks/             # 自定义React Hooks
├── lib/               # 工具函数和工具类
├── public/            # 静态资源文件
├── styles/            # 全局样式配置
├── wasm/              # WASM模块源码
│   ├── src/           # Rust源代码
│   └── pkg/           # 生成的WASM包
└── tests/             # 测试代码
```

## 贡献指南

1. Fork 项目仓库
2. 创建特性分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -am 'Add some feature'`)
4. 推送到分支 (`git push origin feature/xxx`)
5. 创建 Pull Request

## 可用脚本

- `pnpm dev`: 启动开发服务器
- `pnpm build`: 构建生产版本
- `pnpm start`: 启动生产服务器
- `pnpm lint`: 运行 ESLint 检查
- `pnpm format`: 格式化代码
- `pnpm test`: 运行测试
