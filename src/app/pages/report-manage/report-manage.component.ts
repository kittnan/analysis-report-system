import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'app/service/http.service';
// import { resolve } from 'path';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-report-manage',
  templateUrl: './report-manage.component.html',
  styleUrls: ['./report-manage.component.css', '../pagesStyle.css']
})
export class ReportManageComponent implements OnInit {

  constructor(
    // private progressForm1: ProgressForm1Service,
    private api: HttpService,
    private modalService: NgbModal,
    private route: Router
  ) { }

  // ?  toggle
  toggleRequestItem = false;
  toggleDefective = false;
  toggleResult = false;

  toggleShowAdd = false;
  toggleShowDefectiveList = false;
  toggleShowResultList = false;

  // ? API
  Report: any;
  DefectiveList = [];
  ResultList = [];

  NameToAdd = new FormControl(null, Validators.required)
  NameToEdit = new FormControl(null, Validators.required)
  NameToEditId = new FormControl(null)
  indexToEdit: any;


  SelectRequestItem = new FormControl(null)

  async ngOnInit(): Promise<void> {
    await this.CheckStatusUser();
    await this.GetReport();

  }
  async CheckStatusUser() {
    let LevelList = [];
    sessionStorage.getItem('UserLevel1') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel1')) : false
    sessionStorage.getItem('UserLevel2') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel2')) : false
    sessionStorage.getItem('UserLevel3') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel3')) : false
    sessionStorage.getItem('UserLevel4') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel4')) : false
    sessionStorage.getItem('UserLevel5') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel5')) : false
    sessionStorage.getItem('UserLevel6') != "null" ? LevelList.push(sessionStorage.getItem('UserLevel6')) : false

    if (LevelList.find(i => i == '0')) {
    } else {
      // alert("No access!!");
      // location.href = "#/manageForm"
      this.route.navigate(['/manageForm'])
    }
  }

  async GetReport() {
    this.api.GetReportList().then((data: any) => {
      if (data.length > 0) {
        this.Report = data;
      } else {
        this.Report = null;
      }
    })
  }



  onChangeRequestItem() {

    if (this.toggleDefective == true) {
      this.toggleShowDefectiveList = true;
      const tempFilter = this.Report.filter(item => item.modelName == this.SelectRequestItem.value)
      tempFilter[0].defective.length > 0 ? this.DefectiveList = tempFilter[0].defective : this.DefectiveList = [];
    } else if (this.toggleResult == true) {
      this.toggleShowResultList = true;
      const tempFilter = this.Report.filter(item => item.modelName == this.SelectRequestItem.value)
      tempFilter[0].result.length > 0 ? this.ResultList = tempFilter[0].result : this.ResultList = [];

    }



  }



  onClick(key: any) {
    this.clear();
    key == "request" ? this.toggleRequestItem = true : this.toggleRequestItem = false
    key == "defective" ? this.toggleDefective = true : this.toggleDefective = false
    key == "result" ? this.toggleResult = true : this.toggleResult = false
  }
  clear() {
    this.toggleShowDefectiveList = false;
    this.toggleShowResultList = false;
    this.SelectRequestItem.reset();
  }

  onClickAdd(content) {
    this.modalService.open(content, { size: 'lg' });
  }
  onClickEdit(content, item: any) {
    this.NameToEdit.setValue(item.modelName);
    this.NameToEditId.setValue(item._id);
    this.modalService.open(content, { size: 'lg' });

  }

  onEdit() {
    const temp = {
      modelName: this.NameToEdit.value
    }
    this.api.UpdateReportList(this.NameToEditId.value, temp).subscribe((data: any) => {
      if (data) {
        this.alertSuccess();
        this.GetReport();
      }
    })
  }

