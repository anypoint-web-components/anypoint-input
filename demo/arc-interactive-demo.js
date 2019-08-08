import { html, css, LitElement } from 'lit-element';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';

export class ArcInteractiveDemo extends LitElement {
  static get styles() {
    return css`
    :host {
      display: flex;
      flex-direction: row;
      border: 1px var(--arc-interactive-demo-border-color, #e5e5e5) solid;
      border-radius: 4px;
      min-height: 300px;
      margin: 40px 0;
      transition: box-shadow 0.23s cubic-bezier(0.4, 0, 0.2, 1);
      --paper-tabs-selection-bar-color: var(--arc-interactive-demo-tab-selection-color, #2196f3);
    }

    :host(:hover) {
      box-shadow: 0 0 8px 0 rgba(0,0,0,.08),
                  0 0 15px 0 rgba(0,0,0,.02),
                  0 0 20px 4px rgba(0,0,0,.06);
    }

    .demo-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .demo-config {
      width: 0px;
      overflow: hidden;
      box-sizing: border-box;
      transition: width 0.12s ease-in-out;
    }

    .demo-config.opened {
      width: var(--arc-interactive-demo-config-width, 160px);
      overflow: auto;
      border-left: 1px var(--arc-interactive-demo-border-color, #e5e5e5) solid;
    }

    .content-selector {
      display: flex;
      align-items: center;
      flex-direction: row;
      border-bottom: 1px var(--arc-interactive-demo-border-color, #e5e5e5) solid;
    }

    .content {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
    }

    .content ::slotted([hidden]) {
      display: none !important;
    }

    paper-tabs {
      margin: 0 12px;
      flex: 1;
    }

    paper-tab {
      flex: none;
      color: var(--arc-interactive-demo-options-color, #757575);
    }

    .config-title {
      display: flex;
      align-items: center;
      flex-direction: row;
      border-bottom: 1px var(--arc-interactive-demo-border-color, #e5e5e5) solid;
      padding-left: 12px;
      color: var(--arc-interactive-demo-options-color, #757575);
    }

    .config-title h3 {
      flex: 1;
      font-size: .875rem;
      line-height: 1.25rem;
      font-weight: 400;
    }

    .options {
      padding-left: 12px;
    }

    .options ::slotted(label) {
      font-size: .875rem;
      line-height: 1.25rem;
      font-weight: 400;
      color: var(--arc-interactive-demo-options-color, #757575);
      display: block;
      padding: 12px 8px 4px 0px;
    }

    :host([dark]) paper-tab {
      color: var(--arc-interactive-demo-header-color, #EEEEEE);
    }

    :host([dark]) .config-title {
      color: var(--arc-interactive-demo-header-color, #EEEEEE);
    }
    `;
  }

  static get properties() {
    return {
      /**
       * True when the configuration panel is opened.
       */
      opened: { type: Boolean },
      /**
       * The list of general style states for the element.
       * It renders list of tabs with labels from this array.
       *
       * @type {Array<String>}
       */
      states: { type: Array },
      /**
       * Currently selected state's index in the `states` array.
       * Change dispatches `state-chanegd` custom event.
       * @type {Object}
       */
      selectedState: { type: Number },
      /**
       * When set it renders the component in dark theme.
       */
      dark: { type: Boolean, reflect: true }
    };
  }

  get tabs() {
    return this.shadowRoot.querySelector('paper-tabs');
  }

  get selectedState() {
    return this._selectedState;
  }

  set selectedState(value) {
    const old = this._selectedState;
    if (old === value) {
      return;
    }
    this._selectedState = value;
    this.requestUpdate('selectedState', old);
    this.dispatchEvent(new CustomEvent('state-chanegd', {
      detail: {
        value,
        state: this.states[value]
      }
    }));
  }

  get opened() {
    return this._opened;
  }

  set opened(value) {
    const old = this._opened;
    if (old === value) {
      return;
    }
    this._opened = value;
    this.requestUpdate('opened', old);
    this._updateTabsAnimation();
  }

  constructor() {
    super();
    this.opened = false;
    this.states = [];
    this.selectedState = 0;
  }

  _stateChangeHandler(e) {
    this.selectedState = e.detail.value;
  }

  _toggleOptions() {
    this.opened = !this.opened;
  }

  _updateTabsAnimation() {
    if (this._updateTabsTimer) {
      clearTimeout(this._updateTabsTimer);
    }
    this._updateTabsTimer = setTimeout(() => {
      this._updateTabsTimer = undefined;
      this.tabs.notifyResize();
    }, 120);
  }

  render() {
    const { states, selectedState, opened } = this;
    return html`
    <div class="demo-content">
      <div class="content-selector">
        <paper-tabs .selected="${selectedState}" @selected-changed="${this._stateChangeHandler}">
          ${states.map((item) => html`<paper-tab>${item}</paper-tab>`)}
        </paper-tabs>
        <anypoint-button ?hidden=${opened} @click="${this._toggleOptions}">Options</anypoint-button>
      </div>
      <div class="content">
        <slot name="content"></slot>
      </div>
    </div>

    <div class="demo-config ${opened ? 'opened' : ''}">
      <div class="config-title">
        <h3>Configuration</h3>
        <anypoint-icon-button @click="${this._toggleOptions}">
          <button title="Close panel" aria-label="Close configuration panel">
            <iron-icon icon="close"></iron-icon>
          </button>
        </anypoint-icon-button>
      </div>
      <div class="options">
        <slot name="options"></slot>
      </div>
    </div>
    `;
  }
}
window.customElements.define('arc-interactive-demo', ArcInteractiveDemo);
