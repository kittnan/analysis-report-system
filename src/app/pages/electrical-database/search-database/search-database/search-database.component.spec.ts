import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricalSearchComponent } from './search-database.component';

describe('SearchDatabaseComponent', () => {
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
