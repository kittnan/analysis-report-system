import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDatabaseComponent } from './input-database.component';

describe('InputDatabaseComponent', () => {
  let component: InputDatabaseComponent;
  let fixture: ComponentFixture<InputDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputDatabaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
