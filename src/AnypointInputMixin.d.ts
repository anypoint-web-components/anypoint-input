import { ControlStateMixin } from '@anypoint-web-components/anypoint-control-mixins';
import { ValidatableMixin } from '@anypoint-web-components/validatable-mixin';

declare function AnypointInputMixin<T extends new (...args: any[]) => {}>(base: T): T & AnypointInputMixinConstructor;
interface AnypointInputMixinConstructor {
  new(...args: any[]): AnypointInputMixin;
}

/**
 * This validatable supports multiple validators.
 *
 * Use `AnypointInputMixin` to implement an element that validates user input.
 * Use the related `ArcValidatorBehavior` to add custom validation logic
 * to an iron-input or other wrappers around native inputs.
 *
 * By default, an `<iron-form>` element validates its fields when the user presses the submit
 * button.
 * To validate a form imperatively, call the form's `validate()` method, which in turn will
 * call `validate()` on all its children. By using `AnypointInputMixin`, your
 * custom element will get a public `validate()`, which will return the validity
 * of the element, and a corresponding `invalid` attribute, which can be used for styling.
 *
 * To implement the custom validation logic of your element, you must override
 * the protected `_getValidity()` method of this behaviour, rather than `validate()`.
 * See [this](https://github.com/PolymerElements/iron-form/blob/master/demo/simple-element.html)
 * for an example.
 *
 * ### Accessibility
 *
 * Changing the `invalid` property, either manually or by calling `validate()` will update the
 * `aria-invalid` attribute.
 */
interface AnypointInputMixin extends ValidatableMixin, ControlStateMixin {
  /**
   * The value for this input. If you're using PaperInputBehavior to
   * implement your own paper-input-like element, bind this to
   * the `<input>`'s `bindValue`
   * property, or the value property of your input that is `notify:true`.
   */
  value: any;

  /**
   * Set to true to prevent the user from entering invalid input.
   */
  preventInvalidInput: boolean;

  /**
   * Set this to specify the pattern allowed by `preventInvalidInput`.
   */
  allowedPattern: string;

  /**
   * The type of the input. The supported types are `text`, `number` and `password`.
   */
  type: string;

  /**
   * The datalist of the input (if any). This should match the id of an existing `<datalist>`.
   */
  list: string;

  /**
   * A pattern to validate the `input` with.
   */
  pattern: string;

  /**
   * Sets the input as required.
   */
  required: boolean;

  /**
   * The error message to display when the input is invalid.
   */
  invalidMessage: string;

  /**
   * Assistive text value.
   * Rendered beflow the input.
   */
  infoMessage: string;

  /**
   * Value computed from `invalidMessage`, `invalid` and `validationStates`.
   * True if the validation message should be displayed.
   */
  _hasValidationMessage: boolean;

  /**
   * Set to true to auto-validate the input value.
   */
  autoValidate: boolean;

  /**
   * Bind the `<input>`'s `autocomplete` property.
   * @default off
   */
  autocomplete: string;

  /**
   * Binds this to the `<input>`'s `autofocus` property.
   */
  autofocus: boolean;

  /**
   * Binds this to the `<input>`'s `inputMode` property.
   */
  inputMode: string;

  /**
   * The minimum length of the input value.
   * Binds this to the `<input>`'s `minLength` property.
   */
  minLength: number;

  /**
   * The maximum length of the input value.
   * Binds this to the `<input>`'s `maxLength` property.
   */
  maxLength: number;

  /**
   * The minimum (numeric or date-time) input value.
   * Binds this to the `<input>`'s `min` property.
   */
  min: string;

  /**
   * The maximum (numeric or date-time) input value.
   * Can be a String (e.g. `"2000-01-01"`) or a Number (e.g. `2`).
   * Binds this to the `<input>`'s `max` property.
   */
  max: string;

  /**
   * Limits the numeric or date-time increments.
   *
   * Binds this to the `<input>`'s `step` property.
   */
  step: string;

