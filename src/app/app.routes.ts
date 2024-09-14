import { Routes } from "@angular/router";
import { isAuthenticated } from "./utils/auth.utils";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./components/landing/landing.module").then(
        (c) => c.LandingModule
      ),
  },
  {
    path: "create-post",
    loadComponent: () =>
      import("./components/feature/create-post/create-post.component").then(
        (c) => c.CreatePostComponent
      ),
    data: {
      asFullPage: true,
    },
    canActivate: [isAuthenticated],
  },
];
