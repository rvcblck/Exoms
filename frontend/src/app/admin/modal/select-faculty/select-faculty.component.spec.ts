import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFacultyComponent } from './select-faculty.component';

describe('SelectFacultyComponent', () => {
  let component: SelectFacultyComponent;
  let fixture: ComponentFixture<SelectFacultyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectFacultyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
