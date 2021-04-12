import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/enigma-common/services/user/user.service';

@Component({
  selector: 'enigma-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  public loginFailed = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loginFailed = false;
    const formValues = this.loginForm.value;
    this.userService.login(formValues.email, formValues.password).subscribe(
      () => this.router.navigateByUrl('/home'),
      () => {
        this.loginFailed = true;
        this.loginForm.get('password')?.setValue(null);
      }
    );
  }
}
