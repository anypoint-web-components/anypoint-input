import { ControlStateMixin } from '@anypoint-web-components/anypoint-control-mixins/control-state-mixin.js';
import { ValidatableMixin } from '@anypoint-web-components/validatable-mixin/validatable-mixin.js';
let nextLabelID = 0;
/**
 * Use `AnypointInputMixin` to implement accessible inputs
 *
 * @mixinFunction
 * @appliesMixin ControlStateMixin
 * @param {Class} base
 * @return {Class}
 */
export const AnypointInputMixin = (base) => class extends ValidatableMixin(ControlStateMixin(base)) {
  /**
   * For form-associated custom elements. Marks this custom element
   * as form enabled element.
   */
  static get formAssociated() {
    return true;
  }
  /**
   * When form-associated custom elements are supported in the browser it
   * returns `<form>` element associated with this constol.
   */
  get form() {
    return this._internals && this._internals.form || null;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    const old = this._value;
    if (old === value) {
      return;
    }
    this._value = value;
    /* istanbul ignore else */
    if (this.requestUpdate) {
      this.requestUpdate('value', old);
    }
    /* istanbul ignore else */
    if (this._internals) {
      this._internals.setFormValue(value);
    }
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: {
        value
      }
    }));
  }

  get validationStates() {
    return this._validationStates;
  }

  set validationStates(value) {
    const old = this._validationStates;
    if (old === value) {
      return;
    }
    this._validationStates = value;
    /* istanbul ignore else */
    if (this.requestUpdate) {
      this.requestUpdate('validationStates', old);
    }
    this._hasValidationMessage = !!(value && value.length);
    this._validationStatesChanged(value);
    this.dispatchEvent(new CustomEvent('validationstates-changed', {
      detail: {
        value
      }
    }));
  }

  get hasValidationMessage() {
    return this._hasValidationMessage;
  }

  get _hasValidationMessage() {
    return this.__hasValidationMessage;
  }

  set _hasValidationMessage(value) {
    const old = this.__hasValidationMessage;
    if (old === value) {
      return;
    }
    this.__hasValidationMessage = value;
    /* istanbul ignore else */
    if (this.requestUpdate) {
      this.requestUpdate('hasValidationMessage', old);
    }
    this.__hasValidationMessage = value;
    this.dispatchEvent(new CustomEvent('hasvalidationmessage-changed', {
      detail: {
        value
      }
    }));
  }

  get autofocus() {
    return this._autofocus;
  }

  set autofocus(value) {
    const old = this._autofocus;
    if (old === value) {
      return;
    }
    this._autofocus = value;
    /* istanbul ignore else */
    if (this.requestUpdate) {
      this.requestUpdate('autofocus', old);
    }
    this._autofocusChanged(value);
  }

  get invalidMessage() {
    return this._invalidMessage;
  }

  set invalidMessage(value) {
    const old = this._invalidMessage;
    if (old === value) {
      return;
    }
    this._invalidMessage = value;
    /* istanbul ignore else */
    if (this.requestUpdate) {
      this.requestUpdate('invalidMessage', old);
    }
    this._hasValidationMessage = this.invalid && !!value;
  }
  get _patternRegExp() {
    let pattern;
    if (this.allowedPattern) {
      pattern = new RegExp(this.allowedPattern);
    } else {
      switch (this.type) {
        case 'number':
          pattern = /[0-9.,e-]/;
          break;
      }
    }
    return pattern;
  }
  /**
   * Returns a reference to the input element.
   */
  get inputElement() {
    return this.shadowRoot.querySelector('input');
  }

  static get properties() {
    return {
      /**
       * The value for this input. If you're using PaperInputBehavior to
       * implement your own paper-input-like element, bind this to
       * the `<input>`'s `bindValue`
       * property, or the value property of your input that is `notify:true`.
       */
      value: { notify: true },
      /**
       * Set to true to prevent the user from entering invalid input.
       */
      preventInvalidInput: { type: Boolean },
      /**
       * Set this to specify the pattern allowed by `preventInvalidInput`.
       */
      allowedPattern: { type: String },
      /**
       * The type of the input. The supported types are `text`, `number` and `password`.
       */
      type: { type: String },
      /**
       * The datalist of the input (if any). This should match the id of an existing `<datalist>`.
       */
      list: { type: String },
      /**
       * A pattern to validate the `input` with.
       */
      pattern: { type: String },

      /**
       * Sets the input as required.
       */
      required: { type: Boolean },
      /**
       * The error message to display when the input is invalid.
       */
      invalidMessage: { type: String },
      /**
       * Assistive text value.
       * Rendered beflow the input.
       */
      infoMessage: { type: String },
      /**
       * After calling `validate()` this will be populated by latest result of the test for each
       * validator. Result item will contain following properties:
       *
       * - validator {String} Name of the validator
       * - valid {Boolean} Result of the test
       * - message {String} Error message, populated only if `valid` equal `false`
       *
       * This property is `undefined` if `validator` is not set.
       */
      validationStates: { type: Array },
      /**
       * Value computed from `invalidMessage`, `invalid` and `validationStates`.
       * True if the validation message should be displayed.
       */
      _hasValidationMessage: { type: Boolean },
      /**
       * Set to true to auto-validate the input value.
       */
      autoValidate: { type: Boolean },
      /**
       * Name of the validator to use. See `AnypointValidatorMixin`.
       */
      validator: { type: String },

      // HTMLInputElement attributes for binding if needed
      /**
       * Bind the `<input>`'s `autocomplete` property.
       * @default off
       */
      autocomplete: { type: String },
      /**
       * Binds this to the `<input>`'s `autofocus` property.
       */
      autofocus: { type: Boolean },
      /**
       * Binds this to the `<input>`'s `inputMode` property.
       */
      inputMode: { type: String },
      /**
       * The minimum length of the input value.
       * Binds this to the `<input>`'s `minLength` property.
       */
      minLength: { type: Number },
      /**
       * The maximum length of the input value.
       * Binds this to the `<input>`'s `maxLength` property.
       */
      maxLength: { type: Number },
      /**
       * The minimum (numeric or date-time) input value.
       * Binds this to the `<input>`'s `min` property.
       */
      min: { type: String },
      /**
       * The maximum (numeric or date-time) input value.
       * Can be a String (e.g. `"2000-01-01"`) or a Number (e.g. `2`).
       * Binds this to the `<input>`'s `max` property.
       */
      max: { type: String },
      /**
       * Limits the numeric or date-time increments.
       *
       * Binds this to the `<input>`'s `step` property.
       */
      step: { type: String },
      /**
       * Binds this to the `<input>`'s `name` property.
       */
      name: { type: String },
      /**
       * A placeholder string in addition to the label. If this is set, the label will always float.
       * Please, use with careful.
       */
      placeholder: { type: String },
      /**
       * Binds this to the `<input>`'s `readonly` property.
       * @default false
       */
      readOnly: { type: Boolean },
      /**
       * Binds this to the `<input>`'s `size` property.
       */
      size: { type: Number },
      // Nonstandard attributes for binding if needed
      /**
       * Binds this to the `<input>`'s `autocapitalize` property.
       *
       * Possible values are:
       *
       * - `off` or `none`: No autocapitalization is applied (all letters default to lowercase)
       * - `on` or `sentences`: The first letter of each sentence defaults to a capital letter;
       *  all other letters default to lowercase
       * - `words`: The first letter of each word defaults to a capital letter; all other letters default to lowercase
       * - `characters`: All letters should default to uppercase
       *
       * @default none
       */
      autocapitalize: { type: String },
      /**
       * Binds this to the `<input>`'s `autocorrect` property.
       * @default off
       */
      autocorrect: { type: String },
      /**
       * Binds this to the `<input>`'s `results` property,
       * used with type=search.
       *
       * The maximum number of items that should be displayed in the
       * drop-down list of previous search queries. Safari only.
       */
      results: { type: Number },
      /**
       * Binds this to the `<input>`'s `accept` property,
       * used with type=file.
       */
      accept: { type: String },
      /**
       * Binds this to the`<input>`'s `multiple` property,
       * used with type=file.
       */
      multiple: { type: Boolean },

      _ariaLabelledBy: { type: String },

      _inputId: { type: String },
      /**
       * Enables outlined theme.
       */
      outlined: { type: Boolean, reflect: true },
      /**
       * Enables Anypoint legacy theme.
       */
      legacy: { type: Boolean, reflect: true }
    };
  }

  constructor() {
    super();
    this.autoValidate = false;
    this.autocomplete = 'off';
    this.autocorrect = 'off';
    this._ariaLabelledBy = '';
    this._inputId = '';
    this._previousValidInput = '';
    this._patternAlreadyChecked = false;

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    /* istanbul ignore else */
    if (this.attachInternals) {
      this._internals = this.attachInternals();
    }
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
  /**
   * When form-associated custom elements are supported in the browser it
   * is called when for disabled state changed.
   * @param {Boolean} disabled Form disabled state
   */
  formDisabledCallback(disabled) {
    this.disabled = disabled;
  }
  /**
   * When form-associated custom elements are supported in the browser it
   * is called when the form has been reset
   */
  formResetCallback() {
    this.value = '';
  }
  /**
   * When form-associated custom elements are supported in the browser it
   * is called when the form state has been restored
   *
   * @param {String} state Restored value
   */
  formStateRestoreCallback(state) {
    this.value = state;
  }

  firstUpdated() {
    this._updateAriaLabelledBy();
  }
  // /**
  //  * Returns false if the element is required and does not have a selection,
  //  * and true otherwise.
  //  *
  //  * @return {boolean} true if `required` is false, or if `required` is true
  //  * and the element has a valid selection.
  //  */
  // _getValidity() {
  //   return this.disabled || !this.required || (this.required && !!this.value);
  // }

  checkValidity() {
    return this._getValidity() && ((this._internals && this._internals.checkValidity()) || true);
  }
  /**
   * From `ValidatableMixin`
   * @param {Boolean} value Current invalid sate
   */
  _invalidChanged(value) {
    super._invalidChanged(value);
    this._hasValidationMessage = value && !!this.invalidMessage;
  }
  /**
   * Forward focus to inputElement. Overriden from ControlStateMixin.
   * @param {Event} event
   */
  _focusBlurHandler(event) {
    super._focusBlurHandler(event);

    // Forward the focus to the nested input.
    if (this.focused && !this._shiftTabPressed) {
      this.inputElement.focus();
    }
    if (event.type === 'blur' && this.autoValidate) {
      this.validate();
    }
  }

  /**
   * Handler that is called when a shift+tab keypress is detected by the menu.
   *
   * @param {CustomEvent} event A key combination event.
   */
  _onShiftTabDown() {
    const oldTabIndex = this.getAttribute('tabindex');
    this._shiftTabPressed = true;
    this.setAttribute('tabindex', '-1');
    setTimeout(() => {
      this.setAttribute('tabindex', oldTabIndex);
      this._shiftTabPressed = false;
    }, 1);
  }

  /**
   * If `autoValidate` is true, then validates the element.
   */
  _handleAutoValidate() {
    if (this.autoValidate) {
      this.validate();
    }
  }
  /**
   * Restores the cursor to its original position after updating the value.
   * @param {string} newValue The value that should be saved.
   */
  updateValueAndPreserveCaret(newValue) {
    // Not all elements might have selection, and even if they have the
    // right properties, accessing them might throw an exception (like for
    // <input type=number>)
    try {
      const start = this.inputElement.selectionStart;
      this.value = newValue;
      // The cursor automatically jumps to the end after re-setting the value,
      // so restore it to its original position.
      this.inputElement.selectionStart = start;
      this.inputElement.selectionEnd = start;
    } catch (e) {
      // Just set the value and give up on the caret.
      this.value = newValue;
    }
  }

  _updateAriaLabelledBy() {
    const slot = this.shadowRoot.querySelector('slot[name="label"]');
    const nodes = slot.assignedNodes();
    if (!nodes.length) {
      return;
    }
    let label;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType === Node.ELEMENT_NODE) {
        label = nodes[i];
        break;
      }
    }
    if (!label) {
      this._ariaLabelledBy = '';
      return;
    }
    let labelledBy;
    if (label.id) {
      labelledBy = label.id;
    } else {
      labelledBy = 'anypoint-input-label-' + nextLabelID++;
      label.id = labelledBy;
    }
    this._ariaLabelledBy = labelledBy;
  }

  _ariaLabelledByChanged(ariaLabelledBy) {
    this.inputElement.setAttribute('aria-labelledby', ariaLabelledBy);
  }

  _onChange(event) {
    // In the Shadow DOM, the `change` event is not leaked into the
    // ancestor tree, so we must do this manually.
    // See https://w3c.github.io/webcomponents/spec/shadow/
    // #events-that-are-not-leaked-into-ancestor-trees.
    if (this.shadowRoot) {
      this.dispatchEvent(new CustomEvent(event.type, {
        detail: {
          sourceEvent: event
        },
        bubbles: event.bubbles,
        cancelable: event.cancelable
      }));
    }
  }

  _onInput(e) {
    let value = e.target.value;
    // Need to validate each of the characters pasted if they haven't
    // been validated inside `_onKeypress` already.
    let valid = true;
    if ((this.preventInvalidInput || this.allowedPattern) && !this._patternAlreadyChecked) {
      valid = this._checkPatternValidity(value);
      if (!valid) {
        this._announceInvalidCharacter('Invalid string of characters entered.');
        value = this._previousValidInput;
      }
    }
    if (e.target.type !== 'file') {
      this._previousValidInput = value;
      this._patternAlreadyChecked = false;
      this.inputElement.value = value;
    }
    this.value = value;
    if (this.autoValidate) {
      this.validate();
    }
  }

  _checkPatternValidity(value) {
    const regexp = this._patternRegExp;
    if (!regexp) {
      return true;
    }
    for (let i = 0; i < value.length; i++) {
      if (!regexp.test(value[i])) {
        return false;
      }
    }
    return true;
  }

  _announceInvalidCharacter(message) {
    this.dispatchEvent(new CustomEvent('iron-announce', {
      detail: {
        text: message
      },
      bubbles: true,
      composed: true
    }));
  }

  _onKeypress(event) {
    if (!this.preventInvalidInput && this.type !== 'number') {
      return;
    }
    const regexp = this._patternRegExp;
    if (!regexp) {
      return;
    }
    // Handle special keys and backspace
    if (event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }
    // Check the pattern either here or in `_onInput`, but not in both.
    this._patternAlreadyChecked = true;
    const thisChar = String.fromCharCode(event.charCode);
    if (this._isPrintable(event) && !regexp.test(thisChar)) {
      event.preventDefault();
      this._announceInvalidCharacter('Invalid character ' + thisChar + ' not entered.');
    }
  }

  _isPrintable(event) {
    // What a control/printable character is varies wildly based on the browser.
    // - most control characters (arrows, backspace) do not send a `keypress` event
    //   in Chrome, but the *do* on Firefox
    // - in Firefox, when they do send a `keypress` event, control chars have
    //   a charCode = 0, keyCode = xx (for ex. 40 for down arrow)
    // - printable characters always send a keypress event.
    // - in Firefox, printable chars always have a keyCode = 0. In Chrome, the keyCode
    //   always matches the charCode.
    // None of this makes any sense.

    // For these keys, ASCII code == browser keycode.
    const anyNonPrintable =
      (event.keyCode === 8) || // backspace
      (event.keyCode === 9) || // tab
      (event.keyCode === 13) || // enter
      (event.keyCode === 27); // escape

    // For these keys, make sure it's a browser keycode and not an ASCII code.
    const mozNonPrintable =
      (event.keyCode === 19) || // pause
      (event.keyCode === 20) || // caps lock
      (event.keyCode === 45) || // insert
      (event.keyCode === 46) || // delete
      (event.keyCode === 144) || // num lock
      (event.keyCode === 145) || // scroll lock
      (event.keyCode > 32 && event.keyCode < 41) || // page up/down, end, home, arrows
      (event.keyCode > 111 && event.keyCode < 124); // fn keys

    return !anyNonPrintable && !(event.charCode === 0 && mozNonPrintable);
  }

  _autofocusChanged() {
    // Firefox doesn't respect the autofocus attribute if it's applied after
    // the page is loaded (Chrome/WebKit do respect it), preventing an
    // autofocus attribute specified in markup from taking effect when the
    // element is upgraded. As a workaround, if the autofocus property is set,
    // and the focus hasn't already been moved elsewhere, we take focus.
    if (this.autofocus && this.inputElement) {
      // In IE 11, the default document.activeElement can be the page's
      // outermost html element, but there are also cases (under the
      // polyfill?) in which the activeElement is not a real HTMLElement, but
      // just a plain object. We identify the latter case as having no valid
      // activeElement.
      const activeElement = document.activeElement;
      const isActiveElementValid = activeElement instanceof HTMLElement;

      // Has some other element has already taken the focus?
      const isSomeElementActive = isActiveElementValid &&
          activeElement !== document.body &&
          activeElement !== document.documentElement; /* IE 11 */
      if (!isSomeElementActive) {
        // No specific element has taken the focus yet, so we can take it.
        this.inputElement.focus();
      }
    }
  }

  /**
   * Returns true if `value` is valid. The validator provided in `validator`
   * will be used first, then any constraints.
   * @return {boolean} True if the value is valid.
   */
  validate() {
    if (!this.inputElement) {
      this.invalid = false;
      return true;
    }
    const input = this.inputElement;
    // Use the nested input's native validity.
    let valid = input.checkValidity();

    // Only do extra checking if the browser thought this was valid.
    if (valid) {
      // Empty, required input is invalid
      if (this.required && this.value === '') {
        valid = false;
      } else if (this.hasValidator()) {
        valid = super.validate(this.value);
      }
    }

    this.invalid = !valid;
    return valid;
  }

  _validationStatesChanged(states) {
    if (!states || !states.length) {
      return;
    }
    const parts = [];
    for (let i = 0, len = states.length; i < len; i++) {
      if (!states[i].valid) {
        parts[parts.length] = states[i].message;
      }
    }
    this.invalidMessage = parts.join('. ');
  }
  /**
   * Fired when the input changes due to user interaction.
   *
   * @event change
   */
};
