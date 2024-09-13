import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
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

  register(payload: UserRegistrationRequest): Observable<User> {
    return this.http.post<User>(
      `${environment.baseUrl}/user/register`,
      payload
    );
  }

  login(payload: UserLoginRequest) {
    return this.http.put(`${environment.baseUrl}/user/login`, payload);
  }
}
