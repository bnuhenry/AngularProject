import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandsetComponent } from './handset.component';

describe('HandsetComponent', () => {
  let component: HandsetComponent;
  let fixture: ComponentFixture<HandsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
