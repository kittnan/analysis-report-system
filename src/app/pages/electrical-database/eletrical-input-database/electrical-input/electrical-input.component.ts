import { Component, OnInit } from '@angular/core';
import { HttpService } from 'app/service/http.service';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs'
import * as fs from 'file-saver';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { threadId } from 'worker_threads';
import { replaceAll } from 'chartist';




@Component({
  selector: 'app-electrical-input',
  templateUrl: './electrical-input.component.html',
  styleUrls: ['./electrical-input.component.scss']
})
export class ElectricalInputComponent implements OnInit {

  //-----------------------------------------------------------------------------------------------------//

  //TODO var
  RouterMenu: any[]
  LoadingPage: boolean;

  worksheet: any;
  MasterProductSpec: any
  data: any[]
  model: any
  Datalist: any
  MasterModel: any
  MasterTFT: any
  MasterResis: any
  MasterOtp: any
  dataOld: any
  dataTable: any
  nameTable: any

  onHide: any[] = []
  UserLevel: any

  // ? Fix ID
  IdModelNumber = environment.IdModelNumber
  myForm: any;
  things: any
  constructor(private api: HttpService, private http: HttpClient) { }
  //TODO init

  async ngOnInit(): Promise<void> {
    this.routes()
    this.getMasterProductSpec()
    this.getMasterTFT()
    this.getMasterResis()
    this.getMasterOtp()
    this.getModel()
    this.data = []
    this.UserLevel = sessionStorage.getItem("UserLevel1")
  }

  //TODO Routes
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
  //TODO ----------------Data----------------
  //TODO selectModel
  modelList() {
    this.getDataMain()
    if (this.model) {
      let data = this.MasterProductSpec.find(e => e.model == this.model)
      if (data) {
        this.Datalist = {
          model: data.model,
          value: data.value,
          pattern: data.pattern,
        }
        this.data = this.Datalist.value
        this.data = this.replace(this.data, "-", "0");
        this.data = this.data.filter((d: any) => d.name)
        this.data = this.data.map((d: any) => {
          return {
            ...d,
            ng: [{ value: null, status: false }],
            // status: [{ value: 0 }]
          }
        })
        // console.log(this.data);

      } else {
        this.data = []
      }
    }
    this.dataTable = 0
    this.filterMaster()
  }
  //TODO addInput
  addInput(item: any) {
    this.data = this.data.map((d: any) => {
      // console.log(d);
      d.ng.push({ value: null, status: false })
      return {
        ...d,
      }
    })
    // console.log(this.data);
  }
  //TODO delInput
  delInput(item: any) {
    this.data = this.data.map((d: any) => {
      // console.log(d);
      d.ng.pop()
      return {
        ...d,
      }
    })
    // console.log(this.data);
  }

  //TODO calculator
  //TODO -------------------------------------
  calculator(e: any, i: any) {
    if (e.ng[i].value != null && e.min <= e.ng[i].value && e.ng[i].value <= e.max) {
      e.ng[i].status = true
    }
    else {
      e.ng[i].status = false
    }

  }

  //TODO replace
  replace(data: any, old: string, strNew: string) {
    return JSON.parse(JSON.stringify(data).replace(new RegExp(old, "g"), "0"));
  }

  //TODO setSizeAndCustom
  getDataMain() {
    this.dataOld = this.MasterModel.find(e => e.name == this.model)
  }


  //TODO getModel
  async getModel() {
    this.MasterModel = await this.api.GetListByIdMaster(this.IdModelNumber).toPromise()
  }


  //TODO getMasterPro
  async getMasterProductSpec() {
    this.MasterProductSpec = await this.api.getMasterProductSpec().toPromise()
    this.MasterProductSpec.pop()
    // console.log();
  }

  //TODO getMasterTFT
  async getMasterTFT() {
    this.MasterTFT = await this.api.getMasterTFT().toPromise()
    // this.MasterProductSpec.pop()
    // console.log(this.MasterTFT);
  }

