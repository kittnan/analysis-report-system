import { Component, OnInit } from '@angular/core';
// import { ViewFormService } from '../view-form/view-form.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'


import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpService } from 'app/service/http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
// import * as fs from 'file-saver';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;




@Component({
  selector: 'app-progress-form2',
  templateUrl: './progress-form2.component.html',
  // styleUrls: ['./progress-form2.component.css'],
  styleUrls: ['../pagesStyle.css']

})
export class ProgressForm2Component implements OnInit {


  // ? params
  formId: any = null

  // ? API
  form: any;
  result: any;
  AeEngList: any;

  // ? Session
  FormView = sessionStorage.getItem('FormView');

  // ? Form control
  Form = new FormGroup({
    ReplyDate: new FormControl(null, Validators.required),
    AeApprove: new FormControl(null, Validators.required),
  })

  NoteApprove = new FormControl(null);
  NoteReject = new FormControl(null);




  // ? Variable
  RequestItem: any;
  AeApproveName: any;
  // FileListname: any
  // PathListName: any = [];
  FileList: any = [];

  // ? Email
  SendEmailApproved: any;
  SendEmailUser: any;

  SendRejectUser: any;

  // ?toggle
  toggleLabel = false

  // ? Min ReplyDate
  MinReplyDate: any;


  // ? comment
  CommentLists: any = [];

  constructor(
    private modalService: NgbModal,
    // private api: ViewFormService,
    // private api: RequestServiceService,
    private api: HttpService,
    private route: Router,
    private routerActive: ActivatedRoute
  ) {
    this.routerActive.queryParams.subscribe((param: Params) => {
      if (param) {
        this.formId = param['formId']
      }
    })
  }

  ngOnInit(): void {
    this.CheckStatusUser();
    this.getForm();

  }
  CheckStatusUser() {
    let LevelList = [];
    LevelList.push(localStorage.getItem('AR_UserLevel1'))
    LevelList.push(localStorage.getItem('AR_UserLevel2'))
    LevelList.push(localStorage.getItem('AR_UserLevel3'))
    LevelList.push(localStorage.getItem('AR_UserLevel4'))
    LevelList.push(localStorage.getItem('AR_UserLevel5'))
    LevelList.push(localStorage.getItem('AR_UserLevel6'))
    const Level = LevelList.filter(lvl => (lvl == '3') || (lvl == '0'))
    // console.log(Level.length);
    const checkAEWindow = LevelList.filter(lvl => lvl == '3');
    checkAEWindow.length > 0 ? this.toggleLabel = true : this.toggleLabel = false;
    if (Level.length == 0) {
      // alert("No access!!");
      // location.href = "#/manageForm"
      this.route.navigate(['/manageForm'])
    }
  }

  // ?API

  getForm() {
    let d = this.formId

    this.api.FindFormById(d).subscribe((data: any) => {
      if (data) {
        this.form = data;
        let str = this.form.issuedDate.split("T");
        let str2 = this.form.replyDate.split("T");
        this.form.issuedDate = str[0];
        this.form.replyDate = str2[0];
        this.MinReplyDate = this.form.issuedDate
        this.RequestItem = data.requestItem;
        this.ReplyDate.setValue(this.form.replyDate)
        this.FileList = data.files;
        this.GetAeEng();
        // this.SetPathFile();
      } else this.form = null;
    })
  }
  GetAeEng() {
    // console.log("ITEM", this.RequestItem);

    this.api.FindAeEng(this.RequestItem, 4).subscribe((data: any) => {
      if (data.length > 0) {
        this.AeEngList = data;
        // if (data.length == 1) {
        //   this.AeApprove.setValue(data[0]._id);
        //   this.OnApproveChange();
        // }
      }

    })
  }
  getResult() {
    let d = {
      idForm: this.formId
    }
    this.api.FindResultByFormIdMain(d).subscribe((data: any) => {
      if (data) {
        this.result = data[0];
      } else this.result = null;
    })
  }

