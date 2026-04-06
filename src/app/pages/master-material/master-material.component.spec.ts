import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterMaterialComponent } from './master-material.component';

describe('MasterMaterialComponent', () => {
  let component: MasterMaterialComponent;
  let fixture: ComponentFixture<MasterMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
