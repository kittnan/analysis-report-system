import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  appVersion :any

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
  // loginStatus : any = sessionStorage.getItem('loginStatus'); 

  // ? Form Control
  LoginForm = new FormGroup({
    UserName: new FormControl(null, Validators.required),
    PassWord: new FormControl(null, Validators.required)
  })

  constructor(
    private api: HttpService,
    private route: Router
  ) {
    this.appVersion = environment.appVersion
   }

  ngOnInit(): void {
    // console.log(sessionStorage.getItem('loginStatus'));

    if (sessionStorage.getItem('loginStatus') == "true") {
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

          sessionStorage.setItem('UserId', data[0]._id);
          sessionStorage.setItem('UserFirstName', data[0].FirstName);
          sessionStorage.setItem('UserLastName', data[0].LastName);
          sessionStorage.setItem('UserSection1Id', data[0].Section1Id);
          sessionStorage.setItem('UserSection2Id', data[0].Section2Id);
          sessionStorage.setItem('UserSection3Id', data[0].Section3Id);
          sessionStorage.setItem('UserSection4Id', data[0].Section4Id);
          sessionStorage.setItem('UserSection5Id', data[0].Section5Id);
          sessionStorage.setItem('UserSection6Id', data[0].Section6Id);
          sessionStorage.setItem('UserSection1Name', data[0].Section1Name);
          sessionStorage.setItem('UserSection2Name', data[0].Section2Name);
          sessionStorage.setItem('UserSection3Name', data[0].Section3Name);
          sessionStorage.setItem('UserSection4Name', data[0].Section4Name);
          sessionStorage.setItem('UserSection5Name', data[0].Section5Name);
          sessionStorage.setItem('UserSection6Name', data[0].Section6Name);
          sessionStorage.setItem('UserEmail', data[0].Email);
          sessionStorage.setItem('UserEmployeeCode', data[0].EmployeeCode);
          sessionStorage.setItem('loginStatus', this.userLogin);
          sessionStorage.setItem('UserLevel1', data[0].Level1);
          sessionStorage.setItem('UserLevel2', data[0].Level2);
          sessionStorage.setItem('UserLevel3', data[0].Level3);
          sessionStorage.setItem('UserLevel4', data[0].Level4);
          sessionStorage.setItem('UserLevel5', data[0].Level5);
          sessionStorage.setItem('UserLevel6', data[0].Level6);
          // sessionStorage.setItem('requesterId', data[0]._id);

          const guest = sessionStorage.getItem('UserEmployeeCode')
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
    sessionStorage.clear();
    // location.href = "/#login";
    // SidebarComponent.call;


    // alert("Logout");
  }

  get UserName() { return this.LoginForm.get('UserName') }
  get PassWord() { return this.LoginForm.get('PassWord') }

}
