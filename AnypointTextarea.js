import { html, css, LitElement } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { AnypointInputMixin } from './anypoint-input-mixin.js';
import commonStyles from './anypoint-input-styles.js';
const floatTypes = ['date', 'color', 'datetime-local', 'file', 'month', 'time', 'week'];

export class AnypointTeaxtarea extends AnypointInputMixin(LitElement) {
  static get styles() {
    return [
      commonStyles,
      css`
        :host {
          min-height: 96px;
          min-width: 200px;
          width: auto;
          height: auto;
        }

        .textarea .label {
          left: 8px;
          top: 8px;
        }

        .textarea .input-label {
          align-items: start;
        }

        .textarea .label.resting {
          transform: scale(0.75);
        }

        .textarea .label.floating {
          top: 8px;
          transform: scale(0.75);
        }

        .input-container {
          min-height: inherit;
        }

        .input-label {
          min-height: inherit;
        }

        .input-element {
          height: calc(100% - 16px);
          min-height: inherit;
          margin: 20px 0 8px 0;
        }

        :host([outlined]) .label.resting {
          margin-top: 0px;
          top: 8px;
          transform: scale(1);
        }

        :host([outlined]) .label.floating {
          transform: translateY(-15px) scale(0.75);
        }

        :host([outlined]) .input-element {
          margin-top: 8px;
          top: 0;
        }

        :host([legacy]) {
          height: auto;
        }

        :host([legacy]) .textarea .label {
          top: -18px;
          transform: none;
        }

        :host([legacy]) .textarea .input-element {
          margin: 0;
        }
      `
    ];
  }

  get _prefixed() {
    return this.querySelector('[slot=prefix]');
  }

  static get properties() {
    return {
      /**
       * Binds this to the `<textarea>`'s `cols` property.
       */
      cols: { type: Number },
      /**
       * Binds this to the `<textarea>`'s `rows` property.
       */
      rows: { type: Number },
      /**
       * Binds this to the `<textarea>`'s `wrap` property.
       */
      wrap: { type: String }
    };
  }

  render() {
    const {
      value,
      _ariaLabelledBy,
      disabled,
      type,
      cols,
      rows,
      spellcheck,
      required,
      autocomplete,
      autofocus,
      inputMode,
      minLength,
      maxLength,
      wrap,
      name,
      placeholder,
      readOnly,
      autocapitalize,
      autocorrect,
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
      <div class="textarea input-label">
        <div class="${labelClass}" id="${_ariaLabelledBy}">
          <slot name="label"></slot>
        </div>
        <textarea
          class="input-element"
          aria-labelledby="${_ariaLabelledBy}"
          autocomplete="${ifDefined(autocomplete)}"
          autocapitalize="${ifDefined(autocapitalize)}"
          autocorrect="${ifDefined(autocorrect)}"
          ?autofocus="${autofocus}"
          cols="${ifDefined(cols)}"
          ?disabled="${disabled}"
          inputmode="${ifDefined(inputMode)}"
          maxlength="${ifDefined(maxLength ? maxLength: undefined)}"
          minlength="${ifDefined(minLength ? minLength : undefined)}"
          name="${ifDefined(name)}"
          placeholder="${ifDefined(placeholder)}"
          ?required="${required}"
          readonly="${ifDefined(readOnly)}"
          rows="${ifDefined(rows)}"
          spellcheck="${ifDefined(spellcheck)}"
          tabindex="-1"
          wrap="${ifDefined(wrap)}"
          .value="${bindValue}"
          @change="${this._onChange}"
          @input="${this._onInput}"
          @keypress="${this._onKeypress}"></textarea>
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
