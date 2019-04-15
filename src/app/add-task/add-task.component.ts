import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { myValidator } from './../data-validator';
import * as $ from 'jquery';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _moment from 'moment';
import { CommonService } from './../commonservice';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {

  addTaskForm: FormGroup;
  submitted = false;
  checkIfToDisable = false;
  totalData = [];
  @ViewChild('form') form;
  maxPriority = 30;
  minPriority = 0;
  step = 1;
  value = 0;
  thumbLabel = true;
  minDate = new Date();
  nextDate = new Date();
  selectedManager = {};
  selectedProject = {};
  selectedParentTask = {};
  toEditTask = {};
  inEditMode = false;

  @Output() searchManagerEventOnTask = new EventEmitter();
  @Output() searchProjectEventOnTask = new EventEmitter();
  @Output() searchParentTask = new EventEmitter();

  constructor( private formBuilder: FormBuilder, private commonservice: CommonService ) {
    this.nextDate.setDate(this.minDate.getDate() + 1);
  }

  ngOnInit() {
    this.createAddUserForm();
    this.commonservice.listenSearchUserInAddTask().subscribe((m: any) => {
      this.selectedManager = m['0'];
      const managerName = `${m['0'].firstName} ${m['0'].lastName}`;
      this.addTaskForm.controls['user'].patchValue(managerName);
    });

    this.commonservice.listenSearchProject().subscribe((m: any) => {
      this.selectedProject = m['0'];
      const projectName = `${m['0'].projectDesc}`;
      this.addTaskForm.controls['project'].patchValue(projectName);
    });

    this.commonservice.listenSearchParentTask().subscribe((m: any) => {
      console.log(this.selectedParentTask);
      this.selectedParentTask = m['0'];
      const parentTask = `${m['0'].parentTaskDec}`;
      this.addTaskForm.controls['parentTask'].patchValue(parentTask);
    });

    this.commonservice.listenEditTask().subscribe((m: any) => {
      this.resetForm();
      this.inEditMode = true;
      this.toEditTask = m;
      console.log(this.toEditTask,m);
      this.editTask();
    });
  }

  /**
   * createAddUserForm
  */
 createAddUserForm() {
    this.addTaskForm = this.formBuilder.group({
        project: [null, Validators.required],
        task: ['', Validators.required],
        checkme: [false],
        priority: [0],
        parentTask: [null],
        timeValid: this.formBuilder.group({
          fromTime: [new Date(), []],
          toTime: [this.nextDate, []]
        }, {
            validator: myValidator('fromTime', 'toTime')
        }),
        user: [null]
    });
    this.enabelDisableOnparentTaskSelection();
  }

  /**
   * enabelDisableOnparentTaskSelection
  */
  enabelDisableOnparentTaskSelection() {
    const fromTimeControl = this.addTaskForm.get('timeValid').get('fromTime');
    const toTimeControl = this.addTaskForm.get('timeValid').get('toTime');
    const parentTaskControl = this.addTaskForm.get('parentTask');
    const priorityControl = this.addTaskForm.get('priority');
    const userControl = this.addTaskForm.get('user');
    // fromTimeControl.disable();
    // toTimeControl.disable();
    // parentTaskControl.disable();
    // priorityControl.disable();
    // console.log(this.registerForm.get('timeValid').get('fromTime'));
    this.addTaskForm.get('checkme').valueChanges.subscribe(
      // tslint:disable-next-line:indent
      (mode: string) => {
          console.log(mode);
          if (!mode) {
            fromTimeControl.enable();
            toTimeControl.enable();
            fromTimeControl.patchValue(new Date());
            toTimeControl.patchValue(this.nextDate);
            parentTaskControl.enable();
            priorityControl.enable();
            userControl.enable();
            this.checkIfToDisable = false;
          }
          // tslint:disable-next-line:one-line
          else {
            fromTimeControl.disable();
            toTimeControl.disable();
            fromTimeControl.patchValue(null);
            toTimeControl.patchValue(null);
            parentTaskControl.disable();
            priorityControl.disable();
            userControl.disable();
            this.checkIfToDisable = true;
          }
          fromTimeControl.updateValueAndValidity();
          toTimeControl.updateValueAndValidity();
          parentTaskControl.updateValueAndValidity();
          priorityControl.updateValueAndValidity();
      }
    );
  }

  get f() {
    return this.addTaskForm.controls;
  }

  get timeValidRef() {
    return this.addTaskForm.controls.timeValid;
  }

  resetForm() {
    this.submitted = false;
    this.toEditTask = {};
    this.inEditMode = false;
    this.selectedParentTask = {};
    this.selectedManager = {};
    this.form.resetForm();
  }

  editTask() {
    const fromTimeControl = this.addTaskForm.get('timeValid').get('fromTime');
    const toTimeControl = this.addTaskForm.get('timeValid').get('toTime');
    console.log(this.toEditTask);
    this.selectedProject = this.toEditTask['project'];
    this.addTaskForm.controls['project'].patchValue(this.toEditTask['project']['projectDesc']);
    this.addTaskForm.controls['checkme'].patchValue(this.toEditTask['isParentTask']);
    if(this.toEditTask['isParentTask']){
      console.log(this.toEditTask['parentTaskDetails']['parentTaskDec']);
      this.addTaskForm.controls['task'].patchValue(this.toEditTask['parentTaskDetails']['parentTaskDec']);
      fromTimeControl.patchValue(null);
      toTimeControl.patchValue(null);
    }
    else {
      this.addTaskForm.controls['task'].patchValue(this.toEditTask['taskDesc']);
      this.selectedParentTask = this.toEditTask['parentTaskDetails'] || null;
      console.log(this.selectedParentTask);
      this.selectedManager = this.toEditTask['user'];
      if (this.toEditTask['parentTaskDetails']) {
        this.addTaskForm.controls['parentTask'].patchValue(this.toEditTask['parentTaskDetails']['parentTaskDec']);
      }
      this.addTaskForm.controls['priority'].patchValue(this.toEditTask['priority']);
      if (this.toEditTask['user']) {
        this.addTaskForm.controls['user'].patchValue(`${this.toEditTask['user']['firstName']} ${this.toEditTask['user']['lastName']}`);
      }
      this.minDate = _moment(this.toEditTask['startDate'], 'YYYY-MM-DD').toDate();
      // this.nextDate = _moment(this.toEditTask['startDate'], 'YYYY-MM-DD').add(1, 'days').toDate();
      // tslint:disable-next-line:max-line-length
      this.addTaskForm.controls['timeValid']['controls']['fromTime'].patchValue(_moment(this.toEditTask['startDate'], 'YYYY-MM-DD').toDate());
      this.addTaskForm.controls['timeValid']['controls']['toTime'].patchValue(_moment(this.toEditTask['endDate'], 'YYYY-MM-DD').toDate());
    }
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.addTaskForm.value);
    // stop here if form is invalid
    if (this.addTaskForm.invalid) {
        return;
    }

    const checkme = this.addTaskForm.value['checkme'];
    let fromtime, toTime, tempObj;
    if (!checkme) {
      fromtime = _moment(this.addTaskForm.value['timeValid']['fromTime']).format('YYYY-MM-DD');
      toTime = _moment(this.addTaskForm.value['timeValid']['toTime']).format('YYYY-MM-DD');
    } else {
      fromtime = null;
      toTime = null;
    }
    if (this.addTaskForm.get('checkme')['value']) {
      tempObj = {
        'taskDesc': null,
        'startDate': fromtime,
        'endDate': toTime,
        'isParentTask': this.addTaskForm.get('checkme')['value'],
        'priority': this.addTaskForm.get('priority')['value'],
        'status': 'PENDING',
        'project': this.selectedProject,
        'parentTaskDetails': {
          'parentTaskDec': this.addTaskForm.get('task')['value']
        },
      };

    }
    else {
      tempObj = {
        'taskDesc': this.addTaskForm.get('task')['value'],
        'startDate': fromtime,
        'endDate': toTime,
        'isParentTask': this.addTaskForm.get('checkme')['value'],
        'priority': this.addTaskForm.get('priority')['value'],
        'status': 'PENDING',
        'project': this.selectedProject,
        'parentTaskDetails': (JSON.stringify(this.selectedParentTask) === '{}') ? null : this.selectedParentTask,
        'user': (JSON.stringify(this.selectedManager) === '{}') ? null : this.selectedManager
      };
    }
    if (!this.inEditMode) {
      console.log(tempObj);
      this.addTask(tempObj);
    }
    else {
      if (this.addTaskForm.get('checkme')['value']) {
        tempObj['parentTaskDetails']['id'] = this.toEditTask['parentTaskDetails']['id'];
      }
      else {
        if (JSON.stringify(this.selectedParentTask) === '{}' && this.toEditTask['parentTaskDetails'] === null) {
          tempObj['parentTaskDetails'] = null;
        }
        else {
          // tslint:disable-next-line:max-line-length
          tempObj['parentTaskDetails'] = (JSON.stringify(this.selectedParentTask) === '{}') ? null : this.selectedParentTask;
        }
      }

      // tempObj = {
      //   'id': this.toEditTask['id'],
      //   'taskDesc': this.addTaskForm.get('task')['value'],
      //   'startDate': fromtime,
      //   'endDate': toTime,
      //   'isParentTask': this.addTaskForm.get('checkme')['value'],
      //   'priority': this.addTaskForm.get('priority')['value'],
      //   'status': 'PENDING',
      //   'project': this.selectedProject,
      //   'parentTaskDetails': (JSON.stringify(this.selectedParentTask) === '{}') ? null : this.selectedParentTask,
      //   'user': this.selectedManager
      // }
      this.updateTask(tempObj);
    }
  }

  addTask(datatoSend) {
    this.commonservice.postHttpCall({url: 'task', data: datatoSend}).then(result => this.onCompleteAddTask(result));
  }

  onCompleteAddTask(response) {
    this.commonservice.openSnackBar('New Task Created', 'Dismiss');
    this.resetForm();
  }

  updateTask(datatoSend) {
    // tslint:disable-next-line:max-line-length
    this.commonservice.putHttpCall({url: `task/${this.toEditTask['id']}`, data: datatoSend}).then(result => this.onCompleteUpdateTask(result));
  }

  onCompleteUpdateTask(response) {
    this.commonservice.openSnackBar('Task Updated', 'Dismiss');
    this.resetForm();
  }

  searchManager() {
    this.searchManagerEventOnTask.emit('Search Manager For Task');
  }

  searchProject() {
    this.searchProjectEventOnTask.emit('Search Project For Task');
  }

  searchTask() {
    console.log(this.selectedProject['id']);
    this.searchParentTask.emit({'event': 'Search Parent Task for Selected Project', 'projectId': this.selectedProject['id']});
  }

  clearTask() {
    this.selectedParentTask = {};
    this.addTaskForm.controls['parentTask'].patchValue(null);
  }

}
