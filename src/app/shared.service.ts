import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map'
import { TaskDetails } from './Models/taskDetails';
import  'rxjs/add/operator/map';
import 'rxjs/add/operator/do';


@Injectable()
export class SharedService {
    baseUrl: string ="http://localhost:51879/api/tasks/";     
    constructor(private http:Http)
    {

    }

    GetAllTasks():Observable<TaskDetails[]>
    {   
        return this.http.get(this.baseUrl).map(this.extractResponse);      
    }

    GetTask(Id:number):Observable<TaskDetails>
    {   
        return this.http.get(this.baseUrl+Id).map((data:Response)=><TaskDetails>data.json())     
    }

    AddTask(Item:TaskDetails):Observable<string>
    {
        return this.http.post(this.baseUrl,Item)
        .map((data:Response)=><string>data.json())
    }

    PutTask(Item:TaskDetails, Id:number):Observable<string>
    {
      return this.http.put(this.baseUrl+Id,Item)
      .map((data:Response)=><string>data.json())
    
   
    }

    private extractResponse(response: Response) {
        if (response.status < 200 || response.status >= 300) {
           throw new Error('Bad response status: ' + response.status);
        }
        let body = response.json(); // parse JSON string into JavaScript objects
    
        return body || { };
      }    
}