import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'app/service/http.service';
import Swal from 'sweetalert2';
import { match } from 'assert';
import { element } from 'protractor';
import { Timeouts } from 'selenium-webdriver';
import { Workbook } from 'exceljs'
import * as fs from 'file-saver';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { interval, Subscription } from 'rxjs';
var FileSaver = require('file-saver');

@Component({
  selector: 'app-electrical-tft-driving',
  templateUrl: './electrical-tft-driving.component.html',
  styleUrls: ['./electrical-tft-driving.component.scss']
})
export class ElectricalTftDrivingComponent implements OnInit {
  LoadingPage: boolean;

  //TODO Var
  @Input() model: any
  @Input() dataMain : any
  @ViewChild('fileUpload') fileUpload!: ElementRef

  tempUpload: any[] = []
  getDataM: any
  errorValue: any
  onZoom: boolean
  dataUrl: any
  data: any
  idUrl: any
  editOn: boolean
  active: boolean
  listFile: any[] = []
  nameFile: any[] = []
  listDelete: any[] = []
  urlOld: any
  urlOldShow: any[] = []
  listFileName: any[] = []
  widthTable: any = 33.366666
  labelTft: any
  SelectPath: any
  pattern: any
  EmSize: any
  ButtonUpdate: any
  CheckFileOver: boolean = true
  Path: any
  joo: any[] = ["ngo", "ngg"]
  count: any[] = [0, 0, 0, 0]
  disableSub: boolean = true
  toggleBT: boolean = false;
  hidden: boolean = true;
  loading:boolean = false;
  xxx:any
  cashe: string;
  constructor(private api: HttpService, private http: HttpClient) { }

  //TODO init
  async ngOnInit(): Promise<void> {
    // this.hidden = false


    this.getDataM = await this.getData()
    this.data = this.getValueData()
    this.data = this.data.map((d: any) => {
      return {
        ...d,
        ng: [{ value: null, status: false }],
      }
    })
    document.documentElement.style.setProperty('--css_1', this.widthTable + 'em');
    document.documentElement.style.setProperty('--css_2', this.widthTable - 15 + 'em');
    document.documentElement.style.setProperty('--css_3', this.widthTable - 6 + 'em');
    for (const item of this.data) {
      item.err ? item.err : item.err = `0 %`
      // item.err ? item.err : item.err = 0
    }
    this.labelTft = {
      name: [
        "Part arrangement drawing",
        "Circuit diagram",
      ]
    }
    this.showEdit(false)
    this.urlPath()
    // console.log(this.data);
  }

  onLoad() {
  }

  async showEdit(e: boolean) {
    // console.log(this.data);

    this.editOn = e
    let b = await this.getUrlid(this.model)
    if (b) {
      this.urlOld = {
        PartDrawing: b.PartDrawing,
        CircuitDiagram: b.CircuitDiagram,
      }
    }

    let PartDrawing = []
    let CircuitDiagram = []
    let data
    if (this.urlOld) {
      // console.log(this.urlOld);

      for (const iterator of this.urlOld.PartDrawing) {
        PartDrawing.push(iterator.split("TFT/")[1])
      }
      for (const iterator of this.urlOld.CircuitDiagram) {
        CircuitDiagram.push(iterator.split("TFT/")[1])
      }
    }
    data = {
      PartDrawing: PartDrawing,
      CircuitDiagram: CircuitDiagram,
    }
    if (this.SelectPath == "Part arrangement drawing") {
      this.urlOldShow = data.PartDrawing
      this.urlOldShow = this.urlOldShow.map(e => ({ name: e }))
      // console.log(this.urlOldShow.length);
      this.count[0] = this.urlOldShow.length
      this.count[1] = this.urlOldShow.length
    }
    if (this.SelectPath == "Circuit diagram") {
      this.urlOldShow = data.CircuitDiagram
      this.urlOldShow = this.urlOldShow.map(e => ({ name: e }))
      // console.log(this.urlOldShow.length);
      this.count[0] = this.urlOldShow.length
      this.count[1] = this.urlOldShow.length
    }
    // console.log(this.urlOld);
    // console.log(this.tempUpload);

  }
  // editOn

  //TODO getValueData
  getValueData() {
    const data = this.getDataM.find(e => e.model == this.model)
    if (data) {
      this.pattern = data.pattern
      return data.value
    }
  }

