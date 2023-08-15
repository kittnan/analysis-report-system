import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import { HttpService } from 'app/service/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-section-manage',
  templateUrl: './section-manage.component.html',
  styleUrls: ['./section-manage.component.css']
})
export class SectionManageComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private api: HttpService,
    private route: Router,
  ) { }

  // ? Variable Form
  ModalSectionName = new FormControl(null, Validators.required);
  ModalSectionLevel = new FormControl(null, Validators.required);

  // ? Variable Get Api
  Section: any;

  // ? Modal Variable
  ModalSectionId = new FormControl(null, Validators.required);

  CC = [];
  toggleAddCC = false;
  ModalCC = new FormGroup({
    section: new FormControl(null, Validators.required),
    userId: new FormControl({ value: null, disabled: true }, Validators.required),
  })
  Users = [];
  ModalCCSectionId: any;

  // ? filter
  ResultFilter: any;
  WordFilter = new FormControl(null, Validators.required);


  ngOnInit(): void {
    this.CheckStatusUser();
    this.GetSection();
  }
  CheckStatusUser() {
    let LevelList = [];
    localStorage.getItem('AR_UserLevel1') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel1')) : false
    localStorage.getItem('AR_UserLevel2') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel2')) : false
    localStorage.getItem('AR_UserLevel3') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel3')) : false
    localStorage.getItem('AR_UserLevel4') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel4')) : false
    localStorage.getItem('AR_UserLevel5') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel5')) : false
    localStorage.getItem('AR_UserLevel6') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel6')) : false

    if (LevelList.find(i => i == '0')) {
    } else {
      // alert("No access!!");
      // location.href = "#/manageForm"
      this.route.navigate(['/manageForm'])

    }
  }


  // ? Modal
  OpenModelAddSection(content) {
    this.modalService.open(content, { size: 'lg' });

  }
  OpenModelEditSection(content, item) {
    this.ModalSectionId.setValue(item._id);
    this.ModalSectionName.reset();
    this.ModalSectionLevel.reset();
    this.ModalSectionName.setValue(item.name);
    this.ModalSectionLevel.setValue(item.view);
    this.modalService.open(content, { size: 'lg' });

  }
  OpenModelDelSection(content, item) {
    this.ModalSectionId.setValue(item._id);
    this.ModalSectionName.setValue(item.name);
    this.ModalSectionLevel.setValue(item.view);
    this.modalService.open(content, { size: 'lg' });
  }
  OpenModalEmail(content, item) {
    this.ModalCCSectionId = item._id;
    if (item.cc) {
      this.CC = item.cc;
    }
    this.modalService.open(content, { size: 'lg' });
  }


  // ? Event and Api
  AddSection() {
    let d = {
      name: this.ModalSectionName.value,
      view: this.ModalSectionLevel.value
    }
    this.api.PostSection(d).subscribe((data: any) => {
      if (data.length > 0) {
        this.alertSuccess();
        this.GetSection();
        this.Clear();
      }

    })
  }

  GetSection() {
    this.api.GetSection().subscribe((data: any) => {
      if (data.length > 0) {
        this.Section = data;
        this.ResultFilter = data
      }
    })
  }
  GetUser(id: any) {
    this.api.GetUserByIdSection(id).subscribe((data: any) => {
      if (data.length > 0) {
        this.Users = data;
      } else {
        this.Users = [];
      }
    })
  }

  EditSection() {
    let d = {
      name: this.ModalSectionName.value
    }
    this.api.UpdateSection(this.ModalSectionId.value, d).subscribe((data: any) => {
      if (data) {
        this.alertSuccess();
        this.GetSection();
      }
    })
  }

  DelSection() {
    const Ans = confirm("Delete ?");
    if (Ans == true) {
      this.api.DeleteSection(this.ModalSectionId.value).subscribe((data: any) => {
        if (data == null) {
          this.alertSuccess();
          this.Clear();
          this.GetSection();
        }
      })
    }
  }

  onClickAddUserCC() {
    this.toggleAddCC = !this.toggleAddCC
  }
  onChangeSectionModalCC() {
    // console.log(this.ModalCC.controls.section.valid);
    this.ModalCC.controls.section.valid ? this.ModalCC.controls.userId.enable() : this.ModalCC.controls.userId.disable();
    this.GetUser(this.ModalCC.controls.section.value);
  }
  onSubmitCC() {
    const checkList = this.CC.filter(item => item.UserId == this.ModalCC.controls.userId.value)
    if (checkList.length <= 0) {
      const tempUser = this.Users.filter(item => item._id == this.ModalCC.controls.userId.value)
      const data = {
        FirstName: tempUser[0].FirstName,
        LastName: tempUser[0].LastName,
        Email: tempUser[0].Email,
        UserId: tempUser[0]._id,
        EmployeeCode: tempUser[0].EmployeeCode,
      }
      this.CC.push(data)
      const data2 = {
        cc: this.CC
      }
      this.api.UpdateSection(this.ModalCCSectionId, data2).subscribe((data: any) => {
        if (data) {
          this.alertSuccess()
          this.ModalCC.controls.userId.reset()
        }

      })
    } else {
      Swal.fire({
        title: 'ERROR',
        icon: 'error',
        text: "User have in list",
        showConfirmButton: false,
        timer: 1000
      })
    }

  }

  onClickDeleteCC(item: any) {
    const ans = confirm("Delete ?")
    if (ans == true) {
      this.CC.splice(item, 1);
      const data = {
        cc: this.CC
      }
      this.api.UpdateSection(this.ModalCCSectionId, data).subscribe((data: any) => {
        if (data) {
          this.alertSuccess()
        }

      })
    }

  }

  Clear() {
    this.ModalSectionId.reset();
    this.ModalSectionName.reset();

  }

  onFilter() {
    if (this.WordFilter.valid) {
      this.ResultFilter = this.Section.filter(i => ((i.name).toLowerCase()).includes((this.WordFilter.value).toLowerCase()))
    } else {
      this.ResultFilter = this.Section
    }
  }



  alertSuccess() {
    Swal.fire({
      title: 'SUCCESS',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    })
  }

}
