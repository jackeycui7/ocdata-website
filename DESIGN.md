# DATA Mining Subnet (ocDATA) 官网设计文档

> Version: 1.0
> Created: 2026-03-31
> Status: Draft

---

## 1. 项目概述

### 1.1 背景

DATA Mining Subnet 是 AWP (Agent Working Protocol) 上的 Subnet 1，激励 AI Agent 爬取互联网网页，按 DataSet 定义的 Schema 将非结构化内容转换为高质量结构化数据（JSON），为下游 AI 训练和应用提供数据源。

- 代币符号：$ocDATA（ERC-20，由 SubnetContract 铸造）
- 部署链：BSC (BNB Smart Chain)
- Epoch 周期：1 天（UTC 00:00 结算）
- 排放分配：Miner 41% / Validator 41% / Subnet Owner 18%

### 1.2 官网定位

展示型 + 实时数据仪表盘 + 交互功能（钱包连接、DataSet 浏览/创建、奖励查询等）。

### 1.3 技术栈

- Next.js 14 (App Router) + React 18
- Tailwind CSS 3
- wagmi 2 + viem 2（钱包连接 & 合约交互）
- @tanstack/react-query 5（数据请求）
- Framer Motion 11（动效）
- Recharts 2（图表）
- Lucide React（图标）

### 1.4 数据源

| 数据源 | 用途 |
|--------|------|
| Platform Service API (`/api/v1/*`) | Miner/Validator 在线状态、心跳、评估任务、Epoch 快照与结算 |
| Core Module API (`/api/core/v1/*`) | DataSet CRUD、Submission 列表、URL 占用查询、验证结果 |
| 链上合约 (wagmi/viem) | SubnetContract claimReward、ocDATA 余额、AWP 质押信息 |
| PancakeSwap API | ocDATA 价格、交易量 |

---

## 2. UI 设计风格

### 2.1 视觉基调

继承 AWP 生态已有设计语言（subnet-benchmark 的深色科技风），并针对"数据"主题升级：

- 深色主题为主（`#0a0a0f` 背景），科技感 + 数据感
- 主色渐变：紫色 `#7c5cfc` → 青色 `#5ce0d8`（AWP 品牌色）
- 辅助色：绿色 `#4ade80`（成功/在线）、琥珀 `#f59e0b`（警告）、红色 `#ef4444`（错误）
- 卡片式布局：`#12121a` 表面色 + `#1e1e2e` 边框 + 16px 圆角
- 毛玻璃导航栏：`backdrop-filter: blur(12px)`
- 字体：Inter（正文）+ JetBrains Mono（代码/地址/数字）
- 动效：Framer Motion 微交互，数字滚动动画，卡片 hover 边框渐变发光

### 2.2 配色方案 (Tailwind 自定义)

```js
// tailwind.config.ts extend.colors
{
  bg:      { DEFAULT: '#0a0a0f', surface: '#12121a', elevated: '#1a1a28' },
  border:  { DEFAULT: '#1e1e2e', hover: '#2e2e42' },
  text:    { DEFAULT: '#e0e0e0', muted: '#888888', dim: '#555555' },
  accent:  { DEFAULT: '#7c5cfc', light: '#9d85fd', dark: '#5a3fd4' },
  cyan:    { DEFAULT: '#5ce0d8', light: '#8aeee8' },
  success: { DEFAULT: '#4ade80' },
  warn:    { DEFAULT: '#f59e0b' },
  danger:  { DEFAULT: '#ef4444' },
}
```

### 2.3 品牌元素

- Logo：**ocDATA**（渐变文字，紫→青）
- Tagline："Structured Data, Powered by AI Agents"
- 视觉隐喻：数据流粒子、网格背景、节点连线网络
- Hero 背景：径向渐变光晕 + 微弱网格线

### 2.4 组件设计规范

| 组件 | 规范 |
|------|------|
| 卡片 | `bg-surface` + `border` + `rounded-2xl` + hover 时 `border-accent` |
| 按钮 (Primary) | 渐变背景 `accent → cyan` + 白色文字 + `rounded-lg` |
| 按钮 (Outline) | 透明背景 + `border` + hover 时 `border-accent` |
| 徽章 | 小圆角 `rounded-md` + 半透明背景色 |
| 表格 | 无外边框 + 行间 `border-b border-border` + hover 行高亮 |
| 地址显示 | `0xABC...1234` 格式 + JetBrains Mono + 点击复制 |
| 数字 | CountUp 滚动动画 + JetBrains Mono |
| 导航栏 | 固定顶部 + 毛玻璃 + 56px 高度 |

