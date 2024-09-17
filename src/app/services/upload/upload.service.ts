import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Asset } from "../../models/asset.model";

@Injectable()
export class UploadService {
  private http = inject(HttpClient);

  uploadAssets(folder: string, assets: File | File[]): Observable<Asset[]> {
    const fd = new FormData();

    assets = Array.isArray(assets) ? assets : [assets];
    assets.forEach((f) => {
      fd.append("files", f);
    });

    return this.http
      .post<{
        data: Asset[];
      }>(`${environment.baseUrl}/api/assets/upload/${folder}`, fd)
      .pipe(map((res) => res.data));
  }

  deleteAssets(folder: string, fileNames: string[]) {
    return this.http.put(
      `${environment.baseUrl}/api/assets/delete/${folder}`,
      fileNames
    );
  }
}
