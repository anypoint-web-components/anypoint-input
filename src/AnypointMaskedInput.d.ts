import {TemplateResult, SVGTemplateResult, CSSResult} from 'lit-element';
import {AnypointInput} from './AnypointInput';
export {AnypointMaskedInput};

declare class AnypointMaskedInput extends AnypointInput {
  get styles(): CSSResult|CSSResult[];
  get _inputType(): string;
  get _visibilityToggleIcon(): SVGTemplateResult;
  get _visibilityToggleTitle(): string;
  get _visibilityToggleLabel(): string;

  /**
   * When set the input renders the value visible and restores
   * original input type.
   * @attribute
   */
  visible: boolean;

  _suffixTemplate(): TemplateResult;

  /**
   * Toggles `visible` property value.
   */
  toggleVisibility(): void;
}
