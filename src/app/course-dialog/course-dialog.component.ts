import {Component, Inject, OnInit, Output, EventEmitter} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
// import { AppComponent } from "../app.component";
import { CommonService } from '../commonservice';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

    description:string;
    display_data:any = {};
    originalData = [];
    dataToPopulate = [];
    selectedUser:any;
    // tslint:disable-next-line:no-output-on-prefix

    constructor(
        public commonservice:CommonService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any ) {


    }

    ngOnInit() {
        this.display_data = this.data;
        this.dataToPopulate = this.display_data['dataToPopulate'];
        this.originalData = [...this.display_data['dataToPopulate']];
        console.log(this.originalData);
    }

    filterData(evt) {
      const textToSearch = evt.target.value.toLowerCase();
      if (this.display_data['typeOfSearch'] === 'Search Manager') {
        this.dataToPopulate = this.originalData.filter((val) => {
          if (val['firstName'].toLowerCase().includes(textToSearch) || (val['lastName'].toLowerCase().includes(textToSearch))) {
            return val;
          }
        });
      }
      else if(this.display_data['typeOfSearch'] === 'Search Projects') {
        this.dataToPopulate = this.originalData.filter((val) => {
          if (val['projectDesc'].toLowerCase().includes(textToSearch)) {
            return val;
          }
        });
      }
    }

    applyManager(typeOfSearch) {
      const selectedUser: any = this.originalData.filter((val) => {
        if (val['id'] === this.selectedUser) {
          return val;
        }
      });
      if (this.display_data['searchType'] === 'project') {
        this.commonservice.filter(selectedUser);
      }
      else {
        this.commonservice.filterSearchUserInAddTask(selectedUser);
      }
      this.close();
    }


    applyProject() {
      const selectedProject: any = this.originalData.filter((val) => {
        if (val['id'] === this.selectedUser) {
          return val;
        }
      });
      if(this.display_data['forWhichPage'] === 'projectsPage') {
        this.commonservice.filterProject(selectedProject);
      }
      else {
        this.commonservice.filterProjectForViewTasks(selectedProject);
      }
      this.close();
    }

    applyParentTask() {
      const selectedProject: any = this.originalData.filter((val) => {
        if (val['id'] === this.selectedUser) {
          return val;
        }
      });
      this.commonservice.filterSearchParentTask(selectedProject);
      this.close();
    }


    save() {
        //this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }


}
