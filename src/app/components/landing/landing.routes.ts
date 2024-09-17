import { Routes } from "@angular/router";
import { LandingComponent } from "./landing.component";

export const LandingRoutes: Routes = [
  {
    path: "",
    component: LandingComponent,
    children: [
      { path: "", redirectTo: "/home", pathMatch: "full" },
      {
        path: "home",
        loadComponent: () =>
          import("../feature/home/home.component").then((c) => c.HomeComponent),
      },
    ],
  },
];
