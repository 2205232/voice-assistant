import { TestBed } from '@angular/core/testing';

import { ChatSevicesService } from './chat-sevices.service';

describe('ChatSevicesService', () => {
  let service: ChatSevicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatSevicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
