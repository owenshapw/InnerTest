# 🚀 Vercel 部署指南

## 快速部署（推荐）

### 方法 1：通过 Vercel Dashboard 部署（最简单）

1. **前往 Vercel 官网**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

3. **配置构建设置**
   
   Vercel 会自动读取 `vercel.json` 配置，但请确认以下设置：
   
   ```
   Framework Preset: Other
   Build Command: pnpm build:client
   Output Directory: dist/client
   Install Command: pnpm install
   ```

4. **部署**
   - 点击 "Deploy" 按钮
   - 等待 2-3 分钟构建完成
   - 获得访问链接：`https://你的项目名.vercel.app`

---

### 方法 2：通过 Vercel CLI 部署

```bash
# 1. 安装 Vercel CLI（全局）
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 在项目根目录执行部署
vercel

# 4. 按提示操作：
# - Set up and deploy? Yes
# - Which scope? 选择你的账号
# - Link to existing project? No
# - What's your project's name? inner-mountain
# - In which directory is your code located? ./
# - 其他选项保持默认

# 5. 生产环境部署
vercel --prod
```

---

## 📋 部署前检查清单

- [x] `vercel.json` 配置文件已创建
- [x] 构建命令：`pnpm build:client`
- [x] 输出目录：`dist/client`
- [x] SPA 路由重写已配置（所有路由指向 index.html）
- [x] 静态资源缓存已优化（1年缓存）

---

## 🔧 配置说明

### vercel.json 配置解析

```json
{
  "buildCommand": "pnpm build:client",  // 只构建前端
  "outputDirectory": "dist/client",     // 输出目录
  "installCommand": "pnpm install",     // 安装依赖
  "rewrites": [                         // SPA 路由支持
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 为什么使用这个配置？

1. **只部署前端**：测评功能完全在浏览器运行，无需后端
2. **SPA 路由支持**：刷新页面不会 404
3. **性能优化**：静态资源（JS/CSS）缓存 1 年

---

## 🌐 自定义域名（可选）

部署成功后，你可以绑定自定义域名：

1. 在 Vercel Dashboard 进入你的项目
2. 点击 "Settings" → "Domains"
3. 添加你的域名（如 `inner-mountain.com`）
4. 按照提示配置 DNS 记录

---

## 🔄 自动部署

配置完成后，每次推送到 GitHub：

- `main` 分支 → 自动部署到生产环境
- 其他分支 → 自动生成预览链接

---

## 📊 构建信息

- **构建时间**：约 1-2 分钟
- **输出大小**：约 500KB-1MB（gzip 后）
- **Node 版本**：22.x（自动检测）
- **包管理器**：pnpm（自动检测）

---

## ⚠️ 常见问题

### Q: 部署后页面空白？
A: 检查浏览器控制台，可能是资源路径问题。确保 `vercel.json` 配置正确。

### Q: 刷新页面出现 404？
A: `rewrites` 配置未生效，确保 `vercel.json` 在项目根目录。

### Q: 构建失败？
A: 检查 Vercel 构建日志，常见原因：
   - Node 版本不兼容（需要 22.x）
   - 依赖安装失败（检查 pnpm-lock.yaml）
   - 类型检查错误（临时可以跳过）

### Q: 需要环境变量吗？
A: 当前项目不需要，所有数据存储在浏览器 localStorage。

---

## 🎉 部署成功后

访问你的链接：`https://你的项目名.vercel.app`

你将看到：
- ✅ Inner Mountain 欢迎页
- ✅ 30 道测评题目
- ✅ 智能评估结果
- ✅ 断点续答功能

---

## 📝 本地测试生产构建

部署前可以本地测试：

```bash
# 1. 构建生产版本
pnpm build:client

# 2. 预览构建结果
npx serve dist/client

# 3. 浏览器访问 http://localhost:3000
```

---

## 🔗 相关链接

- [Vercel 官方文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [项目需求文档](./AGENTS.md)