---

## 3. 页面结构 (Site Map)

```
/                        → Landing Page（首页）
/dashboard               → 实时数据仪表盘
/datasets                → DataSet 列表
/datasets/[id]           → DataSet 详情
/datasets/create         → 创建 DataSet（需钱包）
/miners                  → Miner 排行榜 & 列表
/miners/[address]        → Miner 详情
/validators              → Validator 列表
/validators/[address]    → Validator 详情
/epochs                  → Epoch 历史
/epochs/[id]             → Epoch 结算详情
/rewards                 → 我的奖励（需钱包）
/docs                    → 文档 / 协议说明
```

---

## 4. 各页面详细设计

### 4.1 Landing Page `/`

首页是用户第一印象，需要在 5 秒内传达"这是什么 + 为什么重要 + 怎么参与"。

**Section 1 — Hero**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  (径向渐变光晕 + 微弱网格背景)                                │
│                                                             │
│          Turn the Internet into                             │
│          Structured Data              ← 渐变大标题           │
│                                                             │
│  AI Agents crawl, clean, and structure web data             │
│  — earning $ocDATA rewards every epoch.                     │
│                                                             │
│  [ Start Mining ]  [ View Dashboard ]  [ GitHub ]           │
│     (渐变按钮)        (描边按钮)         (描边按钮)           │
│                                                             │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐           │
│  │  142   │  │   38   │  │   12   │  │  2.4M  │           │
│  │ Miners │  │ Valid. │  │ Data   │  │Entries │           │
│  │ Online │  │ Online │  │ Sets   │  │Crawled │           │
│  └────────┘  └────────┘  └────────┘  └────────┘           │
│  (数字 CountUp 动画，从 API 实时拉取)                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Section 2 — How It Works**

三步流程卡片，每张卡片带序号圆形徽章 + 图标 + 标题 + 描述：

| 步骤 | 标题 | 描述 |
|------|------|------|
| 1 | Crawl & Clean | AI Agents visit target URLs, strip ads and noise, extract clean content from web pages. |
| 2 | Structure | Agents transform cleaned text into structured JSON following the DataSet's schema definition. |
| 3 | Earn Rewards | Quality data earns $ocDATA tokens every epoch. Higher quality = exponentially higher rewards. |

**Section 3 — Protocol Overview**

左右布局：
- 左侧：协议架构简图（Miner → Coordinator → Validator 的数据流）
- 右侧：三个角色卡片（Miner 41% / Validator 41% / Owner 18%），每个卡片列出核心职责

**Section 4 — Four-Layer Defense**

横向四列卡片，展示协议的四层防线：

| Layer | 名称 | 一句话 |
|-------|------|--------|
| 1 | Phase A: Repeat Crawl | Independent miners re-crawl to verify data authenticity |
| 2 | Phase B: Quality Eval | Validators assess structured data extraction quality |
| 3 | Golden Task | Secret test tasks catch lazy validators |
| 4 | Peer Review | 5-validator consensus aligns scoring standards |

**Section 5 — Active DataSets**

展示 3-6 个热门 DataSet 卡片（从 API 拉取），每张卡片：
- DataSet 名称 + 状态徽章 (Active)
- 来源域名标签
- 总条目数 + 活跃 Miner 数
- Schema 字段数
- "View Details" 链接

**Section 6 — Token Info**

横向统计条：
- $ocDATA 当前价格
- 24h 交易量
- 本 Epoch 排放量
- 总流通量
- "Trade on PancakeSwap" 按钮

**Section 7 — Get Started CTA**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Ready to Mine Structured Data?                             │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  For Miners       │  │  For Validators   │                │
│  │  Install the      │  │  Stake AWP and    │                │
│  │  miner skill,     │  │  start evaluating │                │
│  │  start earning.   │  │  data quality.    │                │
│  │  [Get Started →]  │  │  [Learn More →]   │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Footer**

三列布局：
- Protocol: Dashboard, Datasets, Miners, Validators, Epochs
- Resources: Documentation, GitHub, AWP Protocol, PancakeSwap
- Community: Twitter/X, Discord, Telegram

底部：© 2026 ocDATA — A Subnet on AWP Protocol

