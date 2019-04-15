import { Injectable }               from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router }                   from '@angular/router';
import { Globalconstant }           from './global_constant';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import 'rxjs/add/operator/retry';
import { MatSnackBar } from '@angular/material';
import { subscribeToPromise } from 'rxjs/internal-compatibility';
import { Subject, Observable } from 'rxjs/Rx';
import { environment } from '../environments/environment';
import * as $ from 'jquery';

@Injectable()
export class CommonService {
  requests = [];
  res = null;
  error = null;
  logoutdata: any = {};
  islogin = 0;
  public user_type: any;
  public headers: any;
  public contenttype = 'application/json';
  public sendingdata: any;
  baseUrl = environment.baseUrl;


	constructor(private http: HttpClient,
              private router: Router,
              public myGlobals: Globalconstant,
              public snackBar: MatSnackBar
            ) {

  }

  private _listners = new Subject<any>();
  private _searchProjectlistners = new Subject<any>();
  private _searchProjectForViewTasklistners = new Subject<any>();
  private _searchUserlistnersInAddTask = new Subject<any>();
  private _searchParentTask = new Subject<any>();
  private _listenerEditTask = new Subject<any>();
  private _clearTask = new Subject<any>();

  listen(): Observable<any> {
    return this._listners.asObservable();
  }
  listenSearchProject(): Observable<any> {
    return this._searchProjectlistners.asObservable();
  }
  listenSearchProjectForViewTasks(): Observable<any> {
    return this._searchProjectForViewTasklistners.asObservable();
  }
  listenSearchUserInAddTask(): Observable<any> {
    return this._searchUserlistnersInAddTask.asObservable();
  }
  listenSearchParentTask(): Observable<any> {
    return this._searchParentTask.asObservable();
  }
  listenEditTask(): Observable<any> {
    return this._listenerEditTask.asObservable();
  }
  listenClearTask(): Observable<any> {
    return this._clearTask.asObservable();
  }

  filter(filterBy: string) {
    this._listners.next(filterBy);
  }
  filterProject(filterBy: string) {
    this._searchProjectlistners.next(filterBy);
  }
  filterProjectForViewTasks(filterBy: string) {
    this._searchProjectForViewTasklistners.next(filterBy);
  }
  filterSearchUserInAddTask(filterBy: string) {
    this._searchUserlistnersInAddTask.next(filterBy);
  }
  filterSearchParentTask(filterBy: string) {
    this._searchParentTask.next(filterBy);
  }
  filterEditTask(filterBy: string) {
    this._listenerEditTask.next(filterBy);
  }
  filterClearTask(filterBy: string) {
    this._clearTask.next(filterBy);
  }

  responsefunction(res: any): void {
    try {
      const response_body = res.body;
      if (response_body.status && response_body.status === 2) {
        // this.sessionExpiredOrInvalid(response_body);
      }
    } catch (err) {}
  }

  postHttpCall(senddata: any, smallloader= false) {
    if (($('.total_loader').css('display') === 'block' || $('.total_loader').css('display') !== 'inline-block') && !smallloader) {
       $('.total_loader').show();
    }

    this.headers = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

    console.log(senddata.data);
    return this.http
      .post(this.baseUrl + senddata.url, senddata.data, {headers: this.headers})
      .toPromise()
      .then(res => {
         $('.total_loader').hide();
        return res;
      })
      .catch(this.handleError);
  }

  putHttpCall(senddata: any, smallloader= false) {
    if (($('.total_loader').css('display') === 'block' || $('.total_loader').css('display') !== 'inline-block') && !smallloader) {
      $('.total_loader').show();
    }

    this.headers = new HttpHeaders({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'});

    console.log(senddata.data);
    return this.http
      .put(this.baseUrl + senddata.url, senddata.data, {headers: this.headers})
      .toPromise()
      .then(res => {
        $('.total_loader').hide();
        return res;
      })
      .catch(this.handleError);
  }

  getHttpCall(senddata: any) {
    if (($('.total_loader').css('display') === 'block' || $('.total_loader').css('display') !== 'inline-block')) {
      $('.total_loader').show();
    }
    return this.http
    .get(this.baseUrl + senddata.url)
    .toPromise()
    .then(res => {
      $('.total_loader').hide();
      return res;
    })
    .catch(this.handleError);
  }

  deleteHttpCall(senddata: any) {
    if (($('.total_loader').css('display') === 'block' || $('.total_loader').css('display') !== 'inline-block')) {
      $('.total_loader').show();
    }
    return this.http
    .delete(this.baseUrl+'user/' + senddata.url)
    .toPromise()
    .then(res => {
      $('.total_loader').hide();
      return res;
    })
    .catch(this.handleError);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }


  handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }

  getObservable(senddata: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + senddata.url);
  }



}

