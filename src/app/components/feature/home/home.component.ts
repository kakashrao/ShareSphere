import { NgClass } from "@angular/common";
import { Component, signal } from "@angular/core";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { AutoFocusDirective } from "../../../directives/autoFocus/auto-focus.directive";

interface Feature {
  name: string;
  icon: string;
  value: FeatureType;
}

type FeatureType = "HOME" | "FAVOURITES" | "POST" | "MESSAGES" | "PROFILE";

@Component({
  selector: "sp-home",
  standalone: true,
  imports: [ButtonModule, NgClass, AutoCompleteModule, AutoFocusDirective],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent {
  features: Feature[] = [
    { name: "Home", value: "HOME", icon: "pi pi-home" },
    { name: "Message", value: "MESSAGES", icon: "pi pi-inbox" },
    { name: "Post", value: "POST", icon: "pi pi-plus" },
    { name: "Favourites", value: "FAVOURITES", icon: "pi pi-heart" },
    { name: "Profile", value: "PROFILE", icon: "pi pi-user" },
  ];

  selectedFeature = signal<FeatureType>("HOME");
  searchbarOpened = signal<boolean>(false);

  moveToFeature(feature: Feature) {
    this.selectedFeature.set(feature.value);
  }

  toggleSearchbar() {
    this.searchbarOpened.update((value) => !value);
  }
}
