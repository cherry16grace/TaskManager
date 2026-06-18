import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form!: FormGroup;
  isLogin = true;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.form.reset();
    this.error = '';
    if (this.isLogin) {
      this.form.get('name')?.clearAsyncValidators();
    }
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    const { email, password, name } = this.form.value;

    const request = this.isLogin
      ? this.authService.login(email, password)
      : this.authService.register(name, email, password);

    request.subscribe({
      next: (response) => {
        this.authService.setUser(response.user, response.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error.message || 'An error occurred';
        this.loading = false;
      }
    });
  }
}