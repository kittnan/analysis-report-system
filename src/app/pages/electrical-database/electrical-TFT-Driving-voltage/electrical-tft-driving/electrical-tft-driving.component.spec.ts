import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FileSizePipe } from 'app/pages/progress-form3/file-size.pipe';
import { ElectricalTftDrivingComponent } from './electrical-tft-driving.component';

describe('ElectricalTftDrivingComponent', () => {
  let component: ElectricalTftDrivingComponent;
  let fixture: ComponentFixture<ElectricalTftDrivingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricalTftDrivingComponent, FileSizePipe ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricalTftDrivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
