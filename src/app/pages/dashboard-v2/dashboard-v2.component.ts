import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'app/service/http.service';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './dashboard-v2.component.html',
  styleUrls: ['./dashboard-v2.component.css']
})


export class DashboardV2Component implements OnInit {

  // @HostListener('scroll', ['$event']) // for scroll events of the current element
  @HostListener('window:scroll', ['$event']) // for window scroll events
  scrollFunction() {
    var mybutton = document.getElementById("myBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  }

  // ? loading page
  LoadingPage: boolean = false

  // ? filter
  SELECTED_MONTH: any
  SELECTED_DATE_START: any
  SELECTED_DATE_END: any
  MIN_DATE_START: any

  // ? Chart
  ChartOnTime: any
  ChartCorrectAnalysis: any

  ChartRequestSheet: Chart
  ChartFailureRank: Chart
  ChartDefectPNL: Chart
  ChartDefectMDL: Chart
  ChartDefectDST_FM: Chart
  ChartDefectAMT_FM: Chart
  ChartDefectAMT: Chart
  ChartDefectSMT: Chart

  ChartCausePNL: Chart
  ChartCauseMDL: Chart
  ChartCauseDST_FM: Chart
  ChartCauseAMT_FM: Chart
  ChartCauseAMT: Chart
  ChartCauseSMT: Chart

  ChartEngineer: Chart

  formQuery: any

  ColorStackChart = ['#B4FF9F', '#E4AEC5', '#FFD59E', '#FFA1A1', '#82A284', '#82A284', '#E4AEC5', '#FFC4DD', '#8479E1', '#8479E1', '#B4ECE3', '#FFF8D5', '#C4DDFF', '#7FB5FF', '#FEE2C5']
  constructor(
    private api: HttpService,
    private route: Router
  ) { }

  async ngOnInit(): Promise<void> {
    await this.CheckStatusUser();
    this.LoadingPage = true
    this.onStartPage()
  }

  CheckStatusUser() {
    return new Promise((resolve) => {

      let LevelList = [];
      sessionStorage.getItem('UserLevel1') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel1')) : false
      sessionStorage.getItem('UserLevel2') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel2')) : false
      sessionStorage.getItem('UserLevel3') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel3')) : false
      sessionStorage.getItem('UserLevel4') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel4')) : false
      sessionStorage.getItem('UserLevel5') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel5')) : false
      sessionStorage.getItem('UserLevel6') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel6')) : false

      const guest = sessionStorage.getItem('UserEmployeeCode')
      if (guest == 'guest') {
        setTimeout(() => {
          this.route.navigate(['/dashboard-guest'])
        }, 2000);
      }

      if (LevelList.find(i => i == '3') ||
        LevelList.find(i => i == '4') ||
        LevelList.find(i => i == '5') ||
        LevelList.find(i => i == '6') ||
        LevelList.find(i => i == '0') ||
        guest == "guest") {
      } else {
        // alert("No access!!");
        this.route.navigate(['/manageForm'])
        // location.href = "#/manageForm"
      }
      resolve(true)
    })


  }

  onStartPage() {
    try {
      const date = new Date()
      const year = date.getFullYear()
      const data = {
        year: year
      }
      this.callChart(data)

    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.LoadingPage = false
      }, 2000);
    }
  }

  onClickYear() {
    try {
      this.SELECTED_DATE_START = ''
      this.SELECTED_DATE_END = ''
      this.SELECTED_MONTH = ''
      const date = new Date()
      const year = date.getFullYear()
      const data = {
        year: year
      }
      this.destroyChart()
      this.callChart(data)

    } catch (error) {
      console.log(error);
    }
  }

  onChangeMonth() {

    try {
      // todo clear other filter
      // console.log(this.SELECTED_MONTH);

      this.SELECTED_DATE_START = ''
      this.SELECTED_DATE_END = ''
      const data = {
        month: this.SELECTED_MONTH
      }
      this.destroyChart()
      this.callChart(data)


    } catch (error) {
      console.log(error);
    }
  }

  onChangeDateRange() {
    try {
      this.SELECTED_MONTH = ''
      if (this.SELECTED_DATE_START) {
        const y = new Date(this.SELECTED_DATE_START).getFullYear()
        let m: any = new Date(this.SELECTED_DATE_START).getMonth().toString()
        m.length == 1 ? m = '0' + m : m
        const d = new Date(this.SELECTED_DATE_START).getDate()
        const minDate = `${y}-${m}-${d}`
        console.log(minDate);

        this.MIN_DATE_START = minDate
      }
      const data = {
        dateStart: this.SELECTED_DATE_START,
        dateEnd: this.SELECTED_DATE_END
      }
      this.destroyChart()
      this.callChart(data)
    } catch (error) {

    }
  }

  private destroyChart() {
    this.ChartRequestSheet.destroy()
    this.ChartFailureRank.destroy()
    this.ChartDefectPNL.destroy()
    this.ChartDefectMDL.destroy()
    this.ChartDefectDST_FM.destroy()
    this.ChartDefectAMT_FM.destroy()
    this.ChartDefectAMT.destroy()
    this.ChartDefectSMT.destroy()

    this.ChartCausePNL.destroy()
    this.ChartCauseMDL.destroy()
    this.ChartCauseDST_FM.destroy()
    this.ChartCauseAMT_FM.destroy()
    this.ChartCauseAMT.destroy()
    this.ChartCauseSMT.destroy()

    this.ChartEngineer.destroy()
  }

