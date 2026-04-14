# Inner Mountain 内在状态测评 - 需求拆解文档

## 产品概述

- **产品类型**: 互动测评工具 / 心理测评应用
- **场景类型**: <scene_type>prototype-app</scene_type>
- **目标用户**: 寻求自我觉醒、个人成长的人群，对内在探索感兴趣的用户
- **核心价值**: 通过30道题目帮助用户识别自我觉醒旅程中所处的境界，提供个性化解读和成长建议
- **界面语言**: 中文
- **主题偏好**: user_specified（自然禅意风格，配色已指定）
- **导航模式**: 无导航（单页应用状态切换，通过按钮控制页面流转）

---

## 页面结构总览

**页面文件**: `AssessmentPage.tsx`（单页应用，通过状态管理切换视图）

| 页面/视图名称 | 文件名 | 路由/状态 | 页面类型 | 入口来源 |
|---------|-------|------|---------|---------|
| 欢迎页（IntroView） | `AssessmentPage.tsx` | `view: 'intro'` | 主视图 | 初始加载 |
| 答题页（QuestionView） | `AssessmentPage.tsx` | `view: 'question'` | 主视图 | 欢迎页 → 点击「开始测试」 |
| 结果页（ResultView） | `AssessmentPage.tsx` | `view: 'result'` | 主视图 | 答题页 → 完成30题后自动跳转 |

> **说明**：本应用为单页应用（SPA）风格，通过 React 状态管理（`currentView`）切换三个视图，无需路由跳转

---

## 功能列表

### 视图区块: 欢迎页（IntroView）
- **页面目标**: 介绍测评目的，建立信任感，引导用户开始测试
- **功能点**:
  - **标题展示**: 显示主标题「Inner Mountain 内在状态测评」、副标题「内心的山峰 · 自我觉醒之旅」
  - **简介文本**: 展示测评说明文字，解释测评基于 Inner Mountain 理论体系
  - **开始测试按钮**: 点击后切换到答题页，初始化答题状态
  - **视觉氛围**: 融入山峰/内在探索的视觉元素，营造禅意自然氛围

### 视图区块: 答题页（QuestionView）
- **页面目标**: 引导用户完成30道测评题目，记录答案并计算得分
- **功能点**:
  - **题目展示**: 当前题目序号 + 题目文本（共30题）
  - **选项选择**: 三个选项按钮「是」（1分）、「不确定」（0.5分）、「否」（0分）
  - **实时进度**: 显示当前答题进度（如 5/30），进度条可视化
  - **导航控制**: 
    - 「上一题」按钮（非第一题时显示，可修改已答题目）
    - 「下一题」按钮或自动进入下一题（当前题目选择后）
  - **完成判定**: 第30题选择后自动计算总分并切换到结果页
  - **答题状态记忆**: 已回答的题目可返回修改，答案实时保存到全局状态

### 视图区块: 结果页（ResultView）
- **页面目标**: 根据总分展示对应的觉醒境界，提供个性化解读和成长建议
- **功能点**:
  - **境界判定**: 根据总分（0-30分）匹配对应的10个境界之一
  - **境界展示**: 
    - 境界名称（如「迷雾觉察者」、「传光大宗师」等）
    - 境界描述（详细解读当前状态）
    - 特征列表（3个关键特征）
    - 个性化建议（针对该境界的成长建议）
  - **得分展示**: 显示总得分（如 24.5/30）
  - **重新测试**: 「重新测试」按钮，点击后清空答案，返回欢迎页

---

## 数据共享配置

| 存储键名 | 数据说明 | 使用视图 |
|---------|---------|---------|
| `__global_inner_mountain_answers` | 用户答案数组，类型为 `IAnswer[]`，长度30，存储每题的选项值 | 答题页、结果页 |
| `__global_inner_mountain_current_question` | 当前题号，类型为 `number`（0-29） | 答题页 |
| `__global_inner_mountain_total_score` | 总得分，类型为 `number`（0-30），完成所有题目后计算 | 结果页 |
| `__global_inner_mountain_current_view` | 当前视图状态，类型为 `'intro' \| 'question' \| 'result'` | 所有视图 |

