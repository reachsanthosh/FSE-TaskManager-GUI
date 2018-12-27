import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TaskDetails } from '../Models/taskDetails';
import { SharedService } from '../shared.service';
import { Router} from '@angular/router';
import 'rxjs/add/operator/catch';


@Component({
  selector: 'app-taskmgr-add',
  templateUrl: './taskmgr-add.component.html',
  styleUrls: ['./taskmgr-add.component.css']
})
export class TaskmgrAddComponent implements OnInit {

  @ViewChild('showmodalClick') showmodalClick:ElementRef;
  taskDetails:TaskDetails[]
  public taskDetails:TaskDetails;
  results:string
  constructor(private service:SharedService,private router: Router) { 
   this.taskDetails = new TaskDetails();
   this.taskDetails.priority = 0;
  }

  
  ngOnInit() {
 
    this.service.GetAllTasks().subscribe(
      p=>this.taskDetails=p.filter(res => !res.endTask));
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
          this.openModal();
        },
        error =>
        {
          console.log(error.status);
          console.log(error.statusText);
          console.log(error._body);
          console.log(JSON.parse(error._body));
          if(error.status < 200 || error.status > 300)
            this.results = JSON.parse(error._body);
            this.openModal();
        }
      );
    }

    onResetTask()
    {
      this.taskDetails = new TaskDetails();
      this.taskDetails.priority = 0;
    }

    openModal() {
      this.showmodalClick.nativeElement.click();
    }
    closeModal() {
      this.router.navigate(['/view']);
    }

}
