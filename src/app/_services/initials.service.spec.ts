import { TestBed, inject } from '@angular/core/testing';

import { InitialsService } from './initials.service';

describe('InitialsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitialsService]
    });
  });

  it('should be created', inject([InitialsService], (service: InitialsService) => {
    expect(service).toBeTruthy();
  }));
});
