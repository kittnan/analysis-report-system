import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment.prod'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx'
import { HttpService } from 'app/service/http.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-masterlists',
    templateUrl: './masterlists.component.html',
    styleUrls: ['./masterlists.component.css'],


})


export class MasterlistsComponent implements OnInit {
    constructor(
        private md: NgbModal,
        private api: HttpService,
        private route: Router
    ) { }



    // ? ตัวแปร เก็บค่าจาก API
    Model: any;
    Master: any;
    List: any;
    OccurAList: any;
    OccurB: any;

    // ? ตัวแปร สร้างมาใช้งานทั่วไป
    CheckBoxModel = [false, false, false, false, false, false];
    CheckBoxStatus = true;
    TempOccurAName: any;

    // ? ตัวแปร FIX ค่า
    ModelNumberMasterFix = environment.ModelNumber;
    DefectMasterFix = environment.Defective;
    OccurMasterFix = environment.Occur;
    CauseMasterFix = environment.Cause;
    ProductionPhase = environment.ProductionPhase;
    DefectCategory = environment.DefectCategory;
    Abnormal = environment.Abnormal;
    Source = environment.Source
    // ModelNumberMasterFix = "KTC Model Number";
    // DefectMasterFix = "DefectCode & DefectName";
    // OccurMasterFix = "Occur Place";
    // CauseMasterFix = "Category Root Cause";

    // ? ตัวแปร สร้างมาใช้กับ Form
    SelectModel = new FormControl(null, Validators.required);
    SelectMaster = new FormControl(null, Validators.required);
    SelectOccurA = new FormControl(null, Validators.required);
    SelectOccurAId = new FormControl(null, Validators.required);

    ModalMasterName = new FormControl(null, Validators.required);

    ModalListName = new FormControl(null, Validators.required);
    ModalListId = new FormControl(null, Validators.required);

    // ? Form for Model Number
    Modal_ModelNumbers = new FormGroup({
        name: new FormControl(null, Validators.required),
        size: new FormControl(null, Validators.required),
        customer: new FormControl(null, Validators.required)
    })

    Modal_Defects = new FormGroup({
        name: new FormControl(null, Validators.required),
        code: new FormControl(null, Validators.required),
        // checkBoxStatus: new FormControl(false, Validators.requiredTrue)
    })

    Modal_Occurs = new FormGroup({
        occurA: new FormControl(null, Validators.required),
        occurAId: new FormControl(null, Validators.required),
        name: new FormControl(null, Validators.required),
    })

    Modal_Causes = new FormGroup({
        name: new FormControl(null, Validators.required),
        modelName: new FormControl(null, Validators.required),
    })

    CauseName = new FormControl(null, Validators.required);

    ModalOccurB = new FormControl(null, Validators.required);
    ExcelMasterName = new FormControl(null, Validators.required);

    Modal_CBModel = new FormGroup({
        PNL: new FormControl(false),
        MDL: new FormControl(false),
        AMT: new FormControl(false),
        SMT: new FormControl(false),
        DSTFM: new FormControl(false),
        AMTFM: new FormControl(false)
    })

    PNL = new FormControl(false, Validators.requiredTrue)
    MDL = new FormControl(false, Validators.requiredTrue)
    AMT = new FormControl(false, Validators.requiredTrue)
    SMT = new FormControl(false, Validators.requiredTrue)
    DSTFM = new FormControl(false, Validators.requiredTrue)
    AMTFM = new FormControl(false, Validators.requiredTrue)


    // SelectsModel = new FormControl(null, Validators.required);
    SelectModelId = new FormControl(null, Validators.required);

    // ? new Toggle Func to using Select Model
    ToggleNormalSelect: boolean = false;
    ToggleModelNumberSelect: boolean = false;
    ToggleDefectSelect: boolean = false;
    ToggleOccurSelect: boolean = false;
    ToggleCauseSelect: boolean = false;

    // ? new Toggle Func
    ToggleNormal: boolean = false
    ToggleModelNumber: boolean = false
    ToggleDefect: boolean = false
    ToggleOccur: boolean = false
    ToggleCause: boolean = false

    // ? new Toggle Func
    ToggleNormalTable: boolean = false
    ToggleModelNumberTable: boolean = false
    ToggleDefectTable: boolean = false
    ToggleOccurTable: boolean = false
    ToggleCauseTable: boolean = false

    // ? excel
    arrayBuffer: any;
    file: File;

    ExcelDataJson: any;
    ExcelMasterId: any;

    jsonToExcelData: any = []
    OccurB2: any;
    occurAName2: any;


    // ? !Excel Modal
    ModalExcelMaster = new FormControl(null, Validators.required);
    ModalExcelMasterId: any;

    DataTempDownload: any;
    DataExcelList: any;
    DataExcelModelNumber: any;
    DataExcelNormal: any;
    DataExcelDefect: any;
    DataExcelOccur: any;
    DataExcelCause: any;

