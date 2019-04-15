import {Component, OnInit, ViewChild, Input, EventEmitter, Output} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import { CommonService } from './../../commonservice';
import * as $ from 'jquery';
import Swal from 'sweetalert2';

export interface AllUserdata {
  firstName: string;
  lastName: string;
  employeeId: any;
}
@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {

  displayedColumns: string[] = ['firstName', 'lastName', 'employeeId', 'actions'];
  dataSource: MatTableDataSource<AllUserdata>;

  @ViewChild(MatSort) sort: MatSort;

  @Input() projectData: any;
  @Input() uploadSuccess: EventEmitter<boolean>;
  @Output() editUserEvent = new EventEmitter<any>();

  filterBy: any = null;
  @Input() detectInEditMode: any;

  constructor(private commonservice: CommonService) { }

  ngOnInit() {
    if (this.uploadSuccess) {
      this.uploadSuccess.subscribe(data => {
        // Do something in the childComponent after parent emits the event.
        console.log('success');
        this.getAllUsers();
      });
    }
  }

  /**
   * getProjects
  */
  getAllUsers() {
  this.commonservice.getObservable({url: 'allusers'})
    .subscribe(
    res => {
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.clearFilterBy();
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

  editUser(totalRowInfo) {
    console.log(totalRowInfo);
    this.editUserEvent.emit(totalRowInfo);
  }

  deleteUser(totalRowInfo) {
    console.log(totalRowInfo);
    Swal.fire({
      title: 'Are you sure you want to delete this user?',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.commonservice.deleteHttpCall({url: `${totalRowInfo['id']}`}).then(() => this.onDeleteUser(result));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.commonservice.openSnackBar('User Deletion cancelled', 'Dismiss');
      }
    })

  }

  onDeleteUser(res) {
    this.commonservice.openSnackBar('User Deleted', 'Dismiss');
    this.getAllUsers();
    this.clearFilterBy();
  }

  clearFilterBy() {
    this.filterBy = '';
    this.applyFilter('');
  }

}
