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
  SelectStatus = new FormControl('inprocess');

  // ? 
  UserLevel = [];
  UserId = sessionStorage.getItem('UserId')

  // ? data table
  DataFilter = [];
  CountNum = new FormControl(null, Validators.required)
  PageNow = 1;
  CountPage: any;
  CountList = [10, 20, 50, 100]

  // ? search
  KeySearch: any

  ngOnInit(): void {
    this.CheckStatusUser()
    this.pageLoadStart();
    this.SetUserStatus();
    this.GetRequest();
    // this.OnSelectStatus();
  }

  SetUserStatus() {
    // ?  filter เลเวล ถ้าเป็นnull ให้ตัดออก
    for (let index = 0; index < 5; index++) {
      let str1 = "UserLevel" + (index + 1);
      let temp1 = sessionStorage.getItem(str1);
      if (temp1 != "null") {
        this.UserLevel[index] = sessionStorage.getItem(str1);
      }
    }
    // this.OnSelectStatus();
  }

  CheckStatusUser() {
    let LevelList = [];
    sessionStorage.getItem('UserLevel1') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel1')) : false
    sessionStorage.getItem('UserLevel2') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel2')) : false
    sessionStorage.getItem('UserLevel3') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel3')) : false
    sessionStorage.getItem('UserLevel4') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel4')) : false
    sessionStorage.getItem('UserLevel5') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel5')) : false
    sessionStorage.getItem('UserLevel6') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel6')) : false
    const guest = sessionStorage.getItem('UserEmployeeCode')

    if (guest == 'guest') {
      // alert("No access!!");
      this.route.navigate(['/dashboard'])
      // location.href = "#/dashboard"
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
  }



  async OnSelectStatus() {

    if (this.SelectStatus.value == "inprocess") {
      this.FormList = await this.FormListAll.filter(item => (item.status != 6) && (item.status != 0))
      await this.startPage();
    } else if (this.SelectStatus.value == "finish") {
      this.FormList = await this.FormListAll.filter(item => (item.status == 6) || (item.status == 0))
      await this.startPage();

    }



  }

  OnClickForm(item: any) {

    const Reject1 = [2.1, 3.1, 4.3, 5.4, 6.4]
    // const Reject2 = 3.1
    const Inprocess = [1, 2, 3, 4, 5]
    const View1 = [1, 2, 2.1]
    const View2 = [3, 4, 5, 6, 3.1, 4.3, 5.4, 6.4]
    let StatusForm = item.status;
    sessionStorage.setItem('FormId', item._id)
    if (this.UserId == item.userApprove) {
      let temp1 = Inprocess.find(ar => ar == StatusForm);
      if (temp1) {
        this.route.navigate(["/progressForm" + StatusForm])
        // location.href = "#/progressForm" + StatusForm
      } else if (StatusForm == Reject1[0] || StatusForm == Reject1[1]) {
        this.route.navigate(["/rejectForm1"])
        // location.href = "#/rejectForm1";
      } else if (StatusForm == Reject1[2]) {
        this.route.navigate(["/rejectForm2"])
        // location.href = "#/rejectForm2";
      } else if (StatusForm == Reject1[3]) {
        this.route.navigate(["/rejectForm3"])
        // location.href = "#/rejectForm3";
      } else if (StatusForm == Reject1[4]) {
        this.route.navigate(["/rejectForm3"])
        // location.href = "#/rejectForm3";
      }

    } else {
      const result1 = View1.find(arr => arr == StatusForm)
      const result2 = View2.find(arr => arr == StatusForm)
      if (result1) {
        sessionStorage.setItem('FormView', '1');
      } else if (result2) {
        sessionStorage.setItem('FormView', '2');
      }
      this.route.navigate(['/viewForm'])
      // location.href = "#/viewForm";
    }




  }

  // ? Search filter
  onSearchChange(event: any) {
    let query = event.target.value

  }

  // ?API
  async GetRequestFormByApprove() {
    console.log(this.UserLevel);
    const foo = JSON.stringify(this.UserLevel);
    console.log(foo);
    
    let id = sessionStorage.getItem('UserId');
    const data: any = await this.api.GetRequestFormByApprove(id).toPromise();
    if (data.length > 0) {
      this.FormListAll = data.map((d: any) => {
        d.issuedDate = new Date(d.issuedDate).toLocaleDateString('en-US');
        d.replyDate = new Date(d.replyDate).toLocaleDateString('en-US');
        return d
      })
      if (this.FormListAll) this.OnSelectStatus();
    }
    // this.api.GetRequestFormByApprove(id).subscribe(async (data: any) => {
    //   if (data.length > 0) {
    //     this.FormListAll = await data;
    //     let count = 0;
    //     await this.FormListAll.forEach((i, index) => {
    //       count += 1;
    //       const dateStr = new Date(i.issuedDate).toLocaleDateString('en-US')
    //       const dateStr2 = new Date(i.replyDate).toLocaleDateString('en-US')
    //       i.issuedDate = dateStr;
    //       i.replyDate = dateStr2;
    //       if (count == this.FormListAll.length) {
    //         this.OnSelectStatus();

    //       }
    //     });


    //   }
    // })
  }

  async GetRequest() {
    await this.GetRequestFormByApprove();
  }


  // ? Data table Fn'
  numPage(data: any, value: number) {
    // let num = Math.ceil(this.FormList.length / this.CountNum.value)
    let num = Math.ceil(data.length / value)
    return num
  }
  async startPage() {
    // console.log(this.FormList);

    let temp: any = [];
    this.FormList.forEach(i => {
      temp.push(i)
    });
    this.CountNum.setValue(this.CountList[0])
    this.CountPage = this.numPage(this.FormList, this.CountNum.value);
    const start = (this.PageNow - 1) * this.CountNum.value
    const end = Number(this.CountNum.value)
    this.DataFilter = temp.splice(start, end)
  }

  next() {
    let temp = [];
    this.FormList.forEach(i => {
      temp.push(i)
    });
    if (this.PageNow < this.CountPage) {
      this.PageNow += 1
      const start = (this.PageNow - 1) * this.CountNum.value
      const end = this.CountNum.value
      this.DataFilter = temp.splice(start, end)
    }
  }
  back() {
    let temp = [];
    this.FormList.forEach(i => {
      temp.push(i)
    });
    if (this.PageNow > 1) {
      this.PageNow -= 1
      const start = (this.PageNow - 1) * this.CountNum.value
      const end = this.CountNum.value
      this.DataFilter = temp.splice(start, end)
    }
  }
  nextData() {
    const a = this.PageNow * this.CountNum.value
    if (a < this.FormListAll.length) {

    }
  }
  onSelectCountNum() {
    this.PageNow = 1
    let temp: any = [];
    this.FormList.forEach(i => {
      temp.push(i)
    });
    // this.CountPage = this.numPage();
    // alert(this.CountNum.value)
    // alert(this.FormListAll.length)
    if (this.CountNum.value == 'all') {
      this.CountPage = this.numPage(this.FormList, this.FormListAll.length);
      const start = (this.PageNow - 1) * this.FormListAll.length
      const end = Number(this.FormListAll.length)
      this.DataFilter = temp.splice(start, end)
    } else {
      this.CountPage = this.numPage(this.FormList, this.CountNum.value);
      const start = (this.PageNow - 1) * this.CountNum.value
      const end = Number(this.CountNum.value)
      this.DataFilter = temp.splice(start, end)
    }
  }


  pageLoadStart() {
    this.LoadingPage = true;
  }
  pageLoadEnd() {
    setTimeout(() => {
      this.LoadingPage = false;

    }, 500);
  }

}
