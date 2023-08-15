import { Component, OnInit } from '@angular/core';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import { LogarithmicScale } from 'chart.js';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { LoggerFactory } from 'ag-grid-community';
type AOA = any[][];


@Component({
  selector: 'app-electrical-master',
  templateUrl: './electrical-master.component.html',
  styleUrls: ['./electrical-master.component.scss']
})
export class ElectricalMasterComponent implements OnInit {

  //-----------------------------------------------------------------------------------------------------//
  //TODO var
  LoadingPage: boolean;
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  data: any
  resUpload: any
  masterList: any
  dataOldTFT: any
  dataOldResis: any
  urls: any[] = []
  master: any[] = []
  fullData: any[] = []
  dataExcel: any[] = []
  RouterMenu: any[]
  model: any
  modelList: any
  modelsList: any
  OTP1ST: any
  ExportOTP: any
  showButtonImport: any[] = []
  IdModelNumber = environment.IdModelNumber
  constructor(private api: HttpService) { }
  //-----------------------------------------------------------------------------------------------------//
  //TODO init
  async ngOnInit(): Promise<void> {
    this.routes()
    this.master = [
      "Product Electrical Spec",
      "Resistance database",
      "TFT Driving voltage",
      "OTP Data (1st FCT)",
      "OTP Data (Final FCT)",
      "Reproduce (Short/Open Test)",
      "Reproduce (ESD Test)",
      "Reproduce (Other Test)",
    ]
    this.getUrlMaster()

    this.modelList = await this.api.GetListByIdMaster(this.IdModelNumber).toPromise()
  }


  //-----------------------------------------------------------------------------------------------------//
  //TODO routes
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

  //TODO get urlMaster
  async getUrlMaster() {
    const ProductSpec = await this.api.getMasterProductSpec().toPromise()
    const Resistance = await this.api.getMasterResis().toPromise()
    const TFT = await this.api.getMasterTFT().toPromise()

    ProductSpec.length > 0 ? this.urls.push(ProductSpec[ProductSpec.length - 1].urlMaster[0]) : undefined
    Resistance.length > 0 ? this.urls.push(Resistance[Resistance.length - 1].urlMaster[0]) : undefined
    TFT.length > 0 ? this.urls.push(TFT[TFT.length - 1].urlMaster[0]) : undefined


  }

