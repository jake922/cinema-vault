# Cinema Vault - 题目14：Teleport 与 Suspense

本项目用于展示 Vue 3 高级特性：Teleport、Suspense、异步组件加载、骨架屏和全局 Toast 通知。

## 已完成任务点

- 使用 Teleport 将全局 Toast 通知挂载到 `body`
- Toast 支持成功、警告、错误三种类型
- Toast 支持自动消失和手动关闭
- 使用 `defineAsyncComponent` 加载异步电影列表组件
- 使用 `<Suspense>` 在异步加载期间显示骨架屏
- 支持模拟加载失败和错误重试
- 页面改为简约日漫电影资料馆风格
- 卡片已改为真实电影封面布局，并预留本地封面图片位置
- 已预留背景视频位置

## 运行方式

```bash
npm install
npm run dev
```

在 Windows PowerShell 中如果 npm 被执行策略拦截，可以使用：

```powershell
npm.cmd install
npm.cmd run dev
```

## 替换电影封面

封面图片放在：

```text
public/posters/
```

请用真实电影封面覆盖以下占位图文件：

```text
your-name.jpg
weathering-with-you.jpg
suzume.jpg
spirited-away.jpg
howls-moving-castle.jpg
a-silent-voice.jpg
```

建议封面比例为 **2:3**，例如 `800x1200` 或 `1000x1500`。

## 添加背景视频

把背景视频命名为：

```text
background.mp4
```

放到：

```text
public/videos/background.mp4
```

`App.vue` 中已经使用动态绑定预留路径，视频暂时不存在也不会影响 Vite 启动。

## 技术难点说明

1. **Teleport 全局通知**：Toast 挂载到 `body`，避免受到页面组件层级、`overflow` 和 `z-index` 的影响。
2. **Suspense 异步加载**：电影列表组件通过 `defineAsyncComponent` 加载，同时组件内部使用 `await` 模拟接口请求，加载期间展示 Skeleton。
3. **错误重试机制**：点击“模拟加载失败”进入错误状态，通过 Toast 弹出错误提醒，并提供重新加载按钮。
4. **封面预留方案**：卡片使用 `/public/posters` 下的本地图片路径，当前为占位图，后续可直接用真实电影封面替换。
5. **视频预留方案**：背景视频路径使用动态绑定，避免视频暂未添加时触发 Vite 编译报错。


## 本版视觉说明

- 整体改为更通透的日漫背景风格：面板使用半透明玻璃拟态，不会遮住后续放入的背景视频。
- 背景视频预留路径：`public/videos/background.mp4`。文件不存在时项目也可以启动，放入同名 MP4 后会自动显示。
- 卡片已改成真实电影封面布局，封面区域按 2:3 比例预留。
- 当前 `public/posters/` 中是彩色日漫风占位图，不是官方海报；后续直接用真实封面图覆盖同名文件即可。
