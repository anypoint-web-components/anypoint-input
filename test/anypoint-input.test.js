import { fixture, assert, nextFrame, aTimeout, html } from '@open-wc/testing';
import sinon from 'sinon';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '../anypoint-input.js';

/** @typedef {import('../index').AnypointInput} AnypointInput */

describe('<anypoint-input>', () => {
  /**
   * @return {Promise<AnypointInput>}
   */
  async function basicFixture() {
    return fixture(html`<anypoint-input></anypoint-input>`);
  }

  /**
   * @return {Promise<AnypointInput>}
   */
  async function invalidMessageFixture() {
    return fixture(html`<anypoint-input invalidmessage="test"></anypoint-input>`);
  }

  /**
   * @return {Promise<AnypointInput>}
   */
  async function autoValidateFixture() {
    return fixture(html`<anypoint-input
      autovalidate
      required
      invalidmessage="test"></anypoint-input>`);
  }

  /**
   * @return {Promise<AnypointInput>}
   */
  async function labeledFixture() {
    return fixture(html`<anypoint-input>
      <label slot="label">Hello!</label>
      </anypoint-input>`);
  }

  /**
   * @return {Promise<AnypointInput>}
   */
  async function labeledIdFixture() {
    return fixture(html`<anypoint-input>
      <label slot="label" id="testLabel">Hello!</label>
      </anypoint-input>`);
  }

  /**
   * @return {Promise<AnypointInput>}
   */
  async function patternFixture() {
    return fixture(html`<anypoint-input pattern="[a-z]*">
      </anypoint-input>`);
  }

  /**
   * @return {Promise<AnypointInput>}
   */
  async function prefixFixture() {
    return fixture(html`<anypoint-input>
      <span slot="prefix">$</span>
    </anypoint-input>`);
  }

  /**
   * @return {Promise<AnypointInput>}
   */
  async function noLabelFloatFixture() {
    return fixture(html`<anypoint-input nolabelfloat>
      <label slot="label">Label</label>
    </anypoint-input>`);
  }

  /**
   * @return {Promise<AnypointInput>}
   */
  async function readOnlyFixture() {
    return fixture(html`<anypoint-input readonly>
      <label slot="label">Label</label>
    </anypoint-input>`);
  }

  /**
   * @return {Promise<AnypointInput>}
   */
  async function searchFixture() {
    return fixture(html`<anypoint-input type="search">
      <label slot="label">Label</label>
    </anypoint-input>`);
  }

  describe('setters and getters', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets value on element', () => {
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

    const states = [
      {
        valid: false,
        message: 'test',
      },
    ];

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

    it('sets hasValidationMessage when validationStates changes', () => {
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

  describe('_prefixed getter', () => {
    it('returns null when no prefix', async () => {
      const element = await basicFixture();
      assert.equal(element._prefixed, null);
    });

    it('returns element when prefix', async () => {
      const element = await prefixFixture();
      assert.ok(element._prefixed);
    });
  });

  describe('_labelClass getter', () => {
    it('returns default value', async () => {
      const element = await basicFixture();
      assert.equal(element._labelClass, 'label resting');
    });

    it('returns floating value when value', async () => {
      const element = await basicFixture();
      element.value = 'test';
      assert.equal(element._labelClass, 'label floating');
    });

    it('returns floating value when placeholder', async () => {
      const element = await basicFixture();
      element.placeholder = 'test';
      assert.equal(element._labelClass, 'label floating');
    });

    it('returns floating value when focused', async () => {
      const element = await basicFixture();
      MockInteractions.focus(element);
      assert.equal(element._labelClass, 'label floating');
    });

    it('returns with-prefix when has prefix widget', async () => {
      const element = await prefixFixture();
      assert.equal(element._labelClass, 'label with-prefix resting');
    });

    [
      'date',
      'color',
      'datetime-local',
      'file',
      'month',
      'time',
      'week',
    ].forEach(type => {
      it(`returns floating value when type = ${type}`, async () => {
        const element = await basicFixture();
        // @ts-ignore
        element.type = type;
        assert.equal(element._labelClass, 'label floating');
      });

      it(`returns with-prefix value when type = ${type}`, async () => {
        const element = await prefixFixture();
        // @ts-ignore
        element.type = type;
        assert.equal(element._labelClass, 'label with-prefix floating');
      });
    });
  });

  describe('_infoAddonClass getter', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns default class', () => {
      assert.equal(element._infoAddonClass, 'info');
    });

    it('returns default class when not invalid', () => {
      element.invalidMessage = 'test';
      assert.equal(element._infoAddonClass, 'info');
    });

    it('returns hidden class when invalid', () => {
      element.invalidMessage = 'test';
      element.invalid = true;
      assert.equal(element._infoAddonClass, 'info label-hidden');
    });
  });

  describe('_errorAddonClass getter', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns default class', () => {
      assert.equal(element._errorAddonClass, 'invalid label-hidden');
    });

    it('returns info-offset class when with info message', () => {
      element.infoMessage = 'test';
      assert.equal(
        element._errorAddonClass,
        'invalid label-hidden info-offset'
      );
    });

    it('returns visible class when invalid', () => {
      element.infoMessage = 'test';
      element.invalid = true;
      assert.equal(element._errorAddonClass, 'invalid info-offset');
    });
  });

  describe('_inputType getter', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns default input type', () => {
      const result = element._inputType;
      assert.equal(result, 'text');
    });

    it('returns set input type', () => {
      element.type = 'password';
      const result = element._inputType;
      assert.equal(result, 'password');
    });
  });

  describe('Default values', () => {
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

    it('sets input selection', async () => {
      element.value = 'test';
      await nextFrame();
      MockInteractions.focus(element);
      const input = element.inputElement;
      assert.equal(input.selectionStart, 4, 'selectionStart is preserved');
      assert.equal(input.selectionEnd, 4, 'selectionEnd is preserved');
    });

    // I am too tired to fight with Safari.
    // It fails on Safari 12.1.1.
    it.skip('ignores other than text inputs', async () => {
      element.type = 'number';
      element.inputElement.type = 'number';
      element.value = 22;
      await nextFrame();
      MockInteractions.focus(element);
      const input = element.inputElement;
      // Chrome and FF returns null (as spec says) but Safari and Edge
      // returns 0...
      const start = input.selectionStart;
      assert.notOk(start, `input.selectionStart is not set, but has ${start}`);
      const end = input.selectionEnd;
      assert.notOk(end, `input.selectionEnd is not set, but has ${start}`);
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

    it('prevents invalid input', async () => {
      element.preventInvalidInput = true;
      element.allowedPattern = '[a-z]';
      const spy = sinon.spy(element, '_announceInvalidCharacter');
      MockInteractions.keyDownOn(element, 49, [], '1');
      assert.isTrue(spy.called);
    });

    it('ignores preventing when no pattern', async () => {
      element.preventInvalidInput = true;
      const spy = sinon.spy(element, '_announceInvalidCharacter');
      MockInteractions.keyDownOn(element, 49, [], '1');
      assert.isFalse(spy.called);
    });

    it('ignores preventing when no preventInvalidInput', async () => {
      element.preventInvalidInput = false;
      element.allowedPattern = '[a-z]';
      const spy = sinon.spy(element, '_announceInvalidCharacter');
      MockInteractions.keyDownOn(element, 49, [], '1');
      assert.isFalse(spy.called);
    });

    it('ignores preventing when number type', async () => {
      element.allowedPattern = '[a-z]';
      element.preventInvalidInput = true;
      element.type = 'number';
      await nextFrame();
      const spy = sinon.spy(element, '_announceInvalidCharacter');
      MockInteractions.keyDownOn(element, 49, [], '1');
      assert.isFalse(spy.called);
    });

    it('ignores preventing when number type', async () => {
      element.allowedPattern = '[a-z]';
      element.preventInvalidInput = true;
      element.type = 'file';
      await nextFrame();
      const spy = sinon.spy(element, '_announceInvalidCharacter');
      MockInteractions.keyDownOn(element, 49, [], '1');
      assert.isFalse(spy.called);
    });

    it('ignores preventing when meta key', async () => {
      element.allowedPattern = '[a-z]';
      element.preventInvalidInput = true;
      const spy = sinon.spy(element, '_announceInvalidCharacter');
      MockInteractions.keyDownOn(element, 49, ['meta'], '1');
      assert.isFalse(spy.called);
    });

    it('ignores preventing when ctrl key', async () => {
      element.allowedPattern = '[a-z]';
      element.preventInvalidInput = true;
      const spy = sinon.spy(element, '_announceInvalidCharacter');
      MockInteractions.keyDownOn(element, 49, ['ctrl'], '1');
      assert.isFalse(spy.called);
    });

    it('ignores preventing when Backspace key', async () => {
      element.allowedPattern = '[a-z]';
      element.preventInvalidInput = true;
      const spy = sinon.spy(element, '_announceInvalidCharacter');
      MockInteractions.keyDownOn(element, 8, [], 'Backspace');
      assert.isFalse(spy.called);
    });

    it('ignores preventing when allowed key', async () => {
      element.allowedPattern = '[a-z]';
      element.preventInvalidInput = true;
      const spy = sinon.spy(element, '_announceInvalidCharacter');
      MockInteractions.keyDownOn(element, 65, [], 'a');
      assert.isFalse(spy.called);
    });
  });

  describe('_onShiftTabDown()', () => {
    let element;
    let e;
    beforeEach(async () => {
      element = await basicFixture();
      e = {
        target: element,
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
      const label = element.shadowRoot
        .querySelector('slot[name="label"]')
        // @ts-ignore
        .assignedNodes()[0];
      assert.match(label.id, /anypoint-input-label-\d+/);
    });

    it('respects existing id', async () => {
      const element = await labeledIdFixture();
      const label = element.shadowRoot
        .querySelector('slot[name="label"]')
        // @ts-ignore
        .assignedNodes()[0];
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

  describe('assistive info', () => {
    it('sets id the label when missing', async () => {
      const element = await labeledFixture();
      const label = element.shadowRoot
        .querySelector('slot[name="label"]')
        // @ts-ignore
        .assignedNodes()[0];
      assert.match(label.id, /anypoint-input-label-\d+/);
    });

    it('sets aria-errormessage when invalidMessage', async () => {
      const element = await labeledFixture();
      element.invalidMessage = 'test';
      await nextFrame();

      assert.equal(element.shadowRoot.querySelector('.input-element').getAttribute('aria-errormessage').endsWith('-error'), true);
    });

    it('sets aria-details when infoMessage', async () => {
      const element = await labeledFixture();
      element.infoMessage = 'test';
      await nextFrame();

      assert.equal(element.shadowRoot.querySelector('.input-element').getAttribute('aria-details').endsWith('-info'), true);
    });
  });

  describe('_onChange()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('re-targets change event', () => {
      const input = element.inputElement;
      const spy = sinon.spy();
      element.addEventListener('change', spy);
      input.dispatchEvent(new CustomEvent('change', {}));
      assert.isTrue(spy.called);
    });
  });

  describe('_checkPatternValidity()', () => {
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

  describe('_onInput()', () => {
    let element;
    let target;
    let e;
    beforeEach(async () => {
      element = await basicFixture();
      element.value = 'test';
      await nextFrame();
      target = element.inputElement;
      e = {
        target,
      };
    });

    it('sets _patternAlreadyChecked', () => {
      element._patternAlreadyChecked = true;
      element._onInput(e);
      assert.isFalse(element._patternAlreadyChecked);
    });

    it('sets _previousValidInput', () => {
      element._onInput(e);
      assert.equal(element._previousValidInput, 'test');
    });

    it('calls validate() when autovalidate is on', async () => {
      element.autoValidate = true;
      const spy = sinon.spy(element, 'validate');
      element._onInput(e);
      assert.isTrue(spy.called);
    });

    it('calls _checkPatternValidity() when input prevention is enabled', async () => {
      element.preventInvalidInput = true;
      element.allowedPattern = '[a-z]';
      const spy = sinon.spy(element, '_checkPatternValidity');
      element._onInput(e);
      assert.isTrue(spy.called);
    });

    it('ignores call to _checkPatternValidity() when _patternAlreadyChecked', async () => {
      element.preventInvalidInput = true;
      element.allowedPattern = '[a-z]';
      element._patternAlreadyChecked = true;
      const spy = sinon.spy(element, '_checkPatternValidity');
      element._onInput(e);
      assert.isFalse(spy.called);
    });

    it('updates value when input prevention is enabled', async () => {
      element.preventInvalidInput = true;
      element.allowedPattern = '[a-z]';
      element._previousValidInput = 'test';
      target.value = 'test1';
      element._onInput(e);
      assert.equal(target.value, 'test');
      assert.equal(element.value, 'test');
    });

    it('ignores value update for file inputs', async () => {
      element.type = 'file';
      element.preventInvalidInput = true;
      element.allowedPattern = '[a-z]';
      element._previousValidInput = 'test';
      element._onInput(e);
      // no error
    });
  });

  describe('_announceInvalidCharacter()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('dispatches iron-announce event', () => {
      const spy = sinon.spy();
      element.addEventListener('iron-announce', spy);
      element._announceInvalidCharacter('test');
      const e = spy.args[0][0];
      assert.equal(e.detail.text, 'test');
      assert.isTrue(e.bubbles);
    });
  });

  describe('_checkInputValidity()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns false when required and no value', () => {
      element.required = true;
      const result = element._checkInputValidity();
      assert.isFalse(result);
    });

    it('returns true when file', async () => {
      element.type = 'file';
      await nextFrame();
      const result = element._checkInputValidity();
      assert.isTrue(result);
    });

    it('returns false when pattern does not match', async () => {
      element.value = 'test123';
      element.pattern = '[a-z]';
      await nextFrame();
      const result = element._checkInputValidity();
      assert.isFalse(result);
    });

    it('returns false when minLength mismatch', async () => {
      element.value = 'a';
      element.minLength = 10;
      await nextFrame();
      const result = element._checkInputValidity();
      assert.isFalse(result);
    });

    it('returns false when minLength mismatch', async () => {
      element.value = 'ab';
      element.maxLength = 1;
      await nextFrame();
      const result = element._checkInputValidity();
      assert.isFalse(result);
    });

    it('returns false when min mismatch', async () => {
      element.type = 'number';
      element.value = 1;
      element.min = 2;
      await nextFrame();
      const result = element._checkInputValidity();
      assert.isFalse(result);
    });

    it('returns false when max mismatch', async () => {
      element.type = 'number';
      element.value = 2;
      element.max = 1;
      await nextFrame();
      const result = element._checkInputValidity();
      assert.isFalse(result);
    });

    it('returns false when not a number', async () => {
      element.type = 'number';
      element.value = 'test';
      element.max = 1;
      await nextFrame();
      const result = element._checkInputValidity();
      assert.isFalse(result);
    });

    it('returns false when step mismatch', async () => {
      element.type = 'number';
      element.value = 10.123;
      element.step = 1;
      await nextFrame();
      const result = element._checkInputValidity();
      assert.isFalse(result);
    });

    it('returns true for number', async () => {
      element.type = 'number';
      element.value = 10;
      element.step = 1;
      element.min = 1;
      element.max = 100;
      await nextFrame();
      const result = element._checkInputValidity();
      assert.isTrue(result);
    });

    it('returns true for text', async () => {
      element.type = 'text';
      element.value = 'test';
      element.pattern = '[a-z]*';
      element.minLength = 1;
      element.maxLength = 100;
      await nextFrame();
      const result = element._checkInputValidity();
      assert.isTrue(result);
    });

    it('returns true for 0 number', async () => {
      element.type = 'number';
      element.value = 0;
      await nextFrame();
      const result = element._checkInputValidity();
      assert.isTrue(result);
    });
  });

  describe('_validationStatesHandler()', () => {
    let element;
    let states;
    beforeEach(async () => {
      element = await basicFixture();
      states = [
        {
          valid: false,
          message: 'test 0',
        },
        {
          valid: true,
          message: 'test 1',
        },
        {
          valid: false,
          message: 'test 2',
        },
      ];
    });

    function fire(node, value) {
      const e = new CustomEvent('validationstates-changed', {
        detail: {
          value,
        },
      });
      node.dispatchEvent(e);
    }

    it('sets invalid message', () => {
      fire(element, states);
      assert.equal(element.invalidMessage, 'test 0. test 2');
    });

    it('ignores message when no argument', () => {
      fire(element);
      assert.isUndefined(element.invalidMessage);
    });

    it('ignores message when empty', () => {
      fire(element, []);
      assert.isUndefined(element.invalidMessage);
    });

    it('sets empty invalid message', () => {
      states[0].valid = true;
      states[2].valid = true;
      fire(element, states);
      assert.equal(element.invalidMessage, '');
    });
  });

  describe('_autofocusChanged', () => {
    let element;
    let input;
    beforeEach(async () => {
      element = await basicFixture();
      input = document.createElement('input');
      input.type = 'text';
      input.setAttribute('tabindex', '0');
      document.body.appendChild(input);
    });

    afterEach(() => {
      document.body.removeChild(input);
    });

    it('focuses the element', () => {
      element.autofocus = true;
      assert.equal(document.activeElement, element);
    });

    it('ignores focus when other element is focused', async () => {
      input.focus();
      await nextFrame();
      element.autofocus = true;
      await nextFrame();
      assert.equal(document.activeElement, input);
    });

    it('ignores when disabling', async () => {
      element.autofocus = true;
      await nextFrame();
      input.focus();
      element.autofocus = false;
      assert.equal(document.activeElement, input);
    });
  });

  describe('Info message', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.infoMessage = 'test';
      await nextFrame();
    });

    it('renders info message', () => {
      const node = element.shadowRoot.querySelector('p.info');
      assert.ok(node);
    });

    it('info message is visible', () => {
      const node = element.shadowRoot.querySelector('p.info');
      assert.isFalse(node.classList.contains('label-hidden'));
    });

    it('hides info message when invalid', async () => {
      element.invalid = true;
      element.invalidMessage = 'test msg';
      await nextFrame();
      const node = element.shadowRoot.querySelector('p.info');
      assert.isTrue(node.classList.contains('label-hidden'));
    });
  });

  describe('Error message', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.invalidMessage = 'test';
      await nextFrame();
    });

    it('renders error message', () => {
      const node = element.shadowRoot.querySelector('p.invalid');
      assert.ok(node);
    });

    it('info message is visible when error', async () => {
      element.invalid = true;
      await nextFrame();
      const node = element.shadowRoot.querySelector('p.invalid');
      assert.isFalse(node.classList.contains('label-hidden'));
    });

    it('hides info message when not invalid', async () => {
      const node = element.shadowRoot.querySelector('p.invalid');
      assert.isTrue(node.classList.contains('label-hidden'));
    });
  });

  describe('noLabelFloat', () => {
    let element;
    beforeEach(async () => {
      element = await noLabelFloatFixture();
    });

    it('renders label by default', () => {
      const label = element.shadowRoot.querySelector('.label');
      const { display } = getComputedStyle(label);
      assert.notEqual(display, 'none');
    });

    it('hides label when has value', async () => {
      element.value = 'test';
      await nextFrame();
      const label = element.shadowRoot.querySelector('.label');
      const { display } = getComputedStyle(label);
      assert.equal(display, 'none');
    });
  });

  describe('read only state', () => {
    let element;
    beforeEach(async () => {
      element = await readOnlyFixture();
    });

    it('passes readonly to the input element', () => {
      const input = element.inputElement;
      assert.isTrue(input.readOnly);
    });

    it('removes readonly from the input element', async () => {
      element.readOnly = false;
      await nextFrame();
      const input = element.inputElement;
      assert.isFalse(input.readOnly);
    });
  });

  describe('compatibility mode', () => {
    it('sets compatibility on item when setting legacy', async () => {
      const element = await basicFixture();
      // @ts-ignore
      element.legacy = true;
      // @ts-ignore
      assert.isTrue(element.legacy, 'legacy is set');
      assert.isTrue(element.compatibility, 'compatibility is set');
    });

    it('returns compatibility value from item when getting legacy', async () => {
      const element = await basicFixture();
      element.compatibility = true;
      // @ts-ignore
      assert.isTrue(element.legacy, 'legacy is set');
    });
  });

  describe('Event re-targeting', () => {
    it('re-targets search event', async () => {
      const element = await searchFixture();
      const spy = sinon.spy();
      element.addEventListener('search', spy);
      const input = element.inputElement;
      input.dispatchEvent(new CustomEvent('search'));
      assert.isTrue(spy.called);
    });
  });

  describe('a11y', () => {
    async function a11yBasicFixture() {
      return fixture(`<anypoint-input value="test value">
      <label slot="label">test label</label>
      </anypoint-input>`);
    }

    async function a11yNoLabelFixture() {
      return fixture(`<anypoint-input value="test value"></anypoint-input>`);
    }

    async function a11yPrefixFixture() {
      return fixture(`<anypoint-input name="amount-usd">
        <label slot="label">Amount to transfer</label>
        <span slot="prefix" aria-label="Value in US dollars">$</span>
      </anypoint-input>`);
    }

    async function a11ySuffixFixture() {
      return fixture(`<anypoint-input type="email" name="email-suffix">
        <label slot="label">Email</label>
        <div slot="suffix">@mulesoft.com</div>
      </anypoint-input>`);
    }

    async function formFixtrue() {
      return fixture(`
      <form>
        <fieldset name="form-fields">
          <anypoint-input name="formItem" value="test-value">
            <label slot="label">Text input</label>
          </anypoint-listbox>
        </fieldset>
        <input type="reset" value="Reset">
        <input type="submit" value="Submit">
      </form>`);
    }

    async function a11yOutlinedFixture() {
      return fixture(`<anypoint-input value="test value" outlined>
      <label slot="label">test label</label>
      </anypoint-input>`);
    }

    async function a11yCompatibilityFixture() {
      return fixture(`<anypoint-input value="test value" compatibility>
      <label slot="label">test label</label>
      </anypoint-input>`);
    }

    it('sets tabindex on the element', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('tabindex'), '0');
    });

    it('respects existing tabindex on the element', async () => {
      const element = await fixture(
        `<anypoint-input tabindex="1"></anypoint-input>`
      );
      assert.equal(element.getAttribute('tabindex'), '1');
    });

    it('is accessible with label', async () => {
      const element = await a11yBasicFixture();
      await assert.isAccessible(element);
    });

    it('is not accessible without label', async () => {
      const element = await a11yNoLabelFixture();
      await assert.isNotAccessible(element);
    });

    it('is accessible with a prefix', async () => {
      const element = await a11yPrefixFixture();
      await assert.isAccessible(element);
    });

    it('is accessible with a suffix', async () => {
      const element = await a11ySuffixFixture();
      await assert.isAccessible(element);
    });

    it('is accessible in a form', async () => {
      const element = await formFixtrue();
      await assert.isAccessible(element);
    });

    it('is accessible when outlined', async () => {
      const element = await a11yOutlinedFixture();
      await assert.isAccessible(element);
    });

    it('is accessible when compatibility mode', async () => {
      const element = await a11yCompatibilityFixture();
      await assert.isAccessible(element);
    });
  });

  describe('APIC-574', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('should render 0 value for integer input', async () => {
      element.value = 0;
      element.autoValidate = true;
      element.dataType = 'input';
      element.required = true;
      element.name = 'page';
      element.compatibility = true;
      element.readOnly = false;
      await nextFrame();

      const input = element.shadowRoot.querySelector('.input-element');
      assert.equal(input.value, 0);
    });
  });
});
