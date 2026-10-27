import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MaillerComponent } from './mailler.component';

describe('MaillerComponent', () => {
  let component: MaillerComponent;
  let fixture: ComponentFixture<MaillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaillerComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule.withRoutes([{ path: '**', children: [] }]) ]
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
