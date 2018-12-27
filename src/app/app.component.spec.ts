import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router,ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing'

describe('AppComponent', () => {
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  let component: AppComponent;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule],
      declarations: [
        AppComponent
      ],
      providers: [      
        { provide: Router, useValue: mockRouter}]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
   expect(app).toBeTruthy();
  }));
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
   expect(app.title).toEqual('Task Manager');
  }));

  it('OnView click should go to view screen', () =>
  {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.onNaviagteToView();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/view']);
  })
  it('OnView click should go to Add screen', () =>
  {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.onNaviagteToAdd();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/add']);
  })
});