```ts
// 答案选项类型
interface IAnswer {
  questionIndex: number;  // 题目索引 0-29
  optionValue: 'yes' | 'uncertain' | 'no';  // 选项值
  score: number;  // 对应分数 1 | 0.5 | 0
}

// 境界定义类型
interface ILevel {
  name: string;  // 境界名称
  range: [number, number];  // 分数范围 [min, max]
  description: string;  // 境界描述
  characteristics: string[];  // 特征列表
  suggestion: string;  // 建议
}

// 题目数据类型
interface IQuestionData {
  title: string;
  subtitle: string;
  intro: string;
  questions: string[];  // 30道题目
  options: {
    value: 'yes' | 'uncertain' | 'no';
    label: string;
    score: number;
  }[];
  levels: ILevel[];
  design: {
    theme: string;
    colors: {
      primary: string;    // #2D5A4A
      secondary: string;  // #8B9A82
      accent: string;     // #D4A574
      background: string; // #F5F2ED
      text: string;       // #333333
    };
  };
}
```

---

## 设计规范

### 配色方案（用户指定）
| 颜色用途 | 色值 | 说明 |
|---------|-----|------|
| 主色（Primary） | `#2D5A4A` | 深绿，用于主要按钮、标题强调 |
| 副色（Secondary） | `#8B9A82` | 灰绿，用于次级元素、边框 |
| 点缀色（Accent） | `#D4A574` | 暖棕，用于高亮、重点标记 |
| 背景色（Background） | `#F5F2ED` | 米白/暖灰，页面背景 |
| 文字色（Text） | `#333333` | 深灰，正文文字 |

### 视觉风格
- **主题**: 自然禅意
- **风格关键词**: 简约、禅意、温暖、自然、内在探索
- **视觉元素**: 融入山峰、自然纹理、留白、柔和阴影
- **字体**: 清晰易读，标题可有书法/手写感（可选）
- **动效**: 柔和过渡，呼吸感，避免急促动画

### 布局原则
- 居中单列布局，最大宽度限制（如 680px）
- 充足留白，营造宁静氛围
- 卡片式题目展示，清晰分隔
- 进度指示器简洁明了

-------

# UI 设计指南 - Inner Mountain 内在状态测评

> **场景类型**: <scene_type>prototype-app</scene_type>（单页互动测评应用）
> **确认检查**: 本指南适用于 SPA 风格的互动测评工具，通过状态切换实现单页内视图流转。

## 1. Design Archetype (设计原型)

### 1.1 内容理解
- **目标用户**: 寻求自我觉醒、个人成长的都市人群，对 mindfulness 和内在探索感兴趣，期望在繁忙生活中寻找内心平静
- **核心目的**: 通过 30 道测评题帮助用户识别自我觉醒旅程中的境界，提供个性化解读和成长建议
- **期望情绪**: 宁静、温暖、被接纳、有仪式感的探索感
- **需避免的感受**: 焦虑、功利、心理测试的"被评判感"、过度商业化

### 1.2 设计语言
- **Aesthetic Direction**: 现代东方禅意美学 —— 结合日式侘寂的留白与中式山水的意境，营造"向内行走"的沉浸感
- **Visual Signature**: 
  1. 米白纸张质感背景，如同手账内页
  2. 深绿主色象征山林与生命力，暖棕点缀如大地与阳光
  3. 山峰轮廓作为视觉锚点，以极简线条呈现
  4. 充足留白（spacious）营造呼吸感
  5. 柔和圆角与轻微阴影，消除锐利感
- **Emotional Tone**: 温暖接纳 + 宁静专注 —— 如置身于山林间的小径，每一步都被支持，没有对错只有觉察
- **Design Style**: Warm Natural 自然暖调 + Soft Blocks 柔色块 —— 大地色系建立信任感，柔和层次创造深度，契合"内在山峰"的隐喻

## 2. Design Principles (设计理念)
1. **留白即呼吸**: 每个视图都应有 40% 以上的留白，信息密度刻意降低，给用户"内在空间"的隐喻体验
2. **温和引导**: 不使用红色警示或强烈对比，所有交互反馈都使用柔和的色温变化（深绿→浅绿、暖棕→浅棕）
3. **仪式感构建**: 通过字体对比（衬线标题+无衬线正文）和居中对齐，建立类似"阅读一封手写信"的仪式感
4. **去评判化**: 结果页避免使用"等级"暗示，而是用"境界"和"旅程阶段"的隐喻，强调每个阶段都有其价值
5. **自然韵律**: 动效采用缓出曲线（ease-out），时长 400-600ms，模仿自然界的运动（落叶、水流）

## 3. Color System (色彩系统)

**配色设计理由**: 基于用户指定的自然禅意色值，构建温暖、低对比、有机的配色系统。深绿象征山林与成长，暖棕象征大地与收获，米白背景如同宣纸，营造手作温度感。

