import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from 'app/service/http.service';
import * as fs from 'file-saver';
import Swal from 'sweetalert2';
import { Workbook } from 'exceljs'
type AOA = any[][];

@Component({
  selector: 'app-electrical-otp',
  templateUrl: './electrical-otp.component.html',
  styleUrls: ['./electrical-otp.component.scss']
})
export class ElectricalOtpComponent implements OnInit {

  LoadingPage: boolean;
  //TODO Var
  @Input() model: any
  @Input() dataMain: any
  @Input() dataTable: any
  data: any
  inputData: any[] = []
  fileContent: any = '';


  constructor(private api: HttpService, private http: HttpClient) { }


  ngOnInit(): void {
    this.getDataOtp()
  }


  async getDataOtp() {
    this.data = await this.api.getMasterOTP().toPromise()
    if (this.dataTable == 4) {
      let data = this.data.find(e => (e.model == this.model) && (e.name == '1st'))
      this.data = data.value
    } else {
      let data = this.data.find(e => (e.model == this.model) && (e.name == 'Final'))
      this.data = data.value
    }

    for (const item of this.data) {
      item.data = item.data.map((d) => {
        return {
          ...d,
          ng: [{ value: null, status: false }]
        }
      })
    }
  }

  addInput() { }
  delInput() { }

  readFileText(e: any) {
    const input = e.target;
    const reader = new FileReader();
    let data: any[] = []
    let endData: any[] = []
    reader.onload = (e: any) => {
      const text = reader.result;
      const regex = /data:/i;
      const found = text.toString().match(regex);
      data.push(text)
      // console.log(text.split(" ")[0]);
      if (found) {
        data = data[0].split(",\nOTP")
        for (const item of data) {
          let too = item.split("data: ")[1]
          let foo = too.split(",")
          endData.push(foo)
        }
        if (endData[endData.length - 1].length == 9) {
          endData[endData.length - 1].splice(8, 1)
        }
      } else {
        data = data[0].split(" \r\n")
        for (const item of data) {
          let foo = item.split(" ")
          endData.push(foo)

        }
        if (endData[endData.length - 1].length < 8) {
          endData.splice(endData.length - 1, 1)
        }
      }



      // console.log(endData[endData.length - 1].splice(8, 1));


      this.inputData = endData
      for (const [i, items] of this.data.entries()) {
        for (const [j, clear] of items.data.entries()) {
          this.data[i].data[j].ng[0].value = null
        }
      }
      for (const [i, dataset] of this.inputData.entries()) {
        for (const [j, item] of dataset.entries()) {
          this.data[i].data[j].ng[0].value = item
          if (this.data[i].data[j].good == item) {
            this.data[i].data[j].ng[0].status = true
          } else {
            this.data[i].data[j].ng[0].status = false
          }
        }
      }
    };

    reader.readAsText(input.files[0]);

    remove()
    function remove() {
      let d = document.getElementById(`files`) as HTMLInputElement
      d.value = ""
    }

  }

  ExportExcel() {
    this.http.get('assets/report otp database.xlsx', { responseType: "arraybuffer" })
      // this.http.get('http://localhost:4200/mastereletrical/report product electrical space.xlsx', { responseType: "arraybuffer" })
      .subscribe(
        data => {
          // console.log(data);
          const workbook = new Workbook();
          const arrayBuffer = new Response(data).arrayBuffer();
          arrayBuffer.then((data) => {
            workbook.xlsx.load(data)
              .then(() => {
                let ABC = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
                  "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ"
                  , "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ"]
                // console.log(ABC.split(""));
                const worksheet = workbook.getWorksheet(2);
                if (this.dataTable == 4) {
                  worksheet.getCell('C2').value = `(1st FCT)`;
                  alignment(worksheet, 'C2', 'middle', 'center')
                  fill(worksheet, 'C2', 'ff0000') //red
                }
                if (this.dataTable == 5) {
                  worksheet.getCell('C2').value = `(Final FCT)`;
                  alignment(worksheet, 'C2', 'middle', 'center')
                  fill(worksheet, 'C2', 'ff0000') //red
                }



                worksheet.getCell('C4').value = `${this.model}`;
                worksheet.getCell('D4').value = `${this.dataMain?.size ? this.dataMain?.size : ""}`;
                worksheet.getCell('E4').value = `${this.dataMain?.customer ? this.dataMain?.customer : ""}`;

                for (const [i, item] of this.data.entries()) {
                  for (const [j, data] of item.data.entries()) {
                    let cell = `${ABC[j + 1]}${i + 9}`
                    worksheet.getCell(cell).value = data.ng[0].value
                    alignment(worksheet, cell, 'middle', 'center')
                    border(worksheet, cell, '000000', 'medium', 0, 1, 1, 1)
                    if (data.ng[0].status == true && data.ng[0].value != null) {
                      // fill(worksheet, cell, 'a7ffbb') //green
                    }
                    if (data.ng[0].status == false && data.ng[0].value != null) {
                      fill(worksheet, cell, 'ffff00') //yallow
                    }

                  }
                }


                for (const [i, item] of this.data.entries()) {
                  for (const [j, data] of item.data.entries()) {
                    let cell = `${ABC[j + 10]}${i + 9}`
                    worksheet.getCell(cell).value = data.good
                    alignment(worksheet, cell, 'middle', 'center')
                    border(worksheet, cell, '000000', 'medium', 0, 1, 1, 1)
                    if (i % 2) {
                      // fill(worksheet, cell, 'E2EFDA')
                    }
                  }
                }


                workbook.xlsx.writeBuffer().then((data: any) => {
                  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                  if (this.dataTable == 4) {
                    fs.saveAs(blob, `${this.model} OTP_1st.xlsx`);
                  }
                  if (this.dataTable == 5) {
                    fs.saveAs(blob, `${this.model} OTP_Final.xlsx`);
                  }


                });
              });
          });
        },
        error => {
          console.log(error);
        }
      );


    function Bold(str: string) {
      return { 'richText': [{ 'text': str, 'font': { 'bold': true, 'size': 16, 'name': 'Calibri' } }] };
    }

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
    function generateToken(n: number) {
      var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var token = '';
      for (var i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
      }
      return token;
    }
  }

  cal(e: any, row: any) {
    // e.value
    if (e.value == row.good && e.value != null) {
      e.status = true
    }
    if (e.value != row.good && e.value != null) {
      e.status = false
    }
  }


}
