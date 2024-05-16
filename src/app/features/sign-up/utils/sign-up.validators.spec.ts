import { FormControl, FormGroup } from '@angular/forms';
import {
  passwordContainsFirstName,
  passwordContainsLastName,
} from './sign-up.validators';
import { SignUpForm } from '../models/sign-up-form.model';

describe('Sign up validators', () => {
  let signUpForm: FormGroup<SignUpForm>;

  beforeEach(() => {
    signUpForm = new FormGroup<SignUpForm>({
      name: new FormGroup({
        firstName: new FormControl('', { nonNullable: true }),
        lastName: new FormControl('', { nonNullable: true }),
      }),
      email: new FormControl('', { nonNullable: true }),
      password: new FormControl('', { nonNullable: true }),
    });
  });

  it('should return null if password does not contain first name', () => {
    signUpForm.patchValue({
      name: { firstName: 'John', lastName: 'Doe' },
      password: 'password',
    });

    const result = passwordContainsFirstName(signUpForm);

    expect(result).toBeNull();
  });

  it('should return error object if password contains first name', () => {
    signUpForm.patchValue({
      name: { firstName: 'John', lastName: 'Doe' },
      password: 'Johnfedex',
    });

    const result = passwordContainsFirstName(signUpForm);

    expect(result).toEqual({ passwordContainsFirstName: true });
  });

  it('should return error object if password contains first name in different case', () => {
    signUpForm.patchValue({
      name: { firstName: 'John', lastName: 'Doe' },
      password: 'JOHNfedex',
    });

    const result = passwordContainsFirstName(signUpForm);

    expect(result).toEqual({ passwordContainsFirstName: true });
  });

  it('should return null if password does not contain last name', () => {
    signUpForm.patchValue({
      name: { firstName: 'John', lastName: 'Doe' },
      password: 'password',
    });

    const result = passwordContainsLastName(signUpForm);

    expect(result).toBeNull();
  });

  it('should return error object if password contains last name', () => {
    signUpForm.patchValue({
      name: { firstName: 'John', lastName: 'Doe' },
      password: 'feDOEex',
    });

    const result = passwordContainsLastName(signUpForm);

    expect(result).toEqual({ passwordContainsLastName: true });
  });
});
