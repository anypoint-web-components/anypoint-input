import {TemplateResult, LitElement} from 'lit-element';
import {AnypointInputMixin} from './AnypointInputMixin';

export declare class AnypointTextarea {
  readonly _labelClass: string;
  readonly _infoAddonClass: string;
  readonly _errorAddonClass: string;
  readonly cols: number|undefined;
  readonly rows: number|undefined;
  readonly wrap: boolean|undefined;
  render(): TemplateResult;
}
export declare interface AnypointTextarea extends AnypointInputMixin, LitElement {
}
