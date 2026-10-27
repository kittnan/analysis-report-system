import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FileSizePipe } from 'app/pages/progress-form3/file-size.pipe';
import { ElectricalResistanceComponent } from './electrical-resistance.component';

describe('ElectricalResistanceComponent', () => {
  let component: ElectricalResistanceComponent;
  let fixture: ComponentFixture<ElectricalResistanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricalResistanceComponent, FileSizePipe ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricalResistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
