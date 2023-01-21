import { Component, OnInit } from '@angular/core';
import { HttpService } from 'app/service/http.service';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs'
import * as fs from 'file-saver';
import { environment } from 'environments/environment';
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
  dataOld: any
  dataTable: any
  nameTable: any

  onHide: any[] = []
  UserLevel: any

  // ? Fix ID
  IdModelNumber = environment.IdModelNumber

  constructor(private api: HttpService) { }
  //TODO init

  async ngOnInit(): Promise<void> {
    this.routes()
    this.getMasterProductSpec()
    this.getModel()
    this.data = []
    this.UserLevel = sessionStorage.getItem("UserLevel1")
  }

  //TODO function All
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
      } else {
        this.data = []
      }
    }
    // let test

    this.dataTable = 0
    this.filterMaster()
    // egisterNo: new RegExp(req.body.data, "i")
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


  //TODO calculator
  calculator() {
    for (const item of this.data) {
      if (item.min <= item.Ng && item.Ng <= item.max) {
        item.status = true
      } else {
        item.status = false
      }
    }
  }


  //TODO ExportExcel
  async ExportExcel() {
    // console.log(this.data);

    const workbook = new Workbook();
    this.worksheet = workbook.addWorksheet('New Sheet', { properties: { tabColor: { argb: 'FFC0000' } } });

    // this.readBorderEx('A1', 'P1')
    this.worksheet.columns = [
      { width: 12, header: 'Name (Unit)', key: 'name' },
      { width: 8, header: 'Min.', key: 'min' },
      { width: 8, header: 'Typ.', key: 'typ' },
      { width: 8, header: 'Max', key: 'max' },
      { width: 8, header: 'Good', key: 'good' },
      { width: 8, header: 'NG', key: 'Ng' },
      { header: `${this.nameTable}` },
    ];



    const row = this.worksheet.addRows(
      this.data
    );


    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
      fs.saveAs(blob, 'Report.xlsx');
    });


  }


  //TODO select product
  clickSelect(e: any) {
    this.nameTable = e.target.innerText
    // console.log(e.target.innerText);
    switch (e.target.id) {
      case "Product":
        this.dataTable = 1
        break;
      case "test":
        this.dataTable = 2
        break;
      default:
        break;
    }
    // console.log(e);

  }


  //TODO show dave if have
  filterMaster() {
    this.onHide = []
    let ProductSpec = this.MasterProductSpec.find(e => e.model == this.model)
    let Model = this.MasterModel.find(e => e.name == this.model)
    ProductSpec ? this.onHide[0] = 1 : this.onHide[0] = 0
    Model ? this.onHide[1] = 1 : this.onHide[1] = 0
    // console.log(this.onHide);
    // console.log("dataTable" , this.dataTable);
  }

}
