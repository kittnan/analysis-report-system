import { Component, ElementRef, Input, OnInit, TestabilityRegistry, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFrameworkComponentWrapper } from 'ag-grid-angular';
import { GridApi, GridReadyEvent, LoggerFactory, RowNode } from 'ag-grid-community';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';


// import { saveAs } from 'file-saver';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs'
import { interval, Subscription } from 'rxjs';



@Component({
  selector: 'app-outsource-analysis',
  templateUrl: './outsource-analysis.component.html',
  styleUrls: ['./outsource-analysis.component.css']
})


export class OutsourceAnalysisComponent implements OnInit {
  @Input() data: any
  @ViewChild('fileUpload') fileUpload!: ElementRef
  // ? Variable
  CkModel: any;

  datalist = {
    size: "",
    customer: ""
  }
  OccurAList: any;
  OccurBList: any;
  ModelName: any;
  OccurAName: any;
  OccurA: any;
  RouterMenu: any[]


  //? Var
  RegisNo: any;
  Size: any;
  Customer: any;
  DefectiveName: any;
  ReferKTC: any;
  CauseOfDefective: any;
  MakerSup: any;
  ProductionPh: any;
  DefectCategory: any;
  DataOccurAList: any;
  OccurBListCk: any;
  AnalysisResult: any;
  fileProgress = false
  tempUpload: any[] = []
  month: any;
  year: any;
  worksheet: any;
  countX: any;
  countY: any;
  pathUrl: any[] = [];
  listCauseO: any;
  listMaker: any;
  customYear: any;
  yearList: any[] = [];
  yearNum: any

  // ? file attacnt
  FileList: any = [];
  fileInput = new FormControl(null)
  gridApi: GridApi
  dateSize: any;
  file: any;
  ChecksEmpty: boolean
  interval$!: Subscription;

  // ? toggle filter model number
  ToggleFilterModelNumber() {
    this.ModelNumberToggle = !this.ModelNumberToggle;
  }

  // ? Toggle
  ModelNumberToggle = false;

  // ?API
  ModelNumberList: any;
  ModelNumberFilter: any = [];
  ProductPhaseList: any;
  IdDefectCategoryList: any;

  // ? Fix ID
  IdModelNumber = environment.IdModelNumber
  IdProductPhase = environment.IdProductPhase;
  IdDefectCategory = environment.IdDefectCategory;

  goo: any[] = []
  constructor(private api: HttpService,) { }
  defectPart: any
  sizeFile: any[] = []
  EmSize: any
  checkDup: boolean
  temp: any[] = []

  // RequestForm = new FormGroup({
  //   CkModel : new FormControl(null, Validators.required),
  // })


  ngOnInit(): void {
    // this.interval$ = interval(1000).subscribe(res => this.CheckEmpty())
    // console.log(this.RequestForm.value);

    this.reList()
    this.GetModelNumber();
    this.GetProductPhaseList();
    this.GetIdDefectCategoryList()
    this.GetOccurAList()
    this.runRegis()
    this.GetMasterOutsource()
    this.setTime()
    //  this.updateMasterOutsource()
    // this.GetOccurBList()
    // updateMasterOutsource
    this.getGetDefect()

    // this.defectPart = defectData.defectName

    // console.log(defectData);



    const access: any = localStorage.getItem('AR_UserEmployeeCode')
    if (access == 'admin') {
      this.RouterMenu = [
        {
          path: '/searchDatabase', title: 'SEARCH DATABASE', icon: 'bi bi-house'
        },
        {
          path: '/outsource', title: 'Input Database', icon: 'bi bi-search'
        },
        {
          path: '/MasterOutsource', title: 'Master Outsource', icon: 'bi bi-search'
        },
      ]
    } else {
      this.RouterMenu = [
        {
          path: '/searchDatabase', title: 'SEARCH DATABASE', icon: 'bi bi-house'
        },
        {
          path: '/outsource', title: 'Input Database', icon: 'bi bi-search'
        },
        // {
        //   path: '/MasterOutsource', title: 'Master Outsource', icon: 'bi bi-search'
        // },

      ]
    }
  }





