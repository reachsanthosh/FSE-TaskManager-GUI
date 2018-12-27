import { Component } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent {

  constructor(private router: Router) {   
    
  }
  title = 'Task Manager';

  onNaviagteToView()
  {
    this.router.navigate(['/view']);
  }

  onNaviagteToAdd()
  {    
    this.router.navigate(['/add']);
  }
}
