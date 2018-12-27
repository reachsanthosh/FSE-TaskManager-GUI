import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TaskDetails } from '../Models/taskDetails';
import { SharedService } from '../shared.service';
import { Router,ActivatedRoute} from '@angular/router';

import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-taskmgr-edit',
  templateUrl: './taskmgr-edit.component.html',
  styleUrls: ['./taskmgr-edit.component.css']
})
export class TaskmgrEditComponent implements OnInit {

  @ViewChild('showmodalClick') showmodalClick:ElementRef;
  taskDetails:TaskDetails[]
  taskDetails:TaskDetails;
  updateTaskId:number
  results:string
  showError:boolean = false;
  constructor(private service:SharedService,private route: ActivatedRoute,
    private router: Router) { 
   this.taskDetails = new TaskDetails();
   this.taskDetails.priority = 0;
  }

  ngOnInit() {
 this.route.queryParams.subscribe(params => {
   this.updateTaskId = params['id'];
 })
    this.service.GetAllTasks().subscribe(
      response=>this.taskDetails=response.filter(resElement => resElement.id !=  this.updateTaskId && !resElement.endTask));

      this.service.GetTask(this.updateTaskId).subscribe(
        response => { this.taskDetails =  response;
        },
        error =>
          {
            if(error.status < 200 || error.status > 300)
            {    
              this.showError = true;     
              this.results = JSON.parse(error._body);          
            }
              console.log("error " + error.statusText);
          });
  }

  onUpdateTask()
  {
      console.log('name:' + this.taskDetails.taskname);
      console.log('priority:' + this.taskDetails.priority);      
      console.log('startdate:' + this.taskDetails.startDate);
      console.log('enddate:' + this.taskDetails.endDate);
      this.service.PutTask(this.taskDetails, this.taskDetails.taskid).subscribe(response => 
        {
          this.results = response;
          console.log("result text:" + this.results);
          this.openModal();
        },
        error =>
        {
          if(error.status < 200 || error.status > 300)
          this.results = JSON.parse(error._body);
          this.openModal();
          console.log("error " + error._body);
        }
      );
  }

  onCancel()
  {
    this.router.navigate(['/view']);
  }

  openModal() {
    this.showmodalClick.nativeElement.click();
  }
  closeModal() {
    this.router.navigate(['/view']);
  }

}
