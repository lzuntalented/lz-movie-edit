# 类似剪影的视频剪辑软件web版

> [预览地址](http://movie.lzuntalented.cn/)

## 项目结构

```
move-edit/
├── src/
│   ├── player/          # 播放器模块
│   │   ├── index.tsx    # 播放器入口
│   │   ├── index.scss   # 播放器样式
│   │   ├── control.tsx  # 控制组件
│   │   ├── config.ts    # 播放器配置
│   │   ├── interface.ts # 接口定义
│   │   ├── move.tsx     # 移动组件
│   │   ├── music.tsx    # 音乐组件
│   │   ├── video.tsx    # 视频组件
│   │   ├── text.tsx     # 文字组件
│   │   ├── image.tsx    # 图片组件
│   │   └── animation.tsx# 动画组件
│   │
│   ├── track/           # 轨道组件
│   │   ├── index.tsx
│   │   └── track-drop.tsx
│   │
│   ├── track-operate/  # 轨道操作
│   │   ├── index.tsx
│   │   └── index.scss
│   │
│   ├── store/          # 状态管理
│   │   ├── index.ts     # store入口
│   │   ├── item.ts      # 项目数据
│   │   ├── layer.ts     # 图层管理
│   │   ├── timer.ts     # 定时器
│   │   ├── cache.ts     # 缓存
│   │   └── transition.ts# 转换效果
│   │
│   ├── operation/      # 操作面板
│   │   ├── index.tsx
│   │   └── index.scss
│   │
│   ├── fragment/        # 片段组件
│   │   ├── index.tsx
│   │   └── index.scss
│   │
│   ├── indicator/       # 指示器
│   │   ├── index.tsx
│   │   └── index.scss
│   │
│   ├── widget/          # 组件库
│   │   ├── index.tsx
│   │   └── index.scss
│   │
│   ├── setting/         # 设置面板
│   │   └── index.tsx
│   │
│   ├── common/         # 公共配置
│   │   ├── config.ts
│   │   └── env.ts
│   │
│   ├── app.tsx         # 主应用
│   ├── app.scss        # 主应用样式
│   ├── index.tsx      # 入口
│   ├── utils.ts      # 工具函数
│   ├── context.ts    # 上下文
│   └── track-drop.tsx
│
├── public/             # 静态资源
│   ├── index.html
│   ├── pre.html
│   ├── hidpi-canvas..js
│   ├── 1.mp3 ~ 3.mp3   # 音频文件
│   ├── 1.mp4 ~ 2.mp4  # 视频文件
│   └── 1.jpg ~ 3.jpg  # 图片文件
│
├── package.json       # 项目依赖
├── webpack.config.js  # 构建配置
├── tsconfig.json     # TypeScript配置
├── .eslintrc.js      # ESLint配置
├── .env              # 环境变量
└── readme.md         # 项目文档
```

## 开发

```bash
# 安装依赖
npm i
# 本地开发
npm start
# 本地访问
http://localhost:9000/

#构建
npm run build

```