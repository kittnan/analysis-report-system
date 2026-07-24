import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'app/service/http.service';
import Swal from 'sweetalert2';
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

  holidays: any = []

  async ngOnInit(): Promise<void> {
    this.pageLoadStart();
    await this.CheckStatusUser()
    await this.SetUserStatus();
    // this.GetRequest();
    // this.OnSelectStatus();
    this.get()
  }

  async get() {
    try {
      Swal.fire({
        title: 'Loading...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(null)
        }
      })
      this.PageNow = 1;
      const userLevelStr = JSON.stringify(this.UserLevel)
      const result = await this.getRequest(this.SelectStatus.value, this.UserId, this.CountNum.value, this.PageNow, this.Sort.value, userLevelStr, 0, this.remain.value, this.status.value)
      const count = await this.getCount(this.SelectStatus.value, this.UserId, userLevelStr, 1, null, null);


      this.Count = count[0].count;

      this.CountPage = this.numPage(count[0].count, this.CountNum.value)
      this.holidays = await this.getHoliday()

      this.DataFilter = this.mappingDataTable(result)

      setTimeout(() => {
        Swal.close()
      }, 300);

    } catch (error) {
      setTimeout(() => {
        Swal.close()
      }, 300);
    }


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

    console.log(`⚡ ~ :189 ~ ManageFormComponent ~ item:`, item);
    let isFM = item.requestItem && item.requestItem.includes('_FM')
    if (!isFM) {
      this.handlePageChange(item)
    } else {
      this.handlePageChangeIsFM(item)
    }


  }

  handlePageChange(item: any) {
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
  handlePageChangeIsFM(item: any) {
    const Reject1 = [2.1, 3.1, 4.3, 5.4, 6.4]
    // const Reject2 = 3.1
    const Inprocess = [1, 2, 3, 4, 5]
    const View1 = [1, 2, 2.1]
    const View2 = [3, 4, 5, 6, 3.1, 4.3, 5.4, 6.4]
    let StatusForm = item.status;
    localStorage.setItem('AR_FormId', item._id)
    if (this.UserId == item.userApprove) {

      if (StatusForm <= 2) {
        const url = `#/progressForm${StatusForm}?formId=${item._id}`
        window.open(url, '_blank');
      } else {
        let temp1 = Inprocess.find(ar => ar == StatusForm);
        if (temp1) {
          // this.route.navigate(["/progressForm" + StatusForm])
          // location.href = "#/progressForm" + StatusForm
          const url = `#/progressForm${StatusForm}-fm?formId=${item._id}`
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
          const url = `#/rejectForm3-fm?formId=${item._id}`
          window.open(url, '_blank');
          // this.route.navigate(["/rejectForm3"])
          // location.href = "#/rejectForm3";
        } else if (StatusForm == Reject1[4]) {
          const url = `#/rejectForm3-fm?formId=${item._id}`
          window.open(url, '_blank');
          // this.route.navigate(["/rejectForm3"])
          // location.href = "#/rejectForm3";
        }
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
    Swal.fire({
      title: 'Loading...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null)
      }
    })
    const userLevelStr = JSON.stringify(this.UserLevel)
    this.PageNow += 1
    this.PageNow > this.CountPage ? this.PageNow = this.CountPage : this.PageNow
    this.DataFilter = await this.getRequest(this.SelectStatus.value, this.UserId, this.CountNum.value, this.PageNow, this.Sort.value, userLevelStr, 0, this.remain.value, this.status.value)
    this.DataFilter = this.mappingDataTable(this.DataFilter)
    setTimeout(() => {
      Swal.close()
    }, 300);
  }


  async back() {
    Swal.fire({
      title: 'Loading...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null)
      }
    })
    const userLevelStr = JSON.stringify(this.UserLevel)
    this.PageNow -= 1
    this.PageNow <= 1 ? this.PageNow = 1 : this.PageNow
    this.DataFilter = await this.getRequest(this.SelectStatus.value, this.UserId, this.CountNum.value, this.PageNow, this.Sort.value, userLevelStr, 0, this.remain.value, this.status.value)
    this.DataFilter = this.mappingDataTable(this.DataFilter)
    setTimeout(() => {
      Swal.close()
    }, 300);
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
  htmlEng(item: any): string {
    const result = item?.result?.[0];

    if (!this.isAnalysisFinished(result)) {
      return 'Under Analysis';
    }

    return this.hasResultAnalyze(result, item)
      ? this.hasNeedReport(item) == 'Need Report' ? 'Making Report' : 'Wait Submit Result'
      : 'Under Analysis';
  }
  private hasNeedReport(item: any): string {
    const needReport = item?.needReport ?? 'Need Report';
    return needReport; // 'Need Report' or 'Only Analysis'
  }

  private isAnalysisFinished(result: any): boolean {
    return !!result?.finishAnalyzeDate;
  }

  private hasResultAnalyze(result: any, item: any): boolean {
    return this.isFM(item)
      ? this.hasFMReport(result)
      : this.hasNormalReport(result);
  }

  private isFM(item: any): boolean {
    return item?.requestItem?.includes('_FM');
  }

  private hasFMReport(result: any): boolean {
    return !!result?.result2?.length;
  }

  private hasNormalReport(result: any): boolean {
    return !!result?.result;
  }

  cssEng(item: any) {

    if (item && item.result.length > 0) {
      const result = item.result[0]
      if (item.requestItem && item.requestItem.includes('_FM')) {
        if (result.finishAnalyzeDate && result.result2 && result.result2.length > 0) return 'text-blue'
      } else
        if (result.finishAnalyzeDate && result.result) return 'text-blue'
    }
    return 'text-black'
  }

  async getHoliday() {
    return await this.api.getWorkingDay({}).toPromise()
  }

  findRemainDay(workingDayCount: any, startDate: any) {
    if (!startDate) return null
    // Calculate working days
    const start = moment(startDate).startOf('day').add(1, 'day') // เริ่มนับจากวันถัดไป
    const workingDays = parseInt(workingDayCount) || 0;
    let currentDate = start.clone();
    let workingDaysFound = 0;
    while (workingDaysFound < workingDays) {
      const dayOfWeek = currentDate.day(); // Sunday=0, Monday=1, ..., Saturday=6
      const dateStr = currentDate.format('YYYY-MM-DD');
      const isHoliday = this.holidays?.holidays ? this.holidays.holidays.some((a: any) => a == dateStr) : false;
      if (dayOfWeek >= 1 && dayOfWeek <= 5 && !isHoliday) {
        workingDaysFound++;
        if (workingDaysFound === workingDays) {
          break;
        }
      }
      currentDate.add(1, 'day');
    }
    return currentDate.diff(moment().startOf('day'), 'days') + 1
  }

  calWorkingDay(workingDayCount: any, startDate: any) {

    if (!startDate) return null
    // Calculate working days
    const start = moment(startDate)
    const workingDays = parseInt(workingDayCount) || 0;
    let currentDate = start.clone();
    let workingDaysFound = 0;

    while (workingDaysFound < workingDays) {
      // Check if current date is a working day (Monday=1 to Friday=5, not a holiday)
      const dayOfWeek = currentDate.day(); // Sunday=0, Monday=1, ..., Saturday=6
      const dateStr = currentDate.format('YYYY-MM-DD');

      const isHoliday = this.holidays?.holidays ? this.holidays.holidays.some((a: any) => a == dateStr) : false;

      if (dayOfWeek >= 1 && dayOfWeek <= 5 && !isHoliday) {
        workingDaysFound++;
        if (workingDaysFound === workingDays) {
          break;
        }
      }
      currentDate.add(1, 'day');
    }
    return currentDate.diff(start, 'days')
  }

  // rep(data: any) {
  //   data = data.map((d: any) => {

  //     let result = d.result?.[0] || {}
  //     let day = moment(d.replyDate).startOf('day').diff(moment().startOf('day'), "day")

  //     if (day == 0) {
  //       day = "Today"
  //     }
  //     if (day < 0) {
  //       day = "Over Due Date"
  //     }

  //     // if(result){
  //     //   console.log('@');

  //     //   const totalDaysSpanned = this.calWorkingDay(5, result?.finishAnalyzeDate)
  //     // }

  //     let report = result?.finishAnalyzeDate ? moment(result?.finishAnalyzeDate).startOf('day').add(5, "days").diff(moment().startOf('day'), "days") : "Under Analysis"
  //     if (report == 0) {
  //       report = "Today"
  //     }
  //     if (report < 0) {
  //       report = "Over Due Date"
  //     }


  //     return {
  //       ...d,
  //       remain: (
  //         // result.finishAnalyzeDate && result.result
  //         (d.status == 3 && (result?.finishAnalyzeDate && result?.result)) ||
  //         (d.status == 3 && (result?.finishAnalyzeDate && result?.result2 && result?.result2.length > 0)) ||
  //         d.status == 4 ||
  //         d.status == 5 ||
  //         d.status == 2.1 ||
  //         d.status == 3.1 ||
  //         d.status == 4.3 ||
  //         d.status == 5.4 ||
  //         d.status == 6.4
  //       )
  //         ? "Finished" : day,


  //       remain_report: (
  //         d.status == 4 ||
  //         d.status == 5 ||
  //         d.status == 2.1 ||
  //         d.status == 3.1 ||
  //         d.status == 4.3 ||
  //         d.status == 5.4 ||
  //         d.status == 6.4
  //       )
  //         ? "Finished" : report
  //     }

  //   })





  //   return data
  // }

  mappingDataTable(data: any) {
    return data.map((d: any) => {
      let result = d.result?.[0] || {}
      let day = moment(d.replyDate).startOf('day').diff(moment().startOf('day'), "day")

      if (day == 0) {
        day = "Today"
      }
      if (day < 0) {
        day = "Over Due Date"
      }


      let totalDaysSpanned = this.findRemainDay(4, result?.finishAnalyzeDate)
      // console.log(result?.finishAnalyzeDate, totalDaysSpanned);
      d.totalDaysSpanned = totalDaysSpanned

      let report = result?.finishAnalyzeDate && totalDaysSpanned !== null
        ? moment().startOf('day').add(totalDaysSpanned, "days").diff(moment().startOf('day'), "days")
        : "Under Analysis"
      if (report == 1) {
        report = "Today"
      }
      if (report <= 0) {
        report = "Over Due Date"
      }

      const remainStatus = (
        (d.status == 3 && (result?.finishAnalyzeDate && result?.result)) ||
        (d.status == 3 && (result?.finishAnalyzeDate && result?.result2 && result?.result2.length > 0)) ||
        d.status == 4 ||
        d.status == 5 ||
        d.status == 2.1 ||
        d.status == 3.1 ||
        d.status == 4.3 ||
        d.status == 5.4 ||
        d.status == 6.4
      )
        ? "Finished" : day

      let remain_report = (
        d.status == 4 ||
        d.status == 5 ||
        d.status == 2.1 ||
        d.status == 3.1 ||
        d.status == 4.3 ||
        d.status == 5.4 ||
        d.status == 6.4
      )
        ? "Finished" : report

      if (d.needReport && d.needReport == 'Only Analysis') {
        remain_report = '-'
      }


      return {
        ...d,
        remain: remainStatus,
        remain_report: remain_report
      }
    })
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
    // let position = this.permission.filter((d: any) => type?.includes(d));
    // if (position.length != 0) {
    //   if (data.remain == "Over Due Date") {
    //     return "background-color:#FF8080"
    //   }
    //   if (data.remain_report == "Over Due Date") {
    //     return "background-color:#FF8080"
    //   }
    // }
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


  htmlStatusClass(data: any): string {
    if (data.status == 1) {
      return 'green-status'
    }
    if (data.status == 2) {
      return 'green-status'
    }
    if (data.status == 3) {
      return this.cssEng(data)
    }
    if (data.status == 4) {
      return 'green-status'
    }
    if (data.status == 5) {
      return 'green-status'
    }
    if (data.status == 6) {
      return 'primary-status'
    }
    if (data.status == 2.1) {
      return 'red-status'
    }
    if (data.status == 3.1) {
      return 'red-status'
    }
    if (data.status == 4.3) {
      return 'red-status'
    }
    if (data.status == 5.4) {
      return 'red-status'
    }
    if (data.status == 6.4) {
      return 'red-status'
    }
    if (data.status == 0) {
      return 'red-status'
    }
    return ''
  }
  htmlStatus(data: any): string {
    if (data.status == 1) {
      return 'Wait Approve Request'
    }
    if (data.status == 2) {
      return 'Analysis'
    }
    if (data.status == 3) {
      return this.htmlEng(data)
    }
    if (data.status == 4) {
      if (data.needReport && data.needReport == 'Only Analysis') {
        return 'Wait Review Result'
      }
      return 'Wait Review Report'
    }
    if (data.status == 5) {
      if (data.needReport && data.needReport == 'Only Analysis') {
        return 'Wait Approve Result'
      }
      return 'Wait Approve Report'
    }
    if (data.status == 6) {
      return 'Finished'
    }
    if (data.status == 2.1) {
      return 'Reject'
    }
    if (data.status == 3.1) {
      return 'Reject'
    }
    if (data.status == 4.3) {
      return 'Reject'
    }
    if (data.status == 5.4) {
      return 'Reject'
    }
    if (data.status == 6.4) {
      return 'Reject'
    }
    if (data.status == 0) {
      return 'Cancel'
    }
    return ''
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
