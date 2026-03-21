import { renderAntIcon } from "@modules";

export const APP_TEMPLATE = `
  <div class="layout">
    <section class="canvas-panel">
      <header class="panel-header">
        <h1>imagesPlayEditor</h1>
        <span id="status-text" class="status">就绪</span>
      </header>
      <div class="toolbar toolbar-surface">
        <div class="toolbar-row toolbar-row-main">
          <label
            class="file-label toolbar-file-label toolbar-icon-button"
            data-tooltip="加载图片"
            title="加载图片"
            aria-label="加载图片"
          >
            ${renderAntIcon("image")}
            <input id="image-input" type="file" accept="image/*" />
          </label>
          <label
            class="file-label toolbar-file-label toolbar-icon-button"
            data-tooltip="导入工程 JSON"
            title="导入工程 JSON"
            aria-label="导入工程 JSON"
          >
            ${renderAntIcon("projectImport")}
            <input id="project-input" type="file" accept=".json,application/json" />
          </label>
          <button
            id="export-project-btn"
            type="button"
            class="toolbar-export-btn toolbar-icon-button"
            data-tooltip="导出工程 JSON"
            title="导出工程 JSON"
            aria-label="导出工程 JSON"
          >${renderAntIcon("projectExport")}</button>
          <div class="tool-group toolbar-tool-group">
            <button type="button" data-tool="select" class="toolbar-icon-button" data-tooltip="选择" title="选择" aria-label="选择">${renderAntIcon("select")}</button>
            <button type="button" data-tool="box" class="toolbar-icon-button" data-tooltip="框选" title="框选" aria-label="框选">${renderAntIcon("box")}</button>
            <button type="button" data-tool="arrow" class="toolbar-icon-button" data-tooltip="箭头" title="箭头" aria-label="箭头">${renderAntIcon("arrow")}</button>
            <button type="button" data-tool="text" class="toolbar-icon-button" data-tooltip="文字" title="文字" aria-label="文字">${renderAntIcon("text")}</button>
          </div>
          <button
            id="open-export-panel-btn"
            type="button"
            class="toolbar-export-btn toolbar-icon-button"
            data-tooltip="导出步骤图 ZIP"
            title="导出步骤图 ZIP"
            aria-label="导出步骤图 ZIP"
          >${renderAntIcon("export")}</button>
          <button
            id="refresh-canvas-btn"
            type="button"
            class="toolbar-icon-button"
            data-tooltip="刷新画布"
            title="刷新画布"
            aria-label="刷新画布"
          >${renderAntIcon("refresh")}</button>
          <button
            id="settings-btn"
            type="button"
            class="toolbar-settings-btn toolbar-icon-button"
            data-tooltip="设置"
            title="设置"
            aria-label="设置"
          >${renderAntIcon("settings")}</button>
        </div>
        <div class="style-inline-group toolbar-style-group">
          <label class="color-only"><input id="style-color" type="color" value="#ef4444" /></label>
          <label>线宽(%短边) <input id="style-stroke" type="number" min="0.05" max="5" step="0.05" value="0.3" /></label>
          <label>箭头长度(%短边) <input id="style-arrow" type="number" min="0.2" max="12" step="0.1" value="1.6" /></label>
          <label>字号(%短边) <input id="style-font" type="number" min="0.4" max="16" step="0.1" value="2.4" /></label>
          <button
            id="apply-style-btn"
            type="button"
            class="toolbar-icon-button"
            data-tooltip="更新默认绘制样式"
            title="更新默认绘制样式"
            aria-label="更新默认绘制样式"
          >${renderAntIcon("style")}</button>
        </div>
      </div>
      <div id="canvas-shell" class="canvas-shell">
        <div id="stage-container" class="stage-container" data-drop-hint="拖拽图片到此处导入"></div>
      </div>
    </section>
    <aside class="side-panel">
      <section class="timeline-panel side-card">
        <div class="panel-title-row">
          <h2>帧列表</h2>
          <span class="panel-chip">动作可拖拽</span>
        </div>
        <div class="actions-row frame-actions-row">
          <button id="add-empty-frame-btn" type="button" class="toolbar-icon-button" data-tooltip="添加空帧" title="添加空帧" aria-label="添加空帧">${renderAntIcon("frameAdd")}</button>
          <button id="add-clear-btn" type="button" class="toolbar-icon-button" data-tooltip="切换选中帧前清空" title="切换选中帧前清空" aria-label="切换选中帧前清空">${renderAntIcon("clear")}</button>
        </div>
        <div class="actions-divider" aria-hidden="true"></div>
        <div class="actions-row action-actions-row">
          <button id="toggle-step-lock-btn" type="button" class="toolbar-icon-button" data-tooltip="切换动作锁定" title="切换动作锁定" aria-label="切换动作锁定">${renderAntIcon("lock")}</button>
          <button id="delete-action-btn" type="button" class="toolbar-icon-button" data-tooltip="删除选中动作" title="删除选中动作" aria-label="删除选中动作">${renderAntIcon("delete")}</button>
        </div>
        <div class="timeline-workspace">
          <div id="frame-list-panel" class="frame-list-panel"></div>
          <section class="frame-filter-panel" aria-label="帧内容过滤器">
            <span class="frame-filter-title">帧过滤</span>
            <input id="frame-visibility-slider" class="frame-visibility-slider" type="range" min="0" max="0" value="0" step="1" />
            <span id="frame-visibility-value" class="frame-filter-value">全部</span>
          </section>
        </div>
        <section id="frame-desc-editor" class="frame-desc-editor is-hidden">
          <h3>编辑帧描述</h3>
          <textarea id="frame-desc-input" rows="6" placeholder="输入帧描述，导出时会写入与原图同名的 Markdown 描述文件"></textarea>
          <div class="actions-row">
            <button id="frame-desc-cancel-btn" type="button">取消</button>
            <button id="frame-desc-save-btn" type="button">保存描述</button>
          </div>
        </section>
      </section>
    </aside>
  </div>
  <dialog id="export-dialog" class="settings-dialog export-dialog">
    <form method="dialog" class="settings-form export-dialog-form">
      <div class="panel-title-row export-dialog-head">
        <h3>导出</h3>
        <span class="panel-chip">ZIP 包</span>
      </div>
      <div class="export-dialog-status">
        <p id="selected-info">当前无选中项</p>
      </div>
      <div class="export-primary-actions">
        <button id="export-btn" type="button" class="export-btn"><span class="export-btn-text">导出步骤图 ZIP</span>${renderAntIcon("export")}</button>
        <button id="export-open-dir-btn" type="button" class="export-open-dir-btn">查看导出目录</button>
      </div>
      <p id="export-feedback" class="export-feedback export-feedback-dialog">尚未导出</p>
      <div class="export-preview-block">
        <h3>导出预览帧</h3>
        <ol id="export-frame-list" class="frame-list export-frame-list-dialog"></ol>
      </div>
      <div class="actions export-dialog-actions">
        <button id="export-close-btn" type="button">关闭</button>
      </div>
    </form>
  </dialog>
  <dialog id="settings-dialog" class="settings-dialog">
    <form method="dialog" class="settings-form">
      <h3>导出设置</h3>
      <div class="settings-tabs" role="tablist" aria-label="设置选项卡">
        <button id="setting-tab-save-path" type="button" class="settings-tab is-active" data-settings-tab="save-path" role="tab" aria-selected="true">保存路径</button>
        <button id="setting-tab-name-pattern" type="button" class="settings-tab" data-settings-tab="name-pattern" role="tab" aria-selected="false">命名格式</button>
        <button id="setting-tab-version-info" type="button" class="settings-tab" data-settings-tab="version-info" role="tab" aria-selected="false">版本信息</button>
      </div>
      <section class="settings-tab-panel is-active" data-settings-panel="save-path" role="tabpanel">
        <label>ZIP 默认保存路径<input id="setting-save-path" type="text" placeholder="例如 D:\\exports\\steps" /></label>
      </section>
      <section class="settings-tab-panel" data-settings-panel="name-pattern" role="tabpanel">
        <label>ZIP 导出名称<input id="setting-zip-name" type="text" placeholder="例如 示例步骤图.zip" /></label>
        <p id="setting-zip-name-tip" class="setting-tip">支持输入不带 .zip 的名称，保存时会自动补齐。</p>
        <label>步骤图命名格式<input id="setting-name-pattern" type="text" placeholder="例如 abcd[n3]" /></label>
        <p id="setting-pattern-tip" class="setting-tip">支持 [n3] 表示三位编号，如 abcd001。</p>
        <p id="setting-preview" class="setting-preview"></p>
      </section>
      <section class="settings-tab-panel" data-settings-panel="version-info" role="tabpanel">
        <section class="settings-info-block">
          <h4>版本信息</h4>
          <p id="setting-version-line-main" class="setting-version-text">-</p>
          <p id="setting-version-line-detail" class="setting-version-text">-</p>
          <p id="setting-version-line-time" class="setting-version-text">-</p>
        </section>
        <section class="settings-info-block">
          <h4>更新信息</h4>
          <ol id="setting-update-list" class="setting-update-list">
            <li>暂无更新信息</li>
          </ol>
        </section>
        <section class="settings-info-block">
          <h4>历史更新信息</h4>
          <div class="setting-history-scroll">
            <ol id="setting-history-list" class="setting-history-list">
              <li>暂无历史更新信息</li>
            </ol>
          </div>
          <p id="setting-history-file-path" class="setting-history-file-path">本地更新文件：-</p>
          <div class="actions">
            <button id="setting-open-history-btn" type="button">打开本地更新文件</button>
          </div>
        </section>
      </section>
      <div class="actions">
        <button id="setting-cancel-btn" type="button">取消</button>
        <button id="setting-save-btn" type="button">保存设置</button>
      </div>
    </form>
  </dialog>
`;
