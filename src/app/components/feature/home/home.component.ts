import { Component, signal } from "@angular/core";
import { AutoCompleteModule } from "primeng/autocomplete";
import { AutoFocusModule } from "primeng/autofocus";
import { ButtonModule } from "primeng/button";
import { PostComponent } from "../post/post.component";

@Component({
  selector: "sp-home",
  standalone: true,
  imports: [AutoCompleteModule, AutoFocusModule, ButtonModule, PostComponent],
  providers: [],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent {
  searchbarOpened = signal<boolean>(false);

  toggleSearchbar() {
    this.searchbarOpened.update((value) => !value);
  }
}
