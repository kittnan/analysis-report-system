import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment'
import Swal from 'sweetalert2'

// import { saveAs } from 'file-saver';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs'
// import * as ExcelJS from 'exceljs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'app/service/http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-progress-form3',
  templateUrl: './progress-form3.component.html',
  styleUrls: ['./progress-form3.component.css', '../pagesStyle.css'],
  // styleUrls: ['../pagesStyle.css']

})
export class ProgressForm3Component implements OnInit {
  constructor(
    private api: HttpService,
    // private api: ViewFormService,
    private modalService: NgbModal,
    private route: Router,
    private routerActive: ActivatedRoute
    // private api: RejectForm2Service
  ) {
    this.routerActive.queryParams.subscribe((param: Params) => {
      if (param) {
        this.formId = param['formId']
      }
    })
  }

  // ? Params
  formId: null | string = null

  // ? API
  form: any;
  SourceList: any;
  AnalysisLevelList: any;
  CauseList: any;
  ApproveList: any;
  ResultAPi: any;
  Users: any;
  TreatmentList: any;
  Report: any;

  // ? Form Control
  ResultForm = new FormGroup({
    AnalyzeDate: new FormControl(null, Validators.required),
    ResultDate: new FormControl(null, Validators.required),
    ReportDate: new FormControl(null, Validators.required),
    Result: new FormControl(null, Validators.required),
    SourceOfDefect: new FormControl(null, Validators.required),
    CategoryCause: new FormControl(null, Validators.required),
    AnalysisLevel: new FormControl(null, Validators.required),
    CanAnalysis: new FormControl(null, Validators.required),
    RelatedToESD: new FormControl(null, Validators.required),
    ReportNo: new FormControl(null, Validators.required),
    Approve: new FormControl(null, Validators.required),
    File: new FormControl(null),
    TempCause: new FormControl(null),
    htmlReport: new FormControl(null),
    JudgementDefect: new FormControl(null, Validators.required),
    Remark: new FormControl(null),
  })

  TreatmentOfNg = new FormControl(null, Validators.required);
  // GenItemName = new FormControl(null, Validators.required);

  NoteReject = new FormControl(null);
  NoteApprove = new FormControl(null);


  // ? Variable Normal
  ApproveName: any;
  // FileListname: any;
  // PathListName: any = [];
  FileList: any = [];

  // ? Fix Id
  SourceId = environment.IdSource;
  AnalysisLevelId = environment.IdAnalysisLevel;
  CauseId = environment.IdCause;

