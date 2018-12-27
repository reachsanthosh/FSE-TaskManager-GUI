import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TaskDetails } from '../Models/taskDetails';
import { SharedService } from '../shared.service';

import 'rxjs/add/operator/catch';


@Component({
  selector: 'app-taskmgr-crud',
  templateUrl: './taskmgr-crud.component.html',
  styleUrls: ['./taskmgr-crud.component.css'  
  ]
})
export class TaskMgrCrudComponent implements OnInit
{
  @ViewChild('showmodalClick') showmodalClick:ElementRef;
  taskDetails:TaskDetails[]
  public taskDetails:TaskDetails;
  results:string
  constructor(private service:SharedService) { 
   this.taskDetails = new TaskDetails();
   this.taskDetails.priority = 0;
  }

  
  ngOnInit() {
  
    this.service.GetAllTasks().subscribe(
      p=>this.taskDetails=p);
    }

    onAddTask()
    {
      console.log('name:' + this.taskDetails.taskname);
      console.log('priority:' + this.taskDetails.priority);      
      console.log('startdate:' + this.taskDetails.startDate);
      console.log('enddate:' + this.taskDetails.endDate);
      this.service.AddTask(this.taskDetails).subscribe(response => 
        {
          this.results = response;
          console.log("result text:" + this.results);
          this.openModel();
        },
        error =>
        {
          console.log("error " + error._body);
        }
      );
    }

    onResetTask()
    {
      this.taskDetails = new TaskDetails();
      this.taskDetails.priority = 0;
    }

    openModel() {
      this.showmodalClick.nativeElement.click();
    }
    closeModel() {
       //this.myModal.nativeElement.className = 'modal hide';
    }
}


