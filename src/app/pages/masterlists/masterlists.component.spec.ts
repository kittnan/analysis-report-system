import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterlistsComponent } from './masterlists.component';

describe('MasterlistsComponent', () => {
  let component: MasterlistsComponent;
  let fixture: ComponentFixture<MasterlistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterlistsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterlistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
