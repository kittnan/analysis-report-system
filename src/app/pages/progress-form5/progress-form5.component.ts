import { Component, OnInit } from '@angular/core';
// import { ProgressForm5Service } from './progress-form5.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { ProgressForm1Service } from '../progress-form1/progress-form1.service';
import Swal from 'sweetalert2'
// import { UserService } from '../user/user.service';
import { HttpService } from 'app/service/http.service';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-progress-form5',
  templateUrl: './progress-form5.component.html',
  styleUrls: ['./progress-form5.component.css', '../pagesStyle.css']
})
export class ProgressForm5Component implements OnInit {


  // ? API
  form: any;
  result: any;
  ApproveList: any;

  // ? Normaly
  ApproveName: any;
  // FileListname: any;
  // PathListName: any = [];
  FileList: any = [];
  Approve: any;

  // ? Form Control
  NoteApprove = new FormControl(null);
  NoteReject = new FormControl(null);
  htmlFile = new FormControl(null);
  // Approve = new FormControl(null, Validators.required);

  // ? progress
  Spinner = false;

  // ? Email
  SendEmailApproved: any;
  SendEmailUser: any;

  SendRejectUser: any;

  // ?file
  FileReportName: any;


  // ?upload file
  file: any;
  tempFile: any = [];
  tempFileName: any = [];
  tempFileTotal: number = 0;
  inputFile = new FormControl(null);


  // ? comment
  CommentLists: any = [];

  // ? Analysis form
  AnalysisForm = new FormGroup({
    _id: new FormControl('', Validators.required),
    causeOfDefect: new FormControl('', Validators.required),
    sourceOfDefect: new FormControl('', Validators.required),
    analysisLevel: new FormControl('', Validators.required),
    canAnalysis: new FormControl('', Validators.required),
    relatedToESD: new FormControl('', Validators.required),
    result: new FormControl('', Validators.required),
  })


  get AnalysisFormControl() {
    return this.AnalysisForm.controls
  }


  // ? master
  SourceList: any
  AnalysisLevelList: any
  CauseList: any
  TreatmentList: any

  constructor(
    // private api: ProgressForm5Service,
    // private api: ViewFormService,
    private modalService: NgbModal,
    private api: HttpService,
    private route: Router
    // private api: RequestServiceService,
    // private us: UserService
  ) { }

  ngOnInit(): void {
    this.CheckStatusUser();
    this.getForm();
    this.GetResult();
    this.GetListAll()
  }

  CheckStatusUser() {
    let LevelList = [];
    LevelList.push(sessionStorage.getItem('UserLevel1'))
    LevelList.push(sessionStorage.getItem('UserLevel2'))
    LevelList.push(sessionStorage.getItem('UserLevel3'))
    LevelList.push(sessionStorage.getItem('UserLevel4'))
    LevelList.push(sessionStorage.getItem('UserLevel5'))
    LevelList.push(sessionStorage.getItem('UserLevel6'))
    const Level = LevelList.filter(lvl => (lvl == '6') || (lvl == '0'))
    // console.log(Level.length);

    if (Level.length == 0) {
      // alert("No access!!");
      // location.href = "#/manageForm"
      this.route.navigate(['/manageForm'])
    }
  }

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

  // ? API
  getForm() {
    let d = sessionStorage.getItem('FormId');
    this.api.FindFormById(d).subscribe((data: any) => {
      if (data) {
        this.form = data;
        this.FileList = data.files;
        // this.SetPathFile();
        let str = this.form.issuedDate.split("T");
        let str2 = this.form.replyDate.split("T");
        this.form.issuedDate = str[0];
        this.form.replyDate = str2[0];
        this.GetUser();
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
        let str3 = this.result.finishAnalyzeDate.split("T");
        this.result.startAnalyzeDate = str[0];
        this.result.finishAnalyzeDate = str2[0];
        this.result.finishReportDate = str3[0];

        this.AnalysisForm.setValue({
          _id: this.result._id,
          causeOfDefect: this.result.causeOfDefect || '',
          result: this.result.result || '',
          sourceOfDefect: this.result.sourceOfDefect || '',
          analysisLevel: this.result.analysisLevel || '',
          canAnalysis: this.result.canAnalysis || '',
          relatedToESD: this.result.relatedToESD || ''
        })


        this.tempFile = this.result.files
        // this.FileReportName = (this.result.file.split('/'))[5]
        this.FileReportName = this.result.file ? (this.result.file.split('/'))[5] : []

        // this.FileReportName = (this.result.file.split('/'))[6]

      } else this.result = null;
    })
  }

