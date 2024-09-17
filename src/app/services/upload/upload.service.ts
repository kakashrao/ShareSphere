import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable()
export class UploadService {
  private http = inject(HttpClient);

  uploadAssets(folder: string, assets: FormData) {
    return this.http.post(
      `${environment.baseUrl}/api/assets/upload/${folder}`,
      assets
    );
  }

  deleteAssets(folder: string, fileNames: string[]) {
    return this.http.put(
      `${environment.baseUrl}/api/assets/delete/${folder}`,
      fileNames
    );
  }
}