  //TODO getDataMaster
  getData() {
    const data = this.api.getMasterTFT().toPromise()
    if (data) {

      return data
    }
  }




  async getUrlid(model: any) {
    const data = await this.api.getMasterTFT().toPromise()
    if (data) {
      // console.log(data);
      const item = await data.find(e => e.model == model)
      // console.log(item);
      return item

    }
  }
  setErrorValue() {
    for (const item of this.data) {
      item.err = `${this.errorValue} %`
    }
    // this.cal()
    for (const item of this.data) {
      for (let index = 0; index < item.ng.length; index++) {
        this.calculator(item, index)
      }
    }
    this.errorValue = null
  }

  calculator(e: any, i: any) {
    let swap = Number(e.err.split("%")[0])
    let vat = (e.good * (swap / 100))
    let min = e.good - vat
    let max = e.good + vat
    // console.log(min,max);
    if (e.ng[i].value != null && min <= e.ng[i].value && e.ng[i].value <= max) {
      e.ng[i].status = true
    }
    else {
      e.ng[i].status = false
    }
  }

  //TODO calculator
  cal(e :any) {
    e.err = `${e.err} %`
    for (const item of this.data) {
      let swapData = Number(item.err.split("%")[0])
      // console.log(item);
      for (const [i, iterator] of item.ng.entries()) {
        // console.log(iterator);
        let vat = (item.good * (swapData / 100))
        let min = item.good - vat
        let max = item.good + vat
        // console.log(min,max);


        if (item.ng[i].value != null && min <= item.ng[i].value && item.ng[i].value <= max) {
          item.ng[i].status = true
        }
        else {
          item.ng[i].status = false
        }
      }
    }
    this.cashe = e.err
  }
  // row.err


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

  //TODO cutNameUrl
  SplitNameFile(DataOld: any[]) {
    let DataNew: any[] = []
    // console.log(typeof DataOld);
    // console.log(DataOld);

    if (DataOld.length > 0) {
      for (const item of DataOld) {
        let items = item.split("/")
        DataNew.push({ name: items[items.length - 1] })
      }
      return DataNew
      // console.log(DataNew);
      // http://127.0.0.1:80/mastereletrical/TFT/3001-rPM.png
      // to
      // { name : 3001--rPm.png }
    }
  }

