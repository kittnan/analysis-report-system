import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';

// import { saveAs } from 'file-saver';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs'
import { merge } from 'jquery';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';



@Component({
  selector: 'app-search-database',
  templateUrl: './search-database.component.html',
  styleUrls: ['./search-database.component.css']
})
export class SearchDatabaseComponent implements OnInit {


  RouterMenu: any[]
  worksheet: any;
  countX: any;
  countY: any;
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


  // ?API
  ModelNumberList: any;
  ModelNumberFilter: any = [];
  ProductPhaseList: any;
  IdDefectCategoryList: any;

  // ? Fix ID
  IdModelNumber = environment.IdModelNumber
  IdProductPhase = environment.IdProductPhase;
  IdDefectCategory = environment.IdDefectCategory;

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
  Sum: any = [];
  fromDate: any;
  toDate: any;
  toYear: any;
  listCauseO: any;
  listMaker: any;
  yearStart: any[] = [];
  defectPart: any


  // ?  data table
  gridApi: GridApi
  columnDefs = [
    {
      field: 'registerNo',
      headerName: "Reg No.",
      headerTooltip: "Register Number",
    },
    {
      field: 'modelNumber',
      headerName: "KTC Model N.",
      headerTooltip: "KTC Model Number",
    },
    {
      field: 'projectName',
      headerName: "Pro Name.",
      headerTooltip: "Project Name"
    },
    {
      field: 'defectiveName',
      headerName: "Defective Part.",
      headerTooltip: "Defective Part"
    },
    {
      field: 'referKTC',
      headerName: "Refer KTC Model Number.",
      headerTooltip: "KTC Model Number"
    },
    {
      field: 'causeOfDefective',
      headerName: "Cause Of Defective",
      headerTooltip: "Cause Of Defective"
    },
    {
      field: 'makerSupplier',
      headerName: "Maker / Supplier",
      headerTooltip: "Maker / Supplier"
    },
    {
      field: 'productionPhase',
      headerName: "Production Phase.",
      headerTooltip: "Production Phase"
    },
    {
      field: 'defectCategory',
      headerName: "Category Cause.",
      headerTooltip: "Category Cause"
    },
    {
      field: 'OccurA',
      headerName: "Occur Place A.",
      headerTooltip: "Occur Place A"
    },
    {
      field: 'OccurB',
      headerName: "Occur Place B.",
      headerTooltip: "Occur Place B",

    },
    {
      field: 'analysisResult',
      headerName: "Analysis Result",
      headerTooltip: "Analysis Result"
    },
    {
      field: 'createdAt',
      headerName: "Created Date",
      headerTooltip: "Created Date"
    },
  ];
  rowData = [];
  rowDataFull = [];
  rowDataFull2 = [];

