import { html, css, LitElement } from 'lit-element';
import { AnypointInputMixin } from './anypoint-input-mixin.js';

const floatTypes = ['date', 'color', 'datetime-local', 'file', 'month', 'time', 'week'];

export class AnypointInput extends AnypointInputMixin(LitElement) {
  static get styles() {
    return css`
    :host {
      /* Default size of an <input> */
      width: 200px;
      display: inline-block;
      position: relative;
      text-align: left;
      cursor: default;
      outline: none;
      height: 56px;
      box-sizing: border-box;
      margin: 12px 8px;
    }

    :host([disabled]) .input-element {
      opacity: var(--anypoint-input-disabled-opacity, 0.33);
    }

    :host([disabled]) .label.without-value {
      opacity: var(--anypoint-input-disabled-opacity, 0.33);
    }

    :host([invalid]) .input-container,
    :host(:invalid) .input-container {
      border-bottom-color: var(--anypoint-input-error-color, var(--error-color));
    }

    .input-container {
      position: relative;
      height: 100%;
      border: 1px var(--anypoint-input-border-color, transparent) solid;
      background-color: var(--anypoint-input-background-color, #F5F5F5);
      border-radius: 4px 4px 0 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: text;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      border-bottom-color: #8e8e8e;
      transition: border-bottom-color 0.12s linear;
    }

    .input-element {
      position: relative;
      top: 4px;
      width: 100%;
      height: 24px;
      border: none;
      outline: none;
      background-color: transparent;
      font-size: 1rem;
      padding: 0 8px;
      margin-top: 2px;
      box-sizing: border-box;
    }

    :host([outlined]) .input-element {
      top: auto;
    }

    .input-element[type="color"] {
      height: 20px;
    }

    .input-element[type="file"] {
      height: 20px;
    }

    .label {
      position: absolute;
      font-size: 1rem;
      transition: transform 0.12s ease-in-out, max-width 0.12s ease-in-out;
      will-change: top;
      border-radius: 3px;
      margin: 0;
      padding: 0;
      left: 8px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      z-index: 1;
      will-change: transform;
      max-width: calc(100% - 16px);
      text-overflow: clip;
      color: #616161;
      transform-origin: left top;
    }

    :host(:dir(rtl)) .label {
      text-align: right;
      right: 8px;
      left: auto;
    }
    /* Not every browser support syntax above and for those who doesn't
      this style has to be repeated or it won't be applied. */
    :host([dir="rtl"]) .label {
      text-align: right;
      right: 8px;
      left: auto;
    }

    .label.without-value {
      top: calc(100% / 2 - 8px);
      font-size: 1rem;
    }

    .label.with-value {
      transform: translateY(-80%) scale(0.75);
      max-width: calc(100% + 20%);
    }

    :host([outlined]) .label.with-value {
      background-color: var(--anypoint-input-label-background-color, white);
      transform: translateY(-130%) translateX(-13%) scale(0.75);
      max-width: calc(100% + 20%);
    }

    .label ::slotted(label) {
      cursor: text;
    }

    .invalid {
      padding: 0;
      margin: 0;
      position: absolute;
      bottom: -16px;
      font-size: 13px;
      left: 8px;
      color: var(--anypoint-input-error-color, var(--error-color));
    }
    `;
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
      readonly,
      list,
      size,
      autocapitalize,
      autocorrect,
      results,
      accept,
      multiple
    } = this;
    const labelWithValue = !!value || floatTypes.indexOf(type) !== -1 || !!placeholder || this.focused;
    const bindValue = value || '';
    return html`
    <div class="input-container">
      <slot name="prefix"></slot>
      <div class="label ${labelWithValue ? 'with-value' : 'without-value'}">
        <slot name="label"></slot>
      </div>
      <input
        class="input-element"
        aria-labelledby="${_ariaLabelledBy}"
        aria-describedby="${_ariaDescribedBy}"
        ?disabled="${disabled}"
        type="${type}"
        .pattern="${pattern}"
        ?required="${required}"
        .autocomplete="${autocomplete}"
        ?autofocus="${autofocus}"
        .inputMode="${inputMode}"
        .minLength="${minLength}"
        .manLength="${maxLength}"
        .min="${min}"
        .max="${max}"
        .step="${step}"
        name="${name}"
        .placeholder="${placeholder}"
        .readOnly="${readonly}"
        list="${list}"
        size="${size}"
        .autocapitalize="${autocapitalize}"
        .autocorrect="${autocorrect}"
        tabindex="-1"
        .results="${results}"
        .accept="${accept}"
        ?multiple="${multiple}"
        value="${bindValue}"
        @change="${this._onChange}"
        @input="${this._onInput}"
        @keypress="${this._onKeypress}">
      <slot name="suffix"></slot>
    </div>
    ${this.hasValidationMessage && this.invalid ? html`<p class="invalid">${this.errorMessage}</p>` : undefined}
    `;
  }
}
