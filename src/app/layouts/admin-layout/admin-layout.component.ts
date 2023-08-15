import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {


  loginStatus: any;

  constructor(
    private route: Router
  ) {

  }

  ngOnInit() {
    this.loginStatus = localStorage.getItem('AR_loginStatus');
    if (localStorage.getItem('AR_loginStatus') != 'true') {
      this.route.navigate(['/login'])
      // location.href="#/login"
    }
  }

}
