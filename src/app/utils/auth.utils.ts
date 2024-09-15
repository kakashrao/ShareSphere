import { inject } from "@angular/core";
import { finalize } from "rxjs";
import { AuthStore } from "../store/auth.store";

export function loadApplication(authStore: any) {
  return () => {
    return new Promise<void>((resolve, reject) => {
      authStore
        .getUserDetails()
        .pipe(finalize(() => resolve()))
        .subscribe();
    });
  };
}

export function isAuthenticated() {
  const authStore = inject(AuthStore);

  return authStore.isLoggedIn();
}
