import { Component, OnInit } from '@angular/core';
import { HttpService } from 'app/service/http.service';

@Component({
  selector: 'app-outsource-view',
  templateUrl: './outsource-view.component.html',
  styleUrls: ['./outsource-view.component.css']
})
export class OutsourceViewComponent implements OnInit {


  // ? Session\
  Data :any
  RegisterNo :any
  nameFile: any[] = []
  urlMain: any
  RouterMenu: any[]
  constructor(private api: HttpService,) {
    this.Data = JSON.parse(sessionStorage.getItem('dataAll'));
    this.RegisterNo = this.Data.registerNo.slice(0, 7)
  }

  ngOnInit(): void {
    console.log(this.Data);

    this.nameSplitFile()
    const access: any = sessionStorage.getItem('UserEmployeeCode')
    if (access == 'admin') {
      this.RouterMenu = [
        {
          path: '/editView'
        },
        {
          path: '/searchDatabase'
        },
      ]
    } else {

      this.RouterMenu = [
        {
          path: '/editView'
        },
        {
          path: '/searchDatabase'
        },
      ]
      // console.log(this.RouterMenu[2]);
    }
  }
  //  ----------------------------------------------------- //
  dataView: any
  test1: any
  //  ----------------------------------------------------- //




  nameSplitFile() {
    if (this.Data.urlFile.length > 0) {
      for (const iterator of this.Data.urlFile) {
        let items = iterator.split("/")
        this.nameFile.push(items[items.length - 1])
      }
      this.urlMain = this.Data.urlFile[0].split("KTC")[0]
    }
  }


}