  private async callChart(data: any) {
    this.formQuery = data
    const ExtendModel: any = await this.setExtendModel()

    this.setChartRequestSheet(ExtendModel)
    this.setChartFailureRank(ExtendModel)
    this.setCurrentAnalysis(ExtendModel)
    this.callChartDefectModelCode(ExtendModel)
    this.callChartCauseModelCode(ExtendModel)

    const tempChartENG: any = await this.setChartEngineer(ExtendModel, 'ChartEngineer')
    this.ChartEngineer = tempChartENG
  }

  private setExtendModel() {
    return new Promise(async resolve => {
      const requests: any = await this.getForm(this.formQuery)
      const filteredRequests: any = await this.filterRequest(requests)
      const requestsArray: any = {
        IDs: filteredRequests.map((r: any) => r._id)
      }
      const results: any = await this.getResultByArray(requestsArray)
      const merge: any = await this.MERGE(filteredRequests, results)
      // console.log('merge', merge);

      const resultAddDiffDay: any = await this.SetDiffDay(merge)
      // console.log('resultAddDiffDay', resultAddDiffDay);

      const ExtendModel: any = await this.ExtendModel(resultAddDiffDay)
      // console.log('ExtendModel', ExtendModel);
      this.SetResultOnTime(resultAddDiffDay)

      resolve(ExtendModel)
    })
  }



  // ? API
  getForm(data: any) {
    return new Promise((resolve) => {

      // const data = {
      //   year: this.Year || null,
      //   month: this.Month || null,
      //   dateStart: this.DateStart || null,
      //   dateEnd: this.DateEnd || null
      // }
      // console.log(data);

      this.api.GetForm(data).subscribe((data: any) => {
        const temp = data.filter(i => i.status != 0)
        resolve(temp)
      })
    })
  }

  private filterRequest(requests: any) {
    return new Promise((resolve) => {
      const newRequest: any[] = requests.filter((r: any) => r.status != 0 && r.status != 1 && r.status != 2.1)
      resolve(newRequest)
    })
  }

  getResultByArray(IDs: any) {
    return new Promise((resolve) => {
      this.api.GetResultByIDs(IDs).subscribe((data: any) => {
        resolve(data)
      })
    })
  }
  getResult() {
    return new Promise((resolve) => {
      this.api.GetResultAll().subscribe((data: any) => {
        resolve(data)
      })
    })
  }

  MERGE(requests: any, results: any) {
    return new Promise((resolve) => {
      const Last_Result = requests.map((request: any) => {
        const resultFind: any = results.find((result: any) => result.formId == request._id)
        return { ...resultFind, ...request }
      })
      resolve(Last_Result)
    })
  }



  SetDiffDay(merge: any) {

    return new Promise(async (resolve) => {

      const resultAddDiffDay: any = merge.map((m: any) => {

        let reply = new Date(m.replyDate).getTime();
        let finishAnalysis: any
        if (m.finishAnalyzeDate) {
          finishAnalysis = new Date(m.finishAnalyzeDate).getTime();
        } else {
          finishAnalysis = new Date().getTime()
        }
        let difference = Number(reply) - Number(finishAnalysis)

        var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
        m['diffDay'] = daysDifference
        return m
      })
      resolve(resultAddDiffDay)

    })
  }

  SetResultOnTime(merge: any) {
    // return new Promise((resolve) => {
    let ResultOnTimeData: any = {}

    ResultOnTimeData['ALL'] = this.CalOnTime(merge, 'all')
    ResultOnTimeData['PNL'] = this.CalOnTime(merge, 'PNL')
    ResultOnTimeData['MDL'] = this.CalOnTime(merge, 'MDL')
    ResultOnTimeData['DST_FM'] = this.CalOnTime(merge, 'DST_FM')
    ResultOnTimeData['AMT_FM'] = this.CalOnTime(merge, 'AMT_FM')
    ResultOnTimeData['AMT'] = this.CalOnTime(merge, 'AMT')
    ResultOnTimeData['SMT'] = this.CalOnTime(merge, 'SMT')
    // console.log('ResultOnTimeData', ResultOnTimeData);
    this.ChartOnTime = ResultOnTimeData
    // resolve(ResultOnTimeData)
    // })
  }

  CalOnTime(merge: any, requestItem: any) {
    if (requestItem == 'all') {
      const tempData = merge.filter(i => i.diffDay != null)
      const total = tempData.length;
      const requestOntime = tempData.filter(request => request.diffDay >= 0);
      const countOntime = requestOntime.length;
      const PercentAll = (countOntime / total) * 100;
      // this.PercentAll = Math.round(this.PercentAll) || null
      const result = {
        percent: Math.round(PercentAll) ? Math.round(PercentAll) + '%' : null || null,
        timeUpdate: new Date().toLocaleDateString()
      }
      return result

    } else {
      const tempData = merge.filter(i => i.diffDay != null)
      const newRequest1 = tempData.filter(request => request.requestItem == requestItem);
      const oldCount = newRequest1.length;
      const newRequest2 = newRequest1.filter(request => request.diffDay >= 0);
      const newCount = newRequest2.length;
      const tempResult = (newCount / oldCount) * 100;
      // const result = Math.round(tempResult) || null
      const result = {
        percent: Math.round(tempResult) ? Math.round(tempResult) + '%' : null || null,
        timeUpdate: new Date().toLocaleDateString()
      }
      return result
    }

  }

