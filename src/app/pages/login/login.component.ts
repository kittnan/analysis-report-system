import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'app/service/http.service';
import { LocalStorageService } from 'app/service/local-storage.service';
import { environment } from 'environments/environment'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  appVersion: any

  username: any;
  password: any;
  userLogin: any;

  // ? get session store
  userId: any;
  userFname: any;
  userLname: any;
  userSection1: any;
  userSection2: any;
  userSection3: any;
  userEmpCode: any;
  userEmail: any;
  userStatus: any;
  // loginStatus : any = localStorage.getItem('AR_loginStatus');

  // ? Form Control
  LoginForm = new FormGroup({
    UserName: new FormControl(null, Validators.required),
    PassWord: new FormControl(null, Validators.required)
  })

  constructor(
    private api: HttpService,
    private route: Router,
    private $local: LocalStorageService
  ) {
    this.appVersion = environment.appVersion
  }

  ngOnInit(): void {
    // console.log(localStorage.getItem('AR_loginStatus'));

    if (localStorage.getItem('AR_loginStatus') == "true") {
      this.route.navigate(['/manageForm'])
      // location.href = "#/manageForm"
    }
  }

  onSubmit() {

    if (this.LoginForm.valid) {

      let Data = {
        username: this.UserName.value,
        password: this.PassWord.value
      }

      this.api.Login(Data).subscribe((data) => {
        if (data.length > 0) {
          this.userLogin = true;
          // console.log(data);

          localStorage.setItem('AR_UserId', data[0]._id);
          localStorage.setItem('AR_UserFirstName', data[0].FirstName);
          localStorage.setItem('AR_UserLastName', data[0].LastName);
          localStorage.setItem('AR_UserSection1Id', data[0].Section1Id);
          localStorage.setItem('AR_UserSection2Id', data[0].Section2Id);
          localStorage.setItem('AR_UserSection3Id', data[0].Section3Id);
          localStorage.setItem('AR_UserSection4Id', data[0].Section4Id);
          localStorage.setItem('AR_UserSection5Id', data[0].Section5Id);
          localStorage.setItem('AR_UserSection6Id', data[0].Section6Id);
          localStorage.setItem('AR_UserSection1Name', data[0].Section1Name);
          localStorage.setItem('AR_UserSection2Name', data[0].Section2Name);
          localStorage.setItem('AR_UserSection3Name', data[0].Section3Name);
          localStorage.setItem('AR_UserSection4Name', data[0].Section4Name);
          localStorage.setItem('AR_UserSection5Name', data[0].Section5Name);
          localStorage.setItem('AR_UserSection6Name', data[0].Section6Name);
          localStorage.setItem('AR_UserEmail', data[0].Email);
          localStorage.setItem('AR_UserEmployeeCode', data[0].EmployeeCode);
          localStorage.setItem('AR_loginStatus', this.userLogin);
          localStorage.setItem('AR_UserLevel1', data[0].Level1);
          localStorage.setItem('AR_UserLevel2', data[0].Level2);
          localStorage.setItem('AR_UserLevel3', data[0].Level3);
          localStorage.setItem('AR_UserLevel4', data[0].Level4);
          localStorage.setItem('AR_UserLevel5', data[0].Level5);
          localStorage.setItem('AR_UserLevel6', data[0].Level6);
          // localStorage.setItem('requesterId', data[0]._id);

          const guest = localStorage.getItem('AR_UserEmployeeCode')
          if (guest == 'guest') {
            this.route.navigate(['/dashboard-guest'])

            // location.href = "#/dashboard-guest";
          } else {
            this.route.navigate(['/manageForm'])

            // location.href = "#/manageForm";
          }

          // location.reload();

          // window.location.href = "/#dashboard"

        } else {
          alert("Login Fail");
        }
      })
    } else {
      alert("Login Fail");
    }

  }

  onLogout() {
    location.reload();
    this.userLogin = false;
    this.$local.clearLocal()
    // sessionStorage.clear();
  }

  get UserName() { return this.LoginForm.get('UserName') }
  get PassWord() { return this.LoginForm.get('PassWord') }

}
