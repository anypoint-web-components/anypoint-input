import {TemplateResult, SVGTemplateResult} from 'lit-element';
import {AnypointInput} from './AnypointInput';
export {AnypointMaskedInput};

declare class AnypointMaskedInput extends AnypointInput {
  readonly _inputType: string;
  readonly _visibilityToggleIcon: SVGTemplateResult;
  readonly _visibilityToggleTitle: string;
  readonly _visibilityToggleLabel: string;
  _suffixTemplate(): TemplateResult;

  /**
   * Toggles `visible` property value.
   */
  toggleVisibility(): void;
}
