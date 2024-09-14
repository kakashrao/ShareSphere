import { Component, inject, signal, ViewEncapsulation } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { DialogService } from "primeng/dynamicdialog";
import { ToastModule } from "primeng/toast";
import { finalize } from "rxjs";
import { WelcomeLoaderComponent } from "./components/shared/welcome-loader/welcome-loader.component";
import { AuthStore } from "./store/auth.store";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, WelcomeLoaderComponent, ToastModule],
  providers: [DialogService],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  private authStore = inject(AuthStore);

  isFetching = signal<boolean>(true);

  constructor() {
    this._fetchUserDetails();
  }

  private _fetchUserDetails() {
    this.authStore
      .getUserDetails()
      .pipe(finalize(() => this.isFetching.set(false)))
      .subscribe();
  }
}