  async getGetDefect() {
    this.defectPart = await this.api.GetDefectAll().toPromise()
  }

  // updateMasterOutsource
  async updateMasterOutsource() {
    const data_CauseOfDefective = {
      name: "Cause of Defective",
      list: ["LCD/TFT Panel", "LSI", "PWB", "Backlight", "Polarizer", "FPC", "Touch panel", "ACF Tape", "Conductive tape", "Conductive /Carbon paste", "Adhesive gule", "Resin", "OCA glue"],
    }
    const data_MakerSupplierName = {
      name: "Maker/Supplier Name",
      list: ["Himax", "PTC", "Rohm", "KC-DC", "SKC", "HDK"]
    }
    await this.api.updateMasterOutsource(environment.MasterCauseOfDefective, data_CauseOfDefective).toPromise()
    await this.api.updateMasterOutsource(environment.MasterMakerSupplierName, data_MakerSupplierName).toPromise()
  }

  // ? API
  //---------------------------------AllRow-----------------------------------------//
  checkMs() {
    // console.log(this.test1);
    const listname = this.ModelNumberFilter.find(element => element.name == this.CkModel)
    if (listname) {
      this.datalist = listname ? listname : '';
    } else {
      this.datalist = {
        size: "",
        customer: ""
      }
    }
    //  console.log();
  }


  GetModelNumber() {
    this.api.GetListByIdMaster(this.IdModelNumber).subscribe((data: any) => {
      if (data.length > 0) {
        this.ModelNumberList = data;
        this.ModelNumberFilter = data;
      } else {
        this.ModelNumberList = null;
      }
    })
  }

  async GetMasterOutsource() {
    const item_1 = await this.api.getDataMasterOutsource(environment.MasterCauseOfDefective).toPromise()
    const item_2 = await this.api.getDataMasterOutsource(environment.MasterMakerSupplierName).toPromise()
    this.listCauseO = item_1.list
    this.listMaker = item_2.list
    // console.log(item_1);
  }

  GetProductPhaseList() {
    this.api.GetListByIdMaster(this.IdProductPhase).subscribe((data: any) => {
      if (data.length > 0) {
        this.ProductPhaseList = data;
      } else {
        this.ProductPhaseList = null;
      }
    })
  }


  GetIdDefectCategoryList() {
    this.api.GetListByIdMaster(this.IdDefectCategory).subscribe((data: any) => {
      if (data.length > 0) {
        this.IdDefectCategoryList = data;
      } else {
        this.IdDefectCategoryList = null;
      }
      //console.log(this.IdDefectCategoryList);
    })
  }


  GetOccurAList() {
    this.OccurAList = null;
    this.OccurBList = null;
    this.OccurAName = null;
    this.api.GetOccurAAll().subscribe((data: any) => {
      // console.log(data);

      if (data.length > 0) {
        this.OccurAList = data;
      } else {
        this.OccurAList = null;
      }
    })
    // console.log(this.OccurAList);

  }



  async GetOccurBList() {
    const OccurALists = this.OccurAList.find(element => element.name == this.DataOccurAList)
    if (OccurALists) {
      let data = await this.api.GetOccurB(OccurALists._id).toPromise()
      this.OccurBList = data
    } else {
      this.OccurBList = null
    }

    // console.log(this.OccurBList);


  }

  //---------------------------------AllRow-----------------------------------------//





  LoadingPage: boolean;

  //---------------------------------ResetForm-----------------------------------------//
  ResetConditionFilter() {
    Swal.fire({
      title: 'Do you want to reset condition filters ?',
      icon: 'question',
      showCancelButton: true,
    }).then(r => {
      if (r.isConfirmed) {
        this.CkModel = "";
        //this.RegisNo = "";
        this.customYear = ""
        this.datalist.size = ""
        this.datalist.customer = ""
        this.DefectiveName = ""
        this.ReferKTC = "";
        this.CauseOfDefective = "";
        this.MakerSup = "";
        this.ProductionPh = "";
        this.DefectCategory = "";
        this.DataOccurAList = "";
        this.OccurBListCk = "";
        this.AnalysisResult = "";
        this.tempUpload = [];
        this.temp = [];
        this.EmSize = 0;
        //console.log(this.tempUpload);
        this.reList()
        // this.gridApi.setFilterModel(null);
      }
    })
    this.runRegis()
  }
  //---------------------------------ResetForm-----------------------------------------//