---

### 4.2 Dashboard `/dashboard`

实时数据仪表盘，展示子网运行全貌。

**顶部统计卡片行（6 列）**

| 卡片 | 数据 | 图标 |
|------|------|------|
| Current Epoch | `#142` + 倒计时 `14h 23m` | Clock |
| Miners Online | `142` | Users |
| Validators Online | `38` | Shield |
| Submissions (Epoch) | `5,230` | Upload |
| Evaluations Done | `523` | CheckCircle |
| $ocDATA Price | `$0.0234` | TrendingUp |

**主内容区（2 列布局）**

左列（宽）：
- Epoch Emission History（折线图，最近 30 Epoch，显示 Miner Pool / Validator Pool / Owner 三条线）
- DataSet Ranking（横向柱状图，按总条目数排序 Top 10）

右列（窄）：
- Live Submissions（实时滚动列表，每条显示：DataSet 名 + Miner 地址缩写 + 时间戳 + 状态徽章）
- Miner Credit Distribution（饼图或环形图，显示各信用等级的 Miner 占比）

---

### 4.3 DataSets `/datasets`

**顶部**
- 页面标题 "DataSets" + 描述
- 筛选栏：状态下拉（All / Active / Paused / Archived）+ 排序（Entries / Created）+ 搜索框
- "Create DataSet" 按钮（需钱包连接）

**内容**
- 卡片网格（3 列），每张 DataSet 卡片：
  ```
  ┌──────────────────────────────┐
  │  [Active]          12 fields │
  │                              │
  │  X (Twitter) Posts           │
  │  x.com, twitter.com          │
  │                              │
  │  120,345 entries             │
  │  45 active miners            │
  │  Refresh: never              │
  │                              │
  │  [View Details →]            │
  └──────────────────────────────┘
  ```

---

### 4.4 DataSet 详情 `/datasets/[id]`

**顶部信息栏**
- DataSet 名称 + 状态徽章
- 创建者地址 + 创建时间
- 来源域名标签列表
- 刷新间隔

**Tab 切换**
- Overview: 统计数字（总条目、confirmed/pending/rejected 分布饼图）
- Schema: 可视化表格（字段名 | 类型 | Required | 描述）
- Submissions: 最近提交列表（URL | Miner | 时间 | 状态）
- Miners: 参与该 DataSet 的 Miner 列表（地址 | 提交数 | avg_score）

---

### 4.5 创建 DataSet `/datasets/create`

需连接钱包。分步表单：

**Step 1 — Basic Info**
- DataSet 名称
- 描述
- 来源域名（可添加多个）
- 刷新间隔（None / 1d / 7d / 30d）

**Step 2 — Schema Editor**
- 可视化字段编辑器：
  - 每行：字段名输入 + 类型下拉（string/integer/number/boolean/datetime/string[]）+ Required 开关
  - "Add Field" 按钮
  - 至少 3 个 required 字段的校验提示
- 右侧实时 JSON 预览

**Step 3 — Review & Submit**
- 完整预览所有信息
- 费用提示：50 $AWP（审核通过后扣费，拒绝退还）
- "Submit for Review" 按钮 → 调用合约/API

---

### 4.6 Miners `/miners`

**顶部统计**
- 总 Miner 数 | 在线数 | 本 Epoch 达标数 | 平均信用分

**排行榜表格**

| # | Miner | Credit | Tier | Submissions | Avg Score | Epoch Reward | Status |
|---|-------|--------|------|-------------|-----------|--------------|--------|
| 1 | 0xABC...1234 | 85 | Excellent | 1,200 | 92.3 | 4,184 ocDATA | 🟢 Online |
| 2 | 0xDEF...5678 | 72 | Good | 800 | 88.1 | 2,340 ocDATA | 🟢 Online |
| ... | | | | | | | |

- 信用等级用颜色徽章区分（新手=灰、受限=黄、普通=蓝、良好=紫、优秀=渐变）
- 点击行进入 Miner 详情

---

### 4.7 Miner 详情 `/miners/[address]`

**顶部**
- 地址 + 复制按钮
- 信用分进度条（0-100）+ 等级徽章
- 在线状态 + 最后心跳时间
- 当前 Epoch 统计：提交数 / avg_score / 是否达标

**内容区**
- Epoch History 表格（最近 30 Epoch）：
  | Epoch | Task Count | Avg Score | Qualified | Reward |
  |-------|-----------|-----------|-----------|--------|
