import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment'
import Swal from 'sweetalert2'

// import { saveAs } from 'file-saver';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs'
// import * as ExcelJS from 'exceljs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'app/service/http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { HelperMasterFMService } from 'app/service/helper-master-fm.service';

@Component({
  selector: 'app-reject-form3-fm',
  templateUrl: './reject-form3-fm.component.html',
  styleUrls: ['./reject-form3-fm.component.scss', '../pagesStyle.css']
})
export class RejectForm3FmComponent implements OnInit {

  constructor(
    private api: HttpService,
    // private api: ViewFormService,
    private modalService: NgbModal,
    private route: Router,
    private routerActive: ActivatedRoute,
    private masterFM: HelperMasterFMService
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
    Result2: new FormArray([
      new FormGroup({
        qty: new FormControl(0),
        item: new FormControl(null),
        tempItem: new FormControl(null),
        dropdown: new FormControl(false),
        rootCase: new FormControl(null),
        material: new FormControl(null),
      })
    ]),
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
    OperatorName: new FormControl(null, Validators.required),
    DifficultyOfWork: new FormControl(null, Validators.required),
    CorrectOfWork: new FormControl(null, Validators.required),
    AnalysisTime: new FormControl(null, Validators.required),
    resultItemRequire: new FormControl(true),
    resultAnalysisRequire: new FormControl(true)
  })

  TreatmentOfNg = new FormControl(null, Validators.required);
  // GenItemName = new FormControl(null, Validators.required);

  NoteReject = new FormControl(null);
  NoteApprove = new FormControl(null);

  analysisForm = new FormGroup({
    mappingPositionUrl: new FormControl([], Validators.required),
    analysis: new FormArray([
      new FormGroup({
        no: new FormControl(1, Validators.required),
        fmPosition: new FormControl(null, Validators.required),
        tempFmPosition: new FormControl(null),
        microscopeImages: new FormControl([], Validators.required),
        sizeLength: new FormControl(null, Validators.required),
        sizeWidth: new FormControl(null, Validators.required),
        ftirSpectrumImages: new FormControl([], Validators.required),
        ftirSpectrumImagesGraph: new FormControl([], Validators.required),
        material: new FormControl(null, Validators.required),
        tempMaterial: new FormControl(null),
        estimateResultProcess: new FormControl(null, Validators.required),
        tempEstimateResultProcess: new FormControl(null),
        dataCode: new FormControl(null, Validators.required),
        color: new FormControl(null, Validators.required),
        character: new FormControl(null, Validators.required),
      })
    ])
  })


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
  FmPositionToggle: boolean[] = [];
  FmPositionFilter = [];
  MaterialToggle: boolean[] = [];
  MaterialFilter = [];
  EstimateResultProcessToggle: boolean[] = [];
  EstimateResultProcessFilter = [];
  currentAnalysisIndex = 0; // Track which analysis item is being edited

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

  // ? uploaded analysis form images paths
  uploadedMappingPositionPaths: any[] = [];
  uploadedMicroscopeImagePaths: any[][] = [];
  uploadedFtirSpectrumImagePaths: any[][] = [];
  uploadedFtirSpectrumImagesGraphPaths: any[][] = [];


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

  ResultFMMasterOption: any = []

  OperatorNameOption: any = []
  DifficultyOfWorkOption: any = []
  CorrectOfWorkOption: any = []
  AnalysisTimeOption: any = []

  FM_PositionOption: any = []
  MaterialOption: any = []
  EstimateResultProcessOption: any = []

  VisibleMappingPosition = false;

  // ? filter dropdown
  async ngOnInit(): Promise<void> {
    this.CheckStatusUser();
    this.getForm();
    this.GetListAll()
    this.getReportList();
    this.GetMasterFM()
    // อัปเดต validators หลังจากโหลดข้อมูล
    setTimeout(() => {
      this.updateResult2Validators();
      this.initializeToggleArrays();
      this.controlResultItemRequire()
      this.controlResultAnalysisRequire()
    }, 1000);
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

        this.form = data;
        this.VisibleMappingPosition = !!this.form.requestItem?.includes('AMT');
        this.updateMappingPositionValidator();
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

            console.log(`⚡ ~ :232 ~ ProgressForm3Component ~ result.result2`, result.result2);

            if (result.result2 && result.result2.length > 0 && result.result2[0].item) {
              const result2Array = this.Result2 as FormArray;
              result2Array.clear();
              result.result2.forEach((res: any) => {
                const formGroup = new FormGroup({
                  item: new FormControl(res.item || ''),
                  qty: new FormControl(res.qty || ''),
                  tempItem: new FormControl(res.item || ''),
                  dropdown: new FormControl(res.dropdown || ''),
                  rootCase: new FormControl(res.rootCase || ''),
                  material: new FormControl(res.material || ''),
                });
                result2Array.push(formGroup);
              });
              console.log(1);
              // อัปเดต validators หลังจากโหลด result2
              this.updateResult2Validators();

              // this.ResultForm.get('Result').clearValidators();
              // this.ResultForm.get('Result').updateValueAndValidity();
            } else {
              console.log(2);

              // this.ResultForm.get('Result2').clearValidators();
              // this.ResultForm.get('Result2').updateValueAndValidity();
            }
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
            result.JudgementDefect ? this.JudgementDefect.setValue(result.JudgementDefect) : null
            result.Remark ? this.Remark.setValue(result.Remark) : null
            result.operatorName ? this.OperatorName.setValue(result.operatorName) : null
            result.difficultyOfWork ? this.DifficultyOfWork.setValue(result.difficultyOfWork) : null
            result.correctOfWork ? this.CorrectOfWork.setValue(result.correctOfWork) : null
            result.analysisTime ? this.AnalysisTime.setValue(result.analysisTime) : null

            result.resultItemRequire ? this.ResultItemRequire.setValue(result.resultItemRequire) : this.ResultItemRequire.setValue(false)
            result.resultAnalysisRequire ? this.ResultAnalysisRequire.setValue(result.resultAnalysisRequire) : this.ResultAnalysisRequire.setValue(false)


            // * Bind analysisForm data from result
            if (result.analysisForm) {
              // Reset analysis image states before binding
              this.mappingPositionPreviews = [];
              this.mappingPositionFiles = [];
              this.uploadedMappingPositionPaths = [];
              this.microscopeImagePreviews = [];
              this.microscopeImageFiles = [];
              this.uploadedMicroscopeImagePaths = [];
              this.ftirSpectrumImagePreviews = [];
              this.ftirSpectrumImageFiles = [];
              this.uploadedFtirSpectrumImagePaths = [];
              this.ftirSpectrumImagesGraphPreviews = [];
              this.ftirSpectrumImagesGraphFiles = [];
              this.uploadedFtirSpectrumImagesGraphPaths = [];

              // Bind mappingPositionUrl and restore uploaded paths
              if (result.analysisForm.mappingPositionUrl) {
                const mappingImages = Array.isArray(result.analysisForm.mappingPositionUrl)
                  ? result.analysisForm.mappingPositionUrl.slice(0, this.MAX_MAPPING_POSITION_IMAGES)
                  : [];
                this.mappingPositionUrl.setValue(mappingImages);
                this.uploadedMappingPositionPaths = mappingImages;
                // Load preview images
                this.mappingPositionPreviews = mappingImages.map(item => item.path);
              }

              // Bind analysis items
              if (result.analysisForm.analysis && result.analysisForm.analysis.length > 0) {
                result.analysisForm.analysis = result.analysisForm.analysis.sort((a: any, b: any) => a.no - b.no); // Sort by 'no' field
                const analysisArray = this.analysisFormArray;
                analysisArray.clear();

                result.analysisForm.analysis.forEach((item: any, index: number) => {
                  const microscopeImages = Array.isArray(item.microscopeImages)
                    ? item.microscopeImages.slice(0, this.MAX_MICROSCOPE_IMAGES_PER_ITEM)
                    : [];
                  const ftirSpectrumImages = Array.isArray(item.ftirSpectrumImages)
                    ? item.ftirSpectrumImages.slice(0, this.MAX_FTIR_IMAGES_PER_ITEM)
                    : [];
                  const ftirSpectrumImagesGraph = Array.isArray(item.ftirSpectrumImagesGraph)
                    ? item.ftirSpectrumImagesGraph.slice(0, this.MAX_FTIR_IMAGES_PER_ITEM_GRAPH)
                    : [];

                  const formGroup = new FormGroup({
                    no: new FormControl(item.no || index + 1, Validators.required),
                    fmPosition: new FormControl(item.fmPosition, Validators.required),
                    tempFmPosition: new FormControl(null),
                    microscopeImages: new FormControl(microscopeImages, Validators.required),
                    sizeLength: new FormControl(item.sizeLength, Validators.required),
                    sizeWidth: new FormControl(item.sizeWidth, Validators.required),
                    ftirSpectrumImages: new FormControl(ftirSpectrumImages, Validators.required),
                    ftirSpectrumImagesGraph: new FormControl(ftirSpectrumImagesGraph, Validators.required),
                    material: new FormControl(item.material, Validators.required),
                    tempMaterial: new FormControl(null),
                    estimateResultProcess: new FormControl(item.estimateResultProcess, Validators.required),
                    tempEstimateResultProcess: new FormControl(null),
                    dataCode: new FormControl(item.dataCode, Validators.required),
                    color: new FormControl(item.color, Validators.required),
                    character: new FormControl(item.character, Validators.required),
                  });
                  analysisArray.push(formGroup);

                  // Restore uploaded paths for each analysis item
                  if (microscopeImages.length > 0) {
                    this.uploadedMicroscopeImagePaths[index] = microscopeImages;
                    this.microscopeImagePreviews[index] = microscopeImages.map(img => img.path);
                  }

                  if (ftirSpectrumImages.length > 0) {
                    this.uploadedFtirSpectrumImagePaths[index] = ftirSpectrumImages;
                    this.ftirSpectrumImagePreviews[index] = ftirSpectrumImages.map(img => img.path);
                  }

                  if (ftirSpectrumImagesGraph.length > 0) {
                    this.uploadedFtirSpectrumImagesGraphPaths[index] = ftirSpectrumImagesGraph;
                    this.ftirSpectrumImagesGraphPreviews[index] = ftirSpectrumImagesGraph.map(img => img.path);
                  }
                });

                // Initialize toggle arrays after loading data
                this.initializeToggleArrays();
              }
            }

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
            this.GetResultFMMaster()

          }
          // todo no result
          else {
            this.SetAnalysisNo();
            this.GetApproveList();
            this.GetCause();
            this.GetResultFMMaster()
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
        this.JudgementDefects = data.filter((i: any) => i.nameMaster == environment.JudgementDefect)

        this.OperatorNameOption = data.filter((i: any) => i.nameMaster == environment.OperatorName)
        this.DifficultyOfWorkOption = data.filter((i: any) => i.nameMaster == environment.DifficultyOfWork)
        this.CorrectOfWorkOption = data.filter((i: any) => i.nameMaster == environment.CorrectOfWork)
        this.AnalysisTimeOption = data.filter((i: any) => i.nameMaster == environment.AnalysisTime)
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

  async GetMasterFM() {
    let master = await this.masterFM.getMaster()
    this.FM_PositionOption = master.fmPositions
    this.FmPositionFilter = master.fmPositions
    this.MaterialOption = master.materials
    this.MaterialFilter = master.materials
    this.EstimateResultProcessOption = master.estimateResultProcess
    this.EstimateResultProcessFilter = master.estimateResultProcess
    console.log(`⚡ ~ :374 ~ ProgressForm3FmComponent ~ master:`, master);

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

  GetResultFMMaster() {
    let type = this.form.requestItem.includes('DST') ? 'DST' : 'AMT'
    this.api.getResultFMMaster(new HttpParams().set('type', type)).subscribe((res: any) => {


      if (res.data.length > 0) {
        this.ResultFMMasterOption = res.data


      } else {
        this.ResultFMMasterOption = []
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

  ToggleFmPositionFilter() {
    this.FmPositionToggle[this.currentAnalysisIndex] = !this.FmPositionToggle[this.currentAnalysisIndex];
  }

  FilterFmPosition() {
    const analysisArray = this.analysisForm.get('analysis') as FormArray;
    const currentControl = analysisArray.at(this.currentAnalysisIndex);
    const searchValue = currentControl.get('fmPosition').value;

    if (searchValue) {
      this.FmPositionFilter = this.FM_PositionOption.filter(
        item => item.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else {
      this.FmPositionFilter = this.FM_PositionOption;
    }
  }

  SetFmPosition() {
    const analysisArray = this.analysisForm.get('analysis') as FormArray;
    const currentControl = analysisArray.at(this.currentAnalysisIndex);
    currentControl.get('fmPosition').setValue(currentControl.get('tempFmPosition').value);
  }

  ToggleMaterialFilter() {
    this.MaterialToggle[this.currentAnalysisIndex] = !this.MaterialToggle[this.currentAnalysisIndex];
  }

  FilterMaterial() {
    const analysisArray = this.analysisForm.get('analysis') as FormArray;
    const currentControl = analysisArray.at(this.currentAnalysisIndex);
    const searchValue = currentControl.get('material').value;

    if (searchValue) {
      this.MaterialFilter = this.MaterialOption.filter(
        item => item.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else {
      this.MaterialFilter = this.MaterialOption;
    }
  }

  SetMaterial() {
    const analysisArray = this.analysisForm.get('analysis') as FormArray;
    const currentControl = analysisArray.at(this.currentAnalysisIndex);
    currentControl.get('material').setValue(currentControl.get('tempMaterial').value);
  }

  ToggleEstimateResultProcessFilter() {
    this.EstimateResultProcessToggle[this.currentAnalysisIndex] = !this.EstimateResultProcessToggle[this.currentAnalysisIndex];
  }

  FilterEstimateResultProcess() {
    const analysisArray = this.analysisForm.get('analysis') as FormArray;
    const currentControl = analysisArray.at(this.currentAnalysisIndex);
    const searchValue = currentControl.get('estimateResultProcess').value;

    if (searchValue) {
      this.EstimateResultProcessFilter = this.EstimateResultProcessOption.filter(
        item => item.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else {
      this.EstimateResultProcessFilter = this.EstimateResultProcessOption;
    }
  }

  SetEstimateResultProcess() {
    const analysisArray = this.analysisForm.get('analysis') as FormArray;
    const currentControl = analysisArray.at(this.currentAnalysisIndex);
    currentControl.get('estimateResultProcess').setValue(currentControl.get('tempEstimateResultProcess').value);
  }

  initializeToggleArrays() {
    const analysisArray = this.analysisForm.get('analysis') as FormArray;
    const arrayLength = analysisArray.length;

    // Initialize or extend arrays to match the form array length
    this.FmPositionToggle = Array(arrayLength).fill(false);
    this.MaterialToggle = Array(arrayLength).fill(false);
    this.EstimateResultProcessToggle = Array(arrayLength).fill(false);
  }

  SetApproveEmail() {
    this.ApproveList.forEach(item => {
      this.Approve.value == item._id ? this.SendEmailUser = item : false
    });
  }


  getDropdown(control: any): Boolean {
    let result = control.get('dropdown').value;
    return result ?? false;
  }
  ToggleResultFMFilter(control: any) {
    let result = control.get('dropdown').value;
    control.get('dropdown').setValue(!result);
  }
  getResultFMFilter(control: any) {
    let value = control.get('item').value;
    if (value) {
      return this.ResultFMMasterOption.filter(
        item => item.item.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      return this.ResultFMMasterOption;
    }
  }

  SetResultFM(control: any) {
    let tempIte = control.get('tempItem').value;
    control.get('item').setValue(tempIte);
    control.get('tempItem').reset()
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

  async onSaveResult() {
    console.log(this.ResultForm.value);

    Swal.fire({
      title: 'Do you want to save ?',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then(async answer => {
      if (answer.isConfirmed) {
        // Upload analysis form images if any exist
        const hasAnalysisImages =
          (this.mappingPositionFiles && this.mappingPositionFiles.length > 0) ||
          (this.microscopeImageFiles && this.microscopeImageFiles.some(arr => arr && arr.length > 0)) ||
          (this.ftirSpectrumImageFiles && this.ftirSpectrumImageFiles.some(arr => arr && arr.length > 0)) ||
          (this.ftirSpectrumImagesGraphFiles && this.ftirSpectrumImagesGraphFiles.some(arr => arr && arr.length > 0));

        if (hasAnalysisImages) {
          const uploadSuccess = await this.uploadAllFilesAnalysisForm();
          if (!uploadSuccess) {
            Swal.fire({
              title: 'Upload Failed',
              text: 'Failed to upload some analysis images',
              icon: 'error',
              showConfirmButton: true
            });
            return;
          }
        }

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

  async uploadAllFilesAnalysisForm(): Promise<boolean> {
    const uploadPromises: Promise<any>[] = [];
    const requestNo = this.form?.requestNumber || 'unknown-request';

    // Keep existing paths and enforce max per field.
    this.uploadedMappingPositionPaths = (this.uploadedMappingPositionPaths || []).slice(0, this.MAX_MAPPING_POSITION_IMAGES);
    this.uploadedMicroscopeImagePaths = (this.uploadedMicroscopeImagePaths || []).map((paths: any[]) =>
      (paths || []).slice(0, this.MAX_MICROSCOPE_IMAGES_PER_ITEM)
    );
    this.uploadedFtirSpectrumImagePaths = (this.uploadedFtirSpectrumImagePaths || []).map((paths: any[]) =>
      (paths || []).slice(0, this.MAX_FTIR_IMAGES_PER_ITEM)
    );
    this.uploadedFtirSpectrumImagesGraphPaths = (this.uploadedFtirSpectrumImagesGraphPaths || []).map((paths: any[]) =>
      (paths || []).slice(0, this.MAX_FTIR_IMAGES_PER_ITEM_GRAPH)
    );

    try {
      // Upload Mapping Position images
      if (this.mappingPositionFiles && this.mappingPositionFiles.length > 0) {
        for (let i = 0; i < this.mappingPositionFiles.length && this.uploadedMappingPositionPaths.length < this.MAX_MAPPING_POSITION_IMAGES; i++) {
          const file = this.mappingPositionFiles[i];
          const fileName = `${requestNo}_MappingPosition_${i + 1}_${file.name}`;

          const uploadPromise = this.api.UploadFileEng(file, fileName)
            .then((data: any) => {
              if (data) {
                const path = {
                  path: data,
                  name: fileName,
                  size: file.size
                };
                this.uploadedMappingPositionPaths.push(path);
                console.log(`Mapping Position image ${i + 1} uploaded successfully`);
                return data;
              } else {
                throw new Error(`Failed to upload Mapping Position image ${i + 1}`);
              }
            })
            .catch((error) => {
              console.error(`Mapping Position image ${i + 1} upload failed:`, error);
              throw error;
            });

          uploadPromises.push(uploadPromise);
        }
      }

      // Upload Microscope images (2D array)
      if (this.microscopeImageFiles && this.microscopeImageFiles.length > 0) {
        for (let analysisIdx = 0; analysisIdx < this.microscopeImageFiles.length; analysisIdx++) {
          const imageArray = this.microscopeImageFiles[analysisIdx];
          if (!this.uploadedMicroscopeImagePaths[analysisIdx]) {
            this.uploadedMicroscopeImagePaths[analysisIdx] = [];
          }

          if (imageArray && imageArray.length > 0) {
            for (let imgIdx = 0; imgIdx < imageArray.length && this.uploadedMicroscopeImagePaths[analysisIdx].length < this.MAX_MICROSCOPE_IMAGES_PER_ITEM; imgIdx++) {
              const file = imageArray[imgIdx];
              const fileName = `${requestNo}_Microscope_Item${analysisIdx + 1}_Img${imgIdx + 1}_${file.name}`;

              const uploadPromise = this.api.UploadFileEng(file, fileName)
                .then((data: any) => {
                  if (data) {
                    const path = {
                      path: data,
                      name: fileName,
                      size: file.size
                    };
                    this.uploadedMicroscopeImagePaths[analysisIdx].push(path);
                    console.log(`Microscope image [${analysisIdx}][${imgIdx}] uploaded successfully`);
                    return data;
                  } else {
                    throw new Error(`Failed to upload Microscope image [${analysisIdx}][${imgIdx}]`);
                  }
                })
                .catch((error) => {
                  console.error(`Microscope image [${analysisIdx}][${imgIdx}] upload failed:`, error);
                  throw error;
                });

              uploadPromises.push(uploadPromise);
            }
          }
        }
      }

      // Upload FT-IR Spectrum images (2D array)
      if (this.ftirSpectrumImageFiles && this.ftirSpectrumImageFiles.length > 0) {
        for (let analysisIdx = 0; analysisIdx < this.ftirSpectrumImageFiles.length; analysisIdx++) {
          const imageArray = this.ftirSpectrumImageFiles[analysisIdx];
          if (!this.uploadedFtirSpectrumImagePaths[analysisIdx]) {
            this.uploadedFtirSpectrumImagePaths[analysisIdx] = [];
          }

          if (imageArray && imageArray.length > 0) {
            for (let imgIdx = 0; imgIdx < imageArray.length && this.uploadedFtirSpectrumImagePaths[analysisIdx].length < this.MAX_FTIR_IMAGES_PER_ITEM; imgIdx++) {
              const file = imageArray[imgIdx];
              const fileName = `${requestNo}_FTIR_Item${analysisIdx + 1}_Img${imgIdx + 1}_${file.name}`;

              const uploadPromise = this.api.UploadFileEng(file, fileName)
                .then((data: any) => {
                  if (data) {
                    const path = {
                      path: data,
                      name: fileName,
                      size: file.size
                    };
                    this.uploadedFtirSpectrumImagePaths[analysisIdx].push(path);
                    console.log(`FT-IR Spectrum image [${analysisIdx}][${imgIdx}] uploaded successfully`);
                    return data;
                  } else {
                    throw new Error(`Failed to upload FT-IR Spectrum image [${analysisIdx}][${imgIdx}]`);
                  }
                })
                .catch((error) => {
                  console.error(`FT-IR Spectrum image [${analysisIdx}][${imgIdx}] upload failed:`, error);
                  throw error;
                });

              uploadPromises.push(uploadPromise);
            }
          }
        }
      }

      // Upload FT-IR Spectrum Graph images (2D array)
      if (this.ftirSpectrumImagesGraphFiles && this.ftirSpectrumImagesGraphFiles.length > 0) {
        for (let analysisIdx = 0; analysisIdx < this.ftirSpectrumImagesGraphFiles.length; analysisIdx++) {
          const imageArray = this.ftirSpectrumImagesGraphFiles[analysisIdx];
          if (!this.uploadedFtirSpectrumImagesGraphPaths[analysisIdx]) {
            this.uploadedFtirSpectrumImagesGraphPaths[analysisIdx] = [];
          }

          if (imageArray && imageArray.length > 0) {
            for (let imgIdx = 0; imgIdx < imageArray.length && this.uploadedFtirSpectrumImagesGraphPaths[analysisIdx].length < this.MAX_FTIR_IMAGES_PER_ITEM_GRAPH; imgIdx++) {
              const file = imageArray[imgIdx];
              const fileName = `${requestNo}_FTIR_Graph_Item${analysisIdx + 1}_Img${imgIdx + 1}_${file.name}`;

              const uploadPromise = this.api.UploadFileEng(file, fileName)
                .then((data: any) => {
                  if (data) {
                    const path = {
                      path: data,
                      name: fileName,
                      size: file.size
                    };
                    this.uploadedFtirSpectrumImagesGraphPaths[analysisIdx].push(path);
                    console.log(`FT-IR Spectrum Graph image [${analysisIdx}][${imgIdx}] uploaded successfully`);
                    return data;
                  } else {
                    throw new Error(`Failed to upload FT-IR Spectrum Graph image [${analysisIdx}][${imgIdx}]`);
                  }
                })
                .catch((error) => {
                  console.error(`FT-IR Spectrum Graph image [${analysisIdx}][${imgIdx}] upload failed:`, error);
                  throw error;
                });

              uploadPromises.push(uploadPromise);
            }
          }
        }
      }

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);

      // Clear temporary selected files after successful upload.
      this.mappingPositionFiles = [];
      this.microscopeImageFiles = [];
      this.ftirSpectrumImageFiles = [];
      this.ftirSpectrumImagesGraphFiles = [];

      console.log('All analysis form files uploaded successfully');
      return true;

    } catch (error) {
      console.error('Analysis form file upload failed:', error);
      return false;
    }
  }

  insertResultWhenFinish(formId: string) {

    return new Promise(async resolve => {
      const ResultData = {
        analysisReportNo: this.ReportNo.value,
        formId: formId,
        engineerId: localStorage.getItem('AR_UserId'),
        engineerName: (localStorage.getItem('AR_UserFirstName') + "-" + localStorage.getItem('AR_UserLastName')),
        result: this.Result.value || null,
        result2: this.Result2.value || null,
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
        operatorName: this.OperatorName.value || null,
        difficultyOfWork: this.DifficultyOfWork.value || null,
        correctOfWork: this.CorrectOfWork.value || null,
        analysisTime: this.AnalysisTime.value || null,

        resultItemRequire: this.ResultItemRequire.value,
        resultAnalysisRequire: this.ResultAnalysisRequire.value,

        // Analysis form data with uploaded image paths (formatted according to Schema)
        analysisForm: {
          mappingPositionUrl: this.uploadedMappingPositionPaths,
          analysis: this.analysisForm.value.analysis ? this.analysisForm.value.analysis.map((item: any, index: number) => ({
            no: item.no,
            fmPosition: item.fmPosition,
            microscopeImages: this.uploadedMicroscopeImagePaths[index] || [],
            sizeLength: item.sizeLength,
            sizeWidth: item.sizeWidth,
            ftirSpectrumImages: this.uploadedFtirSpectrumImagePaths[index] || [],
            ftirSpectrumImagesGraph: this.uploadedFtirSpectrumImagesGraphPaths[index] || [],
            material: item.material,
            estimateResultProcess: item.estimateResultProcess,
            dataCode: item.dataCode,
            color: item.color,
            character: item.character,
          })) : []
        },
      }
      this.api.PostResult(ResultData).subscribe((data: any) => {
        resolve(data)
      })
    })
  }
  //TODO
  updateResultWhenDraft(resultId: string) {
    return new Promise(resolve => {
      let analysisFormValue = this.analysisForm.value

      console.log(`⚡ ~ :620 ~ ProgressForm3FmComponent ~ analysisFormValue:`, analysisFormValue);
      console.log(`⚡ ~ :620 ~ ProgressForm3FmComponent ~ this.Result2.value:`, this.Result2.value);

      const ResultData = {
        result: this.Result.value || null,
        result2: this.Result2.value || null,
        causeOfDefect: this.CategoryCause.value || null,
        sourceOfDefect: this.SourceOfDefect.value || null,
        analysisLevel: this.AnalysisLevel.value || null,
        canAnalysis: this.CanAnalysis.value || null,
        relatedToESD: this.RelatedToESD.value || null,
        startAnalyzeDate: this.AnalyzeDate.value || null,
        finishAnalyzeDate: this.ResultDate.value || null,
        finishReportDate: this.ReportDate.value || null,
        treatMent: this.TreatmentOfNg.value || null,
        JudgementDefect: this.JudgementDefect.value || null,
        Remark: this.Remark.value || null,
        operatorName: this.OperatorName.value || null,
        difficultyOfWork: this.DifficultyOfWork.value || null,
        correctOfWork: this.CorrectOfWork.value || null,
        analysisTime: this.AnalysisTime.value || null,

        resultItemRequire: this.ResultItemRequire.value,
        resultAnalysisRequire: this.ResultAnalysisRequire.value,

        // Analysis form data with uploaded image paths (formatted according to Schema)
        analysisForm: {
          mappingPositionUrl: this.uploadedMappingPositionPaths,
          analysis: analysisFormValue.analysis ? analysisFormValue.analysis.map((item: any, index: number) => ({
            no: item.no,
            fmPosition: item.fmPosition,
            microscopeImages: this.uploadedMicroscopeImagePaths[index] || [],
            sizeLength: item.sizeLength,
            sizeWidth: item.sizeWidth,
            ftirSpectrumImages: this.uploadedFtirSpectrumImagePaths[index] || [],
            ftirSpectrumImagesGraph: this.uploadedFtirSpectrumImagesGraphPaths[index] || [],
            material: item.material,
            estimateResultProcess: item.estimateResultProcess,
            dataCode: item.dataCode,
            color: item.color,
            character: item.character,
          })) : []
        },
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
      // Upload analysis form images (mapping position, microscope, ftir spectrum)
      await this.uploadAllFilesAnalysisForm();
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
        result2: this.Result2.value,
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
        JudgementDefect: this.JudgementDefect.value,
        Remark: this.Remark.value,

        operatorName: this.OperatorName.value || null,
        difficultyOfWork: this.DifficultyOfWork.value || null,
        correctOfWork: this.CorrectOfWork.value || null,
        analysisTime: this.AnalysisTime.value || null,

        resultItemRequire: this.ResultItemRequire.value,
        resultAnalysisRequire: this.ResultAnalysisRequire.value,

        // Analysis form data with uploaded image paths (formatted according to Schema)
        analysisForm: {
          mappingPositionUrl: this.uploadedMappingPositionPaths,
          analysis: this.analysisForm.value.analysis ? this.analysisForm.value.analysis.map((item: any, index: number) => ({
            no: item.no,
            fmPosition: item.fmPosition,
            microscopeImages: this.uploadedMicroscopeImagePaths[index] || [],
            sizeLength: item.sizeLength,
            sizeWidth: item.sizeWidth,
            ftirSpectrumImages: this.uploadedFtirSpectrumImagePaths[index] || [],
            ftirSpectrumImagesGraph: this.uploadedFtirSpectrumImagesGraphPaths[index] || [],
            material: item.material,
            estimateResultProcess: item.estimateResultProcess,
            dataCode: item.dataCode,
            color: item.color,
            character: item.character,
          })) : []
        },
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
                JudgementDefect: this.JudgementDefect.value,
                Remark: this.Remark.value,
              }
              this.api.UpdateForm(this.formId, d).subscribe((data: any) => {
                let Fname = localStorage.getItem('AR_UserFirstName')
                let Lname = localStorage.getItem('AR_UserLastName')
                if (data) {
                  const Content = "<p>To " + this.SendEmailUser.FirstName + " " + this.SendEmailUser.LastName + "(AE Reviewer)</p><br>" +
                    "Please review analysis report as below link : <a href='http://10.200.90.152:8081/Analysis-Report/'>http://10.200.90.152:8081/Analysis-Report/</a><br><br>" +
                    "<p>From " + Fname + " " + Lname + "(AE Engineer)</p>";

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
                      // window.self.close();
                      this.route.navigate(['/manageForm'])

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
                JudgementDefect: this.JudgementDefect.value,
                Remark: this.Remark.value,
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
            JudgementDefect: this.JudgementDefect.value,
            Remark: this.Remark.value,
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

    Swal.fire({
      title: 'Do you want to generate report file ?',
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: 'Generate',
    }).then((result) => {
      if (result.isConfirmed) {
        if (!(this.AnalyzeDate.valid && this.ResultDate.valid && this.ReportDate.valid)) {
          Swal.fire({
            title: 'Error',
            text: 'Please fill : start analyze date , finished analysis result date , finished analysis report date',
            icon: 'error'
          });
          return;
        }

        if (!this.formId) {
          Swal.fire({
            title: 'Error',
            text: 'Form id is missing.',
            icon: 'error'
          });
          return;
        }

        const fallbackFileName = `${this.form?.requestNumber || 'ReportFM'}.xlsx`;

        this.api.generateReportFM(this.formId).subscribe({
          next: (response) => {
            const fileName = this.getDownloadFileName(
              response.headers.get('Content-Disposition'),
              fallbackFileName
            );
            const blob = response.body || new Blob([], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            fs.saveAs(blob, fileName);
            // todo patch result from api
            this.api.FindResultByFormIdMain(this.formId).subscribe((data: any) => {
              if (data.length > 0) {
                const result = data[0]
                this.toggleAttReportEng = true;
                this.File.setValue(result.file);
                this.tempFileReportName = result.file ? result.file.replace('http://10.200.90.152:4501/ENG/Report/', '') : '';
              }
            });
          },
          error: () => {
            Swal.fire({
              title: 'Error',
              text: 'Failed to generate report file.',
              icon: 'error'
            });
          }
        });
      }
    })



  }
  private getDownloadFileName(contentDisposition: string | null, fallbackFileName: string) {
    if (!contentDisposition) {
      return fallbackFileName;
    }

    const encodedMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (encodedMatch?.[1]) {
      return decodeURIComponent(encodedMatch[1]).replace(/['"]/g, '');
    }

    const fileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
    if (fileNameMatch?.[1]) {
      return fileNameMatch[1].trim();
    }

    return fallbackFileName;
  }


  isFM() {
    if (this.form?.requestItem)
      return (this.form.requestItem).includes('FM')
    return false
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

  newResultFM() {
    const result2Array = this.Result2 as FormArray;
    const isFM = this.isFM();

    const newItem = new FormGroup({
      item: new FormControl('', isFM ? Validators.required : null),
      qty: new FormControl(0, isFM ? Validators.required : null),
      tempItem: new FormControl(''),
      dropdown: new FormControl(false),
      rootCase: new FormControl(null),
      material: new FormControl(null),
    });
    result2Array.push(newItem);
  }

  removeResultFM(index: number) {
    const result2Array = this.Result2 as FormArray;
    if (result2Array.length > 1) {
      result2Array.removeAt(index);
    }
  }

  moveResultFMUp(index: number) {
    if (index > 0) {
      const result2Array = this.Result2 as FormArray;
      const currentItem = result2Array.at(index);
      result2Array.removeAt(index);
      result2Array.insert(index - 1, currentItem);
    }
  }

  moveResultFMDown(index: number) {
    const result2Array = this.Result2 as FormArray;
    if (index < result2Array.length - 1) {
      const currentItem = result2Array.at(index);
      result2Array.removeAt(index);
      result2Array.insert(index + 1, currentItem);
    }
  }

  // Analysis Form Array Methods
  addAnalysisItem() {
    const analysisArray = this.analysisFormArray;
    const newItem = new FormGroup({
      no: new FormControl(analysisArray.length + 1, Validators.required),
      fmPosition: new FormControl(null, Validators.required),
      tempFmPosition: new FormControl(null),
      microscopeImages: new FormControl([], Validators.required),
      sizeLength: new FormControl(null, Validators.required),
      sizeWidth: new FormControl(null, Validators.required),
      ftirSpectrumImages: new FormControl([], Validators.required),
      ftirSpectrumImagesGraph: new FormControl([], Validators.required),
      material: new FormControl(null, Validators.required),
      tempMaterial: new FormControl(null),
      estimateResultProcess: new FormControl(null, Validators.required),
      tempEstimateResultProcess: new FormControl(null),
      dataCode: new FormControl(null, Validators.required),
      color: new FormControl(null, Validators.required),
      character: new FormControl(null, Validators.required),
      result: new FormControl(null, Validators.required),
    });
    analysisArray.push(newItem);

    // Add new toggle states for the new item
    this.FmPositionToggle.push(false);
    this.MaterialToggle.push(false);
    this.EstimateResultProcessToggle.push(false);
  }

  removeAnalysisItem(index: number) {
    const analysisArray = this.analysisFormArray;
    if (analysisArray.length > 1) {
      analysisArray.removeAt(index);
      // Remove images at this index
      this.microscopeImageFiles.splice(index, 1);
      this.microscopeImagePreviews.splice(index, 1);
      this.uploadedMicroscopeImagePaths.splice(index, 1);
      this.ftirSpectrumImageFiles.splice(index, 1);
      this.ftirSpectrumImagePreviews.splice(index, 1);
      this.uploadedFtirSpectrumImagePaths.splice(index, 1);
      this.ftirSpectrumImagesGraphFiles.splice(index, 1);
      this.ftirSpectrumImagesGraphPreviews.splice(index, 1);
      this.uploadedFtirSpectrumImagesGraphPaths.splice(index, 1);

      // Remove toggle states at this index
      this.FmPositionToggle.splice(index, 1);
      this.MaterialToggle.splice(index, 1);
      this.EstimateResultProcessToggle.splice(index, 1);

      // Update the 'no' field for remaining items
      analysisArray.controls.forEach((control, i) => {
        control.get('no')?.setValue(i + 1);
      });
    }
  }

  moveAnalysisItemUp(index: number) {
    if (index > 0) {
      const analysisArray = this.analysisFormArray;
      const currentItem = analysisArray.at(index);
      analysisArray.removeAt(index);
      analysisArray.insert(index - 1, currentItem);

      // Move images accordingly
      const swapArrayElements = (arr: any[], idx1: number, idx2: number) => {
        if (arr[idx1] !== undefined || arr[idx2] !== undefined) {
          const temp = arr[idx1];
          arr[idx1] = arr[idx2];
          arr[idx2] = temp;
        }
      };

      swapArrayElements(this.microscopeImageFiles, index, index - 1);
      swapArrayElements(this.microscopeImagePreviews, index, index - 1);
      swapArrayElements(this.uploadedMicroscopeImagePaths, index, index - 1);
      swapArrayElements(this.ftirSpectrumImageFiles, index, index - 1);
      swapArrayElements(this.ftirSpectrumImagePreviews, index, index - 1);
      swapArrayElements(this.uploadedFtirSpectrumImagePaths, index, index - 1);
      swapArrayElements(this.ftirSpectrumImagesGraphFiles, index, index - 1);
      swapArrayElements(this.ftirSpectrumImagesGraphPreviews, index, index - 1);
      swapArrayElements(this.uploadedFtirSpectrumImagesGraphPaths, index, index - 1);

      // Update the 'no' field for all items
      analysisArray.controls.forEach((control, i) => {
        control.get('no')?.setValue(i + 1);
      });
    }
  }

  moveAnalysisItemDown(index: number) {
    const analysisArray = this.analysisFormArray;
    if (index < analysisArray.length - 1) {
      const currentItem = analysisArray.at(index);
      analysisArray.removeAt(index);
      analysisArray.insert(index + 1, currentItem);

      // Move images accordingly
      const swapArrayElements = (arr: any[], idx1: number, idx2: number) => {
        if (arr[idx1] !== undefined || arr[idx2] !== undefined) {
          const temp = arr[idx1];
          arr[idx1] = arr[idx2];
          arr[idx2] = temp;
        }
      };

      swapArrayElements(this.microscopeImageFiles, index, index + 1);
      swapArrayElements(this.microscopeImagePreviews, index, index + 1);
      swapArrayElements(this.uploadedMicroscopeImagePaths, index, index + 1);
      swapArrayElements(this.ftirSpectrumImageFiles, index, index + 1);
      swapArrayElements(this.ftirSpectrumImagePreviews, index, index + 1);
      swapArrayElements(this.uploadedFtirSpectrumImagePaths, index, index + 1);
      swapArrayElements(this.ftirSpectrumImagesGraphFiles, index, index + 1);
      swapArrayElements(this.ftirSpectrumImagesGraphPreviews, index, index + 1);
      swapArrayElements(this.uploadedFtirSpectrumImagesGraphPaths, index, index + 1);

      // Update the 'no' field for all items
      analysisArray.controls.forEach((control, i) => {
        control.get('no')?.setValue(i + 1);
      });
    }
  }

  // Maximum images allowed per field (set independently per field)
  readonly MAX_MAPPING_POSITION_IMAGES = 1;
  readonly MAX_MICROSCOPE_IMAGES_PER_ITEM = 1;
  readonly MAX_FTIR_IMAGES_PER_ITEM = 1;
  readonly MAX_FTIR_IMAGES_PER_ITEM_GRAPH = 1;

  // Image preview URLs
  mappingPositionPreviews: (string | ArrayBuffer)[] = [];
  // Array 2 มิติ: [analysisIndex][imageIndex]
  microscopeImagePreviews: (string | ArrayBuffer)[][] = [];
  ftirSpectrumImagePreviews: (string | ArrayBuffer)[][] = [];
  ftirSpectrumImagesGraphPreviews: (string | ArrayBuffer)[][] = [];

  // Store actual file objects
  mappingPositionFiles: File[] = [];
  // Array 2 มิติ: [analysisIndex][imageIndex]
  microscopeImageFiles: File[][] = [];
  ftirSpectrumImageFiles: File[][] = [];
  ftirSpectrumImagesGraphFiles: File[][] = [];

  // Handle mapping position image file change
  onMappingPositionFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // ตรวจสอบจำนวนรูปที่อัพโหลดแล้ว
      if (this.mappingPositionPreviews.length >= this.MAX_MAPPING_POSITION_IMAGES) {
        alert(`สามารถอัพโหลดได้สูงสุด ${this.MAX_MAPPING_POSITION_IMAGES} รูปใน Mapping Position`);
        event.target.value = ''; // Reset input
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.mappingPositionPreviews.push(reader.result as string | ArrayBuffer);
      };
      reader.readAsDataURL(file);
      console.log(file);

      // Store file in array
      this.mappingPositionFiles.push(file);
      // Update form control value with file names array
      this.mappingPositionUrl?.setValue(this.mappingPositionPreviews);
      this.mappingPositionUrl?.setErrors(null);
      this.mappingPositionUrl?.markAsTouched();

      // Reset input to allow same file selection again
      event.target.value = '';
    }
  }

  // Delete mapping position image (ลบรูปที่ระบุ index)
  deleteMappingPositionImage(imageIndex: number) {
    const existingCount = this.uploadedMappingPositionPaths.length;

    this.mappingPositionPreviews.splice(imageIndex, 1);
    if (imageIndex < existingCount) {
      this.uploadedMappingPositionPaths.splice(imageIndex, 1);
    } else {
      const fileIndex = imageIndex - existingCount;
      if (fileIndex >= 0 && fileIndex < this.mappingPositionFiles.length) {
        this.mappingPositionFiles.splice(fileIndex, 1);
      }
    }

    this.mappingPositionUrl?.setValue(this.mappingPositionPreviews);
    this.mappingPositionUrl?.updateValueAndValidity();
    this.mappingPositionUrl?.markAsTouched();
  }

  // Handle microscope image file change
  onMicroscopeImageChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      // Initialize array if not exists
      if (!this.microscopeImageFiles[index]) {
        this.microscopeImageFiles[index] = [];
      }
      if (!this.microscopeImagePreviews[index]) {
        this.microscopeImagePreviews[index] = [];
      }

      // ตรวจสอบจำนวนรูปที่อัพโหลดแล้ว
      if (this.microscopeImagePreviews[index].length >= this.MAX_MICROSCOPE_IMAGES_PER_ITEM) {
        alert(`สามารถอัพโหลดได้สูงสุด ${this.MAX_MICROSCOPE_IMAGES_PER_ITEM} รูปใน Microscope`);
        event.target.value = ''; // Reset input
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.microscopeImagePreviews[index].push(reader.result as string | ArrayBuffer);
      };
      reader.readAsDataURL(file);

      // Store file in array
      this.microscopeImageFiles[index].push(file);
      const control = this.analysisFormArray.at(index);
      // Update form control value with file names array
      control.get('microscopeImages')?.setValue(this.microscopeImagePreviews[index]);
      control.get('microscopeImages')?.setErrors(null);
      control.get('microscopeImages')?.markAsTouched();

      // Reset input to allow same file selection again
      event.target.value = '';
    }
  }

  // Delete microscope image (ลบรูปที่ระบุ index)
  deleteMicroscopeImage(analysisIndex: number, imageIndex: number) {
    if (this.microscopeImagePreviews[analysisIndex]) {
      this.microscopeImagePreviews[analysisIndex].splice(imageIndex, 1);
    }
    const existingCount = this.uploadedMicroscopeImagePaths[analysisIndex]?.length || 0;
    if (imageIndex < existingCount) {
      this.uploadedMicroscopeImagePaths[analysisIndex].splice(imageIndex, 1);
    } else if (this.microscopeImageFiles[analysisIndex]) {
      const fileIndex = imageIndex - existingCount;
      if (fileIndex >= 0 && fileIndex < this.microscopeImageFiles[analysisIndex].length) {
        this.microscopeImageFiles[analysisIndex].splice(fileIndex, 1);
      }
    }

    const control = this.analysisFormArray.at(analysisIndex);
    // Check if any images left
    if (!this.microscopeImagePreviews[analysisIndex] || this.microscopeImagePreviews[analysisIndex].length === 0) {
      control.get('microscopeImages')?.setErrors({ required: true });
    } else {
      control.get('microscopeImages')?.setValue(this.microscopeImagePreviews[analysisIndex]);
      control.get('microscopeImages')?.setErrors(null);
    }
    control.get('microscopeImages')?.markAsTouched();
  }

  // Handle FT-IR spectrum image file change
  onFtirSpectrumImageChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      // Initialize array if not exists
      if (!this.ftirSpectrumImageFiles[index]) {
        this.ftirSpectrumImageFiles[index] = [];
      }
      if (!this.ftirSpectrumImagePreviews[index]) {
        this.ftirSpectrumImagePreviews[index] = [];
      }

      // ตรวจสอบจำนวนรูปที่อัพโหลดแล้ว
      if (this.ftirSpectrumImagePreviews[index].length >= this.MAX_FTIR_IMAGES_PER_ITEM) {
        alert(`สามารถอัพโหลดได้สูงสุด ${this.MAX_FTIR_IMAGES_PER_ITEM} รูปใน FT-IR`);
        event.target.value = ''; // Reset input
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.ftirSpectrumImagePreviews[index].push(reader.result as string | ArrayBuffer);
      };
      reader.readAsDataURL(file);

      // Store file in array
      this.ftirSpectrumImageFiles[index].push(file);
      const control = this.analysisFormArray.at(index);
      // Update form control value with file names array
      control.get('ftirSpectrumImages')?.setValue(this.ftirSpectrumImagePreviews[index]);
      control.get('ftirSpectrumImages')?.setErrors(null);
      control.get('ftirSpectrumImages')?.markAsTouched();

      // Reset input to allow same file selection again
      event.target.value = '';
    }
  }

  // Delete FT-IR spectrum image (ลบรูปที่ระบุ index)
  deleteFtirSpectrumImage(analysisIndex: number, imageIndex: number) {
    if (this.ftirSpectrumImagePreviews[analysisIndex]) {
      this.ftirSpectrumImagePreviews[analysisIndex].splice(imageIndex, 1);
    }
    const existingCount = this.uploadedFtirSpectrumImagePaths[analysisIndex]?.length || 0;
    if (imageIndex < existingCount) {
      this.uploadedFtirSpectrumImagePaths[analysisIndex].splice(imageIndex, 1);
    } else if (this.ftirSpectrumImageFiles[analysisIndex]) {
      const fileIndex = imageIndex - existingCount;
      if (fileIndex >= 0 && fileIndex < this.ftirSpectrumImageFiles[analysisIndex].length) {
        this.ftirSpectrumImageFiles[analysisIndex].splice(fileIndex, 1);
      }
    }

    const control = this.analysisFormArray.at(analysisIndex);
    // Check if any images left
    if (!this.ftirSpectrumImagePreviews[analysisIndex] || this.ftirSpectrumImagePreviews[analysisIndex].length === 0) {
      control.get('ftirSpectrumImages')?.setErrors({ required: true });
    } else {
      control.get('ftirSpectrumImages')?.setValue(this.ftirSpectrumImagePreviews[analysisIndex]);
      control.get('ftirSpectrumImages')?.setErrors(null);
    }
    control.get('ftirSpectrumImages')?.markAsTouched();
  }

  // Handle FT-IR spectrum Graph image file change
  onFtirSpectrumImagesGraphChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      // Initialize array if not exists
      if (!this.ftirSpectrumImagesGraphFiles[index]) {
        this.ftirSpectrumImagesGraphFiles[index] = [];
      }
      if (!this.ftirSpectrumImagesGraphPreviews[index]) {
        this.ftirSpectrumImagesGraphPreviews[index] = [];
      }

      // ตรวจสอบจำนวนรูปที่อัพโหลดแล้ว
      if (this.ftirSpectrumImagesGraphPreviews[index].length >= this.MAX_FTIR_IMAGES_PER_ITEM_GRAPH) {
        alert(`สามารถอัพโหลดได้สูงสุด ${this.MAX_FTIR_IMAGES_PER_ITEM_GRAPH} รูปใน FT-IR Graph`);
        event.target.value = ''; // Reset input
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.ftirSpectrumImagesGraphPreviews[index].push(reader.result as string | ArrayBuffer);
      };
      reader.readAsDataURL(file);

      // Store file in array
      this.ftirSpectrumImagesGraphFiles[index].push(file);
      const control = this.analysisFormArray.at(index);
      // Update form control value with file names array
      control.get('ftirSpectrumImagesGraph')?.setValue(this.ftirSpectrumImagesGraphPreviews[index]);
      control.get('ftirSpectrumImagesGraph')?.setErrors(null);
      control.get('ftirSpectrumImagesGraph')?.markAsTouched();

      // Reset input to allow same file selection again
      event.target.value = '';
    }
  }

  // Delete FT-IR spectrum Graph image (ลบรูปที่ระบุ index)
  deleteFtirSpectrumImagesGraph(analysisIndex: number, imageIndex: number) {
    if (this.ftirSpectrumImagesGraphPreviews[analysisIndex]) {
      this.ftirSpectrumImagesGraphPreviews[analysisIndex].splice(imageIndex, 1);
    }
    const existingCount = this.uploadedFtirSpectrumImagesGraphPaths[analysisIndex]?.length || 0;
    if (imageIndex < existingCount) {
      this.uploadedFtirSpectrumImagesGraphPaths[analysisIndex].splice(imageIndex, 1);
    } else if (this.ftirSpectrumImagesGraphFiles[analysisIndex]) {
      const fileIndex = imageIndex - existingCount;
      if (fileIndex >= 0 && fileIndex < this.ftirSpectrumImagesGraphFiles[analysisIndex].length) {
        this.ftirSpectrumImagesGraphFiles[analysisIndex].splice(fileIndex, 1);
      }
    }

    const control = this.analysisFormArray.at(analysisIndex);
    // Check if any images left
    if (!this.ftirSpectrumImagesGraphPreviews[analysisIndex] || this.ftirSpectrumImagesGraphPreviews[analysisIndex].length === 0) {
      control.get('ftirSpectrumImagesGraph')?.setErrors({ required: true });
    } else {
      control.get('ftirSpectrumImagesGraph')?.setValue(this.ftirSpectrumImagesGraphPreviews[analysisIndex]);
      control.get('ftirSpectrumImagesGraph')?.setErrors(null);
    }
    control.get('ftirSpectrumImagesGraph')?.markAsTouched();
  }

  // Open image preview in a dedicated viewer tab
  openImageView(preview: string | ArrayBuffer) {
    let imageUrl = '';
    let revokeAfterUse = false;

    if (typeof preview === 'string') {
      imageUrl = preview;
    } else {
      const blob = new Blob([preview], { type: 'image/png' });
      imageUrl = URL.createObjectURL(blob);
      revokeAfterUse = true;
    }

    const imageWindow = window.open('', '_blank');
    if (!imageWindow) {
      return;
    }

    imageWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>View Image</title>
        <style>
          html, body {
            margin: 0;
            width: 100%;
            height: 100%;
            background: #111;
          }
          .viewer {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            padding: 16px;
            box-sizing: border-box;
          }
          img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);
          }
        </style>
      </head>
      <body>
        <div class="viewer">
          <img src="${imageUrl}" alt="View Image" />
        </div>
      </body>
      </html>
    `);
    imageWindow.document.close();

    if (revokeAfterUse) {
      imageWindow.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(imageUrl);
      });
    }
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
  get Result2() { return this.ResultForm.get('Result2') }
  get OperatorName() { return this.ResultForm.get('OperatorName') }
  get DifficultyOfWork() { return this.ResultForm.get('DifficultyOfWork') }
  get CorrectOfWork() { return this.ResultForm.get('CorrectOfWork') }
  get AnalysisTime() { return this.ResultForm.get('AnalysisTime') }
  get ResultItemRequire() { return this.ResultForm.get('resultItemRequire') }
  get ResultAnalysisRequire() { return this.ResultForm.get('resultAnalysisRequire') }

  // Analysis Form getters
  get mappingPositionUrl() { return this.analysisForm.get('mappingPositionUrl') }
  get analysisFormArray() { return this.analysisForm.get('analysis') as FormArray }

  alertSuccess() {
    Swal.fire({
      title: 'SUCCESS',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    })
  }

  // อัปเดต validators สำหรับ Result2 ตามสถานะ FM
  updateResult2Validators() {
    const result2Array = this.Result2 as FormArray;
    const isFM = this.isFM();

    if (isFM) {
      // For FM requests, ensure Result2 has at least one item and fields are required
      if (result2Array.length === 0) {
        const newItem = new FormGroup({
          qty: new FormControl(0, Validators.required),
          item: new FormControl(null, Validators.required),
          tempItem: new FormControl(null),
          dropdown: new FormControl(false),
          rootCase: new FormControl(null),
          material: new FormControl(null),
        });
        result2Array.push(newItem);
      } else {
        // Update existing controls to be required
        result2Array.controls.forEach(control => {
          const qtyControl = control.get('qty');
          const itemControl = control.get('item');
          qtyControl?.setValidators([Validators.required]);
          itemControl?.setValidators([Validators.required]);
          qtyControl?.updateValueAndValidity();
          itemControl?.updateValueAndValidity();
        });
      }
    } else {
      // For non-FM requests, clear Result2 completely
      result2Array.clear();
      result2Array.clearValidators();
    }

    // Update the FormArray validation status
    result2Array.updateValueAndValidity();

    // Toggle main Result vs Result2 validators according to FM
    const resultControl = this.ResultForm.get('Result');
    if (isFM) {
      // When FM, Result text is not required, Result2 is required
      resultControl?.clearValidators();
      resultControl?.updateValueAndValidity();
      result2Array.setValidators([Validators.required]);
    } else {
      // When not FM, require Result text and not require Result2
      resultControl?.setValidators([Validators.required]);
      resultControl?.updateValueAndValidity();
      result2Array.clearValidators();
    }
    result2Array.updateValueAndValidity();
  }

  updateMappingPositionValidator() {
    const control = this.mappingPositionUrl;
    if (!control) {
      return;
    }

    if (this.VisibleMappingPosition) {
      control.clearValidators();
      control.setErrors(null);
    } else {
      control.setValidators([Validators.required]);
    }

    control.updateValueAndValidity();
  }

  // ฟังก์ชันสำหรับดีบักฟอร์ม เพื่อหาฟิลด์ที่ invalid
  debugFormValidation() {
    // อัปเดต validators ก่อนตรวจสอบ
    this.updateResult2Validators();

    console.log('=== FORM VALIDATION DEBUG ===');
    console.log('ResultForm.valid:', this.ResultForm.valid);
    console.log('ResultForm.invalid:', this.ResultForm.invalid);
    console.log('TreatmentOfNg.valid:', this.TreatmentOfNg.valid);
    console.log('TreatmentOfNg.invalid:', this.TreatmentOfNg.invalid);

    console.log('\n--- ResultForm Controls Status ---');
    Object.keys(this.ResultForm.controls).forEach(key => {
      const control = this.ResultForm.get(key);
      if (control && control.invalid) {
        console.log(`❌ ${key} is INVALID:`, control.errors);
        console.log(`   Current value:`, control.value);
      } else if (control) {
        console.log(`✅ ${key} is valid, value:`, control.value);
      }
    });

    // ตรวจสอบ Result2 FormArray (สำหรับงาน FM)
    const result2Array = this.Result2 as FormArray;
    if (result2Array) {
      console.log('\n--- Result2 FormArray Status ---');
      console.log('Result2 Array valid:', result2Array.valid);
      console.log('Result2 Array invalid:', result2Array.invalid);
      console.log('Result2 Array length:', result2Array.length);

      if (result2Array.invalid) {
        console.log('❌ Result2 FormArray is INVALID');
        result2Array.controls.forEach((control, index) => {
          if (control.invalid) {
            console.log(`❌ Result2[${index}] is invalid:`, control.errors);
            console.log(`   Control value:`, control.value);
          }
        });
      }
    }

    // ตรวจสอบว่าเป็นงาน FM หรือไม่
    console.log('\n--- FM Status ---');
    console.log('Is FM:', this.isFM());

    console.log('\n--- Summary ---');
    const invalidControls = [];
    if (this.ResultForm.invalid) invalidControls.push('ResultForm');
    if (this.TreatmentOfNg.invalid) invalidControls.push('TreatmentOfNg');

    console.log('Invalid controls:', invalidControls.length > 0 ? invalidControls : 'None');
    console.log('Overall form can submit:', this.ResultForm.valid && this.TreatmentOfNg.valid);
    console.log('=== END DEBUG ===');
  }


  toggleItemRequire() {
    let value = this.ResultForm.get('resultItemRequire')?.value
    value = !value;
    this.ResultItemRequire.setValue(value);
    this.controlResultItemRequire()
  }

  toggleAnalysisRequire() {
    let value = this.ResultForm.get('resultAnalysisRequire')?.value
    value = !value;
    this.ResultAnalysisRequire.setValue(value);
    this.controlResultAnalysisRequire()
  }

  controlResultItemRequire() {
    const value = this.ResultItemRequire.value;

    if (!value) {
      const result2Array = this.Result2 as FormArray;
      result2Array.clearValidators();
      result2Array.setErrors(null);
      result2Array.controls.forEach((control: any) => {
        const qtyControl = control.get('qty');
        const itemControl = control.get('item');

        qtyControl?.clearValidators();
        qtyControl?.setErrors(null);
        itemControl?.clearValidators();
        itemControl?.setErrors(null);
        qtyControl?.updateValueAndValidity();
        itemControl?.updateValueAndValidity();
      });
      result2Array.updateValueAndValidity();

    } else {
      this.updateResult2Validators();
    }
  }
  controlResultAnalysisRequire() {
    const value = this.ResultAnalysisRequire.value;
    if (!value) {
      this.analysisForm.clearValidators();
      this.analysisForm.setErrors(null);
      this.analysisFormArray.controls.forEach((control: any) => {
        Object.keys(control.controls).forEach(key => {
          const formControl = control.get(key);
          formControl?.clearValidators();
          formControl?.setErrors(null);
          formControl?.updateValueAndValidity();
        });
      });
      this.VisibleMappingPosition = true
      this.updateMappingPositionValidator();
    } else {
      // this.ResultForm.get('resultAnalysisRequire')?.patchValue(value);
      this.analysisFormArray.controls.forEach((control: any) => {
        control.get('fmPosition')?.setValidators([Validators.required]);
        control.get('material')?.setValidators([Validators.required]);
        control.get('estimateResultProcess')?.setValidators([Validators.required]);
        control.get('dataCode')?.setValidators([Validators.required]);
        control.get('color')?.setValidators([Validators.required]);
        control.get('character')?.setValidators([Validators.required]);
        control.get('result')?.setValidators([Validators.required]);
        Object.keys(control.controls).forEach(key => {
          const formControl = control.get(key);
          formControl?.updateValueAndValidity();
        });
      });
      this.VisibleMappingPosition = false
      this.updateMappingPositionValidator();
      this.analysisForm.updateValueAndValidity();
    }
  }
  
}