  // test333() {
  //   console.log(this.temp);
  //   console.log(this.tempUpload);

  // }

  //---------------------------------Duplicate-----------------------------------------//

  duplicate(x: any) {
    for (const item of x) {
      const data = this.temp.find(e => e.name == item.name)
      if (!data) {
        this.temp.push(item)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'File duplicate',
          text: 'Try Again'
        })
      }
    }
    return this.temp
  }


  //---------------------------------UploadFile-----------------------------------------//
  upload(e: any) {
    const data: any[] = []
    const files = e.target.files
    data.push(...files)
    // console.log(data);
    this.fileUpload.nativeElement.value = ""
    this.tempUpload = this.duplicate(data)
    // console.log(this.tempUpload);
    this.checkSizeFile()
  }

  //---------------------------------DeleteFile----------------------------------------//
  onClickDel(file: File) {
    Swal.fire({
      title: `Do you want to delete ${file.name}?`,
      icon: 'warning',
      showCancelButton: true
    }).then(ans => {
      if (ans.isConfirmed) {
        this.tempUpload = this.tempUpload.filter((f: any) => f != file);
        this.temp = this.temp.filter((f: any) => f != file);
        this.checkSizeFile()
        setTimeout(() => {
          Swal.fire('Success', '', 'success')
          this.CheckEmpty()
        }, 200);
      }
    })
  }
  //---------------------------------CheckSizeFile-----------------------------------------//
  //TODO CheckSizeFile
  checkSizeFile() {
    let dateSize = 0
    for (const item of this.tempUpload) {
      dateSize = dateSize + item.size
      this.EmSize = dateSize
      if (this.EmSize / 1048576 > 30) {
        Swal.fire({
          icon: 'error',
          title: 'Limit File Size 30Mb',
          text: 'Try Again',
        })
      }
    }
    this.EmSize = dateSize
  }


  checkFile() {
    if (this.EmSize / 1048576 > 30) {
      return true
    }
    return false
  }
  //---------------------------------UploadFile-----------------------------------------//

  //---------------------------------Token-----------------------------------------//
  generateToken(n: number) {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var token = '';
    for (var i = 0; i < n; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
  }

  addFormData(files: any, controlNo: any) {
    return new Promise(resolve => {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        let type = files[i].name.split('.');
        type = type[type.length - 1]
        const newFileName = `${controlNo}-${this.generateToken(3)}.${type}`
        formData.append('File', files[i], newFileName)
        if (i + 1 === files.length) {
          resolve(formData)
        }
      }

    })
  }
  //---------------------------------Token-----------------------------------------//

  //---------------------------------Submit-----------------------------------------//

  getTime() {
    var date = new Date();
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
  }

  setTime() {
    var date = new Date();
    let yearList = date.getFullYear();
    for (let index = 20; index > 0; index--) {
      // const element = array[index];
      this.yearList.push(yearList)
      yearList -= 1
    }
  }

  reList() {
    this.getTime()
    if (this.customYear) {
      this.yearNum = this.customYear
    } else {
      this.yearNum = this.year
    }
    // console.log(this.yearNum);
    this.runRegis()
  }


  reData() {
    this.runRegis()
    // console.log(this.RegisNo);
  }



  async runRegis() {
    this.getTime()
    const data = await this.api.GetLastRegisNumber(this.yearNum).toPromise()
    // console.log(data);
    data[0] ? this.RegisNo : this.RegisNo = `KTC-OSA-${this.yearNum}-0001`
    if (data.length > 0) {
      const SplitName = data[0].registerNo.split("-");
      let NumberReg: any = Number(SplitName[3])
      NumberReg += 1
      NumberReg = NumberReg.toString().padStart(4, '0')
      // console.log(this.customYear);

      // if (this.customYear) {
      this.RegisNo = `KTC-OSA-${this.yearNum}-${NumberReg}`
      // }
    } else {
    }


  }

  CheckEmpty() {
    let CheckEmpty = []
    const sendData: any = {
      registerNo: this.RegisNo,
      modelNumber: this.CkModel,
      size: this.datalist.size,
      customer: this.datalist.customer,
      defectiveName: this.DefectiveName,
      referKTC: this.ReferKTC,
      causeOfDefective: this.CauseOfDefective,
      makerSupplier: this.MakerSup,
      productionPhase: this.ProductionPh,
      defectCategory: this.DefectCategory,
      OccurA: this.DataOccurAList,
      OccurB: this.OccurBListCk,
      analysisResult: this.AnalysisResult,
      urlFile: this.pathUrl,
      year: this.RegisNo.split("-")[2],
    }

    this.customYear ? CheckEmpty[0] = 1 : CheckEmpty[0] = 0
    sendData.modelNumber ? CheckEmpty[1] = 1 : CheckEmpty[1] = 0
    sendData.defectiveName ? CheckEmpty[2] = 1 : CheckEmpty[2] = 0
    sendData.causeOfDefective ? CheckEmpty[3] = 1 : CheckEmpty[3] = 0
    sendData.makerSupplier ? CheckEmpty[4] = 1 : CheckEmpty[4] = 0
    sendData.productionPhase ? CheckEmpty[5] = 1 : CheckEmpty[5] = 0
    sendData.defectCategory ? CheckEmpty[6] = 1 : CheckEmpty[6] = 0
    sendData.OccurA ? CheckEmpty[7] = 1 : CheckEmpty[7] = 0
    sendData.OccurB ? CheckEmpty[8] = 1 : CheckEmpty[8] = 0
    sendData.analysisResult ? CheckEmpty[9] = 1 : CheckEmpty[9] = 0
    this.tempUpload.length > 0 ? CheckEmpty[10] = 1 : CheckEmpty[10] = 0

    let Empty = CheckEmpty.find(e => e == 0)
    if (Empty == undefined) {
      this.ChecksEmpty = true
    } else {
      this.ChecksEmpty = false
    }


  }

  CLS() {
    this.OccurBListCk = ""
  }

  async submit() {
    let resUpload = []
    // console.log(this.tempUpload.length);
    if (this.CkModel) {
      if (this.tempUpload.length > 0) {
        // console.log("asdasd");

        const formData = await this.addFormData(this.tempUpload, this.RegisNo)
        // console.log(formData);

        let resUpload = await this.api.outsourceUpload(formData).toPromise()
        // console.log(resUpload);

        for (const iterator of resUpload) {
          this.pathUrl.push(iterator.split("?")[0])
        }
        // console.log(this.pathUrl);

      }

      const sendData = {
        registerNo: this.RegisNo,
        modelNumber: this.CkModel,
        size: this.datalist.size,
        customer: this.datalist.customer,
        defectiveName: this.DefectiveName,
        referKTC: this.ReferKTC,
        causeOfDefective: this.CauseOfDefective,
        makerSupplier: this.MakerSup,
        productionPhase: this.ProductionPh,
        defectCategory: this.DefectCategory,
        OccurA: this.DataOccurAList,
        OccurB: this.OccurBListCk,
        analysisResult: this.AnalysisResult,
        urlFile: this.pathUrl,
        year: this.RegisNo.split("-")[2],
      }
      // console.log(sendData);


      //console.log(this.datalist.size);
      const sandDataForm = await this.api.outsourceForm(sendData).toPromise()
      this.runRegis()
      Swal.fire('Success', '', 'success')
      this.CkModel = "";
      this.customYear = ""
      this.datalist.size = ""
      this.datalist.customer = ""
      this.DefectiveName = ""
      this.ReferKTC = "";
      this.CauseOfDefective = "";
      this.MakerSup = "";
      this.ProductionPh = "";
      this.DefectCategory = "";
      this.DataOccurAList = "";
      this.OccurBListCk = "";
      this.AnalysisResult = "";
      this.tempUpload = [];
      this.temp = [];
      this.EmSize = "";
      this.CheckEmpty()

    } else {
      Swal.fire({
        title: 'Warning !',
        icon: 'warning',
        text: 'Please Choose data'
      })
    }


  }
  //---------------------------------Submit-----------------------------------------//


}




