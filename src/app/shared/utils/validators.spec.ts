import { AbstractControl, FormControl } from '@angular/forms';
import { email, forbiddenWord, hasLowerCase, hasUpperCase } from './validators';

describe('validators', () => {
  let control: AbstractControl;

  beforeEach(() => {
    control = new FormControl();
  });

  describe('email', () => {
    it('accepts valid email', () => {
      control.setValue('hello@fedex.com');
      expect(email(control)).toBeNull();

      control.setValue('hello+fedex@fedex.com');
      expect(email(control)).toBeNull();

      control.setValue('h.ello@fedex.com');
      expect(email(control)).toBeNull();

      control.setValue('h.ello@fedex.co.uk');
      expect(email(control)).toBeNull();

      control.setValue('');
      expect(email(control)).toBeNull();

      control.setValue(null);
      expect(email(control)).toBeNull();
    });

    it('errors on invalid email', () => {
      control.setValue('2321.dsfsds');
      expect(email(control)).toEqual({
        email: true,
      });
      control.setValue('hello.fedex');
      expect(email(control)).toEqual({
        email: true,
      });
      control.setValue('hello@fedex');
      expect(email(control)).toEqual({
        email: true,
      });
      control.setValue('hello@');
      expect(email(control)).toEqual({
        email: true,
      });
    });
  });

  describe('forbiddenWord', () => {
    it('should return null if the control value does not contain the forbidden word', () => {
      control.setValue('Hello');

      const result = forbiddenWord('world')(control);

      expect(result).toBeNull();
    });

    it('should return an error object if the control value contains the forbidden word', () => {
      control.setValue('Hello world');

      const result = forbiddenWord('world')(control);

      expect(result).toEqual({ forbiddenWord: true });
    });

    it('should ignore case sensitivity when checking for the forbidden word', () => {
      control.setValue('Hello WORLD');

      const result = forbiddenWord('world')(control);

      expect(result).toEqual({ forbiddenWord: true });
    });

    it('should return null if the control value is empty', () => {
      control.setValue('');

      const result = forbiddenWord('world')(control);

      expect(result).toBeNull();
    });

    it('should return null if the forbidden word is empty', () => {
      control.setValue('Hello world');

      const result = forbiddenWord('')(control);

      expect(result).toBeNull();
    });
  });

  describe('hasUpperCase', () => {
    it('should return null if the control value contains an uppercase letter', () => {
      control.setValue('HelloWorld');

      const result = hasUpperCase(control);

      expect(result).toBeNull();
    });

    it('should return an error object if the control value does not contain an uppercase letter', () => {
      control.setValue('helloworld');

      const result = hasUpperCase(control);

      expect(result).toEqual({ hasUpperCase: true });
    });

    it('should return null if the control value is empty', () => {
      control.setValue('');

      const result = hasUpperCase(control);

      expect(result).toBeNull();
    });
  });

  describe('hasLowerCase', () => {
    it('should return null if the control value contains a lowercase letter', () => {
      control.setValue('helloworld');

      const result = hasLowerCase(control);

      expect(result).toBeNull();
    });

    it('should return an error object if the control value does not contain a lowercase letter', () => {
      control.setValue('HELLOWORLD');

      const result = hasLowerCase(control);

      expect(result).toEqual({ hasLowerCase: true });
    });

    it('should return null if the control value is empty', () => {
      control.setValue('');

      const result = hasLowerCase(control);

      expect(result).toBeNull();
    });
  });
});
