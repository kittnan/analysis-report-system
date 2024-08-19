import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'app/service/http.service';
import Swal from 'sweetalert2';
import { Workbook } from 'exceljs'
import * as fs from 'file-saver';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { allowedNodeEnvironmentFlags } from 'process';
import * as XLSX from 'xlsx';
type AOA = any[][];

@Component({
  selector: 'app-electrical-resistance',
  templateUrl: './electrical-resistance.component.html',
  styleUrls: ['./electrical-resistance.component.scss']
})
export class ElectricalResistanceComponent implements OnInit {
  LoadingPage: boolean;
  //TODO Var
  @Input() model: any
  @Input() dataMain: any
  @ViewChild('fileUpload') fileUpload!: ElementRef


  // var
  data: any
  cashe: any
  dataGND: any
  dataVCC: any
  pattern: any
  urlOldUse: any
  errorValue: any
  widthTable: any = 24
  urlOldShow: any;
  EmSize: number;
  toggleBT: Boolean = false
  disableSub: boolean = true;
  CheckFileOver: boolean;
  count: any[] = [0, 0, 0, 0];
  tempUpload: any[] = [];
  listDelete: any[] = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';

  constructor(private api: HttpService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getDataResistance()
    this.getUrlOld()
    document.documentElement.style.setProperty('--css_1', this.widthTable + 'rem');
    document.documentElement.style.setProperty('--css_2', this.widthTable + 8 + 'rem');
    document.documentElement.style.setProperty('--css_4', 'grab');
  }

  async getUrlOld() {
    let url = await this.getUrlid(this.model)
    this.urlOldUse = url.urlAssignment
    // console.log(this.urlOldUse);

    this.urlOldShow = url.urlAssignment.map((d: any) => {
      // console.log(d);
      return {
        name: d.split("Resistance/")[1]
      }
    })
    this.count[0] = this.urlOldShow.length
    // console.log(this.data);
  }

  async getDataResistance() {
    let data = await this.api.getMasterResis().toPromise()
    let item = data.find(e => e.model == this.model)
    let doo = item.value
    for (const item of doo) {
      for (const value of item.list) {
        if (value.Good && value.Good != 'infinity') {
          value.Good = value.Good.toFixed(2)
        }
        if (value.Good == 'infinity') {
          value.Good = "∞"
        }
      }
    }

    // console.log(item);
    for (const item of doo) {
      item.list = item.list.map((d: any) => {
        return {
          ...d,
          ng: [{ value: null, status: false }],
          err: `0 %`
        }
      })
    }
    // TODO แก้ไขบางตัว
    // let test001 = doo.map((d: any) => {
    //   return {
    //     ...d,...d[0]
    //   }
    // })
    // console.log(test001);
    this.data = doo
  }

  //TODO addInput
  addInput() {
    this.widthTable = this.widthTable + 6
    document.documentElement.style.setProperty('--css_1', this.widthTable + 'rem');
    document.documentElement.style.setProperty('--css_2', this.widthTable + 8 + 'rem');
    for (const item of this.data) {
      item.list = item.list.map((d: any) => {
        d.ng.push({ value: null, status: false })
        return {
          ...d,
        }
      })
    }
  }

  //TODO delInput
  delInput() {
    this.widthTable = this.widthTable - 6
    document.documentElement.style.setProperty('--css_1', this.widthTable + 'rem');
    document.documentElement.style.setProperty('--css_2', this.widthTable + 8 + 'rem');
    for (const item of this.data) {
      item.list = item.list.map((d: any) => {
        d.ng.pop()
        return {
          ...d,
        }
      })
    }
  }

  setErrorValue() {
    for (const item of this.data) {
      for (const setValue of item.list) {
        setValue.err = `${item.err} %`
        for (let index = 0; index < setValue.ng.length; index++) {
          this.calculator(setValue, index)
        }
        // console.log(setValue.err);
        if (setValue.err == `null %` || setValue.err == `undefined %`) {
          // console.log("aaa");
          setValue.err = `0 %`
        }
      }
    }
    // console.log(this.data);

  }

