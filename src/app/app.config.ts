import { APP_INITIALIZER, ApplicationConfig } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";

import {
  provideHttpClient,
  withInterceptors,
  withXsrfConfiguration,
} from "@angular/common/http";
import { MessageService } from "primeng/api";
import { routes } from "./app.routes";
import { authInterceptor } from "./interceptor/auth.interceptor";
import { AuthStore } from "./store/auth.store";
import { loadApplication } from "./utils/auth.utils";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withXsrfConfiguration({
        cookieName: "XSRF-TOKEN",
        headerName: "x-csrf-token",
      })
    ),
    MessageService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadApplication,
      deps: [AuthStore],
      multi: true,
    },
  ],
};