  async getMasterResis() {
    this.MasterResis = await this.api.getMasterResis().toPromise()
  }

  async getMasterOtp() {
    this.MasterOtp = await this.api.getMasterOTP().toPromise()
  }


  //TODO select product
  clickSelect(e: any) {
    this.nameTable = e.target.innerText
    switch (e.target.id) {
      case "Product":
        this.dataTable = 1
        break;
      case "TFTDriving":
        this.dataTable = 2
        break;
      case "Resistance":
        this.dataTable = 3
        break;
      case "OTP":
        this.dataTable = 4
        break;
      case "OTPFinal":
        this.dataTable = 5
        break;
      default:
        break;
    }
    // console.log(e);

  }


  //TODO show dave if have
  filterMaster() {
    this.onHide = []
    let ProductSpec = this.MasterProductSpec?.find(e => e.model == this.model)
    let TFTDriving = this.MasterTFT?.find(e => e.model == this.model)
    let Resistance = this.MasterResis?.find(e => e.model == this.model)
    let otp = this.MasterOtp?.find(e => (e.model == this.model) && (e.name == "1st"))
    let otpFinal = this.MasterOtp?.find(e => (e.model == this.model) && (e.name == "Final"))
    ProductSpec ? this.onHide[0] = 1 : this.onHide[0] = 0
    TFTDriving ? this.onHide[1] = 1 : this.onHide[1] = 0
    Resistance ? this.onHide[2] = 1 : this.onHide[2] = 0
    otp ? this.onHide[3] = 1 : this.onHide[3] = 0
    otpFinal ? this.onHide[4] = 1 : this.onHide[4] = 0
    // console.log(this.onHide);
    // console.log("dataTable" , this.dataTable);
  }

