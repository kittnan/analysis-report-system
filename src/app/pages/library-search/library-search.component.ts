import { interval, Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal, { SweetAlertResult } from 'sweetalert2'
import { environment } from '../../../environments/environment.prod'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ColDef, GridApi, GridReadyEvent, RowNode } from 'ag-grid-community';
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
  GuestUserStatus = localStorage.getItem('AR_UserEmployeeCode')

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
  gridApi: GridApi
  rowData: any = []
  defaultColDef = {
    sortable: true,
    resizable: true,
    floatingFilter: true,
    filter: true,


  }
  columnDefs: ColDef[] = [
    {
      field: 'requestNumber',
      headerName: "Req No.",
      headerTooltip: "Register Number"
    },
    {
      field: 'ktcModelNumber',
      headerName: "KTC Model Number",
      headerTooltip: "KTC Model Number",
    },
    {
      field: 'projectName',
      headerName: "Pro Name",
      headerTooltip: "Project Name"
    },
    {
      field: 'defectiveName',
      headerName: "Defect Name",
      headerTooltip: "Defect Name"
    },
    {
      field: 'occurPlace',
      headerName: "Occur Place",
      headerTooltip: "Occur Place"
    },
    {
      field: 'pcLotNumber',
      headerName: "Lot Number",
      headerTooltip: "Lot Number"
    },
    {
      field: 'inputQuantity',
      filter: 'agNumberColumnFilter',
      headerName: "Input Qty(pcs)",
      headerTooltip: "Input Qty(pcs)"
    },
    {
      field: 'ngQuantity',
      filter: 'agNumberColumnFilter',
      headerName: "NG Qty(pcs)",
      headerTooltip: "NG Qty(pcs)"
    },
    {
      field: 'ratio',
      filter: 'agNumberColumnFilter',
      headerName: "Ng Ratio(%)",
      headerTooltip: "Ng Ratio(%)"
    },
    {
      field: 'relatedToESD',
      headerName: "Related To ESD",
      headerTooltip: "Related To ESD",
      valueFormatter: ((p: any) => {
        if (p.data.relatedToESD) {
          return p.data.relatedToESD.charAt(0).toUpperCase() + p.data.relatedToESD.slice(1);
        } else {
          return ''
        }
      })
    },
    {
      field: 'TBNShow',
      headerName: "TBN",
      headerTooltip: "TBN"
    },
    {
      field: 'result',
      headerName: "Result",
      headerTooltip: "Result Analysis"
    },
    {
      field: 'requestFormSectionName',
      headerName: "Req From",
      headerTooltip: "Request From Section"
    },
    {
      field: 'issuer',
      headerName: "Req Name",
      headerTooltip: "Request User Name"
    },
    {
      field: 'userApproveName',
      headerName: "Responsible Person",
      headerTooltip: "Responsible Person"
    },
    {
      field: 'statusShow', filter: true, resizable: true, cellStyle: (params: any) => {
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
      },
      headerName: "Status",
      headerTooltip: "Status"
    },

  ];

  // ? interval
  interval$: Subscription
  ngOnInit(): void {

    this.interval$ = interval(1000).subscribe(res => this.setFilter())

    this.GetModelNumber();

    this.GetUser();
    this.GetSection();
    this.GetDefect();
    this.GetRequestItem()
    this.getKeySearch();
    this.onPageLoaded();
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
            this.rowData = this.rowData.filter(d => !(d.requestNumber.toLowerCase()).includes('amt'))
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
        // const map = {
        //   Req_No: merge.requestNumber,
        //   Model: merge.ktcModelNumber,
        //   Project_Name: `${merge.size} / ${merge.customer}`,
        //   Defect_Name: merge.defectiveName,
        //   Occur_Place: merge.occurBName,
        //   Lot_Number: merge.pcLotNumber,
        //   Input_Qty: Number(merge.inputQuantity),
        //   Ng_Qty: Number(merge.ngQuantity),
        //   Ng_Ratio: Number(ratio),
        //   Result: merge.result,
        //   relatedToESD: merge.relatedToESD,
        //   REQ_From: merge.requestFormSectionName,
        //   REQ_Name: merge.issuer,
        //   UserNow: merge.userApproveName,
        //   Status: status,
        // }
        merge['projectName'] = `${merge.size} / ${merge.customer}`
        merge['statusShow'] = status
        merge.inputQuantity = Number(merge.inputQuantity)
        merge.ngQuantity = Number(merge.ngQuantity)
        merge.ratio = parseFloat(ratio)
        merge.sendNgAnalysis = Number(merge.sendNgAnalysis)
        merge.occurPlace = merge.occurBName
        merge.issueDate = new Date(merge.issuedDate).toLocaleDateString("en-US")
        merge.replyDate = new Date(merge.replyDate).toLocaleDateString("en-US")
        merge.TBNShow = merge.TBN && merge.TBN != 'normal' ? merge.TBNNumber : 'Normal'

        return merge
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

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onCellClicked(e: any) {

    const find_data = this.Sum.find(i => i.requestNumber == e.data.requestNumber)
    if (find_data !== undefined) {
      const url = `#/viewForm?formId=${find_data._id}&formView=2`
      window.open(url, '_blank');
      // sessionStorage.setItem('FormId', find_data._id);
      // sessionStorage.setItem('FormView', '2');

      // const url = '#/viewForm'
      // window.open(url, '_blank');
      // this.route.navigate(['/viewForm'])

      // location.href = "#/viewForm";
    }
  }

  showCountRows() {
    return this.gridApi.getDisplayedRowCount()
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
    try {
      const filtered: any = await this.eachNode()
      if (filtered.length != 0) {
        const result_build_data = await this.setDataBeforeExcel(filtered)
        await this.onLoadingExcel(result_build_data)

      } else {
        Swal.fire({
          title: 'Warning !',
          icon: 'warning',
          text: 'Please Choose data'
        })
      }
    } catch (error) {

    } finally {

    }
  }

  private eachNode() {
    return new Promise(resolve => {
      let temp: any[] = []
      this.gridApi.forEachNodeAfterFilter((rowNode: RowNode, index: number) => {
        temp.push(rowNode.data)
      })
      resolve(temp)
    })
  }
  setDataBeforeExcel(datas) {

    return new Promise(resolve => {
      const temp = datas.map(data => {
        const status: any = this.setStatusForms(data.status)

        const newData = {
          Register_No: data.requestNumber,
          KTC_Model_Number: data.ktcModelNumber,
          ProjectName: data.projectName,
          Defect_Name: data.defectiveName,
          Lot_Number: data.pcLotNumber,
          Input_Quantity: data.inputQuantity,
          NG_Quantity: data.ngQuantity,
          NG_Ratio: data.ratio,
          Sent_NG_To_Analysis: data.sendNgAnalysis,
          Production_Phase: data.productionPhase,
          Defect_Category: data.defectCatagory,
          Abnormal_Lot_Level: data.abnormalLotLevel,
          Occur_Place: data.occurBName,
          Issuer: data.issuer,
          Request_From_Department: data.requestFormSectionName,
          relatedToESD: data.relatedToESD,
          TBN: data.TBNShow,
          Result: data.result,
          Analysis_Result: data.causeOfDefect,
          Category_Cause: data.defectCatagory,
          Issue_Date: data.issuedDate ? ((data.issuedDate).split('T'))[0] : data.issuedDate,
          Reply_Date: data.replyDate ? ((data.replyDate).split('T'))[0] : data.replyDate,
          Start_Analysis_Date: data.startAnalyzeDate ? ((data.startAnalyzeDate).split('T'))[0] : data.startAnalyzeDate,
          Finish_Analysis_Date: data.finishAnalyzeDate ? ((data.finishAnalyzeDate).split('T'))[0] : data.finishAnalyzeDate,
          Technical_PIC: data.userApprove2Name,
          Engineer_PIC: data.userApprove3Name,
          Responsible_Person: data.userApproveName,
          Status: status
        }
        // const newData = {
        //   Register_No: data.requestNumber,
        //   KTC_Model_Number: data.ktcModelNumber,
        //   Defect_Name: data.defectiveName,
        //   Lot_Number: data.pcLotNumber,
        //   Input_Quantity: data.inputQuantity,
        //   NG_Quantity: data.ngQuantity,
        //   Sent_NG_To_Analysis: data.sendNgAnalysis,
        //   Production_Phase: data.productionPhase,
        //   Defect_Category: data.defectCatagory,
        //   Abnormal_Lot_Level: data.abnormalLotLevel,
        //   Occur_Place: data.occurBName,
        //   Issuer: data.issuer,
        //   Request_From_Department: data.requestFormSectionName,
        //   relatedToESD: data.relatedToESD,
        //   Analysis_Result: data.causeOfDefect,
        //   Category_Cause: data.defectCatagory,
        //   Issue_Date: data.issuedDate ? ((data.issuedDate).split('T'))[0] : data.issuedDate,
        //   Reply_Date: data.replyDate ? ((data.replyDate).split('T'))[0] : data.replyDate,
        //   Start_Analysis_Date: data.startAnalyzeDate ? ((data.startAnalyzeDate).split('T'))[0] : data.startAnalyzeDate,
        //   Finish_Analysis_Date: data.finishAnalyzeDate ? ((data.finishAnalyzeDate).split('T'))[0] : data.finishAnalyzeDate,
        //   Technicial_PIC: data.userApprove2Name,
        //   Engineer_PIC: data.userApprove3Name,
        //   Responsible_Person: data.userApproveName,
        //   Status: status
        // }
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
      resolve(workbook)
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

  setFilter() {
    if (!!this.gridApi) {
      const ses = sessionStorage.getItem('library_filter')
      if (ses) {
        const json = JSON.parse(ses)
        this.gridApi.setFilterModel(json)
      }
    }
  }
  onSaveFilter() {
    Swal.fire({
      title: 'Do you want to save table filter?',
      icon: 'question',
      showCancelButton: true
    }).then((value: SweetAlertResult) => {
      if (value.isConfirmed) {
        const foo: any = this.gridApi.getFilterModel()
        const str = JSON.stringify(foo)
        sessionStorage.setItem('library_filter', str)
        Swal.fire('SUCCESS', '', 'success')
      }
    })
  }
  onClearFilter() {
    Swal.fire({
      title: 'Do you want to clear table filter?',
      icon: 'question',
      showCancelButton: true
    }).then((value: SweetAlertResult) => {
      if (value.isConfirmed) {
        this.clearFilter()
        Swal.fire('SUCCESS', '', 'success')
      }
    })

  }

  clearFilter() {
    if (this.gridApi) {
      sessionStorage.removeItem('library_filter')
      this.gridApi.setFilterModel(null)
    }
  }
}
