import { inject } from "@angular/core";
import { AuthStore } from "../store/auth.store";

export function isAuthenticated() {
  const authStore = inject(AuthStore);

  return authStore.isLoggedIn();
}
