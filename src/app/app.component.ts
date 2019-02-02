import { Component, OnInit } from '@angular/core';

import { CommonService } from './commonservice';
import { Subject } from 'rxjs';
import { CourseDialogComponent } from './course-dialog/course-dialog.component';
import { MatDialog, MatDialogConfig } from "@angular/material";

export interface Users {
  firstName: string;
  lastName: string;
  employeeId: number;
  id: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  eventsSubject: Subject<void> = new Subject<void>();
  eventsProjectSubject: Subject<void> = new Subject<void>();
  users: Users[] = [];
  projects = [];
  parentTask = [];
  constructor(private commonservice: CommonService, private dialog: MatDialog) {
  }

  ontabChange(evt) {
    console.log(evt.index);
    switch(evt.index) {
      case 0:
        console.log('asdas asdas');
        this.eventsProjectSubject.next();
        break;
      case 1:
        console.log('asdas');
        // this.eventsProjectSubject.next();
        break;
      case 2:
        this.eventsSubject.next();
        break;
    }
  }

  openDialog(data) {
    const popup_width: any = '545px';
    this.dialog.open(CourseDialogComponent, {
      width: popup_width,
      disableClose: false,
      data: data
    });
  }

  getUsers(type) {
    // tslint:disable-next-line:max-line-length
    this.commonservice.getHttpCall({url: 'users'}).then(result => this.onCompleteGetUsers(result,type));
  }

  onCompleteGetUsers(response, type) {
    console.log(response);
    this.users = response;
    setTimeout(() => {
      const dataTosend = {
        'typeOfSearch': 'Search Manager',
        'dataToPopulate': this.users,
        'searchType': type
      }
      this.openDialog(dataTosend);
    }, 0);
  }

  getProjects(forWhichPage) {
    // tslint:disable-next-line:max-line-length
    this.commonservice.getHttpCall({url: 'projects'}).then(result => this.onCompleteGetProjects(result,forWhichPage));
  }

  onCompleteGetProjects(response, forWhichPage) {
    console.log(response);
    this.projects = response;
    setTimeout(() => {
      const dataTosend = {
        'typeOfSearch': 'Search Projects',
        'dataToPopulate': this.projects,
        'forWhichPage': forWhichPage
      }
      this.openDialog(dataTosend);
    }, 0);
  }

  getParentTask(evt) {
    const projectId = evt['projectId'];
    console.log(evt);
    this.commonservice.getHttpCall({url: `parenttasks?projectId=${projectId}`}).then(result => this.onCompleteGetParentTask(result));
  }

  onCompleteGetParentTask(response) {
    console.log(response);
    this.parentTask = response;
    setTimeout(() => {
      const dataTosend = {
        'typeOfSearch': 'Search Parent Task',
        'dataToPopulate': this.parentTask
      }
      this.openDialog(dataTosend);
    }, 0);
  }

  /**
   * apicall
  */
  apicall() {
    // tslint:disable-next-line:max-line-length
    this.commonservice.postHttpCall({url: '', data: {}, contenttype: 'application/json'}).then(result => this.onCompleteApicall(result));
  }

  onCompleteApicall(response) {
    if (response.status === 1) {

    }
  }

  ngOnInit() {

  }


}
