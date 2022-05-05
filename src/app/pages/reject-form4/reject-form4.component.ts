import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { HttpService } from 'app/service/http.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reject-form4',
  templateUrl: './reject-form4.component.html',
  styleUrls: ['./reject-form4.component.css', '../pagesStyle.css']
})
export class RejectForm4Component implements OnInit {


  // ? API
  form: any;
  result: any;
  ApproveList: any;

  // ? Normaly
  ApproveName: any;
  FileListname: any;
  PathListName: any = [];


  // ? Form Control
  NoteApprove = new FormControl(null);
  NoteReject = new FormControl(null);
  Approve = new FormControl(null, Validators.required);

  htmlFile = new FormControl(null);
  // ? Email
  SendEmailApproved: any;
  SendEmailUser: any;
  SendRejectUser: any;

  FileReportName: any;


  // ?upload file
  file: any;
  tempFile: any = [];
  tempFileName: any = [];
  tempFileTotal: number = 0;
  inputFile = new FormControl(null);

  constructor(
    // private api: ProgressForm4Service,
    // private api: ViewFormService,
    private modalService: NgbModal,
    // private api: ProgressForm1Service,
    private api: HttpService,
    private route: Router
  ) { }


  ngOnInit(): void {
    this.CheckStatusUser();
    this.getForm();
    this.GetResult();
  }

  CheckStatusUser() {
    let LevelList = [];
    LevelList.push(sessionStorage.getItem('UserLevel1'))
    LevelList.push(sessionStorage.getItem('UserLevel2'))
    LevelList.push(sessionStorage.getItem('UserLevel3'))
    LevelList.push(sessionStorage.getItem('UserLevel4'))
    LevelList.push(sessionStorage.getItem('UserLevel5'))
    LevelList.push(sessionStorage.getItem('UserLevel6'))
    const Level = LevelList.filter(lvl => (lvl == '5') || (lvl == '0'))
    // console.log(Level.length);

    if (Level.length == 0) {
      // alert("No access!!");
      // location.href = "#/manageForm"
      this.route.navigate(['/manageForm'])
    }
  }

  SetPathFile() {
    if (this.FileListname.length > 0) {
      this.FileListname.forEach(i => {
        this.api.FindPath(i).subscribe((data: any) => {
          if (data.length > 0) {
            this.PathListName.push(data[0].path);
          }

        })
      });

    }
  }

  // ? API
  getForm() {
    let d = sessionStorage.getItem('FormId');
    this.api.FindFormById(d).subscribe((data: any) => {
      if (data) {
        this.form = data;
        this.FileListname = data.fileList;
        this.SetPathFile();
        let str = this.form.issuedDate.split("T");
        let str2 = this.form.replyDate.split("T");
        this.form.issuedDate = str[0];
        this.form.replyDate = str2[0];
        this.GetApproveList();
      } else this.form = null;
    })
  }

  GetResult() {
    let d = sessionStorage.getItem('FormId');
    this.api.FindResultByFormIdMain(d).subscribe((data: any) => {
      if (data) {
        this.result = data[0];
        let str = this.result.startAnalyzeDate.split("T");
        let str2 = this.result.finishAnalyzeDate.split("T");
        let str3 = this.result.finishReportDate.split("T");
        this.result.startAnalyzeDate = str[0];
        this.result.finishAnalyzeDate = str2[0];
        this.result.finishReportDate = str3[0];

        this.tempFile = this.result.files
        this.FileReportName = (this.result.file.split('/'))[5]
        // this.FileReportName = (this.result.file.split('/'))[6]

      } else this.result = null;
    })
  }

  GetApproveList() {
    this.api.GetUserByItemLevel(this.form.requestItem, 6).subscribe((data: any) => {
      if (data.length > 0) {
        this.ApproveList = data;
        if (data.length == 1) {
          this.Approve.setValue(data[0]._id);
          this.OnApproveChange();
        }
      }

    })
  }

  // ? Modal

