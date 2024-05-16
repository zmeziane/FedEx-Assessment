import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BASE_URL } from '../../../shared/constants';
import { GetThumbnailResponse } from '../models/get-thumbnail-response.model';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private readonly http = inject(HttpClient);

  getThumbnailUrl(length: number): Observable<string> {
    return this.http
      .get<GetThumbnailResponse>(`${BASE_URL}/photos/${length}`)
      .pipe(map(response => response.thumbnailUrl));
  }
}
