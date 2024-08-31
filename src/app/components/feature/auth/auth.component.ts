import { Component, inject, ViewEncapsulation } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";

@Component({
  selector: "sp-auth",
  standalone: true,
  imports: [InputTextModule, PasswordModule, ButtonModule],
  templateUrl: "./auth.component.html",
  styleUrl: "./auth.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class AuthComponent {
  private _ref = inject(DynamicDialogRef<AuthComponent>);

  close() {
    this._ref.close();
  }
}
