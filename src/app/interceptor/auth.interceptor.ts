import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { MessageService } from "primeng/api";
import { catchError, throwError } from "rxjs";
import { AuthStore } from "../store/auth.store";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const authStore = inject(AuthStore);

  return next(req).pipe(
    catchError((error: any) => handleError(error, messageService, authStore))
  );
};

function handleError(
  error: any,
  messageService: MessageService,
  authStore: any
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

  return throwError({ ...error, message });
}
