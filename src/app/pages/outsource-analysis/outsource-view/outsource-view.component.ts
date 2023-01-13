import { Component, OnInit } from '@angular/core';
import { HttpService } from 'app/service/http.service';

@Component({
  selector: 'app-outsource-view',
  templateUrl: './outsource-view.component.html',
  styleUrls: ['./outsource-view.component.css']
})
export class OutsourceViewComponent implements OnInit {


  // ? Session\
  Data: any
  RegisterNo: any
  nameFile: any[] = []
  urlMain: any
  RouterMenu: any[]
  constructor(private api: HttpService,) {

  }

  public UserLevel1 = sessionStorage.getItem('UserLevel1');
  public UserLevel2 = sessionStorage.getItem('UserLevel2');
  public UserLevel3 = sessionStorage.getItem('UserLevel3');
  public UserLevel4 = sessionStorage.getItem('UserLevel4');
  public UserLevel5 = sessionStorage.getItem('UserLevel5');
  public UserLevel6 = sessionStorage.getItem('UserLevel6');
  ArrUserLevel: any

  ngOnInit(): void {
    // console.log(this.Data);
    this.Data = JSON.parse(sessionStorage.getItem('dataAll'));
    this.RegisterNo = this.Data.registerNo.slice(0, 7)
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

    this.ArrUserLevel = [];
    this.ArrUserLevel.push(this.UserLevel1)
    this.ArrUserLevel.push(this.UserLevel2)
    this.ArrUserLevel.push(this.UserLevel3)
    this.ArrUserLevel.push(this.UserLevel4)
    this.ArrUserLevel.push(this.UserLevel5)
    this.ArrUserLevel.push(this.UserLevel6)

    // console.log(this.ArrUserLevel);
    this.userLv()
  }
  //  ----------------------------------------------------- //
  dataView: any
  test1: any
  //  ----------------------------------------------------- //
  userLv() {
    this.ArrUserLevel = this.ArrUserLevel.find(e => (e >= 3 || e == 0))
    // console.log(this.ArrUserLevel);
  }



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
