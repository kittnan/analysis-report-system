import { interval, Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal, { SweetAlertResult } from 'sweetalert2'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ColDef, GridApi, GridReadyEvent, RowNode, ValueGetterParams } from 'ag-grid-community';
import { HttpService } from 'app/service/http.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-analysis-data-list',
  templateUrl: './analysis-data-list.component.html',
  styleUrls: ['./analysis-data-list.component.css']
})
export class AnalysisDataListComponent implements OnInit {
  constructor(
    private api: HttpService,
    private route: Router
  ) { }

  // ? API
  RequestItems: any;
  MergeRequest: any = [];
  diffInDays: any;

  // ? Form COntrol
  Form = new FormGroup({
    ModelSelect: new FormControl(null, Validators.required),
    DateStart: new FormControl(null, Validators.required),
    DateEnd: new FormControl(null, Validators.required),
    Month: new FormControl(null, Validators.required)
  })

  LoadingPage: boolean = false

  get ModelSelect() { return this.Form.get('ModelSelect') }
  get DateStart() { return this.Form.get('DateStart') }
  get DateEnd() { return this.Form.get('DateEnd') }
  get Month() { return this.Form.get('Month') }


  // ? Variable Normal


  // ?  data table
  gridApi: GridApi
  rowData: any = []
  rowData2: any = []
  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    floatingFilter: true,
    filter: true,
  }

  columnDefs: ColDef[] = [
    {
      field: 'statusShow', filter: true, resizable: true, cellStyle: (params: any) => {
        let color
        params.value == "Ongoing" ? color = "lightyellow" : false
        params.value == "Ongoing with delay" ? color = "orange" : false
        params.value == "Making report" ? color = "yellow" : false
        params.value == "Done" ? color = "lightgreen" : false
        params.value == "Done with delay" ? color = "green" : false
        params.value == "Cancel" ? color = "red" : false
        return { backgroundColor: color }
      },
      headerName: "Status",
      headerTooltip: "Status"
    },
    {
      field: 'requestNumber',
      headerName: "Reg No.",
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
      headerName: "NG Ratio(%)",
      headerTooltip: "NG Ratio(%)"
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
      field: 'sendNgAnalysis',
      filter: 'agNumberColumnFilter',
      headerName: "Sent NG(pcs)",
      headerTooltip: "Sent NG To Analysis(pcs)"
    },
    {
      field: 'productionPhase',
      headerName: "Production Phase",
      headerTooltip: "Production Phase"
    },
    {
      field: 'defectCatagory',
      headerName: "Defect Category",
      headerTooltip: "Defect Category"
    },

    {
      field: 'abnormalLotLevel',
      headerName: "Abnormal Lot Level",
      headerTooltip: "Abnormal Lot Level"
    },
    {
      field: 'occurPlace',
      headerName: "Occur Place",
      headerTooltip: "Occur Place"
    },
    {
      field: 'issuer',
      headerName: "Issuer",
      headerTooltip: "Issuer"
    },
    {
      field: 'requestFormSectionName',
      headerName: "Req From(dep-section)",
      headerTooltip: "Request from (Department-Section)"
    },
    {
      field: 'sourceOfDefect',
      headerName: "Source Of Defect",
      headerTooltip: "Source Of Defect"
    },
    {
      field: 'causeOfDefect',
      headerName: "Cause Of Defect",
      headerTooltip: "Cause Of Defect"
    },
    {
      field: 'result',
      headerName: "Analysis Result",
      headerTooltip: "Analysis Result"
    },
    {
      field: 'canAnalysis',
      headerName: "Can Analysis",
      headerTooltip: "Can Analysis"
    },

    {
      field: 'analysisLevel',
      headerName: "Analysis Level",
      headerTooltip: "Analysis Level"
    },
    {
      field: 'defectCatagory',
      headerName: "Category Cause",
      headerTooltip: "Category Cause"
    },
    {
      field: 'claimNo',
      headerName: "Claim No",
      headerTooltip: "Claim No"
    },
    {
      field: 'TBNShow',
      headerName: "TBN",
      headerTooltip: "TBN"
    },
    {
      field: 'issueDate',
      filter: false,
      headerName: "Issue Date",
      headerTooltip: "Issue Date"
    },
    {
      field: 'replyDate',
      filter: false,
      headerName: "Reply Date",
      headerTooltip: "Reply Date"
    },
    {
      field: 'startAnalyzeDate',
      filter: false,
      headerName: "Start Analyze Date",
      headerTooltip: "Start Analyze Date"
    },
    {
      field: 'finishAnalyzeDate',
      filter: false,
      headerName: "Finish Analysis Date",
      headerTooltip: "Finish Analysis Date"
    },
    {
      field: 'finishReportDate',
      filter: false,
      headerName: "Finish Analysis Report Date",
      headerTooltip: "Finish Analysis Report Date"
    },
    {
      field: 'diffReport',
      headerName: "Total Analysis Date",
      headerTooltip: "Total Analysis Date"
    },
    {
      field: 'onTimeResult', filter: true, resizable: true,
      cellStyle: (params: any) => {
        let color = ''
        params.value == "On due" ? color = "lightgreen" : false
        params.value == "Over due" ? color = "orange" : false
        params.value == "Ongoing" ? color = "lightsalmon" : false

        params.value == "Over Due" ? color = "lightsalmon" : false
        return { backgroundColor: color }
      },
      valueFormatter: (p: any) => {
        let words = p.value.split(" ");
        let capitalizedWords = words.map((word: any) => word.charAt(0).toUpperCase() + word.slice(1));
        let result = capitalizedWords.join(" ");
        return result
      },
      headerName: "On Time Result",
      headerTooltip: "On Time Result"
    },
    {
      field: 'onTimeReport', filter: true, resizable: true,
      cellStyle: (params: any) => {
        let color = ''
        params.value == "On due" ? color = "lightgreen" : false
        params.value == "Over due" ? color = "orange" : false
        params.value == "Ongoing" ? color = "lightsalmon" : false
        return { backgroundColor: color }

      },
      headerName: "On Time Report",
      headerTooltip: "On Time Report"
    },
    {
      field: 'userApprove2Name',
      headerName: "Technician PIC",
      headerTooltip: "Technician PIC"
    },
    {
      field: 'userApprove3Name',
      headerName: "Engineer PIC",
      headerTooltip: "Engineer PIC"
    },
    {
      field: 'userApproveName',
      headerName: "Responsible Person",
      headerTooltip: "Responsible Person"
    },

  ];

  // ? interval
  interval$: Subscription

  ngOnInit(): void {

    this.interval$ = interval(1000).subscribe(res => this.setFilter())

    this.CheckStatusUser();
    this.GetModelAll();
    this.loadDataFromSessionCondition()

    // this.test ={
    //   onFilterChanged
    // }
  }
  ngOnDestroy(): void {
    this.interval$.unsubscribe()
  }


  CheckStatusUser() {
    let LevelList = [];
    localStorage.getItem('AR_UserLevel1') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel1')) : false
    localStorage.getItem('AR_UserLevel2') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel2')) : false
    localStorage.getItem('AR_UserLevel3') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel3')) : false
    localStorage.getItem('AR_UserLevel4') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel4')) : false
    localStorage.getItem('AR_UserLevel5') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel5')) : false
    localStorage.getItem('AR_UserLevel6') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel6')) : false
    const guest = localStorage.getItem('AR_UserEmployeeCode')

    if (LevelList.find(i => i == '3') ||
      LevelList.find(i => i == '4') ||
      LevelList.find(i => i == '5') ||
      LevelList.find(i => i == '6') ||
      LevelList.find(i => i == '0') ||
      guest == "guest"
    ) {
    } else {
      // alert("No access!!");
      this.route.navigate(['/manageForm'])
      // location.href = "#/manageForm"
    }
  }

  // ? API
  GetModelAll() {
    this.api.GetModelAll().subscribe((data: any) => {
      const guest = localStorage.getItem('AR_UserEmployeeCode')
      if (guest == 'guest') {
        this.RequestItems = data.filter(d => !(d.name.toLowerCase()).includes('amt'))
      } else {
        this.RequestItems = data
      }
    })
  }

  loadDataFromSessionCondition() {
    sessionStorage.getItem('Analysis-Model') ? this.ModelSelect.setValue(sessionStorage.getItem('Analysis-Model')) : false
    sessionStorage.getItem('Analysis-Month') ? this.Month.setValue(sessionStorage.getItem('Analysis-Month')) : false
    sessionStorage.getItem('Analysis-DateStart') ? this.DateStart.setValue(sessionStorage.getItem('Analysis-DateStart')) : false
    sessionStorage.getItem('Analysis-DateEnd') ? this.DateEnd.setValue(sessionStorage.getItem('Analysis-DateEnd')) : false

    if (
      this.ModelSelect.valid ||
      this.Month.valid ||
      this.DateStart.valid ||
      this.DateEnd.valid
    ) {
      this.OnClickSearch()
    }
  }

  handleEventDate(key: any) {

    switch (key) {
      case 'day':
        this.Month.reset()
        break;
      case 'month':
        this.DateStart.reset();
        this.DateEnd.reset();
    }
  }


  // ? EVENT

  SetStatus(Start, End) {
    // console.log("aa", this.sum);

    var dateForm = Start;
    var dateEnd = End;
    let str1 = dateForm.split("-");
    let y1 = Number(str1[0])
    let m1 = Number(str1[1])
    m1 = m1 - 1;
    let d1 = Number(str1[2])
    let str2 = dateEnd.split("-");
    let y2 = Number(str2[0])
    let m2 = Number(str2[1])
    m2 = m2 - 1;
    let d2 = Number(str2[2])

    // console.log(dateForm);
    // console.log(dateEnd);

    const oneDay = 1000 * 60 * 60 * 24;

    let start: any = new Date(y1, m1, d1);
    let end: any = new Date(y2, m2, d2);

    let sum = (end - start);
    this.diffInDays = Math.round(sum / oneDay);





  }

  async OnClickSearch() {
    this.MergeRequest = []
    const condition_search = {
      start: this.DateStart.value || null,
      end: this.DateEnd.value || null,
      month: this.Month.value || null
    }
    // console.log(condition_search);

    const request = await this.search(condition_search)
    // console.log(request);

    const requestByKey: any = await this.filterByRequestItem(request, this.ModelSelect.value)
    if (requestByKey.length != 0) {
      const requestArray = await this.setFormIdToArray(requestByKey)
      const result_search_formsId = await this.searchResultByFormsId(requestArray)
      const result_merge = await this.mergeData(requestByKey, result_search_formsId)
      // console.log(result_merge);
      const result_setstatus = await this.setStatusRequest(result_merge)
      if (result_setstatus == 'ok') {
        // console.log(result_merge);
        this.MergeRequest = result_merge
        let tempMap: any = await this.mapToDataTable(result_merge)
        const guest = localStorage.getItem('AR_UserEmployeeCode')
        //TODO Hidden status
        // tempMap = await this.filterStatus(tempMap);

        if (guest == 'guest') {
          this.rowData = tempMap.filter(d => !(d.requestNumber.toLowerCase()).includes('amt'))
        } else {
          this.rowData = tempMap
        }
        this.setSessionConditionFilter()
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No data such!',
        showConfirmButton: false,
        timer: 1500
      })
      this.rowData = []
    }

  }

  // ! filter status ongoing, done, done with delay
  //TODO Hidden status
  filterStatus(data: any) {
    return new Promise(resolve => {
      const result = data.filter((d: any) =>
        // d.statusShow.toLowerCase() == 'ongoing' ||
        // d.statusShow.toLowerCase().includes('done')
        d.statusShow.toLowerCase() != 'ongoing with delay' &&
        d.statusShow.toLowerCase() != 'done with delay' &&
        d.statusShow.toLowerCase() != 'cancel'
      )
      console.log(data);

      resolve(result)
    })
  }

  search(condition) {
    return new Promise((resolve) => {
      this.api.SearchRequestForm(condition).subscribe((data: any) => {
        resolve(data)
      })
    })
  }
  filterByRequestItem(datas, key) {
    return new Promise(resolve => {
      const result = datas.filter(data => data.requestItemId == key)
      // console.log(result);
      resolve(result)
    })
  }

  setFormIdToArray(forms) {
    return new Promise((resolve) => {
      const result_map = forms.map((form) => {
        return form._id
      })
      resolve(result_map)
    })
  }
  searchResultByFormsId(formsId) {
    return new Promise((resolve) => {
      this.api.test(formsId).subscribe((data: any) => {
        resolve(data)
      })
    })
  }
  mergeData(requests, results) {
    return new Promise(resolve => {

      const datas = [];
      requests.forEach(request => {
        const temp = results.filter(result => result.formId === request._id)

        // * มี result
        if (temp.length != 0) {
          const merge = { ...request, ...temp[0] }
          merge['FormId'] = request._id
          datas.push(merge)

          // * ไม่มี result
        } else {
          request['FormId'] = request._id
          datas.push(request)
        }
      });
      resolve(datas)

    })
  }

  mapToDataTable(merges) {
    return new Promise(resolve => {
      // console.log(merges);
      const result_map = merges.map(merge => {
        // console.log(merge);
        let ratio: any = Number(merge.ngRatio).toFixed(2)

        // const map = {
        //   Status: merge.statusShow,
        //   Reg_No: merge.requestNumber,
        //   Model: merge.ktcModelNumber,
        //   Project_Name: `${merge.size} / ${merge.customer}`,
        //   Defect_Name: merge.defectiveName,
        //   Lot_Number: merge.pcLotNumber,
        //   Input_Qty: Number(merge.inputQuantity),
        //   NG_Qty: Number(merge.ngQuantity),
        //   NG_Ratio: Number(ratio),
        //   Sent_NG_Analysis: Number(merge.sendNgAnalysis),
        //   Production_Phase: merge.productionPhase,
        //   Defect_Category: merge.defectCatagory,
        //   Claim_No: merge.claimNo,
        //   Abnormal_Lot_Level: merge.abnormalLotLevel,
        //   Occur_Place: `${merge.occurBName}, ${merge.occurB}`,
        //   Issuer: merge.issuer,
        //   Req_From: merge.requestFormSectionName,
        //   Cause_Of_Defect: merge.causeOfDefect,
        //   Analysis_Result: merge.result,
        //   Can_Analysis: merge.canAnalysis,
        //   Source_Of_Defect: merge.sourceOfDefect,
        //   Category_Cause: merge.defectCatagory,
        //   Analysis_Level: merge.analysisLevel,
        //   Issue_Date: new Date(merge.issuedDate).toLocaleDateString("en-US"),
        //   Reply_Date: new Date(merge.replyDate).toLocaleDateString("en-US"),
        //   Start_Analyze_Date: merge.startAnalyzeDate ? new Date(merge.startAnalyzeDate).toLocaleDateString("en-US") : "",
        //   Finish_Analysis_Date: merge.finishAnalyzeDate ? new Date(merge.finishAnalyzeDate).toLocaleDateString("en-US") : "",
        //   Finish_Analysis_Report_Date: merge.finishReportDate ? new Date(merge.finishReportDate).toLocaleDateString("en-US") : "",
        //   Total_Analysis_Date: merge.diffReport,
        //   Technician_PIC: merge.userApprove2Name,
        //   Engineer_PIC: merge.userApprove3Name,
        //   User_Now: merge.userApproveName,
        //   FormId: merge.FormId
        // }

        merge['projectName'] = `${merge.size} / ${merge.customer}`
        merge.inputQuantity = Number(merge.inputQuantity)
        merge.ngQuantity = Number(merge.ngQuantity)
        merge.ratio = parseFloat(ratio)
        merge.sendNgAnalysis = Number(merge.sendNgAnalysis)
        merge.occurPlace = merge.occurBName
        merge.issueDate = new Date(merge.issuedDate).toLocaleDateString("en-US")
        merge.replyDate = new Date(merge.replyDate).toLocaleDateString("en-US")
        merge.startAnalyzeDate = merge.startAnalyzeDate ? new Date(merge.startAnalyzeDate).toLocaleDateString("en-US") : ""
        merge.finishAnalyzeDate = merge.finishAnalyzeDate ? new Date(merge.finishAnalyzeDate).toLocaleDateString("en-US") : ""
        merge.finishReportDate = merge.finishReportDate ? new Date(merge.finishReportDate).toLocaleDateString("en-US") : ""
        merge.TBNShow = merge.TBN && merge.TBN != 'normal' ? merge.TBNNumber : 'Normal'
        return merge
      })

      resolve(result_map)
    })
  }

  setStatusRequest(merges: any) {
    return new Promise(resolve => {
      merges.map((item: any) => {
        item.issuedDate = ((item.issuedDate).split('T'))[0]
        item.replyDate = ((item.replyDate).split('T'))[0]
        item.startAnalyzeDate ? item.startAnalyzeDate = ((item.startAnalyzeDate).split('T'))[0] : false
        item.finishAnalyzeDate ? item.finishAnalyzeDate = ((item.finishAnalyzeDate).split('T'))[0] : false
        item.finishReportDate ? item.finishReportDate = ((item.finishReportDate).split('T'))[0] : false
        // console.log(merge.result);

        this.setStatusShow(item, 5)


        if (
          item.status == 1 ||
          item.status == 2 ||
          item.status == 2.1
        ) {
          this.setStatusShow(item, 1)
        }
        else if (
          item.status == 3 ||
          item.status == 3.1 ||
          item.status == 4 ||
          item.status == 4.3 ||
          item.status == 5 ||
          item.status == 5.4 ||
          item.status == 6.4
        ) {
          this.setStatusShow(item, 2)
        }
        else if (
          item.status == 6
        ) {
          this.setStatusShow(item, 3)
        }
        else if (
          item.status == 0
        ) {
          this.setStatusShow(item, 4)
        }
        this.setStatusShow(item, 6)
        this.setStatusShow(item, 7)
      })
      resolve('ok')
    })
  }

  setStatusShow(item: any, key: any) {
    return new Promise(resolve => {
      // console.log(key, merge);

      const dateNow = new Date().getTime();
      const issueDate = new Date(item.issuedDate).getTime()
      const replyDate = new Date(item.replyDate).getTime();
      const finishAnalyzeDate = new Date(item.finishAnalyzeDate).getTime()
      const finishReportDate = new Date(item.finishReportDate).getTime()
      // console.log(merge.finishReportDate, merge.issuedDate);
      // console.log(finishReportDate, issueDate);

      switch (key) {
        case 1:
          item['statusShow'] = 'Ongoing'
          item['color'] = 'Ongoing'
          // if (dateNow <= replyDate) {
          //   merge['statusShow'] = 'Ongoing'
          //   merge['color'] = 'Ongoing'
          // } else {
          //   merge['statusShow'] = 'Ongoing with delay'
          //   merge['color'] = 'OngoingWithDelay'
          // }
          break;
        case 2:
          if (item.result != undefined) {
            item['statusShow'] = 'Making report'
            item['color'] = 'MakingReport'
          } else if (dateNow <= replyDate) {
            item['statusShow'] = 'Ongoing'
            item['color'] = 'Ongoing'
          } else {
            item['statusShow'] = 'Ongoing with delay'
            item['color'] = 'OngoingWithDelay'
          }
          break;
        case 3:
          if (finishAnalyzeDate <= replyDate) {
            item['statusShow'] = 'Done'
            item['color'] = 'Done'
          } else {
            item['statusShow'] = 'Done with delay'
            item['color'] = 'DoneWithDelay'
          }
          break;
        case 4:
          item['statusShow'] = 'Cancel'
          item['color'] = 'Cancel'
          break;
        case 5:
          let difference = finishReportDate - issueDate
          var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
          daysDifference >= 0 ? item['diffReport'] = `${daysDifference} Day` : item['diffReport'] = "No result"
          daysDifference == 0 ? item['diffReport'] = `1 Day` : false
          break;
        case 6:
          item.onTimeResult = 'Ongoing'
          let diffOnTimeResult = replyDate - finishAnalyzeDate

          let dayOnTimeResult = Math.floor(diffOnTimeResult / 1000 / 60 / 60 / 24);
          if (diffOnTimeResult == 0) {
            item.onTimeResult = 'On due'
          } else {
            if (dayOnTimeResult >= 0) {
              item.onTimeResult = 'On due'
            } else if (dayOnTimeResult < 0) {
              item.onTimeResult = 'Over due'
            }
          }
          if (!finishAnalyzeDate) {
            if (item.statusShow == 'Ongoing') {
              item.onTimeResult = 'Ongoing'
            }
            if (item.statusShow == 'Ongoing with delay') {
              item.onTimeResult = 'Over Due'
            }
          }
          break;
        case 7:
          item.onTimeReport = 'Ongoing'

          let diffOnTimeReport = finishReportDate - finishAnalyzeDate
          let dayOnTimeReport = Math.floor(diffOnTimeReport / 1000 / 60 / 60 / 24);
          if (dayOnTimeReport <= 10) {
            item.onTimeReport = 'On due'
          } else if (dayOnTimeReport > 10) {
            item.onTimeReport = 'Over Due'
          }

          if (finishAnalyzeDate && !item.finishReportDate && item.statusShow == 'Making report') {
            let today = new Date().getTime()
            let diffDay = today - finishAnalyzeDate
            if (diffDay <= 10) {
              item.onTimeReport = 'Ongoing'
            } else if (diffDay > 10) {
              item.onTimeReport = 'Over due'
            }
          }
          break;
      }
      resolve(item)
    })

  }


  async onClickExportExcel() {

    try {
      this.LoadingPage = true
      if (this.MergeRequest.length != 0) {
        const filtered: any = await this.eachNode()
        // console.log('filtered', filtered);
        const result_build_data = await this.setDataBeforeExcel(filtered)
        await this.onLoadingExcel(result_build_data)

      } else {
        setTimeout(() => {
          this.LoadingPage = false
        }, 2000);

      }
    } catch (error) {
      Swal.fire({
        title: 'Warning !',
        icon: 'warning',
        text: 'Please Choose data'
      })
      this.LoadingPage = false
    } finally {
      setTimeout(() => {
        this.LoadingPage = false
      }, 2000);
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




  setDataBeforeExcel(datas: any) {

    return new Promise(async resolve => {
      const temp = datas.map((data: any) => {
        const newData = {
          Register_No: data.requestNumber,
          KTC_Model_Number: data.ktcModelNumber,
          Project_Name: (data.size) + "/" + (data.customer),
          Defect_Name: data.defectiveName,
          Lot_Number: data.pcLotNumber,
          Input_Quantity: data.inputQuantity,
          NG_Quantity: data.ngQuantity,
          // NG_Ratio: data.ngRatio? data.ngRatio + '%': '',
          NG_Ratio: data.ngRatio ? (Number(data.ngRatio).toFixed(2) + '%') : '',
          RelatedToESD: data.relatedToESD,
          Sent_NG_To_Analysis: data.sendNgAnalysis,
          Defect_Category: data.defectCatagory,
          Abnormal_Lot_Level: data.abnormalLotLevel,
          Occur_Place: data.occurBName,
          Issuer: data.issuer,
          Production_Phase: data.productionPhase,
          Request_From_Department: data.requestFormSectionName,
          Source_Of_Defect: data.sourceOfDefect,
          CauseOfDefect: data.causeOfDefect,
          Analysis_Result: data.result,
          Can_Analysis: data.canAnalysis,
          Analysis_Level: data.analysisLevel,
          Category_Cause: data.defectCatagory,
          Claim_No: data.claimNo,
          TBN: data.TBN && data.TBN != 'normal' ? data.TBNNumber : 'Normal',
          Issue_Date: data.issuedDate,
          Reply_Date: data.replyDate,
          Start_Analysis_Date: data.startAnalyzeDate,
          Finish_Analysis_Date: data.finishAnalyzeDate,
          Finish_Analysis_Report_Date: data.finishReportDate,
          Total_Analysis_Date: data.diffReport,
          On_Time_Result: data.onTimeResult,
          On_Time_Report: data.onTimeReport,
          Technical_PIC: data.userApprove2Name,
          Engineer_PIC: data.userApprove3Name,
          Responsible_Person: data.userApproveName,
          Status: data.statusShow,

        }
        return newData
      })
      resolve(temp)

    })
  }

  onLoadingExcel(datas: any) {
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
      const date = new Date();
      const ModalName = await this.setModelName()
      // const fileName = 'example.xlsx';
      let fileName = ''
      const dateStart = this.DateStart.valid ? this.DateStart.value : "Previous"
      const dateEnd = this.DateEnd.valid ? this.DateEnd.value : "Now"
      // console.log(this.Month.value);

      if (this.Month.valid) {
        fileName = `${ModalName}_${this.Month.value}.xlsx`;
      } else {
        fileName = `${ModalName}_${dateStart}_${dateEnd}.xlsx`;
      }

      FileSaver.saveAs(data, fileName);
      resolve(workbook)
    })
  }

  setModelName() {
    return new Promise(resolve => {
      const temp = this.RequestItems.find(i => i._id == this.ModelSelect.value)
      resolve(temp.name)
    })
  }



  ResetConditionFilter() {
    Swal.fire({
      title: 'Do you want to reset condition filters ?',
      icon: 'question',
      showCancelButton: true,
    }).then(r => {
      if (r.isConfirmed) {
        this.ModelSelect.reset()
        this.Month.reset()
        this.DateStart.reset()
        this.DateEnd.reset()

        sessionStorage.setItem('Analysis-Model', '')
        sessionStorage.setItem('Analysis-Month', '')
        sessionStorage.setItem('Analysis-DateStart', '')
        sessionStorage.setItem('Analysis-DateEnd', '')
        this.rowData = []
      }
    })
  }
  setSessionConditionFilter() {
    sessionStorage.setItem('Analysis-Model', '')
    sessionStorage.setItem('Analysis-Month', '')
    sessionStorage.setItem('Analysis-DateStart', '')
    sessionStorage.setItem('Analysis-DateEnd', '')

    this.ModelSelect.valid ? sessionStorage.setItem('Analysis-Model', this.ModelSelect.value) : false
    this.Month.valid ? sessionStorage.setItem('Analysis-Month', this.Month.value) : false
    this.DateStart.valid ? sessionStorage.setItem('Analysis-DateStart', this.DateStart.value) : false
    this.DateEnd.valid ? sessionStorage.setItem('Analysis-DateEnd', this.DateEnd.value) : false

  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onCellClicked(item: any) {
    const form = item.data
    const url = `#/viewForm?formId=${form.FormId}&formView=2`
    window.open(url, '_blank');
  }
  showCountRows() {
    return this.gridApi.getDisplayedRowCount()
  }

  setFilter() {
    if (!!this.gridApi) {
      const ses = sessionStorage.getItem('datalist_filter')
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
        sessionStorage.setItem('datalist_filter', str)
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
      sessionStorage.removeItem('datalist_filter')
      this.gridApi.setFilterModel(null)
    }
  }


}
