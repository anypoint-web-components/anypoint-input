import { html, css, LitElement } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { AnypointInputMixin } from './anypoint-input-mixin.js';

const floatTypes = ['date', 'color', 'datetime-local', 'file', 'month', 'time', 'week'];

export class AnypointInput extends AnypointInputMixin(LitElement) {
  static get styles() {
    return css`
    :host {
      /* Default size of an <input> */
      width: 200px;
      display: block;
      text-align: left;
      cursor: default;
      outline: none;
      height: 56px;
      box-sizing: border-box;
      font-size: 1rem;
      position: relative;
      /* ANypoint UI controls margin in forms */
      margin: 12px 8px;
    }

    .input-container {
      display: inline-flex;
      flex-direction: row;
      align-items: center;

      position: relative;
      height: 100%;
      width: 100%;
      background-color: var(--anypoint-input-background-color, #F5F5F5);

      border: 1px var(--anypoint-input-border-color, transparent) solid;
      border-radius: 4px 4px 0 0;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      border-bottom-color: var(--anypoint-input-border-bottom-color, #8e8e8e);
      transition: border-bottom-color 0.22s linear;
      transform-origin: center center;

      cursor: text;
    }

    :host([focused]) .input-container {
      border-bottom-color: var(--anypoint-input-focused-border-bottom-color, var(--accent-color));
    }

    :host([invalid]) .input-container {
      border-bottom-color: var(--anypoint-input-error-color, var(--error-color)) !important;
    }

    .input-label {
      position: relative;
      height: 100%;
      flex: 1;

      display: inline-flex;
      flex-direction: row;
      align-items: center;
    }

    .label {
      position: absolute;
      transition: transform 0.12s ease-in-out, max-width 0.12s ease-in-out;
      will-change: top;
      border-radius: 3px;
      margin: 0;
      padding: 0;
      left: 6px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      z-index: 1;
      will-change: transform;
      max-width: calc(100% - 16px);
      text-overflow: clip;
      color: var(--anypoint-input-label-color, #616161);
      transform-origin: left top;
    }

    :host([invalid]) .label {
      color: var(--anypoint-input-error-color, var(--error-color)) !important;
    }

    .input-element {
      position: relative;
      top: 6px;
      width: 100%;
      height: 24px;
      border: none;
      outline: none;
      background-color: transparent;
      padding: 0 8px;
      box-sizing: border-box;
      color: var(--anypoint-input-input-color, inherit);
    }

    .input-element[type="datetime-local"] {
      /* For default 200px width this type expands outside the border */
      width: calc(100% - 40px);
      margin: 0 8px;
      padding: 0;
    }

    .label.resting {
      top: calc(100% / 2 - 8px);
    }

    .label.floating {
      transform: translateY(-80%) scale(0.75);
      max-width: calc(100% + 20%);
    }

    .prefixes ::slotted(*) {
      margin: 0 0 0 8px;
    }

    .suffixes ::slotted(*) {
      margin: 0 8px 0 0;
    }

    .assistive-info {
      overflow: hidden;
    }

    .invalid,
    .info {
      padding: 0;
      margin: 0 0 0 8px;
      font-size: .875rem;
      transition: transform 0.12s ease-in-out;
    }

    .info {
      color: #616161;
    }

    .info.hidden {
      transform: translateY(-200%);
    }

    .invalid {
      color: var(--anypoint-input-error-color, var(--error-color));
    }

    .invalid.hidden,
    .invalid.info-offset.hidden {
      transform: translateY(-200%);
    }

    .invalid.info-offset {
      transform: translateY(-12px);
    }

    /* Outlined theme */
    :host([outlined]) .input-container {
      border: 1px var(--anypoint-input-border-color, #8e8e8e) solid;
      background-color: var(--anypoint-input-background-color, #fff);
      border-radius: 4px;
      transition: border-bottom-color 0.22s linear;
    }

    :host([outlined]) .input-element {
      margin-top: 0;
      top: 0;
    }

    :host([outlined]) .label.resting {
      margin-top: 0;
      top: calc(100% / 2 - 8px);
    }

    :host([outlined]) .label.floating {
      background-color: var(--anypoint-input-label-background-color, white);
      transform: translateY(-137%) scale(0.75);
      max-width: 120%;
      padding: 0 2px;
    }

    :host([outlined]) .label.floating.with-prefix {
      left: -22px;
    }

    :host([legacy]) {
      height: 40px;
      margin-top: 20px;
    }

    :host([legacy]) .input-container {
      border: none;
      border-left: 2px var(--anypoint-input-border-color, #8e8e8e) solid;
      border-right: 2px var(--anypoint-input-border-color, #8e8e8e) solid;
      border-radius: 0;
      box-sizing: border-box;
    }

    :host([legacy][focused]) .input-container,
    :host([legacy]:hover) .input-container {
      border-left-color: var(--anypoint-input-legacy-focus-border-color, #58595a);
      border-right-color: var(--anypoint-input-legacy-focus-border-color, #58595a);
      background-color: var(--anypoint-input-legacy-focus-background-color, #f9fafb);
    }

    :host([legacy][invalid]) .input-container {
      border-left-color: var(--anypoint-input-error-color, var(--error-color));
      border-right-color: var(--anypoint-input-error-color, var(--error-color));
    }

    :host([legacy]) .input-element {
      top: 0;
    }

    :host([legacy]) .label {
      font-size: .875rem;
      left: 0;
      top: -18px;
      transform: none;
      font-weight: 500;
      color: var(--anypoint-input-legacy-label-color, #616161);
    }

    :host([legacy]) .label.with-prefix {
      left: -34px;
    }
    `;
  }