  toggleOnTime(requestItem: any) {
    if (requestItem) {
      if (this.ChartOnTime[requestItem].percent) {
        return true
      }
    }
    return false
  }

  private setCurrentAnalysis(ExtendModel: any) {
    const arrExtendModel: any[] = [
      ExtendModel.PNL,
      ExtendModel.MDL,
      ExtendModel.DST_FM,
      ExtendModel.AMT_FM,
      ExtendModel.AMT,
      ExtendModel.SMT
    ]
    const countAnalysis: number = arrExtendModel.reduce((prev: any, now: any) => {
      return prev + now.length
    }, 0)
    const percentRejectPNL: any = this.countRejectItem(ExtendModel.PNL).length / countAnalysis * 100
    const percentRejectMDL: any = this.countRejectItem(ExtendModel.MDL).length / countAnalysis * 100
    const percentRejectDST_FM: any = this.countRejectItem(ExtendModel.DST_FM).length / countAnalysis * 100
    const percentRejectAMT_FM: any = this.countRejectItem(ExtendModel.AMT_FM).length / countAnalysis * 100
    const percentRejectAMT: any = this.countRejectItem(ExtendModel.AMT).length / countAnalysis * 100
    const percentRejectSMT: any = this.countRejectItem(ExtendModel.SMT).length / countAnalysis * 100

    // console.log(Math.round(percentRejectAMT_FM));
    let percentCorrectALL: any = 'No result'
    let percentCorrectPNL: any = 'No result'
    let percentCorrectMDL: any = 'No result'
    let percentCorrectDST_FM: any = 'No result'
    let percentCorrectAMT_FM: any = 'No result'
    let percentCorrectAMT: any = 'No result'
    let percentCorrectSMT: any = 'No result'
    if (this.findResult(ExtendModel.PNL) != 0) percentCorrectPNL = Number(percentRejectPNL) == 0 ? '100%' : (100 - Number(percentRejectPNL)).toFixed(2) + '%'
    if (this.findResult(ExtendModel.MDL) != 0) percentCorrectMDL = Number(percentRejectMDL) == 0 ? '100%' : (100 - Number(percentRejectMDL)).toFixed(2) + '%'
    if (this.findResult(ExtendModel.DST_FM) != 0) percentCorrectDST_FM = Number(percentRejectDST_FM) == 0 ? '100%' : (100 - Number(percentRejectDST_FM)).toFixed(2) + '%'
    if (this.findResult(ExtendModel.AMT_FM) != 0) percentCorrectAMT_FM = Number(percentRejectAMT_FM) == 0 ? '100%' : (100 - Number(percentRejectAMT_FM)).toFixed(2) + '%'
    if (this.findResult(ExtendModel.AMT) != 0) percentCorrectAMT = Number(percentRejectAMT) == 0 ? '100%' : (100 - Number(percentRejectAMT)).toFixed(2) + '%'
    if (this.findResult(ExtendModel.SMT) != 0) percentCorrectSMT = Number(percentRejectSMT) == 0 ? '100%' : (100 - Number(percentRejectSMT)).toFixed(2) + '%'

    percentCorrectALL = (percentCorrectPNL + percentCorrectMDL + percentCorrectDST_FM + percentCorrectAMT_FM + percentCorrectAMT + percentCorrectSMT) / 6

    this.ChartCorrectAnalysis = {
      ALL: { percent: percentCorrectALL },
      PNL: { percent: percentCorrectPNL },
      MDL: { percent: percentCorrectMDL },
      DST_FM: { percent: percentCorrectDST_FM },
      AMT_FM: { percent: percentCorrectAMT_FM },
      AMT: { percent: percentCorrectAMT },
      SMT: { percent: percentCorrectSMT },
    }
    console.log('ChartCorrectAnalysis', this.ChartCorrectAnalysis);


  }

  private findResult(items: any) {
    return items.filter(i => i.result).length
  }
  private countRejectItem(item: any) {
    const countReject: any = item.filter(i => i.noteReject5 != undefined)
    // console.log(countReject);
    return countReject
  }



  // ? แยก model
  ExtendModel(merge: any) {
    return new Promise((resolve) => {
      const resultExtendModel: any = {
        PNL: merge.filter((m: any) => m.requestItem == "PNL") || [],
        MDL: merge.filter((m: any) => m.requestItem == "MDL") || [],
        AMT_FM: merge.filter((m: any) => m.requestItem == "AMT_FM") || [],
        AMT: merge.filter((m: any) => m.requestItem == "AMT") || [],
        SMT: merge.filter((m: any) => m.requestItem == "SMT") || [],
        DST_FM: merge.filter((m: any) => m.requestItem == "DST_FM") || [],
      }
      resolve(resultExtendModel)

    })
  }

