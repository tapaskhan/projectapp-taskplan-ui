import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonService } from './commonservice';
import { Globalconstant } from './global_constant';
import { TokenInterceptor } from './token.interceptor';
import { AddUserComponent } from './add-user/add-user.component';
import { ViewUserComponent } from './add-user/view-user/view-user.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { ViewProjectsComponent } from './add-project/view-projects/view-projects.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { ViewTasksComponent } from './view-tasks/view-tasks.component';
import { CourseDialogComponent } from './course-dialog/course-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AddUserComponent,
    ViewUserComponent,
    AddProjectComponent,
    ViewProjectsComponent,
    AddTaskComponent,
    ViewTasksComponent,
    CourseDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [CommonService, Globalconstant, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  entryComponents: [CourseDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
