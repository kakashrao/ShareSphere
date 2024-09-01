import { computed } from "@angular/core";
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from "@ngrx/signals";
import { User } from "../models/user.model";

const initialState: User = {
  userId: "sdsdsa",
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
  withMethods((store) => ({
    register(): void {
      patchState(store, (state) => {
        console.log("registered", state);
        return state;
      });
    },
  }))
);