    // ? Form control to modal Model NUmber
    ModelNumbers = new FormGroup({
        name: new FormControl(null, Validators.required),
        size: new FormControl(null, Validators.required),
        customer: new FormControl(null, Validators.required)
    })
    // ? Form control to modal Normal
    Normals = new FormGroup({
        name: new FormControl(null, Validators.required),
    })
    // ? Form control to modal Defect
    Defects = new FormGroup({
        name: new FormControl(null, Validators.required),
        code: new FormControl(null, Validators.required),
        checkBoxStatus: new FormControl(false, Validators.requiredTrue)
    })
    // ? Form control to modal Cause
    Causes = new FormGroup({
        modelName: new FormControl(null, Validators.required),
        causeName: new FormControl(null, Validators.required),
    })
    // ? Form control to modal Occur
    Occurs = new FormGroup({
        occurA: new FormControl(null, Validators.required),
        occurAId: new FormControl(null, Validators.required),
        name: new FormControl(null, Validators.required),
    })
    occurAId: any;
    ModalMasterId: any;
    SelectMasterId: any;

    // // ? Use Data Table
    // DataLink: any;
    // CountFiler = new FormControl(10, Validators.required);
    // PageNumber = 1;
    // DataInTable: any;
    // CountPageAll: any;
    // CountNow: any;
    // CountStart: any;


    // ? data table
    DataNum = new FormControl(null, Validators.required)
    WordFilter = new FormControl(null, Validators.required)
    PageNow = 1;
    PageNum = 1;
    NumList = [10, 50, 100, 200, 500, 1000, 'ALL']
    ResultFilter: any;
    NoData: any = 1;


    ngOnInit(): void {
        this.CheckStatusUser();
        this.GetModel();
        this.GetMaster();
        this.GetOccurA();
        this.GetListAll()
        // this.DataTableStart()
    }

    CheckStatusUser() {
        let LevelList = [];
        localStorage.getItem('AR_UserLevel1') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel1')) : false
        localStorage.getItem('AR_UserLevel2') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel2')) : false
        localStorage.getItem('AR_UserLevel3') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel3')) : false
        localStorage.getItem('AR_UserLevel4') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel4')) : false
        localStorage.getItem('AR_UserLevel5') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel5')) : false
        localStorage.getItem('AR_UserLevel6') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel6')) : false

        if (LevelList.find(i => i == '0')) {
        } else {
            // alert("No access!!");
            this.route.navigate(['/manageForm'])
            // location.href = "#/manageForm"
        }
    }

    // ? API
    GetModel() {
        this.api.GetModel().subscribe((data: any) => {
            if (data.length > 0) {
                this.Model = data;
                // console.log("Model",data);
            }
        })
    }

    GetMaster() {
        this.api.GetMaster().subscribe((data: any) => {
            if (data.length > 0) {
                this.Master = data;
                // console.log("Master",data);
            }
        })
    }

    GetListById(masterId: any) {
        this.api.GetListByMasterId(masterId).subscribe((data: any) => {
            if (data.length > 0) {
                this.List = data
                // console.log(data);
                this.DataTableStart();


            } else {
                this.List = null;

            }
        })
    }


    GetOccurA() {
        this.api.GetOccurA().subscribe((data: any) => {
            if (data.length > 0) {
                this.OccurAList = data;

            } else {
                this.OccurAList = null;
            }
        })
    }
    GetOccurB() {

        this.api.GetOccurB(this.SelectOccurAId.value).subscribe((data: any) => {
            if (data.length > 0) {
                this.List = data;
                console.log(data);

                this.DataTableStart();


            } else {
                this.List = null;
            }
        })
    }
    GetDefect() {
        this.api.GetDefect(this.SelectModel.value).subscribe((data: any) => {
            if (data.length > 0) {
                this.List = data;
                this.DataTableStart();

            } else {
                this.List = null;
            }
        })
    }
    GetCause() {
        this.api.GetListByModelName(this.SelectModel.value).subscribe((data: any) => {
            if (data.length > 0) {
                this.List = data;
                this.DataTableStart();

                // console.log("Cause", data);
            } else {
                this.List = null;
            }
        })
    }
    GetListAll() {
        this.api.GetListAll().subscribe((data: any) => {
            if (data.length > 0) {
                this.DataExcelList = data
            }
        })
    }




    PostList() {
        let d = {
            idMaster: this.ModalMasterId,
            nameMaster: this.ModalMasterName.value,
            name: this.Normals.controls.name.value
        }
        this.api.PostList(d).subscribe((data: any) => {
            if (data.length > 0) {
                this.alertSuccess();
                this.Normals.reset();
                this.OnSetToggleSelect();
            }
        })
    }

    PostModelNumber() {
        let data = this.ModelNumbers.value;
        data['idMaster'] = this.ModalMasterId;
        data['nameMaster'] = this.ModalMasterName.value;
        this.api.PostList(data).subscribe((rs: any) => {
            if (rs.length > 0) {
                this.alertSuccess();
                this.ModelNumbers.reset();
                this.GetListById(this.SelectMasterId);
            }
        })
    }

