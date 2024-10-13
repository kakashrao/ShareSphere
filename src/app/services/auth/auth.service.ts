import { HttpBackend, HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import {
  User,
  UserLoginRequest,
  UserRegistrationRequest,
} from "../../models/user.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private http = inject(HttpClient);
  private httpBackend = inject(HttpBackend);

  register(payload: UserRegistrationRequest): Observable<User> {
    return this.http
      .post<{ data: User }>(`${environment.baseUrl}/api/user/register`, payload)
      .pipe(map((response) => response.data));
  }

  login(payload: UserLoginRequest): Observable<User> {
    return this.http
      .put<{ data: User }>(`${environment.baseUrl}/api/user/login`, payload)
      .pipe(map((response) => response.data));
  }

  logout(): Observable<void> {
    return this.http.put<void>(`${environment.baseUrl}/api/user/login`, {});
  }

  fetchUser(): Observable<User | null> {
    return this.http
      .get<{ data: User } | null>(`${environment.baseUrl}/api/user/me`)
      .pipe(
        map((response) => {
          if (response) {
            return response.data;
          } else {
            return null;
          }
        })
      );
  }

  updateAccessToken(): Observable<void> {
    return this.http.put<void>(
      `${environment.baseUrl}/api/user/refreshToken`,
      {}
    );
  }
}
