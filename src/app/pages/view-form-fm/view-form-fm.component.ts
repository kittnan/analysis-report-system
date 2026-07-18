import { Component, OnInit } from '@angular/core';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'app/service/http.service';
import { ActivatedRoute, Params } from '@angular/router';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-view-form-fm',
  templateUrl: './view-form-fm.component.html',
  styleUrls: ['./view-form-fm.component.scss', '../pagesStyle.css']
})
export class ViewFormFmComponent implements OnInit {

  form: any = [];
  result: any = {};

  FileListName: any;
  PathListName: any = [];

  formView = sessionStorage.getItem('FormView');
  formId = sessionStorage.getItem('FormId');

  toggleReportFile = false;
  toggleLabel = false;
  toggleReportUserAE = false;

  ReportName: any;

  CommentLists: any = [];
  status: any = true;

  mappingPositionImages: any[] = [];
  analysisItems: any[] = [];

  constructor(
    private api: HttpService,
    private modal: NgbModal,
    private routerActive: ActivatedRoute,
  ) {
    this.routerActive.queryParams.subscribe((param: Params) => {
      if (param) {
        this.formId = param['formId'];
        this.formView = param['formView'] || this.formView;
      }
    });
  }

  async ngOnInit(): Promise<void> {
    if (!this.formId) {
      return;
    }

    const form: any = await this.getForm(this.formId);
    this.form = form || [];

    const result = await this.getResult(this.formId);
    this.result = result || {};
    this.bindAnalysisForm();

    this.CheckStatusUser();
    this.status = !!form?.userApprove5Name;

    if (this.form?.status === 6) {
      if (!this.isAEUser()) {
        this.setEmptyOperator();
        return;
      }
      return;
    }

    if (this.isAEUser()) {
      return;
    }

    if (this.isFM_DST()) {
      this.setEmptyOtherResult();
      return;
    }

    if (this.form?.status !== 6) {
      this.setEmptyResultFull();
    }
  }

  setEmptyResultFull() {
    this.ensureResultObject();
    this.result.result = '';
    this.result.result2 = [];
    this.result.causeOfDefect = '';
    this.result.sourceOfDefect = '';
    this.result.analysisLevel = '';
    this.result.canAnalysis = '';
    this.result.relatedToESD = '';
    this.result.JudgementDefect = '';
    this.result.Remark = '';
    this.result.operatorName = '';
    this.result.difficultyOfWork = '';
    this.result.correctOfWork = '';
    this.result.analysisTime = '';
  }

  setEmptyOtherResult() {
    this.ensureResultObject();
    this.result.causeOfDefect = '';
    this.result.sourceOfDefect = '';
    this.result.analysisLevel = '';
    this.result.canAnalysis = '';
    this.result.relatedToESD = '';
    this.result.JudgementDefect = '';
    this.result.Remark = '';
    this.result.operatorName = '';
    this.result.difficultyOfWork = '';
    this.result.correctOfWork = '';
    this.result.analysisTime = '';
  }

  setEmptyOperator() {
    this.ensureResultObject();
    this.result.operatorName = '';
    this.result.difficultyOfWork = '';
    this.result.correctOfWork = '';
    this.result.analysisTime = '';
  }

  isAEUser(): boolean {
    const levelName1: any = localStorage.getItem('AR_UserSection1Name');
    const levelName2: any = localStorage.getItem('AR_UserSection2Name');
    const levelName3: any = localStorage.getItem('AR_UserSection3Name');
    const levelName4: any = localStorage.getItem('AR_UserSection4Name');
    const levelName5: any = localStorage.getItem('AR_UserSection5Name');
    const levelName6: any = localStorage.getItem('AR_UserSection6Name');
    let level1: any = localStorage.getItem('AR_UserLevel1')
    let level2: any = localStorage.getItem('AR_UserLevel2')
    let level3: any = localStorage.getItem('AR_UserLevel3')
    let level4: any = localStorage.getItem('AR_UserLevel4')
    let level5: any = localStorage.getItem('AR_UserLevel5')
    let level6: any = localStorage.getItem('AR_UserLevel6')
    const levelArr = [level1, level2, level3, level4, level5, level6];
    const levelNameArr = [levelName1, levelName2, levelName3, levelName4, levelName5, levelName6];

    return levelArr.some((lv: any) => lv && lv >= 3) || levelNameArr.some((lv: any) => lv && lv == 'AE');
  }