    PostDefect() {
        let name = [];
        if (this.PNL.valid) {
            name[0] = "PNL";
        }
        if (this.MDL.valid) {
            name[1] = "MDL";
        }
        if (this.SMT.valid) {
            name[2] = "SMT";
        }
        if (this.AMT.valid) {
            name[3] = "AMT";
        }
        if (this.AMTFM.valid) {
            name[4] = "AMT_FM";
        }
        if (this.DSTFM.valid) {
            name[5] = "DST_FM";
        }
        let d = {
            idMaster: this.ModalMasterId,
            defectName: this.Defects.controls.name.value,
            defectCode: this.Defects.controls.code.value,
            modelName1: name[0],
            modelName2: name[1],
            modelName3: name[2],
            modelName4: name[3],
            modelName5: name[4],
            modelName6: name[5],
        }
        this.api.PostDefect(d).subscribe((data: any) => {
            if (data.length > 0) {
                this.alertSuccess();
                this.Defects.reset();
                this.PNL.reset();
                this.MDL.reset();
                this.SMT.reset();
                this.AMT.reset();
                this.AMTFM.reset();
                this.DSTFM.reset();
                this.OnSetToggleTable()
            } else {

            }
        })
    }



    PostCause() {
        let d = {
            idMaster: this.ModalMasterId,
            nameModel: this.Causes.controls.modelName.value,
            nameMaster: this.ModalMasterName.value,
            name: this.Causes.controls.causeName.value
        }
        // console.log("Cause", d);

        this.api.PostList(d).subscribe((data: any) => {
            if (data.length > 0) {
                this.alertSuccess();
                this.Causes.reset();
                this.OnSetToggleTable();

            }
        })

    }
    PostOccur() {
        let d = {
            idOccurA: this.Occurs.controls.occurAId.value,
            nameOccurA: this.Occurs.controls.occurA.value,
            name: this.Occurs.controls.name.value
        }
        // console.log(d);
        this.api.PostOccur(d).subscribe((data: any) => {
            if (data.length > 0) {
                this.alertSuccess();
                this.OnSetToggleTable();
            }
        })

    }


    // ? Event

    checkboxDefect() {
        if (this.PNL.valid || this.MDL.valid || this.AMT.valid || this.SMT.valid || this.DSTFM.valid || this.AMTFM.valid) {
            this.Defects.controls.checkBoxStatus.setValue(true, Validators.required);
        } else if (this.PNL.invalid && this.MDL.invalid && this.AMT.invalid && this.SMT.invalid && this.DSTFM.invalid || this.AMTFM.valid) {
            this.Defects.controls.checkBoxStatus.reset();
        }

    }


    // todo When CLICK ADD LIST
    // ? ***********************************************************************************8
    ModalAddList() {
        if (this.ToggleNormal) {
            this.PostList();
        } else if (this.ToggleModelNumber) {
            this.PostModelNumber();
        } else if (this.ToggleOccur) {
            this.PostOccur();
        } else if (this.ToggleCause) {
            this.PostCause();
        } else if (this.ToggleDefect) {
            this.PostDefect();
        }
    }



    // ? ********************************************************TOGGLE IN MODAL ADD LIST
    OnSetToggle() {
        this.Master.forEach(item => {
            this.ModalMasterName.value == item.name ? this.ModalMasterId = item._id : false
        });

        this.CleanToggle();
        this.OnOffToggle(this.ModalMasterName.value)
    }
    OnOffToggle(nameToggle: any) {
        this.ToggleNormal = true
        this.ToggleModelNumber = false
        this.ToggleDefect = false
        this.ToggleCause = false
        this.ToggleOccur = false
        if (nameToggle.toLowerCase().includes(this.ModelNumberMasterFix.toLowerCase())) {
            this.ToggleModelNumber = !this.ToggleModelNumber;
            this.ToggleNormal = false;
        }
        if (nameToggle.toLowerCase().includes(this.DefectMasterFix.toLowerCase())) {
            this.ToggleDefect = !this.ToggleDefect;
            this.ToggleNormal = false;
        }
        if (nameToggle.toLowerCase().includes(this.CauseMasterFix.toLowerCase())) {
            this.ToggleCause = !this.ToggleCause;
            this.ToggleNormal = false;
        }
        if (nameToggle.toLowerCase().includes(this.OccurMasterFix.toLowerCase())) {
            this.ToggleOccur = !this.ToggleOccur;
            this.GetOccurA();
            this.ToggleNormal = false;
        }
    }
    // ? ********************************************************TOGGLE IN MODAL ADD LIST


    // ? ********************************************************TOGGLE MASTER

    OnSetToggleSelect() {

        this.SelectModel.reset();
        this.SelectModelId.reset();
        this.List = null;
        this.ResultFilter = [];
        this.SelectOccurA.reset()
        this.CleanToggleSelect();
        // ! set id master
        this.Master.forEach((item, index) => {
            this.SelectMaster.value == item.name ? this.SelectMasterId = item._id : false
        });
        this.OnOffToggleSelect(this.SelectMaster.value)

    }

