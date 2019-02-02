import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import * as $ from 'jquery';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from './../commonservice';
import { Observable } from 'rxjs';

export interface Users {
  firstName: string;
  lastName: string;
  employeeId: number;
  id: number;
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {

  addUserForm: FormGroup;
  submitted = false;
  totalData = [];
  @ViewChild('form') form;
  private eventsSubscription: any;
  @Input() events: Observable<void>;
  users: Users[] = [];
  sortedData: Users[];
  inEditMode = false;
  selectedUserId: any = null;

  constructor(private commonservice: CommonService, private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.createAddUserForm();
    this.eventsSubscription = this.events.subscribe(() => this.getUsers());
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  /**
   * createAddUserForm
  */
  createAddUserForm() {
    this.addUserForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        empid: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }

  resetForm() {
    this.submitted = false;
    this.form.resetForm();
    this.inEditMode = false;
    this.selectedUserId = null;
  }

  /**
   * formRef getter method
  */
  get formRef() {
    return this.addUserForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addUserForm.invalid) {
        return;
    }

    let tempData = {
      'firstName': this.addUserForm.value.firstName,
      'lastName': this.addUserForm.value.lastName,
      'employeeId': this.addUserForm.value.empid
    };
    if (!this.inEditMode) {
      this.createUser(tempData);
    } else {
      tempData['id'] = this.selectedUserId;
      this.updateUser(tempData);
    }
    this.resetForm();
  }

  updateUser(datatoSend) {
    // tslint:disable-next-line:max-line-length
    this.commonservice.putHttpCall({url: `user/${this.selectedUserId}`, data: datatoSend}).then(result => this.onCompleteupdateUser(result));
  }

  onCompleteupdateUser(response) {
    // console.log(response);
    this.commonservice.openSnackBar('User Updated', 'Dismiss');
    this.getUsers();
  }

  /**
   * createUser
  */
  createUser(datatoSend) {
    // tslint:disable-next-line:max-line-length
    this.commonservice.postHttpCall({url: 'user', data: datatoSend}).then(result => this.onCompleteCreateUser(result));
  }

  onCompleteCreateUser(response) {
    this.commonservice.openSnackBar('New User Created', 'Dismiss');
    this.getUsers();
  }

  /**
   * createUser
  */
  getUsers() {
    // tslint:disable-next-line:max-line-length
    this.commonservice.getHttpCall({url: 'users'}).then(result => this.onCompleteGetUsers(result));
  }

  onCompleteGetUsers(response) {
    console.log(response);
    this.users = response;
    setTimeout(() => {
      this.sortedData = this.users.slice();
    }, 0);
  }

  editUser(index) {
    window.scrollTo(0, 0);
    this.inEditMode = true;
    this.selectedUserId = this.sortedData[index]['id'];
    const firstName = this.sortedData[index]['firstName'];
    const lastName = this.sortedData[index]['lastName'];
    const employeeId = this.sortedData[index]['employeeId'];
    this.addUserForm.controls['firstName'].patchValue(firstName);
    this.addUserForm.controls['lastName'].patchValue(lastName);
    this.addUserForm.controls['empid'].patchValue(employeeId);
  }

  sortData(sort: any) {
    const data = this.users.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'firstName': return compare(a['firstName'], b['firstName'], isAsc);
        case 'lastName': return compare(a['lastName'], b['lastName'], isAsc);
        case 'employeeId': return compare(a['employeeId'], b['employeeId'], isAsc);
        default: return 0;
      }
    });
  }



}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
