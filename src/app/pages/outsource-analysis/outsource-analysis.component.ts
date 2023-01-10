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

  ngOnInit(): void {
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



    const access: any = sessionStorage.getItem('UserEmployeeCode')
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
      } else {
        this.OccurAList = null;
      }
    })
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
  ResetConditionFilter() {
    Swal.fire({
      title: 'Do you want to reset condition filters ?',
      icon: 'question',
      showCancelButton: true,
    }).then(r => {
      if (r.isConfirmed) {
        this.CkModel = "";
        //this.RegisNo = "";
        this.customYear = "",
          this.datalist.size = "",
          this.datalist.customer = "",
          this.DefectiveName = "";
        this.ReferKTC = "";
        this.CauseOfDefective = "";
        this.MakerSup = "";
        this.ProductionPh = "";
        this.DefectCategory = "";
        this.DataOccurAList = "";
        this.OccurBListCk = "";
        this.AnalysisResult = "";
        this.tempUpload = [];
        //console.log(this.tempUpload);
        this.reList()
      }
    })
    this.runRegis()
  }
  //---------------------------------ResetForm-----------------------------------------//

  //---------------------------------UploadFile-----------------------------------------//
  upload(e: any) {
    const files = e.target.files
    this.tempUpload.push(...files)
    this.fileUpload.nativeElement.value = ""
  }

  onClickDel(file: File) {

    Swal.fire({
      title: `Do you want to delete ${file.name}?`,
      icon: 'warning',
      showCancelButton: true
    }).then(ans => {
      if (ans.isConfirmed) {
        this.tempUpload = this.tempUpload.filter((f: any) => f != file);
        setTimeout(() => {
          Swal.fire('Success', '', 'success')
        }, 200);
      }
    })
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



  async submit() {
    let resUpload = []
    console.log(this.tempUpload.length);

    if (this.tempUpload.length > 0) {
      // console.log("asdasd");

      const formData = await this.addFormData(this.tempUpload, this.RegisNo)
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

    if (this.CkModel) {
      //console.log(this.datalist.size);
      const sandDataForm = await this.api.outsourceForm(sendData).toPromise()
      this.runRegis()
      Swal.fire('Success', '', 'success')
      this.CkModel = "";
      this.customYear = "",
        this.datalist.size = "",
        this.datalist.customer = "",
        this.DefectiveName = "";
      this.ReferKTC = "";
      this.CauseOfDefective = "";
      this.MakerSup = "";
      this.ProductionPh = "";
      this.DefectCategory = "";
      this.DataOccurAList = "";
      this.OccurBListCk = "";
      this.AnalysisResult = "";
      this.tempUpload = [];
    } else {
      Swal.fire({
        title: 'Warning !',
        icon: 'warning',
        text: 'Please Choose data'
      })
    }


  }
  //---------------------------------Submit-----------------------------------------//

  //---------------------------------ExportExcel-----------------------------------------//
  async ExportExcel() {

    let DataOutSourceAll = await this.api.GetAll().toPromise()
    DataOutSourceAll = DataOutSourceAll.map((element: any) => {
      delete element._id
      element.urlFile = element.urlFile.toString().replaceAll(",", " ,")
      return element
    });

    const workbook = new Workbook();
    this.worksheet = workbook.addWorksheet('New Sheet', { properties: { tabColor: { argb: 'FFC0000' } } });

    this.readBorderEx('A1', 'P1')
    this.worksheet.columns = [
      { width: 25, header: 'Register No.', key: 'registerNo' },
      { width: 20, header: 'Model No.', key: 'modelNumber' },
      { width: 20, header: 'Size (inch)', key: 'size' },
      { width: 20, header: 'Customer', key: 'customer' },
      { width: 20, header: 'Defective Name', key: 'defectiveName' },
      { width: 27, header: 'Refer KTC Analysis Request No.', key: 'referKTC' },
      { width: 20, header: 'Cause of Defective', key: 'causeOfDefective' },
      { width: 20, header: 'Maker/Supplier Name', key: 'makerSupplier' },
      { width: 20, header: 'Production Phase', key: 'productionPhase' },
      { width: 20, header: 'Defect Category', key: 'defectCategory' },
      { width: 20, header: 'Occur Place A', key: 'OccurA' },
      { width: 35, header: 'Occur Place B', key: 'OccurB' },
      { width: 30, header: 'Analysis result', key: 'analysisResult' },
      { width: 30, header: 'Url File', key: 'urlFile' },
      { width: 30, header: 'createdAt', key: 'createdAt' },
      { width: 30, header: 'updatedAt', key: 'updatedAt' },
    ];



    const row = this.worksheet.addRows(
      DataOutSourceAll
    );


    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
      fs.saveAs(blob, 'Report Outsource Database.xlsx');
    });


  }



  readBorderEx(x: any, y: any) {
    let ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let x1 = x.split("")[0]
    let x2 = Number(x.split("")[1])
    let y1 = y.split("")[0]
    let y2 = Number(y.split("")[1])
    x.split("")[2] ? x2 = Number(x.split("")[1] + x.split("")[2]) : x2 = Number(x.split("")[1])
    y.split("")[2] ? y2 = Number(y.split("")[1] + y.split("")[2]) : y2 = Number(y.split("")[1])


    if (x1 == y1) {
      for (let i = x2; i <= y2; i++) {
        this.worksheet.getCell(x1 + i).border = { left: { style: 'double', color: { argb: '0000' } }, right: { style: 'double', color: { argb: '0000' } } }
      }
      let leftRightTop = this.worksheet.getCell(x1 + x2).border = { top: { style: 'double', color: { argb: '0000' } }, left: { style: 'double', color: { argb: '0000' } }, right: { style: 'double', color: { argb: '0000' } } }
      let leftRightDown = this.worksheet.getCell(y1 + y2).border = { bottom: { style: 'double', color: { argb: '0000' } }, left: { style: 'double', color: { argb: '0000' } }, right: { style: 'double', color: { argb: '0000' } } }
    } else {
      for (let i = x2; i <= y2; i++) {
        this.worksheet.getCell(x1 + i).border = { left: { style: 'double', color: { argb: '0000' } } }
        this.worksheet.getCell(y1 + i).border = { right: { style: 'double', color: { argb: '0000' } } }
      }
    }

    ABC.split("")
    let startAZ = 0
    let endAZ = 25
    // 'A1','E3'
    for (let i = startAZ; i <= endAZ; i++) {
      if (x1 == ABC[i]) {
        this.countX = i + 1
        continue
      }
      if (y1 == ABC[i]) {
        this.countY = i + 1
        for (let i = this.countX; i < this.countY; i++) {
          if (x2 == y2) {
            let topDown = this.worksheet.getCell(ABC[i] + x2).border = { top: { style: 'double', color: { argb: '0000' } }, bottom: { style: 'double', color: { argb: '0000' } } }
            let leftTopDown = this.worksheet.getCell(x1 + x2).border = { top: { style: 'double', color: { argb: '0000' } }, left: { style: 'double', color: { argb: '0000' } }, bottom: { style: 'double', color: { argb: '0000' } } }
            let rightTopDown = this.worksheet.getCell(y1 + x2).border = { top: { style: 'double', color: { argb: '0000' } }, bottom: { style: 'double', color: { argb: '0000' } }, right: { style: 'double', color: { argb: '0000' } } }
          } else {
            let top = this.worksheet.getCell(ABC[i] + x2).border = { top: { style: 'double', color: { argb: '0000' } } }
            let bottom = this.worksheet.getCell(ABC[i] + y2).border = { bottom: { style: 'double', color: { argb: '0000' } } }
            let leftTop = this.worksheet.getCell(x1 + x2).border = { left: { style: 'double', color: { argb: '0000' } }, top: { style: 'double', color: { argb: '0000' } } }
            let leftDown = this.worksheet.getCell(x1 + y2).border = { left: { style: 'double', color: { argb: '0000' } }, bottom: { style: 'double', color: { argb: '0000' } } }
            let rightTop = this.worksheet.getCell(y1 + x2).border = { right: { style: 'double', color: { argb: '0000' } }, top: { style: 'double', color: { argb: '0000' } } }
            let rightDown = this.worksheet.getCell(y1 + y2).border = { right: { style: 'double', color: { argb: '0000' } }, bottom: { style: 'double', color: { argb: '0000' } } }

          }
        }
        break
      }
    }
    if (x1 == y1 && x2 == y2) {
      this.worksheet.getCell(x1 + x2).border = {
        top: { style: 'double', color: { argb: '0000' } },
        left: { style: 'double', color: { argb: '0000' } },
        bottom: { style: 'double', color: { argb: '0000' } },
        right: { style: 'double', color: { argb: '0000' } }
      };
    }
  }


  //---------------------------------ExportExcel-----------------------------------------//

}