  setChartRequestSheet(rawData: any) {
    return new Promise((resolve) => {
      const labels = ['PNL', 'MDL', 'DST_FM', 'AMT', 'AMT_FM', 'SMT']
      const newRawData = labels.map(label => rawData[label])
      const item1: any = newRawData.map((item: any) => item.length)
      const ctx = document.getElementById('RequestSheetChart') as HTMLCanvasElement
      const data = {
        labels: labels,
        datasets: [
          {
            label: "Request Q'ty",
            data: item1,
            fill: false,
            backgroundColor: ['rgba(255, 99, 132, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 205, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(153, 102, 255, 0.6)',],
            borderWidth: 1,
            borderRadius: 5
          },
        ]
      }
      this.ChartRequestSheet = new Chart(ctx, {
        type: 'bar',
        data: data,
        plugins: [ChartDataLabels],
        options: {
          plugins: {
            legend: {
              display: false
            }
          }
        },

      })
      resolve(true)
    })
  }


  setChartFailureRank(rawData: any) {
    return new Promise((resolve) => {
      // console.log('****************', rawData);
      const rawDataArray: any[] = [rawData.PNL, rawData.MDL, rawData.DST_FM, rawData.AMT_FM, rawData.AMT, rawData.SMT]
      const failureRankData: any = rawDataArray.map((item: any) => {
        const easy: any = item.filter((d: any) => d.analysisLevel == 'Easy')
        const medium: any = item.filter((d: any) => d.analysisLevel == 'Medium')
        const difficult: any = item.filter((d: any) => d.analysisLevel == 'Difficult')
        return {
          easy: easy.length,
          medium: medium.length,
          difficult: difficult.length
        }
      })
      // console.log('failureRankData', failureRankData);
      const failureRankEasy: any = failureRankData.map((f: any) => f.easy)
      const failureRankMedium: any = failureRankData.map((f: any) => f.medium)
      const failureRankDifficult: any = failureRankData.map((f: any) => f.difficult)
      const labels = ['PNL', 'MDL', 'DST_FM', 'AMT_FM', 'AMT', 'SMT']
      const ctx = document.getElementById('FailureRankChart') as HTMLCanvasElement
      const data = {
        labels: labels,
        datasets: [
          {
            label: "Easy",
            data: failureRankEasy,
            backgroundColor: 'rgb(249, 160, 127,0.6)',
            borderColor: 'rgb(0,0,0)',
            hoverBorderWidth: 2,
          },
          {
            label: "Medium",
            data: failureRankMedium,
            backgroundColor: 'rgb(144, 222, 224,0.6)',
            borderColor: 'rgb(0,0,0)',
            hoverBorderWidth: 2
          },
          {
            label: "Difficult",
            data: failureRankDifficult,
            backgroundColor: 'rgb(240, 162, 242,0.6)',
            borderColor: 'rgb(0,0,0)',
            hoverBorderWidth: 2
          },
        ]
      }

      this.ChartFailureRank = new Chart(ctx, {
        type: 'bar',
        data: data,
        plugins: [ChartDataLabels],
        options: {
          scales: {
            x: {
              stacked: true
            },
            y: {
              stacked: true
            }
          }
        },

      })
      resolve(true)
    })
  }



