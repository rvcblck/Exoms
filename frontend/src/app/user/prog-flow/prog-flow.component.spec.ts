import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgFlowComponent } from './prog-flow.component';

describe('ProgFlowComponent', () => {
  let component: ProgFlowComponent;
  let fixture: ComponentFixture<ProgFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgFlowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
