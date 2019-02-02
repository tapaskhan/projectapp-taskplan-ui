import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonService } from './../commonservice';
import { MatTableDataSource, MatSort } from '@angular/material';
import * as $ from 'jquery';

@Component({
  selector: 'app-view-tasks',
  templateUrl: './view-tasks.component.html',
  styleUrls: ['./view-tasks.component.scss']
})
export class ViewTasksComponent implements OnInit {

  selectedProjectName:any;
  selectedProject = {};
  @Output() searchProjectEventOnTask = new EventEmitter();

  displayedColumns: string[] = ['taskDesc', 'parentTaskDec', 'priority', 'startDate', 'endDate', 'actions'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private commonservice: CommonService) { }

  ngOnInit() {
    this.commonservice.listenSearchProjectForViewTasks().subscribe((m: any) => {
      this.selectedProject = m['0'];
      const projectName = `${m['0'].projectDesc}`;
      this.selectedProjectName = projectName;
      this.getTasks();
    });
  }

  /**
   * getProjects
  */
  getTasks() {
    this.commonservice.getObservable({url: `tasks?projectId=${this.selectedProject['id']}`})
      .subscribe(
      res => {
        console.log(res);
        this.dataSource = new MatTableDataSource();
        this.dataSource.data = res;
        this.dataSource.sort = this.sort;
        $('.total_loader').hide();
      },
      error => {
        console.log('There was an error while retrieving Photos !!!' + error);
      });
  }

  searchProject() {
    this.searchProjectEventOnTask.emit('Search Project For Task');
  }

  editProject(totalRowInfo) {
    console.log(totalRowInfo);
    this.commonservice.filterEditTask(totalRowInfo);
  }

}
