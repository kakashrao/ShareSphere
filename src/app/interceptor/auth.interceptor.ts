import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from "@angular/common/http";
import { inject, signal } from "@angular/core";
import { MessageService } from "primeng/api";
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from "rxjs";
import { AuthService } from "../services/auth/auth.service";
import { AuthStore } from "../store/auth.store";

const isRefreshing = signal(false);
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
  string | null
>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const authStore = inject(AuthStore);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) =>
      handleError(error, req, next, authStore, messageService, authService)
    )
  );
};

function handleError(
  error: any,
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authStore: any,
  messageService: MessageService,
  authService: AuthService
) {
  let message = "Something went wrong";

  if (error instanceof HttpErrorResponse) {
    message = error.error.message;

    switch (error.status) {
      case 401:
        if (!authStore.isLoggedIn()) {
          messageService.add({
            key: "root",
            severity: "error",
            summary: "Error",
            detail: message,
          });
        } else if (message === "TOKEN_EXPIRED") {
          return handleTokenExpirationError(
            authStore,
            messageService,
            authService,
            req,
            next
          );
        } else {
          localStorage.clear();
          authStore.logout();
        }
        break;
      case 403:
      case 404:
      case 500:
      case 400:
        messageService.add({
          key: "root",
          severity: "error",
          summary: "Error",
          detail: message,
        });
        break;
      default:
    }
  } else {
    message = error?.message ?? message;

    messageService.add({
      key: "root",
      summary: "Error",
      detail: message,
    });
  }

  return throwError(() => ({ ...error, message }));
}

function handleTokenExpirationError(
  authStore: any,
  messageService: MessageService,
  authService: AuthService,
  req: HttpRequest<any>,
  next: HttpHandlerFn
) {
  if (!isRefreshing()) {
    isRefreshing.set(true);
    refreshTokenSubject.next(null);

    return authService.updateAccessToken().pipe(
      switchMap((token: any) => {
        isRefreshing.set(false);
        refreshTokenSubject.next("REFRESHED");
        return next(req);
      }),
      catchError((error) => {
        isRefreshing.set(false);
        handleError(error, req, next, authStore, messageService, authService);
        return throwError(() => error);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token != null),
      take(1),
      switchMap((token) => next(req))
    );
  }
}
