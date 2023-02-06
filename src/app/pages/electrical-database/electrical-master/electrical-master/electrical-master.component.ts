import { Component, OnInit } from '@angular/core';
import { HttpService } from 'app/service/http.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
type AOA = any[][];


@Component({
  selector: 'app-electrical-master',
  templateUrl: './electrical-master.component.html',
  styleUrls: ['./electrical-master.component.scss']
})
export class ElectricalMasterComponent implements OnInit {

  //-----------------------------------------------------------------------------------------------------//
  //TODO var
  RouterMenu: any[]
  LoadingPage: boolean;
  dataExcel: any[] = []
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  data: any
  fullData: any[] = []
  master: any[] = []
  masterList: any
  urls: any[] = []


  constructor(private api: HttpService) { }
  //-----------------------------------------------------------------------------------------------------//
  //TODO init
  async ngOnInit(): Promise<void> {
    this.routes()
    this.master = [
      "Product Electrical Spec",
      "Input Resistance 1",
      "Input Resistance 2",
      "TFT Driving voltage",
      "OTP Data (1st FCT)",
      "OTP Data (Final FCT)",
      "Reproduce (Short/Open Test)",
      "Reproduce (ESD Test)",
      "Reproduce (Other Test)",
    ]
    this.getUrlMaster()
  }


  //-----------------------------------------------------------------------------------------------------//
  //TODO routes
  routes() {
    const access: any = sessionStorage.getItem('UserEmployeeCode')
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
    if (ProductSpec) {
      this.urls.push(ProductSpec[ProductSpec.length - 1].urlMaster[0])
    }
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
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();

    reader.onload = async (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      // console.log(ws?.C2?.h);
      ////////////call function master//////////////
      this.ImportExcelList(evt, ws)

    };
    reader.readAsBinaryString(target.files[0]);
  }

  //TODO Excel
  ImportExcelList(evt: any, ws: any) {
    switch (this.masterList) {
      case this.master[0]:
        this.ElectricalValue(evt, ws)
        break;
      case this.master[1]:
        break;
      case this.master[2]:
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

  //TODO F.Electrical value
  async ElectricalValue(evt: any, ws: any) {
    let D2 = "Electrical value specification of all product. (Refer from Manafacturing Specification)"
    if (ws?.D2?.h == D2) {
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
      // console.log(this.fullData);

      const data: any[] = []
      const files = evt.target.files
      data.push(...files)
      const formData = await this.addFormData(data, `${this.masterList}.xlsx`)
      let resUpload = await this.api.uploadMasterProductSpec(formData).toPromise()
      // console.log(resUpload);

      let url = { urlMaster: resUpload }
      this.fullData.push(url)
      // console.log(this.fullData);

      const deletes = await this.api.deleteMasterProductSpec().toPromise()
      const sandData = this.api.addMasterProductSpec(this.fullData).toPromise()
      Swal.fire('success', '', 'success')
      let doo = document.getElementById("files") as HTMLInputElement
      setTimeout(() => {
        doo.value =''
        this.fullData = []
      }, 1000);

    } else {
      setTimeout(() => {
        Swal.fire('Data incompatibility !', '', 'error')
      }, 200);

    }
  }


  //TODO ExportMaster
  async ExportMaster() {
    switch (this.masterList) {
      case this.master[0]:
        window.open(this.urls[0], '_blank');
        break;
      case this.master[1]:
        break;
      case this.master[2]:
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





}