  optionYear: any = { year: '2-digit' }
  year2dit: any;
  dateToDay: any = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  };

  minDateFinishAnalysisDate: any

  // ? filter dropdown
  CauseToggle = false;
  CauseFilter = [];

  // ? Email
  SendEmailApproved: any;
  SendEmailUser: any;

  SendRejectUser: any;

  // ? upload report
  // FileReportName: any;
  FileReportPath: any;
  FileReport: any;

  tempFileReportName: any = "No Report";
  tempEngFile: any = []


  // ? toggle
  toggleAttFileEng = false;
  toggleAttReportEng = false;

  // ? Base64
  imageBase64_1: any;
  imageBase64_2: any;

  JudgementDefects: any = ["Latent", "Overlook", "Can't judgement", "Other"]

  wordAZ = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
  ReportList: any = [];

  // ?upload file
  file: any;
  tempFile: any = [];
  tempFileName: any = [];
  tempFileTotal: number = 0;
  tempFileENGTotal: number = 0;
  inputFile = new FormControl(null);

  SelectMDL = new FormControl(null, Validators.required);
  // pathFile = [];


  // ? comment
  CommentLists: any = [];

  async ngOnInit(): Promise<void> {
    this.CheckStatusUser();
    this.getForm();
    this.GetListAll()
    this.getReportList();
  }



  CheckStatusUser() {
    let LevelList = [];
    LevelList.push(localStorage.getItem('AR_UserLevel1'))
    LevelList.push(localStorage.getItem('AR_UserLevel2'))
    LevelList.push(localStorage.getItem('AR_UserLevel3'))
    LevelList.push(localStorage.getItem('AR_UserLevel4'))
    LevelList.push(localStorage.getItem('AR_UserLevel5'))
    LevelList.push(localStorage.getItem('AR_UserLevel6'))
    const Level = LevelList.filter(lvl => (lvl == '4') || (lvl == '0'))
    // console.log(Level.length);

    if (Level.length == 0) {
      // alert("No access!!");
      // this.route.navigate(['/manageForm'])
      // location.href = "#/manageForm"
    }

  }

  // ? API
  getForm() {

    this.api.FindFormById(this.formId).subscribe((data: any) => {
      if (data) {
        data.judgementDefect ? this.JudgementDefect.setValue(data.judgementDefect) : null
        data.remark ? this.Remark.setValue(data.remark) : null
        this.form = data;
        this.FileList = data.files;
        // this.SetPathFile();
        let str = this.form.issuedDate.split("T");
        let str2 = this.form.replyDate.split("T");
        this.form.issuedDate = str[0];
        this.form.replyDate = str2[0];
        this.GetUsers(this.form.requesterId);


        // ! find result from formId
        this.api.FindResultByFormIdMain(this.formId).subscribe((data: any) => {
          // todo have result
          if (data.length > 0) {
            const result = data[0]

            this.ResultAPi = result
            const dateResultStart = result.startAnalyzeDate ? (result.startAnalyzeDate.split("T"))[0] : null
            const dateResultEnd = result.finishAnalyzeDate ? (result.finishAnalyzeDate.split("T"))[0] : null
            const dateReport = result.finishReportDate ? (result.finishReportDate.split("T"))[0] : null
            dateResultStart ? this.AnalyzeDate.setValue(dateResultStart) : false
            dateResultEnd ? this.ResultDate.setValue(dateResultEnd) : false
            dateReport ? this.ReportDate.setValue(dateReport) : false


            result.result ? this.Result.setValue(result.result) : null
            result.sourceOfDefect ? this.SourceOfDefect.setValue(result.sourceOfDefect) : null

            result.causeOfDefect ? this.CategoryCause.setValue(result.causeOfDefect) : null
            result.analysisLevel ? this.AnalysisLevel.setValue(result.analysisLevel) : null
            result.canAnalysis ? this.CanAnalysis.setValue(result.canAnalysis) : null
            result.relatedToESD ? this.RelatedToESD.setValue(result.relatedToESD) : null
            result.analysisReportNo ? this.ReportNo.setValue(result.analysisReportNo) : null
            result.treatMent ? this.TreatmentOfNg.setValue(result.treatMent) : null

            this.File.setValue(result.file);
            // result.file ? this.tempFileReport = (result.file).split('/')[6] : false
            // * เก็บชื่อReport ไฟล์
            result.file ? this.tempFileReportName = (result.file).split('/')[5] : false
            result.file ? this.toggleAttReportEng = true : false

            // * เก็บ obj files
            result.files ? this.tempEngFile = result.files : false
            result.files.length > 0 ? this.toggleAttFileEng = true : false
            // * ผลรวม size files
            result.files.forEach(element => {
              this.tempFileENGTotal += Number(element.size)
            });

            // * set min date of finish analysis date
            var today = new Date();
            var before2Day: any = new Date();
            before2Day.setDate(today.getDate() - 2)
            var dateString = new Date(before2Day.getTime() - (before2Day.getTimezoneOffset() * 60000))
              .toISOString()
              .split("T")[0];
            this.minDateFinishAnalysisDate = dateString
            this.GetApproveList();
            this.GetCause();


          }
          // todo no result
          else {
            this.SetAnalysisNo();
            this.GetApproveList();
            this.GetCause();

          }
        })



      } else this.form = null;

    })


  }

  GetListAll() {
    this.api.GetListAll().subscribe((data: any) => {

      if (data.length > 0) {
        this.SourceList = data.filter((i: any) => i.nameMaster == environment.Source);
        this.AnalysisLevelList = data.filter((i: any) => i.nameMaster == environment.AnalysisLevel);
        this.CauseList = data.filter((i: any) => i.nameMaster == environment.Cause);
        this.TreatmentList = data.filter((i: any) => i.nameMaster == environment.TreatmentNG);
        // console.log(this.CauseList);

      }
    })
  }

  GetCause() {
    let d = {
      idMaster: this.CauseId,
      nameModel: this.form.requestItem
    }

    this.api.GetCause(d).subscribe((data: any) => {
      if (data.length > 0) {
        this.CauseList = data;
        this.CauseFilter = data;
      } else {
        this.CauseList = [];
      }
    })
  }

  GetApproveList() {
    this.api.GetUserByItemLevel(this.form.requestItem, 5).subscribe((data: any) => {
      if (data.length > 0) {
        this.ApproveList = data;
      }

    })
  }

  GetUsers(id: any) {
    this.api.GetUser(id).subscribe((data: any) => {
      if (data.length > 0) {
        this.Users = data[0]
      } else {
        this.Users = null;
      }
    })
  }

  getReportList() {
    this.api.GetReportList().then((data: any) => {
      if (data.length > 0) {
        this.Report = data;
        // console.log(data);

      } else {
        this.Report = null;
      }
    })
  }



  SetAnalysisNo() {
    // let old = "21-T2-0001P";
    this.year2dit = new Date().toLocaleDateString("en-US", this.optionYear);
    let key = this.year2dit + "-";
    let id = this.form.requestItemId;

    let s = this.form.requestNumber;
    let s1 = s.split("");

    this.api.GetResult(key, id).subscribe((data: any) => {
      if (data.length > 0) {
        // console.log("result", data);
        let str = data[0].analysisReportNo.split("-");
        let str2 = str[2].split("");
        let str3 = str2[0] + str2[1] + str2[2] + str2[3];
        let num = Number(str3);
        let num2 = num + 1;
        let str4 = String(num2);

        let str5 = ""
        if (str4.length == 1) {
          str5 = "000" + str4
        }
        if (str4.length == 2) {
          str5 = "00" + str4
        }
        if (str4.length == 3) {
          str5 = "0" + str4
        }
        let sum = this.year2dit + '-T2-' + str5 + s1[0];
        this.ReportNo.setValue(sum);
        // console.log(this.ReportNo.value);
      } else {
        let sum = this.year2dit + '-T2-' + '0001' + s1[0];
        this.ReportNo.setValue(sum);
        // console.log(this.ReportNo.value);
      }


    })


  }

  ToggleCauseFilter() {
    this.CauseToggle = !this.CauseToggle;
  }

  FilterCause() {
    this.CauseFilter = this.CauseList.filter(
      item => item.name.toLowerCase().includes(this.CategoryCause.value.toLowerCase())
    );
  }
  SetCause() {
    this.CategoryCause.setValue(this.TempCause.value);
  }

  SetApproveEmail() {
    this.ApproveList.forEach(item => {
      this.Approve.value == item._id ? this.SendEmailUser = item : false
    });
  }


  // ? EVENT

  OnApproveChange() {
    this.ApproveList.forEach(i => {
      if (this.Approve.value == i._id) {
        let Fname = i.FirstName;
        let Lname = i.LastName;
        let str = Lname.substring(0, 1);
        this.ApproveName = Fname + " " + str + ".";
        // console.log(this.ApproveName);
        this.SetApproveEmail();
      }
    });
  }

  onSaveResult() {
    Swal.fire({
      title: 'Do you want to save ?',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then(async answer => {
      if (answer.isConfirmed) {
        const resultCheck: any = await this.checkResult(this.formId)
        if (resultCheck.length == 0) {
          const res: any = await this.insertResultWhenFinish(this.formId)
          if (res.length != 0) {
            this.alertSuccess()
          } else {
            Swal.fire({
              title: 'error',
              icon: 'error',
              showConfirmButton: true
            })
          }

        } else {
          const res = await this.updateResultWhenDraft(resultCheck[0]._id)
          // console.log(res);
          if (res) {
            this.alertSuccess()
            // setTimeout(() => {
            //   window.self.close();
            // }, 2000);
          }


        }

      }
    })
  }

  checkResult(formId: string) {
    return new Promise(resolve => {
      this.api.FindResultByFormIdMain(formId).subscribe((data: any) => {
        resolve(data)
      })
    })
  }

  insertResultWhenFinish(formId: string) {

    return new Promise(async resolve => {
      const ResultData = {
        analysisReportNo: this.ReportNo.value,
        formId: formId,
        engineerId: localStorage.getItem('AR_UserId'),
        engineerName: (localStorage.getItem('AR_UserFirstName') + "-" + localStorage.getItem('AR_UserLastName')),
        result: this.Result.value || null,
        causeOfDefect: this.CategoryCause.value || null,
        sourceOfDefect: this.SourceOfDefect.value || null,
        analysisLevel: this.AnalysisLevel.value || null,
        canAnalysis: this.CanAnalysis.value || null,
        relatedToESD: this.RelatedToESD.value || null,
        startAnalyzeDate: this.AnalyzeDate.value || null,
        finishAnalyzeDate: this.ResultDate.value || null,
        finishReportDate: this.ReportDate.value || null,
        requestItemId: this.form.requestItemId || null,
        requestItemName: this.form.requestItem || null,
        treatMent: this.TreatmentOfNg.value || null,
      }
      this.api.PostResult(ResultData).subscribe((data: any) => {
        resolve(data)
      })
    })
  }

  updateResultWhenDraft(resultId: string) {
    return new Promise(resolve => {
      const ResultData = {
        result: this.Result.value || null,
        causeOfDefect: this.CategoryCause.value || null,
        sourceOfDefect: this.SourceOfDefect.value || null,
        analysisLevel: this.AnalysisLevel.value || null,
        canAnalysis: this.CanAnalysis.value || null,
        relatedToESD: this.RelatedToESD.value || null,
        startAnalyzeDate: this.AnalyzeDate.value || null,
        finishAnalyzeDate: this.ResultDate.value || null,
        finishReportDate: this.ReportDate.value || null,
        treatMent: this.TreatmentOfNg.value || null,
      }
      this.api.UpdateResult(resultId, ResultData).subscribe((data: any) => {
        resolve(data)
      })
    })
  }



  async onSubmit() {
    try {
      if (this.toggleAttFileEng == false) {
        await this.loopUploadFiles();
      }
      if (this.toggleAttReportEng == false) {
        await this.uploadReport();
      }
    } catch (error) {
      console.error(error);
    } finally {
    await this.ResultSubmit();
    }
  }

  async loopUploadFiles() {

    this.tempFile.forEach(file => {
      const fileName = `${this.form.requestNumber}@${file.name}`
      this.api.UploadFileEng(file, fileName).then((data) => {
        if (data) {
          const name = (data.toString()).split('/')
          const path = {
            path: data,
            // name: name[6],
            // name: name[5],
            name: fileName,
            size: file.size
          }
          this.tempEngFile.push(path)
        }
      })
    });

    // const b = await this.uploadReport();

  }

  async uploadReport() {
    let all = new FormData();
    all.append('File', this.FileReport, this.FileReport.name)
    await this.api.uploadReport2(all).then(async (data: any) => {
      this.FileReportPath = await data
      // console.log(this.FileReportPath);

    })
  }
  // ResultForm = new FormGroup({
  //   AnalyzeDate: new FormControl(null, Validators.required),
  //   ResultDate: new FormControl(null, Validators.required),
  //   ReportDate: new FormControl(null, Validators.required),
  //   Result: new FormControl(null, Validators.required),
  //   SourceOfDefect: new FormControl(null, Validators.required),
  //   CategoryCause: new FormControl(null, Validators.required),
  //   AnalysisLevel: new FormControl(null, Validators.required),
  //   CanAnalysis: new FormControl(null, Validators.required),
  //   RelatedToESD: new FormControl(null, Validators.required),
  //   ReportNo: new FormControl(null, Validators.required),
  //   Approve: new FormControl(null, Validators.required),
  //   File: new FormControl(null),
  //   TempCause: new FormControl(null),
  //   htmlReport: new FormControl(null),
  //   JudgementDefect: new FormControl(null, Validators.required),
  //   Remark: new FormControl(null),
  // })

  async ResultSubmit() {
    this.FileReportPath ? false : this.FileReportPath = this.File.value
    // console.log(this.FileReportPath);
    // console.log(this.tempEngFile);

    let ResultData = null
    const ans = confirm("Do you want to Approve ?")
    if (ans == true) {
      ResultData = {
        analysisReportNo: this.ReportNo.value,
        formId: this.formId,
        engineerId: localStorage.getItem('AR_UserId'),
        engineerName: (localStorage.getItem('AR_UserFirstName') + "-" + localStorage.getItem('AR_UserLastName')),
        result: this.Result.value,
        causeOfDefect: this.CategoryCause.value,
        sourceOfDefect: this.SourceOfDefect.value,
        analysisLevel: this.AnalysisLevel.value,
        canAnalysis: this.CanAnalysis.value,
        relatedToESD: this.RelatedToESD.value,
        startAnalyzeDate: this.AnalyzeDate.value,
        finishAnalyzeDate: this.ResultDate.value,
        finishReportDate: this.ReportDate.value,
        requestItemId: this.form.requestItemId,
        requestItemName: this.form.requestItem,
        treatMent: this.TreatmentOfNg.value,
        file: this.FileReportPath,
        files: this.tempEngFile,
        judgementDefect: this.JudgementDefect.value,
        remark: this.Remark.value,
      }

      // console.log(this.SendEmailUser.FirstName);






      this.api.FindResultByFormIdMain(this.form._id).subscribe((data: any) => {
        if (data.length > 0) {
          // ? Update Result
          this.api.UpdateResult(data[0]._id, ResultData).subscribe((data: any) => {
            if (data) {

              const d = {
                issuedDate: this.form.issuedDate,
                replyDate: this.form.replyDate,
                status: 4,
                userApprove4: this.Approve.value,
                userApprove4Name: this.ApproveName,
                userApprove: this.Approve.value,
                userApproveName: this.ApproveName,
                noteNow: this.NoteApprove.value,
                noteApprove4: this.NoteApprove.value,
                judgementDefect: this.JudgementDefect.value,
                remark: this.Remark.value,
              }
              this.api.UpdateForm(this.formId, d).subscribe((data: any) => {
                let Fname = localStorage.getItem('AR_UserFirstName')
                let Lname = localStorage.getItem('AR_UserLastName')
                if (data) {
                  const Content = "<p>To " + this.SendEmailUser.FirstName + " " + this.SendEmailUser.LastName + "(AE Reviewer)</p><br>" +
                    "Please review analysis report as  link : <a href='http://10.200.90.152:8081/Analysis-Report/'>http://10.200.90.152:8081/Analysis-Report/</a><br><br>" + "<p>From " + Fname + " " + Lname + "(AE Engineer)</p>";

                  const sendMail = {
                    Content: Content,
                    To: this.SendEmailUser.Email,
                    From: "<Analysis-System@kyocera.co.th>",
                    Subject: "Please review analysis report  : " + this.form.requestNumber + " / Model  " + this.form.ktcModelNumber + " " + this.form.size + " " +
                      this.form.customer + " Lot no. " + this.form.pcLotNumber + " from" + this.form.occurAName + " " + this.form.occurBName + " =" + this.form.ngQuantity + "pcs."
                  }
                  this.api.SendEmailTo(sendMail).subscribe((data: any) => {
                    this.alertSuccess();
                    setTimeout(() => {
                      window.self.close();
                    }, 2000);
                  })

                }

              })

            }
          })


        } else {

          // ? Post Result
          this.api.PostResult(ResultData).subscribe((data: any) => {
            if (data.length > 0) {
              const d = {
                issuedDate: this.form.issuedDate,
                replyDate: this.form.replyDate,
                status: 4,
                userApprove4: this.Approve.value,
                userApprove4Name: this.ApproveName,
                userApprove: this.Approve.value,
                userApproveName: this.ApproveName,
                noteNow: this.NoteApprove.value,
                noteApprove4: this.NoteApprove.value,
                judgementDefect: this.JudgementDefect.value,
                remark: this.Remark.value,
              }
              // console.log("form",d);

              this.api.UpdateForm(this.formId, d).subscribe((data: any) => {
                let Fname = localStorage.getItem('AR_UserFirstName')
                let Lname = localStorage.getItem('AR_UserLastName')
                if (data) {
                  const Content = "<p>To " + this.SendEmailUser.FirstName + " " + this.SendEmailUser.LastName + "(AE Reviewer)</p><br>" +
                    "Please review analysis report as  link : <a href='http://10.200.90.152:8081/Analysis-Report/'>http://10.200.90.152:8081/Analysis-Report/</a><br><br>" + "<p>From " + Fname + " " + Lname + "(AE Engineer)</p>";

                  const sendMail = {
                    Content: Content,
                    To: this.SendEmailUser.Email,
                    From: "<Analysis-System@kyocera.co.th>",
                    Subject: "Please review analysis report  : " + this.form.requestNumber + " / Model  " + this.form.ktcModelNumber + " " + this.form.size + " " +
                      this.form.customer + " Lot no. " + this.form.pcLotNumber + " from" + this.form.occurAName + " " + this.form.occurBName + " =" + this.form.ngQuantity + "pcs."
                  }
                  this.api.SendEmailTo(sendMail).subscribe((data: any) => {
                    this.alertSuccess();
                    setTimeout(() => {
                      window.self.close();
                    }, 2000);
                  })

                }

              })
            }
          })

        }
      })

    }

  }

  OnReject() {
    const ans = confirm("Do you want to Reject ?")
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
            replyDate: this.form.replyDate,
            status: 4.3,
            noteNow: this.NoteReject.value,
            noteReject3: this.NoteReject.value,
            userApprove: this.form.userApprove2,
            userApproveName: this.form.userApprove2Name,
            judgementDefect: this.JudgementDefect.value,
            remark: this.Remark.value,
          }
          // console.log("reject data", d);
          this.api.UpadateRequestForm(this.formId, d).subscribe((data: any) => {
            if (data) {
              this.api.GetUser(d.userApprove).subscribe((data: any) => {
                if (data.length > 0) {
                  this.SendRejectUser = data[0];
                  // console.log(this.SendRejectUser);
                  let Fname = localStorage.getItem('AR_UserFirstName')
                  let Lname = localStorage.getItem('AR_UserLastName')
                  const Content = "<p>To " + this.SendRejectUser.FirstName + " " + this.SendRejectUser.LastName + "(AE Window)</p><br>" +
                    "Analysis request not approve as  link : <a href='http://10.200.90.152:8081/Analysis-Report/'>http://10.200.90.152:8081/Analysis-Report/</a><br><br>" + "<p>From " + Fname + " " + Lname + "(AE Engineer)</p>";

                  const sendMail = {
                    Content: Content,
                    To: this.SendRejectUser.Email,
                    From: "<Analysis-System@kyocera.co.th>",
                    Subject: "Analysis request not approve  : " + this.form.requestNumber + " / Model  " + this.form.ktcModelNumber + " " + this.form.size + " " +
                      this.form.customer + " Lot no. " + this.form.pcLotNumber + " from" + this.form.occurAName + " " + this.form.occurBName + " =" + this.form.ngQuantity + "pcs."
                  }
                  this.api.SendEmailTo(sendMail).subscribe((data: any) => {
                    this.alertSuccess();
                    setTimeout(() => {
                      window.self.close();
                    }, 2000);
                  })
                }
              })

            }
          })
        }
      })
    }

  }


  attFilesENG(event: any) {
    Swal.fire({
      title: 'Do you want to Upload' + event.target.files[0].name + '?',
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: 'Upload',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.tempFile.filter(item => item.name == event.target.files[0].name).length == 0) {
          this.tempFileTotal += event.target.files[0].size;

          if (this.tempFileTotal < 31457280) {
            this.tempFile.push(event.target.files[0]);
            // this.tempFileName.push(event.target.files[0].name);
            this.inputFile.reset();
            this.alertSuccess();
          } else {
            Swal.fire({
              title: 'Error',
              icon: 'error',
              text: 'Maximum total size.'
            })
            this.tempFileTotal -= event.target.files[0].size;
            this.inputFile.reset();
          }


        } else {
          Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'Duplicate file.'
          })
          this.inputFile.reset();

        }


      }
    })

  }

  onClickDeleteFile(event: any) {

    Swal.fire({
      title: 'Do you want to delete ? ',
      icon: 'error',
      text: `Delete ${event.name}`,
      confirmButtonText: 'Delete',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        const indexToRemove = this.tempFile.indexOf(event)
        if (indexToRemove >= 0) {
          this.tempFileTotal -= this.tempFile[indexToRemove].size;
          this.tempFile.splice(indexToRemove, 1)
          this.alertSuccess();
        }
      }
    })


    // const comData = new FormData()
    // comData.append('File', this.tempFile[0], 'a')
    // console.log(comData);

  }


  attReportFile(event) {

    Swal.fire({
      title: 'Do you want to Upload and Replace ?',
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: 'Upload',
    }).then((result) => {
      if (result.isConfirmed) {

        const file = event.target.files[0]
        let realFileName = this.form.requestNumber + '.xlsx'
        if (file.name == realFileName) {
          this.FileReport = file;
          this.tempFileReportName = file.name
          this.htmlReport.reset();
          this.alertSuccess();
        } else {
          this.htmlReport.reset();
          Swal.fire({
            icon: 'error',
            title: 'Wrong !!',
            text: 'File name or file type is not register',
          })

        }
      }
    })






  }

  uploadReportFileNow(event) {
    Swal.fire({
      title: 'Do you want to Upload and Replace ?',
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: 'Upload',
    }).then((result) => {
      if (result.isConfirmed) {
        const file = event.target.files[0]
        let realFileName;
        realFileName = this.form.requestNumber + '.xlsx'


        if (file.name == realFileName) {

          let ReportFile = new FormData();
          ReportFile.append('File', file, file.name)
          this.api.uploadReport2(ReportFile).then(async (data: any) => {
            await data
            const temp = {
              startAnalyzeDate: this.AnalyzeDate.value,
              finishAnalyzeDate: this.ResultDate.value,
              finishReportDate: this.ReportDate.value,
              file: data
            }

            this.api.UpdateResult(this.ResultAPi._id, temp).subscribe((data: any) => {
              if (data) {
                this.htmlReport.reset();
                this.alertSuccess();
                this.getForm();
              }
            })
          })

        } else {
          this.htmlReport.reset();
          Swal.fire({
            icon: 'error',
            title: 'Wrong !!',
            text: 'File name or file type is not register',
          })

        }
      }
    })
  }

  removeNow(event) {
    Swal.fire({
      title: 'Do you want to delete ? ',
      icon: 'error',
      text: `Delete ${event.name} (${event.size})`,
      confirmButtonText: 'Delete',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        const indexToRemove = this.tempEngFile.indexOf(event)
        if (indexToRemove >= 0) {
          this.tempFileENGTotal -= this.tempEngFile[indexToRemove].size;
          this.tempEngFile.splice(indexToRemove, 1)
          const data = {
            name: event.name
          }

          this.api.RemoveFileEng(data).then((res) => {
            if (res) {
              const data = {
                startAnalyzeDate: this.AnalyzeDate.value,
                finishAnalyzeDate: this.ResultDate.value,
                finishReportDate: this.ReportDate.value,
                files: this.tempEngFile
              }

              this.api.UpdateResult(this.ResultAPi._id, data).subscribe((data: any) => {
                if (data) {
                  this.inputFile.reset();
                  this.alertSuccess();
                }
              })
            }
          })

        }
      }
    })
  }
  uploadFileNow(event: any) {

    Swal.fire({
      title: 'Do you want to Upload' + event.target.files[0].name + '?',
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: 'Upload',
    }).then((result) => {
      if (result.isConfirmed) {
        const file = event.target.files[0]

        let CheckFileName = `${this.form.requestNumber}@${file.name}`
        // if ((this.form.requestNumber).includes('FM')) {
        //   const str1 = this.form.requestNumber.split(':');
        //   CheckFileName = `${str1[0]}_${str1[1]}@${file.name}`
        // } else {
        //   CheckFileName = `${this.form.requestNumber}@${file.name}`
        // }

        if (this.tempEngFile.filter(item => item.name == CheckFileName).length == 0) {
          this.tempFileENGTotal += file.size;
          if (this.tempFileENGTotal < 31457280) {
            // this.tempFile.push(file);
            // ! to upload file


            this.api.UploadFileEng(file, CheckFileName).then((data) => {
              if (data) {

                // const name = (data.toString()).split('/')
                const TempFile = {
                  path: data,
                  name: CheckFileName,
                  size: file.size
                }
                this.tempEngFile.push(TempFile);

                let tempData = {
                  startAnalyzeDate: this.AnalyzeDate.value,
                  finishAnalyzeDate: this.ResultDate.value,
                  finishReportDate: this.ReportDate.value,
                  files: this.tempEngFile
                }
                this.api.UpdateResult(this.ResultAPi._id, tempData).subscribe((data: any) => {
                  if (data) {
                    this.inputFile.reset();
                    this.alertSuccess();
                  }
                })

              }
            })

          } else {

            Swal.fire({
              title: 'Error',
              icon: 'error',
              text: 'Maximum total size.'
            })
            this.tempFileENGTotal -= file.size;
            this.inputFile.reset();
          }


        } else {
          Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'Duplicate file.'
          })
          this.inputFile.reset();

        }


      }
    })




  }

  onClickGenExcel() {
    if (this.AnalyzeDate.valid && this.ResultDate.valid && this.ReportDate.valid) {
      this.onGenReport();
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Please fill : start analyze date , finished analysis result date , finished analysis report date',
        icon: 'error'
      })
    }
  }
  onClickGenMDL(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  onGenReport() {
    // console.log(this.form.requestItem);

    this.setBase64();
    if ((this.form.requestItem).includes('PNL') || (this.form.requestItem).includes('SMT')) {
      this.genReportPNL();
      // alert("PNL")
    } else
      if ((this.form.requestItem).includes('MDL')) {
        this.genReportMDL();
        // alert("MDL")

      } else
        if ((this.form.requestItem) == "AMT") {
          this.genReportAMT();
          // alert("AMT")

        } else
          if ((this.form.requestItem).includes('FM')) {
            this.genReportFM();
            // alert("FM")

          }
  }

  calDiffDay(rawStart, rawEnd) {
    return new Promise(resolve => {
      const start = new Date(rawStart).getTime();
      const end = new Date(rawEnd).getTime();
      const result = Math.abs(start - end)
      let daysDifference = Math.floor(result / 1000 / 60 / 60 / 24);
      // console.log(daysDifference);
      daysDifference === 0 ? daysDifference = 1 : false
      resolve(daysDifference)
    })
  }
  async genReportPNL() {
    const model = this.Report.filter(i => i.modelName == this.form.requestItem);

    let defectiveList = [];
    let resultList = [];
    if (model.length != 0) {
      defectiveList = model[0].defective;
      resultList = model[0].result;
    }

    const workbook = new Workbook();
    let RequestNumber = this.form.requestNumber
    const worksheet = workbook.addWorksheet(RequestNumber, { views: [{ showGridLines: false }] });
    worksheet.columns = [
      { width: 1 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 1 },
    ];



    const imageId2 = workbook.addImage({
      base64: this.imageBase64_1,
      extension: 'png',
    });
    const imageId3 = workbook.addImage({
      base64: this.imageBase64_2,
      extension: 'png',
    });
    worksheet.addImage(imageId2, {
      tl: { col: 1, row: 1 },
      ext: { width: 230.4, height: 76.8 }
    });
    worksheet.addImage(imageId3, {
      tl: { col: 1, row: 6 },
      ext: { width: 291.84, height: 31.68 }
    });
    // worksheet.mergeCells('B1:F8')

    worksheet.getCell('K3').value = "Request Item"
    worksheet.getCell('K4').value = "Register number"
    worksheet.getCell('K5').value = "Requestor Issued date"
    worksheet.getCell('K6').value = "Request reply date"
    worksheet.getCell('K7').value = "Request from (Department-Section)"
    worksheet.getCell('K8').value = "Requestor"

    worksheet.getCell('Q3').value = this.form.requestItem
    worksheet.getCell('Q4').value = this.form.requestNumber
    worksheet.getCell('Q5').value = this.form.issuedDate
    worksheet.getCell('Q6').value = this.form.replyDate
    worksheet.getCell('Q7').value = this.form.requestFormSectionName
    worksheet.getCell('Q8').value = this.Users.FirstName + "-" + this.Users.LastName

    worksheet.getCell('B10').value = "1. Description:"
    worksheet.getCell('B12').value = "KTC model number"
    worksheet.getCell('B13').value = "Defective name"
    worksheet.getCell('B14').value = "PC lot number/CPR lot number"
    worksheet.getCell('B15').value = "Input Quantity (Pcs)"
    worksheet.getCell('B16').value = "NG Quantity (Pcs)"
    worksheet.getCell('B17').value = "Sent NG to Analysis (Pcs)"
    worksheet.getCell('B18').value = "Production phase"
    worksheet.getCell('B19').value = "Defect category"
    worksheet.getCell('B20').value = "Abnormal lot level"
    worksheet.getCell('B21').value = "Occur place"

    worksheet.getCell('H12').value = this.form.ktcModelNumber
    worksheet.getCell('H13').value = this.form.defectiveName
    worksheet.getCell('H14').value = this.form.pcLotNumber
    worksheet.getCell('H15').value = this.form.inputQuantity
    worksheet.getCell('H16').value = this.form.ngQuantity
    worksheet.getCell('H17').value = this.form.sendNgAnalysis
    worksheet.getCell('H18').value = this.form.productionPhase
    worksheet.getCell('H19').value = this.form.defectCatagory
    worksheet.getCell('H20').value = this.form.abnormalLotLevel
    worksheet.getCell('H21').value = this.form.occurBName


    // worksheet.getCell('O25').value = "All pattern"
    worksheet.getCell('B23').value = "2. Defective phenomenon:"
    for (let index = 0; index < 30; index++) {
      const c = "O"
      const point = index + 25;
      const sum = c + point
      worksheet.getCell(sum).value = defectiveList[index]

    }



    worksheet.getCell('B61').value = "3. Analysis result :"

    for (let index = 0; index < 30; index++) {
      const c = "B"
      const point = index + 63;
      const sum = c + point
      worksheet.getCell(sum).value = resultList[index]

      const c2 = "K"
      const sum2 = c2 + point
      worksheet.getCell(sum2).value = "N/A"
    }

    // alert("FM")
    worksheet.getCell('B94').value = "4. Conclusion :"
    worksheet.getCell('B114').value = "5. Comment (Request to take countermeasure) :"
    // worksheet.getCell('B121').value = "6.  Comment (Request to take countermeasure) :"

    worksheet.getCell('B128').value = "Start analyze date :"
    worksheet.getCell('B129').value = "Finished date :"
    worksheet.getCell('B130').value = "Total analyze days :"
    worksheet.getCell('B131').value = "Treatment of NG :"


    // const ReportDate: any = new Date(this.ReportDate.value)
    // const IssueDate: any = new Date(this.form.issuedDate)
    // const Range: any = ReportDate - IssueDate
    // const oneDay = 1000 * 60 * 60 * 24;
    // const diffDay = Math.round(Range / oneDay);
    const result_diffDay = await this.calDiffDay(this.AnalyzeDate.value, this.ResultDate.value)


    worksheet.getCell('F128').value = this.AnalyzeDate.value || null
    worksheet.getCell('F129').value = this.ResultDate.value || null
    worksheet.getCell('F130').value = result_diffDay + " Day"
    worksheet.getCell('F131').value = this.TreatmentOfNg.value || null

    worksheet.getCell('J135').value = "Issue"
    worksheet.getCell('M135').value = "Review"
    worksheet.getCell('P135').value = "Approve"

    worksheet.getCell('B137').value = "Page 1 / 2"

    worksheet.getCell('Q137').value = `AEF4040.AN REPORT ${model[0].modelName}-0`


    // ? ตีเส้น กรอบนอก
    this.setOutBorder(worksheet, 1, 136)


    // ? merge

    for (let index = 0; index < 30; index++) {
      const a = `O${index + 25}`
      const b = `T${index + 25}`
      const sum = `${a}:${b}`
      worksheet.mergeCells(sum)
      worksheet.getCell(a).border = {
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
        left: { style: 'thin' },
      };
    }
    this.setBorderTop(worksheet, 'C', 25)
    this.setBorderTop(worksheet, 'D', 25)
    this.setBorderTop(worksheet, 'E', 25)
    this.setBorderTop(worksheet, 'F', 25)
    this.setBorderTop(worksheet, 'G', 25)
    this.setBorderTop(worksheet, 'H', 25)
    this.setBorderTop(worksheet, 'I', 25)
    this.setBorderTop(worksheet, 'J', 25)
    this.setBorderTop(worksheet, 'K', 25)
    this.setBorderTop(worksheet, 'L', 25)
    this.setBorderTop(worksheet, 'M', 25)
    this.setBorderTop(worksheet, 'N', 25)

    this.setBorderBottom(worksheet, 'C', 54)
    this.setBorderBottom(worksheet, 'D', 54)
    this.setBorderBottom(worksheet, 'E', 54)
    this.setBorderBottom(worksheet, 'F', 54)
    this.setBorderBottom(worksheet, 'G', 54)
    this.setBorderBottom(worksheet, 'H', 54)
    this.setBorderBottom(worksheet, 'I', 54)
    this.setBorderBottom(worksheet, 'J', 54)
    this.setBorderBottom(worksheet, 'K', 54)
    this.setBorderBottom(worksheet, 'L', 54)
    this.setBorderBottom(worksheet, 'M', 54)
    this.setBorderBottom(worksheet, 'N', 54)

    this.setBorderLeft2(worksheet, 'B', 26, 53)

    this.setBorderLB(worksheet, 'B', 54)
    this.setBorderRB(worksheet, 'N', 54)
    this.setBorderLT(worksheet, 'B', 25)
    this.setBorderRT(worksheet, 'N', 25)






    this.setBorderBox(worksheet, 63, 92)
    this.setBorderBox(worksheet, 96, 112)
    this.setBorderBox(worksheet, 116, 119)
    // this.setBorderBox(worksheet, 123, 126)

    // this.setOutBorder(worksheet,1,137)


    worksheet.mergeCells('J133:L134')
    worksheet.mergeCells('M133:O134')
    worksheet.mergeCells('P133:R134')

    worksheet.mergeCells('J135:L135')
    worksheet.mergeCells('M135:O135')
    worksheet.mergeCells('P135:R135')

    this.setBorderAll(worksheet, 'J', 133)
    this.setBorderAll(worksheet, 'M', 133)
    this.setBorderAll(worksheet, 'P', 133)

    this.setBorderAll(worksheet, 'J', 135)
    this.setBorderAll(worksheet, 'M', 135)
    this.setBorderAll(worksheet, 'P', 135)

    // ?จัดกึ่งกลาง
    worksheet.getCell('B55').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B57').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B58').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B59').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('E55').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('I55').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('E56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('H56').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('I56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('J56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('L56').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('M56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('N56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('P56').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('Q56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('R56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('T56').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('J135').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('N135').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('P135').alignment = { vertical: 'middle', horizontal: 'center' };




    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const fileName = RequestNumber + ".xlsx";
      fs.saveAs(blob, fileName)
    })
  }

  async genReportAMT() {
    const model = this.Report.filter(i => i.modelName == this.form.requestItem);
    let defectiveList = [];
    let resultList = [];
    if (model.length != 0) {
      defectiveList = model[0].defective;
      resultList = model[0].result;
    }

    const workbook = new Workbook();
    let RequestNumber = this.form.requestNumber
    const worksheet = workbook.addWorksheet(RequestNumber, { views: [{ showGridLines: false }] });
    worksheet.columns = [
      { width: 1 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 1 },
    ];



    const imageId2 = workbook.addImage({
      base64: this.imageBase64_1,
      extension: 'png',
    });
    const imageId3 = workbook.addImage({
      base64: this.imageBase64_2,
      extension: 'png',
    });
    worksheet.addImage(imageId2, {
      tl: { col: 1, row: 1 },
      ext: { width: 230.4, height: 76.8 }
    });
    worksheet.addImage(imageId3, {
      tl: { col: 1, row: 6 },
      ext: { width: 291.84, height: 31.68 }
    });
    // worksheet.mergeCells('B1:F8')

    worksheet.getCell('K3').value = "Request Item"
    worksheet.getCell('K4').value = "Register number"
    worksheet.getCell('K5').value = "Requestor Issued date"
    worksheet.getCell('K6').value = "Request reply date"
    worksheet.getCell('K7').value = "Request from (Department-Section)"
    worksheet.getCell('K8').value = "Requestor"

    worksheet.getCell('Q3').value = this.form.requestItem
    worksheet.getCell('Q4').value = this.form.requestNumber
    worksheet.getCell('Q5').value = this.form.issuedDate
    worksheet.getCell('Q6').value = this.form.replyDate
    worksheet.getCell('Q7').value = this.form.requestFormSectionName
    worksheet.getCell('Q8').value = this.Users.FirstName + "-" + this.Users.LastName

    worksheet.getCell('B10').value = "1. Description:"
    worksheet.getCell('B12').value = "KTC model number"
    worksheet.getCell('B13').value = "Defective name"
    worksheet.getCell('B14').value = "PC lot number/CPR lot number"
    worksheet.getCell('B15').value = "Input Quantity (Pcs)"
    worksheet.getCell('B16').value = "NG Quantity (Pcs)"
    worksheet.getCell('B17').value = "Sent NG to Analysis (Pcs)"
    worksheet.getCell('B18').value = "Production phase"
    worksheet.getCell('B19').value = "Defect category"
    worksheet.getCell('B20').value = "Abnormal lot level"
    worksheet.getCell('B21').value = "Occur place"

    worksheet.getCell('H12').value = this.form.ktcModelNumber
    worksheet.getCell('H13').value = this.form.defectiveName
    worksheet.getCell('H14').value = this.form.pcLotNumber
    worksheet.getCell('H15').value = this.form.inputQuantity
    worksheet.getCell('H16').value = this.form.ngQuantity
    worksheet.getCell('H17').value = this.form.sendNgAnalysis
    worksheet.getCell('H18').value = this.form.productionPhase
    worksheet.getCell('H19').value = this.form.defectCatagory
    worksheet.getCell('H20').value = this.form.abnormalLotLevel
    worksheet.getCell('H21').value = this.form.occurBName


    // worksheet.getCell('O25').value = "All pattern"
    worksheet.getCell('B23').value = "2. Defective phenomenon:"
    // for (let index = 0; index < 30; index++) {
    //   const c = "O"
    //   const point = index + 26;
    //   const sum = c + point
    //   worksheet.getCell(sum).value = defectiveList[index]

    // }



    worksheet.getCell('B61').value = "3. Analysis result :"

    for (let index = 0; index < 30; index++) {
      const c = "B"
      const point = index + 63;
      const sum = c + point
      worksheet.getCell(sum).value = resultList[index]

      const c2 = "K"
      const sum2 = c2 + point
      worksheet.getCell(sum2).value = "N/A"
    }

    worksheet.getCell('B94').value = "4. Detail of root cause :"
    worksheet.getCell('B114').value = "5. Conclusion:"
    worksheet.getCell('B121').value = "6.  Comment (Request to take countermeasure) :"

    worksheet.getCell('B128').value = "Start analyze date :"
    worksheet.getCell('B129').value = "Finished date :"
    worksheet.getCell('B130').value = "Total analyze days :"
    worksheet.getCell('B131').value = "Treatment of NG :"


    // const ReportDate: any = new Date(this.ReportDate.value)
    // const IssueDate: any = new Date(this.form.issuedDate)
    // const Range: any = ReportDate - IssueDate
    // const oneDay = 1000 * 60 * 60 * 24;
    // const diffDay = Math.round(Range / oneDay);
    const result_diffDay = await this.calDiffDay(this.AnalyzeDate.value, this.ResultDate.value)


    worksheet.getCell('F128').value = this.AnalyzeDate.value || null
    worksheet.getCell('F129').value = this.ResultDate.value || null
    worksheet.getCell('F130').value = result_diffDay + " Day"
    worksheet.getCell('F131').value = this.TreatmentOfNg.value || null

    worksheet.getCell('J135').value = "Issue"
    worksheet.getCell('M135').value = "Review"
    worksheet.getCell('P135').value = "Approve"
    worksheet.getCell('B137').value = "Page 1 / 2"
    worksheet.getCell('Q137').value = "AEF4040.AN REPORT AMT-0"


    this.setBorderBox(worksheet, 25, 54)
    this.setBorderBox(worksheet, 63, 92)
    this.setBorderBox(worksheet, 96, 112)
    this.setBorderBox(worksheet, 116, 119)
    this.setBorderBox(worksheet, 123, 126)

    // * ตีเส้นกรอบนอก
    this.setOutBorder(worksheet, 1, 136)



    worksheet.mergeCells('J133:L134')
    worksheet.mergeCells('M133:O134')
    worksheet.mergeCells('P133:R134')

    worksheet.mergeCells('J135:L135')
    worksheet.mergeCells('M135:O135')
    worksheet.mergeCells('P135:R135')

    this.setBorderAll(worksheet, 'J', 133)
    this.setBorderAll(worksheet, 'M', 133)
    this.setBorderAll(worksheet, 'P', 133)

    this.setBorderAll(worksheet, 'J', 135)
    this.setBorderAll(worksheet, 'M', 135)
    this.setBorderAll(worksheet, 'P', 135)

    // ?จัดกึ่งกลาง
    worksheet.getCell('B55').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B57').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B58').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B59').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('E55').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('I55').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('E56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('H56').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('I56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('J56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('L56').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('M56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('N56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('P56').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('Q56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('R56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('T56').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('J135').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('N135').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('P135').alignment = { vertical: 'middle', horizontal: 'center' };

    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const fileName = RequestNumber + ".xlsx";
      fs.saveAs(blob, fileName)
    })
  }

  async genReportMDL() {
    const model = this.Report.filter(i => i.modelName == this.SelectMDL.value);
    let defectiveList = [];
    let resultList = [];
    if (model.length != 0) {
      defectiveList = model[0].defective;
      resultList = model[0].result;
    }

    const workbook = new Workbook();
    let RequestNumber = this.form.requestNumber
    const worksheet = workbook.addWorksheet(RequestNumber, { views: [{ showGridLines: false }] });
    worksheet.columns = [
      { width: 1 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 1 },
    ];



    const imageId2 = workbook.addImage({
      base64: this.imageBase64_1,
      extension: 'png',
    });
    const imageId3 = workbook.addImage({
      base64: this.imageBase64_2,
      extension: 'png',
    });
    worksheet.addImage(imageId2, {
      tl: { col: 1, row: 1 },
      ext: { width: 230.4, height: 76.8 }
    });
    worksheet.addImage(imageId3, {
      tl: { col: 1, row: 6 },
      ext: { width: 291.84, height: 31.68 }
    });
    // worksheet.mergeCells('B1:F8')

    worksheet.getCell('K3').value = "Request Item"
    worksheet.getCell('K4').value = "Register number"
    worksheet.getCell('K5').value = "Requestor Issued date"
    worksheet.getCell('K6').value = "Request reply date"
    worksheet.getCell('K7').value = "Request from (Department-Section)"
    worksheet.getCell('K8').value = "Requestor"

    worksheet.getCell('Q3').value = this.form.requestItem
    worksheet.getCell('Q4').value = this.form.requestNumber
    worksheet.getCell('Q5').value = this.form.issuedDate
    worksheet.getCell('Q6').value = this.form.replyDate
    worksheet.getCell('Q7').value = this.form.requestFormSectionName
    worksheet.getCell('Q8').value = this.Users.FirstName + "-" + this.Users.LastName

    worksheet.getCell('B10').value = "1. Description:"
    worksheet.getCell('B12').value = "KTC model number"
    worksheet.getCell('B13').value = "Defective name"
    worksheet.getCell('B14').value = "PC lot number/CPR lot number"
    worksheet.getCell('B15').value = "Input Quantity (Pcs)"
    worksheet.getCell('B16').value = "NG Quantity (Pcs)"
    worksheet.getCell('B17').value = "Sent NG to Analysis (Pcs)"
    worksheet.getCell('B18').value = "Production phase"
    worksheet.getCell('B19').value = "Defect category"
    worksheet.getCell('B20').value = "Abnormal lot level"
    worksheet.getCell('B21').value = "Occur place"

    worksheet.getCell('H12').value = this.form.ktcModelNumber
    worksheet.getCell('H13').value = this.form.defectiveName
    worksheet.getCell('H14').value = this.form.pcLotNumber
    worksheet.getCell('H15').value = this.form.inputQuantity
    worksheet.getCell('H16').value = this.form.ngQuantity
    worksheet.getCell('H17').value = this.form.sendNgAnalysis
    worksheet.getCell('H18').value = this.form.productionPhase
    worksheet.getCell('H19').value = this.form.defectCatagory
    worksheet.getCell('H20').value = this.form.abnormalLotLevel
    worksheet.getCell('H21').value = this.form.occurBName


    worksheet.getCell('O25').value = "All pattern"
    worksheet.getCell('B23').value = "2. Defective phenomenon:"
    for (let index = 0; index < 30; index++) {
      const c = "O"
      const point = index + 26;
      const sum = c + point
      worksheet.getCell(sum).value = defectiveList[index]

    }

    worksheet.getCell('B55').value = "Value"
    worksheet.getCell('B56').value = "Product Spec."
    worksheet.getCell('B58').value = "OK sample"
    worksheet.getCell('B59').value = "NG sample"

    worksheet.getCell('E55').value = "VCC (V)"
    worksheet.getCell('E56').value = "Min."
    worksheet.getCell('F56').value = "Typical"
    worksheet.getCell('H56').value = "Max."

    worksheet.getCell('I55').value = "ICC (mA)"
    worksheet.getCell('I56').value = "Min."
    worksheet.getCell('J56').value = "Typical"
    worksheet.getCell('L56').value = "Max."

    worksheet.getCell('M56').value = "Min."
    worksheet.getCell('N56').value = "Typical"
    worksheet.getCell('P56').value = "Max."

    worksheet.getCell('Q56').value = "Min."
    worksheet.getCell('R56').value = "Typical"
    worksheet.getCell('T56').value = "Max."

    worksheet.getCell('B61').value = "3. Analysis result :"

    for (let index = 0; index < 30; index++) {
      const c = "B"
      const point = index + 63;
      const sum = c + point
      worksheet.getCell(sum).value = resultList[index]

      const c2 = "K"
      const sum2 = c2 + point
      worksheet.getCell(sum2).value = "N/A"
    }

    worksheet.getCell('B94').value = "4. Detail of root cause :"
    worksheet.getCell('B114').value = "5. Conclusion:"
    worksheet.getCell('B121').value = "6.  Comment (Request to take countermeasure) :"

    worksheet.getCell('B128').value = "Start analyze date :"
    worksheet.getCell('B129').value = "Finished date :"
    worksheet.getCell('B130').value = "Total analyze days :"
    worksheet.getCell('B131').value = "Treatment of NG :"


    // const ReportDate: any = new Date(this.ReportDate.value)
    // const IssueDate: any = new Date(this.form.issuedDate)
    // const Range: any = ReportDate - IssueDate
    // const oneDay = 1000 * 60 * 60 * 24;
    // const diffDay = Math.round(Range / oneDay);

    const result_diffDay = await this.calDiffDay(this.AnalyzeDate.value, this.ResultDate.value)

    worksheet.getCell('F128').value = this.AnalyzeDate.value || null
    worksheet.getCell('F129').value = this.ResultDate.value || null
    worksheet.getCell('F130').value = result_diffDay + " Day"
    worksheet.getCell('F131').value = this.TreatmentOfNg.value || null

    worksheet.getCell('J135').value = "Issue"
    worksheet.getCell('M135').value = "Review"
    worksheet.getCell('P135').value = "Approve"
    worksheet.getCell('B137').value = "Page 1 / 2"
    worksheet.getCell('Q137').value = "AEF4040.AN REPORT MDL-0"


    // ? ตีเส้น กรอบนอก
    this.setOutBorder(worksheet, 1, 136)



    // ? merge

    for (let index = 0; index < 30; index++) {
      const a = `O${index + 25}`
      const b = `T${index + 25}`
      const sum = `${a}:${b}`
      worksheet.mergeCells(sum)
      worksheet.getCell(a).border = {
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
        left: { style: 'thin' },
      };
    }
    this.setBorderTop(worksheet, 'C', 25)
    this.setBorderTop(worksheet, 'D', 25)
    this.setBorderTop(worksheet, 'E', 25)
    this.setBorderTop(worksheet, 'F', 25)
    this.setBorderTop(worksheet, 'G', 25)
    this.setBorderTop(worksheet, 'H', 25)
    this.setBorderTop(worksheet, 'I', 25)
    this.setBorderTop(worksheet, 'J', 25)
    this.setBorderTop(worksheet, 'K', 25)
    this.setBorderTop(worksheet, 'L', 25)
    this.setBorderTop(worksheet, 'M', 25)
    this.setBorderTop(worksheet, 'N', 25)

    this.setBorderBottom(worksheet, 'C', 54)
    this.setBorderBottom(worksheet, 'D', 54)
    this.setBorderBottom(worksheet, 'E', 54)
    this.setBorderBottom(worksheet, 'F', 54)
    this.setBorderBottom(worksheet, 'G', 54)
    this.setBorderBottom(worksheet, 'H', 54)
    this.setBorderBottom(worksheet, 'I', 54)
    this.setBorderBottom(worksheet, 'J', 54)
    this.setBorderBottom(worksheet, 'K', 54)
    this.setBorderBottom(worksheet, 'L', 54)
    this.setBorderBottom(worksheet, 'M', 54)
    this.setBorderBottom(worksheet, 'N', 54)

    this.setBorderLeft2(worksheet, 'B', 26, 53)

    this.setBorderLB(worksheet, 'B', 54)
    this.setBorderRB(worksheet, 'N', 54)
    this.setBorderLT(worksheet, 'B', 25)
    this.setBorderRT(worksheet, 'N', 25)

    worksheet.mergeCells('B55:D55')
    worksheet.mergeCells('E55:H55')
    worksheet.mergeCells('I55:L55')
    worksheet.mergeCells('M55:P55')
    worksheet.mergeCells('Q55:T55')
    this.setBorderAll(worksheet, 'B', 55)
    this.setBorderAll(worksheet, 'E', 55)
    this.setBorderAll(worksheet, 'I', 55)
    this.setBorderAll(worksheet, 'M', 55)
    this.setBorderAll(worksheet, 'Q', 55)

    worksheet.mergeCells('B56:D57')
    worksheet.mergeCells('F56:G56')
    worksheet.mergeCells('J56:K56')
    worksheet.mergeCells('N56:O56')
    worksheet.mergeCells('R56:S56')

    worksheet.mergeCells('E57:H57')
    worksheet.mergeCells('I57:L57')
    worksheet.mergeCells('M57:P57')
    worksheet.mergeCells('Q57:T57')

    worksheet.mergeCells('B58:D58')
    worksheet.mergeCells('B59:D59')

    worksheet.mergeCells('E58:H58')
    worksheet.mergeCells('I58:L58')
    worksheet.mergeCells('M58:P58')
    worksheet.mergeCells('Q58:T58')

    worksheet.mergeCells('E59:H59')
    worksheet.mergeCells('I59:L59')
    worksheet.mergeCells('M59:P59')
    worksheet.mergeCells('Q59:T59')



    this.setBorderAll(worksheet, 'B', 56)
    this.setBorderAll(worksheet, 'C', 56)
    this.setBorderAll(worksheet, 'D', 56)
    this.setBorderAll(worksheet, 'E', 56)
    this.setBorderAll(worksheet, 'F', 56)
    this.setBorderAll(worksheet, 'G', 56)
    this.setBorderAll(worksheet, 'H', 56)
    this.setBorderAll(worksheet, 'I', 56)
    this.setBorderAll(worksheet, 'J', 56)
    this.setBorderAll(worksheet, 'K', 56)
    this.setBorderAll(worksheet, 'L', 56)
    this.setBorderAll(worksheet, 'M', 56)
    this.setBorderAll(worksheet, 'N', 56)
    this.setBorderAll(worksheet, 'O', 56)
    this.setBorderAll(worksheet, 'P', 56)
    this.setBorderAll(worksheet, 'Q', 56)
    this.setBorderAll(worksheet, 'R', 56)
    this.setBorderAll(worksheet, 'S', 56)
    this.setBorderAll(worksheet, 'T', 56)

    this.setBorderAll(worksheet, 'B', 57)
    this.setBorderAll(worksheet, 'C', 57)
    this.setBorderAll(worksheet, 'D', 57)
    this.setBorderAll(worksheet, 'E', 57)
    this.setBorderAll(worksheet, 'F', 57)
    this.setBorderAll(worksheet, 'G', 57)
    this.setBorderAll(worksheet, 'H', 57)
    this.setBorderAll(worksheet, 'I', 57)
    this.setBorderAll(worksheet, 'J', 57)
    this.setBorderAll(worksheet, 'K', 57)
    this.setBorderAll(worksheet, 'L', 57)
    this.setBorderAll(worksheet, 'M', 57)
    this.setBorderAll(worksheet, 'N', 57)
    this.setBorderAll(worksheet, 'O', 57)
    this.setBorderAll(worksheet, 'P', 57)
    this.setBorderAll(worksheet, 'Q', 57)
    this.setBorderAll(worksheet, 'R', 57)
    this.setBorderAll(worksheet, 'S', 57)
    this.setBorderAll(worksheet, 'T', 57)

    this.setBorderAll(worksheet, 'B', 58)
    this.setBorderAll(worksheet, 'C', 58)
    this.setBorderAll(worksheet, 'D', 58)
    this.setBorderAll(worksheet, 'E', 58)
    this.setBorderAll(worksheet, 'F', 58)
    this.setBorderAll(worksheet, 'G', 58)
    this.setBorderAll(worksheet, 'H', 58)
    this.setBorderAll(worksheet, 'I', 58)
    this.setBorderAll(worksheet, 'J', 58)
    this.setBorderAll(worksheet, 'K', 58)
    this.setBorderAll(worksheet, 'L', 58)
    this.setBorderAll(worksheet, 'M', 58)
    this.setBorderAll(worksheet, 'N', 58)
    this.setBorderAll(worksheet, 'O', 58)
    this.setBorderAll(worksheet, 'P', 58)
    this.setBorderAll(worksheet, 'Q', 58)
    this.setBorderAll(worksheet, 'R', 58)
    this.setBorderAll(worksheet, 'S', 58)
    this.setBorderAll(worksheet, 'T', 58)

    this.setBorderAll(worksheet, 'B', 59)
    this.setBorderAll(worksheet, 'C', 59)
    this.setBorderAll(worksheet, 'D', 59)
    this.setBorderAll(worksheet, 'E', 59)
    this.setBorderAll(worksheet, 'F', 59)
    this.setBorderAll(worksheet, 'G', 59)
    this.setBorderAll(worksheet, 'H', 59)
    this.setBorderAll(worksheet, 'I', 59)
    this.setBorderAll(worksheet, 'J', 59)
    this.setBorderAll(worksheet, 'K', 59)
    this.setBorderAll(worksheet, 'L', 59)
    this.setBorderAll(worksheet, 'M', 59)
    this.setBorderAll(worksheet, 'N', 59)
    this.setBorderAll(worksheet, 'O', 59)
    this.setBorderAll(worksheet, 'P', 59)
    this.setBorderAll(worksheet, 'Q', 59)
    this.setBorderAll(worksheet, 'R', 59)
    this.setBorderAll(worksheet, 'S', 59)
    this.setBorderAll(worksheet, 'T', 59)

    this.setBorderBox(worksheet, 63, 92)
    this.setBorderBox(worksheet, 96, 112)
    this.setBorderBox(worksheet, 116, 119)
    this.setBorderBox(worksheet, 123, 126)

    // this.setOutBorder(worksheet,1,137)


    worksheet.mergeCells('J133:L134')
    worksheet.mergeCells('M133:O134')
    worksheet.mergeCells('P133:R134')

    worksheet.mergeCells('J135:L135')
    worksheet.mergeCells('M135:O135')
    worksheet.mergeCells('P135:R135')

    this.setBorderAll(worksheet, 'J', 133)
    this.setBorderAll(worksheet, 'M', 133)
    this.setBorderAll(worksheet, 'P', 133)

    this.setBorderAll(worksheet, 'J', 135)
    this.setBorderAll(worksheet, 'M', 135)
    this.setBorderAll(worksheet, 'P', 135)

    // ?จัดกึ่งกลาง
    worksheet.getCell('B55').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B57').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B58').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B59').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('E55').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('I55').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('E56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('H56').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('I56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('J56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('L56').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('M56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('N56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('P56').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('Q56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('R56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('T56').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('J135').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('N135').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('P135').alignment = { vertical: 'middle', horizontal: 'center' };





















    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const fileName = RequestNumber + ".xlsx";
      fs.saveAs(blob, fileName)
    })
  }

  async genReportFM() {
    const model = this.Report.filter(i => i.modelName.includes('FM'));
    let defectiveList = [];
    let resultList = [];
    if (model.length != 0) {
      defectiveList = model[0].defective;
      resultList = model[0].result;
    }

    const workbook = new Workbook();
    let RequestNumber = this.form.requestNumber
    const worksheet = workbook.addWorksheet(RequestNumber, { views: [{ showGridLines: false }] });
    worksheet.columns = [
      { width: 1 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 5 },
      { width: 1 },
    ];



    const imageId2 = workbook.addImage({
      base64: this.imageBase64_1,
      extension: 'png',
    });
    const imageId3 = workbook.addImage({
      base64: this.imageBase64_2,
      extension: 'png',
    });
    worksheet.addImage(imageId2, {
      tl: { col: 1, row: 1 },
      ext: { width: 230.4, height: 76.8 }
    });
    worksheet.addImage(imageId3, {
      tl: { col: 1, row: 6 },
      ext: { width: 291.84, height: 31.68 }
    });
    // worksheet.mergeCells('B1:F8')

    worksheet.getCell('K3').value = "Request Item"
    worksheet.getCell('K4').value = "Register number"
    worksheet.getCell('K5').value = "Requestor Issued date"
    worksheet.getCell('K6').value = "Request reply date"
    worksheet.getCell('K7').value = "Request from (Department-Section)"
    worksheet.getCell('K8').value = "Requestor"

    worksheet.getCell('Q3').value = this.form.requestItem
    worksheet.getCell('Q4').value = this.form.requestNumber
    worksheet.getCell('Q5').value = this.form.issuedDate
    worksheet.getCell('Q6').value = this.form.replyDate
    worksheet.getCell('Q7').value = this.form.requestFormSectionName
    worksheet.getCell('Q8').value = this.Users.FirstName + "-" + this.Users.LastName

    worksheet.getCell('B10').value = "1. Description:"
    worksheet.getCell('B12').value = "KTC model number"
    worksheet.getCell('B13').value = "Defective name"
    worksheet.getCell('B14').value = "PC lot number/CPR lot number"
    worksheet.getCell('B15').value = "Input Quantity (Pcs)"
    worksheet.getCell('B16').value = "NG Quantity (Pcs)"
    worksheet.getCell('B17').value = "Sent NG to Analysis (Pcs)"
    worksheet.getCell('B18').value = "Production phase"
    worksheet.getCell('B19').value = "Defect category"
    worksheet.getCell('B20').value = "Abnormal lot level"
    worksheet.getCell('B21').value = "Occur place"

    worksheet.getCell('H12').value = this.form.ktcModelNumber
    worksheet.getCell('H13').value = this.form.defectiveName
    worksheet.getCell('H14').value = this.form.pcLotNumber
    worksheet.getCell('H15').value = this.form.inputQuantity
    worksheet.getCell('H16').value = this.form.ngQuantity
    worksheet.getCell('H17').value = this.form.sendNgAnalysis
    worksheet.getCell('H18').value = this.form.productionPhase
    worksheet.getCell('H19').value = this.form.defectCatagory
    worksheet.getCell('H20').value = this.form.abnormalLotLevel
    worksheet.getCell('H21').value = this.form.occurBName


    // worksheet.getCell('O25').value = "All pattern"
    worksheet.getCell('B23').value = "2. Defective phenomenon:"



    worksheet.getCell('B61').value = "3. Analysis result :"

    // for (let index = 0; index < 30; index++) {
    //   const c = "B"
    //   const point = index + 63;
    //   const sum = c + point
    //   worksheet.getCell(sum).value = resultList[index]

    //   const c2 = "K"
    //   const sum2 = c2 + point
    //   worksheet.getCell(sum2).value = "N/A"
    // }

    worksheet.getCell('C64').value = "Item"
    worksheet.getCell('C65').value = "0"
    worksheet.getCell('E64').value = "Material"
    worksheet.getCell('H64').value = "Example of material in process"
    worksheet.getCell('O64').value = "q'ty"
    worksheet.getCell('Q64').value = "%"
    worksheet.getCell('R64').value = "Source"

    worksheet.getCell('M71').value = "Total"



    worksheet.getCell('B94').value = "4. Comment (Request to take countermeasure) :"

    worksheet.getCell('B115').value = "Start analyze date :"
    worksheet.getCell('B116').value = "Finished date :"
    worksheet.getCell('B117').value = "Total analyze days :"
    worksheet.getCell('B118').value = "Treatment of NG :"


    // const ReportDate: any = new Date(this.ReportDate.value)
    // const IssueDate: any = new Date(this.form.issuedDate)
    // const Range: any = ReportDate - IssueDate
    // const oneDay = 1000 * 60 * 60 * 24;
    // const diffDay = Math.round(Range / oneDay);
    const result_diffDay = await this.calDiffDay(this.AnalyzeDate.value, this.ResultDate.value)

    worksheet.getCell('F115').value = this.AnalyzeDate.value || null
    worksheet.getCell('F116').value = this.ResultDate.value || null
    worksheet.getCell('F117').value = result_diffDay + " Day"
    worksheet.getCell('F118').value = this.TreatmentOfNg.value || null

    worksheet.getCell('J124').value = "Issue"
    worksheet.getCell('M124').value = "Review"
    worksheet.getCell('P124').value = "Approve"
    worksheet.getCell('B126').value = "Page 1 / 2"
    worksheet.getCell('Q126').value = "AEF4040.AN REPORT FM-0"


    this.setBorderBox(worksheet, 25, 59)
    this.setBorderBox(worksheet, 63, 92)
    this.setBorderBox(worksheet, 96, 112)


    this.setOutBorder(worksheet, 1, 125)

    worksheet.mergeCells('C64:D64')
    worksheet.mergeCells('E64:G64')
    worksheet.mergeCells('H64:N64')
    worksheet.mergeCells('O64:P64')
    worksheet.mergeCells('R64:S64')

    worksheet.mergeCells('C65:D70')

    worksheet.mergeCells('E65:G65')
    worksheet.mergeCells('H65:N65')
    worksheet.mergeCells('O65:P65')
    worksheet.mergeCells('R65:S65')

    worksheet.mergeCells('E66:G66')
    worksheet.mergeCells('H66:N66')
    worksheet.mergeCells('O66:P66')
    worksheet.mergeCells('R66:S66')

    worksheet.mergeCells('E67:G67')
    worksheet.mergeCells('H67:N67')
    worksheet.mergeCells('O67:P67')
    worksheet.mergeCells('R67:S67')

    worksheet.mergeCells('E68:G68')
    worksheet.mergeCells('H68:N68')
    worksheet.mergeCells('O68:P68')
    worksheet.mergeCells('R68:S68')

    worksheet.mergeCells('E69:G69')
    worksheet.mergeCells('H69:N69')
    worksheet.mergeCells('O69:P69')
    worksheet.mergeCells('R69:S69')

    worksheet.mergeCells('E70:G70')
    worksheet.mergeCells('H70:N70')
    worksheet.mergeCells('O70:P70')
    worksheet.mergeCells('R70:S70')

    worksheet.mergeCells('M71:N71')
    worksheet.mergeCells('O71:P71')


    this.setBorderAll(worksheet, 'C', 64)
    this.setBorderAll(worksheet, 'E', 64)
    this.setBorderAll(worksheet, 'H', 64)
    this.setBorderAll(worksheet, 'O', 64)
    this.setBorderAll(worksheet, 'Q', 64)
    this.setBorderAll(worksheet, 'R', 64)

    this.setBorderAll(worksheet, 'C', 65)
    this.setBorderAll(worksheet, 'E', 65)
    this.setBorderAll(worksheet, 'H', 65)
    this.setBorderAll(worksheet, 'O', 65)
    this.setBorderAll(worksheet, 'Q', 65)
    this.setBorderAll(worksheet, 'R', 65)

    this.setBorderAll(worksheet, 'C', 66)
    this.setBorderAll(worksheet, 'E', 66)
    this.setBorderAll(worksheet, 'H', 66)
    this.setBorderAll(worksheet, 'O', 66)
    this.setBorderAll(worksheet, 'Q', 66)
    this.setBorderAll(worksheet, 'R', 66)

    this.setBorderAll(worksheet, 'C', 67)
    this.setBorderAll(worksheet, 'E', 67)
    this.setBorderAll(worksheet, 'H', 67)
    this.setBorderAll(worksheet, 'O', 67)
    this.setBorderAll(worksheet, 'Q', 67)
    this.setBorderAll(worksheet, 'R', 67)

    this.setBorderAll(worksheet, 'C', 68)
    this.setBorderAll(worksheet, 'E', 68)
    this.setBorderAll(worksheet, 'H', 68)
    this.setBorderAll(worksheet, 'O', 68)
    this.setBorderAll(worksheet, 'Q', 68)
    this.setBorderAll(worksheet, 'R', 68)

    this.setBorderAll(worksheet, 'C', 69)
    this.setBorderAll(worksheet, 'E', 69)
    this.setBorderAll(worksheet, 'H', 69)
    this.setBorderAll(worksheet, 'O', 69)
    this.setBorderAll(worksheet, 'Q', 69)
    this.setBorderAll(worksheet, 'R', 69)

    this.setBorderAll(worksheet, 'C', 70)
    this.setBorderAll(worksheet, 'E', 70)
    this.setBorderAll(worksheet, 'H', 70)
    this.setBorderAll(worksheet, 'O', 70)
    this.setBorderAll(worksheet, 'Q', 70)
    this.setBorderAll(worksheet, 'R', 70)

    this.setBorderAll(worksheet, 'M', 71)
    this.setBorderAll(worksheet, 'O', 71)
    this.setBorderAll(worksheet, 'Q', 71)






    worksheet.mergeCells('J122:L123')
    worksheet.mergeCells('M122:O123')
    worksheet.mergeCells('P122:R123')

    worksheet.mergeCells('J124:L124')
    worksheet.mergeCells('M124:O124')
    worksheet.mergeCells('P124:R124')

    this.setBorderAll(worksheet, 'J', 122)
    this.setBorderAll(worksheet, 'M', 122)
    this.setBorderAll(worksheet, 'P', 122)

    this.setBorderAll(worksheet, 'J', 124)
    this.setBorderAll(worksheet, 'M', 124)
    this.setBorderAll(worksheet, 'P', 124)

    // ?จัดกึ่งกลาง
    worksheet.getCell('C64').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C65').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('E64').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('H64').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('O64').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('Q64').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('R64').alignment = { vertical: 'middle', horizontal: 'center' };


    worksheet.getCell('B55').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B57').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B58').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B59').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('E55').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('I55').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('E56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('H56').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('I56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('J56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('L56').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('M56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('N56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('P56').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('Q56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('R56').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('T56').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('J124').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('N124').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('P124').alignment = { vertical: 'middle', horizontal: 'center' };



    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const fileName = RequestNumber + ".xlsx";
      fs.saveAs(blob, fileName)
    })
  }



  setOutBorder(ws: any, s: number, e: number) {

    // ? set cross
    this.setBorderLT(ws, 'A', s)
    this.setBorderRT(ws, 'V', s)
    this.setBorderLB(ws, 'A', e)
    this.setBorderRB(ws, 'V', e)

    // ?set top

    this.setBorderTop(ws, 'B', s)
    this.setBorderTop(ws, 'C', s)
    this.setBorderTop(ws, 'D', s)
    this.setBorderTop(ws, 'E', s)
    this.setBorderTop(ws, 'F', s)
    this.setBorderTop(ws, 'G', s)
    this.setBorderTop(ws, 'H', s)
    this.setBorderTop(ws, 'I', s)
    this.setBorderTop(ws, 'J', s)
    this.setBorderTop(ws, 'K', s)
    this.setBorderTop(ws, 'L', s)
    this.setBorderTop(ws, 'M', s)
    this.setBorderTop(ws, 'N', s)
    this.setBorderTop(ws, 'O', s)
    this.setBorderTop(ws, 'P', s)
    this.setBorderTop(ws, 'Q', s)
    this.setBorderTop(ws, 'R', s)
    this.setBorderTop(ws, 'S', s)
    this.setBorderTop(ws, 'T', s)
    this.setBorderTop(ws, 'U', s)

    this.setBorderBottom(ws, 'B', e)
    this.setBorderBottom(ws, 'C', e)
    this.setBorderBottom(ws, 'D', e)
    this.setBorderBottom(ws, 'E', e)
    this.setBorderBottom(ws, 'F', e)
    this.setBorderBottom(ws, 'G', e)
    this.setBorderBottom(ws, 'H', e)
    this.setBorderBottom(ws, 'I', e)
    this.setBorderBottom(ws, 'J', e)
    this.setBorderBottom(ws, 'K', e)
    this.setBorderBottom(ws, 'L', e)
    this.setBorderBottom(ws, 'M', e)
    this.setBorderBottom(ws, 'N', e)
    this.setBorderBottom(ws, 'O', e)
    this.setBorderBottom(ws, 'P', e)
    this.setBorderBottom(ws, 'Q', e)
    this.setBorderBottom(ws, 'R', e)
    this.setBorderBottom(ws, 'S', e)
    this.setBorderBottom(ws, 'T', e)
    this.setBorderBottom(ws, 'U', e)

    this.setBorderLeft2(ws, 'A', s + 1, e - 1)
    this.setBorderRight2(ws, 'V', s + 1, e - 1)


  }
  setBorderBox(ws: any, s: number, e: number) {

    // ? set cross
    this.setBorderLT(ws, 'B', s)
    this.setBorderRT(ws, 'T', s)
    this.setBorderLB(ws, 'B', e)
    this.setBorderRB(ws, 'T', e)

    // ?set top

    this.setBorderTop(ws, 'C', s)
    this.setBorderTop(ws, 'D', s)
    this.setBorderTop(ws, 'E', s)
    this.setBorderTop(ws, 'F', s)
    this.setBorderTop(ws, 'G', s)
    this.setBorderTop(ws, 'H', s)
    this.setBorderTop(ws, 'I', s)
    this.setBorderTop(ws, 'J', s)
    this.setBorderTop(ws, 'K', s)
    this.setBorderTop(ws, 'L', s)
    this.setBorderTop(ws, 'M', s)
    this.setBorderTop(ws, 'N', s)
    this.setBorderTop(ws, 'O', s)
    this.setBorderTop(ws, 'P', s)
    this.setBorderTop(ws, 'Q', s)
    this.setBorderTop(ws, 'R', s)
    this.setBorderTop(ws, 'S', s)

    this.setBorderBottom(ws, 'C', e)
    this.setBorderBottom(ws, 'D', e)
    this.setBorderBottom(ws, 'E', e)
    this.setBorderBottom(ws, 'F', e)
    this.setBorderBottom(ws, 'G', e)
    this.setBorderBottom(ws, 'H', e)
    this.setBorderBottom(ws, 'I', e)
    this.setBorderBottom(ws, 'J', e)
    this.setBorderBottom(ws, 'K', e)
    this.setBorderBottom(ws, 'L', e)
    this.setBorderBottom(ws, 'M', e)
    this.setBorderBottom(ws, 'N', e)
    this.setBorderBottom(ws, 'O', e)
    this.setBorderBottom(ws, 'P', e)
    this.setBorderBottom(ws, 'Q', e)
    this.setBorderBottom(ws, 'R', e)
    this.setBorderBottom(ws, 'S', e)

    this.setBorderLeft2(ws, 'B', s + 1, e - 1)
    this.setBorderRight2(ws, 'T', s + 1, e - 1)


  }

  setBorderTop(ws: any, cell: any, number: any) {
    const cellSum = cell + number;
    ws.getCell(cellSum).border = {
      top: { style: 'thin' },
    };
  }
  setBorderLeft(ws: any, cell: any, number: any) {
    const cellSum = cell + number;
    ws.getCell(cellSum).border = {
      left: { style: 'thin' },
    };
  }
  setBorderRight(ws: any, cell: any, number: any) {
    const cellSum = cell + number;
    ws.getCell(cellSum).border = {
      right: { style: 'thin' }
    };
  }
  setBorderBottom(ws: any, cell: any, number: any) {
    const cellSum = cell + number;
    ws.getCell(cellSum).border = {
      bottom: { style: 'thin' },
    };
  }

  setBorderTop2(ws: any, cell: any, start: any, end: any) {
    for (let index = start; index <= end; index++) {
      const cellSum = cell + index
      ws.getCell(cellSum).border = {
        top: { style: 'thin' },
      };
    }
  }
  setBorderLeft2(ws: any, cell: any, start: any, end: any) {
    for (let index = start; index <= end; index++) {
      const cellSum = cell + index
      ws.getCell(cellSum).border = {
        left: { style: 'thin' },
      };
    }
  }
  setBorderRight2(ws: any, cell: any, start: any, end: any) {
    for (let index = start; index <= end; index++) {
      const cellSum = cell + index
      ws.getCell(cellSum).border = {
        right: { style: 'thin' },
      };
    }
  }
  setBorderBottom2(ws: any, cell: any, start: any, end: any) {
    for (let index = start; index <= end; index++) {
      const cellSum = cell + index
      ws.getCell(cellSum).border = {
        bottom: { style: 'thin' },
      };
    }
  }
  setBorderLT(ws: any, cell: any, number: any) {
    const cellSum = cell + number;
    ws.getCell(cellSum).border = {
      left: { style: 'thin' },
      top: { style: 'thin' },

    };
  }
  setBorderLB(ws: any, cell: any, number: any) {
    const cellSum = cell + number;
    ws.getCell(cellSum).border = {
      left: { style: 'thin' },
      bottom: { style: 'thin' },

    };
  }
  setBorderRT(ws: any, cell: any, number: any) {
    const cellSum = cell + number;
    ws.getCell(cellSum).border = {
      right: { style: 'thin' },
      top: { style: 'thin' },

    };
  }
  setBorderRB(ws: any, cell: any, number: any) {
    const cellSum = cell + number;
    ws.getCell(cellSum).border = {
      right: { style: 'thin' },
      bottom: { style: 'thin' },

    };
  }
  setBorderAll(ws: any, cell: any, number: any) {
    const cellSum = cell + number;
    ws.getCell(cellSum).border = {
      right: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      top: { style: 'thin' },
    };
  }

  createRow(worksheet: any, rowIndexStart: number, count: number, wordStart: string, wordEnd: string,) {
    for (let index = 0; index < count; index++) {
      worksheet.addRow([]);
      let a = false;
      this.wordAZ.forEach((word: any, index2) => {
        // const start = "B"
        // const end = "K"
        if (word == wordEnd) {
          a = false;
        } else if (word == wordStart || a == true) {
          a = true
          const sum = word + (rowIndexStart + (index + 1))
          // console.log(sum);

          worksheet.getCell(sum).border = {
            bottom: { style: 'thin' },
            right: { style: 'thin' },
            top: { style: 'thin' },
            left: { style: 'thin' },
          };
        }
      });

    }

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

  ModalNote(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }

  get AnalyzeDate() { return this.ResultForm.get('AnalyzeDate') }
  get ResultDate() { return this.ResultForm.get('ResultDate') }
  get ReportDate() { return this.ResultForm.get('ReportDate') }
  get Result() { return this.ResultForm.get('Result') }
  get SourceOfDefect() { return this.ResultForm.get('SourceOfDefect') }
  get CategoryCause() { return this.ResultForm.get('CategoryCause') }
  get AnalysisLevel() { return this.ResultForm.get('AnalysisLevel') }
  get CanAnalysis() { return this.ResultForm.get('CanAnalysis') }
  get RelatedToESD() { return this.ResultForm.get('RelatedToESD') }
  get ReportNo() { return this.ResultForm.get('ReportNo') }
  get Approve() { return this.ResultForm.get('Approve') }
  get TempCause() { return this.ResultForm.get('TempCause') }
  get File() { return this.ResultForm.get('File') }
  get htmlReport() { return this.ResultForm.get('htmlReport') }
  get JudgementDefect() { return this.ResultForm.get('JudgementDefect') }
  get Remark() { return this.ResultForm.get('Remark') }

  alertSuccess() {
    Swal.fire({
      title: 'SUCCESS',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    })
  }



  setBase64() {
    this.imageBase64_1 = "data:image/png;base64,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";
    this.imageBase64_2 = "data:image/png;base64,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"

  }

}
