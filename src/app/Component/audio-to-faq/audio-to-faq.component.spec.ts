import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioToFaqComponent } from './audio-to-faq.component';

describe('AudioToFaqComponent', () => {
  let component: AudioToFaqComponent;
  let fixture: ComponentFixture<AudioToFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioToFaqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudioToFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
