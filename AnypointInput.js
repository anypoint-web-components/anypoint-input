import { html, css, LitElement } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { AnypointInputMixin } from './anypoint-input-mixin.js';
import commonStyles from './anypoint-input-styles.js';

const floatTypes = ['date', 'color', 'datetime-local', 'file', 'month', 'time', 'week'];

export class AnypointInput extends AnypointInputMixin(LitElement) {
  static get styles() {
    return [
      commonStyles,
      css`
      .input-element[type="datetime-local"] {
        /* For default 200px width this type expands outside the border */
        width: calc(100% - 40px);
        margin: 0 8px;
        padding: 0;
      }

      .prefixes ::slotted(*) {
        margin: 0 0 0 8px;
      }

      .suffixes ::slotted(*) {
        margin: 0 8px 0 0;
      }
      `
    ];
  }

  get _prefixed() {
    return this.querySelector('[slot=prefix]');
  }

  render() {
    const {
      value,
      _ariaLabelledBy,
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
      spellcheck,
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
        <div class="${labelClass}" id="${_ariaLabelledBy}">
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
          spellcheck="${ifDefined(spellcheck)}"
          .value="${bindValue}"
          @change="${this._onChange}"
          @input="${this._onInput}"
          @keypress="${this._onKeypress}"/>
      </div>
      <div class="suffixes">
        <slot name="suffix"></slot>
      </div>
    </div>
    <div class="assistive-info">
    ${infoMessage ? html`<p class="info${isInavlidWithMessage ? ' hidden' : ''}">${this.infoMessage}</p>` : undefined}
    ${invalidMessage ?
      html`<p
        class="invalid${invalid ? '' : ' hidden'}${infoMessage ? ' info-offset' : ''}"
        >${invalidMessage}</p>` :
      undefined}
    </div>
    `;
  }
}
