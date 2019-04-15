import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { myValidator } from './../data-validator';
import * as $ from 'jquery';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from './../commonservice';
import * as _moment from 'moment';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  checkIfToDisable = true;

  @ViewChild('form') form;
  maxPriority = 30;
  minPriority = 0;
  step = 1;
  value = 0;
  thumbLabel = true;
  @Output() searchManagerEvent = new EventEmitter();
  selectedManager = {};
  minDate = new Date();
  nextDate = new Date();
  allProjectData: any;
  MyDataSource: any;
  inEditMode = false;
  private uploadSuccess: EventEmitter<boolean> = new EventEmitter();
  private eventsSubscription: any;
  selectedProjectID: any;
  @Input() events: Observable<void>;


  constructor(private formBuilder: FormBuilder, private commonservice: CommonService) {
    this.nextDate.setDate(this.minDate.getDate() + 1);
    //this.getProjects();
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
        projectName: ['', Validators.required],
        checkme: [false],
        timeValid: this.formBuilder.group({
          fromTime: [null, []],
          toTime: [null, []]
        }, {
            validator: myValidator('fromTime', 'toTime')
        }),
        priority: [0, Validators.required],
        manager: [null, Validators.required]
    });
    // this.registerForm.controls['checkme'].patchValue(true);
    // console.log(this.registerForm.controls['timeValid'].controls['fromTime']);
    // this.registerForm.controls['timeValid'].controls['fromTime'].patchValue("2019-01-21T18:30:00.000Z");
    const fromTimeControl = this.registerForm.get('timeValid').get('fromTime');
    const toTimeControl = this.registerForm.get('timeValid').get('toTime');
    fromTimeControl.disable();
    toTimeControl.disable();
    // console.log(this.registerForm.get('timeValid').get('fromTime'));
    this.registerForm.get('checkme').valueChanges.subscribe(
      // tslint:disable-next-line:indent
      (mode: string) => {
          if (mode) {
            fromTimeControl.enable();
            fromTimeControl.patchValue(new Date());
            toTimeControl.enable();
            toTimeControl.patchValue(this.nextDate);
          }
          // tslint:disable-next-line:one-line
          else {
            fromTimeControl.disable();
            fromTimeControl.patchValue(null);
            toTimeControl.disable();
            toTimeControl.patchValue(null);
          }
          fromTimeControl.updateValueAndValidity();
          toTimeControl.updateValueAndValidity();
      }
    );

    this.commonservice.listen().subscribe((m:any) => {
      this.selectedManager = m['0'];
      const managerName = `${m['0'].firstName} ${m['0'].lastName}`;
      this.registerForm.controls['manager'].patchValue(managerName);
    });
    this.eventsSubscription = this.events.subscribe(() => this.uploadSuccess.emit(true));
  }

  get f() {
    return this.registerForm.controls;
  }

  get timeValidRef() {
    return this.registerForm.controls.timeValid;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.registerForm);
    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    
    let tempObj;
    const checkme = this.registerForm.value['checkme'];
    let fromtime, toTime;
    if (checkme) {
      fromtime = _moment(this.registerForm.value['timeValid']['fromTime']).format('YYYY-MM-DD');
      toTime = _moment(this.registerForm.value['timeValid']['toTime']).format('YYYY-MM-DD');
    } else {
      fromtime = null;
      toTime = null;
    }

    tempObj = {
      'projectDesc': this.registerForm.value['projectName'],
      'startDate': fromtime,
      'endDate': toTime,
      'priority': this.registerForm.value['priority'],
      'user':
      {
        'id': this.selectedManager['id']
      }
    };
    if (!this.inEditMode) {
      this.addProject(tempObj);
    }
    else {
      this.updateProject(tempObj);
    }


  }

  /**
   * createUser
  */
  addProject(datatoSend) {
    // tslint:disable-next-line:max-line-length
    this.commonservice.postHttpCall({url: 'project', data: datatoSend}).then(result => this.onCompleteAddProject(result));
  }

  onCompleteAddProject(response) {
    this.commonservice.openSnackBar('New Project Created', 'Dismiss');
    this.uploadSuccess.emit(true);
    this.resetForm();
    // this.getUsers();
  }

  editProject(objToedit) {
    window.scrollTo(0,0);
    console.log(objToedit);
    this.inEditMode = true;
    this.selectedProjectID = objToedit['id'];
    this.registerForm.controls['projectName'].patchValue(objToedit['projectDesc']);
    this.registerForm.controls['priority'].patchValue(objToedit['priority']);
    if (objToedit['user'] != null) {
      this.selectedManager = objToedit['user'];
      this.registerForm.controls['manager'].patchValue(`${objToedit['user']['firstName']} ${objToedit['user']['lastName']}`);
    }
    if (objToedit['endDate'] || objToedit['startDate']) {
      this.registerForm.controls['checkme'].patchValue(true);
      console.log(this.registerForm.controls['timeValid']);
      this.minDate = _moment(objToedit['startDate'], 'YYYY-MM-DD').toDate();
      this.nextDate = _moment(objToedit['startDate'], 'YYYY-MM-DD').add(1,'days').toDate();
      this.registerForm.controls['timeValid']['controls']['fromTime'].patchValue(_moment(objToedit['startDate'], 'YYYY-MM-DD').toDate());
      this.registerForm.controls['timeValid']['controls']['toTime'].patchValue(_moment(objToedit['endDate'], 'YYYY-MM-DD').toDate());
    }
  }

  searchManager() {
    this.searchManagerEvent.emit('Search Manager');
  }

  updateProject(datatoSend) {
    // tslint:disable-next-line:max-line-length
    this.commonservice.putHttpCall({url: `project/${this.selectedProjectID}`, data: datatoSend}).then(result => this.onCompleteupdateProject(result));
  }

  onCompleteupdateProject(response) {
    // console.log(response);
    this.commonservice.openSnackBar('Project Updated', 'Dismiss');
    this.uploadSuccess.emit(true);
    this.resetForm();
  }

  resetForm() {
    this.submitted = false;
    this.selectedProjectID = '';
    this.form.resetForm();
    this.inEditMode = false;
    this.selectedManager = null;
    this.minDate = new Date();
    this.nextDate = new Date();
    this.nextDate.setDate(this.minDate.getDate() + 1);
  }

}
