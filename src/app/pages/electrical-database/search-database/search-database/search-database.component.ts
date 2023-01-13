import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-database',
  templateUrl: './search-database.component.html',
  styleUrls: ['./search-database.component.css']
})
export class ElectricalSearchComponent implements OnInit {


  RouterMenu: any[] = []
  constructor() { }

  ngOnInit(): void {
    this.route()
  }



  route() {
    const access: any = sessionStorage.getItem('UserEmployeeCode')
    if (access == 'admin') {
      this.RouterMenu = [
        {
          path: '/electricalSearch', title: 'SEARCH DATABASE', icon: 'bi bi-house'
        },
        {
          path: '/electricalInput', title: 'Input Database', icon: 'bi bi-search'
        },
      ]
    } else {
      this.RouterMenu = [
        {
          path: '/electricalSearch', title: 'SEARCH DATABASE', icon: 'bi bi-house'
        },
        {
          path: '/electricalInput', title: 'Input Database', icon: 'bi bi-search'
        },

      ]
    }
  }


}
