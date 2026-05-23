import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './forgotpassword.html',
  styleUrl: './forgotpassword.css'
})

export class Forgotpassword {

  forgotPasswordForm: FormGroup;

  loading = false;
  submitted = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder) {

    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ]
    });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  onSubmit(): void {

    this.submitted = true;

    this.successMessage = null;
    this.errorMessage = null;

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.loading = true;

    const email = this.forgotPasswordForm.value.email;

    // Simulated API Call
    setTimeout(() => {

      this.loading = false;

      // Success Example
      this.successMessage =
        `Password reset link has been sent to ${email}`;

      this.forgotPasswordForm.reset();
      this.submitted = false;

    }, 2000);
  }
}