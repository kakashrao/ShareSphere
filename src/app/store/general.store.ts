import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";

type IntitalState = {
  showFullPage: boolean;
};

const initialState: IntitalState = {
  showFullPage: false,
};

export const GeneralStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withMethods((store) => ({
    setFullPageOrNot(value: boolean) {
        patchState(store, (state) => ({ showFullPage: value }))
    }
  }))
);
