# imagesPlayEditor Memory Bank

## 项目定位
- 图片标注编辑器，按“动作→帧”组织导出步骤图，支持 Web 与 Tauri 导出 ZIP。

## 代码架构
- 前端入口: `src/app.ts`（状态管理、事件绑定、渲染调度）。
- 挂载上下文收敛: `src/app-mount-context/index.ts`（状态文案、导出反馈、样式采集、帧描述编辑器状态统一管理）。
- 入口事件绑定: `src/app-events/index.ts`（集中注册/解绑 UI 事件，`app.ts` 仅提供业务回调）。
- 导出运行时: `src/app-export-runtime/index.ts`（导出帧计算、聚焦可见集、导出执行流程）。
- 时间线运行时: `src/app-timeline-runtime/index.ts`（动作移动与时间线排序回调收敛）。
- 刷新运行时: `src/app-refresh-runtime/index.ts`（主界面 refresh 流水编排与画布/帧面板/导出预览同步）。
- 刷新运行时细分: `src/app-refresh-runtime/{panel-refresh,canvas-export-refresh}.ts`（帧面板刷新与画布/导出同步分离）。
- UI 控件状态收敛: `src/app-ui-controls/index.ts`（工具激活态、样式控件可编辑态、动作按钮可用态）。
- App 状态变更操作: `src/app-state-ops/index.ts`（清空分隔切换、帧独占切换、动作删除、帧删除）。
- DOM 查询与页面引用收敛: `src/modules/app-shell/*`（集中必需元素查询与校验）。
- 页面模板: `src/app-template.ts`。
- 样式入口: `src/styles/index.css`（统一分层导入）。
- 样式分层: `src/styles/{tokens,reset,layout,canvas,toolbar,timeline,dialogs,responsive}.css`（按职责拆分，避免跨层覆盖面条化）。
- 帧列表高度策略: `src/styles/timeline/panel.css` 使用 `align-content: start` 与 `grid-auto-rows: max-content`，避免帧卡片被容器剩余空间拉伸。
- layout 样式再分层: `src/styles/layout/{shell,headers,actions}.css`（壳层布局、标题区、操作区样式分离）。
- timeline 样式再分层: `src/styles/timeline/{panel,frame-card,actions}.css`（面板结构、卡片头部、动作拖拽样式拆开维护）。
- toolbar 样式再分层: `src/styles/toolbar/{layout,file-input,style-controls,buttons}.css`（布局、文件输入、样式控件、按钮视觉解耦）。
- dialogs 样式再分层: `src/styles/dialogs/{status,settings,export-dialog}.css`（状态区、设置弹窗、导出弹窗样式分离）。
- 样式去重约定: 优先使用 `:is(...)` 合并同类按钮状态选择器，减少 hover/active 重复规则，保证视觉语义不变下可维护性更高。
- 导出入口: toolbar `#open-export-panel-btn`，导出信息面板改为 `#export-dialog` 弹窗（导出动作按钮仍为 `#export-btn`）。
- 业务模块入口: `src/modules/index.ts`（对外统一导出，模块间应走该入口）。
- 时间线与帧视图: `src/modules/timeline/*`, `src/modules/frameview/*`。
- 时间线新建帧落点: `src/modules/timeline/new-frame-dropzone.ts` + `src/modules/frameview/frame-panel-new-frame-dropzone.ts`（动作拖拽时显示虚线落点，释放后自动新建帧并迁移该动作）。
- 帧视图分层: `src/modules/frameview/{frame-panel-render,export-preview-render,selected-info}.ts`（渲染与状态文案解耦）。
- 帧面板渲染细分: `src/modules/frameview/{frame-panel-types,frame-panel-card,frame-panel-actions}.ts`（类型、卡片结构、动作列表独立维护）。
- 帧面板继续细分: `src/modules/frameview/{frame-panel-header,frame-panel-separator}.ts`（头部与分隔条 DOM 组装分离）。
- 时间线拖拽生命周期: `src/modules/timeline/sortable-system.ts`（根排序实例单次创建，动作列表按 frameId 增量同步）。
- 时间线拖拽内部细分: `src/modules/timeline/{sortable-types,sortable-order,sortable-factories}.ts`（类型、顺序读取、Sortable工厂分离）。
- 选中态管理: `src/modules/selection/*`（帧/动作/标注选中与清空的公共逻辑）。
- 设置弹窗逻辑: `src/modules/settings-dialog/*`（命名预览校验、弹窗打开关闭）。
- 画布能力: `src/modules/canvas/*`。
- 画布绘制流程: `src/modules/canvas/drawing-flow.ts`（预览节点创建、拖拽更新、提交标注）。
- 画布绘制会话: `src/modules/canvas/drawing-session.ts`（绘制起点、预览节点、提交与清理状态集中管理）。
- 文本标注会话: `src/modules/canvas/text-annotation-session.ts`（文本创建与编辑输入流程从控制器剥离）。
- 文本输入覆盖层: `src/modules/canvas/text-input-overlay.ts`（文本创建/编辑输入层生命周期）。
- 标注层渲染: `src/modules/canvas/annotation-layer-render.ts`（标注节点构建、双击文本编辑、编辑控件挂载）。
- 画布指针事件绑定: `src/modules/canvas/pointer-events.ts`（mousedown/mousemove/mouseup/click 事件集中绑定）。
- 画布视口与缩放: `src/modules/canvas/stage-viewport.ts`（场景指针坐标、自适应缩放、原始比例导出等视口逻辑）。
- 画布无图态自适应: `stage-viewport.applyViewportStageSize` + `canvas.css` 的 `stage-container` 盒模型修正，确保编辑区随窗口变化且不产生伪滚动条。
- 画布交互策略: `src/modules/canvas/interaction-policy.ts`（选中可编辑判定统一出口）。
- 画布编辑控制分层: `src/modules/canvas/editing-controls-{box,arrow,text}.ts` + `editing-controls.ts` 调度（不同标注编辑逻辑分离）。
- 导出能力: `src/modules/export/*`, `src/modules/interpreter/*`。
- 导出模块分层: `src/modules/export/{export-zip,export-ui}.ts`（zip生成与UI反馈流程拆分）。
- 导出 UI 流程: `src/modules/export/index.ts` 中 `runExportWithUi`（导出按钮状态、进度与反馈统一处理）。
- Tauri 端: `src-tauri/`。
- MSI 打包配置: `src-tauri/tauri.conf.json` 中 `bundle.targets` 已固定为 `"msi"`，并显式指定 `bundle.icon = ["icons/icon.ico"]`，避免打包阶段图标缺失错误。
- MSI 打包命令: `npm run tauri:build`（封装于 `scripts/tauri-build.mjs`）。
- 打包版本策略: 支持 `--version YY.MM.NN`；不传参时按当月自动续号（读取 `.ai-temp/memory-bank/build-version-state.json`）。
- MSI 产物命名: 自动包含业务版本与 git short hash，例如 `imagesPlayEditor_26.03.08_git-a1b2c3d_x64_en-US.msi`。
- Git 版本要求: 构建时必须存在至少一个 git commit（无 `HEAD` 会 failed-fast 报错）。

## 文档位置
- 使用与目标说明: `README.md`。
- 质量检查清单: `PROJECT_CHECKLIST.md`。
- Lint 与行数规则: `package.json`, `scripts/check-lines.mjs`。

## 必须注意
- 单文件不能超过 500 行（`npm run lint:lines` 会校验）。
- TS 代码需通过 ESLint，Rust 代码需通过 `fmt + clippy`。
- 禁止模块间直引内部实现，优先从 `@modules` 或模块 `index.ts` 导入。
- 采用 failed-fast：出现异常要明确报错，不做静默兜底。
- 临时尝试文件统一放 `.ai-temp/attempts/`，工作日志放 `.ai-temp/working-log/`。
- 当前重构策略：`app.ts` 保持编排层，事件/状态变更/UI 控制/画布细节拆入独立模块，优先降低耦合与回归面。
