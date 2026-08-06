import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {


  loginStatus: any;
  isMobileView = false;
  isMobileSidebarOpen = false;
  isDesktopSidebarHidden = false;

  constructor(
    private route: Router
  ) {

  }

  ngOnInit() {
    this.updateViewportState();
    this.loginStatus = localStorage.getItem('AR_loginStatus');
    if (localStorage.getItem('AR_loginStatus') != 'true') {
      this.route.navigate(['/login'])
      // location.href="#/login"
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.updateViewportState();
  }

  toggleSidebar() {
    if (this.isMobileView) {
      this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
      return;
    }

    this.isDesktopSidebarHidden = !this.isDesktopSidebarHidden;
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }

  private updateViewportState() {
    this.isMobileView = window.innerWidth < 992;
    if (!this.isMobileView) {
      this.isMobileSidebarOpen = false;
    }
  }

}
