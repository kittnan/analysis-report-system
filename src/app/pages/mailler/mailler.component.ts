import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'app/service/http.service';

@Component({
  selector: 'app-mailler',
  templateUrl: './mailler.component.html',
  styleUrls: ['./mailler.component.css']
})
export class MaillerComponent implements OnInit {
  constructor(
    private api: HttpService,
    private route:Router
  ) { }

  Mailler: any;

  // ? Form Group
  Mail = new FormGroup({
    From: new FormControl(null, Validators.required),
    Password: new FormControl(null, Validators.required),
    Subject: new FormControl(null, Validators.required)
  })

  // ?Toggle
  ToggleBtn1 = false;


  test1 = new FormControl(null,Validators.required)

  ngOnInit(): void {
    this.CheckStatusUser();
    this.GetMailler();
  }

 
  
  CheckStatusUser() {
    let LevelList = [];
    sessionStorage.getItem('UserLevel1') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel1')) : false
    sessionStorage.getItem('UserLevel2') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel2')) : false
    sessionStorage.getItem('UserLevel3') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel3')) : false
    sessionStorage.getItem('UserLevel4') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel4')) : false
    sessionStorage.getItem('UserLevel5') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel5')) : false
    sessionStorage.getItem('UserLevel6') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel6')) : false

    if (LevelList.find(i => i == '0')) {
    } else {
      // alert("No access!!");
      this.route.navigate(['/manageForm'])
      // location.href = "#/manageForm"
    }
  }

  GetMailler() {
    this.api.GetMailler().subscribe((data: any) => {
      if (data.length > 0) {
        this.Mailler = data[0];
      } else {
        this.Mailler = null;
      }
    })
  }

  UpdateMailler() {
    const d = {
      password: this.Password.value,
      from: this.From.value,
      subject: this.Subject.value
    }
    const id = this.Mailler._id
    this.api.PutMailler(d, id).subscribe((data: any) => {
      if (data) {
        alert("Success");
        this.Mail.reset();
        this.ToggleBtn1 = false;
        this.GetMailler();
      }
    })
  }

  CancelMailler() {
    const ans = confirm("Cancel ?")
    if(ans){
      this.Mail.reset();
      this.ToggleBtn1 = false;
      this.GetMailler();
    }

  }

  onClickEdit() {
    this.ToggleBtn1 = !this.ToggleBtn1
    this.Mail.reset();
    if (this.ToggleBtn1 == true) {
      this.From.setValue(this.Mailler.from);
      this.Password.setValue(this.Mailler.password);
      this.Subject.setValue(this.Mailler.subject);
    }
  }





  get From() { return this.Mail.get('From') };
  get Password() { return this.Mail.get('Password') };
  get Subject() { return this.Mail.get('Subject') };






}
