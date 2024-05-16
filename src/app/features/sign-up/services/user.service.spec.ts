import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { PhotoService } from './photo.service';
import { of, throwError } from 'rxjs';
import { BASE_URL } from '../../../shared/constants';

describe('UserService', () => {
  let userService: UserService;
  let mockHttpClient: HttpTestingController;
  let photoServiceSpy: jasmine.SpyObj<PhotoService>;

  beforeEach(() => {
    photoServiceSpy = jasmine.createSpyObj('PhotoService', ['getThumbnailUrl']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: PhotoService, useValue: photoServiceSpy }],
    });

    userService = TestBed.inject(UserService);
    mockHttpClient = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    mockHttpClient.verify();
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

  it('should create user with correct data', () => {
    const firstName = 'John';
    const lastName = 'Doe';
    const email = 'john.doe@example.com';
    const thumbnailUrl = 'https://example.com/thumbnail.jpg';
    photoServiceSpy.getThumbnailUrl.and.returnValue(of(thumbnailUrl));

    userService.createUser(firstName, lastName, email).subscribe(() => {
      expect(photoServiceSpy.getThumbnailUrl).toHaveBeenCalledTimes(1);
      expect(photoServiceSpy.getThumbnailUrl).toHaveBeenCalledWith(
        lastName.length
      );
    });

    const req = mockHttpClient.expectOne(`${BASE_URL}/users`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should handle error when fetching thumbnail fails', () => {
    const firstName = 'John';
    const lastName = 'Doe';
    const email = 'john.doe@example.com';
    const someError = new Error('Failed to fetch thumbnail');
    photoServiceSpy.getThumbnailUrl.and.returnValue(
      throwError(() => someError)
    );

    userService.createUser(firstName, lastName, email).subscribe({
      next: () => fail('Expected an error, but succeeded'),
      error: error => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(someError.message);
      },
    });
  });
});