### 3.1 主题颜色

> **App 场景约束**：`primary`（深绿）与 `accent`（暖棕）色相差 130°，明度差 38%，饱和度差 15%，形成"山林-大地"的自然层次，视觉权重分明。

| 角色 | CSS 变量 | Tailwind Class | HSL 值 | 设计说明 |
|-----|---------|----------------|--------|---------|
| bg | `--background` | `bg-background` | `hsl(40 20% 95%)` | 米白/暖灰，如宣纸质感，页面背景 |
| surface | `--card` | `bg-card` | `hsl(0 0% 100%)` | 纯白卡片，用于题目容器和结果展示 |
| text | `--foreground` | `text-foreground` | `hsl(0 0% 20%)` | 深灰，确保可读性，避免纯黑的锐利感 |
| textMuted | `--muted-foreground` | `text-muted-foreground` | `hsl(40 10% 50%)` | 次要文字，如进度提示、标签 |
| primary | `--primary` | `bg-primary` | `hsl(160 35% 26%)` | 深绿，主按钮、选中状态、标题强调，象征山林 |
| primary-foreground | `--primary-foreground` | `text-primary-foreground` | `hsl(40 20% 95%)` | 主色上的文字，米白色 |
| accent | `--accent` | `bg-accent` | `hsl(30 50% 64%)` | 暖棕，进度条、高亮、装饰元素，象征大地与阳光 |
| accent-foreground | `--accent-foreground` | `text-accent-foreground` | `hsl(0 0% 20%)` | 点缀色上的文字，深灰 |
| muted | `--muted` | `bg-muted` | `hsl(40 15% 90%)` | 浅灰棕，用于 hover 背景、未选中状态 |
| border | `--border` | `border-border` | `hsl(40 15% 85%)` | 边框色，温暖的中性灰 |

### 3.2 语义颜色（测评专用）

> 用于结果页的 10 个境界可视化，从浅到深表示进阶

| 境界阶段 | 背景色 | 文字色 | 说明 |
|---------|-------|-------|------|
| 早期阶段 (0-9分) | `hsl(40 30% 92%)` | `hsl(160 35% 26%)` | 迷雾期，浅暖背景 |
| 中期阶段 (9.5-18分) | `hsl(160 20% 90%)` | `hsl(160 35% 26%)` | 觉醒期，浅绿背景 |
| 后期阶段 (18.5-27分) | `hsl(160 30% 85%)` | `hsl(160 40% 20%)` | 行远期，深绿背景 |
| 圆满阶段 (27.5-30分) | `hsl(30 40% 85%)` | `hsl(30 50% 40%)` | 传光期，暖金背景 |

## 4. Typography (字体排版)

- **Heading**: `'Noto Serif SC', 'Songti SC', 'STSong', serif`  
  *选择理由*: 衬线体带来书卷气与仪式感，契合"内在探索"的文学性与深度，如同阅读一本关于心灵成长的书籍
  
- **Body**: `'Inter', 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif`  
  *选择理由*: 现代无衬线确保长文本（30道题）的可读性，与衬线标题形成优雅对比

