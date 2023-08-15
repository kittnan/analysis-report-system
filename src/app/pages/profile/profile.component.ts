import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'app/service/http.service';
import { LocalStorageService } from 'app/service/local-storage.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private api: HttpService,
    private modalService: NgbModal,
    private route: Router,
    private $local: LocalStorageService
  ) { }


  User: any;
  UserId: any;
  Sections = [];

  Pass = new FormGroup({
    OldPassword: new FormControl(null, Validators.required),
    NewPassword: new FormControl(null, Validators.required),
    NewPassword2: new FormControl(null, Validators.required),
  })


  ngOnInit(): void {
    this.GetUser();
  }

  GetUser() {
    this.UserId = localStorage.getItem('AR_UserId');
    this.api.GetUser(this.UserId).subscribe((data: any) => {
      if (data) {
        this.User = data[0];
        this.setUserData(this.User.Level1, 1);
        this.setUserData(this.User.Level2, 2);
        this.setUserData(this.User.Level3, 3);
        this.setUserData(this.User.Level4, 4);
        this.setUserData(this.User.Level5, 5);
        this.setUserData(this.User.Level6, 6);
        // console.log(data);

      } else {
        this.User = null;
      }
    })
  }

  setUserData(Level: any, unit: any) {

    let aut, sec;
    Level == 1 ? aut = "Requestor issuer" : false
    Level == 2 ? aut = "Requestor approval" : false
    Level == 3 ? aut = "AE Window person" : false
    Level == 4 ? aut = "AE Engineer" : false
    Level == 5 ? aut = "AE Section Head" : false
    Level == 6 ? aut = "AE Dep. Head" : false
    if (aut != null) {
      unit == 1 ? sec = this.User.Section1Name : false
      unit == 2 ? sec = this.User.Section2Name : false
      unit == 3 ? sec = this.User.Section3Name : false
      unit == 4 ? sec = this.User.Section4Name : false
      unit == 5 ? sec = this.User.Section5Name : false
      unit == 6 ? sec = this.User.Section6Name : false
      const sections = {
        aut: aut,
        sec: sec
      }
      this.Sections.push(sections);
      // console.log(this.Sections);
    }


  }

  Logout() {
    this.$local.clearLocal()
    // sessionStorage.clear();
    this.route.navigate(['/login'])
    // location.href = "#/login";
  }

  openModalChangePassword(content) {
    this.modalService.open(content, { size: 'lg' });
  }
  onSaveChangePassword() {
    Swal.fire({
      title: 'Do you want to change password ?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then((r) => {
      if (r.isConfirmed) {
        let d = {
          Password: this.NewPassword.value,
        }
        this.api.UpdateUser(this.UserId, d).subscribe((data: any) => {
          if (data) {
            this.modalService.dismissAll()
            this.alertSuccess();
            sessionStorage.clear();
            this.route.navigate(['/login'])
            // location.href = "#/login";
          }
        })

      }
    })
  }


  alertSuccess() {
    Swal.fire({
      title: 'SUCCESS',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    })
  }


  get OldPassword() { return this.Pass.get('OldPassword'); }
  get NewPassword() { return this.Pass.get('NewPassword'); }
  get NewPassword2() { return this.Pass.get('NewPassword2'); }

}