    OnOffToggleSelect(nameToggle: any) {
        this.ToggleNormalSelect = true;
        if (nameToggle.toLowerCase().includes(this.ModelNumberMasterFix.toLowerCase())) {
            this.ToggleModelNumberSelect = !this.ToggleModelNumberSelect;
            this.ToggleNormalSelect = false;
            this.OnSetToggleTable();

        }
        if (nameToggle.toLowerCase().includes(this.DefectMasterFix.toLowerCase())) {
            this.ToggleDefectSelect = !this.ToggleDefectSelect;
            this.ToggleNormalSelect = false;
        }

        if (nameToggle.toLowerCase().includes(this.OccurMasterFix.toLowerCase())) {
            this.ToggleOccurSelect = !this.ToggleOccurSelect;
            this.ToggleNormalSelect = false;
        }
        if (nameToggle.toLowerCase().includes(this.CauseMasterFix.toLowerCase())) {
            this.ToggleCauseSelect = !this.ToggleCauseSelect;
            this.ToggleNormalSelect = false;
        }
        if (this.ToggleNormalSelect) {
            this.OnSetToggleTable();
        }
        // this.OnSetToggleTable();
    }
    // ? ********************************************************TOGGLE MASTER

    // ? ********************************************************TOGGLE TABLE

    OnSetToggleTable() {
        // this.Master.forEach(item => {
        //     this.SelectMaster.value == item.name ? this.SelectMasterId = item._id : false
        // });
        this.CleanToggleTable();
        this.OnOffToggleTable();

    }
    OnOffToggleTable() {
        if (this.ToggleNormalSelect == true) {
            this.ToggleNormalTable = true
        }
        if (this.ToggleModelNumberSelect == true) {
            this.ToggleModelNumberTable = true
        }
        if (this.ToggleDefectSelect == true) {
            this.ToggleDefectTable = true
        }
        if (this.ToggleOccurSelect == true) {
            this.ToggleOccurTable = true
        }
        if (this.ToggleCauseSelect == true) {
            this.ToggleCauseTable = true
        }
        this.ToggleNormalTable ? this.GetListById(this.SelectMasterId) : false
        this.ToggleModelNumberTable ? this.GetListById(this.SelectMasterId) : false
        this.ToggleDefectTable ? this.GetDefect() : false
        this.ToggleOccurTable ? this.GetOccurB() : false
        this.ToggleCauseTable ? this.GetCause() : false

    }

    // ? ********************************************************TOGGLE TABLE

    onSelectModel() {
        // ! set id model (defect)
        this.Model.forEach(element => {
            element.name == this.SelectModel.value ? this.SelectModelId.setValue(element._id) : false
        });
        // this.OnSetToggleSelect();
        this.OnSetToggleTable();


    }

    onSelectOccurA() {
        // ! set id occurA
        this.OccurAList.forEach(element => {
            element.name == this.SelectOccurA.value ? this.SelectOccurAId.setValue(element._id) : false
        });
        this.OnSetToggleTable();

    }

    onSelectCauseModel() {
        this.OnSetToggleTable();


    }

    CleanToggle() {
        this.ToggleNormal = false;
        this.ToggleModelNumber = false;
        this.ToggleDefect = false;
        this.ToggleOccur = false;
    }
    CleanToggleSelect() {
        this.ToggleNormalSelect = false;
        this.ToggleModelNumberSelect = false;
        this.ToggleDefectSelect = false
        this.ToggleOccurSelect = false
        this.ToggleCauseSelect = false
    }
    CleanToggleTable() {
        this.ToggleNormalTable = false;
        this.ToggleModelNumberTable = false;
        this.ToggleDefectTable = false;
        this.ToggleOccurTable = false;
        this.ToggleCauseTable = false;
    }





    // ? ********************************************************OPEN  !Modal

    // todo WHEN CLICK BUTTON ADD (ICON  ADD)
    OpenModalAddList(content) {
        this.md.open(content, { size: 'lg' });
    }


    ModalEditList(content, item) {
        this.ModalListName.setValue(item.name)
        this.ModalListId.setValue(item._id)
        this.md.open(content, { size: 'lg' });
    }

    onEditList() {
        const ans = confirm("Update ?")
        if (ans == true) {
            const tempData = {
                name: this.ModalListName.value
            }
            this.api.UpdateList(this.ModalListId.value, tempData).subscribe((data) => {
                console.log("UPDATE LOG", data);
                if (data != null) {
                    this.OnSetToggleTable();
                    this.alertSuccess();
                    this.ModalListName.reset();
                    this.ModalListId.reset();
                }
            })
        }
    }