  // ? EVENT
  OnApproveChange() {
    this.AeEngList.forEach(i => {
      if (this.AeApprove.value == i._id) {
        let Fname = i.FirstName;
        let Lname = i.LastName;
        let str = Lname.substring(0, 1);
        this.AeApproveName = Fname + " " + str + ".";
        // console.log(this.AeApproveName);
        this.SetApproveEmail();
      }
    });
  }

  OnApprove() {


    const ans = confirm("Do you want to Approve")
    if (ans == true) {

      let d = {
        issuedDate: this.form.issuedDate,
        replyDate: this.ReplyDate.value,
        userApprove: this.AeApprove.value,
        userApproveName: this.AeApproveName,
        userApprove3: this.AeApprove.value,
        userApprove3Name: this.AeApproveName,
        status: 3,
        noteNow: this.NoteApprove.value,
        noteApprove3: this.NoteApprove.value
      }
      let Fname = localStorage.getItem('AR_UserFirstName')
      let Lname = localStorage.getItem('AR_UserLastName')



      this.api.UpadateRequestForm(this.formId, d).subscribe((data: any) => {
        if (data) {
          const Content = "<p>To " + this.SendEmailUser.FirstName + " " + this.SendEmailUser.LastName + "(AE Engineer)</p><br>" +
            "Please check analysis result and make report as link : <a href='http://10.200.90.152:8081/Analysis-Report/'>http://10.200.90.152:8081/Analysis-Report/</a><br><br>" +
            "<p>From " + Fname + " " + Lname + "(AE Window)</p>";

          const sendMail = {
            Content: Content,
            To: this.SendEmailUser.Email,
            From: "<Analysis-System@kyocera.co.th>",
            Subject: "Please check analysis result and make report  : " + this.form.requestNumber + " / Model  " + this.form.ktcModelNumber + " " + this.form.size + " " +
              this.form.customer + " Lot no. " + this.form.pcLotNumber + " from" + this.form.occurAName + " " + this.form.occurBName + " =" + this.form.ngQuantity + "pcs."
          }
          // this.api.SendEmailTo(sendMail).subscribe((data: any) => {
          //   this.alertSuccess();
          //   this.route.navigate(['/manageForm'])
          //   // location.href = "#/manageForm";
          // })

        }

      })
    }


  }

  OnReject() {

    const ans = confirm("Do you want to Reject ?");
    if (ans == true) {

      this.api.FindUserbyId(this.form.requesterId).subscribe((data: any) => {
        if (data.length > 0) {
          // console.log(data);
          let User = data[0];
          let f = User.FirstName;
          let l = User.LastName;
          let l2 = l.substring(0, 1);
          let sum = f + "-" + l2;

          let d = {
            issuedDate: this.form.issuedDate,
            replyDate: this.ReplyDate.value,
            status: 3.1,
            noteNow: this.NoteReject.value,
            noteReject2: this.NoteReject.value,
            userApprove: this.form.requesterId,
            userApproveName: sum,
          }
          // console.log("reject data", d);
          let id = this.formId
          this.api.UpadateRequestForm(id, d).subscribe((data: any) => {
            this.api.GetUser(d.userApprove).subscribe((data: any) => {
              if (data.length > 0) {
                this.SendRejectUser = data[0];
                // console.log(this.SendRejectUser);
                let Fname = localStorage.getItem('AR_UserFirstName')
                let Lname = localStorage.getItem('AR_UserLastName')
                const Content = "<p>To " + this.SendRejectUser.FirstName + " " + this.SendRejectUser.LastName + "(Issuer)</p><br>" +
                  "Analysis request not approve as  link : <a href='http://10.200.90.152:8081/Analysis-Report/'>http://10.200.90.152:8081/Analysis-Report/</a><br><br>" +
                  "<p>From " + Fname + " " + Lname + "(AE Window)</p>";

                const sendMail = {
                  Content: Content,
                  To: this.SendRejectUser.Email,
                  From: "<Analysis-System@kyocera.co.th>",
                  Subject: "Analysis request not approve  : " + this.form.requestNumber + " / Model  " + this.form.ktcModelNumber + " " + this.form.size + " " +
                    this.form.customer + " Lot no. " + this.form.pcLotNumber + " from" + this.form.occurAName + " " + this.form.occurBName + " =" + this.form.ngQuantity + "pcs."
                }
                // this.api.SendEmailTo(sendMail).subscribe((data: any) => {
                //   this.alertSuccess();
                //   this.route.navigate(['/manageForm'])

                //   // location.href = "#/manageForm";
                // })
              }
            })




          })
        }
      })
    }

  }