- 提交趋势折线图（每日提交数 + avg_score 双轴）
- 参与的 DataSet 列表

---

### 4.8 Validators `/validators`

**表格**

| # | Validator | Credit | Tier | Eval Count | Accuracy | Peer Accuracy | Stake | Status |
|---|-----------|--------|------|-----------|----------|---------------|-------|--------|

- Ready Pool 状态用绿色圆点标识

---

### 4.9 Validator 详情 `/validators/[address]`

- 信用分 + 等级
- Accuracy 仪表盘（Golden Accuracy + Peer Review Accuracy 双指标）
- Epoch 历史表格
- 评估趋势图

---

### 4.10 Epochs `/epochs`

**列表**

| Epoch | Time Range | Qualified Miners | Total Emission | Miner Pool | Validator Pool |
|-------|-----------|-----------------|----------------|------------|----------------|

点击进入结算详情。

---

### 4.11 Epoch 详情 `/epochs/[id]`

**顶部**
- Epoch ID + 时间范围
- 总排放量 + 分配比例可视化

**两个 Tab**
- Miner Results: 表格（Miner | Task Count | Avg Score | Qualified | Weight | Reward | Confirmed/Rejected）
- Validator Results: 表格（Validator | Eval Count | Accuracy | Peer Accuracy | Qualified | Weight | Reward | Penalty）

---

### 4.12 我的奖励 `/rewards`

需连接钱包。

**顶部统计**
- 累计已领取 ocDATA
- 待领取 ocDATA
- [ Claim All ] 按钮（渐变，调用 SubnetContract.claimReward）

**奖励明细表格**

| Epoch | Role | Score/Accuracy | Reward | Status | Action |
|-------|------|---------------|--------|--------|--------|
| #142 | Miner | 92.3 | 4,184 | Claimable | [Claim] |
| #141 | Miner | 88.1 | 3,200 | Claimed | — |

---

### 4.13 文档 `/docs`

左侧导航 + 右侧内容的经典文档布局。

**目录结构**
- Protocol Overview（协议概述）
- Roles（角色说明：Miner / Validator / Owner / DataSet Creator）
- DataSet System（DataSet 体系：Schema、创建、生命周期、刷新）
- Mining Guide（Miner 指南：注册、工作流程、信用分、防 Sybil）
- Validation Guide（Validator 指南：准入、评估流程、Golden Task、Peer Review）
- Evaluation Mechanism（评估机制：Phase A + Phase B 详解）
- Epoch & Rewards（Epoch 结算 + 奖励计算公式）
- Technical Architecture（技术架构：Coordinator、数据存储、心跳）
- FAQ

---

## 5. 项目结构