    onDeleteList(item) {
        this.ModalListName.setValue(item.name)
        this.ModalListId.setValue(item._id)
        this.alertConfirmDel()
        this.OnSetToggleTable();
    }
    onDeleteDefect(item) {
        this.ModalListName.setValue(item.name)
        this.ModalListId.setValue(item._id)
        Swal.fire({
            title: 'Do you want to Delete ?',
            showCancelButton: true,
            icon: 'error',
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                this.api.DeleteDefect(this.ModalListId.value).subscribe((data: any) => {
                    if (data != null) {
                        Swal.fire('Deleted!', '', 'success')
                        this.OnSetToggleTable();
                        this.alertSuccess();
                        this.ModalListName.reset();
                        this.ModalListId.reset();
                        this.Modal_Defects.reset();
                    }
                })
            }
        })
    }
    onDeleteOccur(item) {
        this.ModalListName.setValue(item.name)
        this.ModalListId.setValue(item._id)
        Swal.fire({
            title: 'Do you want to Delete ?',
            showCancelButton: true,
            icon: 'error',
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                this.api.DeleteOccurB(this.ModalListId.value).subscribe((data: any) => {
                    if (data != null) {
                        Swal.fire('Deleted!', '', 'success')
                        this.OnSetToggleTable();
                        this.alertSuccess();
                        this.ModalListName.reset();
                        this.ModalListId.reset();
                        this.Modal_Defects.reset();
                    }
                })
            }
        })
    }
    onDeleteCause(item) {
        this.ModalListName.setValue(item.name)
        this.ModalListId.setValue(item._id)
        Swal.fire({
            title: 'Do you want to Delete ?',
            showCancelButton: true,
            icon: 'error',
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                this.api.DeleteList(this.ModalListId.value).subscribe((data: any) => {
                    if (data != null) {
                        Swal.fire('Deleted!', '', 'success')
                        this.OnSetToggleTable();
                        this.alertSuccess();
                    }
                })
            }
        })
    }

    ModalEditModelNumber(content, item) {
        this.Modal_ModelNumbers.controls.name.setValue(item.name)
        this.ModalListId.setValue(item._id)
        this.Modal_ModelNumbers.controls.size.setValue(item.size)
        this.Modal_ModelNumbers.controls.customer.setValue(item.customer)
        this.md.open(content, { size: 'lg' });
    }
    onEditModelNumber() {
        const ans = confirm("Update ?")
        if (ans == true) {
            const tempData = {
                name: this.Modal_ModelNumbers.controls.name.value,
                size: this.Modal_ModelNumbers.controls.size.value,
                customer: this.Modal_ModelNumbers.controls.customer.value
            }
            this.api.UpdateList(this.ModalListId.value, tempData).subscribe((data) => {
                // console.log("UPDATE LOG", data);
                if (data != null) {
                    this.OnSetToggleTable();
                    this.alertSuccess();
                    this.ModalListId.reset();
                    this.Modal_ModelNumbers.reset();
                }
            })
        }
    }

    ModalEditDefect(content, item) {
        this.ModalListId.setValue(item._id)
        this.Modal_Defects.controls.name.setValue(item.defectName)
        this.Modal_Defects.controls.code.setValue(item.defectCode)
        this.Modal_CBModel.reset();
        item.modelName1 ? this.Modal_CBModel.controls.PNL.setValue(true) : false
        item.modelName2 ? this.Modal_CBModel.controls.MDL.setValue(true) : false
        item.modelName3 ? this.Modal_CBModel.controls.SMT.setValue(true) : false
        item.modelName4 ? this.Modal_CBModel.controls.AMT.setValue(true) : false
        item.modelName5 ? this.Modal_CBModel.controls.AMTFM.setValue(true) : false
        item.modelName6 ? this.Modal_CBModel.controls.DSTFM.setValue(true) : false

        this.md.open(content, { size: 'lg' });
    }
    onEditDefect() {
        const ans = confirm("Update ?")
        if (ans == true) {
            let arrModelName = [];
            this.Modal_CBModel.controls.PNL.value == true ? arrModelName[0] = "PNL" : false
            this.Modal_CBModel.controls.MDL.value == true ? arrModelName[1] = "MDL" : false
            this.Modal_CBModel.controls.SMT.value == true ? arrModelName[2] = "SMT" : false
            this.Modal_CBModel.controls.AMT.value == true ? arrModelName[3] = "AMT" : false
            this.Modal_CBModel.controls.AMTFM.value == true ? arrModelName[4] = "AMT_FM" : false
            this.Modal_CBModel.controls.DSTFM.value == true ? arrModelName[5] = "DST_FM" : false
            const tempData = {
                defectName: this.Modal_Defects.controls.name.value,
                defectCode: this.Modal_Defects.controls.code.value,
                modelName1: arrModelName[0] || null,
                modelName2: arrModelName[1] || null,
                modelName3: arrModelName[2] || null,
                modelName4: arrModelName[3] || null,
                modelName5: arrModelName[4] || null,
                modelName6: arrModelName[5] || null
            }
            // console.log(tempData);
            // console.log((this.ModalListId.value));

            this.api.UpdateDefect(this.ModalListId.value, tempData).subscribe((data) => {
                // console.log("UPDATE LOG", data);
                if (data != null) {
                    this.OnSetToggleTable();
                    this.alertSuccess();
                    this.ModalListId.reset();
                    this.Modal_Defects.reset();
                    this.Modal_CBModel.reset();
                }
            })
        }
    }


    onSelectModalOccurA() {
        this.OccurAList.forEach(element => {
            element.name == this.Modal_Occurs.controls.occurA.value ? this.Modal_Occurs.controls.occurAId.setValue(element._id) : false

            element.name == this.Occurs.controls.occurA.value ? this.Occurs.controls.occurAId.setValue(element._id) : false
        });

    }
    ModalEditOccur(content, item) {
        this.ModalListId.setValue(item._id)
        this.Modal_Occurs.controls.occurAId.setValue(item.idOccurA)
        this.Modal_Occurs.controls.occurA.setValue(item.nameOccurA)
        this.Modal_Occurs.controls.name.setValue(item.name)

        this.md.open(content, { size: 'lg' });
    }
    onEditOccur() {
        const ans = confirm("Update ?")
        if (ans == true) {
            const tempData = {
                idOccurA: this.Modal_Occurs.controls.occurAId.value,
                nameOccurA: this.Modal_Occurs.controls.occurA.value,
                name: this.Modal_Occurs.controls.name.value
            }
            // console.log(tempData);
            this.api.UpdateOccurB(this.ModalListId.value, tempData).subscribe((data) => {
                if (data != null) {
                    this.OnSetToggleTable();
                    this.alertSuccess();
                    this.ModalListId.reset();

                }
            })
        }
    }


    ModalEditCause(content, item) {
        this.ModalListId.setValue(item._id)
        this.Modal_Causes.controls.modelName.setValue(item.nameModel)
        this.Modal_Causes.controls.name.setValue(item.name)

        this.md.open(content, { size: 'lg' });
    }

    onEditCause() {
        const ans = confirm("Update ?")
        if (ans == true) {
            const tempData = {
                name: this.Modal_Causes.controls.name.value,
                nameModel: this.Modal_Causes.controls.modelName.value
            }
            // console.log(tempData);
            this.api.UpdateList(this.ModalListId.value, tempData).subscribe((data) => {
                if (data != null) {
                    this.OnSetToggleTable();
                    this.alertSuccess();
                    this.ModalListId.reset();
                }
            })
        }
    }

    ModalExcel(content) {
        this.md.open(content, { size: 'lg' });
    }

    onSelectModalExcelMaster() {
        this.DataTempDownload = null;
        this.Master.forEach(element => {
            element.name == this.ModalExcelMaster.value ? this.ModalExcelMasterId = element._id : false
        });
        this.DataTempDownload = this.DataExcelList.filter(item => item.nameMaster == this.ModalExcelMaster.value)
        // this.DataTempDownload = this.DataExcelList.filter(item => item.nameMaster == this.ModelNumberMasterFix)
        // console.log("this.DataTempDownload", this.DataTempDownload);
        console.log(this.DataTempDownload);


        this.api.GetDefectAll().subscribe((dataRes) => { this.DataExcelDefect = dataRes })
        this.api.GetOccurBAll().subscribe((dataRes) => { this.DataExcelOccur = dataRes })


    }
    downloadExcel() {
        this.jsonToExcelData = [];
        if (this.ModalExcelMasterId) {
            if (this.ModalExcelMaster.value == this.ProductionPhase ||
                this.ModalExcelMaster.value == this.DefectCategory ||
                this.ModalExcelMaster.value == this.Abnormal ||
                this.ModalExcelMaster.value == this.Source) {
                this.setDataExportExcelForNormal();
            } else if (this.ModalExcelMaster.value == this.CauseMasterFix) {
                this.setDataExportExcelForCause();
            } else if (this.ModalExcelMaster.value == this.ModelNumberMasterFix) {
                this.setDataExportExcelForModelNumber();
            } else if (this.ModalExcelMaster.value == this.DefectMasterFix) {
                this.setDataExportExcelForDefect();
            } else if (this.ModalExcelMaster.value == this.OccurMasterFix) {
                this.setDataExportExcelForOccur();
            }


        } else {
            alert("Please Select Master!!")
        }
    }

    setDataExportExcelForNormal() {
        let tempData = {
            idMaster: this.DataTempDownload[0].idMaster,
            nameMaster: this.DataTempDownload[0].nameMaster,
            name: this.DataTempDownload[0].name + ' ( FILL COLUM )',
            // nameModel: this.DataTempDownload[0].nameModel || null,
            NOTE: "idMaster: copy follow | nameMaster: copy follow | name: Fill "
        }
        this.jsonToExcelData.push(tempData)


        const workSheet = XLSX.utils.json_to_sheet(this.jsonToExcelData);
        const workBook = {
            Sheets: {
                'data': workSheet
            },
            SheetNames: ['data']
        };
        const fileName = this.ModalExcelMaster.value + '.xlsx';
        XLSX.writeFile(workBook, fileName);
    }
    setDataExportExcelForCause() {
        let tempData = {
            idMaster: this.DataTempDownload[0].idMaster,
            nameMaster: this.DataTempDownload[0].nameMaster,
            name: this.DataTempDownload[0].name + ' ( FILL COLUM )',
            nameModel: this.DataTempDownload[0].nameModel + ' ( FILL COLUM )',
            NOTE: "idMaster: copy follow | nameMaster: copy follow | name: Fill | nameModel: Fill once of ( PNL, MDL, SMT, AMT, AMT_FM, DST_FM)"
        }
        this.jsonToExcelData.push(tempData)
        const workSheet = XLSX.utils.json_to_sheet(this.jsonToExcelData);
        const workBook = {
            Sheets: {
                'data': workSheet
            },
            SheetNames: ['data']
        };
        const fileName = this.ModalExcelMaster.value + '.xlsx';
        XLSX.writeFile(workBook, fileName);
    }
    setDataExportExcelForModelNumber() {
        let tempData = {
            idMaster: this.DataTempDownload[0].idMaster,
            nameMaster: this.DataTempDownload[0].nameMaster,
            name: this.DataTempDownload[0].name + ' ( FILL COLUM )',
            size: this.DataTempDownload[0].size + ' ( FILL COLUM )',
            customer: this.DataTempDownload[0].customer + ' ( FILL COLUM )',
            NOTE: "idMaster: copy follow | nameMaster: copy follow | name: Fill | size: Fill | customer: Fill"
        }
        // console.log(tempData);

        this.jsonToExcelData.push(tempData)
        const workSheet = XLSX.utils.json_to_sheet(this.jsonToExcelData);
        const workBook = {
            Sheets: {
                'data': workSheet
            },
            SheetNames: ['data']
        };
        const fileName = this.ModalExcelMaster.value + '.xlsx';
        XLSX.writeFile(workBook, fileName);
    }
    setDataExportExcelForDefect() {
        let tempData = {
            idMaster: this.DataExcelDefect[0].idMaster,
            defectName: this.DataExcelDefect[0].defectName + ' ( FILL COLUM )',
            defectCode: this.DataExcelDefect[0].defectCode + ' ( FILL COLUM )',
            modelName1: this.DataExcelDefect[0].modelName1 + ' ( FILL COLUM )',
            modelName2: this.DataExcelDefect[0].modelName2 + ' ( FILL COLUM )',
            modelName3: this.DataExcelDefect[0].modelName3 + ' ( FILL COLUM )',
            modelName4: this.DataExcelDefect[0].modelName4 + ' ( FILL COLUM )',
            modelName5: this.DataExcelDefect[0].modelName5 + ' ( FILL COLUM )',
            modelName6: this.DataExcelDefect[0].modelName6 + ' ( FILL COLUM )',
            NOTE: "idMaster: copy follow | defectName: Fill | defectCode: Fill "
        }
        this.jsonToExcelData.push(tempData)
        const workSheet = XLSX.utils.json_to_sheet(this.jsonToExcelData);
        // const workSheet = XLSX.utils.json_to_sheet(this.DataExcelDefect);
        const workBook = {
            Sheets: {
                'data': workSheet
            },
            SheetNames: ['data']
        };
        const fileName = this.ModalExcelMaster.value + '.xlsx';
        XLSX.writeFile(workBook, fileName);
    }

    setDataExportExcelForOccur() {
        let tempData = {
            idOccurA: this.DataExcelOccur[0].idOccurA,
            nameOccurA: this.DataExcelOccur[0].nameOccurA,
            name: this.DataExcelOccur[0].name,
            NOTE: "idMaster: copy follow | defectName: Fill | defectCode: Fill "
        }
        this.jsonToExcelData.push(tempData)
        const workSheet = XLSX.utils.json_to_sheet(this.jsonToExcelData);
        // const workSheet = XLSX.utils.json_to_sheet(this.DataExcelDefect);
        const workBook = {
            Sheets: {
                'data': workSheet
            },
            SheetNames: ['data']
        };
        const fileName = this.ModalExcelMaster.value + '.xlsx';
        XLSX.writeFile(workBook, fileName);
    }




    UploadExcel(evt: any) {

        // console.log(this.ExcelMasterName.status);
        // console.log(evt.target.files[0]);
        if (this.ModalExcelMaster.valid) {
            const ans = confirm("Upload ?");
            if (ans == true) {
                this.ExcelDataJson = null;
                const selectedFile = evt.target.files[0];
                const fileReader = new FileReader();
                fileReader.readAsBinaryString(selectedFile);
                fileReader.onload = (e: any) => {
                    let binaryData = e.target.result;
                    let workBook = XLSX.read(binaryData, { type: 'binary' })
                    workBook.SheetNames.forEach(sheet => {
                        this.ExcelDataJson = XLSX.utils.sheet_to_json(workBook.Sheets[sheet])
                        // console.log(this.ExcelDataJson);

                        if (this.ModalExcelMaster.value == this.ProductionPhase ||
                            this.ModalExcelMaster.value == this.DefectCategory ||
                            this.ModalExcelMaster.value == this.Abnormal ||
                            this.ModalExcelMaster.value == this.Source ||
                            this.ModalExcelMaster.value == this.CauseMasterFix ||
                            this.ModalExcelMaster.value == this.ModelNumberMasterFix) {
                            this.insertExcelNormal();
                        } else if (this.ModalExcelMaster.value == this.DefectMasterFix) {
                            this.insertExcelDefect();
                        } else if (this.ModalExcelMaster.value == this.OccurMasterFix) {
                            this.insertExcelOccur();
                        }



                    })
                    // console.log(workBook);

                }
            }
        } else {
            alert("PLS SELECT");
            location.reload();
        }



    }

    insertExcelNormal() {
        this.api.PostList(this.ExcelDataJson).subscribe((data: any) => {
            if (data.length > 0) {
                this.alertSuccess();
            } else {
                this.alertError();
            }
        })
    }
    insertExcelDefect() {
        this.api.PostDefect(this.ExcelDataJson).subscribe((data: any) => {
            if (data.length > 0) {
                this.alertSuccess();
            } else {
                this.alertError();
            }
        })
    }

    insertExcelOccur() {
        this.api.PostOccur(this.ExcelDataJson).subscribe((data: any) => {
            if (data.length > 0) {
                this.alertSuccess();
            } else {
                this.alertError();
            }
        })
    }

    // ? ********************************************************OPEN  Modal



    // ? ********************************************************ALERT
    alertSuccess() {
        Swal.fire({
            title: 'SUCCESS',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
        })
    }
    alertError() {
        Swal.fire({
            title: 'Error',
            icon: 'error',
            showConfirmButton: false,
            timer: 1000
        })
    }

    alertConfirmDel() {
        Swal.fire({
            title: 'Do you want to Delete ?',
            showCancelButton: true,
            icon: 'error',
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                this.api.DeleteList(this.ModalListId.value).subscribe((data: any) => {
                    if (data != null) {
                        Swal.fire('Deleted!', '', 'success')
                        this.OnSetToggleSelect();
                        this.alertSuccess();
                        this.ModalListName.reset();
                        this.ModalListId.reset();
                    }
                })
            }
        })
    }
    // ? ********************************************************ALERT




    // ? FUNCTION

    // * Sort Data
    numPage(data, value) {
        let num = Math.ceil(data.length / value)
        return num
    }
    DataTableStart() {
        this.DataNum.enable()
        this.WordFilter.enable()
        this.PageNow = 1
        let DataNum = this.NumList[1]
        this.NoData = 1
        this.DataNum.setValue(DataNum)
        let arr = this.List

        this.PageNum = this.numPage(arr, DataNum)
        let result: any = this.paginate(arr, DataNum, this.PageNow)
        this.ResultFilter = result

        // console.log(result);
    }
    sort(arr, pageNow, dataNum,) {
        return this.paginate(arr, dataNum, pageNow)
    }


    paginate(array, page_size, page_number) {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    }

    next() {
        if (this.PageNow < this.PageNum) {
            this.PageNow += 1;
            this.ResultFilter = this.sort(this.List, this.PageNow, this.DataNum.value)
            this.NoData = (this.DataNum.value * this.PageNow) + 1


        }
    }
    back() {
        if (this.PageNow > 1) {
            this.PageNow -= 1;
            this.ResultFilter = this.sort(this.List, this.PageNow, this.DataNum.value)
            if (this.PageNow == 1) {
                this.NoData = 1
            } else {
                this.NoData = (this.DataNum.value * this.PageNow) + 1
            }
        }
    }

    onChangeDataNum() {
        this.NoData = 1;
        this.PageNow = 1;

        if (this.DataNum.value == "ALL") {
            this.PageNum = this.numPage(this.List, 999999)
            this.ResultFilter = this.sort(this.List, this.PageNow, 999999)

        } else {
            this.PageNum = this.numPage(this.List, this.DataNum.value)
            this.ResultFilter = this.sort(this.List, this.PageNow, this.DataNum.value)
        }
    }

    // onFilter() {
    //     let temp = this.ResultFilter
    //     if (this.WordFilter.valid) {
    //         let a = temp.filter(i => i.name.includes(this.WordFilter.value))
    //         console.log(a);
    //         this.ResultFilter = a
    //     } else {
    //         console.log("NULL");
    //         console.log(this.TempResultFilter);

    //         this.ResultFilter = this.TempResultFilter
    //     }
    //     console.log(this.WordFilter.value);

    // }



    // get ModalDefetCode() { return this.DefectGroup.get('ModalDefetCode') }
    // get ModalDefetName() { return this.DefectGroup.get('ModalDefetName') }
    // get CheckBoxDefectStatus() { return this.DefectGroup.get('CheckBoxDefectStatus') }



}
