import { Injectable } from '@angular/core';
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor,HttpResponse,HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { CommonService }            from './commonservice';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router:Router,public commonservice:CommonService) {}
   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      return next.handle(request).do((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          let response_body = event.body;
          this.commonservice.responsefunction(event);
          // if(response_body.status && response_body.status == 2){
          //   localStorage.clear();
          //   this.router.navigate(['/login']);
          // }
        }
      }, (err: any) => {
        console.log(err);
      });
    }

}
