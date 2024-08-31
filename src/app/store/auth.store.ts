import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { User } from "../models/user.model";

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
  withMethods((store) => ({
    register(): void {
      patchState(store, (state) => {
        console.log("registered", state);
        return state;
      });
    },
  }))
);