  ModalNote(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  // ? EVENT
  OnApproveChange() {
    this.ApproveList.forEach(i => {
      if (this.Approve.value == i._id) {
        let Fname = i.FirstName;
        let Lname = i.LastName;
        let str = Lname.substring(0, 1);
        this.ApproveName = Fname + " " + str + ".";
        this.SetApproveEmail();
      }
    });
  }
  OnApprove() {

    const ans = confirm("Do you want to Approve")
    if (ans == true) {

      let d = {
        issuedDate: this.form.issuedDate,
        replyDate: this.form.replyDate,
        status: 5,
        userApprove5: this.Approve.value,
        userApprove5Name: this.ApproveName,
        userApprove: this.Approve.value,
        userApproveName: this.ApproveName,
        noteApprove4: this.NoteApprove.value,
        noteNow: this.NoteApprove.value
      }
      this.api.UpdateForm(sessionStorage.getItem('FormId'), d).subscribe((data: any) => {
        let Fname = sessionStorage.getItem('UserFirstName')
        let Lname = sessionStorage.getItem('UserLastName')
        if (data) {
          const Content = "<p>To " + this.SendEmailUser.FirstName + " " + this.SendEmailUser.LastName + "(AE Approval)</p><br>" +
            "Please approve analysis report as below link : <a href='http://10.200.90.152:8081/Analysis-Report/'>http://10.200.90.152:8081/Analysis-Report/</a><br><br>" +
            "<p>From " + Fname + " " + Lname + "(AE Reviewer)</p>";

          const sendMail = {
            Content: Content,
            To: this.SendEmailUser.Email,
            From: "<Analysis-System@kyocera.co.th>",
            Subject: "Please approve analysis report  : " + this.form.requestNumber + " / Model  " + this.form.ktcModelNumber + " " + this.form.size + " " +
              this.form.customer + " Lot no. " + this.form.pcLotNumber + " from" + this.form.occurAName + " " + this.form.occurBName + " =" + this.form.ngQuantity + "pcs."
          }
          this.api.SendEmailTo(sendMail).subscribe((data: any) => {
            this.alertSuccess();
            // location.href = "#/manageForm";
            this.route.navigate(['/manageForm'])

          })

        }
      })
    }

  }

  OnReject() {

    let Ans = confirm("Reject?");
    if (Ans == true) {

      this.api.FindUserbyId(this.form.userApprove3).subscribe((data: any) => {
        if (data.length > 0) {
          // console.log(data);
          let User = data[0];
          let f = User.FirstName;
          let l = User.LastName;
          let l2 = l.substring(0, 1);
          let sum = f + "-" + l2;

          let d = {
            issuedDate: this.form.issuedDate,
            replyDate: this.form.replyDate,
            status: 5.4,
            noteNow: this.NoteReject.value,
            noteReject4: this.NoteReject.value,
            userApprove: this.form.userApprove3,
            userApproveName: sum,
          }
          // console.log("reject data", d);
          let id = sessionStorage.getItem('FormId');
          this.api.UpadateRequestForm(id, d).subscribe((data: any) => {
            if (data) {
              this.api.GetUser(d.userApprove).subscribe((data: any) => {
                if (data.length > 0) {
                  this.SendRejectUser = data[0];
                  // console.log(this.SendRejectUser);
                  let Fname = sessionStorage.getItem('UserFirstName')
                  let Lname = sessionStorage.getItem('UserLastName')
                  const Content = "<p>To " + this.SendRejectUser.FirstName + " " + this.SendRejectUser.LastName + "(AE Engineer)</p><br>" +
                    "AE Reviewer not approve report as below link : <a href='http://10.200.90.152:8081/Analysis-Report/'>http://10.200.90.152:8081/Analysis-Report/</a><br><br>" +
                    "<p>From " + Fname + " " + Lname + "(AE Reviewer)</p>";

                  const sendMail = {
                    Content: Content,
                    To: this.SendRejectUser.Email,
                    From: "<Analysis-System@kyocera.co.th>",
                    Subject: "AE Reviewer not approve report  : " + this.form.requestNumber + " / Model  " + this.form.ktcModelNumber + " " + this.form.size + " " +
                      this.form.customer + " Lot no. " + this.form.pcLotNumber + " from" + this.form.occurAName + " " + this.form.occurBName + " =" + this.form.ngQuantity + "pcs."
                  }
                  this.api.SendEmailTo(sendMail).subscribe((data: any) => {
                    this.alertSuccess();
                    // location.href = "#/manageForm";
                    this.route.navigate(['/manageForm'])

                  })
                }
              })

            }
          })
        }
      })

    }
  }

  SetApproveEmail() {
    this.ApproveList.forEach(item => {
      this.Approve.value == item._id ? this.SendEmailUser = item : this.SendEmailUser = null
    });
  }


  alertSuccess() {
    Swal.fire({
      title: 'SUCCESS',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    })
  }

  uploadReportFile(event) {

    Swal.fire({
      title: 'Do you want to Upload and Replace ?',
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: 'Upload',
    }).then((result) => {
      if (result.isConfirmed) {
        const file = event.target.files[0]
        const realFileName = this.form.requestNumber + '.xlsx';

        if (file.name == realFileName) {

          this.api.UploadFileEReport(file, file.name).then((data: any) => {
            if (data) {
              this.htmlFile.reset();
              this.alertSuccess();
            }
          })

        } else {
          this.htmlFile.reset();
          Swal.fire({
            icon: 'error',
            title: 'Wrong !!',
            text: 'File name or file type is not register',
            showConfirmButton: false,
            timer: 1000
          })

        }
      }
    })

  }
}
