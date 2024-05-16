import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// same as `Validators.email` except for extra check for dot in domain part 'hello@fedex.com'
const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const email: ValidatorFn = control => {
  const value = control.value;

  if (!value) return null;

  return EMAIL_REGEXP.test(value) ? null : { email: true };
};

export const hasUpperCase: ValidatorFn = control => {
  const value = control.value;

  if (!value) return null;

  return /[A-Z]+/.test(value) ? null : { hasUpperCase: true };
};

export const hasLowerCase: ValidatorFn = control => {
  const value = control.value;

  if (!value) return null;

  return /[a-z]+/.test(value) ? null : { hasLowerCase: true };
};

export function forbiddenWord(word: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valueLowerCase = control.value.toLowerCase();
    const wordLowerCase = word.toLowerCase();

    if (wordLowerCase && valueLowerCase.includes(wordLowerCase)) {
      return { forbiddenWord: true };
    }

    return null;
  };
}
