import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-head-menu',
  templateUrl: './head-menu.component.html',
  styleUrls: ['./head-menu.component.css']
})
export class HeadMenuComponent implements OnInit {

  RouterMenu: any[]
  constructor() {

  }

  ngOnInit(): void {
    const access: any = localStorage.getItem('AR_UserEmployeeCode')
    if (access == 'admin') {
      this.RouterMenu = [
        {
          path: '/equipment', title: 'HOME', icon: 'bi bi-house'
        },
        {
          path: '/search-equipment', title: 'SEARCH', icon: 'bi bi-search'
        },
        {
          path: '/add-equipment', title: 'NEW EQUIPMENT', icon: 'bi bi-plus-lg'
        },
        {
          path: '/manage-equipment', title: 'MANAGE EQUIPMENT', icon: 'bi bi-gear'
        },
        {
          path: '/equipment-master-manage', title: 'MASTER', icon: 'bi bi-gear-wide'
        },
      ]
    } else {
      this.RouterMenu = [
        {
          path: '/equipment', title: 'HOME', icon: 'bi bi-house'
        },
        {
          path: '/search-equipment', title: 'SEARCH', icon: 'bi bi-search'
        },

      ]
    }
  }

}
