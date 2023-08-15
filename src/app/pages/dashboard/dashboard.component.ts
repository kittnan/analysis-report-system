import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import Chart from 'chart.js/auto';
import { HttpService } from 'app/service/http.service';
import { Router } from '@angular/router';




@Component({
  selector: 'dashboard-cmp',
  moduleId: module.id,
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  constructor(
    private api: HttpService,
    private route: Router
  ) { }

  // ? loading page
  LoadingPage: boolean;

  // ? Form control
  DateStart = new FormControl(null, Validators.required);
  DateEnd = new FormControl(null, Validators.required);
  Month = new FormControl(null, Validators.required)

  Year: any;

  PercentAll: any;
  PercentPNL: any;
  PercentMDL: any;
  PercentAMTFM: any;
  PercentAMT: any;
  PercentSMT: any;
  PercentDSTFM: any;

  // ?API
  FormList: any;
  Result: any;
  RequestList: any = [];
  list: any = [];

  CutPNL: any;
  CutMDL: any;
  CutSMT: any;
  CutAMT: any;
  CutAMTFM: any;
  CutDSTFM: any;

  public RequestSheet = [];

  public canvas: any;
  public ctx;
  public chartColor;
  public chartEmail;
  public chartHours;
  public chartBar1;
  public chartBar2;
  public chartBar3;

  public testChart1;
  public testChart2;

  RequestSheetChart: any;
  FailureRankChart: any;

  DefectChartPnl: any;
  DefectChartMdl: any;
  DefectChartAMTFm: any;
  DefectChartAmt: any;
  DefectChartSmt: any;
  DefectChartDstFm: any;
  DefaultDefectLabels = ['No Request 1', 'No Request 2', 'No Request 3', 'No Request 4', 'No Request 5']
  DefaultDefectDatas = [0, 0, 0, 0, 0];

  DefaultLabels = ["PNL", "MDL", "DST_FM", "AMT_FM", "AMT", "SMT"]

  CauseChart1: any;
  CauseChart2: any;
  CauseChart3: any;
  CauseChart4: any;
  CauseChart5: any;
  CauseChart6: any;

  numSubString = 100

  // ? Ontime Update
  OntimeAll: any = new Date().toLocaleString('en-US')
  OntimePnl: any = new Date().toLocaleString('en-US')
  OntimeMdl: any = new Date().toLocaleString('en-US')
  OntimeSmt: any = new Date().toLocaleString('en-US')
  OntimeAmt: any = new Date().toLocaleString('en-US')
  OntimeAmtFm: any = new Date().toLocaleString('en-US')
  OntimeDstFm: any = new Date().toLocaleString('en-US')

  UpdateRequestSheet: any = new Date().toLocaleString('en-US')

  // ? ENG
  EngineerLists: any;
  EngineerChart: any;
  EngineerLabel = [];
  EngineerRemain = [];
  EngineerUnderReview = [];
  EngineerUnderApprove = [];

  EngineerReceive = [];
  EngineerFinish = [];
  EngineerDatas: any = {
    receive: [],
    remain: [],
    underReview: [],
    underApprove: [],
    finish: [],
    engineerName: []
  }
  EngineerUpdateTime: any;

  timeInterval: any
  async ngOnInit() {
    await this.CheckStatusUser();
    await this.pageLoadStart();
    // await this.GetFormByYearNow();
    await this.onLoadApi()

    // this.timeInterval = setInterval(() => {
    //   this.ngOnInit();
    // }, 5000);
  }

  // ngOnDestroy() {
  //   if (this.timeInterval) {
  //     clearInterval(this.timeInterval);
  //   }
  // }

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
      guest == "guest") {
    } else {
      // alert("No access!!");
      this.route.navigate(['/manageForm'])
      // location.href = "#/manageForm"
    }

  }

  SetDefectRank(arr: any) {
    const arrayUniqueByKey = [...new Map(arr.map(item =>
      [item['defectiveName'], item])).values()];
    console.log('arrayUniqueByKey', arrayUniqueByKey);
    console.log('&&&&&&&&&&&&&&&&&&&&&&*****************', arr);
    const resultMap: any = arrayUniqueByKey.map((ar: any) => {
      const resultFilter: any = arr.filter((ar2: any) => ar.defectiveName == ar2.defectiveName)
      ar['countDefect'] = resultFilter.length
      return ar
    })
    resultMap.sort((a, b) => {
      const CountA = a.countDefect;
      const CountB = b.countDefect;
      return CountB - CountA
    });
    if (resultMap.length > 5) {
      resultMap.splice(5)
    }
    console.log('resultMap', resultMap);
    return ['data', 'labels']

  }


  // * set option chart
  DefectiveRank(arr: any) {
    let tempData = [];
    arr.forEach(form => {
      let data = arr;
      let tempFilter = data.filter(item => item.defectiveName == form.defectiveName);
      if (tempData.length == 0) {
        const d = {
          name: form.defectiveName,
          count: tempFilter.length
        }
        tempData.push(d)

      } else if (tempData.length >= 1) {
        let num1 = tempData.filter(data => data.name == form.defectiveName);
        if (num1.length == 0) {
          const d = {
            name: form.defectiveName,
            count: tempFilter.length
          }
          tempData.push(d)
        } else {

        }
      }
    });
    this.SortByMax(tempData);
    if (tempData.length > 5) {
      tempData.splice(5)
    }
    let labels = [];
    let data = [];
    tempData.forEach(item => {
      // console.log(item);
      const temp1 = (item.name).substring(0, this.numSubString)
      labels.push(temp1)
    });
    tempData.forEach(item => {
      data.push(item.count)
    });

    return [data, labels]
  }
  SortByMax(data: any) {

    data.sort((a, b) => {
      const CountA = a.count;
      const CountB = b.count;
      return CountB - CountA
    });
  }

  CauseRank(arr: any) {
    // console.log(arr);

    let tempData = [];
    arr.forEach(form => {
      if (form.causeOfDefect) {
        let data = arr;
        let tempFilter = data.filter(item => item.causeOfDefect == form.causeOfDefect);
        // console.log(tempFilter);

        if (tempData.length == 0) {
          const d = {
            name: form.causeOfDefect,
            count: tempFilter.length
          }
          tempData.push(d)

        } else if (tempData.length >= 1) {
          let num1 = tempData.filter(data => data.name == form.causeOfDefect);
          if (num1.length == 0) {
            const d = {
              name: form.causeOfDefect,
              count: tempFilter.length
            }
            tempData.push(d)
          } else {

          }
        }
      }
    });
    // console.log(tempData);
    this.SortByMax(tempData);
    // console.log(tempData);
    if (tempData.length > 5) {
      tempData.splice(5)
    }
    let labels = [];
    let data = [];
    tempData.forEach(item => {

      // let str = item.name
      // let numberStr = this.numSubString
      // let temp1 = str.split(' ')
      // let temp2 = []
      // temp1.forEach((label, i) => {
      //   const str1 = ((`${label} ${temp1[i + 1]}`))
      //   if (label.length < numberStr && str1.length < numberStr) {
      //     temp2.push(str1)
      //     temp1.splice(i, 2)
      //   } else {
      //     temp2.push(label)
      //     temp1.splice(i, 1)
      //   }
      // });

      const temp1 = (item.name).substring(0, this.numSubString)

      labels.push(temp1)
    });
    tempData.forEach(item => {
      data.push(item.count)
    });
    return [data, labels]
  }

  // * set option chart



  // ? CHART
  RequestChart() {

    this.UpdateRequestSheet = this.SetUpdateTime(this.RequestList)
    const ctx = document.getElementById('RequestSheetChart') as HTMLCanvasElement
    this.RequestSheetChart = new Chart(ctx, {
      type: 'bar',

      data: {
        labels: this.DefaultLabels,
        datasets: [
          {
            label: "Request Q'ty",
            data: [10, 20, 30, 40, 50, 60],
            backgroundColor: ['rgba(255, 99, 132, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 205, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(153, 102, 255, 0.6)',],
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,

          }
        ]
      },

      // Configuration options go here
      options: {
        responsive: true,

        plugins: {
          legend: {
            display: false
          }
        }


      }
    });

    let bgcolor_list = ['rgba(255, 99, 132, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(255, 205, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(153, 102, 255, 0.6)',]
    if (this.RequestSheet.length > 0) {
      this.RequestSheetChart.data.datasets = [{
        label: "Request Q'ty",
        data: this.RequestSheet,
        backgroundColor: bgcolor_list,
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
      }]
      this.RequestSheetChart.update();
    }





  }

  FailureChart() {
    let Easy = [];
    let Medium = [];
    let Difficult = [];

    // ?ssssssssssssssssssssssss
    Easy.push((this.CutPNL.filter(i => i.analysisLevel == "Easy")).length);
    Medium.push((this.CutPNL.filter(i => i.analysisLevel == "Medium")).length);
    Difficult.push((this.CutPNL.filter(i => i.analysisLevel == "Difficult")).length);

    Easy.push((this.CutMDL.filter(i => i.analysisLevel == "Easy")).length);
    Medium.push((this.CutMDL.filter(i => i.analysisLevel == "Medium")).length);
    Difficult.push((this.CutMDL.filter(i => i.analysisLevel == "Difficult")).length);

    Easy.push((this.CutDSTFM.filter(i => i.analysisLevel == "Easy")).length);
    Medium.push((this.CutDSTFM.filter(i => i.analysisLevel == "Medium")).length);
    Difficult.push((this.CutDSTFM.filter(i => i.analysisLevel == "Difficult")).length);

    Easy.push((this.CutAMTFM.filter(i => i.analysisLevel == "Easy")).length);
    Medium.push((this.CutAMTFM.filter(i => i.analysisLevel == "Medium")).length);
    Difficult.push((this.CutAMTFM.filter(i => i.analysisLevel == "Difficult")).length);

    Easy.push((this.CutAMT.filter(i => i.analysisLevel == "Easy")).length);
    Medium.push((this.CutAMT.filter(i => i.analysisLevel == "Medium")).length);
    Difficult.push((this.CutAMT.filter(i => i.analysisLevel == "Difficult")).length);

    Easy.push((this.CutSMT.filter(i => i.analysisLevel == "Easy")).length);
    Medium.push((this.CutSMT.filter(i => i.analysisLevel == "Medium")).length);
    Difficult.push((this.CutSMT.filter(i => i.analysisLevel == "Difficult")).length);



    // console.log("easy", Easy);
    // console.log("Medium",Medium);
    // console.log("Difficult",Difficult);
    const sumEasy = Easy.reduce((a, b) => a + b, 0);
    const sumMedium = Medium.reduce((a, b) => a + b, 0);
    const sumDiff = Difficult.reduce((a, b) => a + b, 0);


    var ctx = document.getElementById('FailureRankChart') as HTMLCanvasElement
    this.FailureRankChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.DefaultLabels,

        datasets: [
          {
            label: "Easy",
            data: [10, 12, 15, 17, 18, 23],
            backgroundColor: 'rgb(249, 160, 127,0.6)',
            borderColor: 'rgb(0,0,0)',
            hoverBorderWidth: 2,

          },
          {
            label: "Medium",
            data: [2, 5, 8, 10, 15, 21],
            backgroundColor: 'rgb(144, 222, 224,0.6)',
            borderColor: 'rgb(0,0,0)',
            hoverBorderWidth: 2

          },
          {
            label: "Difficult",
            data: [5, 10, 15, 20, 22, 24],
            backgroundColor: 'rgb(240, 162, 242,0.6)',
            borderColor: 'rgb(0,0,0)',
            hoverBorderWidth: 2

          },

        ],

      },
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
          }
        },
        plugins: {

        }
      }
    });

    if (sumEasy > 0 || sumMedium > 0 || sumDiff > 0) {
      this.FailureRankChart.data.datasets = [

        {
          label: "Easy",
          data: Easy,
          backgroundColor: 'rgb(249, 160, 127,0.6)',
          borderColor: 'rgb(0,0,0)',
          hoverBorderWidth: 2
        },
        {
          label: "Medium",
          data: Medium,
          backgroundColor: 'rgb(144, 222, 224,0.6)',
          borderColor: 'rgb(0,0,0)',
          hoverBorderWidth: 2

        },
        {
          label: "Difficult",
          data: Difficult,
          backgroundColor: 'rgb(240, 162, 242,0.6)',
          borderColor: 'rgb(0,0,0)',
          hoverBorderWidth: 2,
        },
      ]


      this.FailureRankChart.update();
    }
  }

  wrap(str, limit) {
    const words = str.split(" ");
    let aux = []
    let concat = []

    for (let i = 0; i < words.length; i++) {
      concat.push(words[i])
      let join = concat.join(' ')
      if (join.length > limit) {
        aux.push(join)
        concat = []
      }
    }

    if (concat.length) {
      aux.push(concat.join(' ').trim())
    }

    return aux
  }

  //  ? set Chart Defect
  DefectChartPnlFn() {

    var ctx = document.getElementById('DefectChartPnl') as HTMLCanvasElement;
    // ctx.height = 500;
    this.DefectChartPnl = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.DefaultDefectLabels,
        datasets: [
          {
            label: "PNL",
            data: this.DefaultDefectDatas,
            backgroundColor: ['#ea6161', '#fb876a', '#fbd783', '#fdfa66', '#1ddbe2'],
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,

          },

        ],

      },

      // Configuration options go here

      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          xAxes: {
            ticks: {
              callback: (label: number, index, labels) => {
                if (Math.floor(label) === label) {
                  return label;
                }
              },
            },
            title: {
              align: 'end'
            }
          },
        }

      }
    });
    // console.log(this.CutPNL.length);

    if (this.CutPNL.length > 0) {
      let [data, labels] = this.DefectiveRank(this.CutPNL)
      this.DefectChartPnl.data.labels = labels;
      this.DefectChartPnl.data.datasets = [{
        label: 'PNL',
        data: data,
        backgroundColor: ['rgb(234, 97, 97,0.6)', 'rgb(251, 135, 106,0.6)', 'rgb(251, 215, 131,0.6)', 'rgb(253, 250, 102,0.6)', 'rgb(29, 219, 226,0.6)'],
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
        maxBarThickness: 90,
      }];
      this.DefectChartPnl.update();
    }
    // if (this.CutPNL.length > 0) {
    //   let [data, labels] = this.DefectiveRank(this.CutPNL)
    //   this.DefectChartPnl.data.labels = labels;
    //   this.DefectChartPnl.data.datasets = [{
    //     label: 'PNL',
    //     data: data,
    //     backgroundColor: ['rgb(234, 97, 97,0.6)', 'rgb(251, 135, 106,0.6)', 'rgb(251, 215, 131,0.6)', 'rgb(253, 250, 102,0.6)', 'rgb(29, 219, 226,0.6)'],
    //     borderWidth: 2,
    //     borderRadius: 5,
    //     borderSkipped: false,
    //     maxBarThickness: 90,
    //   }];
    //   this.DefectChartPnl.update();
    // }
  }

  DefectChartMdlFn() {
    var ctx = document.getElementById('DefectChartMdl') as HTMLCanvasElement;
    this.DefectChartMdl = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.DefaultDefectLabels,
        datasets: [
          {
            label: "MDL",
            data: this.DefaultDefectDatas,
            backgroundColor: ['rgb(166, 0, 255,0.6)', 'rgb(213, 39, 183,0.6)', 'rgb(247, 130, 194,0.6)', 'rgb(249, 196, 107,0.6)', 'rgb(227, 227, 227,0.6)'],
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,
          },

        ]
      },
      // Configuration options go here
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          xAxes: {
            ticks: {
              callback: (label: number, index, labels) => {
                if (Math.floor(label) === label) {
                  return label;
                }
              },
            }
          }
        }

      }
    });

    // console.log(this.CutMDL);

    if (this.CutMDL.length > 0) {
      let [data, labels] = this.DefectiveRank(this.CutMDL)
      this.DefectChartMdl.data.labels = labels;
      this.DefectChartMdl.data.datasets = [{
        label: 'MDL',
        data: data,
        backgroundColor: ['#a600ff', '#d527b7', '#f782c2', '#f9c46b', '#e3e3e3'],
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
        maxBarThickness: 90,
      }];
      this.DefectChartMdl.update();
    }
  }
  DefectChartAmtFmfn() {
    var ctx = document.getElementById('DefectChartFm') as HTMLCanvasElement;
    this.DefectChartAMTFm = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.DefaultDefectLabels,
        datasets: [
          {
            label: "AMT_FM",
            data: this.DefaultDefectDatas,
            backgroundColor: ['rgb(39, 16, 78,0.6)', 'rgb(100, 55, 159,0.6)', 'rgb(152, 84, 203,0.6)', 'rgb(221, 172, 245,0.6)', 'rgb(222, 190, 247,0.6)'],
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,
          },

        ]
      },
      // Configuration options go here
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {

          }
        },
        scales: {
          myScale: {
            // type: 'logarithmic',
            position: 'left', // `axis` is determined by the position as `'y'`
          },
          xAxes: {
            ticks: {
              callback: (label: number, index, labels) => {
                if (Math.floor(label) === label) {
                  return label;
                }
              },
            }
          }
        }

      }
    });

    if (this.CutAMTFM.length > 0) {
      let [data, labels] = this.DefectiveRank(this.CutAMTFM)
      this.DefectChartAMTFm.data.labels = labels;
      this.DefectChartAMTFm.data.datasets = [{
        label: 'AMT_FM',
        data: data,
        backgroundColor: ['#27104e', '#64379f', '#9854cb', '#ddacf5', '#75e8e7'],
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
        maxBarThickness: 90,
      }];
      this.DefectChartAMTFm.update();
    }
  }
  DefectChartAmtFn() {
    var ctx = document.getElementById('DefectChartAmt') as HTMLCanvasElement
    this.DefectChartAmt = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.DefaultDefectLabels,
        datasets: [
          {
            label: "AMT",
            data: this.DefaultDefectDatas,
            backgroundColor: ['rgb(3, 31, 75,0.6)', 'rgb(3, 57, 108,0.6)', 'rgb(0, 91, 150,0.6)', 'rgb(100, 151, 177,0.6)', 'rgb(179, 205, 224,0.6)'],
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,
            maxBarThickness: 90,
          },

        ]
      },
      // Configuration options go here
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          xAxes: {
            ticks: {
              callback: (label: number, index, labels) => {
                if (Math.floor(label) === label) {
                  return label;
                }
              },
            }
          }
        }
      }
    });

    if (this.CutAMT.length > 0) {
      let [data, labels] = this.DefectiveRank(this.CutAMT)
      this.DefectChartAmt.data.labels = labels;
      this.DefectChartAmt.data.datasets = [{
        label: 'AMT',
        data: data,
        backgroundColor: ['#f9b4ab', '#fdebd3', '#264e70', '#679186', '#bbd4ce'],
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
      }];
      this.DefectChartAmt.update();
    }
  }
  DefectChartSmtFn() {
    var ctx = document.getElementById('DefectChartSmt') as HTMLCanvasElement;
    this.DefectChartSmt = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.DefaultDefectLabels,
        datasets: [
          {
            label: "SMT",
            data: this.DefaultDefectDatas,
            backgroundColor: ['rgb(5, 30, 62,0.6)', 'rgb(37, 30, 62,0.6)', 'rgb(70, 30, 62,0.6)', 'rgb(104, 30, 62,0.6)', 'rgb(166, 30, 62,0.6)'],
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,
            maxBarThickness: 90,
          },

        ]
      },
      // Configuration options go here
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          myScale: {
            // type: 'logarithmic',
            position: 'left', // `axis` is determined by the position as `'y'`

          },
          xAxes: {
            ticks: {
              callback: (label: number, index, labels) => {
                if (Math.floor(label) === label) {
                  return label;
                }
              },
            }
          }




        }
      }
    });

    if (this.CutSMT.length > 0) {
      let [data, labels] = this.DefectiveRank(this.CutSMT)
      this.DefectChartSmt.data.labels = labels;
      this.DefectChartSmt.data.datasets = [{
        label: 'SMT',
        data: data,
        backgroundColor: ['#272643', '#4d4d4d', '#e3f6f5', '#bae8e8', '#2c698d'],
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
      }];
      this.DefectChartSmt.update();
    }
  }
  DefectChartDstFn() {
    var ctx = document.getElementById('DefectChartDst') as HTMLCanvasElement
    this.DefectChartDstFm = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.DefaultDefectLabels,
        datasets: [
          {
            label: "DST_FM",
            data: this.DefaultDefectDatas,
            backgroundColor: ['rgb(14, 154, 167,0.6)', 'rgb(60, 154, 167,0.6)', 'rgb(97, 154, 167,0.6)', 'rgb(128, 154, 167,0.6)', 'rgb(155, 154, 167,0.6)'],
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,
            maxBarThickness: 90,
          },

        ]
      },
      // Configuration options go here
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          xAxes: {
            ticks: {
              callback: (label: number, index, labels) => {
                if (Math.floor(label) === label) {
                  return label;
                }
              },
            }
          }
        }
      }
    });

    if (this.CutDSTFM.length > 0) {
      let [data, labels] = this.DefectiveRank(this.CutDSTFM)
      this.DefectChartDstFm.data.labels = labels;
      this.DefectChartDstFm.data.datasets = [{
        label: 'DST_FM',
        data: data,
        backgroundColor: ['#e5ede8', '#252525', '#875b4f', '#679186', '#549bd3'],
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
      }];
      this.DefectChartDstFm.update();
    }
  }
  //  ? set Chart Defect


  //  ? set Chart Cause
  CauseChart1Fn() {
    // console.log(a.length);


    var ctx = document.getElementById('CauseChart1') as HTMLCanvasElement;
    this.CauseChart1 = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.DefaultDefectLabels,
        datasets: [
          {
            label: "PNL",
            data: this.DefaultDefectDatas,
            backgroundColor: ['rgb(74, 78, 77,0.6)', 'rgb(14, 154, 167,0.6)', 'rgb(61, 164, 171,0.6)', 'rgb(246, 205, 97,0.6)', 'rgb(254, 138, 113,0.6)'],

          },

        ]
      },

      // Configuration options go here
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          myScale: {
            // type: 'logarithmic',
            position: 'left', // `axis` is determined by the position as `'y'`

          },
          xAxes: {
            ticks: {
              callback: (label: number, index, labels) => {
                if (Math.floor(label) === label) {
                  return label;
                }
              },
            }
          }



        }
      },


    });



    // console.log("this.CutPNL",this.CutPNL);

    if (this.CutPNL.length > 0) {

      let [data, labels] = this.CauseRank(this.CutPNL)
      if (data.length != 0) {
        // console.log(data, labels);

        this.CauseChart1.data.labels = labels;
        this.CauseChart1.data.datasets = [{
          label: 'PNL',
          data: data,
          backgroundColor: ['rgb(74, 78, 77,0.6)', 'rgb(14, 154, 167,0.6)', 'rgb(61, 164, 171,0.6)', 'rgb(246, 205, 97,0.6)', 'rgb(254, 138, 113,0.6)'],
          borderWidth: 2,
          borderRadius: 5,
          borderSkipped: false,
          maxBarThickness: 90,
        }];


        this.CauseChart1.update();
      }

    }

  }

  CauseChart2Fn() {


    var ctx = document.getElementById('CauseChart2') as HTMLCanvasElement
    this.CauseChart2 = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.DefaultDefectLabels,
        datasets: [
          {
            label: "MDL",
            data: this.DefaultDefectDatas,
            backgroundColor: ['rgb(187, 187, 187,0.6)', 'rgb(208, 225, 249,0.6)', 'rgb(77, 100, 141,0.6)', 'rgb(40, 54, 85,0.6)', 'rgb(30, 31, 38,0.6)'],

          },

        ]
      },
      // Configuration options go here
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          xAxes: {
            ticks: {
              callback: (label: number, index, labels) => {
                if (Math.floor(label) === label) {
                  return label;
                }
              },
            }
          }
        }
      }
    });


    if (this.CutMDL.length > 0) {
      let [data, labels] = this.CauseRank(this.CutMDL)
      if (data.length != 0) {
        // console.log(data, labels);

        this.CauseChart2.data.labels = labels;
        this.CauseChart2.data.datasets = [{
          label: 'MDL',
          data: data,
          backgroundColor: ['#e5ede8', '#252525', '#875b4f', '679186', '#549bd3'],
          borderWidth: 2,
          borderRadius: 5,
          borderSkipped: false,
          maxBarThickness: 90,
        }];
        this.CauseChart2.update();
      }
    }

  }

  CauseChart3Fn() {


    var ctx = document.getElementById('CauseChart3') as HTMLCanvasElement
    this.CauseChart3 = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.DefaultDefectLabels,
        datasets: [
          {
            label: "AMT_FM",
            data: this.DefaultDefectDatas,
            backgroundColor: ['rgb(75, 56, 50,0.6)', 'rgb(133, 68, 66,0.6)', 'rgb(255, 244, 230,0.6)', 'rgb(60, 47, 47,0.6)', 'rgb(190, 155, 123,0.6)'],

          },

        ]
      },
      // Configuration options go here
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          myScale: {
            // type: 'logarithmic',
            position: 'left', // `axis` is determined by the position as `'y'`

          },
          xAxes: {
            ticks: {
              callback: (label: number, index, labels) => {
                if (Math.floor(label) === label) {
                  return label;
                }
              },
            }
          }



        }
      }
    });


    if (this.CutAMTFM.length > 0) {
      let [data, labels] = this.CauseRank(this.CutAMTFM)
      if (data.length != 0) {
        // console.log(data, labels);

        this.CauseChart3.data.labels = labels;
        this.CauseChart3.data.datasets = [{
          label: 'AMT_FM',
          data: data,
          backgroundColor: ['#e5ede8', '#252525', '#875b4f', '679186', '#549bd3'],
          mborderWidth: 2,
          borderRadius: 5,
          borderSkipped: false,
          maxBarThickness: 90,
        }];
        this.CauseChart3.update();
      }

    }
  }

  CauseChart4Fn() {


    var ctx = document.getElementById('CauseChart4') as HTMLCanvasElement
    this.CauseChart4 = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.DefaultDefectLabels,
        datasets: [
          {
            label: "AMT",
            data: this.DefaultDefectDatas,
            backgroundColor: ['rgb(168, 230, 207,0.6)', 'rgb(220, 237, 193,0.6)', 'rgb(255, 211, 182,0.6)', 'rgb(255, 170, 165,0.6)', 'rgb(255, 139, 148,0.6)'],

          },

        ]
      },
      // Configuration options go here
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          xAxes: {
            ticks: {
              callback: (label: number, index, labels) => {
                if (Math.floor(label) === label) {
                  return label;
                }
              },
            }
          }
        }
      }
    });


    if (this.CutAMT.length > 0) {
      let [data, labels] = this.CauseRank(this.CutAMT)
      if (data.length != 0) {
        // console.log(data, labels);

        this.CauseChart4.data.labels = labels;
        this.CauseChart4.data.datasets = [{
          label: 'AMT',
          data: data,
          backgroundColor: ['#e5ede8', '#252525', '#875b4f', '679186', '#549bd3'],
          borderWidth: 2,
          borderRadius: 5,
          borderSkipped: false,
          maxBarThickness: 90,
        }];
        this.CauseChart4.update();
      }

    }
  }

  CauseChart5Fn() {


    var ctx = document.getElementById('CauseChart5') as HTMLCanvasElement
    this.CauseChart5 = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.DefaultDefectLabels,
        datasets: [
          {
            label: "SMT",
            data: this.DefaultDefectDatas,
            backgroundColor: ['rgb(94, 86, 86,0.6)', 'rgb(88, 102, 139,0.6)', 'rgb(118, 180, 189,0.6)', 'rgb(189, 234, 238,0.6)', 'rgb(235, 244, 246,0.6)'],

          },

        ]
      },
      // Configuration options go here
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          myScale: {
            // type: 'logarithmic',
            position: 'left', // `axis` is determined by the position as `'y'`

          },
          xAxes: {
            ticks: {
              callback: (label: number, index, labels) => {
                if (Math.floor(label) === label) {
                  return label;
                }
              },
            }
          }


        }

      }
    });


    if (this.CutSMT.length > 0) {
      let [data, labels] = this.CauseRank(this.CutSMT)
      if (data.length != 0) {
        // console.log(data, labels);

        this.CauseChart5.data.labels = labels;
        this.CauseChart5.data.datasets = [{
          label: 'SMT',
          data: data,
          backgroundColor: ['#e5ede8', '#252525', '#875b4f', '679186', '#549bd3'],
          borderWidth: 2,
          borderRadius: 5,
          borderSkipped: false,
          maxBarThickness: 90,
        }];
        this.CauseChart5.update();
      }

    }
  }

  CauseChart6Fn() {


    var ctx = document.getElementById('CauseChart6') as HTMLCanvasElement
    this.CauseChart6 = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.DefaultDefectLabels,
        datasets: [
          {
            label: "DST_FM",
            data: this.DefaultDefectDatas,
            backgroundColor: ['rgb(237, 201, 81,0.6)', 'rgb(235, 104, 65,0.6)', 'rgb(204, 42, 54,0.6)', 'rgb(79, 55, 45,0.6)', 'rgb(3, 160, 176,0.6)'],

          },

        ]
      },
      // Configuration options go here
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          xAxes: {
            ticks: {
              callback: (label: number, index, labels) => {
                if (Math.floor(label) === label) {
                  return label;
                }
              },
            }
          }
        }

      }
    });


    if (this.CutDSTFM.length > 0) {
      let [data, labels] = this.CauseRank(this.CutDSTFM)
      if (data.length != 0) {
        // console.log(data, labels);

        this.CauseChart6.data.labels = labels;
        this.CauseChart6.data.datasets = [{
          label: 'DST_FM',
          data: data,
          backgroundColor: ['#e5ede8', '#252525', '#875b4f', '679186', '#549bd3'],
          borderWidth: 2,
          borderRadius: 5,
          borderSkipped: false,
          maxBarThickness: 90,
        }];
        this.CauseChart6.update();
      }

    }
  }
  //  ? set Chart Cause

  //  ? set Chart ENG
  EngChart() {

    var ctx = document.getElementById('EngineerChart') as HTMLCanvasElement
    this.EngineerChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Engineer1", "Engineer2", "Engineer3", "Engineer4", "Engineer5"],

        datasets: [
          {
            label: "Finish",
            data: [],
            backgroundColor: '#8cff8c',
            borderColor: 'rgb(0,0,0)',
            hoverBorderWidth: 2,
            maxBarThickness: 90,


          },
          {
            label: "Under Approve",
            data: [],
            backgroundColor: '#ffff8c',
            borderColor: 'rgb(0,0,0)',
            hoverBorderWidth: 2,
            maxBarThickness: 90,

          },
          {
            label: "Under Review",
            data: [0],
            backgroundColor: '#ffc88c',
            borderColor: 'rgb(0,0,0)',
            hoverBorderWidth: 2,
            maxBarThickness: 90,

          },
          {
            label: "Remain",
            data: [0],
            backgroundColor: '#ff8c8c',
            borderColor: 'rgb(0,0,0)',
            hoverBorderWidth: 2,
            maxBarThickness: 90,

          },


        ],

      },
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
            ticks: {
              callback: (label: number, index, labels) => {
                if (Math.floor(label) === label) {
                  return label;
                }
              },
            }
          },

        },
        plugins: {

        }
      }
    });

    // this.EngineerDatas.receive.push(requestCounted.receive)
    // this.EngineerDatas.remain.push(requestCounted.remain)
    // this.EngineerDatas.underReview.push(requestCounted.underReview)
    // this.EngineerDatas.underApprove.push(requestCounted.underApprove)
    // this.EngineerDatas.finish.push(requestCounted.finish)
    // this.EngineerDatas.engineerName.push(requestCounted.engineerName)

    if ((this.EngineerDatas.receive).length != 0) {
      this.EngineerChart.data.datasets = [
        {
          label: "Finish",
          data: this.EngineerDatas.finish,
          backgroundColor: '#8cff8c',
          borderColor: 'rgb(0,0,0)',
          hoverBorderWidth: 2,
          maxBarThickness: 90,


        },
        {
          label: "Under Approve",
          data: this.EngineerDatas.underApprove,
          backgroundColor: '#ffff8c',
          borderColor: 'rgb(0,0,0)',
          hoverBorderWidth: 2,
          maxBarThickness: 90,

        },
        {
          label: "Under Review",
          data: this.EngineerDatas.underReview,
          backgroundColor: '#ffc88c',
          borderColor: 'rgb(0,0,0)',
          hoverBorderWidth: 2,
          maxBarThickness: 90,

        },
        {
          label: "Remain",
          data: this.EngineerDatas.remain,
          backgroundColor: '#ff8c8c',
          borderColor: 'rgb(0,0,0)',
          hoverBorderWidth: 2,
          maxBarThickness: 90,

        },





      ]
      this.EngineerChart.data.labels = this.EngineerDatas.engineerName

      this.EngineerChart.update();
    }
  }
  //  ? set Chart ENG


  async onLoadApi() {
    this.Year = new Date().getFullYear();
    this.FormList = await this.getForm()
    this.Result = await this.getResult();
    this.RequestList = await this.mergeData();
    // console.log("new", this.FormList);
    // console.log(this.Result);
    // console.log(this.RequestList);
    await this.SetDiffDay();
    await this.CutModel();
    await this.SetCountRequest();
    await this.SetEachEng();
    await this.callChart();
    this.pageLoadEnd();
  }

  async onSearch() {
    this.FormList = await this.getForm()
    this.Result = await this.getResult();
    this.RequestList = await this.mergeData();
    // console.log("new", this.FormList);
    // console.log(this.Result);
    // console.log(this.RequestList);
    await this.SetDiffDay();
    await this.CutModel();
    await this.SetCountRequest();
    await this.SetEachEng();
    await this.callChart();
    this.pageLoadEnd();
  }



  // ? API

  getForm() {
    return new Promise((resolve) => {
      const data = {
        year: this.Year || null,
        month: this.Month.value || null,
        dateStart: this.DateStart.value || null,
        dateEnd: this.DateEnd.value || null
      }
      // console.log(data);

      this.api.GetForm(data).subscribe((data: any) => {
        const temp = data.filter(i => i.status != 0)
        resolve(temp)
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
  mergeData() {
    return new Promise((resolve) => {
      let temp = []
      this.FormList.forEach(form => {
        const result = this.Result.find(result => result.formId == form._id)
        if (result) {
          // form['dateFinish'] = form.updatedAt


          // ! set lastest updateTime
          const formDate = new Date(form.updatedAt).getDate()
          const resultDate = new Date(result.updatedAt).getDate()
          if ((formDate - resultDate) >= 0) {
            result['updatedAt'] = form.updatedAt
          } else {
            result['updatedAt'] = result.updatedAt
          }
          temp.push({ ...form, ...result })
        } else {
          // form['dateFinish'] = form.updatedAt

          temp.push({ ...form })
        }
      });
      resolve(temp)
    })
  }

  getEngineer() {
    return new Promise(resolve => {
      this.api.GetUsers(4).subscribe((data: any) => {
        resolve(data)
      })
    })
  }
  // ? API


  // * Build Data
  SetDiffDay() {
    // console.log(this.RequestList);

    return new Promise(async (resolve) => {
      this.RequestList.forEach((merge, index) => {
        let reply = new Date(merge.replyDate).getTime();
        let finishAnalysis
        if (merge.finishAnalyzeDate) {
          finishAnalysis = new Date(merge.finishAnalyzeDate).getTime();
        } else {
          finishAnalysis = new Date().getTime()
        }

        // console.log(reply,finishAnalysis);

        let difference = reply - finishAnalysis

        var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
        // console.log(difference,daysDifference);

        this.RequestList[index]['diffDay'] = daysDifference;

      })
      this.PercentAll = null;
      this.PercentPNL = null;
      this.PercentMDL = null;
      this.PercentAMTFM = null;
      this.PercentAMT = null;
      this.PercentSMT = null;
      this.PercentDSTFM = null;
      const a = await this.setOnTimeAllFn()
      resolve(a)
    })
  }

  setOnTimeAllFn() {
    return new Promise((resolve) => {
      this.SetOnTimeAll();
      this.SetOnTimePNL();
      this.SetOnTimeMDL();
      this.SetOnTimeAMTFM();
      this.SetOnTimeAMT();
      this.SetOnTimeSMT();
      this.SetOnTimeDST();
      resolve('success');
    })
  }

  SetCountRequest() {
    this.RequestSheet = []
    return new Promise((resolve) => {

      const countPNL = this.CutPNL.length;
      const countMDL = this.CutMDL.length;
      const countDST = this.CutDSTFM.length;
      const countFM = this.CutAMTFM.length;
      const countAMT = this.CutAMT.length;
      const countSMT = this.CutSMT.length;

      this.RequestSheet.push(countPNL)
      this.RequestSheet.push(countMDL)
      this.RequestSheet.push(countDST)
      this.RequestSheet.push(countFM)
      this.RequestSheet.push(countAMT)
      this.RequestSheet.push(countSMT)
      // console.log(this.dataSet1);
      resolve('success')
    })

  }

  // ? set chart on time
  SetOnTimeAll() {
    const tempData = this.RequestList.filter(i => i.diffDay != null)
    const total = tempData.length;
    const requestOntime = tempData.filter(request => request.diffDay >= 0);
    const countOntime = requestOntime.length;
    this.PercentAll = (countOntime / total) * 100;
    this.PercentAll = Math.round(this.PercentAll) || null

    // ? Set Update Time
    tempData.length > 0 ? this.OntimeAll = this.SetUpdateTime(tempData) : false
    // ? Set Update Time
  }

  SetOnTimePNL() {
    const tempData = this.RequestList.filter(i => i.diffDay != null)
    const newRequest1 = tempData.filter(request => request.requestItem == "PNL");
    // console.log(newRequest1);

    const oldCount = newRequest1.length;
    const newRequest2 = newRequest1.filter(request => request.diffDay >= 0);
    const newCount = newRequest2.length;
    this.PercentPNL = (newCount / oldCount) * 100;
    this.PercentPNL = Math.round(this.PercentPNL) || null
    // console.log(this.PercentPNL);

    // ? Set Update Time
    newRequest1.length > 0 ? this.OntimePnl = this.SetUpdateTime(newRequest1) : false
    // ? Set Update Time

  }
  SetOnTimeMDL() {
    const tempData = this.RequestList.filter(i => i.diffDay != null)
    const newRequest1 = tempData.filter(request => request.requestItem == "MDL");
    const oldCount = newRequest1.length;
    const newRequest2 = newRequest1.filter(request => request.diffDay >= 0);
    const newCount = newRequest2.length;
    this.PercentMDL = (newCount / oldCount) * 100;
    this.PercentMDL = Math.round(this.PercentMDL) || null

    // ? Set Update Time
    newRequest1.length > 0 ? this.OntimeMdl = this.SetUpdateTime(newRequest1) : false
    // ? Set Update Time



  }
  SetOnTimeAMTFM() {
    const tempData = this.RequestList.filter(i => i.diffDay != null)
    const newRequest1 = tempData.filter(request => request.requestItem == "AMT_FM");
    const oldCount = newRequest1.length;
    const newRequest2 = newRequest1.filter(request => request.diffDay >= 0);
    const newCount = newRequest2.length;
    this.PercentAMTFM = (newCount / oldCount) * 100;
    this.PercentAMTFM = Math.round(this.PercentAMTFM) || null

    // ? Set Update Time
    newRequest1.length > 0 ? this.OntimeAmtFm = this.SetUpdateTime(newRequest1) : false
    // ? Set Update Time

  }
  SetOnTimeAMT() {
    const tempData = this.RequestList.filter(i => i.diffDay != null)
    const newRequest1 = tempData.filter(request => request.requestItem == "AMT");
    const oldCount = newRequest1.length;
    const newRequest2 = newRequest1.filter(request => request.diffDay >= 0);
    const newCount = newRequest2.length;
    this.PercentAMT = (newCount / oldCount) * 100;
    this.PercentAMT = Math.round(this.PercentAMT) || null

    // ? Set Update Time
    newRequest1.length > 0 ? this.OntimeAmt = this.SetUpdateTime(newRequest1) : false
    // ? Set Update Time

  }
  SetOnTimeSMT() {
    const tempData = this.RequestList.filter(i => i.diffDay != null)
    const newRequest1 = tempData.filter(request => request.requestItem == "SMT");
    const oldCount = newRequest1.length;
    const newRequest2 = newRequest1.filter(request => request.diffDay >= 0);
    const newCount = newRequest2.length;
    this.PercentSMT = (newCount / oldCount) * 100;
    this.PercentSMT = Math.round(this.PercentSMT) || null

    // ? Set Update Time
    newRequest1.length > 0 ? this.OntimeSmt = this.SetUpdateTime(newRequest1) : false
    // ? Set Update Time

  }
  SetOnTimeDST() {
    const tempData = this.RequestList.filter(i => i.diffDay != null)
    const newRequest1 = tempData.filter(request => request.requestItem == "DST_FM");
    const oldCount = newRequest1.length;
    const newRequest2 = newRequest1.filter(request => request.diffDay >= 0);
    const newCount = newRequest2.length;
    this.PercentDSTFM = (newCount / oldCount) * 100;
    this.PercentDSTFM = Math.round(this.PercentDSTFM) || null

    // ? Set Update Time
    newRequest1.length > 0 ? this.OntimeDstFm = this.SetUpdateTime(newRequest1) : false
    // ? Set Update Time
  }
  // ? set chart on time


  // * Set Update Time for updateAt
  SetUpdateTime(datas: any) {
    // console.log(datas);

    const lastestUpdateTime = datas.reduce((prev, now) => {
      const prevDate = new Date(prev).getTime()
      const nowDate = new Date(now.updatedAt).getTime()


      if (nowDate - prevDate) {
        return now.updatedAt
      } else {
        return prev
      }
    }, "1978-01-01")
    return new Date(lastestUpdateTime).toLocaleString()

  }
  // * Set Update Time for updateAt


  CutModel() {
    return new Promise((resolve) => {
      this.CutPNL = (this.RequestList.filter(request => request.requestItem == "PNL"));
      this.CutMDL = (this.RequestList.filter(request => request.requestItem == "MDL"));
      this.CutAMTFM = (this.RequestList.filter(request => request.requestItem == "AMT_FM"));
      this.CutAMT = (this.RequestList.filter(request => request.requestItem == "AMT"));
      this.CutSMT = (this.RequestList.filter(request => request.requestItem == "SMT"));
      this.CutDSTFM = (this.RequestList.filter(request => request.requestItem == "DST_FM"));
      resolve('success')
    })
  }


  SetEachEng() {

    return new Promise(async resolve => {
      this.EngineerDatas = {
        receive: [],
        remain: [],
        underReview: [],
        underApprove: [],
        finish: [],
        engineerName: []
      }
      const engineers: any = await this.getEngineer()
      // console.log(engineers);
      await engineers.map(async engineer => {
        //  console.log("name",engineer.FirstName);
        const requests = this.RequestList.filter(request => request.userApprove3 == engineer._id)
        // console.log(requests);
        if (requests.length > 0) {
          const requestCounted: any = await this.countRequestEngineer(requests, engineer)
          // console.log(requestCounted);
          if (requestCounted.receive != 0) {
            this.EngineerDatas.receive.push(requestCounted.receive)
            this.EngineerDatas.remain.push(requestCounted.remain)
            this.EngineerDatas.underReview.push(requestCounted.underReview)
            this.EngineerDatas.underApprove.push(requestCounted.underApprove)
            this.EngineerDatas.finish.push(requestCounted.finish)
            this.EngineerDatas.engineerName.push(requestCounted.engineerName)
          }
        }
      })
      // console.log(this.EngineerDatas);
      this.EngineerUpdateTime = this.SetUpdateTime(this.RequestList)
      resolve('success')

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
  // * Build Data


  // ? EVENT
  onClickYear() {
    // this.clear2();
    this.clearMonth();
    this.clearDateBetween();
    this.clearChart()
    const yearNow = new Date().getFullYear();
    this.Year = yearNow;
    this.onSearch()
  }
  onClickMonth() {
    // this.clear2();
    this.clearYear();
    this.clearDateBetween();
    this.clearChart()
    this.onSearch()

    // console.log(sum);
  }
  onChangeDate() {
    // this.clear1();
    this.clearYear();
    this.clearMonth()
    this.clearChart()
    // this.GetFormByYear();
    this.onSearch()

    // console.log(this.DateStart.value);

  }
  clearYear() {
    this.Year = null;
  }
  clearMonth() {
    this.Month.reset()
  }
  clearDateBetween() {
    this.DateStart.reset();
    this.DateEnd.reset();
  }

  // clear1() {
  //   this.Year = null;
  //   this.Month.reset();
  // }
  // clear2() {
  //   this.DateStart.reset();
  //   this.DateEnd.reset();
  // }
  clearChart() {
    this.RequestSheetChart.destroy();
    this.FailureRankChart.destroy();
    this.DefectChartPnl.destroy();
    this.DefectChartMdl.destroy();
    this.DefectChartAMTFm.destroy();
    this.DefectChartAmt.destroy();
    this.DefectChartSmt.destroy();
    this.DefectChartDstFm.destroy();
    this.CauseChart1.destroy();
    this.CauseChart2.destroy();
    this.CauseChart3.destroy();
    this.CauseChart4.destroy();
    this.CauseChart5.destroy();
    this.CauseChart6.destroy();
    this.EngineerChart.destroy()
  }
  callChart() {
    return new Promise((resolve) => {

      this.RequestChart();
      this.FailureChart();

      this.DefectChartPnlFn();
      this.DefectChartMdlFn();
      this.DefectChartAmtFmfn();
      this.DefectChartAmtFn();
      this.DefectChartSmtFn();
      this.DefectChartDstFn();

      this.CauseChart1Fn();
      this.CauseChart2Fn();
      this.CauseChart3Fn();
      this.CauseChart4Fn();
      this.CauseChart5Fn();
      this.CauseChart6Fn();

      this.EngChart();

      resolve('success')
    })

  }

  pageLoadStart() {
    this.LoadingPage = true;
  }
  pageLoadEnd() {
    setTimeout(() => {
      this.LoadingPage = false;

    }, 500);
  }


}