  async setChartDefectModelCode(rawData: any, id: any) {
    const ChartData: any = await this.BuildDataForDefectChart(rawData)
    const ctx = document.getElementById(id) as HTMLCanvasElement
    const data = {
      labels: ChartData.labels,
      datasets: ChartData.data
    }
    const config: any = {
      type: 'bar',
      data: data,
      plugins: [ChartDataLabels],
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          }
        },

      }
    }

    let newChart: Chart = new Chart(ctx, config)


    return newChart
  }
  async setChartDefectProcess(rawData: any, id: any) {
    const ChartData: any = await this.BuildDataForDefectChartProcess(rawData)
    const ctx = document.getElementById(id) as HTMLCanvasElement
    const data = {
      labels: ChartData.labels,
      datasets: ChartData.data
    }
    const config: any = {
      type: 'bar',
      data: data,
      plugins: [ChartDataLabels],
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          }
        },

      }
    }

    let newChart: Chart = new Chart(ctx, config)


    return newChart
  }


  async setChartCauseModelCode(rawData: any, id: any) {
    const ChartData: any = await this.BuildDataForCauseChart(rawData)
    const ctx = document.getElementById(id) as HTMLCanvasElement
    const data = {
      labels: ChartData.labels,
      datasets: ChartData.data
    }
    const config: any = {
      type: 'bar',
      data: data,
      plugins: [ChartDataLabels],
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          }
        },

      }
    }

    let newChart: Chart = new Chart(ctx, config)


    return newChart
  }
  async setChartCauseProcess(rawData: any, id: any) {
    const ChartData: any = await this.BuildDataForCauseChartProcess(rawData)
    const ctx = document.getElementById(id) as HTMLCanvasElement
    const data = {
      labels: ChartData.labels,
      datasets: ChartData.data
    }
    const config: any = {
      type: 'bar',
      data: data,
      plugins: [ChartDataLabels],
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          }
        },

      }
    }

    let newChart: Chart = new Chart(ctx, config)


    return newChart
  }

  async setChartEngineer(rawData: any, id: any) {
    const ChartData: any = await this.BuildDataForEngineerChart(rawData)
    // console.clear()
    // console.log('ChartData', ChartData);

    const ctx = document.getElementById(id) as HTMLCanvasElement
    const data = {
      labels: ChartData.labels,
      datasets: ChartData.data
    }
    const newChart: Chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      plugins: [ChartDataLabels],
      options: {
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
          },
        },


      }
    })
    return newChart
  }

  private BuildDataForDefectChart(DATA: any) {
    return new Promise((resolve) => {
      const counter = {}
      DATA.forEach(function (obj) {
        var key = JSON.stringify(obj.defectiveName)
        counter[key] = (counter[key] || 0) + 1
      })
      let arrayCounter: any[] = []
      for (const [key, value] of Object.entries(counter)) {
        arrayCounter.push({
          defectiveName: key,
          count: value
        })
      }
      const sortMax = arrayCounter.sort((firstItem, secondItem) => secondItem.count - firstItem.count);

      const top5 = sortMax.slice(0, 5)
      // console.log('top5', top5);
      const newTop5 = top5.map((t: any) => {
        const len: number = t.defectiveName.length
        t.defectiveName = t.defectiveName.slice(1, len - 1)
        return t
      })
      // console.log(newTop5);

      const LABELS: any = newTop5.map((t: any) => t.defectiveName)
      // console.log('label', LABELS);

      const findModel: any = newTop5.map((t: any) => {
        const a = DATA.filter((r: any) => r.defectiveName == t.defectiveName)
        return {
          defectiveName: t.defectiveName,
          data: a,
          count: a.length
        }
      })
      // console.log('findModel', findModel);

      const uniqueModelCode: any = findModel.map((a: any) => {
        const data = [...new Map(a.data.map(item =>
          [item['ktcModelNumber'], item])).values()];
        return {
          defectiveName: a.defectiveName,
          data: data,
          count: data.length
        }
      })
      // console.log('uniqueModelCode', uniqueModelCode);

      let uniqueArray: any = uniqueModelCode.reduce((prev: any, now: any) => {
        return prev.concat(now.data)
      }, [])

      // console.log('uniqueArray', uniqueArray);

      let uniqueMapped: any = uniqueArray.map((unique: any) => {
        const data: any = findModel.map((find: any) => {
          return find.data.filter((d: any) => d.ktcModelNumber == unique.ktcModelNumber && d.defectiveName == unique.defectiveName).length
        })
        return {
          label: unique.ktcModelNumber,
          data: data,
          fill: false,
          backgroundColor: this.getRandomColor(),
          borderColor: 'rgb(0,0,0)',
          hoverBorderWidth: 2,
          maxBarThickness: 40,
        }
      })

      const RESULT = {
        labels: LABELS,
        data: uniqueMapped
      }
      // console.log('RESULT', RESULT);

      resolve(RESULT)
    }
    )
  }
  private BuildDataForDefectChartProcess(DATA: any) {
    return new Promise((resolve) => {
      const counter = {}
      DATA.forEach(function (obj) {
        var key = JSON.stringify(obj.defectiveName)
        counter[key] = (counter[key] || 0) + 1
      })
      let arrayCounter: any[] = []
      for (const [key, value] of Object.entries(counter)) {
        arrayCounter.push({
          defectiveName: key,
          count: value
        })
      }
      const sortMax = arrayCounter.sort((firstItem, secondItem) => secondItem.count - firstItem.count);

      const top5 = sortMax.slice(0, 5)
      // console.log('top5', top5);
      const newTop5 = top5.map((t: any) => {
        const len: number = t.defectiveName.length
        t.defectiveName = t.defectiveName.slice(1, len - 1)
        return t
      })
      // console.log(newTop5);

      const LABELS: any = newTop5.map((t: any) => t.defectiveName)
      // console.log('label', LABELS);

      const findModel: any = newTop5.map((t: any) => {
        const a = DATA.filter((r: any) => r.defectiveName == t.defectiveName)
        return {
          defectiveName: t.defectiveName,
          data: a,
          count: a.length
        }
      })
      // console.log('findModel', findModel);

      const uniqueModelCode: any = findModel.map((a: any) => {
        const data = [...new Map(a.data.map(item =>
          [item['occurBName'], item])).values()];
        return {
          defectiveName: a.defectiveName,
          data: data,
          count: data.length
        }
      })
      // console.log('uniqueModelCode', uniqueModelCode);

      let uniqueArray: any = uniqueModelCode.reduce((prev: any, now: any) => {
        return prev.concat(now.data)
      }, [])

      // console.log('uniqueArray', uniqueArray);

      let uniqueMapped: any = uniqueArray.map((unique: any) => {
        const data: any = findModel.map((find: any) => {
          return find.data.filter((d: any) => d.occurBName == unique.occurBName && d.defectiveName == unique.defectiveName).length
        })
        return {
          label: unique.occurBName,
          data: data,
          fill: false,
          backgroundColor: this.getRandomColor(),
          borderColor: 'rgb(0,0,0)',
          hoverBorderWidth: 2,
          maxBarThickness: 40,
        }
      })

      const RESULT = {
        labels: LABELS,
        data: uniqueMapped
      }
      // console.log('RESULT', RESULT);

      resolve(RESULT)
    }
    )
  }
  private BuildDataForCauseChartProcess(DATA: any) {
    return new Promise((resolve) => {

      // console.log('DATA', DATA);
      const newData: any = DATA.filter((d: any) => d.causeOfDefect != undefined)
      // console.log('newData', newData);

      const counter = {}
      newData.forEach(function (obj) {
        var key = JSON.stringify(obj.causeOfDefect)
        counter[key] = (counter[key] || 0) + 1
      })
      let arrayCounter: any[] = []
      for (const [key, value] of Object.entries(counter)) {
        arrayCounter.push({
          causeOfDefect: key,
          count: value
        })
      }


      const sortMax = arrayCounter.sort((firstItem, secondItem) => secondItem.count - firstItem.count);

      const top5 = sortMax.slice(0, 5)
      // console.log('top5', top5);
      const newTop5 = top5.map((t: any) => {
        const len: number = t.causeOfDefect.length
        t.causeOfDefect = t.causeOfDefect.slice(1, len - 1)
        return t
      })
      // console.log(newTop5);

      const LABELS: any = newTop5.map((t: any) => t.causeOfDefect)
      // console.log('label', LABELS);

      const findModel: any = newTop5.map((t: any) => {
        const a = newData.filter((r: any) => r.causeOfDefect == t.causeOfDefect)
        return {
          causeOfDefect: t.causeOfDefect,
          data: a,
          count: a.length
        }
      })
      // console.log('findModel', findModel);

      const uniqueModelCode: any = findModel.map((a: any) => {
        const data = [...new Map(a.data.map(item =>
          [item['occurBName'], item])).values()];
        return {
          causeOfDefect: a.causeOfDefect,
          data: data,
          count: data.length
        }
      })
      // console.log('uniqueModelCode', uniqueModelCode);

      let uniqueArray: any = uniqueModelCode.reduce((prev: any, now: any) => {
        return prev.concat(now.data)
      }, [])

      // console.log('uniqueArray', uniqueArray);

      let uniqueMapped: any = uniqueArray.map((unique: any) => {
        const data: any = findModel.map((find: any) => {
          return find.data.filter((d: any) => d.occurBName == unique.occurBName && d.causeOfDefect == unique.causeOfDefect).length
        })
        return {
          label: unique.occurBName,
          data: data,
          fill: false,
          backgroundColor: this.ColorStackChart[Math.floor(Math.random() * this.ColorStackChart.length)],
          borderColor: 'rgb(0,0,0)',
          hoverBorderWidth: 2,
          maxBarThickness: 40,
        }
      })

      const RESULT = {
        labels: LABELS,
        data: uniqueMapped
      }
      // console.log('RESULT', RESULT);

      resolve(RESULT)
    }
    )
  }
  private BuildDataForCauseChart(DATA: any) {
    return new Promise((resolve) => {

      // console.log('DATA', DATA);
      const newData: any = DATA.filter((d: any) => d.causeOfDefect != undefined)
      // console.log('newData', newData);

      const counter = {}
      newData.forEach(function (obj) {
        var key = JSON.stringify(obj.causeOfDefect)
        counter[key] = (counter[key] || 0) + 1
      })
      let arrayCounter: any[] = []
      for (const [key, value] of Object.entries(counter)) {
        arrayCounter.push({
          causeOfDefect: key,
          count: value
        })
      }


      const sortMax = arrayCounter.sort((firstItem, secondItem) => secondItem.count - firstItem.count);

      const top5 = sortMax.slice(0, 5)
      // console.log('top5', top5);
      const newTop5 = top5.map((t: any) => {
        const len: number = t.causeOfDefect.length
        t.causeOfDefect = t.causeOfDefect.slice(1, len - 1)
        return t
      })
      // console.log(newTop5);

      const LABELS: any = newTop5.map((t: any) => t.causeOfDefect)
      // console.log('label', LABELS);

      const findModel: any = newTop5.map((t: any) => {
        const a = newData.filter((r: any) => r.causeOfDefect == t.causeOfDefect)
        return {
          causeOfDefect: t.causeOfDefect,
          data: a,
          count: a.length
        }
      })
      // console.log('findModel', findModel);

      const uniqueModelCode: any = findModel.map((a: any) => {
        const data = [...new Map(a.data.map(item =>
          [item['ktcModelNumber'], item])).values()];
        return {
          causeOfDefect: a.causeOfDefect,
          data: data,
          count: data.length
        }
      })
      // console.log('uniqueModelCode', uniqueModelCode);

      let uniqueArray: any = uniqueModelCode.reduce((prev: any, now: any) => {
        return prev.concat(now.data)
      }, [])

      // console.log('uniqueArray', uniqueArray);

      let uniqueMapped: any = uniqueArray.map((unique: any) => {
        const data: any = findModel.map((find: any) => {
          return find.data.filter((d: any) => d.ktcModelNumber == unique.ktcModelNumber && d.causeOfDefect == unique.causeOfDefect).length
        })
        return {
          label: unique.ktcModelNumber,
          data: data,
          fill: false,
          backgroundColor: this.ColorStackChart[Math.floor(Math.random() * this.ColorStackChart.length)],
          borderColor: 'rgb(0,0,0)',
          hoverBorderWidth: 2,
          maxBarThickness: 40,
        }
      })

      const RESULT = {
        labels: LABELS,
        data: uniqueMapped
      }
      // console.log('RESULT', RESULT);

      resolve(RESULT)
    }
    )
  }

  private BuildDataForEngineerChart(DATA: any) {

    return new Promise(async resolve => {

      // console.clear()
      // console.log('DATA', DATA);
      let tempData: any = [
        DATA.PNL,
        DATA.MDL,
        DATA.DST_FM,
        DATA.AMT_FM,
        DATA.AMT,
        DATA.SMT,
      ]
      const newDATA: any = tempData.reduce((prev: any, now: any) => {
        return prev.concat(now)
      }, [])
      // console.log('newDATA', newDATA);
      let Eng: any = {
        receive: [],
        remain: [],
        underReview: [],
        underApprove: [],
        finish: [],
        engineerName: []
      }


      const engineers: any = await this.getEngineer()
      // console.log(engineers);
      engineers.map(async engineer => {
        // console.log("name", engineer.FirstName);
        const requests = newDATA.filter((request: any) => request.userApprove3 == engineer._id)


        // console.log(requests);
        if (requests.length > 0) {
          const requestCounted: any = await this.countRequestEngineer(requests, engineer)
          // console.log(requestCounted);
          if (requestCounted.receive != 0) {
            Eng.receive.push(requestCounted.receive)
            Eng.remain.push(requestCounted.remain)
            Eng.underReview.push(requestCounted.underReview)
            Eng.underApprove.push(requestCounted.underApprove)
            Eng.finish.push(requestCounted.finish)
            Eng.engineerName.push(requestCounted.engineerName)
          }
        }
      })
      // console.log('Eng', Eng);
      const label: any = Eng.engineerName
      const finish: any = {
        label: 'Finish',
        data: Eng.finish,
        backgroundColor: '#8cff8c',
        borderColor: 'rgb(0,0,0)',
        hoverBorderWidth: 2,
        maxBarThickness: 90,
      }
      const underApprove: any = {
        label: 'Under Approve',
        data: Eng.underApprove,
        backgroundColor: '#ffff8c',
        borderColor: 'rgb(0,0,0)',
        hoverBorderWidth: 2,
        maxBarThickness: 90,
      }
      const underReview: any = {
        label: 'Under Review',
        data: Eng.underReview,
        backgroundColor: '#ffc88c',
        borderColor: 'rgb(0,0,0)',
        hoverBorderWidth: 2,
        maxBarThickness: 90,
      }
      const remain: any = {
        label: 'Remain',
        data: Eng.remain,
        backgroundColor: '#ff8c8c',
        borderColor: 'rgb(0,0,0)',
        hoverBorderWidth: 2,
        maxBarThickness: 90,
      }

      const newENG = {
        labels: label,
        data: [finish, underApprove, underReview, remain]
      }
      // this.EngineerUpdateTime = this.SetUpdateTime(DATA)
      resolve(newENG)

    })
  }

  countRequestEngineer(requests, engineer) {
    let count = {
      receive: 0,
      remain: 0,
      underReview: 0,
      underApprove: 0,
      finish: 0,
      engineerName: ""
    }
    return new Promise(resolve => {
      // console.log("requests", requests);
      count.receive = requests.length

      const remain = requests.filter(request => request.userApprove == engineer._id)
      // console.log("remain", remain);
      count.remain = remain.length

      const underReview = requests.filter(request => request.status == 4)
      // console.log("underReview", underReview.length);
      count.underReview = underReview.length

      const underApprove = requests.filter(request => request.status == 5)
      // console.log("underApprove", underApprove.length);
      count.underApprove = underApprove.length

      const finish = requests.filter(request => request.status == 6)
      // console.log("finish", finish.length);
      count.finish = finish.length

      count.engineerName = `${engineer.FirstName}-${(engineer.LastName).substring(0, 1)}.`

      resolve(count)
    })
  }
  getEngineer() {
    return new Promise(resolve => {
      this.api.GetUsers(4).subscribe((data: any) => {
        resolve(data)
      })
    })
  }


  private getRandomColor() {
    //   var letters = '0123456789ABCDEF';
    //   var color = '#';
    //   for (var i = 0; i < 6; i++) {
    //     color += letters[Math.floor(Math.random() * 16)];
    //   }
    //   return color;
    const number = (Math.floor(Math.random() * this.ColorStackChart.length))
    // console.log('number', number);

    return this.ColorStackChart[number]
  }

  // todo on toggle Defect ---- Model and Process
  async onClickDefectFilter(key: any) {
    this.destroyChartDefect()
    const ExtendModel: any = await this.setExtendModel()
    if (key == 'process') {
      this.callChartDefectProcess(ExtendModel)
    }
    if (key == 'modelCode') {
      this.callChartDefectModelCode(ExtendModel)
    }
  }

  private destroyChartDefect() {
    this.ChartDefectPNL.destroy()
    this.ChartDefectMDL.destroy()
    this.ChartDefectDST_FM.destroy()
    this.ChartDefectAMT_FM.destroy()
    this.ChartDefectAMT.destroy()
    this.ChartDefectSMT.destroy()
  }

  private async callChartDefectModelCode(ExtendModel: any) {
    const tempChartDefectPNL: any = await this.setChartDefectModelCode(ExtendModel.PNL, 'DefectChartPNL')
    this.ChartDefectPNL = tempChartDefectPNL

    const tempChartDefectMDL: any = await this.setChartDefectModelCode(ExtendModel.PNL, 'DefectChartMDL')
    this.ChartDefectMDL = tempChartDefectMDL

    const tempChartDefectDST_FM: any = await this.setChartDefectModelCode(ExtendModel.PNL, 'DefectChartDST_FM')
    this.ChartDefectDST_FM = tempChartDefectDST_FM

    const tempChartDefectAMT_FM: any = await this.setChartDefectModelCode(ExtendModel.PNL, 'DefectChartAMT_FM')
    this.ChartDefectAMT_FM = tempChartDefectAMT_FM

    const tempChartDefectAMT: any = await this.setChartDefectModelCode(ExtendModel.PNL, 'DefectChartAMT')
    this.ChartDefectAMT = tempChartDefectAMT

    const tempChartDefectSMT: any = await this.setChartDefectModelCode(ExtendModel.PNL, 'DefectChartSMT')
    this.ChartDefectSMT = tempChartDefectSMT
  }

  private async callChartDefectProcess(ExtendModel: any) {
    const tempChartDefectPNL: any = await this.setChartDefectProcess(ExtendModel.PNL, 'DefectChartPNL')
    this.ChartDefectPNL = tempChartDefectPNL

    const tempChartDefectMDL: any = await this.setChartDefectProcess(ExtendModel.MDL, 'DefectChartMDL')
    this.ChartDefectMDL = tempChartDefectMDL

    const tempChartDefectDST_FM: any = await this.setChartDefectProcess(ExtendModel.DST_FM, 'DefectChartDST_FM')
    this.ChartDefectDST_FM = tempChartDefectDST_FM

    const tempChartDefectAMT_FM: any = await this.setChartDefectProcess(ExtendModel.AMT_FM, 'DefectChartAMT_FM')
    this.ChartDefectAMT_FM = tempChartDefectAMT_FM

    const tempChartDefectAMT: any = await this.setChartDefectProcess(ExtendModel.AMT, 'DefectChartAMT')
    this.ChartDefectAMT = tempChartDefectAMT

    const tempChartDefectSMT: any = await this.setChartDefectProcess(ExtendModel.SMT, 'DefectChartSMT')
    this.ChartDefectSMT = tempChartDefectSMT

  }

  // todo on toggle Cause ---- Model and Process
  async onClickCauseFilter(key: any) {
    this.destroyChartCause()
    const ExtendModel: any = await this.setExtendModel()
    if (key == 'process') {
      this.callChartCauseProcess(ExtendModel)
    }
    if (key == 'modelCode') {
      this.callChartCauseModelCode(ExtendModel)
    }
  }
  private destroyChartCause() {
    this.ChartCausePNL.destroy()
    this.ChartCauseMDL.destroy()
    this.ChartCauseDST_FM.destroy()
    this.ChartCauseAMT_FM.destroy()
    this.ChartCauseAMT.destroy()
    this.ChartCauseSMT.destroy()
  }
  private async callChartCauseModelCode(ExtendModel: any) {
    const tempChartCausePNL: any = await this.setChartCauseModelCode(ExtendModel.PNL, 'CauseChartPNL')
    this.ChartCausePNL = tempChartCausePNL

    const tempChartCauseMDL: any = await this.setChartCauseModelCode(ExtendModel.MDL, 'CauseChartMDL')
    this.ChartCauseMDL = tempChartCauseMDL

    const tempChartCauseDST_FM: any = await this.setChartCauseModelCode(ExtendModel.DST_FM, 'CauseChartDST_FM')
    this.ChartCauseDST_FM = tempChartCauseDST_FM

    const tempChartCauseAMT_FM: any = await this.setChartCauseModelCode(ExtendModel.AMT_FM, 'CauseChartAMT_FM')
    this.ChartCauseAMT_FM = tempChartCauseAMT_FM

    const tempChartCauseAMT: any = await this.setChartCauseModelCode(ExtendModel.AMT, 'CauseChartAMT')
    this.ChartCauseAMT = tempChartCauseAMT

    const tempChartCauseSMT: any = await this.setChartCauseModelCode(ExtendModel.SMT, 'CauseChartSMT')
    this.ChartCauseSMT = tempChartCauseSMT

  }
  private async callChartCauseProcess(ExtendModel: any) {
    // console.log(ExtendModel);

    const tempChartCausePNL: any = await this.setChartCauseProcess(ExtendModel.PNL, 'CauseChartPNL')
    this.ChartCausePNL = tempChartCausePNL

    const tempChartCauseMDL: any = await this.setChartCauseProcess(ExtendModel.MDL, 'CauseChartMDL')
    this.ChartCauseMDL = tempChartCauseMDL

    const tempChartCauseDST_FM: any = await this.setChartCauseProcess(ExtendModel.DST_FM, 'CauseChartDST_FM')
    this.ChartCauseDST_FM = tempChartCauseDST_FM

    const tempChartCauseAMT_FM: any = await this.setChartCauseProcess(ExtendModel.AMT_FM, 'CauseChartAMT_FM')
    this.ChartCauseAMT_FM = tempChartCauseAMT_FM

    const tempChartCauseAMT: any = await this.setChartCauseProcess(ExtendModel.AMT, 'CauseChartAMT')
    this.ChartCauseAMT = tempChartCauseAMT

    const tempChartCauseSMT: any = await this.setChartCauseProcess(ExtendModel.SMT, 'CauseChartSMT')
    this.ChartCauseSMT = tempChartCauseSMT

  }

  scrollTo(element: any): void {
    (document.getElementById(element) as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }



}
