import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { environment } from '../../../environments/environment.prod'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ColDef } from 'ag-grid-community';
import { HttpService } from 'app/service/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-library-search',
  templateUrl: './library-search.component.html',
  styleUrls: ['./library-search.component.css']
})
export class LibrarySearchComponent implements OnInit {
  constructor(
    private api: HttpService,
    private route: Router
    // private api: RequestServiceService,
  ) { }

  // ? Fix IP
  IdModelNumber = environment.IdModelNumber

  // ? Session
  GuestUserStatus = sessionStorage.getItem('UserEmployeeCode')

  // ?API
  ModelNumberList: any;
  DefectList: any;
  DefectFilter: any = [];
  RequestItems: any = [];

  SectionList: any;
  FormFilter: any;
  Result: any;
  Sum: any = [];

  // todo User
  UserList: any;
  UserFilter: any = [];

  ModelNumberFilter: any = [];

  // ? Form Control
  Form = new FormGroup({
    ModelNumber: new FormControl(null, Validators.required),
    LotNumber: new FormControl(null, Validators.required),
    DefectName: new FormControl(null, Validators.required),
    DateStart: new FormControl(null, Validators.required),
    DateEnd: new FormControl(null, Validators.required),
    Month: new FormControl(null, Validators.required),
    InputQty: new FormControl(null, Validators.required),
    NgQty: new FormControl(null, Validators.required)

  })

  get ModelNumber() { return this.Form.get('ModelNumber') }
  get LotNumber() { return this.Form.get('LotNumber') }
  get DefectName() { return this.Form.get('DefectName') }
  get DateStart() { return this.Form.get('DateStart') }
  get DateEnd() { return this.Form.get('DateEnd') }
  get Month() { return this.Form.get('Month') }
  get InputQty() { return this.Form.get('InputQty') }
  get NgQty() { return this.Form.get('NgQty') }

  SelectAnySearch = new FormControl(null, Validators.required);
  RequestorName = new FormControl(null, Validators.required);
  RequestorId = new FormControl(null, Validators.required);
  SectionName = new FormControl(null, Validators.required);
  SelectRequestItem = new FormControl(null, Validators.required)
  SelectDefect = new FormControl(null, Validators.required);

  TempModelNumber = new FormControl(null, Validators.required);

  // ? Toggle
  ToggleDefect = false;
  ToggleRequest = false;

  ModelNumberToggle = false;

  toggleMore = false;
  toggleTable = false
  // ? normal
  TempDefectCode: any = null;
  CountNum = 0;

  // ?  data table
  rowData: any = []
  defaultColDef = {
    sortable: true,
    resizable: true,
    floatingFilter: true,
    filter: true,


  }
  columnDefs: ColDef[] = [
    {
      field: 'Req_No',
      headerName: "Req No.",
      headerTooltip: "Register Number"
    },
    {
      field: 'Model',
      headerTooltip: "KTC Model Number"
    },
    {
      field: 'Project_Name',
      headerName: "Pro Name",
      headerTooltip: "Project Name"
    },
    {
      field: 'Defect_Name',
      headerName: "Defect Name",
      headerTooltip: "Defect Name"
    },
    {
      field: 'Occur_Place',
      headerName: "Occur Place",
      headerTooltip: "Occur Place"
    },
    {
      field: 'Lot_Number',
      headerName: "Lot Number",
      headerTooltip: "Lot Number"
    },
    {
      field: 'Input_Qty',
      filter: 'agNumberColumnFilter',
      headerName: "Input Qty(pcs)",
      headerTooltip: "Input Qty(pcs)"
    },
    {
      field: 'Ng_Qty',
      filter: 'agNumberColumnFilter',
      headerName: "NG Qty(pcs)",
      headerTooltip: "NG Qty(pcs)"
    },
    {
      field: 'Ng_Ratio',
      filter: 'agNumberColumnFilter',
      headerName: "Ng Ratio(%)",
      headerTooltip: "Ng Ratio(%)"
    },
    {
      field: 'Result',
      headerName: "Result",
      headerTooltip: "Result Analysis"
    },
    {
      field: 'REQ_From',
      headerName: "Req From",
      headerTooltip: "Request From Section"
    },
    {
      field: 'REQ_Name',
      headerName: "Req Name",
      headerTooltip: "Request User Name"
    },
    {
      field: 'UserNow',
      headerName: "Responsible Person",
      headerTooltip: "Responsible Person"
    },
    {
      field: 'Status', filter: true, resizable: true, cellStyle: (params: any) => {
        if (
          params.value == 'Wait Approve Request' ||
          params.value == 'Analysis' ||
          params.value == 'Making Report' ||
          params.value == 'Reviewer Report' ||
          params.value == 'Approve Report'
        ) {
          return { color: 'green' }
        } else if (
          params.value == 'Finished'
        ) {
          return { color: 'blue' }
        } else {
          return { color: 'red' }
        }
      }
    },

  ];

