import { computed, inject } from "@angular/core";
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from "@ngrx/signals";
import { Observable, tap } from "rxjs";
import { User, UserRegistrationRequest } from "../models/user.model";
import { AuthService } from "../services/auth/auth.service";

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
  withComputed(({ userId }) => ({
    isLoggedIn: computed<boolean>(() => !!userId()),
  })),
  withMethods((store, authService = inject(AuthService)) => ({
    register(payload: UserRegistrationRequest): Observable<User> {
      return authService.register(payload).pipe(
        tap((response) => {
          patchState(store, (state) => {
            console.log("registered", response, state);
            return state;
          });
        })
      );
    },
  }))
);
