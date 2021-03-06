import { LitElement } from 'lit-element';
import { ValidatorMixin } from '@anypoint-web-components/validator-mixin/validator-mixin.js';

export class UppercaseRequired extends ValidatorMixin(LitElement) {
  static get properties() {
    return {
      // Error message to display
      message: { type: String }
    };
  }

  constructor() {
    super();
    this.message = 'Must have uppercase letter';
  }

  validate(value) {
    return /[A-Z]/.test(value);
  }
}
window.customElements.define('uppercase-required', UppercaseRequired);
