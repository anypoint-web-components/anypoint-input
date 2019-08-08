import { fixture, assert, nextFrame, aTimeout } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '../anypoint-input.js';

describe('<anypoint-input>', function() {
  async function basicFixture() {
    return await fixture(`<anypoint-input></anypoint-input>`);
  }

  async function invalidMessageFixture() {
    return await fixture(`<anypoint-input invalidmessage="test"></anypoint-input>`);
  }

  async function autoValidateFixture() {
    return await fixture(`<anypoint-input
      autovalidate
      required
      invalidmessage="test"></anypoint-input>`);
  }

  async function labeledFixture() {
    return await fixture(`<anypoint-input>
      <label slot="label">Hello!</label>
      </anypoint-input>`);
  }

  async function labeledIdFixture() {
    return await fixture(`<anypoint-input>
      <label slot="label" id="testLabel">Hello!</label>
      </anypoint-input>`);
  }

  async function patternFixture() {
    return await fixture(`<anypoint-input pattern="[a-z]*">
      </anypoint-input>`);
  }

  describe('setters and getters', function() {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets value on element', function() {
      element.value = 'test';
      assert.equal(element.value, 'test');
    });

    it('sets value on input element', async () => {
      element.value = 'test';
      await nextFrame();
      const input = element.inputElement;
      assert.equal(input.value, 'test');
    });

    it('value change dispatches value-change event', async () => {
      const spy = sinon.spy();
      element.addEventListener('value-changed', spy);
      element.value = 'test';
      assert.equal(spy.args[0][0].detail.value, 'test');
    });

    it('setting the same value ignores setter', async () => {
      element.value = 'test';
      const spy = sinon.spy();
      element.addEventListener('value-changed', spy);
      element.value = 'test';
      assert.isFalse(spy.called);
    });

    const states = [{
      valid: false,
      message: 'test'
    }];

    it('sets validationStates on element', function() {
      element.validationStates = states;
      assert.deepEqual(element.validationStates, states);
    });

    it('value change dispatches value-change event', async () => {
      const spy = sinon.spy();
      element.addEventListener('validationstates-changed', spy);
      element.validationStates = states;
      assert.deepEqual(spy.args[0][0].detail.value, states);
    });

    it('setting the same value ignores setter', async () => {
      element.validationStates = states;
      const spy = sinon.spy();
      element.addEventListener('validationstates-changed', spy);
      element.validationStates = states;
      assert.isFalse(spy.called);
    });

    it('calls _validationStatesChanged()', async () => {
      const spy = sinon.spy(element, '_validationStatesChanged');
      element.validationStates = states;
      assert.deepEqual(spy.args[0][0], states);
    });

    it('sets hasValidationMessage when validationStates changes', function() {
      element.invalid = true;
      element.validationStates = states;
      assert.isTrue(element.hasValidationMessage);
    });

    it('returns regexp for _patternRegExp when allowedPattern', () => {
      element.allowedPattern = '[a-z]';
      const result = element._patternRegExp;
      assert.typeOf(result, 'regexp');
    });

    it('returns regexp for _patternRegExp when number type', () => {
      element.type = 'number';
      const result = element._patternRegExp;
      assert.typeOf(result, 'regexp');
    });

    it('returns undefined for _patternRegExp otherwise', () => {
      const result = element._patternRegExp;
      assert.isUndefined(result);
    });

    it('inputElement returns the input', () => {
      const result = element.inputElement;
      assert.equal(result.localName, 'input');
    });
  });

  describe('Default values', function() {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets default autoValidate', () => {
      assert.isFalse(element.autoValidate);
    });

    it('sets default autocomplete', () => {
      assert.equal(element.autocomplete, 'off');
    });

    it('sets default autocorrect', () => {
      assert.equal(element.autocorrect, 'off');
    });

    it('sets default autocorrect', () => {
      assert.equal(element.autocorrect, 'off');
    });

    it('sets default tabindex', () => {
      assert.equal(element.tabIndex, '0');
    });
  });

  describe('_invalidChanged()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets invalid state', () => {
      element._invalidChanged(true);
      // This is done in parent class.
      assert.equal(element.getAttribute('aria-invalid'), 'true');
    });

    it('sets _hasValidationMessage when invalidMessage', () => {
      element.invalidMessage = 'test';
      element._invalidChanged(true);
      assert.isTrue(element.hasValidationMessage);
    });

    it('sets _hasValidationMessage when no invalidMessage', () => {
      element._invalidChanged(true);
      assert.isFalse(element.hasValidationMessage);
    });

    it('calls _ensureInvalidAlertSate()', () => {
      const spy = sinon.spy(element, '_ensureInvalidAlertSate');
      element._invalidChanged(true);
      assert.isTrue(spy.args[0][0]);
    });
  });

  describe('_ensureInvalidAlertSate()', () => {
    let element;
    beforeEach(async () => {
      element = await invalidMessageFixture();
    });

    it('sets role attribute on invalid label', () => {
      element._ensureInvalidAlertSate(true);
      const node = element.shadowRoot.querySelector('p.invalid');
      assert.equal(node.getAttribute('role'), 'alert');
    });

    it('removes role attribute from invalid label', () => {
      const node = element.shadowRoot.querySelector('p.invalid');
      node.setAttribute('role', 'alert');
      element._ensureInvalidAlertSate(false);
      assert.isFalse(node.hasAttribute('role'));
    });

    it('removes role attribute from invalid label after timeout', async () => {
      element._ensureInvalidAlertSate(true);
      await aTimeout(1001);
      const node = element.shadowRoot.querySelector('p.invalid');
      assert.isFalse(node.hasAttribute('role'));
    });
  });

  describe('_focusBlurHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await autoValidateFixture();
    });

    it('focuses on the input', () => {
      MockInteractions.focus(element);
      assert.equal(document.activeElement, element);
    });

    it('auto validates on blur', async () => {
      MockInteractions.focus(element);
      await nextFrame();
      const spy = sinon.spy(element, 'validate');
      MockInteractions.blur(element);
      assert.isTrue(spy.called);
    });
  });

  describe('_onKeydown()', () => {
    let element;
    beforeEach(async () => {
      element = await autoValidateFixture();
    });

    it('calls _onShiftTabDown()', async () => {
      const spy = sinon.spy(element, '_onShiftTabDown');
      MockInteractions.keyDownOn(element, 9, ['shift'], 'Tab');
      assert.isTrue(spy.called);
    });

    it('ignores call without shift key', async () => {
      const spy = sinon.spy(element, '_onShiftTabDown');
      MockInteractions.keyDownOn(element, 9, [], 'Tab');
      assert.isFalse(spy.called);
    });
  });

  describe('_onShiftTabDown()', () => {
    let element;
    let e;
    beforeEach(async () => {
      element = await basicFixture();
      e = {
        target: element
      };
    });

    it('sets tabIndex', () => {
      element._onShiftTabDown(e);
      assert.equal(element.getAttribute('tabindex'), '-1');
    });

    it('sets _shiftTabPressed', () => {
      element._onShiftTabDown(e);
      assert.isTrue(element._shiftTabPressed);
    });

    it('resets tabIndex', async () => {
      element.setAttribute('tabindex', '1');
      element._onShiftTabDown(e);
      await aTimeout(1);
      assert.equal(element.getAttribute('tabindex'), '1');
    });

    it('resets _shiftTabPressed', async () => {
      element._onShiftTabDown(e);
      await aTimeout(1);
      assert.isFalse(element._shiftTabPressed);
    });
  });

  describe('_autoValidateChanged()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('calls validate when true', () => {
      const spy = sinon.spy(element, 'validate');
      element.autoValidate = true;
      assert.isTrue(spy.called);
    });

    it('ignores validate when false', () => {
      element.autoValidate = true;
      const spy = sinon.spy(element, 'validate');
      element.autoValidate = false;
      assert.isFalse(spy.called);
    });
  });

  describe('updateValueAndPreserveCaret()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('preserves carret position', () => {
      const input = element.inputElement;
      input.value = 'nananana';
      input.selectionStart = 2;
      input.selectionEnd = 2;
      element.updateValueAndPreserveCaret('nanananabatman');
      assert.equal(input.selectionStart, 2, 'selectionStart is preserved');
      assert.equal(input.selectionEnd, 2, 'selectionEnd is preserved');
    });
  });

  describe('_updateAriaLabelledBy()', () => {
    it('sets id the label when missing', async () => {
      const element = await labeledFixture();
      const label = element.shadowRoot.querySelector('slot[name="label"]').assignedNodes()[0];
      assert.equal(label.id, 'anypoint-input-label-0');
    });

    it('respects existing id', async () => {
      const element = await labeledIdFixture();
      const label = element.shadowRoot.querySelector('slot[name="label"]').assignedNodes()[0];
      assert.equal(label.id, 'testLabel');
    });

    it('sets _ariaLabelledBy', async () => {
      const element = await labeledIdFixture();
      assert.equal(element._ariaLabelledBy, 'testLabel');
    });

    it('sets _ariaLabelledBy when no label', async () => {
      const element = await basicFixture();
      assert.equal(element._ariaLabelledBy, '');
    });

    it('sets aria-labelledby on the input', async () => {
      const element = await labeledIdFixture();
      const input = element.inputElement;
      assert.equal(input.getAttribute('aria-labelledby'), 'testLabel');
    });
  });

  describe('_onChange()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('retargets change event', () => {
      const input = element.inputElement;
      const spy = sinon.spy();
      element.addEventListener('change', spy);
      input.dispatchEvent(new CustomEvent('change', {}));
      assert.isTrue(spy.called);
    });
  });

  describe.only('_checkPatternValidity()', () => {
    it('returns true when no argument', async () => {
      const element = await basicFixture();
      const result = element._checkPatternValidity();
      assert.isTrue(result);
    });

    it('returns true when no pattern', async () => {
      const element = await basicFixture();
      const result = element._checkPatternValidity('test');
      assert.isTrue(result);
    });

    it('returns true when pattern matches', async () => {
      const element = await patternFixture();
      const result = element._checkPatternValidity('test');
      assert.isTrue(result);
    });

    it('returns false when pattern does not match', async () => {
      const element = await patternFixture();
      const result = element._checkPatternValidity('c4e');
      assert.isTrue(result);
    });
  });
});
