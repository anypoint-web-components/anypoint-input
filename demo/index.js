import { html } from 'lit-html';
import { ArcDemoPage } from '@advanced-rest-client/arc-demo-helper/ArcDemoPage.js';
import '@advanced-rest-client/arc-demo-helper/arc-demo-helper.js';
import '../anypoint-input.js';

// const hasFormAssociatedElements = 'attachInternals' in document.createElement('span');

class ComponentDemo extends ArcDemoPage {
  constructor() {
    super();
    this._componentName = 'anypoint-input';
    this.initObservableProperties();
    this._readonlyHandler = this._readonlyHandler.bind(this);
    this._valueHandler = this._valueHandler.bind(this);
  }

  initObservableProperties() {
    [
      'readonly', 'formData', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10', 'v11'
    ].forEach((item) => {
      Object.defineProperty(this, item, {
        get() {
          return this['_' + item];
        },
        set(newValue) {
          this._setObservableProperty(item, newValue);
        },
        enumerable: true,
        configurable: true
      });
    });
  }

  _readonlyHandler(e) {
    this.readonly = e.target.checked;
  }

  _valueHandler(e) {
    const prop = e.target.dataset.target;
    this[prop] = e.detail.value;
  }

  _mdHandler(e) {
    if (e.target.checked) {
      document.body.classList.add('material');
    } else {
      document.body.classList.remove('material');
    }
  }

  _formSubmit(e) {
    e.preventDefault();
    const result = {};
    for (let i = 0; i < e.target.elements.length; i++) {
      const node = e.target.elements[i];
      if (!node.name) {
        continue;
      }
      result[node.name] = node.value;
    }
    this.formData = JSON.stringify(result, null, 2);
  }

  _headerControlsTemplate() {
    return html`<div class="settings-action-item">
      <paper-toggle-button @checked-changed="${this._darkThemeHandler}">Toggle dark theme</paper-toggle-button>
    </div>
    <div class="settings-action-item">
      <paper-toggle-button @checked-changed="${this._mdHandler}">Toggle material design</paper-toggle-button>
    </div>
    <div class="settings-action-item">
      <paper-toggle-button @checked-changed="${this._narrowHandler}">Toggle narrow attribute</paper-toggle-button>
    </div>
    <div class="settings-action-item">
      <paper-toggle-button checked @checked-changed="${this._stylesHandler}">Toggle styles</paper-toggle-button>
    </div>`;
  }

  contentTemplate() {
    return html`

    <div class="card">
      <h3>Inputs can have different types, and be disabled</h3>
      <arc-demo-helper>
        <template>
          <anypoint-input title="Simple text input">
            <label slot="label">Text input</label>
          </anypoint-input>
          <anypoint-input type="password">
            <label slot="label">Password input</label>
          </anypoint-input>
          <anypoint-input disabled>
            <label slot="label">Disabled input</label>
          </anypoint-input>
          <anypoint-input type="date">
            <label slot="label">Inputs can be a date input</label>
          </anypoint-input>
          <anypoint-input placeholder="Placeholder has higher priority than label">
            <label slot="label">Placaholder input</label>
          </anypoint-input>
          <anypoint-input type="color">
            <label slot="label">Color input</label>
          </anypoint-input>
          <anypoint-input type="datetime-local">
            <label slot="label">Datetime-local input</label>
          </anypoint-input>

          <anypoint-input type="email">
            <label slot="label">Email input</label>
          </anypoint-input>

          <anypoint-input type="file">
            <label slot="label">File input</label>
          </anypoint-input>

          <anypoint-input type="month">
            <label slot="label">Month input</label>
          </anypoint-input>

          <anypoint-input type="number">
            <label slot="label">Number input</label>
          </anypoint-input>

          <anypoint-input type="search">
            <label slot="label">Search input</label>
          </anypoint-input>

          <anypoint-input type="tel">
            <label slot="label">Tel input</label>
          </anypoint-input>

          <anypoint-input type="time">
            <label slot="label">Time input</label>
          </anypoint-input>

          <anypoint-input type="url">
            <label slot="label">URL input</label>
          </anypoint-input>

          <anypoint-input type="week">
            <label slot="label">Week input</label>
          </anypoint-input>
          <!-- <paper-textarea class="tarea" label="Textarea input"></paper-textarea> -->
          <!-- <custom-style>
            <style>.tarea{ height: 120px;}</style>
          </custom-style> -->
        </template>
      </arc-demo-helper>
    </div>

    <div class="card">
      <h3>Inputs can validate automatically or on demand, and can have custom error messages</h3>
      <arc-demo-helper>
        <template>
          <anypoint-input required autovalidate errormessage="needs some text!">
            <label slot="label">this input requires some text</label>
          </anypoint-input>
          <anypoint-input autovalidate pattern="[a-zA-Z]*" errormessage="letters only!">
            <label slot="label">this input requires letters only</label>
          </anypoint-input>
          <anypoint-input autovalidate allowedpattern="[a-zA-Z]">
            <label slot="label">this input will only let you type letters</label>
          </anypoint-input>
          <anypoint-input id="inputForValidation" required pattern="[a-zA-Z]*" errormessage="letters only!">
            <label slot="label">this input is manually validated</label>
          </anypoint-input>
          <button onclick="validate()">Validate!</button>
        </template>
      </arc-demo-helper>
    </div>


    <div class="card">
      <h3>Basic</h3>
      <anypoint-input
        data-target="v1"
        @value-changed="${this._valueHandler}">
        <label slot="label">Type a text</label>
      </anypoint-input>

      <code>${this.v1}</code>
    </div>
    `;
  }
}
const instance = new ComponentDemo();
instance.render();
window.demo = instance;
