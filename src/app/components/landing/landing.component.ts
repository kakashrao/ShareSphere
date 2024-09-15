import { Component, inject, signal, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { DialogService } from "primeng/dynamicdialog";
import { Subscription } from "rxjs";
import { AuthStore } from "../../store/auth.store";
import { AuthComponent } from "../feature/auth/auth.component";

interface Feature {
  name: string;
  icon: string;
  value: FeatureType;
  route: string;
}

type FeatureType = "HOME" | "FAVOURITES" | "POST" | "MESSAGES" | "PROFILE";

@Component({
  selector: "sp-landing",
  templateUrl: "./landing.component.html",
  styleUrl: "./landing.component.scss",
  encapsulation: ViewEncapsulation.None,
  providers: [DialogService],
})
export class LandingComponent {
  private authStore = inject(AuthStore);
  private dialog = inject(DialogService);

  private router = inject(Router);
  features: Feature[] = [
    { name: "Home", value: "HOME", icon: "pi pi-home", route: "home" },
    { name: "Message", value: "MESSAGES", icon: "pi pi-inbox", route: "home" },
    { name: "Post", value: "POST", icon: "pi pi-plus", route: "create-post" },
    {
      name: "Favourites",
      value: "FAVOURITES",
      icon: "pi pi-heart",
      route: "home",
    },
    { name: "Profile", value: "PROFILE", icon: "pi pi-user", route: "home" },
  ];

  selectedFeature = signal<FeatureType>("HOME");

  private routerEventsSub$: Subscription | undefined;

  ngOnInit(): void {
    // this.routerEventsSub$ = this.router.events.subscribe((event) => {
    //   if (event instanceof ActivationEnd) {
    //     this.generalStore.setFullPageOrNot(
    //       event.snapshot.data["asFullPage"] ?? false
    //     );
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.routerEventsSub$?.unsubscribe();
  }

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
    this.router.navigate([feature.route]);
  }
}