  // ? normal
  TempDefectCode: any = null;
  CountNum = 0;

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    floatingFilter: true,
    filter: true,

  }


  public UserLevel1 = sessionStorage.getItem('UserLevel1');
  public UserLevel2 = sessionStorage.getItem('UserLevel2');
  public UserLevel3 = sessionStorage.getItem('UserLevel3');
  public UserLevel4 = sessionStorage.getItem('UserLevel4');
  public UserLevel5 = sessionStorage.getItem('UserLevel5');
  public UserLevel6 = sessionStorage.getItem('UserLevel6');
  ArrUserLevel: any

  interval$!: Subscription;
  LoadingPage: boolean;
  agGridFilter: any
  constructor(
    private api: HttpService,
    private route: Router
  ) {
  }
  //--------------------------------------------------------------------------------------//

  ngOnInit(): void {
    this.interval$ = interval(1000).subscribe(res => this.updateGrid())


    // const strCondition = sessionStorage.getItem('conditionOutsource')
    // const objCondition = JSON.parse(strCondition)
    // this.condition = {...objCondition}
    // console.log(objCondition);
    // this.toYear = objCondition.year || null
    // this.CkModel = objCondition.modelNumber || null
    this.GetMasterOutsource()
    this.sessionStorage()
    this.GetModelNumber();
    this.GetProductPhaseList();
    this.GetIdDefectCategoryList()
    this.GetOccurAList()
    this.getTime()
    this.getGetDefect()

    // this.OnClickSearch()
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
      // console.log(this.RouterMenu[2]);
    }


    this.ArrUserLevel = [];
    this.ArrUserLevel.push(this.UserLevel1)
    this.ArrUserLevel.push(this.UserLevel2)
    this.ArrUserLevel.push(this.UserLevel3)
    this.ArrUserLevel.push(this.UserLevel4)
    this.ArrUserLevel.push(this.UserLevel5)
    this.ArrUserLevel.push(this.UserLevel6)
    this.userLv()
  }
  ngOnDestroy(): void {
    this.interval$.unsubscribe()
  }


  userLv() {
    this.ArrUserLevel = this.ArrUserLevel.find(e => (e >= 3 || e == 0))
  }
  //---------------------------------get and set filter grid-----------------------------------------//
  getFilter() {
    this.agGridFilter = this.gridApi.getFilterModel();
  }
  setFilter() {
    this.gridApi.setFilterModel(this.agGridFilter);
  }
  resetFilter() {
    this.gridApi.resetQuickFilter();
  }
  //---------------------------------get and set filter grid-----------------------------------------//
  test222() {
    console.log("asdasd");
  }

  //---------------------------------ExportExcel-----------------------------------------//
  async ExportExcel() {

    const workbook = new Workbook();
    this.worksheet = workbook.addWorksheet('New Sheet', { properties: { tabColor: { argb: 'FFC0000' } } });

    this.readBorderEx('A1', 'P1')
    this.worksheet.columns = [
      { width: 25, header: 'Register No.', key: 'registerNo' },
      { width: 20, header: 'Model No.', key: 'modelNumber' },
      { width: 20, header: 'Size (inch)', key: 'size' },
      { width: 20, header: 'Customer', key: 'customer' },
      { width: 20, header: 'Defective Part', key: 'defectiveName' },
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
      this.rowData
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

  invalidDate() {
    // console.log("sadasd"+this.fromDate,this.toDate);
    if (this.fromDate > this.toDate && this.toDate > 0) {
      Swal.fire({
        title: 'Invalid Date',
        icon: 'question',
        showCancelButton: false,
      }).then(r => {
        this.fromDate = ""
        this.toDate = ""
      })
    }
    this.toYear = ""
  }

  setYear() {
    this.fromDate = ""
    this.toDate = ""
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

  async getGetDefect() {
    this.defectPart = await this.api.GetDefectAll().toPromise()
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

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }


  updateGrid() {
    let data = localStorage.getItem("update")
    if (data == "true") {
      // console.log("asd", data);
      this.OnClickSearch()
      localStorage.setItem("update", "false")
    }
  }



  //---------------------------------AllRow-----------------------------------------//

  async OnClickSearch() {
    let condition = {
      modelNumber: this.CkModel || null,
      defectiveName: this.DefectiveName || null,
      referKTC: this.ReferKTC || null,
      causeOfDefective: this.CauseOfDefective || null,
      makerSupplier: this.MakerSup || null,
      productionPhase: this.ProductionPh || null,
      defectCategory: this.DefectCategory || null,
      OccurA: this.DataOccurAList || null,
      OccurB: this.OccurBListCk || null,
      analysisResult: this.oldValue || null,
      start: this.fromDate || null,
      end: this.toDate || null,
      year: this.toYear || null,
    }
    const str = JSON.stringify(condition)
    sessionStorage.setItem('conditionOutsource', str)
    this.rowData = await this.api.FilterSearch(condition).toPromise()
    if (this.rowData.length != 0) {
      this.rowData.map(merge => {
        merge['projectName'] = `${merge.size} / ${merge.customer}`
        merge['createdAt'] = `${merge.createdAt.slice(8, 10)}-${merge.createdAt.slice(5, 7)}-${merge.createdAt.slice(0, 4)}`
        return merge
      })

    } else {
      Swal.fire({
        title: 'Data no such',
        icon: 'error'
      })
    }
    setTimeout(() => {
      this.setFilter();
    }, 100);
  }

  onCellClicked(e: any) {
    // ? Session
    const str = JSON.stringify(e.data)
    sessionStorage.setItem('dataAll', str);
    window.open('#/viewFormSearch', '_blank');
  }


  //---------------------------------ResetForm-----------------------------------------//
  ResetConditionFilter() {
    Swal.fire({
      title: 'Do you want to reset condition filters ?',
      icon: 'question',
      showCancelButton: true,
    }).then(r => {
      if (r.isConfirmed) {
        this.CkModel = ""
        this.fromDate = ""
        this.toDate = ""
        this.toYear = ""
        this.datalist.size = ""
        this.datalist.customer = ""
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
        this.oldValue = [];
        //console.log(this.tempUpload);
        this.OnClickSearch()
        setTimeout(() => {
          this.resetFilter()
        }, 500);

      }
    })
  }

  async GetMasterOutsource() {
    const item_1 = await this.api.getDataMasterOutsource(environment.MasterCauseOfDefective).toPromise()
    const item_2 = await this.api.getDataMasterOutsource(environment.MasterMakerSupplierName).toPromise()
    this.listCauseO = item_1.list
    this.listMaker = item_2.list
  }
  //---------------------------------ResetForm-----------------------------------------//

  getTime() {
    var date = new Date();
    this.year = date.getFullYear();
    for (let index = 20; index > 0; index--) {
      // const element = array[index];
      this.yearStart.push(this.year)
      this.year -= 1
    }
    // console.log(this.yearStart);
  }

  sessionStorage() {
    const strCondition = sessionStorage.getItem('conditionOutsource')
    const objCondition = JSON.parse(strCondition)
    if (objCondition == null) {

    } else {
      this.CkModel = objCondition.modelNumber || null,
        this.DefectiveName = objCondition.defectiveName || null,
        this.ReferKTC = objCondition.referKTC || null,
        this.CauseOfDefective = objCondition.causeOfDefective || null,
        this.MakerSup = objCondition.makerSupplier || null,
        this.ProductionPh = objCondition.productionPhase || null,
        this.DefectCategory = objCondition.defectCategory || null,
        this.DataOccurAList = objCondition.OccurA || null,
        this.OccurBListCk = objCondition.OccurB || null,
        this.oldValue = objCondition.analysisResult || [],
        this.fromDate = objCondition.start || null,
        this.toDate = objCondition.end || null,
        this.toYear = objCondition.year || null

      this.OnClickSearch()


    }

  }

  oldValue: any[] = []
  async addList() {
    let defectMode: any = document.getElementById('defectMode')
    let splitData = defectMode.value.split("\n")[0];
    const filter = this.oldValue.find(element => element == splitData)
    if (splitData != '' && filter == undefined) {
      this.oldValue.push(splitData)
      // console.log(this.oldValue);
      defectMode.value = ""
    } else {
      defectMode.value = ""
    }
    // console.log(`'${splitData}'`);




  }

  onClickDeleteModelModeList(index: number) {
    this.oldValue.splice(index, 1)
    // console.log(this.oldValue);
  }



}