  generateToken(n: number) {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var token = '';
    for (var i = 0; i < n; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
  }

  //TODO -----------ExportExcel-------------
  //TODO ExportExcel
  //TODO -------------------------------------
  ExportExcel() {
    ///claimStock-project

    // this.http.get('/assets/F5110.1 RGA.xlsx', { responseType: "arraybuffer" })
    this.http.get('assets/report product electrical space.xlsx', { responseType: "arraybuffer" })
      // this.http.get('http://127.0.0.1:80/mastereletrical/report product electrical space.xlsx', { responseType: "arraybuffer" })
      .subscribe(
        data => {
          // console.log(data);


          const workbook = new Workbook();
          const arrayBuffer = new Response(data).arrayBuffer();
          arrayBuffer.then((data) => {
            workbook.xlsx.load(data)
              .then(() => {
                const worksheet = workbook.getWorksheet(2);

                worksheet.getCell('C3').value = `${this.model}`;
                worksheet.getCell('C4').value = `${this.Datalist.pattern}`;

                // border(worksheet, 'G7', '000000', 'medium', 1, 1, 1, 1)
                for (const [index, item] of this.data.entries()) {
                  let cell = `B${index + 8}`
                  worksheet.getCell(cell).value = { 'richText': [{ 'text': `${item.name || ""}`, 'font': { 'bold': true, 'size': 16, 'name': 'Calibri' } }] };
                  border(worksheet, cell, '000000', 'medium', 0, 1, 1, 1)
                }
                for (const [index, item] of this.data.entries()) {
                  let cell = `C${index + 8}`
                  worksheet.getCell(cell).value = Number(item.min || 0);
                  alignment(worksheet, cell, 'middle', 'center')
                  border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                }
                for (const [index, item] of this.data.entries()) {
                  let cell = `D${index + 8}`
                  worksheet.getCell(cell).value = Number(item.typ || 0);
                  alignment(worksheet, cell, 'middle', 'center')
                  border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                }
                for (const [index, item] of this.data.entries()) {
                  let cell = `E${index + 8}`
                  worksheet.getCell(cell).value = Number(item.max || 0);
                  alignment(worksheet, cell, 'middle', 'center')
                  border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                }
                for (const [index, item] of this.data.entries()) {
                  let cell = `F${index + 8}`
                  worksheet.getCell(cell).value = Number(item.good || 0);
                  alignment(worksheet, cell, 'middle', 'center')
                  border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                }
                for (let i = 0; i < this.data[0].ng.length; i++) {
                  let key = ["G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U"]
                  let label = `${key[i]}${6}`
                  let label2 = `${key[i]}${7}`
                  // console.log(i);
                  worksheet.getCell(label).value = { 'richText': [{ 'text': 'NG/Test', 'font': { 'bold': true, 'size': 16, 'name': 'Calibri' } }] }
                  worksheet.getCell(label2).value = { 'richText': [{ 'text': `sample ${i + 1}`, 'font': { 'bold': true, 'size': 16, 'name': 'Calibri' } }] }
                  alignment(worksheet, label, 'middle', 'center')
                  alignment(worksheet, label2, 'middle', 'center')
                  border(worksheet, label, '000000', 'medium', 1, 0, 0, 1)
                  border(worksheet, label2, '000000', 'medium', 0, 0, 1, 1)
                  fill(worksheet, label, 'DDEBF7') //blue
                  fill(worksheet, label2, 'DDEBF7') //blue
                  for (const [index, item] of this.data.entries()) {
                    let cell = `${key[i]}${index + 8}`
                    if (item.ng[i].status == 1) {
                      if (item.ng[i].value == null) {
                        worksheet.getCell(cell).value = "-"
                        fill(worksheet, cell, 'FFFFFF') //while
                        alignment(worksheet, cell, 'middle', 'center')
                        border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                      } else {
                        worksheet.getCell(cell).value = Number(item.ng[i].value);
                        alignment(worksheet, cell, 'middle', 'center')
                        border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                        fill(worksheet, cell, 'a7ffbb') //green
                      }
                    } else {
                      if (item.ng[i].value == null) {
                        worksheet.getCell(cell).value = "-"
                        fill(worksheet, cell, 'FFFFFF') //while
                        alignment(worksheet, cell, 'middle', 'center')
                        border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                      } else {
                        worksheet.getCell(cell).value = Number(item.ng[i].value);
                        alignment(worksheet, cell, 'middle', 'center')
                        border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                        fill(worksheet, cell, 'ffa8b0') //rad
                      }
                    }
                  }
                }



                // fill(worksheet,'G7','F08080')
                // fill(worksheet,'G10','F08080')
                // set 1
                workbook.xlsx.writeBuffer().then((data: any) => {
                  // let date = formatDate(new Date(), 'YYYYMMdd_Hmmss', 'en-US')
                  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                  fs.saveAs(blob, `${this.model} Electrical Spec. and Value.xlsx`);
                });
              });
          });
        },
        error => {
          console.log(error);
        }
      );

    function fill(worksheet: any, cell: string, color: string) {
      worksheet.getCell(cell).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      };
    }
    function border(ws: any, cells: string, colors: string, styles: string, tops: any, lefts: any, bottoms: any, rights: any) {
      ws.getCell(cells).border = {
        top: tops ? { style: styles, color: { argb: colors } } : null,
        left: lefts ? { style: styles, color: { argb: colors } } : null,
        bottom: bottoms ? { style: styles, color: { argb: colors } } : null,
        right: rights ? { style: styles, color: { argb: colors } } : null
      };
    }
    function alignment(ws: any, cells: string, verticals: string, horizontals: string) {
      ws.getCell(cells).alignment = { vertical: verticals, horizontal: horizontals };
    }

  }







  // foo2(row,i){
  // console.log(row,i);
  // console.log(row.ng);
  // for (const iterator of object) {

  // }
  // if(row.ng[1].value==0) return 'myInputGreen'
  // return 'myInputRed'
  // }
  dropdown(i: any, j: any, x: any) {
    let max = document.getElementById(`drop${0}${j + 1}`)
    if (i < x.length - 1) {
      document.getElementById(`drop${i + 1}${j}`).focus();
    } else {
      if (max) {
        document.getElementById(`drop${0}${j + 1}`).focus();
      }
    }
  }

}

