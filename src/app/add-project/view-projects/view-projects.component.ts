import {Component, OnInit, ViewChild, Input, EventEmitter, Output} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { CommonService } from './../../commonservice';
import * as $ from 'jquery';

export interface AllProjectdata {
  name: string;
  tasks: Number;
  tasksCompleted: Number;
  startDate: string;
  endDate: string;
  priority: Number;
}

@Component({
  selector: 'app-view-projects',
  templateUrl: './view-projects.component.html',
  styleUrls: ['./view-projects.component.scss']
})
export class ViewProjectsComponent implements OnInit {

  displayedColumns: string[] = ['projectDesc', 'taskCount', 'taskCompleted', 'startDate', 'endDate', 'priority', 'actions'];
  dataSource: MatTableDataSource<AllProjectdata>;

  @ViewChild(MatSort) sort: MatSort;

  @Input() projectData: any;
  @Input() uploadSuccess: EventEmitter<boolean>;
  @Output() editProjectEvent = new EventEmitter<any>();

  constructor(private commonservice: CommonService) {
    this.getProjects();
  }

  ngOnInit() {
    if (this.uploadSuccess) {
      this.uploadSuccess.subscribe(data => {
        // Do something in the childComponent after parent emits the event.
        console.log('success');
        this.getProjects();
      });
    }
  }

  /**
   * getProjects
  */
 getProjects() {
  this.commonservice.getObservable({url: 'allprojects'})
    .subscribe(
    res => {
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      $('.total_loader').hide();
    },
    error => {
      console.log('There was an error while retrieving Photos !!!' + error);
    });
 }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  editProject(totalRowInfo) {
    console.log(totalRowInfo);
    this.editProjectEvent.emit(totalRowInfo);
  }

  suspendProject(totalRowInfo) {
    const tempActiveStatus = !totalRowInfo['inactive'];
    // tslint:disable-next-line:max-line-length
    this.commonservice.putHttpCall({'data': {'inactive': tempActiveStatus}, 'url': `project/${totalRowInfo['id']}/status`}).then((response) => this.onSuspendProject(tempActiveStatus));
  }

  onSuspendProject(activeStatus) {
    let statusmsg: any;
    if (activeStatus) {
      statusmsg = 'Project Suspended';
    }
    else {
      statusmsg = 'Project Active';
    }
    this.commonservice.openSnackBar(`${statusmsg}`, 'Dismiss');
    this.getProjects();
  }

}
