import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  NonNullableFormBuilder,
} from '@angular/forms';
import * as CustomValidators from '../../shared/utils/validators';
import { UserService } from './services/user.service';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { SignUpForm } from './models/sign-up-form.model';
import {
  passwordContainsFirstName,
  passwordContainsLastName,
} from './utils/sign-up.validators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
})
export default class SignUpComponent implements OnInit {
  fullName = '';
  isSuccess = false;
  isSubmitting = false;
  isError = false;
  readonly minPasswordLength = 8;

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  signUpForm: FormGroup<SignUpForm> = this.fb.group(
    {
      name: this.fb.group({
        firstName: this.fb.control('', Validators.required),
        lastName: this.fb.control('', Validators.required),
      }),
      email: this.fb.control('', [Validators.required, CustomValidators.email]),
      password: this.fb.control('', [
        Validators.required,
        Validators.minLength(this.minPasswordLength),
        CustomValidators.hasUpperCase,
        CustomValidators.hasLowerCase,
      ]),
    },
    { validators: [passwordContainsFirstName, passwordContainsLastName] }
  );

  ngOnInit(): void {
    this.signUpForm.controls.name.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ firstName, lastName }) => {
        this.fullName = `${firstName} ${lastName}`.trim();
      });
  }

  submitForm() {
    if (this.signUpForm.valid) {
      const firstName = this.signUpForm.controls.name.controls.firstName.value;
      const lastName = this.signUpForm.controls.name.controls.lastName.value;
      const email = this.signUpForm.controls.email.value;

      this.isSubmitting = true;
      this.userService
        .createUser(firstName, lastName, email)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => {
            this.isSubmitting = false;
          })
        )
        .subscribe({
          next: () => {
            this.isSuccess = true;
          },
          error: () => {
            this.isError = true;
          },
        });
    }
  }
}