  /**
   * Binds this to the `<input>`'s `name` property.
   */
  name: string;

  /**
   * A placeholder string in addition to the label. If this is set, the label will always float.
   * Please, use with careful.
   */
  placeholder: string;

  /**
   * Binds this to the `<input>`'s `readonly` property.
   * @default false
   */
  readOnly: boolean;

  /**
   * Binds this to the `<input>`'s `size` property.
   */
  size: number;

  /**
   * Binds this to the `<input>`'s `spellcheck` property.
   */
  spellcheck: string;

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
  autocapitalize: string;

  /**
   * Binds this to the `<input>`'s `autocorrect` property.
   * @default off
   */
  autocorrect: string;

  /**
   * Binds this to the `<input>`'s `results` property,
   * used with type=search.
   *
   * The maximum number of items that should be displayed in the
   * drop-down list of previous search queries. Safari only.
   */
  results: number;

  /**
   * Binds this to the `<input>`'s `accept` property,
   * used with type=file.
   */
  accept: string;

  /**
   * Binds this to the`<input>`'s `multiple` property,
   * used with type=file.
   */
  multiple: boolean;

  _ariaLabelledBy: string;

  /**
   * Enables outlined theme.
   */
  outlined: boolean;

  /**
   * Enables compatibility with Anypoint components.
   */
  compatibility: boolean;

  /**
   * When set, it reduces height of the button and hides
   * the label when the value is provided.
   *
   * Use it carefully as user should be able to recognize the input
   * when the value is predefined.
   */
  noLabelFloat: boolean;

  /**
   * A reference to the input element.
   */
  readonly inputElement: HTMLInputElement|HTMLTextAreaElement;

  checkValidity(): boolean;

  _invalidChanged(value: boolean): void;

  _ensureInvalidAlertSate(invalid: boolean): void;

  /**
   * Forwards focus to inputElement. Overriden from ControlStateMixin.
   * @param {FocusEvent} event
   */
  _focusBlurHandler(event: FocusEvent): void;

  /**
   * Handler for the keydown event.
   *
   * @param e Event handled.
   */
  _onKeydown(e: KeyboardEvent): void;

  /**
   * Handler that is called when a shift+tab keypress is detected by the menu.
   *
   * @param e Event handled.
   */
  _onShiftTabDown(e: KeyboardEvent): void;

  /**
   * Calles when `autoValidate` changed
   */
  _autoValidateChanged(value: boolean): void;

  /**
   * Restores the cursor to its original position after updating the value.
   * @param newValue The value that should be saved.
   */
  updateValueAndPreserveCaret(newValue: string): void;

  _updateAriaLabelledBy(): void;

  _onChange(e: Event): void;

  _onInput(e: Event): void;

  /**
   * Checks validity for oattern, if any
   * @param {String=} value The value to test for pattern
   * @return {Boolean}
   */
  _checkPatternValidity(value?: string): boolean;

  _announceInvalidCharacter(message: string): void;

  /**
   * Called when `autofocus` property changed.
   * @param value Current `autofocus` value
   */
  _autofocusChanged(value: boolean): void;
  /**
   * Returns true if `value` is valid. The validator provided in `validator`
   * will be used first, then any constraints.
   * @returns True if the value is valid.
   */
  validate(): boolean;

  /**
   * Because of the `value` property binding to the input element the value on
   * input element changes programatically which renders input element's validation
   * valiod even if it isn't. This function runs the steps as the regular input
   * validation would, including input validation.
   * @returns True if the element is valid.
   */
  _checkInputValidity(): boolean;

  /**
   * Called when validation states changed.
   * Validation states are set by validatable mixin and is a result of calling
   * a custom validator. Each validator returns an object with `valid` and `message`
   * properties.
   *
   * See `ValidatableMixin` for more information.
   */
  _validationtatesHandler(e: CustomEvent): void;
}

export {AnypointInputMixinConstructor};
export {AnypointInputMixin};