  ngOnInit(): void {

    this.GetModelNumber();

    this.GetUser();
    this.GetSection();
    this.GetDefect();
    this.GetRequestItem()
    this.getKeySearch();
    this.onPageLoaded();

    // let currentdate:any = new Date();
    // let oneJan:any = new Date(currentdate.getFullYear(), 0, 1);
    // let numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    // let result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
    // console.log(`The week number of the current date (${currentdate}) is ${result}.`);
  }

  // ? API
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
  GetDefect() {
    this.api.GetDefectAll().subscribe((data: any) => {
      if (data.length > 0) {
        this.DefectList = data;
        this.DefectFilter = data;
        // console.log(data);
        // console.log("SUCCESS");

      } else {
        this.DefectList = null;
      }
    })
  }

  GetUser() {
    // console.log("LOADING2");

    this.api.GetUserAll().subscribe((data: any) => {
      if (data.length > 0) {
        this.UserList = data;
        this.UserFilter = data;
      } else {
        this.UserList = null;
      }
    })
  }

  GetSection() {
    // console.log("LOADING3");

    this.api.GetSection().subscribe((data: any) => {
      if (data.length > 0) {
        const filterSection = data.filter(section => section.view == 1)
        this.SectionList = filterSection;

      } else {
        this.SectionList = null;
      }
    })
  }

  GetRequestItem() {
    this.api.GetModel().subscribe((data: any) => {
      if (data.length != 0) {
        if (this.GuestUserStatus == 'guest') {
          this.RequestItems = data.filter(d => (!d.name.toLowerCase().includes('amt')))
        } else {
          this.RequestItems = data
        }
      } else {
        this.RequestItems = []
      }
    })
  }

  OnClickSearch() {

    this.Sum = [];
    this.rowData = []
    let condition = {
      ktcModelNumber: this.ModelNumber.value || null,
      pcLotNumber: this.LotNumber.value || null,
      defectiveName: this.DefectName.value || null,
      start: this.DateStart.value || null,
      end: this.DateEnd.value || null,
      count: this.CountNum || null,
      userId: this.RequestorId.value || null,
      sectionName: this.SectionName.value || null,
      requestItem: this.SelectRequestItem.value || null,
      month: this.Month.value || null,
      inputQty: this.InputQty.value || null,
      ngQty: this.NgQty.value || null
    }
    // console.log(condition);



    this.api.GetForm_lib(condition).subscribe((forms: any) => {
      if (forms.length != 0) {
        const map_forms_id = forms.map(form => {
          return form._id
        })
        this.api.GetResultByMultiFormId(map_forms_id).subscribe(async (results: any) => {
          if (results.length != 0) {
            this.Sum = await this.mergeRequest(forms, results)
            this.rowData = await this.mapToDataTable(this.Sum)
            this.setKeySearch()
          } else {
            this.Sum = await this.mergeRequest(forms, results)
            this.rowData = await this.mapToDataTable(this.Sum)
          }

          if (this.GuestUserStatus == 'guest') {
            this.rowData = this.rowData.filter(d => !(d.Req_No.toLowerCase()).includes('amt'))
          }

        })
      } else {
        Swal.fire({
          title: 'Data no such',
          icon: 'error'
        })
      }
    })

  }

  mergeRequest(forms, results) {
    return new Promise(resolve => {
      const merged = forms.map(form => {
        const result = results.find(result => result.formId == form._id)
        if (result != undefined) {
          const temp = { ...result, ...form }
          return temp
        } else {
          return form
        }
      })
      resolve(merged)

    })
  }