  SetApproveEmail() {
    this.AeEngList.forEach(item => {
      this.AeApprove.value == item._id ? this.SendEmailUser = item : false
    });
  }

  // ? Modal

  ModalNote(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  // ? FUNCTION
  // SetPathFile() {
  //   if (this.FileListname.length > 0) {
  //     this.FileListname.forEach(i => {
  //       this.progressForm1.FindPath(i).subscribe((data: any) => {
  //         if (data.length > 0) {
  //           this.PathListName.push(data[0].path);
  //         }

  //       })
  //     });

  //   }
  // }


  public pdfLable() {

    const head = this.form.requestNumber
    const model = this.form.ktcModelNumber
    const defect1 = this.form.defectiveName.substring(0, 95)
    const defect = defect1
    console.log(defect.length);

    const lot = this.form.pcLotNumber
    const sendNg = this.form.sendNgAnalysis
    const pic = this.form.userApprove2Name
    const date = new Date(this.form.issuedDate).toLocaleString('en-US').split(',');
    const qrText = head + "/" + model + "/" + defect + "/" + lot + "/" + sendNg + "/" + pic + "/" + date[0];
    const sizeBody = 10;
    var label = {
      pageSize: {
        width: 378,
        height: 235,
      },

      pageMargins: [10, 10, 10, 10],
      styles: {
        topHead: {
          fontSize: 18,
          bold: true
        },
        textHead: {
          fontSize: 14,
          bold: true
        },
        text: {
          fontSize: 12,
        }
      },
      content: [

        {
          layout: 'noBorders',
          table: {
            widths: ['*', 'auto', '*'],
            body: [
              ['', '', ''],
              ['', { text: head, fontSize: 36, bold: true }, '']
            ]
          }

        },


        {
          columns: [

            {
              margin: [10, 15, 0, 0],
              width: 150,
              qr: qrText, fit: 150,
            },
            {
              lineHeight: 1.3,
              margin: [25, 0, 0, 0],
              width: 'auto',
              text: [
                {
                  text: '\nModel: ',
                  bold: true
                },
                {
                  text: model + '\n',
                  fontSize: sizeBody
                },

                {
                  text: 'Defect: ',
                  bold: true
                },
                {
                  text: defect + '\n',
                  fontSize: sizeBody
                },
                {
                  text: 'Lot no: ',
                  bold: true
                },
                {
                  text: lot + '\n',
                  fontSize: sizeBody

                },
                {
                  text: "Send NG To Analysis: ",

                  bold: true
                },
                {
                  text: sendNg + ' (Pcs)\n',
                  fontSize: sizeBody
                },
                {
                  text: 'PIC: ',
                  bold: true
                },
                {
                  text: pic + '\n',
                  fontSize: sizeBody

                },

                {
                  text: 'Date: ',
                  bold: true
                },
                {
                  text: date[0],
                  fontSize: sizeBody

                }
              ],
              fontSize: 12.5
            }
          ]
        }
      ]
    }

    pdfMake.createPdf(label).open();
  }

  showComment(content) {
    this.CommentLists = [];
    this.setDataComment()
    this.modalService.open(content, { size: 'lg' });
  }
  setDataComment() {

    if (this.form.noteNow) {
      const temp = {
        note: this.form.noteNow,
        from: ``,
        to: `Last Comment`,
        class: "now"
      }
      this.CommentLists.push(temp)
    }
    // ? approve loop
    if (this.form.noteApprove1) {
      const temp = {
        note: this.form.noteApprove1,
        from: `Requestor issuer ( ${this.form.requesterName} )`,
        to: `Requestor approval ( ${this.form.userApprove1Name} )`,
        class: "approve"
      }
      this.CommentLists.push(temp)
    }
    if (this.form.noteApprove2) {
      const temp = {
        note: this.form.noteApprove2,
        from: `Requestor approval ( ${this.form.userApprove1Name} )`,
        to: `AE Window person ( ${this.form.userApprove2Name} )`,
        class: "approve"
      }
      this.CommentLists.push(temp)
    }
    if (this.form.noteApprove3) {
      const temp = {
        note: this.form.noteApprove3,
        from: `AE Window person ( ${this.form.userApprove2Name} )`,
        to: `AE Engineer ( ${this.form.userApprove3Name} )`,
        class: "approve"
      }
      this.CommentLists.push(temp)
    }
    if (this.form.noteApprove4) {
      const temp = {
        note: this.form.noteApprove4,
        from: `AE Engineer ( ${this.form.userApprove3Name} )`,
        to: `AE Section Head ( ${this.form.userApprove4Name} )`,
        class: "approve"
      }
      this.CommentLists.push(temp)
    }
    if (this.form.noteApprove5) {
      const temp = {
        note: this.form.noteApprove5,
        from: `AE Section Head ( ${this.form.userApprove4Name} )`,
        to: `AE Dep. Head ( ${this.form.userApprove5Name} )`,
        class: "approve"
      }
      this.CommentLists.push(temp)
    }
    if (this.form.noteApprove6) {
      const temp = {
        note: this.form.noteApprove6,
        from: `AE Dep. Head ( ${this.form.userApprove5Name} )`,
        to: "All",
        class: "approve"
      }
      this.CommentLists.push(temp)
    }

    // ? reject loop
    if (this.form.noteReject1) {
      const temp = {
        note: this.form.noteReject1,
        from: `Requestor approval ( ${this.form.userApprove1Name} )`,
        to: `Requestor issuer ( ${this.form.requesterName} )`,
        class: "reject"
      }
      this.CommentLists.push(temp)
    }
    if (this.form.noteReject2) {
      const temp = {
        note: this.form.noteReject2,
        from: `AE Window person ( ${this.form.userApprove2Name} )`,
        to: `Requestor issuer ( ${this.form.requesterName} )`,
        class: "reject"
      }
      this.CommentLists.push(temp)
    }
    if (this.form.noteReject3) {
      const temp = {
        note: this.form.noteReject3,
        from: `AE Engineer ( ${this.form.userApprove3Name} )`,
        to: `AE Window person ( ${this.form.userApprove2Name} )`,
        class: "reject"
      }
      this.CommentLists.push(temp)
    }
    if (this.form.noteReject4) {
      const temp = {
        note: this.form.noteReject4,
        from: `AE Section Head ( ${this.form.userApprove4Name} )`,
        to: `AE Engineer ( ${this.form.userApprove3Name} )`,
        class: "reject"
      }
      this.CommentLists.push(temp)
    }
    if (this.form.noteReject5) {
      const temp = {
        note: this.form.noteReject5,
        from: `AE Dep. Head ( ${this.form.userApprove5Name} )`,
        to: `AE Engineer ( ${this.form.userApprove3Name} )`,
        class: "reject"
      }
      this.CommentLists.push(temp)
    }

  }


  get ReplyDate() { return this.Form.get('ReplyDate') }
  get AeApprove() { return this.Form.get('AeApprove') }
  // get NoteApprove() { return this.Form.get('NoteApprove') }

  alertSuccess() {
    Swal.fire({
      title: 'SUCCESS',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    })
  }
}
