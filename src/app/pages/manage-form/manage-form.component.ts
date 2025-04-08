import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'app/service/http.service';
var moment = require('moment')

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
  permission: any = []


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
  //TODO boat san
  remain = new FormControl('null')
  status = new FormControl('null')

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
    const result = await this.getRequest(this.SelectStatus.value, this.UserId, this.CountNum.value, this.PageNow, this.Sort.value, userLevelStr, 0, this.remain.value, this.status.value)
    const count = await this.getCount(this.SelectStatus.value, this.UserId, userLevelStr, 1, null, null);


    this.Count = count[0].count;

    this.CountPage = this.numPage(count[0].count, this.CountNum.value)
    this.DataFilter = result
    this.DataFilter = this.rep(this.DataFilter)




    // console.log(this.remain.value);
    // console.log(this.status.value);

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
      this.permission = LevelList
      if (guest == 'guest') {
        this.route.navigate(['/dashboard'])
      }

      if (
        LevelList.find(i => i == '1') ||
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

  async getCount(action: string, id: string, level: any, count: number, remain: any, status_form: any) {
    const params = {
      action: action,
      id: id,
      limit: 1,
      page: 1,
      sort: 1,
      level: level,
      count: count,
      remain: remain,
      status_form: status_form
    }
    return await this.api.RequestManage(params).toPromise()
  }

  async getRequest(action: string, id: string, limit: number, page: number, sort: number, level: any, count: number, remain: any, status_form: any) {
    const params = {
      action: action,
      id: id,
      limit: limit,
      page: page,
      sort: sort,
      level: level,
      count: count,
      remain: remain,
      status_form: status_form
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
    this.DataFilter = await this.getRequest(this.SelectStatus.value, this.UserId, this.CountNum.value, this.PageNow, this.Sort.value, userLevelStr, 0, this.remain.value, this.status.value)
    this.DataFilter = this.rep(this.DataFilter)
  }


  async back() {
    const userLevelStr = JSON.stringify(this.UserLevel)
    this.PageNow -= 1
    this.PageNow <= 1 ? this.PageNow = 1 : this.PageNow
    this.DataFilter = await this.getRequest(this.SelectStatus.value, this.UserId, this.CountNum.value, this.PageNow, this.Sort.value, userLevelStr, 0, this.remain.value, this.status.value)
    this.DataFilter = this.rep(this.DataFilter)
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



  rep(data: any) {
    data = data.map((d: any) => {
      let day = moment(d.replyDate).startOf('day').diff(moment().startOf('day'), "day")

      if (day == 0) {
        day = "Today"
      }
      if (day < 0) {
        day = "Over Due Date"
      }


      let report = d?.result?.[0]?.finishAnalyzeDate ? moment(d?.result?.[0]?.finishAnalyzeDate).startOf('day').add(7, "days").diff(moment().startOf('day'), "days") : "Under Analysis"
      if (report == 0) {
        report = "Today"
      }
      if (report < 0) {
        report = "Over Due Date"
      }


      return {
        ...d,
        remain: (
          // result.finishAnalyzeDate && result.result
          (d.status == 3 && (d.result?.[0]?.finishAnalyzeDate && d.result?.[0]?.result ) ) ||
          d.status == 4 ||
          d.status == 5 ||
          d.status == 2.1 ||
          d.status == 3.1 ||
          d.status == 4.3 ||
          d.status == 5.4 ||
          d.status == 6.4
        )
          ? "Finished" : day,
        remain_report: (
          d.status == 4 ||
          d.status == 5 ||
          d.status == 2.1 ||
          d.status == 3.1 ||
          d.status == 4.3 ||
          d.status == 5.4 ||
          d.status == 6.4
        )
          ? "Finished" : report
      }

    })


    return data
  }


  setStyle(data, type) {
    let position = this.permission.filter((d: any) => type?.includes(d));
    if (position.length != 0) {
      if (data == 2) {
        return "background-color:#F6FDC3"
      }
      if (data == 1) {
        return "background-color:#FFCF96"
      }
      if (data == "Today" || data == "Over Due Date") {
        return "background-color:#FF8080"
      }
    }

    return ""
  }

  setStyleOverDue(data, type) {
    let position = this.permission.filter((d: any) => type?.includes(d));
    if (position.length != 0) {
      if (data.remain == "Over Due Date") {
        return "background-color:#FF8080"
      }
      if (data.remain_report == "Over Due Date") {
        return "background-color:#FF8080"
      }
    }
    return ""
  }


  check_permission(type: any) {
    let data = this.permission.filter((d: any) => type?.includes(d));
    if (data.length != 0) {
      return true
    } else {
      return false
    }
  }



  //F6FDC3
  //FFCF96
  //FF8080

}


// * Permission Requester && Analysis
// * 0 : Admin
// * 1 : Requestor
// * 2 : Requestor Approve
// * c : Analysis AE window
// * 4 : Analysis ENG
// * 5 : Analysis Reviewer
// * 6 : Analysis Approve
