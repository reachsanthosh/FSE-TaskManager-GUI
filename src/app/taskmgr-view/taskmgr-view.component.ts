import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TaskDetails } from '../Models/taskDetails';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-taskmgr-view',
  templateUrl: './taskmgr-view.component.html',
  styleUrls: ['./taskmgr-view.component.css']
 
})
export class TaskmgrViewComponent implements OnInit {

  @ViewChild('showmodalClick') showmodalClick:ElementRef;
   taskDetails:TaskDetails[] = [];
   public taskDetailsFiltered:TaskDetails[] = [];
   
   nameSearch :string;
   parentTaskSearch:string;
   priorityFromSearch:number ;
   priorityToSearch:number;
   startDateSearch:string;
   endDateSearch:string;
  taskDetails:TaskDetails;
  results:string;
  showError:boolean;
  
  constructor(private service:SharedService,
    private router: Router, private location:Location) { }

  ngOnInit() {

    this.service.GetAllTasks().subscribe(response =>
      {        
        (response as TaskDetails[]).forEach(element =>
           {
             let taskDetails = (response as TaskDetails[]).find(res=> res.id == element.parentId);
             if(taskDetails != undefined)
                element.parentName = taskDetails.taskname;
             else       
                element.parentName = "This Task has No Parent";
        }); 

        this.taskDetails = response;
        this.taskDetailsFiltered = response;
        this.showError = false;
    },
    error =>
      {
        if(error.status < 200 || error.status > 300)
        {    
          this.showError = true;     
          this.results = JSON.parse(error._body);          
        }
          console.log("error " + error.statusText);
      }
    );    
  }

  edit(taskId) {
    this.router.navigate(['/edit'], { queryParams: { id: taskId} });
  }

  endTask(taskId) {
   
    this.taskDetails =  this.taskDetails.find(taskElement => taskElement.id == taskId);  
    this.taskDetails.endTask = true;
    this.service.PutTask(this.taskDetails, this.taskDetails.taskid).subscribe(response => 
      {
        if(response.length > 0)
          this.results = this.taskDetails.taskname + " has been closed successfully";
        console.log("result text:" + this.results);
        this.openModal();
      },
      error =>
      {
        if(error.status < 200 || error.status > 300)
        {
          this.taskDetails.endTask = false;
          this.results = error.statusText + "-" + JSON.parse(error._body);
          this.openModal();
        }
          console.log("error " + JSON.parse(error._body));
      }
    );
  }

  openModal() {
    this.showmodalClick.nativeElement.click();
  }

  closeModal() {
   // location.reload();
  }

}
