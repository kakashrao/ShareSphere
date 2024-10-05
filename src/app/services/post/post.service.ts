import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Post, PostCreateRequest } from "../../models/post.model";

@Injectable({
  providedIn: "root",
})
export class PostService {
  private http = inject(HttpClient);

  publishPost(payload: FormData | PostCreateRequest): Observable<Post> {
    return this.http
      .post<{ data: Post }>(`${environment.baseUrl}/api/post/create`, payload)
      .pipe(map((response) => response.data));
  }
}