  get _prefixed() {
    return this.querySelector('[slot=prefix]');
  }

  render() {
    const {
      value,
      _ariaLabelledBy,
      _ariaDescribedBy,
      disabled,
      type,
      pattern,
      required,
      autocomplete,
      autofocus,
      inputMode,
      minLength,
      maxLength,
      min,
      max,
      step,
      name,
      placeholder,
      readOnly,
      list,
      size,
      autocapitalize,
      autocorrect,
      results,
      accept,
      multiple,
      invalidMessage,
      infoMessage,
      invalid,
      _prefixed
    } = this;
    const labelFloating = !!value || floatTypes.indexOf(type) !== -1 || !!placeholder || this.focused;
    const bindValue = value || '';
    const isInavlidWithMessage = !!invalidMessage && invalid;

    const labelClass = 'label' + (_prefixed ? ' with-prefix' : '') + (labelFloating ? ' floating' : ' resting');
    return html`
    <div class="input-container">
      <div class="prefixes">
        <slot name="prefix"></slot>
      </div>

      <div class="input-label">
        <div class="${labelClass}">
          <slot name="label"></slot>
        </div>
        <input
          class="input-element"
          aria-labelledby="${_ariaLabelledBy}"
          ?disabled="${disabled}"
          type="${ifDefined(type)}"
          pattern="${ifDefined(pattern)}"
          ?required="${required}"
          autocomplete="${ifDefined(autocomplete)}"
          ?autofocus="${autofocus}"
          inputmode="${ifDefined(inputMode)}"
          minlength="${ifDefined(minLength ? minLength : undefined)}"
          maxlength="${ifDefined(maxLength ? maxLength: undefined)}"
          min="${ifDefined(min)}"
          max="${ifDefined(max)}"
          step="${ifDefined(step)}"
          name="${ifDefined(name)}"
          placeholder="${ifDefined(placeholder)}"
          readonly="${ifDefined(readOnly)}"
          list="${ifDefined(list)}"
          size="${ifDefined(size)}"
          autocapitalize="${ifDefined(autocapitalize)}"
          autocorrect="${ifDefined(autocorrect)}"
          tabindex="-1"
          results="${ifDefined(results)}"
          accept="${ifDefined(accept)}"
          ?multiple="${multiple}"
          .value="${bindValue}"
          @change="${this._onChange}"
          @input="${this._onInput}"
          @keypress="${this._onKeypress}">
      </div>
      <div class="suffixes">
        <slot name="suffix"></slot>
      </div>
    </div>
    <div class="assistive-info">
    ${infoMessage ? html`<p class="info${isInavlidWithMessage ? ' hidden' : ''}">${this.infoMessage}</p>` : undefined}
    ${invalidMessage ?
      html`<p class="invalid${invalid ? '' : ' hidden'}${infoMessage ? ' info-offset' : ''}">${invalidMessage}</p>` :
      undefined}
    </div>
    `;
  }
}
