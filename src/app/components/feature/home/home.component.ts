import { NgClass } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { AutoCompleteModule } from "primeng/autocomplete";
import { AutoFocusModule } from "primeng/autofocus";
import { ButtonModule } from "primeng/button";
import { DialogService } from "primeng/dynamicdialog";
import { AuthStore } from "../../../store/auth.store";
import { AuthComponent } from "../auth/auth.component";

interface Feature {
  name: string;
  icon: string;
  value: FeatureType;
}

type FeatureType = "HOME" | "FAVOURITES" | "POST" | "MESSAGES" | "PROFILE";

@Component({
  selector: "sp-home",
  standalone: true,
  imports: [ButtonModule, NgClass, AutoCompleteModule, AutoFocusModule],
  providers: [DialogService],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent {
  authStore = inject(AuthStore);
  dialog = inject(DialogService);

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
    if (!this.authStore.isLoggedIn()) {
      this.dialog.open(AuthComponent, {
        width: "95vw",
        height: "auto",
        style: {
          maxHeight: "95vh",
        },
        showHeader: false,
        styleClass: "custom-dialog",
        closeOnEscape: true,
        closable: true,
      });
      return;
    }

    this.selectedFeature.set(feature.value);
  }

  toggleSearchbar() {
    this.searchbarOpened.update((value) => !value);
  }
}