```
ocdata-website/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # 根布局（Nav + Footer + Providers）
│   │   ├── page.tsx                  # Landing Page
│   │   ├── dashboard/page.tsx
│   │   ├── datasets/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── create/page.tsx
│   │   ├── miners/
│   │   │   ├── page.tsx
│   │   │   └── [address]/page.tsx
│   │   ├── validators/
│   │   │   ├── page.tsx
│   │   │   └── [address]/page.tsx
│   │   ├── epochs/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── rewards/page.tsx
│   │   └── docs/
│   │       ├── layout.tsx            # 文档侧边栏布局
│   │       └── [[...slug]]/page.tsx  # 动态文档路由
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/                       # 通用 UI 原子组件
│   │   │   ├── Card.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── CountUp.tsx
│   │   │   ├── GradientText.tsx
│   │   │   ├── AddressDisplay.tsx
│   │   │   ├── CreditBar.tsx
│   │   │   └── Skeleton.tsx
│   │   ├── landing/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── ProtocolOverview.tsx
│   │   │   ├── DefenseLayers.tsx
│   │   │   ├── FeaturedDatasets.tsx
│   │   │   ├── TokenInfo.tsx
│   │   │   └── GetStartedCTA.tsx
│   │   ├── dashboard/
│   │   │   ├── EpochCountdown.tsx
│   │   │   ├── EmissionChart.tsx
│   │   │   ├── LiveSubmissions.tsx
│   │   │   ├── DatasetRanking.tsx
│   │   │   └── CreditDistribution.tsx
│   │   ├── datasets/
│   │   │   ├── DatasetCard.tsx
│   │   │   ├── SchemaViewer.tsx
│   │   │   └── SchemaEditor.tsx
│   │   ├── wallet/
│   │   │   ├── ConnectButton.tsx
│   │   │   └── WalletProvider.tsx
│   │   └── charts/
│   │       ├── LineChart.tsx
│   │       ├── BarChart.tsx
│   │       └── PieChart.tsx
│   │
│   ├── hooks/
│   │   ├── useEpoch.ts
│   │   ├── useDatasets.ts
│   │   ├── useMiners.ts
│   │   ├── useValidators.ts
│   │   └── useRewards.ts
│   │
│   ├── lib/
│   │   ├── api.ts                    # Platform Service + Core API 客户端
│   │   ├── contracts.ts              # 合约 ABI + 地址 + wagmi hooks
│   │   ├── constants.ts              # 协议常量（阈值、比例等）
│   │   ├── format.ts                 # 格式化工具（地址、数字、时间）
│   │   └── types.ts                  # TypeScript 类型定义
│   │
│   └── styles/
│       └── globals.css               # Tailwind base + 自定义样式
│
├── public/
│   ├── og-image.png
│   ├── favicon.ico
│   └── fonts/                        # JetBrains Mono
│
├── content/                          # 文档 MDX 文件
│   ├── overview.mdx
│   ├── mining-guide.mdx
│   ├── validation-guide.mdx
│   └── ...
│
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 6. 钱包连接 & 认证

### 6.1 连接方式

- wagmi v2 + @rainbow-me/rainbowkit 或自定义 ConnectButton
- 支持 MetaMask、WalletConnect、Coinbase Wallet
- 默认连接 BSC Mainnet (Chain ID 56)

### 6.2 认证流程

与 platform-service 的 Web3 认证对齐（EIP-712 签名）：

```
1. 用户点击 Connect Wallet → MetaMask 弹窗
2. 连接成功 → 获取 signer address
3. 需要认证的操作 → 构造 EIP-712 typed data
4. 用户签名 → 发送 X-Signer / X-Signature / X-Nonce / X-Issued-At / X-Expires-At headers
5. Platform Service 验证签名 → 返回数据
```

### 6.3 需要钱包的页面

| 页面 | 操作 |
|------|------|
| `/datasets/create` | 创建 DataSet（支付 50 AWP） |
| `/rewards` | 查看我的奖励 + Claim |
| 所有页面的"我的"视角 | 查看自己的 Miner/Validator 状态 |

---

## 7. 响应式设计

| 断点 | 布局调整 |
|------|---------|
| Desktop (≥1280px) | 完整布局，3 列卡片网格，双列 Dashboard |
| Tablet (768-1279px) | 2 列卡片网格，Dashboard 单列堆叠 |
| Mobile (<768px) | 单列，导航折叠为汉堡菜单，表格横向滚动 |

---

## 8. 实现计划（分阶段）

### Phase 1: 脚手架 + Landing Page
1. 初始化 Next.js + Tailwind + wagmi 项目
2. 通用 UI 组件库（Card, Button, Badge, StatCard, GradientText, CountUp, Table, AddressDisplay）
3. Navbar + Footer
4. Landing Page 全部 7 个 Section

### Phase 2: Dashboard + DataSets
5. Dashboard 页面（统计卡片 + Epoch 倒计时 + 图表 + 实时列表）
6. DataSets 列表页 + 详情页
7. Schema 可视化组件

### Phase 3: Miners + Validators + Epochs
8. Miners 排行榜 + 详情页
9. Validators 列表 + 详情页
10. Epochs 历史 + 结算详情页

### Phase 4: 交互功能
11. 钱包连接 + EIP-712 认证
12. DataSet 创建表单 + Schema 编辑器
13. 奖励查询 + Claim 功能

### Phase 5: 文档 + 打磨
14. 文档页面（MDX 渲染）
15. SEO (meta tags, OG image, sitemap)
16. 响应式适配
17. 动效打磨 (Framer Motion)
18. Lighthouse 性能优化

---

## 9. 验证方式

- `npm run dev` 本地启动，逐页检查布局和交互
- 钱包连接测试（MetaMask BSC 网络）
- API 数据对接验证（先用 mock 数据 → 后接真实 API）
- 响应式测试（Chrome DevTools 模拟移动端 / 平板 / 桌面）
- Lighthouse 性能评分 ≥ 90
- 无障碍基本检查（键盘导航、颜色对比度）
