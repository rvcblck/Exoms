import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgTopicComponent } from './prog-topic.component';

describe('ProgTopicComponent', () => {
  let component: ProgTopicComponent;
  let fixture: ComponentFixture<ProgTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgTopicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
