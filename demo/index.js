import { html } from "lit-html";
import { ArcDemoPage } from "@advanced-rest-client/arc-demo-helper/ArcDemoPage.js";
import "@advanced-rest-client/arc-demo-helper/arc-demo-helper.js";
import "@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js";
import "@anypoint-web-components/anypoint-radio-button/anypoint-radio-button.js";
import "@anypoint-web-components/anypoint-radio-button/anypoint-radio-group.js";
import "@anypoint-web-components/anypoint-styles/colors.js";
import "@anypoint-web-components/anypoint-button/anypoint-button.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "../anypoint-input.js";
import "./arc-interactive-demo.js";

// const hasFormAssociatedElements = 'attachInternals' in document.createElement('span');

class ComponentDemo extends ArcDemoPage {
  constructor() {
    super();
    this._componentName = "anypoint-input";
    this.initObservableProperties();
    this._readonlyHandler = this._readonlyHandler.bind(this);
    this._valueHandler = this._valueHandler.bind(this);
    this._textFiledStateHandler = this._textFiledStateHandler.bind(this);
    this._textFiledLeadingHandler = this._textFiledLeadingHandler.bind(this);
    this._textFiledTrailingHandler = this._textFiledTrailingHandler.bind(this);
    this._textFiledAssistiveHandler = this._textFiledAssistiveHandler.bind(
      this
    );
    this._textFiledTypeHandler = this._textFiledTypeHandler.bind(this);
    this.textFieldStates = ["Normal", "Outlined", "Legacy"];
    this.textFieldLegacy = false;
    this.textFieldOutlined = false;
    this.typeSelector = "text";
  }

