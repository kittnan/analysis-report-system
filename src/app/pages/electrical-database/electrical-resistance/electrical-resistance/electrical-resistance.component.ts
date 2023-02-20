import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'app/service/http.service';
import Swal from 'sweetalert2';
import { Workbook } from 'exceljs'
import * as fs from 'file-saver';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { allowedNodeEnvironmentFlags } from 'process';


@Component({
  selector: 'app-electrical-resistance',
  templateUrl: './electrical-resistance.component.html',
  styleUrls: ['./electrical-resistance.component.scss']
})
export class ElectricalResistanceComponent implements OnInit {
  LoadingPage: boolean;
  //TODO Var
  @Input() model: any
  @ViewChild('fileUpload') fileUpload!: ElementRef


  // var
  data: any
  dataGND: any
  dataVCC: any
  urlOldUse: any
  urlOldShow: any;
  EmSize: number;
  pattern: any
  toggleBT: Boolean = false
  disableSub: boolean = true;
  CheckFileOver: boolean;
  count: any[] = [0, 0, 0, 0];
  tempUpload: any[] = [];
  listDelete: any[] = [];
  constructor(private api: HttpService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getDataResistance()
    this.getUrlOld()

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
  }

  async getDataResistance() {
    let data = await this.api.getMasterResis().toPromise()
    let item = data.find(e => e.model == this.model)
    let doo = item.value
    // console.log(item);
    doo = doo.map((d: any) => {
      return {
        ...d,
        ng_1: [
          {
            value: null,
            status: false
          }
        ],
        ng_2: [
          {
            value: null,
            status: false
          }
        ],
        ng_3: [
          {
            value: null,
            status: false
          }
        ]
      }
    })
    this.pattern = item.pattern
    this.data = doo
    // console.log(this.data);



  }



