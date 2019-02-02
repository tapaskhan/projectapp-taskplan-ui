//
// ===== File global_constant.ts
//
import { Injectable } from '@angular/core';

@Injectable()
export class Globalconstant {


  apiUrl: any;
  logoBaseUrl: any;
  imagepath: any;
  imageUrl:any;
  frontend_url:any;

  constructor() {

    this.apiUrl = window.location.protocol+'//'+window.location.hostname+':8090/projectapp/';



    this.imageUrl   = window.location.protocol+'//'+window.location.hostname+'/angular-first-steps/assets/images/';
    this.frontend_url = window.location.protocol+'//'+window.location.hostname;
    this.logoBaseUrl = '';
    this.imagepath   = './assets/images/';

  }
}
