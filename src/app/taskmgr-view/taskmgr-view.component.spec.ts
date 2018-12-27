import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskmgrViewComponent } from './taskmgr-view.component';
import { SharedService } from '../shared.service';
import { MockSharedService } from '../mock-shared-service';
import { Observable } from '../../../node_modules/rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/throw';
import { FormsModule }   from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskDetails } from '../Models/taskDetails';
import { Router,ActivatedRoute} from '@angular/router';
import { TaskmgrSearchPipe } from './taskmgr-search.pipe';
import { DatePipe } from '@angular/common';

describe('TaskmgrViewComponent', () => {
  let component: TaskmgrViewComponent;
  let fixture: ComponentFixture<TaskmgrViewComponent>;
  let service : SharedService; 
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')  
  };
  const TASK_DETAILS : any[] = [
    { "id": 101, "name": "Task 101", "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10,"endTask":false, "parentId":null, "parentName":null },
    { "id": 102, "name": "Task 102", "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10,"endTask":true, "parentId":null, "parentName":null },
    { "id": 103, "name": "Task 103", "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10,"endTask":true, "parentId":102, "parentName":null },
    { "id": 104, "name": "Task 104", "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10,"endTask":false, "parentId":101, "parentName":null},
    ];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule],
      declarations: [ TaskmgrViewComponent, TaskmgrSearchPipe ],
      providers: [
        {provide: SharedService, useClass: MockSharedService},
        { provide: ActivatedRoute, useValue: { 'queryParams': Observable.from([{ 'id': 101 }]) } },
        { provide: Router, useValue: mockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskmgrViewComponent);
    component = fixture.componentInstance;
    service = TestBed.get(SharedService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should have 4 task details', () => {
    spyOn(service,'GetAllTasks').and.returnValues(Observable.of(TASK_DETAILS));   
    component.ngOnInit();
    expect(4).toBe(component.taskDetails.length);  
    expect(service.GetAllTasks).toHaveBeenCalled();   
  })

  it('Task Filter Should have 4 task details', () => {
    spyOn(service,'GetAllTasks').and.returnValues(Observable.of(TASK_DETAILS));   
    component.ngOnInit();
    expect(4).toBe(component.taskDetailsFiltered.length);  
    expect(false).toBe(component.showError);  
    expect(service.GetAllTasks).toHaveBeenCalled();   
  })

  it('Should have correct parent name', () => {
    spyOn(service,'GetAllTasks').and.returnValues(Observable.of(TASK_DETAILS));   
    component.ngOnInit();    
    expect("Task 102").toBe(component.taskDetails[2].parentName);  
    expect("Task 101").toBe(component.taskDetails[3].parentName);  
    expect("This Task has No Parent").toBe(component.taskDetails[0].parentName);  
    expect("This Task has No Parent").toBe(component.taskDetails[1].parentName);  
    expect(service.GetAllTasks).toHaveBeenCalled();   
  })

  it('NgOnInit should handle Internal server error', () =>
  { 
    var error = { status: 500, _body :'"Internal server error"'};
    spyOn(service,'GetAllTasks').and.returnValue(Observable.throw(error));
    component.ngOnInit();     
    expect("Internal server error").toBe(component.results);
    expect(service.GetAllTasks).toHaveBeenCalled();   
  });

  it('OnNgOnInit showError should True', () =>
  { 
    var error = { status: 500, _body :'"Internal server error"'};
    spyOn(service,'GetAllTasks').and.returnValue(Observable.throw(error));
    component.ngOnInit();     
    expect(true).toBe(component.showError);
    expect(service.GetAllTasks).toHaveBeenCalled();   
  });

  it('End Task should return Success', () =>
  {   
    component.taskDetails = TASK_DETAILS;   
   // console.log(taskDetails.endTask);   
    spyOn(service,'PutTask').and.returnValue(Observable.of("SUCCESS"));
    component.endTask(101);   
    expect("Task 101 has been closed successfully").toBe(component.results);
    expect(service.PutTask).toHaveBeenCalledWith(TASK_DETAILS[0], 101);    
  });

  it('End Task should be True', () =>
  {   
    component.taskDetails = TASK_DETAILS;   
   // console.log(taskDetails.endTask);   
    spyOn(service,'PutTask').and.returnValue(Observable.of("SUCCESS"));
    component.endTask(101);   
    expect(true).toBe(TASK_DETAILS[0].endTask);
    expect(service.PutTask).toHaveBeenCalledWith(TASK_DETAILS[0], 101);    
  });

  it('EndTask should handle Internal server error', () =>
  {
    component.taskDetails = TASK_DETAILS;
    var error = { status: 500,statusText:"500", _body :'"Internal server error"'};
    spyOn(service,'PutTask').and.returnValue(Observable.throw(error));
    component.endTask(101);     
    expect("500-Internal server error").toBe(component.results);
    expect(service.PutTask).toHaveBeenCalledWith(TASK_DETAILS[0], 101); 
  });

  it('EndTask should handle Internal server error and End Task should be False', () =>
  {
    component.taskDetails = TASK_DETAILS;
    var error = { status: 500,statusText:"500", _body :'"Internal server error"'};
    spyOn(service,'PutTask').and.returnValue(Observable.throw(error));
    component.endTask(101);     
    expect("500-Internal server error").toBe(component.results);
    expect(false).toBe(TASK_DETAILS[0].endTask);
    expect(service.PutTask).toHaveBeenCalledWith(TASK_DETAILS[0], 101); 
  });

  it('Edit method should go to Edit Route', () =>
  {
    component.edit(101);     
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/edit'], Object({ queryParams: Object({ id: 101 }) }));
  })
});
