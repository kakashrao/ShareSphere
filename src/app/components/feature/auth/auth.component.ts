import { JsonPipe, NgClass } from "@angular/common";
import { Component, inject, signal, ViewEncapsulation } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MessageService } from "primeng/api";
import { AutoFocusModule } from "primeng/autofocus";
import { ButtonModule } from "primeng/button";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { KeyFilterModule } from "primeng/keyfilter";
import { PasswordModule } from "primeng/password";
import { finalize } from "rxjs";
import {
  User,
  UserLoginRequest,
  UserRegistrationRequest,
} from "../../../models/user.model";
import { AuthStore } from "../../../store/auth.store";

type AuthMode = "LOGIN" | "SIGNUP";

@Component({
  selector: "sp-auth",
  standalone: true,
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    NgClass,
    KeyFilterModule,
    AutoFocusModule,
    ReactiveFormsModule,
    JsonPipe,
  ],
  templateUrl: "./auth.component.html",
  styleUrl: "./auth.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private _ref = inject(DynamicDialogRef<AuthComponent>);
  private authStore = inject(AuthStore);
  private messageService = inject(MessageService);
  blockSpace: RegExp = /[^s]/;

  isLoading = signal<boolean>(false);
  mode = signal<AuthMode>("LOGIN");

  registerForm!: FormGroup;
  loginForm!: FormGroup;

  constructor() {
    this._prepareForm();
  }

  private _prepareForm() {
    if (this.mode() === "LOGIN") {
      !!this.registerForm && this.registerForm.reset();

      !this.loginForm &&
        (this.loginForm = this.fb.group({
          id: this.fb.control("", {
            nonNullable: true,
            validators: [Validators.required],
          }),
          password: this.fb.control("", {
            nonNullable: true,
            validators: [Validators.required],
          }),
        }));
    } else {
      !!this.loginForm && this.loginForm.reset();

      !this.registerForm &&
        (this.registerForm = this.fb.group({
          name: this.fb.control("", {
            nonNullable: true,
            validators: [Validators.required],
          }),
          username: this.fb.control("", {
            nonNullable: true,
            validators: [Validators.required],
          }),
          email: this.fb.control("", {
            nonNullable: true,
            validators: [Validators.email, Validators.required],
          }),
          password: this.fb.control("", {
            nonNullable: true,
            validators: [Validators.required],
          }),
        }));
    }
  }

  changeMode(mode: AuthMode) {
    this.mode.set(mode);
    this._prepareForm();
  }

  handleUserRegistration() {
    this.isLoading.set(true);

    const payload = this.registerForm.value as UserRegistrationRequest;

    this.authStore
      .register(payload)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response: User) => {
          this.messageService.add({
            key: "root",
            severity: "success",
            summary: `Hey ${payload.name}!`,
            detail: `Ready to make your feed fabulous? Let’s get started!`,
            life: 3000,
          });
          this.close();
        },
      });
  }

  handleUserLogin() {
    this.isLoading.set(true);

    const payload = this.loginForm.value as UserLoginRequest;

    this.authStore
      .login(payload)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response: User) => {
          this.messageService.add({
            key: "root",
            severity: "success",
            summary: `Welcome back, ${response.fullName}!`,
            detail: `Ready to conquer the feed again? 🎉`,
            life: 3000,
          });
          this.close();
        },
      });
  }

  close() {
    this._ref.close();
  }
}
