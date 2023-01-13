import { Component, ElementRef, Input, OnInit, TestabilityRegistry, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AngularFrameworkComponentWrapper } from 'ag-grid-angular';
import { GridApi, GridReadyEvent, LoggerFactory, RowNode } from 'ag-grid-community';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';
import { read, utils, writeFile } from 'xlsx';

// import { saveAs } from 'file-saver';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs'
import { log } from 'console';
import { logWarnings } from 'protractor/built/driverProviders';

@Component({
  selector: 'app-edit-view',
  templateUrl: './edit-view.component.html',
  styleUrls: ['./edit-view.component.css']
})
export class EditViewComponent implements OnInit {

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
  listFile: any
  pathFile: any
  // ? file attacnt
  FileList: any = [];
  fileInput = new FormControl(null)
  gridApi: GridApi
  sizeFile: any[] = []
  EmSize: number;


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
  nameFile: any[] = []
  listDelete: any[] = []
  defectPart: any
  checkDup: boolean
  constructor(private api: HttpService,) { }

  ngOnInit(): void {
    this.GetModelNumber();
    this.GetProductPhaseList();
    this.GetIdDefectCategoryList()
    this.GetOccurAList()
    this.GetMasterOutsource()
    this.getGetDefect()




    const access: any = sessionStorage.getItem('UserEmployeeCode')
    if (access == 'admin') {
      this.RouterMenu = [
        {
          path: '/searchDatabase', title: 'SEARCH DATABASE', icon: 'bi bi-house'
        },
      ]
    } else {
      this.RouterMenu = [
        {
          path: '/searchDatabase', title: 'SEARCH DATABASE', icon: 'bi bi-house'
        },
      ]
    }
    this.nameSplitFile()
    this.editUpdate()
  }

  // ? Session\
  Data = JSON.parse(sessionStorage.getItem('dataAll'));

  editUpdate() {
    this.RegisNo = this.Data.registerNo
    this.CkModel = this.Data.modelNumber
    this.Size = this.Data.size
    this.Customer = this.Data.customer
    this.DefectiveName = this.Data.defectiveName
    this.ReferKTC = this.Data.referKTC
    this.CauseOfDefective = this.Data.causeOfDefective
    this.MakerSup = this.Data.makerSupplier
    this.ProductionPh = this.Data.productionPhase
    this.DefectCategory = this.Data.defectCategory
    this.DataOccurAList = this.Data.OccurA
    this.OccurBListCk = this.Data.OccurB
    this.AnalysisResult = this.Data.analysisResult
    this.tempUpload = []
    this.listFile = this.nameFile.concat(this.tempUpload);
    // console.log(this.listFile);
  }


  // [{name :"sadasdsd"}]
  nameSplitFile() {
    if (this.Data.urlFile.length > 0) {
      for (const iterator of this.Data.urlFile) {
        let items = iterator.split("/")
        this.nameFile.push({ name: items[items.length - 1] })
      }
      // this.urlMain = this.Data.urlFile[0].split("KTC")[0]
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
      this.Size = ""
      this.Customer = ""
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
    // console.log(test.list);
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
      if (data.length > 0) {
        this.OccurAList = data;
        this.GetOccurBList()
      } else {
        this.OccurAList = null;
      }
    })
    // this.GetOccurBList()
  }



  GetOccurBList() {
    const OccurALists = this.OccurAList.find(element => element.name == this.DataOccurAList)
    if (OccurALists) {
      this.api.GetOccurB(OccurALists._id).subscribe((data: any) => {
        if (data.length > 0) {
          this.OccurBList = data;
        } else {
          this.OccurBList = null;
        }
      })
    } else {
      this.OccurBListCk = ""

    }

    //  console.log(OccurALists._id);

  }

  //---------------------------------AllRow-----------------------------------------//





  LoadingPage: boolean;

  //---------------------------------ResetForm-----------------------------------------//

  // this.runRegis()

  //---------------------------------ResetForm-----------------------------------------//

  temp: any[] = []
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
    this.fileUpload.nativeElement.value = ""
    this.tempUpload = this.duplicate(data)
    this.listFile = this.nameFile.concat(this.tempUpload);
    this.checkSizeFile()
  }

  onClickDel(file: File) {

    Swal.fire({
      title: `Do you want to delete ${file.name}?`,
      icon: 'warning',
      showCancelButton: true
    }).then(ans => {
      if (ans.isConfirmed) {
        this.tempUpload = this.tempUpload.filter((f: any) => f != file);
        this.nameFile = this.nameFile.filter((f: any) => f != file);
        this.listFile = this.nameFile.concat(this.tempUpload);
        this.listDelete.push(file.name)
        this.checkSizeFile()
        setTimeout(() => {
          Swal.fire('Success', '', 'success')
        }, 200);
      }
    })
  }

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
    // console.log(this.listFile.length);
    if (this.EmSize / 1048576 > 30 || this.checkDup) {
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

  //---------------------------------get_id_data-----------------------------------------//
  async getId() {
    let data = { "data": this.Data.registerNo }
    let viewData = await this.api.getDataView(data).toPromise()
    viewData[0]._id
    // console.log(this.dataView);
    return viewData[0]._id
  }
  //---------------------------------get_id_data-----------------------------------------//





  async submit() {

    let resUpload = []
    this.pathUrl = []
    if (this.nameFile.length > 0) {
      for (const iterator of this.nameFile) {
        this.pathUrl.push(this.Data.urlFile[0].split("KTC")[0] + iterator.name)
      }
    }

    if (this.tempUpload.length > 0) {
      const formData = await this.addFormData(this.tempUpload, this.RegisNo)
      resUpload = await this.api.outsourceUpload(formData).toPromise()
      for (const iterator of resUpload) {
        this.pathUrl.push(iterator.split("?")[0])
      }
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

    // console.log(JSON.stringify(sendData).length);


    if (this.CkModel) {
      let data = {
        data: sendData,
        deleted: this.listDelete
      }
      const updateEdit = this.api.updateEditView(await this.getId(), data).toPromise()
      // console.log(sendData);
      Swal.fire('Success', '', 'success')
    } else {
      Swal.fire({
        title: 'Warning !',
        icon: 'warning',
        text: 'Please Choose data'

      })
    }
  }
  //---------------------------------Submit-----------------------------------------//
  updates() {
    let test = localStorage.setItem("update", "true");
  }


}