  //TODO calc
  calculator(e: any, i: any, j: any) {
    let vat = (e.good * (5 / 100))
    let min = e.good - vat
    let max = e.good + vat

    if (j == 1) {
      if (e.ng_1[i].value != null && min <= e.ng_1[i].value && e.ng_1[i].value <= max) {
        e.ng_1[i].status = true
      }
      else {
        e.ng_1[i].status = false
      }
    }

    if (j == 2) {
      if (e.ng_2[i].value != null && min <= e.ng_2[i].value && e.ng_2[i].value <= max) {
        e.ng_2[i].status = true
      }
      else {
        e.ng_2[i].status = false
      }
    }

    if (j == 2) {
      if (e.ng_3[i].value != null && min <= e.ng_3[i].value && e.ng_3[i].value <= max) {
        e.ng_3[i].status = true
      }
      else {
        e.ng_3[i].status = false
      }
    }


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
          console.log(urlAll);

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

    // this.http.get('/assets/F5110.1 RGA.xlsx', { responseType: "arraybuffer" })
    this.http.get('http://localhost:4200/assets/report resistance database.xlsx', { responseType: "arraybuffer" })
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

                worksheet.getCell('D3').value = `${this.model}`;
                worksheet.getCell('D4').value = `${this.pattern}`;

                // border(worksheet, 'G7', '000000', 'medium', 1, 1, 1, 1)
                for (const [index, item] of this.data.entries()) {
                  let cell = `B${index + 8}`
                  // worksheet.getCell(cell).value = { 'richText': [{ 'text': `${item.number || ""}`, 'font': { 'bold': true, 'size': 16, 'name': 'Calibri' } }] };
                  worksheet.getCell(cell).value = item.number
                  alignment(worksheet, cell, 'middle', 'center')
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
                // for (const [index, item] of this.data.entries()) {
                //   let cell = `E${index + 8}`
                //   worksheet.getCell(cell).value = Number(item.err || 0);
                //   alignment(worksheet, cell, 'middle', 'center')
                //   border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                // }
                for (let i = 0; i < this.data[0].ng_1.length; i++) {
                  let key = ["E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U"]
                  // let label = `${key[i]}${6}`
                  // let label2 = `${key[i]}${7}`
                  // console.log(i);
                  // worksheet.getCell(label).value = { 'richText': [{ 'text': 'NG/Test', 'font': { 'bold': true, 'size': 16, 'name': 'Calibri' } }] }
                  // worksheet.getCell(label2).value = { 'richText': [{ 'text': `sample ${i + 1}`, 'font': { 'bold': true, 'size': 16, 'name': 'Calibri' } }] }
                  // alignment(worksheet, label, 'middle', 'center')
                  // alignment(worksheet, label2, 'middle', 'center')
                  // border(worksheet, label, '000000', 'medium', 1, 0, 0, 1)
                  // border(worksheet, label2, '000000', 'medium', 0, 0, 1, 1)
                  // fill(worksheet, label, 'DDEBF7') //blue
                  // fill(worksheet, label2, 'DDEBF7') //blue
                  for (const [index, item] of this.data.entries()) {
                    let cell = `${key[i]}${index + 8}`
                    if (item.ng_1[i].status == 1) {
                      if (item.ng_1[i].value == null) {
                        worksheet.getCell(cell).value = "-"
                        fill(worksheet, cell, 'FFFFFF') //while
                        alignment(worksheet, cell, 'middle', 'center')
                        border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                      } else {
                        worksheet.getCell(cell).value = Number(item.ng_1[i].value);
                        alignment(worksheet, cell, 'middle', 'center')
                        border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                        fill(worksheet, cell, 'a7ffbb') //green
                      }
                    } else {
                      if (item.ng_1[i].value == null) {
                        worksheet.getCell(cell).value = "-"
                        fill(worksheet, cell, 'FFFFFF') //while
                        alignment(worksheet, cell, 'middle', 'center')
                        border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                      } else {
                        worksheet.getCell(cell).value = Number(item.ng_1[i].value);
                        alignment(worksheet, cell, 'middle', 'center')
                        border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                        fill(worksheet, cell, 'ffa8b0') //rad
                      }
                    }
                  }
                }
                /// ----------------------------------------------------------------------------------- ///
                // border(worksheet, 'G7', '000000', 'medium', 1, 1, 1, 1)
                for (const [index, item] of this.data.entries()) {
                  let cell = `G${index + 8}`
                  // worksheet.getCell(cell).value = { 'richText': [{ 'text': `${item.number || ""}`, 'font': { 'bold': true, 'size': 16, 'name': 'Calibri' } }] };
                  worksheet.getCell(cell).value = item.number
                  alignment(worksheet, cell, 'middle', 'center')
                  border(worksheet, cell, '000000', 'medium', 0, 1, 1, 1)
                }
                for (const [index, item] of this.data.entries()) {
                  let cell = `H${index + 8}`
                  worksheet.getCell(cell).value = item.name || 0
                  alignment(worksheet, cell, 'middle', 'center')
                  border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                }
                for (const [index, item] of this.data.entries()) {
                  let cell = `I${index + 8}`
                  worksheet.getCell(cell).value = Number(item.good || 0);
                  alignment(worksheet, cell, 'middle', 'center')
                  border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                }
                // for (const [index, item] of this.data.entries()) {
                //   let cell = `E${index + 8}`
                //   worksheet.getCell(cell).value = Number(item.err || 0);
                //   alignment(worksheet, cell, 'middle', 'center')
                //   border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                // }

                for (let i = 0; i < this.data[0].ng_2.length; i++) {
                  let key = ["J"]
                  // let label = `${key[i]}${6}`
                  // let label2 = `${key[i]}${7}`
                  // console.log(i);
                  // worksheet.getCell(label).value = { 'richText': [{ 'text': 'NG/Test', 'font': { 'bold': true, 'size': 16, 'name': 'Calibri' } }] }
                  // worksheet.getCell(label2).value = { 'richText': [{ 'text': `sample ${i + 1}`, 'font': { 'bold': true, 'size': 16, 'name': 'Calibri' } }] }
                  // alignment(worksheet, label, 'middle', 'center')
                  // alignment(worksheet, label2, 'middle', 'center')
                  // border(worksheet, label, '000000', 'medium', 1, 0, 0, 1)
                  // border(worksheet, label2, '000000', 'medium', 0, 0, 1, 1)
                  // fill(worksheet, label, 'DDEBF7') //blue
                  // fill(worksheet, label2, 'DDEBF7') //blue
                  for (const [index, item] of this.data.entries()) {
                    let cell = `${key[i]}${index + 8}`
                    if (item.ng_2[i].status == 1) {
                      if (item.ng_2[i].value == null) {
                        worksheet.getCell(cell).value = "-"
                        fill(worksheet, cell, 'FFFFFF') //while
                        alignment(worksheet, cell, 'middle', 'center')
                        border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                      } else {
                        worksheet.getCell(cell).value = Number(item.ng_2[i].value);
                        alignment(worksheet, cell, 'middle', 'center')
                        border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                        fill(worksheet, cell, 'a7ffbb') //green
                      }
                    } else {
                      if (item.ng_2[i].value == null) {
                        worksheet.getCell(cell).value = "-"
                        fill(worksheet, cell, 'FFFFFF') //while
                        alignment(worksheet, cell, 'middle', 'center')
                        border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                      } else {
                        worksheet.getCell(cell).value = Number(item.ng_2[i].value);
                        alignment(worksheet, cell, 'middle', 'center')
                        border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                        fill(worksheet, cell, 'ffa8b0') //rad
                      }
                    }
                  }
                }

                /// ----------------------------------------------------------------------------------- ///
                // border(worksheet, 'G7', '000000', 'medium', 1, 1, 1, 1)


                for (const [index, item] of this.data.entries()) {
                  if (index < this.data.length - 1) {
                    let cell = `L${index + 8}`
                    // worksheet.getCell(cell).value = { 'richText': [{ 'text': `${item.number || ""}`, 'font': { 'bold': true, 'size': 16, 'name': 'Calibri' } }] };
                    worksheet.getCell(cell).value = item.number
                    alignment(worksheet, cell, 'middle', 'center')
                    border(worksheet, cell, '000000', 'medium', 0, 1, 1, 1)
                  }
                }
                for (const [index, item] of this.data.entries()) {
                  if (index < this.data.length - 1) {
                    let cell = `M${index + 8}`
                    // worksheet.getCell(cell).value = { 'richText': [{ 'text': `${item.number || ""}`, 'font': { 'bold': true, 'size': 16, 'name': 'Calibri' } }] };
                    worksheet.getCell(cell).value = this.data[index + 1].number
                    alignment(worksheet, cell, 'middle', 'center')
                    border(worksheet, cell, '000000', 'medium', 0, 1, 1, 1)
                  }
                }
                for (const [index, item] of this.data.entries()) {
                  if (index < this.data.length - 1) {
                    let cell = `N${index + 8}`
                    worksheet.getCell(cell).value = item.name || 0
                    alignment(worksheet, cell, 'middle', 'center')
                    border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                  }
                }
                for (const [index, item] of this.data.entries()) {
                  if (index < this.data.length - 1) {
                    let cell = `O${index + 8}`
                    worksheet.getCell(cell).value = this.data[index + 1].name
                    alignment(worksheet, cell, 'middle', 'center')
                    border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                  }
                }
                for (const [index, item] of this.data.entries()) {
                  if (index < this.data.length - 1) {
                    let cell = `P${index + 8}`
                    worksheet.getCell(cell).value = Number(item.good || 0);
                    alignment(worksheet, cell, 'middle', 'center')
                    border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                  }
                }
                for (let i = 0; i < this.data[0].ng_3.length; i++) {
                  let key = ["Q"]
                  for (const [index, item] of this.data.entries()) {
                    let cell = `${key[i]}${index + 8}`
                    if (index < this.data.length - 1) {
                      if (item.ng_3[i].status == 1) {
                        if (item.ng_3[i].value == null) {
                          worksheet.getCell(cell).value = "-"
                          fill(worksheet, cell, 'FFFFFF') //while
                          alignment(worksheet, cell, 'middle', 'center')
                          border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                        } else {
                          worksheet.getCell(cell).value = Number(item.ng_3[i].value);
                          alignment(worksheet, cell, 'middle', 'center')
                          border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                          fill(worksheet, cell, 'a7ffbb') //green
                        }
                      } else {
                        if (item.ng_3[i].value == null) {
                          worksheet.getCell(cell).value = "-"
                          fill(worksheet, cell, 'FFFFFF') //while
                          alignment(worksheet, cell, 'middle', 'center')
                          border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                        } else {
                          worksheet.getCell(cell).value = Number(item.ng_3[i].value);
                          alignment(worksheet, cell, 'middle', 'center')
                          border(worksheet, cell, '000000', 'medium', 0, 0, 1, 1)
                          fill(worksheet, cell, 'ffa8b0') //rad
                        }
                      }
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

  dropdown(i: any, j: any, x: any ,y:any) {
    let max = document.getElementById(`${y}${0}${j + 1}`)
    if (i < x.length - 1) {
      document.getElementById(`${y}${i + 1}${j}`).focus();
    } else {
      if (max) {
        document.getElementById(`${y}${0}${j + 1}`).focus();
      }
    }
  }

  dropdown_1(i: any, j: any, x: any ,y:any) {
    let max = document.getElementById(`${y}${0}${j + 1}`)
    if (i < x.length - 2) {
      document.getElementById(`${y}${i + 1}${j}`).focus();
    } else {
      if (max) {
        document.getElementById(`${y}${0}${j + 1}`).focus();
      }
    }
  }
}
