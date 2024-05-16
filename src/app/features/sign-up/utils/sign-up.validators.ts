import { FormGroup, ValidatorFn } from '@angular/forms';
import { SignUpForm } from '../models/sign-up-form.model';
import { forbiddenWord } from '../../../shared/utils/validators';

export const passwordContainsFirstName: ValidatorFn = control => {
  const form = control as FormGroup<SignUpForm>;
  const firstName = form.value.name?.firstName;

  if (firstName) {
    const passwordContainsFirstName = forbiddenWord(firstName)(
      form.controls.password
    );
    if (passwordContainsFirstName) return { passwordContainsFirstName: true };
  }

  return null;
};

export const passwordContainsLastName: ValidatorFn = control => {
  const form = control as FormGroup<SignUpForm>;
  const lastName = form.value.name?.lastName;

  if (lastName) {
    const passwordContainsLastName = forbiddenWord(lastName)(
      form.controls.password
    );
    if (passwordContainsLastName) return { passwordContainsLastName: true };
  }

  return null;
};