- **字体导入**: 
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
  ```

**字号层级**（针对中文优化）:

| 层级 | 字体 | 样式 | 用途 |
|-----|------|-----|------|
| 主标题 | Noto Serif SC | `text-3xl md:text-4xl font-bold tracking-tight` | 欢迎页标题"Inner Mountain" |
| 副标题 | Noto Serif SC | `text-xl md:text-2xl font-semibold` | 境界名称（结果页） |
| 题目文本 | Inter | `text-lg md:text-xl font-normal leading-relaxed` | 30道测评题目 |
| 正文 | Inter | `text-base font-normal leading-relaxed` | 描述、建议文字 |
| 标签 | Inter | `text-sm font-medium` | 进度、按钮标签 |
| 小字 | Inter | `text-xs font-normal` | 辅助说明 |

## 5. Global Layout Structure (全局布局结构)

### 5.1 Navigation Strategy (导航策略)
- **导航类型**: `None`（无传统导航）
- **说明**: 单页应用（SPA）通过 React 状态管理切换三个视图（Intro/Question/Result），使用按钮控制流转，营造沉浸式"测评旅程"体验，无顶部导航栏或侧边栏干扰

### 5.2 Page Content Zones (页面区块配置)

**Standard Content Zone（全页面统一）**:
- **Maximum Width**: `max-w-2xl`（约 672px）
  *理由*: 测评内容需要聚焦阅读，过宽会导致视线移动疲劳；单栏布局强化"一对一对话"的私密感
- **Padding**: `px-6 md:px-8 py-12 md:py-16`
- **Alignment**: `mx-auto` 居中
- **Vertical Spacing**: `space-y-8`（区块间距保持 32px 倍数）

**宽内容溢出策略**: 不适用（内容天然适配窄容器）

## 6. Visual Effects & Motion (视觉效果与动效)

- **装饰手法**: 
  - 背景：极淡的山峰轮廓 SVG（透明度 3-5%），位于页面右下角，固定定位不随滚动移动
  - 纸张质感：背景添加细微噪点纹理（CSS `noise` pattern 或 SVG filter），opacity 0.03
  
- **圆角**: 
  - 主容器: `rounded-2xl` (16px)
  - 按钮: `rounded-full` (pill 形状) 或 `rounded-xl` (12px)
  - 卡片: `rounded-xl` (12px)
  - 输入/选项: `rounded-lg` (8px)

- **阴影**: 
  - 卡片: `shadow-sm`（极浅，0 1px 2px 0 rgb(0 0 0 / 0.05)）
  - 悬浮状态: `shadow-md`（柔和上浮感）
  - *原则*: 阴影色温偏暖（使用棕色调的阴影而非纯黑）

- **复杂背景文字处理**: 不适用（无复杂背景图，纯色米白背景）

- **缓动函数**: 
  - 标准: `cubic-bezier(0.4, 0, 0.2, 1)`（ease-out 感觉）
  - 柔和: `cubic-bezier(0.22, 1, 0.36, 1)`（类似自然下落）

- **关键动效**:
  1. **视图切换**: 淡入 + 轻微上移（`opacity: 0→1`, `translateY: 10px→0`），时长 500ms，营造"页面呼吸"感
  2. **选项选择**: 选中时背景色从 `muted` 过渡到 `primary`，scale 轻微放大（1.02），时长 200ms
  3. **进度条**: 宽度变化使用 `transition-all duration-700 ease-out`，模仿植物生长
  4. **结果页入场**: 境界名称文字逐字淡入（stagger 50ms），营造揭晓仪式感

## 7. Components (组件指南)

### Buttons

**Primary Button（开始测试、重新测试）**
- 背景: `bg-primary`（深绿）
- 文字: `text-primary-foreground`（米白），`font-medium`
- 内边距: `px-8 py-3`（充足点击区域）
- 圆角: `rounded-full`（胶囊形状，温和无棱角）
- Hover: `bg-primary/90` + `shadow-md` + `translateY: -1px`（轻微上浮）
- Active: `scale-[0.98]`（按压感）

**Secondary/Ghost Button（上一题）**
- 背景: 透明
- 文字: `text-muted-foreground`，`font-medium`
- Hover: `bg-muted`（浅灰棕背景）
- 圆角: `rounded-lg`

**Option Button（答题选项 - 是/不确定/否）**
- 默认: `bg-surface border border-border text-foreground`
- Hover: `bg-muted border-primary/30`
- 选中: `bg-primary border-primary text-primary-foreground shadow-sm`
- 圆角: `rounded-xl`（较大圆角，友好感）
- 内边距: `p-4`（充足触控区域）
- 布局: 全宽按钮，文字居中

### Cards

**Question Card（题目容器）**
- 背景: `bg-surface`
- 边框: `border border-border`（极细，1px）
- 圆角: `rounded-2xl`
- 内边距: `p-6 md:p-8`
- 阴影: `shadow-sm`

**Result Card（结果展示）**
- 背景: 根据境界阶段使用对应语义背景色（见 3.2）
- 边框: 无（使用背景色区分）
- 圆角: `rounded-2xl`
- 内边距: `p-8 md:p-10`
- 顶部装饰: 3px 的 `accent` 色条（`border-t-4 border-accent`）

### Progress Indicator

**Progress Bar（进度条）**
- 背景轨道: `bg-muted`，高度 `h-2`，圆角 `rounded-full`
- 填充色: `bg-accent`（暖棕，与深绿形成互补）
- 过渡: `transition-all duration-700`
- 文字提示: `text-muted-foreground text-sm`，格式如 "第 5 题 / 共 30 题"

### Tags/Labels

**Characteristic Tag（特征标签）**
- 背景: `bg-primary/10`（深绿 10% 透明度）
- 文字: `text-primary`，`text-sm font-medium`
- 圆角: `rounded-full`
- 内边距: `px-3 py-1`

## 8. View-Specific Guidelines (视图专属规范)

### Welcome View（欢迎页）
- 结构: 垂直居中，内容紧凑在上半部分
- 标题: `text-4xl font-bold text-primary text-center`，Noto Serif SC
- 副标题: `text-xl text-muted-foreground text-center mt-2`
- 简介: `text-base text-foreground/80 text-center max-w-md mx-auto mt-6 leading-relaxed`
- 按钮: 主按钮，居中，下方留足 `mt-12`
- 装饰: 标题上方可有极简山峰图标（SVG，深绿色）

### Question View（答题页）
- 结构: 顶部进度条（固定宽度容器内），中间题目卡片，底部选项区
- 题目序号: `text-sm text-muted-foreground mb-2`，如 "Question 05"
- 题目文本: `text-xl text-foreground font-normal leading-relaxed mb-8`，Inter 字体
- 选项区: 三个选项垂直排列，`space-y-3`
- 导航: 底部 flex 布局，左侧"上一题"（如不是第一题），右侧留空或显示"下一题"（如已选答案）
- 完成: 第 30 题选择后自动跳转，无需点击下一题

### Result View（结果页）
- 结构: 境界卡片居中，内部分层展示
- 得分: `text-sm text-muted-foreground text-center mb-4`，如 "你的得分：24.5 / 30"
- 境界名称: `text-3xl font-bold text-primary text-center`，Noto Serif SC
- 境界描述: `text-base text-foreground/90 leading-relaxed mt-6 text-center`
- 特征区: 水平 flex wrap，居中，`gap-2 mt-6`，使用 Characteristic Tag
- 建议区: 引用块样式，左侧 4px `accent` 色边框，背景 `bg-accent/5`，`p-4 rounded-r-lg mt-8`
- 重新测试按钮: 居中，`mt-10`

## 9. Flexibility Note (灵活性说明)

> **一致性优先原则**：本应用为单页应用，所有视图共享相同的核心参数（最大宽度、圆角、阴影、配色）。
>
> **允许的微调范围**（code agent 可自行判断）：
> - 响应式断点适配：移动端内边距可适当减小（`px-4`），字号略微缩小（`text-lg` 代替 `text-xl`）
> - 题目卡片内的间距可根据题目长度微调（保持 8px 倍数）
> - 结果页的境界卡片背景色可根据具体分数在定义的语义色范围内微调透明度
>
> **禁止的随意变更**：
> - ❌ 不同视图使用不同的最大宽度或对齐方式
> - ❌ 改变配色方案（必须使用指定的深绿/暖棕/米白）
> - ❌ 添加 Sidebar 或 Topbar 导航
> - ❌ 使用高饱和度或霓虹色系
> - ❌ 结果页使用"等级"或"评分"的负面隐喻文案

## 10. Signature & Constraints (设计签名与禁区)

### DO (视觉签名)
1. **纸张质感背景**: 米白背景 `bg-[hsl(40_20%_95%)]` 配合细微噪点纹理
2. **衬线标题**: 使用 Noto Serif SC 展示"Inner Mountain"和境界名称，建立文学感
3. **胶囊按钮**: 主按钮使用 `rounded-full`，消除锐利边角
4. **暖色进度**: 进度条必须使用暖棕色 `bg-accent`，与深绿主色形成温暖对比
5. **山峰装饰**: 页面右下角固定定位极简山峰 SVG（透明度 5%），强化品牌记忆

### DON'T (禁止做法)
- ❌ 使用纯黑 `text-black` 或纯白 `bg-white`（必须使用暖调的米白和深灰）
- ❌ 添加评分等级标识（如"A级"、"优秀"等），保持"境界"的平等性隐喻
- ❌ 使用红色表示错误（测评无对错，避免给用户"答错"的心理暗示）
- ❌ 题目使用过于紧凑的行高（必须保持 `leading-relaxed` 以上）
- ❌ 添加加载动画旋转图标（使用优雅的内容占位符或淡入效果）

### 通用约束
- ❌ 使用 Tailwind 预设色板（如 `bg-blue-500`、`text-green-600`）替代设计系统颜色
- ❌ 使用 `w-full` 让内容在大屏幕上无限延伸（必须使用 `max-w-2xl` 约束）
- ❌ 混用深浅背景（全应用保持浅色米白主题）