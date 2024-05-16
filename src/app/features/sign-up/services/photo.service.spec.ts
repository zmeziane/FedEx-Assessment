import { TestBed } from '@angular/core/testing';
import { PhotoService } from './photo.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BASE_URL } from '../../../shared/constants';
import { GetThumbnailResponse } from '../models/get-thumbnail-response.model';

describe('PhotoService', () => {
  let photoService: PhotoService;
  let mockHttpClient: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    photoService = TestBed.inject(PhotoService);
    mockHttpClient = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    mockHttpClient.verify();
  });

  it('should return the thumbnail url from the response', () => {
    const length = 6;
    const dummyResponse: GetThumbnailResponse = {
      thumbnailUrl: 'https://example.com/thumbnail.jpg',
    };

    photoService.getThumbnailUrl(length).subscribe(thumbnailUrl => {
      expect(thumbnailUrl).toEqual(dummyResponse.thumbnailUrl);
    });

    const req = mockHttpClient.expectOne(`${BASE_URL}/photos/${length}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should handle error', () => {
    const length = 6;

    photoService.getThumbnailUrl(length).subscribe({
      next: () => fail('Should fail'),
      error: error => {
        expect(error).toBeTruthy();
      },
    });

    const req = mockHttpClient.expectOne(`${BASE_URL}/photos/${length}`);
    expect(req.request.method).toBe('GET');
    req.error(new ProgressEvent('error'));
  });
});
