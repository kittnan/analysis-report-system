import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from 'app/service/http.service';
import { routesAdmin } from 'app/sidebar/sidebar.component';
import { Workbook } from 'exceljs';
import * as XLSX from 'xlsx';
import * as fs from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { setUncaughtExceptionCaptureCallback } from 'process';

type AOA = any[][];

@Component({
  selector: 'app-electrical-search',
  templateUrl: './electrical-search.component.html',
  styleUrls: ['./electrical-search.component.scss']
})
export class ElectricalSearchComponent implements OnInit {
  //-----------------------------------------------------------------------------------------------------//
  //TODO var
  RouterMenu: any[]
  LoadingPage: boolean;

  @Input() model: any

  data: any
  worksheet: any
  constructor(private api: HttpService, private http: HttpClient) { }
  //-----------------------------------------------------------------------------------------------------//
  //TODO init
  ngOnInit(): void {
    this.routes()
    this.data = [
      {
        "no": "12",
        "name": "A1",
        "good": 10,
      },
      {
        "no": "2",
        "name": "A2",
        "good": 20,
      },
      {
        "no": "3",
        "name": "A3",
        "good": 30,
      },

    ]
  }


  //-----------------------------------------------------------------------------------------------------//
  routes() {
    const access: any = localStorage.getItem('AR_UserEmployeeCode')
    if (access == 'admin') {
      this.RouterMenu = [
        {
          path: '/electricalInput', title: 'Input Database', icon: 'bi bi-search'
        },
        {
          path: '/electricalMaster', title: 'Master Electrical', icon: 'bi bi-search'
        },
      ]
    } else {
      this.RouterMenu = [
        {
          path: '/electricalInput', title: 'Input Database', icon: 'bi bi-search'
        },
        {
          path: '/electricalMaster', title: 'Master Electrical', icon: 'bi bi-search'
        },
      ]
    }
  }







  export(): void {
    const workbook = new Workbook();
    this.worksheet = workbook.addWorksheet('New Sheet', { properties: { tabColor: { argb: 'FFC0000' } } });




    this.worksheet.columns = [
      { width: 25, header: 'test', key: 'num1' },
    ];
    const row = this.worksheet.addRows(
      [{ "num1": "asd" }]
    );

    // this.worksheet.getCell("A2").border = {
    //   top: { style: 'medium', color: { argb: '0000' } },
    // };
    this.Outside(this.worksheet, "B2", 2)

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
      fs.saveAs(blob, 'Report Outsource Database.xlsx');
    });
  }

  Outside(worksheet: any, cell: string, style: any) {
    switch (style) {
      case 1:
        worksheet.getCell(cell).border = {
          top: { style: 'medium', color: { argb: '0000' } },
          left: { style: 'medium', color: { argb: '0000' } },
          bottom: { style: 'medium', color: { argb: '0000' } },
          right: { style: 'medium', color: { argb: '0000' } }
        };
        break;
      case 2:
        worksheet.getCell(cell).border = {
          top: { style: 'dashDotDot', color: { argb: '0000' } },
          left: { style: 'dashDotDot', color: { argb: '0000' } },
          bottom: { style: 'dashDotDot', color: { argb: '0000' } },
          right: { style: 'dashDotDot', color: { argb: '0000' } }
        };
        break;
      default:
        break;
    }

  }


  test() {
    ///claimStock-project

    // this.http.get('/assets/F5110.1 RGA.xlsx', { responseType: "arraybuffer" })
    this.http.get('/assets/New Microsoft Excel Worksheet.xlsx', { responseType: "arraybuffer" })
      // this.http.get('http://127.0.0.1:80/mastereletrical/report product electrical space.xlsx', { responseType: "arraybuffer" })
      .subscribe(
        data => {

          const workbook = new Workbook();
          const arryBuffer = new Response(data).arrayBuffer();
          arryBuffer.then((data) => {
            workbook.xlsx.load(data)
              .then(() => {
                let worksheet = workbook.getWorksheet(2);
                worksheet.getCell('G6').value = '3.5';
                // fill(worksheet,'G7','F08080')
                // fill(worksheet,'G10','F08080')
                // set 1
                workbook.xlsx.writeBuffer().then((data: any) => {
                  // let date = formatDate(new Date(), 'YYYYMMdd_Hmmss', 'en-US')
                  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                  fs.saveAs(blob, 'Report Product Electrical Space');
                });
              });
          });
        },
        error => {
          console.log(error);
        }
      );

    function fill(worksheet: any, call: string, color: string) {
      worksheet.getCell(call).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      };
    }
    function border(worksheet: any, call: string, color: string, style: any) {
      worksheet.getCell(call).border = {
        top: { style: style, color: { argb: color } },
        left: { style: style, color: { argb: color } },
        bottom: { style: style, color: { argb: color } },
        right: { style: style, color: { argb: color } }
      };
    } //function border(worksheet,'D3','FF00FF00','medium')
  }


}


// { path: "electricalSearch", component: ElectricalSearchComponent },
// { path: "electricalInput", component: ElectricalInputComponent },

