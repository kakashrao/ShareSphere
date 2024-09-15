import { Component, ViewEncapsulation } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  constructor() {
    const loader = document.getElementById("intialize-loader");
    !!loader && (loader.style.display = "none");
  }
}