  //TODO submit -----------------------
  async submit() {
    Swal.fire({
      title: 'Do you want to update data ?',
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //---start---
        let resUpload = []
        let sendData
        let PartD, CircuitD
        let CheckHave = await this.getUrlid(this.model)
        if (this.model) {
          if (this.tempUpload.length > 0) {
            const formData = await this.addFormData(this.tempUpload, this.model)
            resUpload = await this.api.uploadImage(formData).toPromise()
          }
          this.SelectPath == "Part arrangement drawing" ? PartD = this.urlOld?.PartDrawing.concat(resUpload) : PartD = undefined
          this.SelectPath == "Circuit diagram" ? CircuitD = this.urlOld?.CircuitDiagram.concat(resUpload) : CircuitD = undefined
          sendData = {
            model: this.model,
            PartDrawing: PartD,
            CircuitDiagram: CircuitD,
            delete: this.listDelete
          }
          const sandDataForm = await this.api.putDataTFT(CheckHave._id, sendData).toPromise()
          this.tempUpload = []
          this.temp = []
          this.listDelete = []
          this.toggleBT = false
          this.showEdit(false)
        }
        //---end---
        setTimeout(() => {
          Swal.fire('Success', '', 'success')
        }, 200);
      }
    })





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
        this.temp = this.temp.filter((f: any) => f != file);
        this.urlOld.PartDrawing = this.urlOld.PartDrawing.filter((f: any) => f.split("TFT/")[1] != file.name);
        this.urlOld.CircuitDiagram = this.urlOld.CircuitDiagram.filter((f: any) => f.split("TFT/")[1] != file.name);
        this.urlOldShow = this.urlOldShow.filter((f: any) => f != file);
        this.listDelete.push(file)
        this.checkSizeFile()
        setTimeout(() => {
          Swal.fire('Success', '', 'success')
          this.count[1] = this.urlOldShow.length
          this.count[2] = this.tempUpload.length
          this.BTSubmitCheck()
        }, 200);
      }
    })
  }
  //---------------------------------CheckSizeFile-----------------------------------------//
  //TODO CheckSizeFile

  clsImage() {
    this.temp = []
    this.tempUpload = []
    this.BTSubmitCheck()
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


  //---------------------------------Token-----------------------------------------//

  addFormData(files: any, controlNo: any) {
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
    function generateToken(n: number) {
      var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var token = '';
      for (var i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
      }
      return token;
    }
  }


  //TODO addInput
  addInput() {
    this.widthTable = this.widthTable + 6.135
    document.documentElement.style.setProperty('--css_1', this.widthTable + 'em');
    document.documentElement.style.setProperty('--css_2', this.widthTable - 15 + 'em');
    document.documentElement.style.setProperty('--css_3', this.widthTable - 6.135 + 'em');
    this.data = this.data.map((d: any) => {
      d.ng.push({ value: null, status: false })
      return {
        ...d,
      }
    })
  }

  //TODO delInput
  delInput() {
    this.widthTable = this.widthTable - 6.135
    document.documentElement.style.setProperty('--css_1', this.widthTable + 'em');
    document.documentElement.style.setProperty('--css_2', this.widthTable - 15 + 'em');
    document.documentElement.style.setProperty('--css_3', this.widthTable - 6.135 + 'em');
    this.data = this.data.map((d: any) => {
      // console.log(d);
      d.ng.pop()
      return {
        ...d,
      }
    })
  }

  //TODO -----------ExportExcel-------------
  //TODO ExportExcel
  //TODO -------------------------------------
  ExportExcel() {
    ///claimStock-project

    // this.http.get('/assets/F5110.1 RGA.xlsx', { responseType: "arraybuffer" })
    this.http.get('assets/report tft driving voltage.xlsx', { responseType: "arraybuffer" })
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
                worksheet.getCell('C4').value = `${this.pattern}`;

                // border(worksheet, 'G7', '000000', 'medium', 1, 1, 1, 1)
                for (const [index, item] of this.data.entries()) {
                  let cell = `B${index + 8}`
                  worksheet.getCell(cell).value = { 'richText': [{ 'text': `${item.measure || ""}`, 'font': { 'bold': true, 'size': 16, 'name': 'Calibri' } }] };
                  border(worksheet, cell, '000000', 'medium', 0, 1, 1, 1)
                }
                for (const [index, item] of this.data.entries()) {
                  let cell = `C${index + 8}`
                  worksheet.getCell(cell).value = item.name || 0
                  alignment(worksheet, cell, 'middle', 'center')
                  border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                }
                for (const [index, item] of this.data.entries()) {
                  let cell = `D${index + 8}`
                  worksheet.getCell(cell).value = Number(item.good || 0);
                  alignment(worksheet, cell, 'middle', 'center')
                  border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                }
                for (const [index, item] of this.data.entries()) {
                  let cell = `E${index + 8}`
                  worksheet.getCell(cell).value = item.err
                  alignment(worksheet, cell, 'middle', 'center')
                  border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                }
                for (let i = 0; i < this.data[0].ng.length; i++) {
                  let key = ["F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U"]
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



                workbook.xlsx.writeBuffer().then((data: any) => {
                  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                  fs.saveAs(blob, `${this.model} TFT.xlsx`);
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
    function generateToken(n: number) {
      var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var token = '';
      for (var i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
      }
      return token;
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
    // console.log(this.CheckFileOver);

  }

  async urlPath() {
    const url = await this.api.getPath().toPromise()
    this.Path = `${url.split("Outsource")[0]}mastereletrical/TFT/`
    // console.log(this.Path);
  }

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

  // testload: any

  async downloadImageOnly(file: any) {
    // let value = { name: "3001-jU6.png" }
    const data = await this.api.getBASE64(file).toPromise()
    // alert(data)
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
  // download(filename, text) {

  BTC() {
    if (this.toggleBT == true) {
      this.toggleBT = false
    } else {
      this.toggleBT = true
    }
  }

  loading_data(){
    if (!this.data) {
        this.loading = true
    }else{
      setTimeout(() => {
        this.loading = false
        this.hidden = false
      }, 100);
    }
    // this.toggleBT = false
    // console.log("sas");

  }

  returnInput(e :any){
    let goo = document.getElementById(`${e}`) as HTMLInputElement
    goo.value = this.cashe
  }


  clearInput(e :any){
    let doo = e.split("%")[0]
    this.cashe = `${doo}%`
    // console.log(this.cashe);

  }



}
