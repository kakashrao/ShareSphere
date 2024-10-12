import { computed, inject } from "@angular/core";
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from "@ngrx/signals";
import { tap } from "rxjs";
import {
  User,
  UserLoginRequest,
  UserRegistrationRequest,
} from "../models/user.model";
import { AuthService } from "../services/auth/auth.service";
import {
  setCompleted,
  setError,
  setLoading,
  withRequestStatus,
} from "./features/request-status.feature";

const initialState: User = {
  userId: "",
  coverImage: "",
  createdAt: "",
  email: "",
  fullName: "",
  profileImage: "",
  updatedAt: "",
  username: "",
};

export const AuthStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withRequestStatus(),
  withComputed(({ userId }) => ({
    isLoggedIn: computed<boolean>(() => !!userId()),
  })),
  withMethods((store, authService = inject(AuthService)) => ({
    register(payload: UserRegistrationRequest): void {
      patchState(store, setLoading());

      authService.register(payload).subscribe({
        next: (response) => {
          patchState(store, { ...response, ...setCompleted() });
        },
        error: (error: any) => {
          patchState(store, setError(error));
        },
      });
    },
    login(payload: UserLoginRequest): void {
      patchState(store, setLoading());

      authService.login(payload).subscribe({
        next: (response) => {
          patchState(store, { ...response, ...setCompleted() });
        },
        error: (error: any) => {
          patchState(store, setError(error));
        },
      });
    },
    logout(): void {
      authService
        .logout()
        .pipe(
          tap(() => {
            patchState(store, { ...initialState });
          })
        )
        .subscribe();
    },
    getUserDetails(): void {
      patchState(store, setLoading());

      authService.fetchUser().subscribe({
        next: (response) => {
          !!response
            ? patchState(store, { ...response, ...setCompleted() })
            : patchState(store, setCompleted());
        },
        error: (error) => {
          patchState(store, setError(error));
        },
      });
    },
  }))
);
