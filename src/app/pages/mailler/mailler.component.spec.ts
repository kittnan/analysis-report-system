import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaillerComponent } from './mailler.component';

describe('MaillerComponent', () => {
  let component: MaillerComponent;
  let fixture: ComponentFixture<MaillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaillerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
