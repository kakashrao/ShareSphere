import { computed } from "@angular/core";
import { signalStoreFeature, withComputed, withState } from "@ngrx/signals";

export type RequestStatus =
  | "idle"
  | "loading"
  | "completed"
  | { error: { statusCode: number; message: string } };

export type RequestStatusState = { requestStatus: RequestStatus };

export function withRequestStatus() {
  return signalStoreFeature(
    withState<RequestStatusState>({ requestStatus: "idle" }),
    withComputed(({ requestStatus }) => ({
      isLoading: computed(() => requestStatus() === "loading"),
      isCompleted: computed(() => requestStatus() === "completed"),
      error: computed(() => {
        const status = requestStatus();
        return typeof status === "object" ? status.error : null;
      }),
    }))
  );
}

export function setLoading(): RequestStatusState {
  return { requestStatus: "loading" };
}

export function setCompleted(): RequestStatusState {
  return { requestStatus: "completed" };
}

export function setError(error: any): RequestStatusState {
  return {
    requestStatus: {
      error: {
        statusCode: error?.statusCode ?? 500,
        message: error?.message ?? "Something went wrong",
      },
    },
  };
}