  pdfLabel() {
    if (!this.form) {
      return;
    }

    const head = this.form.requestNumber;
    const model = this.form.ktcModelNumber;
    const defect1 = (this.form.defectiveName || '').substring(0, 95);
    const defect = defect1;
    const lot = this.form.pcLotNumber;
    const sendNg = this.form.sendNgAnalysis;
    const pic = this.form.userApprove3Name;
    const date = new Date(this.form.issuedDate).toLocaleString('en-US').split(',');
    const requester = this.form.requestFormSectionName;
    const qrText = head + ';' + model + ';' + defect + ';' + lot + ';' + sendNg + ';' + pic + ';' + date[0] + ';' + requester;
    const label = {
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
                  text: 'Send NG To Analysis: ',
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
    };

    pdfMake.createPdf(label).open();
  }

  CheckStatusUser() {
    const LevelList = [];
    LevelList.push(localStorage.getItem('AR_UserLevel1'));
    LevelList.push(localStorage.getItem('AR_UserLevel2'));
    LevelList.push(localStorage.getItem('AR_UserLevel3'));
    LevelList.push(localStorage.getItem('AR_UserLevel4'));
    LevelList.push(localStorage.getItem('AR_UserLevel5'));
    LevelList.push(localStorage.getItem('AR_UserLevel6'));
    const checkAEWindow = LevelList.filter(lvl => lvl === '3');
    this.toggleLabel = checkAEWindow.length > 0;

    if (
      LevelList.some((level: any) => level === '3') ||
      LevelList.some((level: any) => level === '4') ||
      LevelList.some((level: any) => level === '5') ||
      LevelList.some((level: any) => level === '6')
    ) {
      this.toggleReportUserAE = true;
    }
  }

  getForm(FormId: any) {
    return new Promise((resolve) => {
      this.api.FindFormById(FormId).subscribe((res: any) => {
        const form = res;

        if (form) {
          form.issuedDate ? form.issuedDate = (form.issuedDate.split('T'))[0] : form.issuedDate;
          form.replyDate ? form.replyDate = (form.replyDate).split('T')[0] : form.replyDate;
          resolve(form);
        } else {
          resolve(res);
        }
      });
    });
  }

  getResult(FormId: any) {
    return new Promise((resolve) => {
      this.api.FindResultByFormIdMain(FormId).subscribe((data: any) => {
        const result: any = data[0];
        if (data.length !== 0 && result) {
          result.startAnalyzeDate ? result.startAnalyzeDate = ((result.startAnalyzeDate).split('T'))[0] : result.startAnalyzeDate;
          result.finishAnalyzeDate ? result.finishAnalyzeDate = ((result.finishAnalyzeDate).split('T'))[0] : result.finishAnalyzeDate;
          result.finishReportDate ? result.finishReportDate = ((result.finishReportDate).split('T'))[0] : result.finishReportDate;
          if (result.file) {
            this.toggleReportFile = true;
          }
          resolve(result);
        } else {
          resolve(null);
        }
      });
    });
  }

  showComment(content: any) {
    this.CommentLists = [];
    this.setDataComment();
    this.modal.open(content, { size: 'lg' });
  }

