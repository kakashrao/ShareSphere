import { NgClass } from "@angular/common";
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { ActivationEnd, Router, RouterOutlet } from "@angular/router";

import { DialogService } from "primeng/dynamicdialog";
import { MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";
import { finalize, Subscription } from "rxjs";
import { AuthComponent } from "./components/feature/auth/auth.component";
import { WelcomeLoaderComponent } from "./components/shared/welcome-loader/welcome-loader.component";
import { AuthStore } from "./store/auth.store";
import { GeneralStore } from "./store/general.store";

interface Feature {
  name: string;
  icon: string;
  value: FeatureType;
  route: string;
}

type FeatureType = "HOME" | "FAVOURITES" | "POST" | "MESSAGES" | "PROFILE";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    WelcomeLoaderComponent,
    NgClass,
    MessagesModule,
    ToastModule,
  ],
  providers: [DialogService],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, OnDestroy {
  private authStore = inject(AuthStore);
  public generalStore = inject(GeneralStore);
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
  isFetching = signal<boolean>(true);
  private routerEventsSub$: Subscription | undefined;

  constructor() {
    this._fetchUserDetails();
  }

  ngOnInit(): void {
    this.routerEventsSub$ = this.router.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {
        this.generalStore.setFullPageOrNot(
          event.snapshot.data["asFullPage"] ?? false
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.routerEventsSub$?.unsubscribe();
  }

  private _fetchUserDetails() {
    this.authStore
      .getUserDetails()
      .pipe(finalize(() => this.isFetching.set(false)))
      .subscribe();
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
