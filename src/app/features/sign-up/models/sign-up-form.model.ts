import { FormControl, FormGroup } from '@angular/forms';

export interface SignUpForm {
  name: FormGroup<{
    firstName: FormControl<string>;
    lastName: FormControl<string>;
  }>;
  email: FormControl<string>;
  password: FormControl<string>;
}
