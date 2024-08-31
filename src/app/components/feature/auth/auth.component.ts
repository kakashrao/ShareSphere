import { NgClass } from "@angular/common";
import { Component, inject, signal, ViewEncapsulation } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";

type AuthMode = "LOGIN" | "SIGNUP";

@Component({
  selector: "sp-auth",
  standalone: true,
  imports: [InputTextModule, PasswordModule, ButtonModule, NgClass],
  templateUrl: "./auth.component.html",
  styleUrl: "./auth.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class AuthComponent {
  private _ref = inject(DynamicDialogRef<AuthComponent>);

  mode = signal<AuthMode>("LOGIN");

  changeMode(mode: AuthMode) {
    this.mode.set(mode);
  }

  close() {
    this._ref.close();
  }
}