  mapToDataTable(merges) {
    return new Promise(resolve => {
      // console.log(merges);
      const result_map = merges.map(merge => {
        const status = this.setStatusForm(merge.status);

        let ratio: any = Number(merge.ngRatio).toFixed(2)
        const map = {
          Req_No: merge.requestNumber,
          Model: merge.ktcModelNumber,
          Project_Name: `${merge.size} / ${merge.customer}`,
          Defect_Name: merge.defectiveName,
          Occur_Place: merge.occurBName,
          Lot_Number: merge.pcLotNumber,
          Input_Qty: Number(merge.inputQuantity),
          Ng_Qty: Number(merge.ngQuantity),
          Ng_Ratio: Number(ratio),
          Result: merge.result,
          REQ_From: merge.requestFormSectionName,
          REQ_Name: merge.issuer,
          UserNow: merge.userApproveName,
          Status: status,
        }
        // console.log(map);


        return map
      })
      resolve(result_map)
    })
  }

  setStatusForm(oldStatus) {
    let status
    oldStatus == '1' ? status = 'Wait Approve Request' : false
    oldStatus == '2' ? status = 'Analysis' : false
    oldStatus == '3' ? status = 'Making Report' : false
    oldStatus == '4' ? status = 'Reviewer Report' : false
    oldStatus == '5' ? status = 'Approve Report' : false
    oldStatus == '6' ? status = 'Finished' : false
    oldStatus == '2.1' ? status = 'Reject' : false
    oldStatus == '3.1' ? status = 'Reject' : false
    oldStatus == '5.4' ? status = 'Reject' : false
    oldStatus == '6.4' ? status = 'Reject' : false
    oldStatus == '0' ? status = 'Cancel' : false
    return status
  }

  onCellClicked(e: any) {
    // console.log(e);
    // console.log(e.data);
    const find_data = this.Sum.find(i => i.requestNumber === e.data.Req_No)
    // console.log(find_data);
    // i.requestNumber
    if (find_data !== undefined) {
      sessionStorage.setItem('FormId', find_data._id);
      sessionStorage.setItem('FormView', '2');
      this.route.navigate(['/viewForm'])
      // location.href = "#/viewForm";
    }
  }

  async onPageLoaded() {
    const answer = this.getKeySearch();
    answer ? this.OnClickSearch() : false

  }


  // !



  ToggleFilter() {
    this.ToggleDefect = !this.ToggleDefect;
  }
  Filter() {
    this.DefectFilter = this.DefectList.filter(
      item => item.defectName.toLowerCase().includes(this.DefectName.value.toLowerCase())
    );
  }

  OnClickSelect(item: any) {
    this.TempDefectCode = item.defectCode;
    this.DefectName.setValue(item.defectName);
    this.ToggleFilter();
  }


  ClearDefectCode() {
    if (this.DefectName.invalid) {
      this.TempDefectCode = null;
    }
  }


  // ? toggle filter model number
  ToggleFilterModelNumber() {
    this.ModelNumberToggle = !this.ModelNumberToggle;
  }
  OnkeyUpModelNumber() {

    this.ModelNumberFilter = this.ModelNumberList.filter(
      item => item.name.toLowerCase().includes(this.ModelNumber.value.toLowerCase())
    )
  }
  SetModelNum() {
    this.ModelNumber.setValue(this.TempModelNumber.value)
  }


  // ? Toggle
  ToggleRequestName() {
    this.ToggleRequest = !this.ToggleRequest;
    // console.log(this.RequestorId.value);

  }

  FilterUser() {
    this.UserFilter = this.UserList.filter(
      item => item.FirstName.toLowerCase().includes(this.RequestorName.value.toLowerCase())
    );
  }

  ClearAnySearch() {
    this.RequestorName.reset();
    this.RequestorId.reset();
    this.SectionName.reset();
    this.SelectRequestItem.reset();
  }

  OnClickUser(item: any) {
    let FullName = item.FirstName + "-" + item.LastName;
    this.RequestorName.setValue(FullName);
    this.ToggleRequestName();
  }



  OnClickForm(item: any) {
    // console.log(item);
    sessionStorage.setItem('FormId', item._id);
    sessionStorage.setItem('FormView', '2');
    this.route.navigate(['/viewForm'])
    // location.href = "#/viewForm";
  }