  //TODO calc
  calculator(e: any, i: any) {
    // console.log(e,i);

    let dataErr = e.err.split("%")[0]

    if (Number(e.Good) || e.Good == 0) {
      let vat = (Number(e.Good) * (Number(dataErr) / 100))
      let min = Number(e.Good) - vat
      let max = Number(e.Good) + vat
      // console.log(min , max , e.Good );


      if (e.ng[i].value != null && min <= e.ng[i].value && e.ng[i].value <= max) {
        e.ng[i].status = true
      }
      else {
        e.ng[i].status = false
      }

    } else {
      if (e.ng[i].value == "∞") {
        e.ng[i].status = true
      } else {
        e.ng[i].status = false
      }
    }

    if (e.ng[i].value == "" && e.ng[i].value != "0") {
      e.ng[i].value = null
    }

    // console.log(e.ng[i].value);

  }

  //---------------------------------Duplicate-----------------------------------------//
  temp: any[] = []
  duplicate(x: any) {
    for (const item of x) {
      const data = this.temp.find(e => e.name == item.name)
      if (!data) {
        this.temp.push(item)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'File duplicate',
          text: 'Try Again'
        })
      }
    }
    return this.temp
  }


  //---------------------------------UploadFile-----------------------------------------//
  //TODO Upload
  upload(e: any) {
    const data: any[] = []
    const files = e.target.files
    data.push(...files)
    this.fileUpload.nativeElement.value = ""
    this.tempUpload = this.duplicate(data)
    this.temp = [...this.tempUpload]
    this.checkSizeFile()
    this.count[2] = this.tempUpload.length
    this.BTSubmitCheck()
  }

  //---------------------------------DeleteFile----------------------------------------//
  onClickDel(file: File) {
    Swal.fire({
      title: `Do you want to delete ${file.name}?`,
      icon: 'warning',
      showCancelButton: true
    }).then(ans => {
      if (ans.isConfirmed) {
        this.tempUpload = this.tempUpload.filter((f: any) => f != file);
        this.urlOldShow = this.urlOldShow.filter((f: any) => f != file);
        this.temp = this.temp.filter((f: any) => f != file);
        this.listDelete.push(file)
        this.checkSizeFile()
        this.count[1] = this.urlOldShow.length
        this.count[2] = this.tempUpload.length
        this.BTSubmitCheck()
        setTimeout(() => {
          Swal.fire('Success', '', 'success')
        }, 200);
      }
    })

  }
  //---------------------------------CheckSizeFile-----------------------------------------//
  //TODO CheckSizeFile

  deleteArray(array: any, index: any) {
    array.splice(index, 1)
  }

  clsImage() {
    this.temp = []
    this.tempUpload = []
    //  this.BTSubmitCheck()
  }

  //TODO CheckSizeFile
  checkSizeFile() {
    let dateSize = 0
    if (this.tempUpload.length == 0) {
      this.EmSize = 0
      this.CheckFileOver = true
    }
    for (const item of this.tempUpload) {
      dateSize = dateSize + item.size
      this.EmSize = dateSize

      if (this.EmSize / 1048576 > 30) {
        Swal.fire({
          icon: 'error',
          title: 'Limit File Size 30Mb',
          text: 'Try Again',
        })
      }

    }

    // this.EmSize = dateSize
    // console.log(this.EmSize);
    // console.log(this.tempUpload);
    // console.log(this.CheckFileOver);
  }

  //TODO submit
  async submit() {
    Swal.fire({
      title: 'Do you want to update data ?',
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        let resUpload = []
        let sendData
        let CheckHave = await this.getUrlid(this.model)
        if (this.model) {
          if (this.tempUpload.length > 0) {
            const formData = await addFormData(this.tempUpload, this.model)
            resUpload = await this.api.uploadResis(formData).toPromise()
          }
          let urlAll = this.urlOldUse.concat(resUpload)
          sendData = {
            model: this.model,
            urlAssignment: urlAll,
            delete: this.listDelete
          }

          const sandDataForm = await this.api.putDataResis(CheckHave._id, sendData).toPromise()
          this.tempUpload = []
          this.temp = []
          this.listDelete = []
          this.getUrlOld()
          this.toggleBT = false
        }
        //code end
        setTimeout(() => {
          Swal.fire('Success', '', 'success')
        }, 200);
      }
    })





    //rename
    function addFormData(files: any, controlNo: any) {
      return new Promise(resolve => {
        const formData = new FormData()
        for (let i = 0; i < files.length; i++) {
          let type = files[i].name.split('.');
          type = type[type.length - 1]
          const newFileName = `${controlNo}-${generateToken(3)}.${type}`
          formData.append('File', files[i], newFileName)
          if (i + 1 === files.length) {
            resolve(formData)
          }
        }

      })
      //token
      function generateToken(n: number) {
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var token = '';
        for (var i = 0; i < n; i++) {
          token += chars[Math.floor(Math.random() * chars.length)];
        }
        return token;
      }
    }

  }


  async getUrlid(model: any) {
    const data = await this.api.getMasterResis().toPromise()
    if (data) {
      // console.log(data);
      const item = await data.find(e => e.model == model)
      // console.log(item);
      return item
    }
  }

  //TODO magnify
  magnify(imgID, zoom) {
    var img, glass, w, h, bw;
    img = document.getElementById(imgID);
    /*create magnifier glass:*/
    glass = document.createElement("DIV");
    glass.setAttribute("class", "img-magnifier-glass");
    /*insert magnifier glass:*/
    img.parentElement.insertBefore(glass, img);
    /*set background properties for the magnifier glass:*/
    glass.style.backgroundImage = "url('" + img.src + "')";
    glass.style.backgroundRepeat = "no-repeat";
    glass.style.backgroundSize =
      img.width * zoom + "px " + img.height * zoom + "px";
    bw = 3;
    w = glass.offsetWidth / 2;
    h = glass.offsetHeight / 2;
    /*execute a function when someone moves the magnifier glass over the image:*/
    glass.addEventListener("mousemove", moveMagnifier);
    img.addEventListener("mousemove", moveMagnifier);
    /*and also for touch screens:*/
    glass.addEventListener("touchmove", moveMagnifier);
    img.addEventListener("touchmove", moveMagnifier);
    function moveMagnifier(e) {
      var pos, x, y;
      /*prevent any other actions that may occur when moving over the image*/
      e.preventDefault();
      /*get the cursor's x and y positions:*/
      pos = getCursorPos(e);
      x = pos.x;
      y = pos.y;
      /*prevent the magnifier glass from being positioned outside the image:*/
      if (x > img.width - w / zoom) {
        x = img.width - w / zoom;
      }
      if (x < w / zoom) {
        x = w / zoom;
      }
      if (y > img.height - h / zoom) {
        y = img.height - h / zoom;
      }
      if (y < h / zoom) {
        y = h / zoom;
      }
      /*set the position of the magnifier glass:*/
      glass.style.left = 75 + x - w + "px";
      glass.style.top = -75 + y - h + "px";
      // console.log(glass.style.left ,glass.style.top);

      /*display what the magnifier glass "sees":*/
      glass.style.backgroundPosition =
        "-" + (x * zoom - w + bw) + "px -" + (y * zoom - h + bw) + "px";
    }
    function getCursorPos(e) {
      var a,
        x = 0,
        y = 0;
      e = e || window.event;
      /*get the x and y positions of the image:*/
      a = img.getBoundingClientRect();
      /*calculate the cursor's x and y coordinates, relative to the image:*/
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      // console.log("mouse",x, y );
      /*consider any page scrolling:*/
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      // console.log(x, y );

      return { x: x, y: y };

    }

  }

  //TODO magnify
  zoomOut() {
    var zooms = document.querySelectorAll(".img-magnifier-glass");
    for (var x = 0; x < zooms.length; x++) {
      zooms[x].parentNode.removeChild(zooms[x]);
    }
  }

  async downloadImageOnly(file: any) {
    const data = await this.api.getBASE64Resis(file).toPromise()
    downloadBase64File(data, file.name)
    function downloadBase64File(contentBase64, fileName) {
      const linkSource = `data:application/pdf;base64,${contentBase64}`;
      const downloadLink = document.createElement('a');
      document.body.appendChild(downloadLink);
      downloadLink.href = linkSource;
      downloadLink.target = '_self';
      downloadLink.download = fileName;
      downloadLink.click();
    }
  }


  BTSubmitCheck() {
    if ((this.count[0] == this.count[1]) && (this.count[2] == 0)) {
      // console.log("true");
      this.disableSub = true
    } else {
      this.disableSub = false
      // console.log("qwewqeqwewe");
    }
    // console.log(this.count);
  }

  BTC() {
    if (this.toggleBT == true) {
      this.toggleBT = false
    } else {
      this.toggleBT = true
    }
  }

  //TODO ExportExcel
  ExportExcel() {
    ///claimStock-project

    // this.http.get('assets/F5110.1 RGA.xlsx', { responseType: "arraybuffer" })
    this.http.get('assets/report resistance database.xlsx', { responseType: "arraybuffer" })
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
                worksheet.getCell('C3').value = `${this.model}`;
                worksheet.getCell('D3').value = `${this.dataMain?.size ? this.dataMain?.size : ""}`;
                worksheet.getCell('E3').value = `${this.dataMain?.customer ? this.dataMain?.customer : ""}`;

                // worksheet.getCell('D4').value = `${this.pattern}`;
                // console.log(`${ABC[1 + (0 * 5) + (0 * this.data[0].list[0].ng.length)]}6);
                // // border(worksheet, 'G7', '000000', 'medium', 1, 1, 1, 1)
                for (let index = 0; index < this.data.length; index++) {
                  if (index < this.data.length - 1) {


                    //header

                    worksheet.mergeCells(`${ABC[1 + (index * 5) + (index * this.data[0].list[0].ng.length)]}6:${ABC[1 + 3 + (index * 5) + (index * this.data[0].list[0].ng.length) + this.data[0].list[0].ng.length]}6`);
                    worksheet.getCell(`${ABC[1 + (index * 5) + (index * this.data[0].list[0].ng.length)]}6`).value = Bold(`Resistance reference with ${this.data[index].name} (k ꭥ)`)
                    border(worksheet, `${ABC[1 + (index * 5) + (index * this.data[0].list[0].ng.length)]}6`, '000000', 'medium', 1, 1, 1, 1)
                    fill(worksheet, `${ABC[1 + (index * 5) + (index * this.data[0].list[0].ng.length)]}6`, 'DDEBF7')
                    worksheet.getCell(`${ABC[1 + (index * (5 + this.data[0].list[0].ng.length))]}${7}`).value = Bold(`No.`)
                    worksheet.getCell(`${ABC[2 + (index * (5 + this.data[0].list[0].ng.length))]}${7}`).value = Bold(`Name`)
                    worksheet.getCell(`${ABC[3 + (index * (5 + this.data[0].list[0].ng.length))]}${7}`).value = Bold(`Good`)
                    worksheet.getCell(`${ABC[4 + (index * (5 + this.data[0].list[0].ng.length))]}${7}`).value = Bold(`Err`)


                    for (let i = 1; i < 5; i++) {
                      alignment(worksheet, `${ABC[i + (index * (5 + this.data[0].list[0].ng.length))]}${7}`, 'middle', 'center')
                      border(worksheet, `${ABC[i + (index * (5 + this.data[0].list[0].ng.length))]}${7}`, '000000', 'medium', 1, 1, 1, 1)
                      fill(worksheet, `${ABC[i + (index * (5 + this.data[0].list[0].ng.length))]}${7}`, 'DDEBF7')
                    }
                    alignment(worksheet, `${ABC[1 + (index * 5) + (index * this.data[0].list[0].ng.length)]}6`, 'middle', 'center')

                    for (const [j, ng] of this.data[0].list[0].ng.entries()) {
                      worksheet.getCell(`${ABC[j + 5 + (index * (5 + this.data[0].list[0].ng.length))]}${7}`).value = Bold(`NG sample ${j + 1}`)
                      alignment(worksheet, `${ABC[j + 5 + (index * (5 + this.data[0].list[0].ng.length))]}${7}`, 'middle', 'center')
                      border(worksheet, `${ABC[j + 5 + (index * (5 + this.data[0].list[0].ng.length))]}${7}`, '000000', 'medium', 1, 1, 1, 1)
                      fill(worksheet, `${ABC[j + 5 + (index * (5 + this.data[0].list[0].ng.length))]}${7}`, 'DDEBF7')
                    }


                    for (let i = 0; i < this.data[index].list.length; i++) {
                      let data = this.data[index].list[i]
                      //data
                      worksheet.getCell(`${ABC[1 + (index * (5 + data.ng.length))]}${i + 8}`).value = data.Number
                      worksheet.getCell(`${ABC[2 + (index * (5 + data.ng.length))]}${i + 8}`).value = data.Name
                      worksheet.getCell(`${ABC[3 + (index * (5 + data.ng.length))]}${i + 8}`).value = data.Good
                      worksheet.getCell(`${ABC[4 + (index * (5 + data.ng.length))]}${i + 8}`).value = `${data.err}`
                      if (i % 2) {
                        for (let x = 1; x < 5; x++) {
                          fill(worksheet, `${ABC[x + (index * (5 + data.ng.length))]}${i + 8}`, 'E2EFDA')
                        }
                      }

                      for (let x = 1; x < 5; x++) {
                        border(worksheet, `${ABC[x + (index * (5 + data.ng.length))]}${i + 8}`, '000000', 'thin', 0, 1, 1, 1)
                      }


                      for (const [j, ng] of data.ng.entries()) {
                        //data
                        let cell = `${ABC[j + 5 + (index * (5 + data.ng.length))]}${i + 8}`
                        worksheet.getCell(cell).value = ng.value
                        alignment(worksheet, cell, 'middle', 'right')
                        border(worksheet, cell, '000000', 'thin', 0, 1, 1, 1)
                        if (ng.status == 1) {
                          if (ng.value != null) {
                            fill(worksheet, cell, 'a7ffbb') //green
                          }
                        } else {
                          if (ng.value != null) {
                            fill(worksheet, cell, 'ffa8b0') //rad
                          } else {
                            worksheet.getCell(cell).value = "-"
                            fill(worksheet, cell, 'FFFFFF') //while
                          }
                        }
                      }
                      alignment(worksheet, `${ABC[1 + (index * (5 + data.ng.length))]}${i + 8}`, 'middle', 'center')
                      alignment(worksheet, `${ABC[2 + (index * (5 + data.ng.length))]}${i + 8}`, 'middle', 'center')
                      alignment(worksheet, `${ABC[3 + (index * (5 + data.ng.length))]}${i + 8}`, 'middle', 'right')
                      alignment(worksheet, `${ABC[4 + (index * (5 + data.ng.length))]}${i + 8}`, 'middle', 'center')
                    }
                  }

                  if (index == this.data.length - 1) {
                    //header
                    worksheet.mergeCells(`${ABC[1 + (index * 5) + (index * this.data[0].list[0].ng.length)]}6:${ABC[1 + 5 + (index * 5) + (index * this.data[0].list[0].ng.length) + this.data[0].list[0].ng.length]}6`);
                    worksheet.getCell(`${ABC[1 + (index * 5) + (index * this.data[0].list[0].ng.length)]}6`).value = Bold(`Resistance reference with between (k ꭥ)`)
                    worksheet.getCell(`${ABC[1 + (index * (5 + this.data[0].list[0].ng.length))]}${7}`).value = Bold("No.")
                    worksheet.getCell(`${ABC[2 + (index * (5 + this.data[0].list[0].ng.length))]}${7}`).value = Bold("No.")
                    worksheet.getCell(`${ABC[3 + (index * (5 + this.data[0].list[0].ng.length))]}${7}`).value = Bold("Name")
                    worksheet.getCell(`${ABC[4 + (index * (5 + this.data[0].list[0].ng.length))]}${7}`).value = Bold("Name")
                    worksheet.getCell(`${ABC[5 + (index * (5 + this.data[0].list[0].ng.length))]}${7}`).value = Bold("Good")
                    worksheet.getCell(`${ABC[6 + (index * (5 + this.data[0].list[0].ng.length))]}${7}`).value = Bold("Err")
                    border(worksheet, `${ABC[1 + (index * 5) + (index * this.data[0].list[0].ng.length)]}6`, '000000', 'medium', 1, 1, 1, 1)
                    fill(worksheet, `${ABC[1 + (index * 5) + (index * this.data[0].list[0].ng.length)]}6`, 'DDEBF7')

                    for (let i = 1; i < 7; i++) {
                      alignment(worksheet, `${ABC[i + (index * (5 + this.data[0].list[0].ng.length))]}${7}`, 'middle', 'center')
                      border(worksheet, `${ABC[i + (index * (5 + this.data[0].list[0].ng.length))]}${7}`, '000000', 'medium', 1, 1, 1, 1)
                      fill(worksheet, `${ABC[i + (index * (5 + this.data[0].list[0].ng.length))]}${7}`, 'DDEBF7')
                    }

                    alignment(worksheet, `${ABC[1 + (index * 5) + (index * this.data[0].list[0].ng.length)]}6`, 'middle', 'center')
                    for (const [j, ng] of this.data[0].list[0].ng.entries()) {
                      worksheet.getCell(`${ABC[j + 7 + (index * (5 + this.data[0].list[0].ng.length))]}${7}`).value = Bold(`NG sample ${j + 1}`)
                      alignment(worksheet, `${ABC[j + 7 + (index * (5 + this.data[0].list[0].ng.length))]}${7}`, 'middle', 'center')
                      border(worksheet, `${ABC[j + 7 + (index * (5 + this.data[0].list[0].ng.length))]}${7}`, '000000', 'medium', 1, 1, 1, 1)
                      fill(worksheet, `${ABC[j + 7 + (index * (5 + this.data[0].list[0].ng.length))]}${7}`, 'DDEBF7')
                    }
                    for (let i = 0; i < this.data[index].list.length; i++) {
                      let data = this.data[index].list[i]
                      worksheet.getCell(`${ABC[1 + (index * (5 + data.ng.length))]}${i + 8}`).value = data.Number_A
                      worksheet.getCell(`${ABC[2 + (index * (5 + data.ng.length))]}${i + 8}`).value = data.Number_B
                      worksheet.getCell(`${ABC[3 + (index * (5 + data.ng.length))]}${i + 8}`).value = data.Name_A
                      worksheet.getCell(`${ABC[4 + (index * (5 + data.ng.length))]}${i + 8}`).value = data.Name_B
                      worksheet.getCell(`${ABC[5 + (index * (5 + data.ng.length))]}${i + 8}`).value = data.Good
                      worksheet.getCell(`${ABC[6 + (index * (5 + data.ng.length))]}${i + 8}`).value = `${data.err}`

                      if (i % 2) {
                        for (let x = 1; x < 7; x++) {
                          fill(worksheet, `${ABC[x + (index * (5 + data.ng.length))]}${i + 8}`, 'E2EFDA')
                        }
                      }
                      for (let x = 1; x < 7; x++) {
                        border(worksheet, `${ABC[x + (index * (5 + data.ng.length))]}${i + 8}`, '000000', 'thin', 1, 1, 1, 1)
                      }

                      for (const [j, ng] of data.ng.entries()) {
                        let cell = `${ABC[j + 7 + (index * (5 + data.ng.length))]}${i + 8}`
                        worksheet.getCell(cell).value = ng.value
                        alignment(worksheet, cell, 'middle', 'right')
                        border(worksheet, cell, '000000', 'thin', 1, 1, 1, 1)
                        if (ng.status == 1) {
                          if (ng.value != null) {
                            fill(worksheet, cell, 'a7ffbb') //green
                          }
                        } else {
                          if (ng.value != null) {
                            fill(worksheet, cell, 'ffa8b0') //rad
                          } else {
                            worksheet.getCell(cell).value = "-"
                            fill(worksheet, cell, 'FFFFFF') //while
                          }
                        }
                      }
                      alignment(worksheet, `${ABC[1 + (index * (5 + data.ng.length))]}${i + 8}`, 'middle', 'center')
                      alignment(worksheet, `${ABC[2 + (index * (5 + data.ng.length))]}${i + 8}`, 'middle', 'center')
                      alignment(worksheet, `${ABC[3 + (index * (5 + data.ng.length))]}${i + 8}`, 'middle', 'center')
                      alignment(worksheet, `${ABC[4 + (index * (5 + data.ng.length))]}${i + 8}`, 'middle', 'center')
                      alignment(worksheet, `${ABC[5 + (index * (5 + data.ng.length))]}${i + 8}`, 'middle', 'right')
                      alignment(worksheet, `${ABC[6 + (index * (5 + data.ng.length))]}${i + 8}`, 'middle', 'center')
                    }
                  }
                }


                workbook.xlsx.writeBuffer().then((data: any) => {
                  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                  fs.saveAs(blob, `${this.model} Resistance.xlsx`);
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


  Drag(e: any) {
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    const ele = document.getElementById('container');
    ele.style.cursor = 'grabbing';
    document.documentElement.style.setProperty('--css_4', 'grabbing');
    pos = {
      // The current scroll
      left: ele.scrollLeft,
      top: ele.scrollTop,
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY,
    };


    const mouseMoveHandler = function (e) {

      // How far the mouse has been moved
      const dx = e.clientX - pos.x;
      const dy = e.clientY - pos.y;

      // Scroll the element
      ele.scrollTop = pos.top - dy;
      ele.scrollLeft = pos.left - dx;
      // ele.style.cursor = 'grabbing';


    };


    const mouseUpHandler = function () {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);


      ele.style.cursor = 'grab';
      document.documentElement.style.setProperty('--css_4', 'grab');
      ele.style.removeProperty('user-select');
    };


    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);

  }


  calAfterInput(data : any) {
    // console.log(data);
    data.err = `${data.err} %`
    for (const item of this.data) {
      for (const data of item.list) {
        for (let index = 0; index < data.ng.length; index++) {
          this.calculator(data, index)

        }
      }
    }
    this.cashe = data.err
  }

  returnInput(a,e){
    let goo = document.getElementById(`${a.name}${e}`) as HTMLInputElement
    goo.value = this.cashe
  }


  clearInput(e :any){
    let doo = e.split("%")[0]
    this.cashe = `${doo}%`
  }

  inputData(evt: any, index: any, names: any) {
    // console.log(index,names);

    const data: any[] = []
    // const files = e.target.files
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = async (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const files = evt.target.files
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      if (wsname == "Resistance") {
        const colExcel = 5
        let data = readData(ws)
        for (const [index, iterator] of data.entries()) {
          if (iterator && iterator != "∞") {
            data[index] = iterator.toFixed(2)
          }
        }
        // })
        // console.log(data);


        let too = this.data.find((e) => e.name == names)
        // console.log(too,name);
        for (const [i, item] of too.list.entries()) {
          item.ng[index - 1].value = null

          if (i < data.length) {
            item.ng[index - 1].value = data[i]
            this.calculator(item, index - 1)

          }
        }
      } else {
        Swal.fire('Data incompatibility !', '', 'error')
      }

      // console.log(this.data);

    };
    reader.readAsBinaryString(target.files[0]);
    remove()


    function readData(ws: any) {
      let data = []
      let dataExcel = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      for (let index = 3; index < dataExcel.length; index++) {
        if (dataExcel[index][3] != undefined) {
          data.push(dataExcel[index][3])
        }
      }
      // console.log(data);
      return data
    }

    function remove() {
      let d = document.getElementById(`files${index - 1}${names}`) as HTMLInputElement
      d.value = ""
    }
  }



}
