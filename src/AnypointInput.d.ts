import {TemplateResult, CSSResult, LitElement} from 'lit-element';
import {AnypointInputMixin} from './AnypointInputMixin';

/**
 * @fires search When the type is `search` and the search term change.
 */
export declare class AnypointInput {
  readonly styles: CSSResult|CSSResult[];
  readonly _prefixed: HTMLSlotElement|null;
  readonly _labelClass: string;
  readonly _infoAddonClass: string;
  readonly _errorAddonClass: string;
  readonly _inputType: string;
  render(): TemplateResult;
  _suffixTemplate(): TemplateResult;
}

export declare interface AnypointInput extends AnypointInputMixin, LitElement {
  autocapitalize: "off" | "none" | "on" | "sentences" | "words" | "characters";
}
