import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/auth.service';
import { AuthRequest } from '../../../models/auth-request.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {

  loginForm: FormGroup;

  loading = false;
  submitted = false;
  error: string | null = null;

  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      tenantId: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {

    this.submitted = true;
    this.error = null;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    const authRequest: AuthRequest = this.loginForm.value;

    this.authService.login(authRequest).subscribe({

      next: () => {

        this.loading = false;

        this.router.navigate(['/dashboard']);
      },

      error: (err) => {

        this.loading = false;

        this.error =
          err.error?.message || 'Login failed';
      }
    });
  }
}