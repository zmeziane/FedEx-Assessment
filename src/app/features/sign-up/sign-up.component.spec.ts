import { TestBed } from '@angular/core/testing';
import SignUpComponent from './sign-up.component';
import { UserService } from './services/user.service';
import { of, throwError } from 'rxjs';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['createUser']);

    TestBed.configureTestingModule({
      providers: [
        SignUpComponent,
        { provide: UserService, useValue: userServiceSpy },
      ],
    });

    component = TestBed.inject(SignUpComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit form', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should update full name', () => {
      component.signUpForm.patchValue({
        name: { firstName: 'John', lastName: 'Doe' },
      });

      expect(component.fullName).toBe('John Doe');
    });

    it('should update full name when last name contains spaces', () => {
      component.signUpForm.patchValue({
        name: { firstName: 'John', lastName: ' ' },
      });

      expect(component.fullName).toBe('John');
    });

    it('should update full name when first name contains spaces', () => {
      component.signUpForm.patchValue({
        name: { firstName: ' John', lastName: 'Doe' },
      });

      expect(component.fullName).toBe('John Doe');
    });
  });

  describe('submit form', () => {
    it('should not create user when form is invalid', () => {
      component.signUpForm.patchValue({
        name: { firstName: 'John', lastName: 'Doe' },
        email: 'invalid-email',
        password: 'invalidpassword',
      });

      component.submitForm();

      expect(userServiceSpy.createUser).not.toHaveBeenCalled();
    });

    it('should update success when user creation succeeds', () => {
      component.signUpForm.patchValue({
        name: { firstName: 'John', lastName: 'Doe' },
        email: 'test@example.com',
        password: 'ValidPassword',
      });
      userServiceSpy.createUser.and.returnValue(of(undefined));

      component.submitForm();

      expect(component.signUpForm.valid).toBeTruthy();
      expect(userServiceSpy.createUser).toHaveBeenCalled();
      expect(component.isSuccess).toBe(true);
    });

    it('should update error when user creation fails', () => {
      component.signUpForm.patchValue({
        name: { firstName: 'John', lastName: 'Doe' },
        email: 'test@example.com',
        password: 'ValidPassword',
      });
      userServiceSpy.createUser.and.returnValue(throwError(() => new Error()));

      component.submitForm();

      expect(userServiceSpy.createUser).toHaveBeenCalled();
      expect(component.isError).toBe(true);
    });
  });

  describe('password validation', () => {
    beforeEach(() => {
      component.signUpForm.patchValue({
        name: { firstName: 'John', lastName: 'Doe' },
        email: 'test@example.com',
      });
    });

    it('should validate password contains at least one upper case letter', () => {
      component.signUpForm.patchValue({
        password: 'password',
      });

      expect(component.signUpForm.valid).toBe(false);
      expect(
        component.signUpForm.controls.password.errors?.['hasUpperCase']
      ).toBeTruthy();
    });

    it('should validate password contains at least one lower case letter', () => {
      component.signUpForm.patchValue({
        password: 'PASSWORD',
      });

      expect(component.signUpForm.valid).toBe(false);
      expect(
        component.signUpForm.controls.password.errors?.['hasLowerCase']
      ).toBeTruthy();
    });

    it('should validate password contains first name', () => {
      component.signUpForm.patchValue({
        name: { firstName: 'John', lastName: 'Doe' },
        password: 'JohnFedex1',
      });

      expect(component.signUpForm.valid).toBe(false);
      expect(
        component.signUpForm.errors?.['passwordContainsFirstName']
      ).toBeTruthy();
    });

    it('should validate password contains last name', () => {
      component.signUpForm.patchValue({
        name: { firstName: 'John', lastName: 'Doe' },
        password: 'Fedexdoe',
      });

      expect(component.signUpForm.valid).toBe(false);
      expect(
        component.signUpForm.errors?.['passwordContainsLastName']
      ).toBeTruthy();
    });

    it('should validate password is too short', () => {
      component.signUpForm.patchValue({
        password: 'Short',
      });

      expect(component.signUpForm.valid).toBe(false);
      expect(
        component.signUpForm.controls.password.errors?.['minlength']
      ).toBeTruthy();
    });
  });
});
