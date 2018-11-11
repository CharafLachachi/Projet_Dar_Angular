import { TestBed, inject } from '@angular/core/testing';

import { ShowProfileService } from './show-profile.service';

describe('ShowProfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShowProfileService]
    });
  });

  it('should be created', inject([ShowProfileService], (service: ShowProfileService) => {
    expect(service).toBeTruthy();
  }));
});