  setDataComment() {
    if (this.form.noteNow) {
      const temp = {
        note: this.form.noteNow,
        from: '',
        to: 'Last Comment',
        class: 'now'
      };
      this.CommentLists.push(temp);
    }

    if (this.form.noteApprove1) {
      const temp = {
        note: this.form.noteApprove1,
        from: `Requestor issuer ( ${this.form.requesterName} )`,
        to: `Requestor approval ( ${this.form.userApprove1Name} )`,
        class: 'approve'
      };
      this.CommentLists.push(temp);
    }
    if (this.form.noteApprove2) {
      const temp = {
        note: this.form.noteApprove2,
        from: `Requestor approval ( ${this.form.userApprove1Name} )`,
        to: `AE Window person ( ${this.form.userApprove2Name} )`,
        class: 'approve'
      };
      this.CommentLists.push(temp);
    }
    if (this.form.noteApprove3) {
      const temp = {
        note: this.form.noteApprove3,
        from: `AE Window person ( ${this.form.userApprove2Name} )`,
        to: `AE Engineer ( ${this.form.userApprove3Name} )`,
        class: 'approve'
      };
      this.CommentLists.push(temp);
    }
    if (this.form.noteApprove4) {
      const temp = {
        note: this.form.noteApprove4,
        from: `AE Engineer ( ${this.form.userApprove3Name} )`,
        to: `AE Section Head ( ${this.form.userApprove4Name} )`,
        class: 'approve'
      };
      this.CommentLists.push(temp);
    }
    if (this.form.noteApprove5) {
      const temp = {
        note: this.form.noteApprove5,
        from: `AE Section Head ( ${this.form.userApprove4Name} )`,
        to: `AE Dep. Head ( ${this.form.userApprove5Name} )`,
        class: 'approve'
      };
      this.CommentLists.push(temp);
    }
    if (this.form.noteApprove6) {
      const temp = {
        note: this.form.noteApprove6,
        from: `AE Dep. Head ( ${this.form.userApprove5Name} )`,
        to: 'All',
        class: 'approve'
      };
      this.CommentLists.push(temp);
    }

    if (this.form.noteReject1) {
      const temp = {
        note: this.form.noteReject1,
        from: `Requestor approval ( ${this.form.userApprove1Name} )`,
        to: `Requestor issuer ( ${this.form.requesterName} )`,
        class: 'reject'
      };
      this.CommentLists.push(temp);
    }
    if (this.form.noteReject2) {
      const temp = {
        note: this.form.noteReject2,
        from: `AE Window person ( ${this.form.userApprove2Name} )`,
        to: `Requestor issuer ( ${this.form.requesterName} )`,
        class: 'reject'
      };
      this.CommentLists.push(temp);
    }
    if (this.form.noteReject3) {
      const temp = {
        note: this.form.noteReject3,
        from: `AE Engineer ( ${this.form.userApprove3Name} )`,
        to: `AE Window person ( ${this.form.userApprove2Name} )`,
        class: 'reject'
      };
      this.CommentLists.push(temp);
    }
    if (this.form.noteReject4) {
      const temp = {
        note: this.form.noteReject4,
        from: `AE Section Head ( ${this.form.userApprove4Name} )`,
        to: `AE Engineer ( ${this.form.userApprove3Name} )`,
        class: 'reject'
      };
      this.CommentLists.push(temp);
    }
    if (this.form.noteReject5) {
      const temp = {
        note: this.form.noteReject5,
        from: `AE Dep. Head ( ${this.form.userApprove5Name} )`,
        to: `AE Engineer ( ${this.form.userApprove3Name} )`,
        class: 'reject'
      };
      this.CommentLists.push(temp);
    }
  }

  isFM() {
    if (this.form?.requestItem) {
      return (this.form.requestItem).includes('FM');
    }
    return false;
  }

  isFM_DST() {
    if (this.form?.requestItem) {
      return (this.form.requestItem).includes('DST_FM');
    }
    return false;
  }

  isResult2() {
    if (this.result?.result2?.filter((i: any) => i.item).length > 0) {
      return true;
    }
    return false;
  }

  hasAnalysisForm(): boolean {
    return this.mappingPositionImages.length > 0 || this.analysisItems.length > 0;
  }

  shouldShowResultSection(): boolean {
    return this.formView === '2' || !!this.result?.result || this.isResult2() || this.hasAnalysisForm();
  }

  getFilePath(file: any): string {
    if (typeof file === 'string') {
      return file;
    }
    return file?.path || file?.url || '';
  }

  private bindAnalysisForm() {
    const analysisForm = this.result?.analysisForm;
    this.mappingPositionImages = this.mapFileList(analysisForm?.mappingPositionUrl, 'mapping');
    this.analysisItems = Array.isArray(analysisForm?.analysis)
      ? analysisForm.analysis.map((item: any, index: number) => {
        return {
          no: item?.no || index + 1,
          fmPosition: item?.fmPosition || '',
          sizeLength: item?.sizeLength || '',
          sizeWidth: item?.sizeWidth || '',
          material: item?.material || '',
          estimateResultProcess: item?.estimateResultProcess || '',
          dataCode: item?.dataCode || '',
          color: item?.color || '',
          character: item?.character || '',
          microscopeImages: this.mapFileList(item?.microscopeImages, `microscope-${index + 1}`),
          ftirSpectrumImages: this.mapFileList(item?.ftirSpectrumImages, `ftir-${index + 1}`),
          ftirSpectrumImagesGraph: this.mapFileList(item?.ftirSpectrumImagesGraph, `ftir-graph-${index + 1}`),
        };
      })
      : [];
  }

  private mapFileList(files: any, prefix: string): any[] {
    if (!Array.isArray(files)) {
      return [];
    }

    return files
      .map((file: any, index: number) => this.mapFile(file, prefix, index))
      .filter((file: any) => !!file.path);
  }

  private mapFile(file: any, prefix: string, index: number) {
    if (typeof file === 'string') {
      return {
        name: `${prefix}-${index + 1}`,
        path: file,
        size: ''
      };
    }

    return {
      name: file?.name || `${prefix}-${index + 1}`,
      path: file?.path || file?.url || '',
      size: file?.size || ''
    };
  }

  private ensureResultObject() {
    if (!this.result || Array.isArray(this.result)) {
      this.result = {};
    }
  }

}