  initObservableProperties() {
    [
      "readonly",
      "formData",
      "textFieldOutlined",
      "textFieldLegacy",
      "textFiledLeading",
      "textFiledTrailing",
      "textFieldError",
      "textFieldInfo",
      "typeSelector"
    ].forEach(item => {
      Object.defineProperty(this, item, {
        get() {
          return this["_" + item];
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
      document.body.classList.add("material");
    } else {
      document.body.classList.remove("material");
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

  _textFiledStateHandler(e) {
    const state = e.detail.value;
    switch (state) {
      case 0:
        this.textFieldOutlined = false;
        this.textFieldLegacy = false;
        break;
      case 1:
        this.textFieldOutlined = true;
        this.textFieldLegacy = false;
        break;
      case 2:
        this.textFieldOutlined = false;
        this.textFieldLegacy = true;
        break;
    }
  }

  _textFiledLeadingHandler(e) {
    this.textFiledLeading = e.target.checked;
  }

  _textFiledTrailingHandler(e) {
    this.textFiledTrailing = e.target.checked;
  }

  _textFiledAssistiveHandler(e) {
    const { name, checked } = e.target;
    if (!checked) {
      return;
    }
    if (name === "info") {
      this.textFieldError = false;
      this.textFieldInfo = true;
    } else if (name === "error") {
      this.textFieldError = true;
      this.textFieldInfo = false;
    } else {
      this.textFieldError = false;
      this.textFieldInfo = false;
    }
  }

  _textFiledTypeHandler(e) {
    const { name, checked } = e.target;
    if (!checked) {
      return;
    }
    this.typeSelector = name;
  }

  _headerControlsTemplate() {
    return html`
      <div class="settings-action-item">
        <paper-toggle-button @checked-changed="${this._darkThemeHandler}"
          >Toggle dark theme</paper-toggle-button
        >
      </div>
      <div class="settings-action-item">
        <paper-toggle-button @checked-changed="${this._mdHandler}"
          >Toggle material design</paper-toggle-button
        >
      </div>
      <div class="settings-action-item">
        <paper-toggle-button @checked-changed="${this._narrowHandler}"
          >Toggle narrow attribute</paper-toggle-button
        >
      </div>
      <div class="settings-action-item">
        <paper-toggle-button checked @checked-changed="${this._stylesHandler}"
          >Toggle styles</paper-toggle-button
        >
      </div>
    `;
  }

  _demoTemplate() {
    const {
      textFieldStates,
      textFieldOutlined,
      textFieldLegacy,
      darkThemeActive,
      textFiledLeading,
      textFiledTrailing,
      textFieldInfo,
      textFieldError
    } = this;
    const infoMessage = textFieldInfo ? "Assistive text label" : undefined;
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the text field element with various
          configuration options.
        </p>
        <arc-interactive-demo
          .states="${textFieldStates}"
          @state-chanegd="${this._textFiledStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <section slot="content">
            <anypoint-input
              title="Text field"
              ?outlined="${textFieldOutlined}"
              ?legacy="${textFieldLegacy}"
              .infoMessage="${infoMessage}"
              invalidmessage="This value is invalid"
              ?invalid="${textFieldError}"
            >
              <label slot="label">Label</label>
              ${textFiledLeading
                ? html`
                    <iron-icon icon="lock-outline" slot="prefix"></iron-icon>
                  `
                : undefined}
              ${textFiledTrailing
                ? html`
                    <iron-icon icon="clear" slot="suffix"></iron-icon>
                  `
                : undefined}
            </anypoint-input>
          </section>

          <label slot="options">Options</label>
          <anypoint-checkbox
            slot="options"
            @change="${this._textFiledLeadingHandler}"
            >Leading icon</anypoint-checkbox
          >
          <anypoint-checkbox
            slot="options"
            @change="${this._textFiledTrailingHandler}"
            >Trailing icon</anypoint-checkbox
          >

          <label slot="options">Assistive text</label>
          <anypoint-radio-group
            slot="options"
            selectable="anypoint-radio-button"
          >
            <anypoint-radio-button
              @change="${this._textFiledAssistiveHandler}"
              checked
              name="none"
              >None</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledAssistiveHandler}"
              name="info"
              >Info message</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledAssistiveHandler}"
              name="error"
              >Error text</anypoint-radio-button
            >
          </anypoint-radio-group>
        </arc-interactive-demo>
      </section>
    `;
  }

  _introductionTemplate() {
    return html`
      <section class="documentation-section">
        <h3>Introduction</h3>
        <p>
          This component is based on Material Design text field and adjusted for
          Anypoint platform components.
        </p>
        <p>
          Anypoint web components are set of components that allows to build
          Anypoint enabled UI in open source projects
        </p>
        <p>
          Text field allows the user to enter a value into the UI. It can appear
          in a <code>&lt;form&gt;</code> or a dialog.
        </p>
      </section>
    `;
  }

  _usageTemplate() {
    return html`
      <section class="documentation-section">
        <h2>Usage</h2>
        <p>Anypoint text field comes with 3 predefied styles:</p>
        <ul>
          <li><b>Filled</b> (normal) - For low emphasis inputs</li>
          <li><b>Outlined</b> - For high emphasis inputs</li>
          <li>
            <b>Legacy</b> - To provide compatibility with legacy Anypoint design
          </li>
        </ul>

        <p>
          See
          <a href="https://material.io/design/components/text-fields.html"
            >text fields</a
          >
          documentation in Material Defign documentation for principles and
          anatomy of text fields.
        </p>

        <h3>Choosing the right text field</h3>
        <p>
          Filled and outlined text fields provide the same functionality, so the
          type of text field you use can depend on style alone.
        </p>
        <p>
          Choose the right type that works well with application visual style,
          makes the imputs distinctive from other components like buttons and
          surrounding content, and best acommodates the goals of the UI. Note,
          that outlined buttons have higher emphasis than filled buttons.
          However, do not mix the two types in a single UI region.
        </p>

        <p>
          The legacy text filed style is for Anyponit native applications for
          easy integration. Every component including this element should expose
          the <code>legacy</code> property and propagate it to the text filed.
          An application importing the component can simply set this value to
          adjust styling to the general UI.
        </p>

        <h3>Prefixes and suffixes</h3>

        <p>
          Prefix is a widget rendered before the input field. Suffix is a widget
          rendered after the text field.
        </p>

        <p>
          When it make sense a prefix or suffix can be used to suggest right
          input. Fox example in cash amounf field input a prefix could be
          <code>$</code> sign which suggest the value is interpreted in US
          dollars.
        </p>

        <anypoint-input>
          <label slot="label">Amount to transfer</label>
          <span slot="prefix">$</span>
        </anypoint-input>

        <p>
          Similarly suffix can provide additional information about the format
          of input. For the same cach amount input suffix could render
          <code>.00</code> to suggest that the input is an integer.
        </p>

        <anypoint-input>
          <label slot="label">Amount to transfer</label>
          <span slot="suffix">.00</span>
        </anypoint-input>

        <p>
          Suffixes can also be active widget. It can be an icon button that
          toggles visibility of the password. Just remember that adding
          interactive suffixes is not a common design pattern and your suffix
          has to have clear meaning to the user.
        </p>

        <anypoint-input type="password">
          <label slot="label">Password</label>
          <anypoint-button slot="suffix" onclick="this.parentNode.type='text'"
            >Show</anypoint-button
          >
        </anypoint-input>

        <h3>Assistive text</h3>

        <p>
          Assistive text allows the user to better understand what input is
          required. It can be an info message or invalid message when invalid
          input has been detected.
        </p>

        <h4>Info message</h4>
        <p>
          Info message provides the user with additional description for the
          field. It should be used when the label can be confusing or to ensure
          the user about the reason of collecting the input.
        </p>

        <anypoint-input infomessage="Used to confirm your order." type="email">
          <label slot="label">Email</label>
        </anypoint-input>

        <p>
          Do not try to put too detailed information. The user should be able to
          scan the message in a fraction of a second. Treat it as an additional
          text for the label.
        </p>

        <h4>Invalid message</h4>
        <p>
          Error message should help the user recover from the error state. Use
          clear message with simple instructions of how to fix the problem, for
          example <code>Only letters are allowed.</code>.
        </p>

        <anypoint-input
          invalidmessage="Only letters are allowed"
          type="text"
          invalid
        >
          <label slot="label">Username</label>
        </anypoint-input>

        <p>
          Note, consider using <code>preventInvalidInput</code> and
          <code>allowedPattern</code>
          in situations like the one above. However, don't be too restrictive
          when using this properties.
        </p>
      </section>
    `;
  }

  _typesTemplate() {
    const {
      textFieldStates,
      textFieldOutlined,
      textFieldLegacy,
      darkThemeActive,
      typeSelector
    } = this;
    return html`
      <section class="documentation-section">
        <h3>Input types</h3>
        <p>
          The component support all native input types.
        </p>

        <arc-interactive-demo
          opened
          .states="${textFieldStates}"
          @state-chanegd="${this._textFiledStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <anypoint-input
            slot="content"
            title="Text field"
            ?outlined="${textFieldOutlined}"
            ?legacy="${textFieldLegacy}"
            .type="${typeSelector}"
          >
            <label slot="label">Text field</label>
          </anypoint-input>

          <label slot="options">Input type</label>
          <anypoint-radio-group
            slot="options"
            selectable="anypoint-radio-button"
          >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              checked
              name="text"
              >Text</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="number"
              >Number</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="password"
              >Password</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="date"
              >Date</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="time"
              >Time</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="datetime-local"
              >Datetime-local</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="month"
              >Month</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="week"
              >Week</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="color"
              >Color</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="email"
              >Email</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="url"
              >URL</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="tel"
              >Tel</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="search"
              >Search</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="file"
              >File</anypoint-radio-button
            >
          </anypoint-radio-group>
        </arc-interactive-demo>
      </section>
    `;
  }

  contentTemplate() {
    return html`
      <h2>Anypoint text field</h2>
      ${this._demoTemplate()} ${this._introductionTemplate()}
      ${this._usageTemplate()} ${this._typesTemplate()}
    `;
  }
}
const instance = new ComponentDemo();
instance.render();
window.demo = instance;
