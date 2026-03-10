export const APP_TEMPLATE = `
  <div class="layout">
    <section class="canvas-panel">
      <header class="panel-header">
        <h1>imagesPlayEditor</h1>
        <span id="status-text" class="status">就绪</span>
      </header>
      <div class="toolbar toolbar-surface">
        <div class="toolbar-row toolbar-row-main">
          <label class="file-label toolbar-file-label">
            <span class="btn-icon" aria-hidden="true">▣</span>
            <span class="file-label-text">加载图片</span>
            <input id="image-input" type="file" accept="image/*" />
          </label>
          <div class="tool-group toolbar-tool-group">
            <button type="button" data-tool="select"><span class="btn-icon" aria-hidden="true">⌖</span><span>选择</span></button>
            <button type="button" data-tool="box"><span class="btn-icon" aria-hidden="true">□</span><span>框选</span></button>
            <button type="button" data-tool="arrow"><span class="btn-icon" aria-hidden="true">➤</span><span>箭头</span></button>
            <button type="button" data-tool="text"><span class="btn-icon" aria-hidden="true">T</span><span>文字</span></button>
          </div>
          <button id="open-export-panel-btn" type="button" class="toolbar-export-btn"><span class="btn-icon" aria-hidden="true">⇩</span><span>导出</span></button>
          <button id="settings-btn" type="button" class="toolbar-settings-btn"><span class="btn-icon" aria-hidden="true">⚙</span><span>设置</span></button>
        </div>
        <div class="style-inline-group toolbar-style-group">
          <label class="color-only"><input id="style-color" type="color" value="#ef4444" /></label>
          <label>线宽(%短边) <input id="style-stroke" type="number" min="0.05" max="5" step="0.05" value="0.3" /></label>
          <label>箭头长度(%短边) <input id="style-arrow" type="number" min="0.2" max="12" step="0.1" value="1.6" /></label>
          <label>字号(%短边) <input id="style-font" type="number" min="0.4" max="16" step="0.1" value="2.4" /></label>
          <button id="apply-style-btn" type="button"><span class="btn-icon" aria-hidden="true">✓</span><span>更新默认绘制样式</span></button>
        </div>
      </div>
      <div id="canvas-shell" class="canvas-shell">
        <div id="stage-container" class="stage-container"></div>
      </div>
    </section>
    <aside class="side-panel">
      <section class="timeline-panel side-card">
        <div class="panel-title-row">
          <h2>帧列表</h2>
          <span class="panel-chip">动作可拖拽</span>
        </div>
        <div class="actions-row frame-actions-row">
          <button id="add-empty-frame-btn" type="button"><span class="btn-icon" aria-hidden="true">＋</span><span>添加空帧</span></button>
          <button id="add-clear-btn" type="button"><span class="btn-icon" aria-hidden="true">⌫</span><span>切换选中帧前清空</span></button>
          <button id="toggle-frame-focus-btn" type="button"><span class="btn-icon" aria-hidden="true">◎</span><span>仅显示当前帧</span></button>
        </div>
        <div class="actions-divider" aria-hidden="true"></div>
        <div class="actions-row action-actions-row">
          <button id="toggle-step-lock-btn" type="button"><span class="btn-icon" aria-hidden="true">⛶</span><span>切换动作锁定</span></button>
          <button id="delete-action-btn" type="button"><span class="btn-icon" aria-hidden="true">×</span><span>删除选中动作</span></button>
        </div>
        <div id="frame-list-panel" class="frame-list-panel"></div>
        <section id="frame-desc-editor" class="frame-desc-editor is-hidden">
          <h3>编辑帧描述</h3>
          <textarea id="frame-desc-input" rows="6" placeholder="输入帧描述，导出时会写入 frame-descriptions.md"></textarea>
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
      <button id="export-btn" type="button" class="export-btn"><span class="btn-icon" aria-hidden="true">⇩</span><span>导出步骤图 ZIP</span></button>
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
      <label>默认保存路径<input id="setting-save-path" type="text" placeholder="例如 D:\\exports\\steps" /></label>
      <label>命名格式<input id="setting-name-pattern" type="text" placeholder="例如 abcd[n3]" /></label>
      <p id="setting-pattern-tip" class="setting-tip">支持 [n3] 表示三位编号，如 abcd001。</p>
      <p id="setting-preview" class="setting-preview"></p>
      <div class="actions">
        <button id="setting-cancel-btn" type="button">取消</button>
        <button id="setting-save-btn" type="button">保存设置</button>
      </div>
    </form>
  </dialog>
`;
