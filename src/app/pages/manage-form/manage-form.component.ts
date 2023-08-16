import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'app/service/http.service';


@Component({
  selector: 'app-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrls: ['./manage-form.component.css'],
  // template:'<app-progress-form1 [a]="SS"></app-progress-form1>'
})

export class ManageFormComponent implements OnInit {
  constructor(
    private api: HttpService,
    private route: Router
  ) { }

  // ?
  LoadingPage: boolean;

  // ? api
  FormListAll = [];
  tempList = [];
  FormList = [];



  // ? form control
  SelectStatus = new FormControl('inProcess');

  // ?
  UserLevel = [];
  UserId = localStorage.getItem('AR_UserId')

  // ? data table
  DataFilter = [];
  CountNum = new FormControl(10, Validators.required)
  PageNow = 1;
  CountPage: any;
  CountList = [10, 20, 50, 100]
  Count: Number = 1
  Sort = new FormControl(-1)

  // ? search
  KeySearch: any

  async ngOnInit(): Promise<void> {
    this.pageLoadStart();
    await this.CheckStatusUser()
    await this.SetUserStatus();
    // this.GetRequest();
    // this.OnSelectStatus();

    this.get()
  }

  async get() {
    this.PageNow = 1;
    const userLevelStr = JSON.stringify(this.UserLevel)
    const result = await this.getRequest(this.SelectStatus.value, this.UserId, this.CountNum.value, this.PageNow, this.Sort.value, userLevelStr, 0)
    const count = await this.getCount(this.SelectStatus.value, this.UserId, userLevelStr, 1);
    this.Count = count[0].count;
    this.CountPage = this.numPage(count[0].count, this.CountNum.value)
    this.DataFilter = result
  }

  SetUserStatus() {
    return new Promise(resolve => {
      // ?  filter เลเวล ถ้าเป็นnull ให้ตัดออก
      for (let index = 0; index < 5; index++) {
        let str1 = "UserLevel" + (index + 1);
        let temp1 = sessionStorage.getItem(str1);
        if (temp1 != "null") {
          this.UserLevel[index] = sessionStorage.getItem(str1);
        }
        if (index + 1 === 5) {
          resolve(true)
        }
      }

    })
    // this.OnSelectStatus();
  }

  CheckStatusUser() {
    return new Promise(resolve => {

      let LevelList = [];
      localStorage.getItem('AR_UserLevel1') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel1')) : false
      localStorage.getItem('AR_UserLevel2') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel2')) : false
      localStorage.getItem('AR_UserLevel3') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel3')) : false
      localStorage.getItem('AR_UserLevel4') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel4')) : false
      localStorage.getItem('AR_UserLevel5') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel5')) : false
      localStorage.getItem('AR_UserLevel6') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel6')) : false
      const guest = localStorage.getItem('AR_UserEmployeeCode')

      if (guest == 'guest') {
        this.route.navigate(['/dashboard'])
      }

      if (LevelList.find(i => i == '1') ||
        LevelList.find(i => i == '2') ||
        LevelList.find(i => i == '3') ||
        LevelList.find(i => i == '4') ||
        LevelList.find(i => i == '5') ||
        LevelList.find(i => i == '6') ||
        LevelList.find(i => i == '0')
      ) {
      } else {
        // alert("No access!!");
        location.href = "#/login"
      }
      resolve(true)
    })
  }

  async getCount(action: string, id: string, level: any, count: number) {
    const params = {
      action: action,
      id: id,
      limit: 1,
      page: 1,
      sort: 1,
      level: level,
      count: count
    }
    return await this.api.RequestManage(params).toPromise()
  }

  async getRequest(action: string, id: string, limit: number, page: number, sort: number, level: any, count: number) {
    const params = {
      action: action,
      id: id,
      limit: limit,
      page: page,
      sort: sort,
      level: level,
      count: count
    }
    return await this.api.RequestManage(params).toPromise()
  }



  async OnSelectStatus() {
    this.get()
  }