  onClickDelete(item: any) {
    Swal.fire({
      title: 'Do you want to delete?',
      text: `delete ${item.modelName} ?`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.DeleteReportList(item._id).subscribe((data: any) => {
          if (data) {
            this.alertSuccess();
            this.GetReport();
          }
        })
      }
    })
  }




  onAdd() {

    if (confirm("Do you have add defective ?")) {

      if (this.toggleRequestItem == true) {
        this.addRequestItem();
      } else if (this.toggleDefective == true || this.toggleResult == true) {
        this.addDefectandResult();
      }
    }





  }

  addRequestItem() {
    if (this.Report.filter(item => item.modelName == this.NameToAdd.value).length > 0) {
      Swal.fire({
        title: 'ERROR',
        text: `${this.NameToAdd.value} to duplicate`,
        showConfirmButton: true,
        icon: 'error'
      })
    } else {

      const tempData = {
        modelName: this.NameToAdd.value,
        defective: [],
        result: []
      }
      this.api.AddReportList(tempData).subscribe((data: any) => {
        if (data.length > 0) {
          this.alertSuccess();
          this.GetReport();
        }
      })

    }

  }

  // ? Defective list

  addDefectandResult() {

    if (this.toggleDefective) {
      this.DefectiveList.push(this.NameToAdd.value);
      let model = this.Report.find(i => i.modelName == this.SelectRequestItem.value)
      const data = {
        defective: this.DefectiveList
      }
      this.api.UpdateReportList(model._id, data).subscribe((data: any) => {
        if (data) {
          this.alertSuccess();
          this.NameToAdd.reset();
        }
      })
    } else if (this.toggleResult) {
      this.ResultList.push(this.NameToAdd.value);
      let model = this.Report.find(i => i.modelName == this.SelectRequestItem.value)
      const data = {
        result: this.ResultList
      }
      this.api.UpdateReportList(model._id, data).subscribe((data: any) => {
        if (data) {
          this.alertSuccess();
          this.NameToAdd.reset();
        }
      })
    }



  }

  ModalEditDefectandResult(content, item, index) {
    this.NameToEdit.setValue(item)
    this.indexToEdit = index;
    this.modalService.open(content, { size: 'lg' });
  }

  onEditDefectandResult() {

    if (this.toggleDefective) {
      if (confirm("Do you have edit defective?")) {
        this.DefectiveList[this.indexToEdit] = this.NameToEdit.value
        let model = this.Report.find(i => i.modelName == this.SelectRequestItem.value)
        const data = {
          defective: this.DefectiveList
        }
        this.api.UpdateReportList(model._id, data).subscribe((data: any) => {
          if (data) {
            this.alertSuccess();
            this.NameToEdit.reset();
          }
        })

      }
    } else if (this.toggleResult) {
      if (confirm("Do you have edit result?")) {
        this.ResultList[this.indexToEdit] = this.NameToEdit.value
        let model = this.Report.find(i => i.modelName == this.SelectRequestItem.value)
        const data = {
          result: this.ResultList
        }
        this.api.UpdateReportList(model._id, data).subscribe((data: any) => {
          if (data) {
            this.alertSuccess();
            this.NameToEdit.reset();
          }
        })

      }
    }
  }

  onDeleteDefectandResult(item, index) {

    if (this.toggleDefective) {
      Swal.fire({
        title: `Do you have delete ${item}?`,
        showConfirmButton: true,
        showCancelButton: true,
        icon: 'question'
      }).then((ans) => {
        if (ans.isConfirmed) {
          this.DefectiveList.splice(index, 1)
          let model = this.Report.find(i => i.modelName == this.SelectRequestItem.value)
          const data = {
            defective: this.DefectiveList
          }
          this.api.UpdateReportList(model._id, data).subscribe((data: any) => {
            if (data) {
              this.alertSuccess();
            }
          })
        }
      })

    } else if (this.toggleResult) {
      Swal.fire({
        title: `Do you have delete ${item}?`,
        showConfirmButton: true,
        showCancelButton: true,
        icon: 'question'
      }).then((ans) => {
        if (ans.isConfirmed) {
          this.ResultList.splice(index, 1)
          let model = this.Report.find(i => i.modelName == this.SelectRequestItem.value)
          const data = {
            result: this.ResultList
          }
          this.api.UpdateReportList(model._id, data).subscribe((data: any) => {
            if (data) {
              this.alertSuccess();
            }
          })
        }
      })

    }



  }
  // ? Defective list








  alertSuccess() {
    Swal.fire({
      title: 'SUCCESS',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    })
  }

}
