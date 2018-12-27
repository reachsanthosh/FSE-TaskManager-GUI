import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskmgrEditComponent } from './taskmgr-edit.component';
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

describe('TaskmgrEditComponent', () => {
  let component: TaskmgrEditComponent;
  let fixture: ComponentFixture<TaskmgrEditComponent>;
  let service : SharedService; 
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  const TASK_DETAILS : any[] = [
    { "id": 101, "name": "Task 101", "startDate": Date.now,"endDate" :Date.now, "priority":10,"endTask":false, "parentId":2, "parentName":"parent" },
    { "id": 102, "name": "Task 102", "startDate": Date.now, "endDate" :Date.now, "priority":10, "endTask":true, "parentId":2, "parentName":"parent" },
    { "id": 103, "name": "Task 103", "startDate": Date.now, "endDate" :Date.now, "priority":10, "endTask":false, "parentId":2, "parentName":"parent" },
    { "id": 104, "name": "Task 104", "startDate": Date.now, "endDate" :Date.now, "priority":10, "endTask":false, "parentId":2, "parentName":"parent" }
    ];

    const TASK_DETAIL : any =  { "id": 101, "name": "Task 101", "startDate": Date.now,"endDate" :Date.now,
     "priority":10,"endTask":false, "parentId":103, "parentName":"Task 103" };

  //let params: Subject<Params>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule],
      declarations: [ TaskmgrEditComponent ],
      providers: [
        {provide: SharedService, useClass: MockSharedService},
        { provide: ActivatedRoute, useValue: { 'queryParams': Observable.from([{ 'id': 101 }]) } },
        { provide: Router, useValue: mockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskmgrEditComponent);
    component = fixture.componentInstance;
    service = TestBed.get(SharedService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should get correct id from query string', () => {
    spyOn(service,'GetAllTasks').and.returnValues(Observable.of(TASK_DETAILS));
    spyOn(service,'GetTask').and.returnValues(Observable.of(TASK_DETAIL));
    component.ngOnInit();
    expect(101).toBe(component.updateTaskId);  
  });

  it('Should have only 2 task details', () => {
    spyOn(service,'GetAllTasks').and.returnValues(Observable.of(TASK_DETAILS));
    spyOn(service,'GetTask').and.returnValues(Observable.of(TASK_DETAIL));
    component.ngOnInit();
    expect(2).toBe(component.taskDetails.length);  
  });

  it('Should retrieve correct task details', () => {
    spyOn(service,'GetAllTasks').and.returnValues(Observable.of(TASK_DETAILS));
    spyOn(service,'GetTask').and.returnValues(Observable.of(TASK_DETAIL));
    component.ngOnInit();
    expect(service.GetTask).toHaveBeenCalled();   
    expect(service.GetAllTasks).toHaveBeenCalled();   
    expect("Task 101").toBe(component.taskDetails.taskname);  
    expect(10).toBe(component.taskDetails.priority);  
    expect("Task 103").toBe(component.taskDetails.parentName);  
    expect(103).toBe(component.taskDetails.parentId);  
    expect(false).toBe(component.showError);
  });

  it('Should handle status code 400 failure', () => {
    spyOn(service,'GetAllTasks').and.returnValues(Observable.of(TASK_DETAILS));    
    var error = { status: 400, _body :'"Bad Request"'};
    spyOn(service,'GetTask').and.returnValue(Observable.throw(error));
    component.ngOnInit();
    expect("Bad Request").toBe(component.results);
    expect(true).toBe(component.showError);
    expect(service.GetTask).toHaveBeenCalled();    
    expect(service.GetAllTasks).toHaveBeenCalled();   
  });

  it('Update should return Success', () =>
  {
    var taskDetails = new TaskDetails();
    taskDetails.taskid= 101;
    component.taskDetails = taskDetails;
    spyOn(service,'PutTask').and.returnValue(Observable.of("SUCCESS"));
    component.onUpdateTask();   
    expect("SUCCESS").toBe(component.results);
    expect(service.PutTask).toHaveBeenCalledWith(taskDetails, 101);    
  });

  it('Update should handle Internal server error', () =>
  {
    var taskDetails = new TaskDetails();
    taskDetails.taskid= 101;
    component.taskDetails = taskDetails;
    var error = { status: 500, _body :'"Internal server error"'};
    spyOn(service,'PutTask').and.returnValue(Observable.throw(error));
    component.onUpdateTask();     
    expect("Internal server error").toBe(component.results);
    expect(service.PutTask).toHaveBeenCalledWith(taskDetails, 101); 
  });

  it('Update should handle Bad Request', () =>
  {
    var taskDetails = new TaskDetails();
    taskDetails.taskid= 101;
    component.taskDetails = taskDetails;
    var error = { status: 400, _body :'"Bad Request"'};
    spyOn(service,'PutTask').and.returnValue(Observable.throw(error));
    component.onUpdateTask();     
    expect("Bad Request").toBe(component.results);
    expect(service.PutTask).toHaveBeenCalledWith(taskDetails, 101); 
  });

  it('onCancel should go to view', () =>
  {
    component.onCancel();     
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/view']);
  })

  it('onclose modal should go to view', () =>
  {
    component.closeModal();     
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/view']);
  })
});
