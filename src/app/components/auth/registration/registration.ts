import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],

  templateUrl: './registration.html',
  styleUrl: './registration.css',
})

export class Registration {

  registerForm: FormGroup;

  loading = false;
  submitted = false;

  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.registerForm = this.fb.group({

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

      emailId: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          this.passwordValidator
        ]
      ],

      confirmPassword: [
        '',
        Validators.required
      ]

    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {

    const value = control.value;

    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*]/.test(value);

    const valid =
      hasUpperCase &&
      hasLowerCase &&
      hasDigit &&
      hasSpecial;

    return valid ? null : {
      invalidPassword: true
    };
  }

  passwordMatchValidator(
    form: AbstractControl
  ): { [key: string]: boolean } | null {

    const password =
      form.get('password')?.value;

    const confirmPassword =
      form.get('confirmPassword')?.value;

    return password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  onSubmit(): void {

    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    const { confirmPassword, ...payload } =
      this.registerForm.value;

    this.authService.register(payload)
      .subscribe({

        next: () => {

          this.loading = false;

          this.router.navigate(['/login']);
        },

        error: (err) => {

          this.loading = false;

          this.error =
            err.error?.message ||
            'Registration failed';
        }
      });
  }
}