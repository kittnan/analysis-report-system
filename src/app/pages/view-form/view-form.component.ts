import { Component, OnInit } from '@angular/core';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// import * as fs from 'file-saver';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'app/service/http.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-view-form',
  templateUrl: './view-form.component.html',
  styleUrls: ['./view-form.component.css', '../pagesStyle.css']
})
export class ViewFormComponent implements OnInit {

  form: any = []
  result: any = []

  FileListName: any;
  PathListName: any = [];

  // ? Session
  FormView = sessionStorage.getItem('FormView');
  FormId = sessionStorage.getItem('FormId');



  // ? toggle
  toggleReportFile = false;
  toggleLabel = false;

  ReportName: any;

  // ? comment
  CommentLists: any = [];

  constructor(
    private api: HttpService,
    // private progressForm1: ProgressForm1Service,
    private modal: NgbModal
  ) { }

  async ngOnInit(): Promise<void> {
    console.log('@@@@@@@');

    const form = await this.getForm(this.FormId);

    form ? this.form = form : this.form = []
    // console.log(form);

    const result = await this.getResult(this.FormId);
    result ? this.result = result : this.result = []
    this.CheckStatusUser();

    // this.captureScreen();

  }


  pdfLabel() {
    // requestItem
    console.log(this.form.requestItem);

    const head = this.form.requestNumber
    const model = this.form.ktcModelNumber
    const defect1 = this.form.defectiveName.substring(0, 95)
    const defect = defect1
    // console.log(defect.length);

    const lot = this.form.pcLotNumber
    const sendNg = this.form.sendNgAnalysis
    const pic = this.form.userApprove3Name
    const date = new Date(this.form.issuedDate).toLocaleString('en-US').split(',');
    const requester = this.form.requestItem
    const qrText = head + ";" + model + ";" + defect + ";" + lot + ";" + sendNg + ";" + pic + ";" + date[0] + ":" + requester;
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
                  text: model + '\n'
                },

                {
                  text: 'Defect: ',
                  bold: true
                },
                {
                  text: defect + '\n'
                },
                {
                  text: 'Lot no: ',
                  bold: true
                },
                {
                  text: lot + '\n',

                },
                {
                  text: "Send NG To Analysis: ",

                  bold: true
                },
                {
                  text: sendNg + ' (Pcs)\n'
                },
                {
                  text: 'PIC: ',
                  bold: true
                },
                {
                  text: pic + '\n'
                },

                {
                  text: 'Date: ',
                  bold: true
                },
                {
                  text: date[0] + '\n'
                },
                {
                  text: 'Requester: ',
                  bold: true
                },
                {
                  text: requester
                }
              ],
              fontSize: 11
            }
          ]
        }
      ]
    }




    pdfMake.createPdf(label).open();

  }





  // ? check level login
  CheckStatusUser() {
    let LevelList = [];
    LevelList.push(sessionStorage.getItem('UserLevel1'))
    LevelList.push(sessionStorage.getItem('UserLevel2'))
    LevelList.push(sessionStorage.getItem('UserLevel3'))
    LevelList.push(sessionStorage.getItem('UserLevel4'))
    LevelList.push(sessionStorage.getItem('UserLevel5'))
    LevelList.push(sessionStorage.getItem('UserLevel6'))
    const Level = LevelList.filter(lvl => lvl == '6');
    const checkAEWindow = LevelList.filter(lvl => lvl == '3');
    checkAEWindow.length > 0 ? this.toggleLabel = true : this.toggleLabel = false;

  }

  getForm(FormId) {
    // console.log(FormId);

    return new Promise((resolve) => {
      this.api.FindFormById(FormId).subscribe((res: any) => {
        let form = res

        if (form) {
          form.issuedDate ? form.issuedDate = (form.issuedDate.split('T'))[0] : form.issuedDate
          form.replyDate ? form.replyDate = (form.replyDate).split('T')[0] : form.replyDate
          resolve(form)
        } else {
          form = null
          resolve(res)
        };
      })
    })
  }

  getResult(FormId) {
    return new Promise((resolve) => {
      this.api.FindResultByFormIdMain(FormId).subscribe((data: any) => {
        let result: any = data[0]
        if (data.length != 0) {
          result.startAnalyzeDate ? result.startAnalyzeDate = ((result.startAnalyzeDate).split("T"))[0] : result.startAnalyzeDate
          result.finishAnalyzeDate ? result.finishAnalyzeDate = ((result.finishAnalyzeDate).split("T"))[0] : result.finishAnalyzeDate
          result.finishReportDate ? result.finishReportDate = ((result.finishReportDate).split("T"))[0] : result.finishReportDate
          if (result.file) {
            this.toggleReportFile = true;
          }
          resolve(result)
        } else {
          resolve(data)
          result = null;
        }

      })

    })
  }


  showComment(content) {
    this.CommentLists = []
    this.setDataComment()
    this.modal.open(content, { size: 'lg' });
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
