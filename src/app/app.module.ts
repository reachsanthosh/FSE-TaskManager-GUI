import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import { AppComponent } from './app.component';
import { SharedService } from './shared.service';
import {HttpModule} from '@angular/http';
import { TaskmgrViewComponent } from './taskmgr-view/taskmgr-view.component';
import { TaskmgrAddComponent } from './taskmgr-add/taskmgr-add.component';
import { TaskmgrSearchPipe } from './taskmgr-view/taskmgr-search.pipe';
import { TaskmgrEditComponent } from './taskmgr-edit/taskmgr-edit.component';

const appRoutes:Routes=[
  {path:'',component:TaskmgrAddComponent},
  {path:'add',component:TaskmgrAddComponent},
  {path:'view',component:TaskmgrViewComponent},
  {path:'edit',component:TaskmgrEditComponent},
  {path:'**',component:TaskmgrAddComponent}
]
@NgModule({
  declarations: [
    AppComponent,
    TaskmgrViewComponent,
    TaskmgrAddComponent,
    TaskmgrSearchPipe,
    TaskmgrEditComponent        
  ],
  
  imports: [
    BrowserModule,FormsModule, HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [SharedService,TaskmgrSearchPipe],
  bootstrap: [AppComponent],
  exports:[TaskmgrSearchPipe]
})
export class AppModule { }
