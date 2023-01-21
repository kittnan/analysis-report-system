import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricalSearchComponent } from './electrical-search.component';

describe('ElectricalSearchComponent', () => {
  let component: ElectricalSearchComponent;
  let fixture: ComponentFixture<ElectricalSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricalSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
