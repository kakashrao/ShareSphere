import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeLoaderComponent } from './welcome-loader.component';

describe('WelcomeLoaderComponent', () => {
  let component: WelcomeLoaderComponent;
  let fixture: ComponentFixture<WelcomeLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