  OnClickForm(item: any) {

    const Reject1 = [2.1, 3.1, 4.3, 5.4, 6.4]
    // const Reject2 = 3.1
    const Inprocess = [1, 2, 3, 4, 5]
    const View1 = [1, 2, 2.1]
    const View2 = [3, 4, 5, 6, 3.1, 4.3, 5.4, 6.4]
    let StatusForm = item.status;
    localStorage.setItem('AR_FormId', item._id)
    if (this.UserId == item.userApprove) {
      let temp1 = Inprocess.find(ar => ar == StatusForm);
      if (temp1) {
        // this.route.navigate(["/progressForm" + StatusForm])
        // location.href = "#/progressForm" + StatusForm
        const url = `#/progressForm${StatusForm}?formId=${item._id}`
        window.open(url, '_blank');
      } else if (StatusForm == Reject1[0] || StatusForm == Reject1[1]) {
        // this.route.navigate(["/rejectForm1"])
        const url = `#/rejectForm1?formId=${item._id}`
        window.open(url, '_blank');
        // location.href = "#/rejectForm1";
      } else if (StatusForm == Reject1[2]) {
        const url = `#/rejectForm2?formId=${item._id}`
        window.open(url, '_blank');
        // this.route.navigate(["/rejectForm2"])
        // location.href = "#/rejectForm2";
      } else if (StatusForm == Reject1[3]) {
        const url = `#/rejectForm3?formId=${item._id}`
        window.open(url, '_blank');
        // this.route.navigate(["/rejectForm3"])
        // location.href = "#/rejectForm3";
      } else if (StatusForm == Reject1[4]) {
        const url = `#/rejectForm3?formId=${item._id}`
        window.open(url, '_blank');
        // this.route.navigate(["/rejectForm3"])
        // location.href = "#/rejectForm3";
      }

    } else {
      const result1 = View1.find(arr => arr == StatusForm)
      const result2 = View2.find(arr => arr == StatusForm)
      let formView: string = "0"
      if (result1) {
        formView = '1'
        // sessionStorage.setItem('FormView', '1');
      } else if (result2) {
        formView = '2'
        // sessionStorage.setItem('FormView', '2');
      }
      const url = `#/viewForm?formId=${item._id}&formView=${formView}`
      window.open(url, '_blank');
      // this.route.navigate(['/viewForm'], {
      //   queryParams: {
      //     a: '1',
      //     b: '2'
      //   }
      // })
      // alert()
      // this.route.navigate(['/viewForm'])
      // location.href = "#/viewForm";
    }




  }

  // ? Search filter
  onSearchChange(event: any) {
    let query = event.target.value
  }


  // ? Data table Fn'
  numPage(count: any, value: number) {
    if (value == 0) return 1
    return Math.ceil(Number(count) / value)
  }


  async next() {
    const userLevelStr = JSON.stringify(this.UserLevel)
    this.PageNow += 1
    this.PageNow > this.CountPage ? this.PageNow = this.CountPage : this.PageNow
    this.DataFilter = await this.getRequest(this.SelectStatus.value, this.UserId, this.CountNum.value, this.PageNow, this.Sort.value, userLevelStr, 0)
  }


  async back() {
    const userLevelStr = JSON.stringify(this.UserLevel)
    this.PageNow -= 1
    this.PageNow <= 1 ? this.PageNow = 1 : this.PageNow
    this.DataFilter = await this.getRequest(this.SelectStatus.value, this.UserId, this.CountNum.value, this.PageNow, this.Sort.value, userLevelStr, 0)

  }
  onSelectCountNum() {
    this.get()
  }
  onSelectSort() {
    this.get()
  }


  pageLoadStart() {
    this.LoadingPage = true;
  }
  pageLoadEnd() {
    setTimeout(() => {
      this.LoadingPage = false;

    }, 500);
  }

  // ? html function
  htmlEng(item: any) {
    if (item && item.result.length > 0) {
      const result = item.result[0]
      if (result.finishAnalyzeDate && result.result) return 'Making Report'
    }
    return 'Under Analysis'
  }
  cssEng(item: any) {
    if (item && item.result.length > 0) {
      const result = item.result[0]
      if (result.finishAnalyzeDate && result.result) return 'text-blue'
    }
    return 'text-black'
  }

}
