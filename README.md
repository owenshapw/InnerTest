# Inner Mountain 内在状态测评 🏔️

一个基于自我觉醒理论的智能心理测评应用，帮助用户识别自己在自我觉醒旅程中所处的境界。

## ✨ 特性

- 🎯 **十大境界体系** - 从"蓦然回首"到"照亮生命"的完整成长路径
- 🧠 **智能评估算法** - 多维度分析用户状态（当前境界、触达境界、断层检测）
- 💾 **断点续答** - 自动保存答题进度，刷新页面不丢失
- 🎨 **禅意设计** - 温暖自然的配色 + 优雅流畅的交互
- 📱 **响应式布局** - 完美适配桌面端和移动端
- ⚡ **纯前端实现** - 无需后端，可部署到任何静态托管平台

## 🚀 快速开始

### 本地开发

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd fullstack-nestjs-apaas

# 2. 安装依赖（需要 Node.js >= 22.0.0）
pnpm install

# 3. 启动开发服务器
pnpm dev

# 4. 浏览器访问
# http://localhost:3000
```

### 生产构建

```bash
# 构建前端静态文件
pnpm build:client

# 预览构建结果
npx serve dist/client
```

## 📦 部署

### 部署到 Vercel（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_GITHUB_REPO_URL)

详细步骤请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

**快速部署**：
1. Fork 本仓库到你的 GitHub
2. 登录 [Vercel](https://vercel.com)
3. 导入项目，自动读取 `vercel.json` 配置
4. 点击部署，2 分钟后获得访问链接

### 其他部署平台

- **Netlify**：拖拽 `dist/client` 文件夹即可
- **GitHub Pages**：推送 `dist/client` 到 `gh-pages` 分支
- **Cloudflare Pages**：连接 GitHub 仓库，设置构建命令

## 🎯 测评流程

```
欢迎页 → 答题页（30题） → 结果页
  ↓         ↓                ↓
 开始     实时保存         智能分析
                           ↓
                 展示境界 + 个性化建议
```

### 十大境界

0. **蓦然回首** - 困境觉醒的起点
1. **本我觉醒** - 认识真实的自己
2. **热望驱动** - 找到内心的渴望
3. **波澜不惊** - 建立情绪稳定性
4. **心无所住** - 超越外在评价
5. **拥抱未知** - 面对不确定性
6. **知行合一** - 价值观与行动统一
7. **上善若水** - 柔性智慧与包容
8. **引领共创** - 影响他人成长
9. **照亮生命** - 成为他人的光

## 🛠️ 技术栈

### 前端
- **框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式**：Tailwind CSS
- **组件库**：shadcn/ui（60+ 组件）
- **路由**：React Router
- **状态管理**：React Hooks + localStorage

### 后端（开发环境）
- **框架**：NestJS（仅用于开发时渲染 HTML）
- **平台**：@lark-apaas/fullstack-nestjs-core

> **注意**：生产部署只需要前端静态文件，无需后端。

## 📂 项目结构

```
fullstack-nestjs-apaas/
├── client/                    # 前端应用
│   └── src/
│       ├── pages/
│       │   └── AssessmentPage/  # 核心测评页面
│       ├── components/        # UI 组件
│       ├── hooks/            # React Hooks
│       └── types/            # 类型定义
├── server/                    # 后端（仅开发环境）
├── vercel.json               # Vercel 部署配置
├── AGENTS.md                 # 详细需求文档
└── DEPLOYMENT.md             # 部署指南
```

## 📊 评估算法

### 评分规则
- 每个境界 3 道题，每题 0-2 分
- 境界满分：6 分
- 总分：0-60 分

### 状态判定
- **未激活** (≤2分)：该境界未触达
- **已觉醒** (3-4分)：正在觉醒但未稳定
- **已稳定** (≥5分)：该境界已稳固站稳

### 4 种用户类型
1. **稳步成长型** - 各层境界连续递进
2. **觉醒未稳型** - 前期高分但未巩固
3. **认知超前型** - 高层有分但中层偏低（存在断层）
4. **未觉察型** - 基础 3 层都较低

## 🎨 设计系统

### 配色方案（暖橙色调）
```css
--primary: hsl(18 75% 55%)      /* 暖橙色 - 主按钮 */
--secondary: hsl(190 35% 85%)   /* 浅蓝色 - 辅助 */
--accent: hsl(38 85% 68%)       /* 明黄色 - 点缀 */
--background: hsl(35 40% 97%)   /* 奶白色 - 背景 */
--foreground: hsl(25 30% 25%)   /* 深棕色 - 文字 */
```

### 视觉特点
- 大圆角设计 (`rounded-2xl`)
- 温暖色调
- 充足留白
- 每个境界独特头像

## 🔒 数据存储

使用浏览器 `localStorage` 存储：
- 用户答案（30 题）
- 答题进度
- 评估结果
- 当前视图状态

> 所有数据仅存储在用户本地，不会上传服务器。

## 📝 开发脚本

```bash
# 开发
pnpm dev              # 启动全栈开发服务器
pnpm dev:client       # 仅启动前端开发服务器
pnpm dev:server       # 仅启动后端服务器

# 构建
pnpm build            # 构建全栈应用
pnpm build:client     # 仅构建前端（用于静态部署）
pnpm build:server     # 仅构建后端

# 代码质量
pnpm lint             # 代码检查
pnpm format           # 代码格式化
pnpm type:check       # 类型检查
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可

MIT License

---

**让我们一起探索内在的山峰 🏔️**