import { inject } from "@angular/core";
import { AuthStore } from "../store/auth.store";

export function loadApplication(authStore: any) {
  return () => {
    let interval: ReturnType<typeof setInterval> | undefined;

    return new Promise<void>((resolve, reject) => {
      authStore.getUserDetails();

      interval = setInterval(() => {
        if (authStore.isCompleted() || !!authStore.error()) {
          resolve();
          clearInterval(interval);
        }
      }, 1000);
    });
  };
}

export function isAuthenticated() {
  const authStore = inject(AuthStore);

  return authStore.isLoggedIn();
}
