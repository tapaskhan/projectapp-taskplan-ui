import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonService } from './../commonservice';
import { MatTableDataSource, MatSort } from '@angular/material';
import * as $ from 'jquery';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-tasks',
  templateUrl: './view-tasks.component.html',
  styleUrls: ['./view-tasks.component.scss']
})
export class ViewTasksComponent implements OnInit {

  selectedProjectName:any = null;
  selectedProject = {};
  @Output() searchProjectEventOnTask = new EventEmitter();

  displayedColumns: string[] = ['taskDesc', 'parentTaskDec', 'priority', 'startDate', 'endDate', 'status', 'actions'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private commonservice: CommonService) { }

  ngOnInit() {
    this.commonservice.listenClearTask().subscribe(() => {
      if (JSON.stringify(this.selectedProject) !== '{}') {
        this.getTasks();
      }
    });
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
    $('#mat-tab-label-0-1').trigger('click');
  }

  clearProject() {
    this.selectedProject = {};
    this.selectedProjectName = null;
    this.dataSource = null;
  }

  endTask(totalRowInfo) {
    console.log(totalRowInfo);
    Swal.fire({
      title: 'Are you sure you want to end this task?',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        const tempObj = {
          'id': totalRowInfo['id'],
          'taskDesc': totalRowInfo['taskDesc'],
          'startDate': totalRowInfo['startDate'],
          'endDate': totalRowInfo['endDate'],
          'isParentTask': totalRowInfo['isParentTask'],
          'priority': totalRowInfo['priority'],
          'status': 'COMPLETE',
          'project': totalRowInfo['project'],
          'parentTaskDetails': totalRowInfo['parentTaskDetails'],
          'user': totalRowInfo['user']
        };
        this.updateTask(tempObj);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.commonservice.openSnackBar('End task cancelled', 'Dismiss');
      }
    })

  }

  updateTask(datatoSend) {
    // tslint:disable-next-line:max-line-length
    this.commonservice.putHttpCall({url: `task/${datatoSend['id']}`, data: datatoSend}).then(result => this.onCompleteUpdateTask(result));
  }

  onCompleteUpdateTask(response) {
    this.commonservice.openSnackBar('Task Completed', 'Dismiss');
    this.getTasks();
  }

}
