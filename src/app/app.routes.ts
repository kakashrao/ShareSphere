import { Routes } from "@angular/router";
import { isAuthenticated } from "./utils/auth.utils";

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  {
    path: "home",
    loadComponent: () =>
      import("./components/feature/home/home.component").then(
        (c) => c.HomeComponent
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
