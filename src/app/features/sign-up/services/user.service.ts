import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { BASE_URL } from '../../../shared/constants';
import { PhotoService } from './photo.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly photoService = inject(PhotoService);

  createUser(
    firstName: string,
    lastName: string,
    email: string
  ): Observable<void> {
    return this.photoService.getThumbnailUrl(lastName.length).pipe(
      switchMap(thumbnailUrl => {
        const body = {
          firstName,
          lastName,
          email,
          thumbnailUrl,
        };
        return this.http.post<void>(`${BASE_URL}/users`, body);
      })
    );
  }
}