  GetUser() {
    this.api.GetUserAll().subscribe((data: any) => {
      if (data.length > 0) {
        const user = data.filter(d => d._id == this.form.requesterId);
        this.Approve = user[0];

      }
    })
  }
  GetListAll() {
    this.api.GetListAll().subscribe((data: any) => {
      if (data.length > 0) {
        this.SourceList = data.filter((i: any) => i.nameMaster == environment.Source);
        this.AnalysisLevelList = data.filter((i: any) => i.nameMaster == environment.AnalysisLevel);
        this.CauseList = data.filter((i: any) => i.nameMaster == environment.Cause);
        this.TreatmentList = data.filter((i: any) => i.nameMaster == environment.TreatmentNG);
      }
    })
  }

  // ? Modal

  ModalNote(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  // ? EVENT

  async OnApprove() {

    const ans = confirm("Do you want to Approve")
    if (ans == true) {
      this.Spinner = true;
      try {
        await this.onUpdateResult()

        // ? find mail in section
        const SectionEmail = this.form.requestFormSectionName;
        let UserEmailList = [];
        this.api.GetUserBySectionName(SectionEmail).subscribe((data: any) => {
          if (data.length > 0) {
            const filterData = data.filter((item) => {
              if (item.Level1 == 1 || item.Level2 == 1 || item.Level3 == 1 || item.Level4 == 1 || item.Level5 == 1 || item.Level6 == 1) {
                return item
              } else if (item.Level1 == 2 || item.Level2 == 2 || item.Level3 == 2 || item.Level4 == 2 || item.Level5 == 2 || item.Level6 == 2) {
                return item
              }
            })

            filterData.forEach(i => {
              UserEmailList.push(i.Email)

            });
          }


          this.api.GetSectionByName(this.form.requestFormSectionName).subscribe((data: any) => {
            if (data.length > 0) {
              const temp1 = data.filter(item => item.view == 1)
              // console.log(temp1);

              const cc = temp1[0].cc
              cc.forEach(element => {
                UserEmailList.push(element.Email)
              });

              const uniqEmail = [...new Set(UserEmailList)];
              // console.log(uniqEmail);

              let ccNew = uniqEmail.filter(item => item != this.Approve.Email)
              // console.log(ccNew);
              // CCnew = ccNew;

              if (ccNew) {
                let d = {
                  issuedDate: this.form.issuedDate,
                  replyDate: this.form.replyDate,
                  status: 6,
                  userApprove: null,
                  userApproveName: null,
                  noteApprove6: this.NoteApprove.value,
                  noteNow: this.NoteApprove.value
                }

                let Fname = sessionStorage.getItem('UserFirstName')
                let Lname = sessionStorage.getItem('UserLastName')

                this.api.UpdateForm(sessionStorage.getItem('FormId'), d).subscribe((data: any) => {
                  if (data) {
                    const Content = "<p>To " + this.Approve.FirstName + " " + this.Approve.LastName + "</p><br>" +
                      "Analysis request was closed as  link:  <a href='http://10.200.90.152:8081/Analysis-Report/'>http://10.200.90.152:8081/Analysis-Report/</a><br><br>" +
                      "<p>From " + Fname + " " + Lname + "(AE Approval)</p>";
                    const sendMail = {
                      Content: Content,
                      To: this.Approve.Email,
                      Cc: ccNew,
                      Subject: "Analysis request was closed: " + this.form.requestNumber + " / Model  " + this.form.ktcModelNumber + " " + this.form.size + " " +
                        this.form.customer + " Lot no. " + this.form.pcLotNumber + " from" + this.form.occurAName + " " + this.form.occurBName + " =" + this.form.ngQuantity + "pcs."
                    }
                    this.api.SendEmailTo(sendMail).subscribe((data: any) => {
                      this.Spinner = false;
                      this.alertSuccess();
                      // location.href = "#/manageForm";
                      this.route.navigate(['/manageForm'])

                    })
                  }
                })
              }
            }
          })



        })
      } catch (error) {

      }

    }



  }

  onUpdateResult() {
    return new Promise((resolve, reject) => {
      this.api.UpdateResult(this.AnalysisFormControl._id.value, this.AnalysisForm.value).subscribe((res => {
        res ? resolve(true) : reject('error')
      }))
    })
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
            status: 6.4,
            noteNow: this.NoteReject.value,
            noteReject5: this.NoteReject.value,
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
                  let Fname = sessionStorage.getItem('UserFirstName')
                  let Lname = sessionStorage.getItem('UserLastName')
                  const Content = "<p>To " + this.SendRejectUser.FirstName + " " + this.SendRejectUser.LastName + "(AE Engineer)</p><br>" +
                    "AE Approval not approve report as  link : <a href='http://10.200.90.152:8081/Analysis-Report/'>http://10.200.90.152:8081/Analysis-Report/</a><br><br>" +
                    "<p>From " + Fname + " " + Lname + "(AE Approval)</p>";

                  const sendMail = {
                    Content: Content,
                    To: this.SendRejectUser.Email,
                    From: "<Analysis-System@kyocera.co.th>",
                    Subject: "AE Approval not approve report  : " + this.form.requestNumber + " / Model  " + this.form.ktcModelNumber + " " + this.form.size + " " +
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

      this.htmlFile.reset();




    })

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

}