  ResetConditionFilter() {

    Swal.fire({
      title: 'Do you want to reset all filter ?',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then((r) => {
      if (r.isConfirmed) {



        this.Sum = [];
        this.Form.reset();
        this.SelectAnySearch.reset();
        this.RequestorName.reset();
        this.RequestorId.reset();
        this.SectionName.reset();
        this.SelectRequestItem.reset();
        this.SelectDefect.reset();
        this.ToggleDefect = false;
        this.toggleMore = false
        this.ToggleRequest = false;
        this.TempDefectCode = null;
        this.CountNum = 0;

        sessionStorage.removeItem('Search-DateStart')
        sessionStorage.removeItem('Search-DateEnd')
        sessionStorage.removeItem('Search-Month')

        sessionStorage.removeItem('Search-ModelNumber')
        sessionStorage.removeItem('Search-LotNumber')
        sessionStorage.removeItem('Search-DefectName')
        sessionStorage.removeItem('Search-TempDefectCode')
        sessionStorage.removeItem('Search-InputQty')
        sessionStorage.removeItem('Search-NgQty')

        sessionStorage.removeItem('Search-Section')
        sessionStorage.removeItem('Search-RequestItem')
        sessionStorage.removeItem('Search-RequestId')

        this.rowData = []

        // this.ngOnInit();
      }
    })


  }

  // * on load excel
  async onClickExportExcel() {
    // console.log(this.Sum);

    if (this.Sum.length != 0) {
      console.log(this.Sum);

      const result_build_data = await this.setDataBeforeExcel(this.Sum)
      console.log(result_build_data);

      const result: any = await this.onLoadingExcel(result_build_data)
      if (result == 'ok') {
      }

    } else {
      Swal.fire({
        title: 'Warning !',
        icon: 'warning',
        text: 'Please Choose data'
      })
    }
  }
  setDataBeforeExcel(datas) {

    return new Promise(resolve => {
      const temp = datas.map(data => {
        const status: any = this.setStatusForms(data.status)

        const newData = {
          Register_No: data.requestNumber,
          KTC_Model_Number: data.ktcModelNumber,
          Defect_Name: data.defectiveName,
          Lot_Number: data.pcLotNumber,
          Input_Quantity: data.inputQuantity,
          NG_Quantity: data.ngQuantity,
          Sent_NG_To_Analysis: data.sendNgAnalysis,
          Production_Phase: data.productionPhase,
          Defect_Category: data.defectCatagory,
          Abnormal_Lot_Level: data.abnormalLotLevel,
          Occur_Place: data.occurBName,
          Issuer: data.issuer,
          Request_From_Department: data.requestFormSectionName,
          Analysis_Result: data.causeOfDefect,
          Category_Cause: data.defectCatagory,
          Issue_Date: data.issuedDate ? ((data.issuedDate).split('T'))[0] : data.issuedDate,
          Reply_Date: data.replyDate ? ((data.replyDate).split('T'))[0] : data.replyDate,
          Start_Analysis_Date: data.startAnalyzeDate ? ((data.startAnalyzeDate).split('T'))[0] : data.startAnalyzeDate,
          Finish_Analysis_Date: data.finishAnalyzeDate ? ((data.finishAnalyzeDate).split('T'))[0] : data.finishAnalyzeDate,
          Technicial_PIC: data.userApprove2Name,
          Engineer_PIC: data.userApprove3Name,
          Responsible_Person: data.userApproveName,
          Status: status
        }
        return newData
      })
      resolve(temp)

    })
  }
  setStatusForms(status) {
    let summary
    switch (status) {
      case 1:
        summary = "Wait Approve Request"
        break;
      case 2:
        summary = "Analysis"
        break;
      case 3:
        summary = "Making Report"
        break;
      case 4:
        summary = "Reviewer Report"
        break;
      case 5:
        summary = "Approve Report"
        break;
      case 6:
        summary = "Finished"
        break;
      case 2.1:
        summary = "Reject"
        break;
      case 3.1:
        summary = "Reject"
        break;
      case 4.3:
        summary = "Reject"
        break;
      case 5.4:
        summary = "Reject"
        break;
      case 6.4:
        summary = "Reject"
        break;
      case 0:
        summary = "Cancel"
        break;

      default: summary = ""
        break;
    }
    return summary

  }

  onLoadingExcel(datas) {
    return new Promise(async resolve => {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datas);
      const workbook: XLSX.WorkBook = {
        Sheets: { Sheet1: worksheet },
        SheetNames: ['Sheet1'],
      };

      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });

      const data: Blob = new Blob([excelBuffer], { type: 'EXCEL_TYPE' });
      const date = new Date().getTime()
      const fileName = `data_records.xlsx`;
      // const fileName = `${date}.xlsx`;

      FileSaver.saveAs(data, fileName);
      resolve('ok')
    })
  }




  setKeySearch() {
    sessionStorage.setItem('Search-DateStart', this.DateStart.value)
    sessionStorage.setItem('Search-DateEnd', this.DateEnd.value)
    sessionStorage.setItem('Search-Month', this.Month.value)

    sessionStorage.setItem('Search-ModelNumber', this.ModelNumber.value)
    sessionStorage.setItem('Search-LotNumber', this.LotNumber.value)
    sessionStorage.setItem('Search-DefectName', this.DefectName.value)
    sessionStorage.setItem('Search-TempDefectCode', this.TempDefectCode)
    sessionStorage.setItem('Search-InputQty', this.InputQty.value)
    sessionStorage.setItem('Search-NgQty', this.NgQty.value)

    sessionStorage.setItem('Search-Section', this.SectionName.value)
    sessionStorage.setItem('Search-RequestItem', this.SelectRequestItem.value)
    sessionStorage.setItem('Search-RequestId', this.RequestorId.value)


  }
  getKeySearch() {
    sessionStorage.getItem('Search-DateStart') != "null" ? this.DateStart.setValue(sessionStorage.getItem('Search-DateStart')) : false
    sessionStorage.getItem('Search-DateEnd') != "null" ? this.DateEnd.setValue(sessionStorage.getItem('Search-DateEnd')) : false
    sessionStorage.getItem('Search-Month') != "null" ? this.Month.setValue(sessionStorage.getItem('Search-Month')) : false

    sessionStorage.getItem('Search-ModelNumber') != "null" ? this.ModelNumber.setValue(sessionStorage.getItem('Search-ModelNumber')) : false
    sessionStorage.getItem('Search-LotNumber') != "null" ? this.LotNumber.setValue(sessionStorage.getItem('Search-LotNumber')) : false
    sessionStorage.getItem('Search-DefectName') != "null" ? this.DefectName.setValue(sessionStorage.getItem('Search-DefectName')) : false
    sessionStorage.getItem('Search-TempDefectCode') != "null" ? this.TempDefectCode = (sessionStorage.getItem('Search-TempDefectCode')) : false
    sessionStorage.getItem('Search-InputQty') != "null" ? this.InputQty.setValue(sessionStorage.getItem('Search-InputQty')) : false
    sessionStorage.getItem('Search-NgQty') != "null" ? this.NgQty.setValue(sessionStorage.getItem('Search-NgQty')) : false

    sessionStorage.getItem('Search-Section') != "null" ? this.SectionName.setValue(sessionStorage.getItem('Search-Section')) : false
    sessionStorage.getItem('Search-RequestItem') != "null" ? this.SelectRequestItem.setValue(sessionStorage.getItem('Search-RequestItem')) : false
    sessionStorage.getItem('Search-RequestId') != "null" ? this.RequestorId.setValue(sessionStorage.getItem('Search-RequestId')) : false
    if (
      this.DateStart.valid ||
      this.DateEnd.valid ||
      this.Month.valid ||
      this.ModelNumber.valid ||
      this.LotNumber.valid ||
      this.DefectName.valid ||
      this.TempDefectCode ||
      this.InputQty.valid ||
      this.NgQty.valid ||
      this.SectionName.valid ||
      this.RequestItems.valid ||
      this.RequestorId.valid
    ) {
      return true
    }
  }



  onClickMoreSearch() {
    this.toggleMore = !this.toggleMore;
    if (this.toggleMore == false) {
      this.ClearAnySearch();
    }
  }

  top() {
    window.scrollTo(0, 0);
  }

  sortTest() {
    this.Sum.reverse();
  }
}
