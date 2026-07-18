import { interval, Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal, { SweetAlertResult } from 'sweetalert2'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import { ColDef, GridApi, GridReadyEvent, RowNode, ValueGetterParams } from 'ag-grid-community';
import { HttpService } from 'app/service/http.service';
import { Router } from '@angular/router';
var moment = require('moment')


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
    Month: new FormControl(null, Validators.required),
    ReplyDateStart: new FormControl(null),
    ReplyDateEnd: new FormControl(null),
  })

  LoadingPage: boolean = false

  get ModelSelect() { return this.Form.get('ModelSelect') }
  get DateStart() { return this.Form.get('DateStart') }
  get DateEnd() { return this.Form.get('DateEnd') }
  get Month() { return this.Form.get('Month') }
  get ReplyStart() { return this.Form.get('ReplyDateStart') }
  get ReplyEnd() { return this.Form.get('ReplyDateEnd') }

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
      field: 'statusShow',
      filter: true,
      resizable: true,
      cellStyle: (params: any) => {
        let color
        params.value == "Ongoing" ? color = "lightyellow" : false
        params.value == "Ongoing with delay" ? color = "orange" : false
        params.value == "Making report" ? color = "yellow" : false
        params.value == "Done" ? color = "lightgreen" : false
        params.value == "Done with delay" ? color = "green" : false
        params.value == "Cancel" ? color = "lightgray" : false
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
      field: 'treatment',
      headerName: "Treatment",
      headerTooltip: "Treatment",
      cellStyle: (params: any) => {
        let color = ''
        params.value == "Urgent" ? color = "red" : false
        params.value == "Normal" ? color = "blue" : false
        return { color: color }
      },
    },
    {
      field: 'ktcModelNumber',
      headerName: "KTC Model Number",
      headerTooltip: "KTC Model Number",
    },
    // {
    //   field: 'projectName',
    //   headerName: "Pro Name",
    //   headerTooltip: "Project Name"
    // },
    {
      field: 'size',
      headerName: "Size",
      headerTooltip: "Size"
    },
    {
      field: 'customer',
      headerName: "Customer",
      headerTooltip: "Customer"
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
      field: 'JudgementDefect',
      headerName: "Judgement defect",
      headerTooltip: "Judgement defect"
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
        params.value == "Ongoing" ? color = "rgba(255,255,224,255)" : false
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
        params.value == "Ongoing" ? color = "rgba(255,255,224,255)" : false
        return { backgroundColor: color }

      },
      valueFormatter: (p: any) => {
        let words = p.value.split(" ");
        let capitalizedWords = words.map((word: any) => word.charAt(0).toUpperCase() + word.slice(1));
        let result = capitalizedWords.join(" ");
        return result
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


    {
      field: 'operatorName',
      headerName: "Operator Name",
      headerTooltip: "Operator Name"
    },
    {
      field: 'difficultyOfWork',
      headerName: "Difficulty of Work",
      headerTooltip: "Difficulty of Work"
    },
    {
      field: 'correctOfWork',
      headerName: "Correct of Work",
      headerTooltip: "Correct of Work"
    },
    {
      field: 'analysisTime',
      headerName: "Analysis Time",
      headerTooltip: "Analysis Time"
    },

  ];

  // ? interval
  interval$: Subscription

  holidays: any = []

  async ngOnInit(): Promise<void> {

    this.interval$ = interval(1000).subscribe(res => this.setFilter())

    this.CheckStatusUser();
    this.GetModelAll();
    this.loadDataFromSessionCondition()

    // this.test ={
    //   onFilterChanged
    // }

    this.holidays = await this.getHoliday()

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
    sessionStorage.getItem('Analysis-ReplyStart') ? this.ReplyStart.setValue(sessionStorage.getItem('Analysis-ReplyStart')) : false
    sessionStorage.getItem('Analysis-ReplyEnd') ? this.ReplyEnd.setValue(sessionStorage.getItem('Analysis-ReplyEnd')) : false
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
      month: this.Month.value || null,
      replyStart: this.ReplyStart.value || null,
      replyEnd: this.ReplyEnd.value || null
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

        if (merge.requestItem.includes('_FM') && merge.result2) {
          merge.result = merge.result2.map((r: any) => `${r.item} : ${r.qty}`).join(',\n')
        }

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
          if (item.result != undefined || item.result2 != undefined) {
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
          if (dayOnTimeResult == 0) {
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
              item.onTimeResult = 'Over due'
            }
          }
          break;
        case 7:
          item.onTimeReport = 'Ongoing'

          const isFinishAnalyze = item.finishAnalyzeDate ? true : false
          const isFinishReport = item.finishReportDate ? true : false
          let diffOnTimeReport = isFinishAnalyze && isFinishReport ? finishReportDate - finishAnalyzeDate : 0

          if (isFinishReport && isFinishAnalyze) {

            const dueDate = this.findDueDate(item.finishAnalyzeDate, 5, false)

            // const onDue = moment(item.finishReportDate, 'YYYY-MM-DD')
            //   .isBetween(moment(item.finishAnalyzeDate, 'YYYY-MM-DD').startOf('day'), dueDate.endOf('day'))

            const s = moment(item.finishAnalyzeDate).toDate()
            const e = dueDate.toDate()

            const v = moment(item.finishReportDate).toDate()

            const onDue = moment(v).isBetween(moment(s).startOf('day'), moment(e).endOf('day'), undefined, '[]')

            // if (item.requestNumber == 'MDL-2026-0901') {
            //   if (s <= v && v <= e) {
            //     console.log('on due')
            //   }
            // }

            const afterDue = moment(item.finishReportDate, 'YYYY-MM-DD').isAfter(dueDate.endOf('day'))
            if (onDue) {
              item.onTimeReport = 'Done'
            } else if (afterDue) {
              item.onTimeReport = 'Done with delay'
            }

            // if (item.requestNumber == 'MDL-2026-0901') {
            //   console.log('finishAnalyzeDate', item.finishAnalyzeDate);
            //   console.log(`⚡ ~ :763 ~ AnalysisDataListComponent ~ dueDate:`, dueDate.clone().format('DD-MM-YYYY'));

            //   console.log('finishReportDate', item.finishReportDate);

            //   console.log(`⚡ ~ :767 ~ AnalysisDataListComponent ~ onDue:`, onDue);
            //   console.log(`⚡ ~ :767 ~ AnalysisDataListComponent ~ afterDue:`, afterDue);

            // }
            //   console.log('dueDate', dueDate);

            //   console.log('onDue', onDue);
            // }
            // let totalDaysSpanned = this.findRemainDay(4, item?.finishAnalyzeDate)
            // // let countMakingReport = this.findStartBetweenEndWorkingDay(item.finishAnalyzeDate, item.finishReportDate, true)
            // let foo = moment(item.finishAnalyzeDate).startOf('day').add(totalDaysSpanned, "days").diff(moment(item.finishReportDate).startOf('day'), "days")

            // if (item.requestNumber == 'MDL-2026-0671') {
            //   console.log('totalDaysSpanned', totalDaysSpanned);

            //   // console.log(item?.finishAnalyzeDate, totalDaysSpanned);
            //   console.log(`!!!`, foo);
            //   console.log(item);

            // }
            // // if (item.status == 5 && item.status == 6) {
            // //   if (countMakingReport !== null && countMakingReport <= 4 && countMakingReport >= 0) {
            // //     item.onTimeReport = 'Done'
            // //   } else {
            // //     item.onTimeReport = 'Done with delay'
            // //   }
            // // } else {
            // //   item.onTimeReport = 'Done with delay2'
            // // }


            // if (foo >= 1) {
            //   item.onTimeReport = 'Done'
            // } else {
            //   item.onTimeReport = 'Done with delay'
            // }
            break;
          } else
            if (isFinishAnalyze && !isFinishReport) {
              let totalDaysSpanned = this.findRemainDay(4, item?.finishAnalyzeDate)
              let foo = moment().startOf('day').add(totalDaysSpanned, "days").diff(moment().startOf('day'), "days")

              // // totalDaysSpanned += 1
              // if (item.requestNumber == 'MDL-2026-0765') {
              //   console.log(item?.finishAnalyzeDate);
              //   console.log(`@@@`, totalDaysSpanned);

              //   // let testaa = this.findRemainDay(4, moment('18-05-2026', 'DD-MM-YYYY').toDate())

              //   // console.log(`⚡ ~ :796 ~ AnalysisDataListComponent ~ testaa:`, testaa);

              //   let foo = moment().startOf('day').add(totalDaysSpanned, "days").diff(moment().startOf('day'), "days")

              //   console.log(`⚡ ~ :800 ~ AnalysisDataListComponent ~ foo:`, foo);


              // }

              if (foo >= 1) {
                item.onTimeReport = 'Ongoing'
              } else {
                item.onTimeReport = 'Over due'
              }
              break;
            }


        // let dayOnTimeReport = Math.floor(diffOnTimeReport / 1000 / 60 / 60 / 24);
        // if (dayOnTimeReport <= 10 && (item.statusShow == 'Done' || item.statusShow == 'Done with delay')) {
        //   item.onTimeReport = 'On due'
        // } else if (dayOnTimeReport > 10 && (item.statusShow == 'Done' || item.statusShow == 'Done with delay')) {
        //   item.onTimeReport = 'Over due'
        // }

        // if (finishAnalyzeDate && !item.finishReportDate && item.statusShow == 'Making report') {
        //   let today = new Date().getTime()
        //   let diffDay = today - finishAnalyzeDate
        //   diffDay = Math.floor(diffDay / 1000 / 60 / 60 / 24);

        //   if (diffDay <= 10) {
        //     item.onTimeReport = 'Ongoing'
        //   } else if (diffDay > 10) {
        //     item.onTimeReport = 'Over due'
        //   }
        // }
        // break;
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
      const temp: any[] = [];

      datas.forEach((data: any) => {
        if (data.requestItem.includes('_FM') && data.result2?.length > 0) {
          // สำหรับ _FM ที่มี result2 - สร้างหลาย rows
          data.result2.forEach((item: any, index: number) => {
            const newData = {
              Register_No: index === 0 ? data.requestNumber : '', // แสดงเฉพาะ row แรก
              KTC_Model_Number: index === 0 ? data.ktcModelNumber : '',
              Treatment: index === 0 ? data.treatment : '',
              // Project_Name: index === 0 ? (data.size) + "/" + (data.customer) : '',
              Size: index === 0 ? (data.size) : '',
              Customer: index === 0 ? (data.customer) : '',
              Defect_Name: index === 0 ? data.defectiveName : '',
              Lot_Number: index === 0 ? data.pcLotNumber : '',
              Input_Quantity: index === 0 ? data.inputQuantity : '',
              NG_Quantity: index === 0 ? data.ngQuantity : '',
              NG_Ratio: index === 0 ? (data.ngRatio ? (Number(data.ngRatio).toFixed(2) + '%') : '') : '',
              RelatedToESD: index === 0 ? data.relatedToESD : '',
              Sent_NG_To_Analysis: index === 0 ? data.sendNgAnalysis : '',
              Production_Phase: index === 0 ? data.productionPhase : '',
              Defect_Category: index === 0 ? data.defectCatagory : '',
              Abnormal_Lot_Level: index === 0 ? data.abnormalLotLevel : '',
              Occur_Place: index === 0 ? data.occurBName : '',
              Issuer: index === 0 ? data.issuer : '',
              Request_From_Department: index === 0 ? data.requestFormSectionName : '',
              Source_Of_Defect: index === 0 ? data.sourceOfDefect : '',
              CauseOfDefect: index === 0 ? data.causeOfDefect : '',
              Analysis_Result: `${item.item}`, // แต่ละ row มี item ของตัวเอง
              FM_Qty: item.qty, // แต่ละ row มี qty ของตัวเอง
              Can_Analysis: index === 0 ? data.canAnalysis : '',
              Analysis_Level: index === 0 ? data.analysisLevel : '',
              Category_Cause: index === 0 ? data.defectCatagory : '',
              JudgementDefect: index === 0 ? data.JudgementDefect : '',
              Claim_No: index === 0 ? data.claimNo : '',
              TBN: index === 0 ? (data.TBN && data.TBN != 'normal' ? data.TBNNumber : 'Normal') : '',
              Issue_Date: index === 0 ? data.issuedDate : '',
              Reply_Date: index === 0 ? data.replyDate : '',
              Start_Analysis_Date: index === 0 ? data.startAnalyzeDate : '',
              Finish_Analysis_Date: index === 0 ? data.finishAnalyzeDate : '',
              Finish_Analysis_Report_Date: index === 0 ? data.finishReportDate : '',
              Total_Analysis_Date: index === 0 ? data.diffReport : '',
              On_Time_Result: index === 0 ? data.onTimeResult : '',
              On_Time_Report: index === 0 ? data.onTimeReport : '',
              Technical_PIC: index === 0 ? data.userApprove2Name : '',
              Engineer_PIC: index === 0 ? data.userApprove3Name : '',
              Responsible_Person: index === 0 ? data.userApproveName : '',
              Operator_Name: index === 0 ? data.operatorName : '',
              Difficulty_Of_Work: index === 0 ? data.difficultyOfWork : '',
              Correct_Of_Work: index === 0 ? data.correctOfWork : '',
              Analysis_Time: index === 0 ? data.analysisTime : '',
              Status: index === 0 ? data.statusShow : '',
              _isFirstRow: index === 0,
              _totalRows: data.result2.length,
              _currentRow: index
            };
            temp.push(newData);
          });
        } else {
          // สำหรับข้อมูลปกติ - สร้าง 1 row
          const newData = {
            Register_No: data.requestNumber,
            KTC_Model_Number: data.ktcModelNumber,
            Treatment: data.treatment,
            Size: data.size,
            Customer: data.customer,
            Defect_Name: data.defectiveName,
            Lot_Number: data.pcLotNumber,
            Input_Quantity: data.inputQuantity,
            NG_Quantity: data.ngQuantity,
            NG_Ratio: data.ngRatio ? (Number(data.ngRatio).toFixed(2) + '%') : '',
            RelatedToESD: data.relatedToESD,
            Sent_NG_To_Analysis: data.sendNgAnalysis,
            Production_Phase: data.productionPhase,
            Defect_Category: data.defectCatagory,
            Abnormal_Lot_Level: data.abnormalLotLevel,
            Occur_Place: data.occurBName,
            Issuer: data.issuer,
            Request_From_Department: data.requestFormSectionName,
            Source_Of_Defect: data.sourceOfDefect,
            CauseOfDefect: data.causeOfDefect,
            Analysis_Result: data.result,
            FM_Qty: '',
            Can_Analysis: data.canAnalysis,
            Analysis_Level: data.analysisLevel,
            Category_Cause: data.defectCatagory,
            JudgementDefect: data.JudgementDefect,
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
            Operator_Name: data.operatorName,
            Difficulty_Of_Work: data.difficultyOfWork,
            Correct_Of_Work: data.correctOfWork,
            Analysis_Time: data.analysisTime,
            Status: data.statusShow,
            _isFirstRow: true,
            _totalRows: 1,
            _currentRow: 0
          };
          temp.push(newData);
        }
      });

      resolve(temp);
    });
  }

  onLoadingExcel(datas: any) {
    return new Promise(async resolve => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet1');

      const headerOrder = [
        'Register_No', 'Status', 'Treatment', 'KTC_Model_Number', 'Size', 'Customer',
        'Defect_Name', 'Lot_Number', 'Input_Quantity', 'NG_Quantity', 'NG_Ratio',
        'RelatedToESD', 'Sent_NG_To_Analysis', 'Production_Phase', 'Defect_Category',
        'Abnormal_Lot_Level', 'Occur_Place', 'Issuer', 'Request_From_Department',
        'Source_Of_Defect', 'CauseOfDefect', 'Analysis_Result', 'FM_Qty',
        'Can_Analysis', 'Analysis_Level', 'Category_Cause', 'JudgementDefect',
        'Claim_No', 'TBN', 'Issue_Date', 'Reply_Date', 'Start_Analysis_Date',
        'Finish_Analysis_Date', 'Finish_Analysis_Report_Date', 'Total_Analysis_Date',
        'On_Time_Result', 'On_Time_Report', 'Technical_PIC', 'Engineer_PIC', 'Responsible_Person',
        'Operator_Name', 'Difficulty_Of_Work', 'Correct_Of_Work', 'Analysis_Time'
      ];

      // เพิ่ม header row
      worksheet.addRow(headerOrder);

      // เพิ่มข้อมูลทั้งหมดก่อน
      datas.forEach((data: any) => {
        const rowData = headerOrder.map(header => data[header] || '');
        worksheet.addRow(rowData);
      });

      // หา groups ที่ต้อง merge
      const mergeGroups: any[] = [];
      let currentRowIndex = 0;

      while (currentRowIndex < datas.length) {
        const data = datas[currentRowIndex];

        if (data._isFirstRow && data._totalRows > 1) {
          // นี่คือกลุ่มที่ต้อง merge
          mergeGroups.push({
            startRow: currentRowIndex + 2, // +2 เพราะ Excel เริ่มจาก 1 และมี header
            endRow: currentRowIndex + 2 + data._totalRows - 1,
            totalRows: data._totalRows
          });
          currentRowIndex += data._totalRows;
        } else {
          currentRowIndex++;
        }
      }

      // ทำการ merge แต่ละกลุ่ม
      mergeGroups.forEach(group => {
        headerOrder.forEach((header, colIndex) => {
          if (header !== 'Analysis_Result' && header !== 'FM_Qty') {
            try {
              worksheet.mergeCells(group.startRow, colIndex + 1, group.endRow, colIndex + 1);
              console.log(`Merged column ${header} from row ${group.startRow} to ${group.endRow}`);
            } catch (error) {
              console.log(`Error merging cells for column ${header} (rows ${group.startRow}-${group.endRow}):`, error);
            }
          }
        });
      });

      // ตั้งค่า column width
      const analysisResultColIndex = headerOrder.indexOf('Analysis_Result') + 1;
      const fmQtyColIndex = headerOrder.indexOf('FM_Qty') + 1;

      headerOrder.forEach((header, index) => {
        const column = worksheet.getColumn(index + 1);
        if (header === 'Analysis_Result') {
          column.width = 50;
        } else if (header === 'FM_Qty') {
          column.width = 20;
        } else {
          column.width = 20;
        }
      });

      // ตั้งค่า cell formatting
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          // Analysis_Result cell
          if (analysisResultColIndex > 0) {
            const cell = row.getCell(analysisResultColIndex);
            cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
            // เพิ่มเส้นใต้ที่ cell แทนที่จะเป็น text
            cell.border = {
              ...cell.border,
              bottom: { style: 'thin', color: { argb: '000000' } }
            };
          }
          // FM_Qty cell
          if (fmQtyColIndex > 0) {
            const cell = row.getCell(fmQtyColIndex);
            cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'right' };
            // เพิ่มเส้นใต้ที่ cell แทนที่จะเป็น text
            cell.border = {
              ...cell.border,
              bottom: { style: 'thin', color: { argb: '000000' } }
            };
          }
          // ตั้งค่า vertical alignment สำหรับ merged cells
          row.eachCell((cell) => {
            if (!cell.alignment) cell.alignment = {};
            cell.alignment.vertical = 'middle';
          });
        }
      });

      // สร้างไฟล์ Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const ModalName = await this.setModelName();
      let fileName = '';
      const dateStart = this.DateStart.valid ? this.DateStart.value : "Previous";
      const dateEnd = this.DateEnd.valid ? this.DateEnd.value : "Now";

      if (this.Month.valid) {
        fileName = `${ModalName}_${this.Month.value}.xlsx`;
      } else {
        fileName = `${ModalName}_${dateStart}_${dateEnd}.xlsx`;
      }

      FileSaver.saveAs(data, fileName);
      resolve(workbook);
    });
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
        this.ReplyStart.reset()
        this.ReplyEnd.reset()

        sessionStorage.setItem('Analysis-Model', '')
        sessionStorage.setItem('Analysis-Month', '')
        sessionStorage.setItem('Analysis-DateStart', '')
        sessionStorage.setItem('Analysis-DateEnd', '')
        sessionStorage.setItem('Analysis-ReplyStart', '')
        sessionStorage.setItem('Analysis-ReplyEnd', '')
        this.rowData = []
      }
    })
  }
  setSessionConditionFilter() {
    sessionStorage.setItem('Analysis-Model', '')
    sessionStorage.setItem('Analysis-Month', '')
    sessionStorage.setItem('Analysis-DateStart', '')
    sessionStorage.setItem('Analysis-DateEnd', '')
    sessionStorage.setItem('Analysis-ReplyStart', '')
    sessionStorage.setItem('Analysis-ReplyEnd', '')

    this.ModelSelect.valid ? sessionStorage.setItem('Analysis-Model', this.ModelSelect.value) : false
    this.Month.valid ? sessionStorage.setItem('Analysis-Month', this.Month.value) : false
    this.DateStart.valid ? sessionStorage.setItem('Analysis-DateStart', this.DateStart.value) : false
    this.DateEnd.valid ? sessionStorage.setItem('Analysis-DateEnd', this.DateEnd.value) : false
    this.ReplyStart.valid ? sessionStorage.setItem('Analysis-ReplyStart', this.ReplyStart.value) : false
    this.ReplyEnd.valid ? sessionStorage.setItem('Analysis-ReplyEnd', this.ReplyEnd.value) : false

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

  async getHoliday() {
    return await this.api.getWorkingDay({}).toPromise()
  }

  findRemainDay(workingDayCount: any, startDate: any) {
    if (!startDate) return null
    // Calculate working days
    const start = moment(startDate).startOf('day').add(1, 'day') // เริ่มนับจากวันถัดไป
    const workingDays = parseInt(workingDayCount) || 0;
    let currentDate = start.clone();
    let workingDaysFound = 0;
    while (workingDaysFound < workingDays) {
      const dayOfWeek = currentDate.day(); // Sunday=0, Monday=1, ..., Saturday=6
      const dateStr = currentDate.format('YYYY-MM-DD');
      const isHoliday = this.holidays?.holidays ? this.holidays.holidays.some((a: any) => a == dateStr) : false;
      if (dayOfWeek >= 1 && dayOfWeek <= 5 && !isHoliday) {
        workingDaysFound++;
        if (workingDaysFound === workingDays) {
          break;
        }
      }
      currentDate.add(1, 'day');
    }
    // return currentDate
    return currentDate.diff(moment().startOf('day'), 'days') + 1
  }

  findStartBetweenEndWorkingDay(startDate: any, endDate: any, ignoreStart = false) {
    if (!startDate || !endDate) return null
    const start = moment(startDate).startOf('day')
    if (ignoreStart) {
      start.add(1, 'day')
    }
    const end = moment(endDate).startOf('day')
    let currentDate = start.clone();
    let workingDaysCount = 0;
    while (currentDate.isSameOrBefore(end)) {
      const dayOfWeek = currentDate.day();
      const dateStr = currentDate.format('YYYY-MM-DD');
      const isHoliday = this.holidays?.holidays ? this.holidays.holidays.some((a: any) => a == dateStr) : false;
      if (dayOfWeek >= 1 && dayOfWeek <= 5 && !isHoliday) {
        workingDaysCount++;
      }
      currentDate.add(1, 'day');
    }
    return workingDaysCount
  }

  findDueDate(startDate: any, workingDayCount: any, ignoreEnd = false) {
    if (!startDate) return null
    const start = moment(startDate).startOf('day').add(1, 'day') // เริ่มนับจากวันถัดไป
    const workingDays = parseInt(workingDayCount) || 0;
    let currentDate = start.clone();
    let workingDaysFound = 0;
    while (workingDaysFound < workingDays) {
      const dayOfWeek = currentDate.day(); // Sunday=0, Monday=1, ..., Saturday=6
      const dateStr = currentDate.format('YYYY-MM-DD');
      const isHoliday = this.holidays?.holidays ? this.holidays.holidays.some((a: any) => a == dateStr) : false;
      if (dayOfWeek >= 1 && dayOfWeek <= 5 && !isHoliday) {
        workingDaysFound++;
        if (workingDaysFound === workingDays) {
          break;
        }
      }
      currentDate.add(1, 'day');
    }
    if (ignoreEnd) {
      currentDate.subtract(1, 'day');
    }
    return currentDate;
  }

}
