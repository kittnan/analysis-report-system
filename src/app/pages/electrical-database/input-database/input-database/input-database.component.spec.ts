import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricalInputComponent } from './input-database.component';

describe('InputDatabaseComponent', () => {
  let component: ElectricalInputComponent;
  let fixture: ComponentFixture<ElectricalInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricalInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricalInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
