import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { HttpService } from 'app/service/http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-progress-form4',
  templateUrl: './progress-form4.component.html',
  styleUrls: ['./progress-form4.component.css', '../pagesStyle.css']
})
export class ProgressForm4Component implements OnInit {
  // ? params
  formId: any = null

  // ? API
  form: any;
  Result: any;
  ApproveList: any;


  // ? Normaly
  ApproveName: any;
  // FileListname: any;
  // PathListName: any = [];
  FileList: any = [];

  FileReportName: any;


  // ? Form Control
  NoteApprove = new FormControl(null);
  NoteReject = new FormControl(null);
  Approve = new FormControl(null, Validators.required);


  // ? Email
  SendEmailApproved: any;
  SendEmailUser: any;
  SendRejectUser: any;

  // ?file
  htmlFile = new FormControl(null)


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
    JudgementDefect: new FormControl('', Validators.required),
    Remark: new FormControl(''),

  })
  // get ResultDate() { return this.ResultForm.get('ResultDate') }

  get AnalysisFormControl() {
    return this.AnalysisForm.controls
  }

  // ? master
  SourceList: any
  AnalysisLevelList: any
  CauseList: any
  TreatmentList: any
  JudgementDefects: any = ["Latent", "Overlook", "Can't judgement", "Other"]

  constructor(
    private api: HttpService,
    // private api: ViewFormService,
    private modalService: NgbModal,
    private route: Router,
    private routerActive: ActivatedRoute
    // private api: RequestServiceService
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
    this.GetResult();
    this.GetListAll()
  }

  CheckStatusUser() {
    let LevelList = [];
    LevelList.push(localStorage.getItem('AR_UserLevel1'))
    LevelList.push(localStorage.getItem('AR_UserLevel2'))
    LevelList.push(localStorage.getItem('AR_UserLevel3'))
    LevelList.push(localStorage.getItem('AR_UserLevel4'))
    LevelList.push(localStorage.getItem('AR_UserLevel5'))
    LevelList.push(localStorage.getItem('AR_UserLevel6'))
    const Level = LevelList.filter(lvl => (lvl == '5') || (lvl == '0'))
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
    let d = this.formId
    this.api.FindFormById(d).subscribe((data: any) => {
      if (data) {
        this.form = data;

        this.FileList = data.files;
        // this.SetPathFile();
        let str = this.form.issuedDate.split("T");
        let str2 = this.form.replyDate.split("T");
        this.form.issuedDate = str[0];
        this.form.replyDate = str2[0];
        this.GetApproveList();
      } else this.form = null;
    })
  }

  GetResult() {
    let d = this.formId
    this.api.FindResultByFormIdMain(d).subscribe((data: any) => {
      if (data) {
        this.Result = data[0];
        let str = this.Result.startAnalyzeDate.split("T");
        let str2 = this.Result.finishAnalyzeDate.split("T");
        let str3 = this.Result.finishReportDate.split("T");
        this.Result.startAnalyzeDate = str[0];
        this.Result.finishAnalyzeDate = str2[0];
        this.Result.finishReportDate = str3[0];
        this.tempFile = this.Result.files

        // this.FileReportName = (this.result.file.split('/'))[6]
        this.FileReportName = this.Result.file ? (this.Result.file.split('/'))[5] : []

        this.AnalysisForm.setValue({
          _id: this.Result._id,
          causeOfDefect: this.Result.causeOfDefect || '',
          result: this.Result.result || '',
          sourceOfDefect: this.Result.sourceOfDefect || '',
          analysisLevel: this.Result.analysisLevel || '',
          canAnalysis: this.Result.canAnalysis || '',
          relatedToESD: this.Result.relatedToESD || '',
          JudgementDefect: this.form.JudgementDefect || '',
          Remark: this.form.Remark || ''
        })


      } else this.Result = null;
    })
  }

  GetApproveList() {
    this.api.GetUserByItemLevel(this.form.requestItem, 6).subscribe((data: any) => {
      if (data.length > 0) {
        this.ApproveList = data;
        // if (data.length == 1) {
        //   this.Approve.setValue(data[0]._id);
        //   this.OnApproveChange();
        // }
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
        noteApprove5: this.NoteApprove.value,
        noteNow: this.NoteApprove.value,
        JudgementDefect: this.AnalysisForm.value.JudgementDefect,
        Remark: this.AnalysisForm.value.Remark
      }
      console.log(d);

      let Fname = localStorage.getItem('AR_UserFirstName')
      let Lname = localStorage.getItem('AR_UserLastName')

      this.api.UpdateForm(this.formId, d).subscribe(async (data: any) => {

        if (data) {

          try {
            await this.onUpdateAnalysisResult(this.AnalysisForm.value)
            const Content = "<p>To " + this.SendEmailUser.FirstName + " " + this.SendEmailUser.LastName + "(AE Approval)</p><br>" +
              "Please approve analysis report as  link : <a href='http://10.200.90.152:8081/Analysis-Report/'>http://10.200.90.152:8081/Analysis-Report/</a><br><br>" +
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
          } catch (error) {

          }



        }

      })
    }

  }

  onUpdateAnalysisResult(analysisForm) {
    return new Promise((resolve, reject) => {
      this.api.UpdateResult(analysisForm._id, analysisForm).subscribe(res => {
        res ? resolve(true) : reject('error update')
      })
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
            status: 5.4,
            noteNow: this.NoteReject.value,
            noteReject4: this.NoteReject.value,
            userApprove: this.form.userApprove3,
            userApproveName: sum,
            JudgementDefect: this.AnalysisForm.value.JudgementDefect,
            Remark: this.AnalysisForm.value.Remark
          }
          // console.log("reject data", d);
          let id = this.formId
          this.api.UpadateRequestForm(id, d).subscribe((data: any) => {
            if (data) {
              this.api.GetUser(d.userApprove).subscribe((data: any) => {
                if (data.length > 0) {
                  this.SendRejectUser = data[0];
                  // console.log(this.SendRejectUser);
                  let Fname = localStorage.getItem('AR_UserFirstName')
                  let Lname = localStorage.getItem('AR_UserLastName')
                  const Content = "<p>To " + this.SendRejectUser.FirstName + " " + this.SendRejectUser.LastName + "(AE Engineer)</p><br>" +
                    "AE Reviewer not approve report as  link : <a href='http://10.200.90.152:8081/Analysis-Report/'>http://10.200.90.152:8081/Analysis-Report/</a><br><br>" +
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
      this.Approve.value == item._id ? this.SendEmailUser = item : false
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
