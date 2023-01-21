import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from 'app/service/http.service';
import { routesAdmin } from 'app/sidebar/sidebar.component';

@Component({
  selector: 'app-electrical-search',
  templateUrl: './electrical-search.component.html',
  styleUrls: ['./electrical-search.component.scss']
})
export class ElectricalSearchComponent implements OnInit {
  //-----------------------------------------------------------------------------------------------------//
  //TODO var
  RouterMenu: any[]
  LoadingPage: boolean;

  @Input() model:any

  constructor(private api: HttpService) { }
  //-----------------------------------------------------------------------------------------------------//
  //TODO init
  ngOnInit(): void {
    this.routes()
  }


  //-----------------------------------------------------------------------------------------------------//
  routes() {
    const access: any = sessionStorage.getItem('UserEmployeeCode')
    if (access == 'admin') {
      this.RouterMenu = [
        {
          path: '/electricalInput', title: 'Input Database', icon: 'bi bi-search'
        },
        {
          path: '/electricalMaster', title: 'Master Electrical', icon: 'bi bi-search'
        },
      ]
    } else {
      this.RouterMenu = [
        {
          path: '/electricalInput', title: 'Input Database', icon: 'bi bi-search'
        },
        {
          path: '/electricalMaster', title: 'Master Electrical', icon: 'bi bi-search'
        },
      ]
    }
  }




}




// { path: "electricalSearch", component: ElectricalSearchComponent },
// { path: "electricalInput", component: ElectricalInputComponent },
