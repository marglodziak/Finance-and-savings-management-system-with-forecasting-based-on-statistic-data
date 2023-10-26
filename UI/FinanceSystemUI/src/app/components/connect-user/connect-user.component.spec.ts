import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectUserComponent } from './connect-user.component';

describe('ConnectUserComponent', () => {
  let component: ConnectUserComponent;
  let fixture: ComponentFixture<ConnectUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectUserComponent]
    });
    fixture = TestBed.createComponent(ConnectUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
