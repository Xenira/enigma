import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/enigma-common/services/user/user.service';

@Component({
  selector: 'enigma-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public registerForm = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, this.matchValues('password')]],
  });
  public registrationFailed = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  public register(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.registrationFailed = false;
    const formValues = this.registerForm.value;
    this.userService
      .register(formValues.username, formValues.email, formValues.password)
      .subscribe(
        () => this.router.navigateByUrl('/home'),
        () => {
          this.registrationFailed = true;
          this.password?.setValue(null);
          this.confirmPassword?.setValue(null);
        }
      );
  }

  get username(): AbstractControl | null {
    return this.registerForm.get('username');
  }

  get email(): AbstractControl | null {
    return this.registerForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.registerForm.get('password');
  }

  get confirmPassword(): AbstractControl | null {
    return this.registerForm.get('confirmPassword');
  }

  private matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value ===
          (control.parent.controls as { [key: string]: AbstractControl })[
            matchTo
          ].value
        ? null
        : { isMatching: false };
    };
  }
}
