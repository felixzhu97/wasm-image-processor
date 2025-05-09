# WASM 图像处理应用

一个集成了 WebAssembly (WASM) 的 Next.js 应用，提供图像处理功能。

## 功能特性

- 基于 Next.js 14 和 App Router
- 通过 Rust 实现的 WASM 集成
- 完整的 UI 组件库 (shadcn/ui)
- 响应式设计
- 支持深色/浅色主题

## 技术栈

- Next.js
- TypeScript
- Tailwind CSS
- Rust (用于 WASM 模块)
- shadcn/ui 组件库

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

4. 启动开发服务器:

```bash
pnpm dev
```

## 项目结构

```
wasm-image-processor/
├── app/               # Next.js 应用目录
├── components/        # UI 组件 (shadcn/ui)
├── hooks/             # 自定义 React Hooks
├── lib/               # 工具函数
├── public/            # 静态资源
├── styles/            # 全局样式
└── wasm/              # WASM 模块源码 (Rust)
```

## 可用脚本

- `pnpm dev`: 启动开发服务器
- `pnpm build`: 构建生产版本
- `pnpm start`: 启动生产服务器
- `pnpm lint`: 运行 ESLint 检查