  //TODO rename
  addFormData(files: any, controlNo: any) {
    return new Promise(resolve => {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        let type = files[i].name.split('.');
        type = type[type.length - 1]
        const newFileName = `${controlNo}`
        formData.append('File', files[i], newFileName)
        if (i + 1 === files.length) {
          resolve(formData)
        }
      }

    })
  }

  //TODO ImportMaster
  async ImportMaster(evt: any) {
    /* wire up file reader */

    Swal.fire({
      title: 'Do you want update data master ?',
      icon: 'question',
      showCancelButton: true,
    }).then(r => {
      if (r.isConfirmed) {
        //-----code-----
        const target: DataTransfer = <DataTransfer>(evt.target);

        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();

        reader.onload = async (e: any) => {
          /* read workbook */
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
          /* grab first sheet */

          const data: any[] = []
          const files = evt.target.files
          data.push(...files)
          this.ImportExcelList(evt, wb, data)

        };
        reader.readAsBinaryString(target.files[0]);
        //-----code-----

      }
      if (r.isDismissed) {
        remove()
        function remove() {
          let d = document.getElementById(`files`) as HTMLInputElement
          d.value = ""
        }
      }
    })
  }


  //TODO Excel
  ImportExcelList(evt: any, ws: any, data: any) {
    switch (this.masterList) {
      case this.master[0]:
        this.ElectricalValue(evt, ws, data)
        break;
      case this.master[1]:
        this.Resistance(evt, ws, data)
        break;
      case this.master[2]:
        this.TFTDriving(evt, ws, data)
        break;
      case this.master[3]:
        this.OTPData(evt, this.modelsList)
        break;
      case this.master[4]:
        this.OTPData(evt, this.modelsList)
        break;
      case this.master[5]:
        break;
      case this.master[6]:
        break;
      case this.master[7]:
        break;
      case this.master[8]:
        break;
      default:
        break;
    }
  }


  //TODO ExportMaster
  async ExportMaster() {
    switch (this.masterList) {
      case this.master[0]:
        window.open(this.urls[0]);
        break;
      case this.master[1]:
        window.open(this.urls[1]);
        break;
      case this.master[2]:
        window.open(this.urls[2]);
        break;
      case this.master[3]:
        break;
      case this.master[4]:
        break;
      case this.master[5]:
        break;
      case this.master[6]:
        break;
      case this.master[7]:
        break;
      case this.master[8]:
        break;
      default:
        break;
    }
  }


  async getMasterImageURL() {
    // TFT
    if (this.masterList == this.master[1]) {
      this.dataOldResis = await this.api.getMasterResis().toPromise()
      let data: any[] = []
      for (const item of this.dataOldResis) {
        if (item.urlAssignment.length > 0) {
          data.push({
            model: item.model,
            urlAssignment: item.urlAssignment
          })
        }
      }
      this.dataOldResis = data
    }
    // TFT
    if (this.masterList == this.master[2]) {
      this.dataOldTFT = await this.api.getMasterTFT().toPromise()
      let data: any[] = []
      for (const item of this.dataOldTFT) {
        if (item.CircuitDiagram.length > 0 || item.PartDrawing.length > 0) {
          data.push({
            model: item.model,
            CircuitDiagram: item.CircuitDiagram,
            PartDrawing: item.PartDrawing
          })
        }
      }
      this.dataOldTFT = data
    }
  }


  async CheckHave() {
    let newData: any[] = []
    let too = await this.api.getMasterOTP().toPromise()
    if (this.masterList == 'OTP Data (1st FCT)') {
      this.OTP1ST = too.filter(e => (e.model == this.modelsList) && (e.name == "1st"))
    } else {
      this.OTP1ST = too.filter(e => (e.model == this.modelsList) && (e.name == "Final"))
    }
    if (this.OTP1ST.length > 0) {
      for (const item of this.OTP1ST[0].value) {
        for (const [i, value] of item.data.entries()) {
          item.data[i].good = item.data[i].good
          // console.log(item.data[i]);
        }

        if (item.data[0].good.length == 2) {
          newData.push(`OTP Address: ${item.data[2].good}${item.data[3].good}\tRead data: ${item.data[0].good},${item.data[1].good},${item.data[2].good},${item.data[3].good},${item.data[4].good},${item.data[5].good},${item.data[6].good},${item.data[7].good},\n`)
        } else {
          newData.push(`${item.data[0].good} ${item.data[1].good} ${item.data[2].good} ${item.data[3].good} ${item.data[4].good} ${item.data[5].good} ${item.data[6].good} ${item.data[7].good} \r\n`)
        }
      }
    }
    let text = newData.join("")
    // let text = text.toString()
    this.ExportOTP = text
    // console.log(text);

    // console.log(this.OTP1ST[0].value);
    // console.log(typeof text);


  }


  //TODO F.Electrical value
  async ElectricalValue(evt: any, wb: any, data) {

    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    this.fullData = []
    let D2 = "Electrical value specification of all product. (Refer from Manafacturing Specification)"
    if (ws?.B2?.h == D2) {

      const formData = await this.addFormData(data, `${this.masterList}.xlsx`)
      this.resUpload = await this.api.uploadMasterProductSpec(formData).toPromise()
      const colExcel = 5
      const number = []

      /* save data */
      this.dataExcel = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      // console.log(this.dataExcel[colExcel - 2]);
      //num excel list
      for (let index = 3; index < this.dataExcel.length; index++) {
        if (this.dataExcel[index][0] != undefined) {
          number.push(this.dataExcel[index][0])
        }
      }

      // run 5-120
      for (let x = 0; x < number.length; x++) {
        this.data = {
          pattern: "",
          model: "",
          value: []
        }
        // const x = 0
        let item = []
        for (let [index, key] of this.dataExcel[x + colExcel - 2].entries()) {
          // console.log(index,key);
          if (index == 0) {
            this.data.model = key
          }
          if (index == 1) {
            this.data.pattern = key
          }
          item.push(key)
        }

        //list name min typ max good
        for (let index = 1; index < this.dataExcel[x + colExcel - 2].length; index = index + 5) {
          let list: any = {}
          for (const [i, key] of item.slice(index, index + 6).entries()) {
            // console.log(item.slice(index, index + 6));
            if (i == 1) {
              list.name = key
            }
            if (i == 2) {
              list.min = key
            }
            if (i == 3) {
              list.typ = key
            }
            if (i == 4) {
              list.max = key
            }
            if (i == 5) {
              list.good = key
            }
            if (i + 1 == item.slice(index, index + 5).length) {
              this.data.value.push(list)
            }
          }
          if (index + 1 == this.dataExcel[x + colExcel - 2].length) {
            this.data.value.pop()
          }
        }
        this.fullData.push(this.data)
      }

      let url = { urlMaster: this.resUpload }
      this.fullData.push(url)
      // console.log(this.fullData);

      const deletes = await this.api.deleteMasterProductSpec().toPromise()
      const sandData = this.api.addMasterProductSpec(this.fullData).toPromise()

      setTimeout(() => {
        Swal.fire('Success', '', 'success')
      }, 200);

    } else {
      setTimeout(() => {
        Swal.fire('Data incompatibility !', '', 'error')
      }, 200);
    }
    let doo = document.getElementById("files") as HTMLInputElement
    setTimeout(() => {
      doo.value = ''
      this.fullData = []
      remove()
      function remove() {
        let d = document.getElementById(`files`) as HTMLInputElement
        d.value = ""
      }
    }, 1000);
  }


  //TODO F.TFTDriving
  async TFTDriving(evt: any, wb: any, data) {
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];
    let D2 = "TFT Driving Voltage"
    // console.log(ws);
    this.fullData = []
    if (ws?.B2?.h == D2) {

      const formData = await this.addFormData(data, `${this.masterList}.xlsx`)
      this.resUpload = await this.api.uploadMasterProductSpec(formData).toPromise()
      const colExcel = 5
      const number = []

      /* save data */
      this.dataExcel = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      // console.log(this.dataExcel[colExcel - 2]);
      //num excel list
      for (let index = 3; index < this.dataExcel.length; index++) {
        if (this.dataExcel[index][0] != undefined) {
          number.push(this.dataExcel[index][0])
        }
      }

      for (let x = 0; x < number.length; x++) {
        this.data = {
          pattern: "",
          model: "",
          value: []
        }
        // const x = 0
        let item = []
        for (let [index, key] of this.dataExcel[x + colExcel - 2].entries()) {
          // console.log(index,key);
          if (index == 0) {
            this.data.model = key
          }
          if (index == 1) {
            this.data.pattern = key
          }
          item.push(key)
        }

        //list name min typ max good
        for (let index = 1; index < this.dataExcel[x + colExcel - 2].length; index = index + 3) {
          let list: any = {}
          for (const [i, key] of item.slice(index, index + 4).entries()) {
            // console.log(item.slice(index, index + 6));
            if (i == 1) {
              list.measure = key
            }
            if (i == 2) {
              list.name = key
            }
            if (i == 3) {
              list.good = key
            }
            if (i + 1 == item.slice(index, index + 3).length) {
              this.data.value.push(list)
            }
          }
          if (index + 1 == this.dataExcel[x + colExcel - 2].length) {
            this.data.value.pop()
          }
        }
        this.fullData.push(this.data)
      }

      let url = { urlMaster: this.resUpload }
      this.fullData.push(url)

      for (let i of this.fullData) {
        for (const j of this.dataOldTFT) {
          if (j.model == i.model) {
            i.CircuitDiagram = j.CircuitDiagram
            i.PartDrawing = j.PartDrawing
          }
        }
      }


      const deletes = await this.api.deleteMasterTFT().toPromise()
      const sandData = this.api.addMasterTFT(this.fullData).toPromise()
      setTimeout(() => {
        Swal.fire('Success', '', 'success')
      }, 200);

    } else {
      setTimeout(() => {
        Swal.fire('Data incompatibility !', '', 'error')
      }, 200);

    }
    let doo = document.getElementById("files") as HTMLInputElement
    setTimeout(() => {
      doo.value = ''
      this.fullData = []
      remove()
      function remove() {
        let d = document.getElementById(`files`) as HTMLInputElement
        d.value = ""
      }
    }, 1000);
  }


  //TODO F.Resistance
  async Resistance(evt: any, wb: any, data) {

    const toRemove = ["MDL", "Sheet3", "KTC model from AR", "Format"]
    wb.SheetNames = wb.SheetNames.filter((el) => !toRemove.includes(el));
    this.fullData = []
    // wb.SheetNames = wb.SheetNames.filter(e => e != "MDL")
    // console.log(myArray);
    // console.log(ws);
    let sheetName = "3001"
    let d = wb.SheetNames.filter(e => e == sheetName)
    if (d) {
      const colExcel = 6
      let number = []
      // console.log(data);

      // const formData = await this.addFormData(data, `${this.masterList}.xlsx`)
      let filename = data[0].name.split(".")
      let type = filename[filename.length - 1]


      const formData = await this.addFormData(data, `${this.masterList}.${type}`)
      this.resUpload = await this.api.uploadMasterProductSpec(formData).toPromise()
      // console.log(sheet);
      // for (let round = 70; round < 90; round++) {
      for (let round = 0; round < wb.SheetNames.length; round++) {
        const wsname: string = wb.SheetNames[round];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        //Check data ?
        // console.log(wsname);
        // console.log(ws?.G6?.v);
        // if (ws?.G6?.v != undefined && ws?.G6?.v != "") {
        this.data = {
          model: wsname,
          value: []
        }
        // /* save data */
        this.dataExcel = <AOA>(XLSX.utils.sheet_to_json(ws, {
          header: 1,
          defval: null
        }));

        const cutHead = this.dataExcel[0].find(e => e)
        if (!cutHead) {
          this.dataExcel.shift()
        }

        // for (let index = 4; index < this.dataExcel.length; index++) {
        for (let index = 4; index < this.dataExcel.length; index++) {
          if (!this.dataExcel[index][0]) {
            this.dataExcel[index].shift()
            // console.log("asdasd");
          }
          if (this.dataExcel[index][0] != undefined) {
            number.push(this.dataExcel[index][0])
          }
        }


        // //sum head table
        let head = []
        for (let [index, key] of this.dataExcel[2].entries()) {
          if (key != undefined) {
            head.push(key)
          }
        }

        for (let i = 0; i < head.length - 1; i++) {
          const name = head[i].split(" ")[3]
          this.data.value.push({
            name: name,
            list: []
          })
        }
        this.data.value.push({
          name: "between",
          list: []
        })


        // for (let x = 0; x < 1; x++) {
        for (let x = 0; x < number.length; x++) {

          // const x = 0
          let item = []
          // if (this.dataExcel[x + colExcel - 2][2] != null) {

          // console.log("sssss");
          // }
          if (this.dataExcel[x + colExcel - 2] && this.dataExcel[x + colExcel - 2].length != 0) {
            for (let [index, key] of this.dataExcel[x + colExcel - 2].entries()) {
              if (this.dataExcel[x + colExcel - 2][2] != null) {
                if (key == null) {
                  key = "infinity"
                }
                item.push(key)
              }
            }
          }



          let k = 0
          for (let index = 0; index < ((head.length - 1) * 8); index = index + 8) {
            let list: any = {}
            for (const [i, key] of item.slice(index, index + 7).entries()) {
              // console.log(i, key);
              if (i == 0) {
                list.Number = key
              }
              if (i == 1) {
                list.Name = key
              }
              if (i == 5) {
                list.Good = key
              }
              // console.log(list);
              if (i == 5 && list.Number != null) {
                this.data.value[k].list.push(list)
                k++
              }
              // console.log(i,key);
            }
          }

          let listName: any = {}
          // console.log("ss");

          for (const [i, key] of item.slice(((head.length - 1) * 8), ((head.length) * 8)).entries()) {
            if (i == 0) {
              listName.Number_A = key
            }
            if (i == 1) {
              listName.Number_B = key
            }
            if (i == 2) {
              listName.Name_A = key
            }
            if (i == 3) {
              listName.Name_B = key
            }
            if (i == 7) {
              listName.Good = key
            }
            if (i == 7 && listName.Number_A != 'infinity') {
              this.data.value[head.length - 1].list.push(listName)
            }


          }
          // console.log("asdasdasdasdsad");

        }

        number = []
        // this.data.value[head.length - 1].list.pop()
        this.fullData.push(this.data)
        // }
      }
      for (let [index, item] of this.fullData.entries()) {
        if (item.value[0].list.length == 0) {
          this.fullData[index] = null
        }
      }
      // console.log(this.fullData);

      let url = { urlMaster: this.resUpload }
      this.fullData.push(url)

      //sand step-step
      for (let i of this.fullData) {
        for (const j of this.dataOldResis) {
          if (j.model == i.model) {
            i.urlAssignment = j.urlAssignment
          }
        }
      }
      this.fullData = this.fullData.filter(e => e != null)
      // console.log(test01);

      // console.log(this.fullData);

      const deletes = await this.api.deleteMasterResis().toPromise()
      for (const item of this.fullData) {
        const sandData = this.api.addMasterResis(item).toPromise()
      }

      // const sandData = this.api.addMasterResis(this.fullData[0]).toPromise()
      setTimeout(() => {
        Swal.fire('Success', '', 'success')
      }, 200);

    } else {
      setTimeout(() => {
        Swal.fire('Data incompatibility !', '', 'error')
      }, 200);

    }
    let doo = document.getElementById("files") as HTMLInputElement
    setTimeout(() => {
      doo.value = ''
      this.fullData = []
      remove()
      function remove() {
        let d = document.getElementById(`files`) as HTMLInputElement
        d.value = ""
      }
    }, 1000);
  }


  //TODO F.OTP
  OTPData(evt: any, model: any) {
    const input = evt.target;
    const reader = new FileReader();
    let data: any[] = []
    let endData: any[] = []
    let fullData: any[] = []
    let EndData: any[] = []
    let dataBig: any
    reader.onload = (e: any) => {
      let text = reader.result;
      const regex = /data:/i;
      const found = text.toString().match(regex);
      data.push(text)
      // console.log(data);
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
          // let too = item.split("data: ")[1]
          let foo = item.split(" ")
          endData.push(foo)

        }
        if (endData[endData.length - 1].length < 8) {
          endData.splice(endData.length - 1, 1)
        }
        // console.log(endData[endData.length - 1].length);
      }


      for (const item of endData) {
        for (const [i, too] of item.entries()) {
          fullData.push({
            name: `data_${i + 1}`,
            good: too
          })
        }
        EndData.push({
          data: fullData
        })
        fullData = []
      }

      if (this.masterList == 'OTP Data (1st FCT)') {
        dataBig = {
          model: model,
          name: "1st",
          value: EndData
        }
      } else {
        dataBig = {
          model: model,
          name: "Final",
          value: EndData
        }
      }


      // const sandData = this.api.addMasterResis(item).toPromise()
    };

    setTimeout(() => {
      if (this.OTP1ST.length > 0 && this.masterList == 'OTP Data (1st FCT)') {
        const sandData = this.api.insertDataOTP(this.OTP1ST[0]._id, dataBig).toPromise()
      }
      if (!this.OTP1ST.length && this.masterList == 'OTP Data (1st FCT)') {
        const sandData = this.api.addMasterOTP(dataBig).toPromise()
      }

      if (this.OTP1ST.length > 0 && this.masterList != 'OTP Data (1st FCT)') {
        const sandData = this.api.insertDataOTP(this.OTP1ST[0]._id, dataBig).toPromise()
      }
      if (!this.OTP1ST.length && this.masterList != 'OTP Data (1st FCT)') {
        const sandData = this.api.addMasterOTP(dataBig).toPromise()
      }



      Swal.fire('Success', '', 'success')
      remove()
      function remove() {
        let d = document.getElementById(`files`) as HTMLInputElement
        d.value = ""
      }
    }, 500);
    reader.readAsText(input.files[0]);
  }


  ExportOtp() {
    download(this.ExportOTP, `${this.modelsList} ${this.masterList.slice(9)}.txt`);
    function download(text, filename) {
      var blob = new Blob([text], { type: "text/plain" });
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
    }

    // let data = "OTP Address: 0000	Read data: 01,01,00,00,05,01,02,00,\nOTP Address: 0010	Read data: 11,01,00,10,03,20,01,88,"


  }




}

