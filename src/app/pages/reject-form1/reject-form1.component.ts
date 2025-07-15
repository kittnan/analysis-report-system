import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment.prod'
import Swal from 'sweetalert2'
import { HttpService } from 'app/service/http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';


@Component({
  selector: 'app-reject-form1',
  templateUrl: './reject-form1.component.html',
  styleUrls: ['./reject-form1.component.css', '../pagesStyle.css']
})
export class RejectForm1Component implements OnInit {
  constructor(
    // private api: RejectForm1Service,
    // private api: RequestServiceService,
    private modalService: NgbModal,
    private api: HttpService,
    private route: Router,
    private routerActive: ActivatedRoute
    // private progressForm3: ProgressForm3Service,
  ) {
    this.routerActive.queryParams.subscribe((param: Params) => {
      if (param) {
        this.formId = param['formId']
      }
    })
  }

  // ? Params
  formId: null | string = null

  // ? Form Conttrol
  RequestForm = new FormGroup({
    RequestItem: new FormControl(null, Validators.required),
    RequestNumber: new FormControl("-", Validators.required),
    IssueDate: new FormControl(null, Validators.required),
    ReplyDate: new FormControl(null, Validators.required),
    RequestSection: new FormControl("-", Validators.required),
    ModelNumber: new FormControl(null, Validators.required),
    Size: new FormControl(null, Validators.required),
    Customer: new FormControl(null, Validators.required),
    LotNumber: new FormControl(null,),
    DefectName: new FormControl(null, Validators.required),
    DefectCode: new FormControl("null", Validators.required),
    InputQ: new FormControl(null, [Validators.required, Validators.min(1)]),
    NGQ: new FormControl(null, Validators.required),
    NGR: new FormControl(null, Validators.required),
    SendNG: new FormControl(null, Validators.required),
    ProductPhase: new FormControl(null, Validators.required),
    DefectCategory: new FormControl(null, Validators.required),
    ClaimNo: new FormControl(null),
    OccurA: new FormControl(null, Validators.required),
    OccurB: new FormControl(null, Validators.required),
    Abnormal: new FormControl(null, Validators.required),
    Issuer: new FormControl(null, Validators.required),
    Aprrove: new FormControl(null, Validators.required),
    TempDefectName: new FormControl(null),
    TempModelNumber: new FormControl(null),
    TBN: new FormControl(null, Validators.required),
    TBNNumber: new FormControl(null),
    Treatment: new FormControl(null, Validators.required),
  })

  NoteApprove = new FormControl(null);
  NoteReject = new FormControl(null);




  // ? Variable API
  Model: any;
  FormByModel: any;
  ModelNumberList: any;
  ProductPhaseList: any;
  DefectCategoryList: any;
  OccurAList: any;
  OccurBList: any;
  AbnormalLevelList: any;
  DefectList: any;
  ApproveList: any;
  AeEngList: any;
  form: any;

  // ? Variable
  ModelName: any;
  OccurAName: any;
  ApproveName: any;
  UserLevel = [];

  // FileName: any;
  filterdOptions = [];
  ApproveSection: any;
  // *upload
  // FileTemp: any;
  // FileListname = [];
  // PathListName = [];
  FileList: any = [];
  fileInput = new FormControl(null)

  // ? Fix Id
  IdModelNumber = environment.IdModelNumber;
  IdProductPhase = environment.IdProductPhase;
  IdDefectCategory = environment.IdDefectCategory;
  IdAbnormalLevel = environment.IdAbnormalLevel;

  // ? Date
  dateToDay: any = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  };
  MinDate1: any;
  MaxDate1: any;
  MinDate2: any;

  // ? Session
  UserSection1Id: any = localStorage.getItem('AR_UserSection1Id');

  // ? Toggle
  ToggleTest: any = false;
  ModelNumberToggle: any = false
  ModelNumberFilter: any;

  // ? Email
  SendEmailUser: any;

  // ? comment
  CommentLists: any = [];

  ngOnInit(): void {
    this.CheckStatusUser();
    this.GetRequestForm();
    this.GetModel();
    this.GetModelNumberList();
    this.GetProductPhaseList();
    this.GetDefectCategoryList();
    this.GetAbnormalLevel();
    // this.GetDefect();
    this.SetUserStatus();
    this.SetDatePicker();
    // this.OnChangeOccurA();

  }

  CheckStatusUser() {
    let LevelList = [];
    LevelList.push(localStorage.getItem('AR_UserLevel1'))
    LevelList.push(localStorage.getItem('AR_UserLevel2'))
    LevelList.push(localStorage.getItem('AR_UserLevel3'))
    LevelList.push(localStorage.getItem('AR_UserLevel4'))
    LevelList.push(localStorage.getItem('AR_UserLevel5'))
    LevelList.push(localStorage.getItem('AR_UserLevel6'))
    const Level = LevelList.filter(lvl => (lvl == '1') || (lvl == '0') || (lvl == '3'))
    // console.log(Level.length);

    if (Level.length == 0) {
      // alert("No access!!");
      this.route.navigate(['/manageForm'])
      // location.href = "#/manageForm"
    }
  }





  // ? APi

  GetModel() {
    this.api.GetModel().subscribe((data: any) => {
      if (data.length > 0) {
        this.Model = data;
      } else {
        this.Model = null;
      }
    })
  }

  GetModelNumberList() {
    this.api.GetListByIdMaster(this.IdModelNumber).subscribe((data: any) => {
      if (data.length > 0) {
        this.ModelNumberList = data;
        this.ModelNumberFilter = data;
      } else {
        this.ModelNumberList = null;
      }
    })
  }

  GetProductPhaseList() {
    this.api.GetListByIdMaster(this.IdProductPhase).subscribe((data: any) => {
      if (data.length > 0) {
        this.ProductPhaseList = data;
      } else {
        this.ProductPhaseList = null;
      }
    })
  }
  GetDefectCategoryList() {
    this.api.GetListByIdMaster(this.IdDefectCategory).subscribe((data: any) => {
      if (data.length > 0) {
        this.DefectCategoryList = data;
      } else {
        this.DefectCategoryList = null;
      }
    })
  }
  GetOccurAList(name: any) {

    // ? เช็ค model ว่าเป็น FM ไหม ถ้าเป็น ให้ get occur all
    if (name.includes('FM')) {
      this.api.GetOccurAAll().subscribe((data: any) => {
        if (data.length > 0) {
          this.OccurAList = data;
        } else {
          this.OccurAList = null;
        }
      })
    } else {
      this.api.GetOccurAByName(name).subscribe((data: any) => {
        if (data.length > 0) {
          this.OccurAList = data;

        } else {
          this.OccurAList = null;
        }
      })
    }


  }

  GetOccurBList() {

    this.api.GetOccurB(this.OccurA.value).subscribe((data: any) => {
      if (data.length > 0) {
        this.OccurBList = data;
      } else {
        this.OccurBList = null;
      }
    })
  }

  GetAbnormalLevel() {
    this.api.GetListByIdMaster(this.IdAbnormalLevel).subscribe((data: any) => {
      if (data.length > 0) {
        this.AbnormalLevelList = data;
      } else {
        this.AbnormalLevelList = null;
      }
    })
  }

  // GetDefect() {
  //   this.rs.GetDefect().then((data: any) => {
  //     if (data.length > 0) {
  //       this.DefectList = data;
  //     }
  //   })
  // }

  GetDefectByModelName() {
    // console.log(this.RequestItem.value);

    this.api.GetDefectByModelName(this.RequestItem.value).subscribe((data: any) => {
      if (data.length > 0) {
        this.DefectList = data;
        // console.log(data);
      }
    })
  }


  GetApprove() {
    this.Aprrove.reset();
    this.ApproveName = null;
    if (this.RequestSection.valid) {
      this.api.GetApprove(this.RequestSection.value, 2).subscribe((data: any) => {
        if (data.length > 0) {
          // this.ApproveList = data;
          const MyUserId = localStorage.getItem('AR_UserId')
          this.ApproveList = data.filter(user => user._id != MyUserId)
        } else {
          this.ApproveList = [];
        }
      })
    }
  }

  GetRequestForm() {
    let d = this.formId;
    this.api.FindFormById(d).subscribe((data: any) => {
      // console.log(data);
      this.form = data
      if (data) {
        this.RequestItem.setValue(data.requestItem);
        this.RequestNumber.setValue(data.requestNumber);
        this.RequestSection.setValue(data.requestFormSectionName);
        this.ModelNumber.setValue(data.ktcModelNumber);
        this.Size.setValue(data.size);
        this.Customer.setValue(data.customer);
        // this.OnkeyUpModelNumber();
        this.LotNumber.setValue(data.pcLotNumber);
        this.TBN.setValue(data.TBN);
        this.TBNNumber.setValue(data.TBNNumber);
        this.DefectName.setValue(data.defectiveName);
        this.DefectCode.setValue(data.defectiveCode);
        this.InputQ.setValue(data.inputQuantity);
        this.NGQ.setValue(data.ngQuantity);
        this.NGR.setValue(data.ngRatio);
        this.SendNG.setValue(data.sendNgAnalysis);
        this.ProductPhase.setValue(data.productionPhase);
        this.DefectCategory.setValue(data.defectCatagory);
        this.ClaimNo.setValue(data.claimNo);
        this.OccurA.setValue(data.occurAId);
        this.OccurAName = data.occurAName;
        this.OccurB.setValue(data.occurBName);
        this.Abnormal.setValue(data.abnormalLotLevel);
        this.Issuer.setValue(data.issuer);
        this.Treatment.setValue(data.treatment);
        this.GetOccurAList(data.requestItem);
        this.GetOccurBList();
        this.FileList = data.files;
        // this.SetPathFile();
        this.NoteReject.setValue(data.noteNow);

        let str = data.issuedDate.split("T");
        let str2 = data.replyDate.split("T");
        data.issuedDate = str[0];
        data.replyDate = str2[0];
        this.IssueDate.setValue(data.issuedDate);
        this.ReplyDate.setValue(data.replyDate);

        this.GetApprove();
        this.GetDefectByModelName();
        this.onChangeDefectCategory()
      }

    })
  }




  // ? Event
  // todo change TBN
  onChangeTBN() {
    if (this.TBN.value === 'normal') {
      this.TBNNumber.setValidators(null)
      this.TBNNumber.updateValueAndValidity()
      this.TBNNumber.setValue(null)
    } else {
      this.TBNNumber.setValidators(Validators.required)
      this.TBNNumber.updateValueAndValidity()
    }
  }
  // todo เลือก Occur A แล้ว ยิงapi ไป get ค่า ของ occurB
  OnChangeOccurA() {
    // console.log(this.OccurA);
    if (this.OccurA.valid) {
      this.OccurB.reset();
      this.GetOccurBList();
      this.OccurAList.forEach(i => {
        if (i._id == this.OccurA.value) {
          this.OccurAName = i.name;
        }
      });
    }
  }

  OnClickFilter(item: any) {

    this.DefectList.forEach(i => {
      if (i._id == this.TempDefectName.value) {
        this.DefectName.setValue(i.defectName);
        this.DefectCode.setValue(i.defectCode);
      }
    });
  }

  // todo filter
  filterUsers() {
    this.filterdOptions = this.DefectList.filter(
      item => item.defectName.toLowerCase().includes(this.DefectName.value.toLowerCase())
    );
  }

  ToggleFilterModelNumber() {
    this.ModelNumberToggle = !this.ModelNumberToggle;
  }
  OnkeyUpModelNumber() {
    this.ModelNumberFilter = this.ModelNumberList.filter(
      item => item.name.toLowerCase().includes(this.ModelNumber.value.toLowerCase())
    )
  }
  SetModelNum() {
    this.ModelNumber.setValue(this.TempModelNumber.value)
    const temp = this.ModelNumberList.filter(item => item.name == this.TempModelNumber.value)
    this.Size.setValue(temp[0].size)
    this.Customer.setValue(temp[0].customer)
  }

  // todo Lock Number
  CheckNumber() {
    if (this.InputQ.value <= 0) {
      this.InputQ.reset();
    }
    if (this.NGQ.value > this.InputQ.value) {
      this.NGQ.setValue(this.InputQ.value);
    }

  }
  CheckNumber2() {
    if (this.NGQ.value <= 0) {
      this.NGQ.reset();
    }
    if (this.NGQ.value > this.InputQ.value) {
      this.NGQ.setValue(this.InputQ.value);
    }
    if (this.SendNG.value > this.NGQ.value) {
      this.SendNG.setValue(this.NGQ.value);
    }
  }
  CheckNumber3() {
    if (this.SendNG.value <= 0) {
      this.SendNG.reset();
    }
    if (this.SendNG.value > this.NGQ.value) {
      this.SendNG.setValue(this.NGQ.value);
    }
  }
  SetRatio() {
    if (this.InputQ.valid && this.NGQ.valid) {
      const Sum = (this.NGQ.value / this.InputQ.value) * 100;
      this.NGR.setValue(Sum);
    } else {
      this.NGR.reset();
    }
  }

  OnApproveChange() {

    this.ApproveList.forEach(i => {

      if (i._id == this.Aprrove.value) {
        let Fname = i.FirstName;
        let Lname = i.LastName;
        let str = Lname.substring(0, 1);
        this.ApproveName = Fname + " " + str + ".";
        this.SendEmailUser = i;

      }
    });
  }

  upload(event) {
    let file = event.target.files[0];


    Swal.fire({
      title: 'Do you have upload file ?',
      text: `Upload ${file.name} ?`,
      icon: 'question',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.FileList.length == 3) {
          this.fileInput.reset();
          Swal.fire({
            icon: 'error',
            title: 'Limit 3 Files.!!',
            text: 'Try Again',
          })
        } else {
          if (file.size <= 5242880) {

            if (this.FileList.filter(item => item.name == file.name).length > 0) {
              this.fileInput.reset();
              Swal.fire({
                icon: 'error',
                title: 'File duplicate',
                text: 'Try Again',
              })
            } else {

              let name = `${this.RequestNumber.value}!${file.name}`
              let tempFileList = this.FileList
              this.api.UploadFile(file, name).then(async (res) => {
                const path = await res
                const dateSet = {
                  path: path,
                  name: name,
                  size: file.size
                }
                this.FileList.push(dateSet);
                const dataToApi = {
                  issuedDate: this.IssueDate.value,
                  replyDate: this.ReplyDate.value,
                  files: this.FileList
                }

                this.api.UpadateRequestForm(this.formId, dataToApi).subscribe((data: any) => {
                  if (data) {
                    this.fileInput.reset();
                    this.alertSuccess();
                  } else {
                    this.FileList = tempFileList;
                    Swal.fire({
                      icon: 'error',
                      title: 'File duplicate',
                      text: 'Try Again',
                    })
                  }
                })
              })
            }


          } else {
            alert("File limit size 5Mb");
          }
        }
      }
    })



    // const ans = confirm("Upload " + event.target.files[0].name + " ?");

  }
  onChangeDefectCategory() {
    if ((this.DefectCategory.value.toLowerCase()).includes('claim')) {
      this.ClaimNo.enable()
    } else {
      this.ClaimNo.reset()
      this.ClaimNo.disable()
    }
  }

  OnClickDeleteFile(file: any) {

    Swal.fire({
      title: 'Do you have remove file ?',
      text: `Remove ${file.name} ?`,
      icon: 'question',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {


        const IdForm = this.formId
        this.api.RemoveFile(file).then((data: any) => {
          if (data) {
            const indexOfFile = this.FileList.indexOf(file);
            // console.log(indexOfFile);
            this.FileList.splice(indexOfFile, 1)
            const data = {
              issuedDate: this.IssueDate.value,
              replyDate: this.ReplyDate.value,
              file: this.FileList
            }
            this.api.UpadateRequestForm(IdForm, data).subscribe((data: any) => {
              if (data) {
                this.alertSuccess();
              }
            })
          }
        })
      }
    })
  }


  openModalApprove(content) {
    this.modalService.open(content, { size: 'lg' });
  }


  // todo When Submit
  OnApprove() {

    Swal.fire({
      title: 'Do you want to Submit ?',
      showCancelButton: true,
      icon: 'success',
      confirmButtonText: 'SubFmit',
    }).then((result) => {
      if (result.isConfirmed) {

        if (this.RequestNumber.valid) {
          this.api.SearchReqeustForm(this.RequestNumber.value).subscribe((data: any) => {
            if (data.length < 0) {
              alert("error");
              // window.scrollTo(0, 0);
            } else {
              let da = {
                issuedDate: this.IssueDate.value,
                replyDate: this.ReplyDate.value,
                ktcModelNumber: this.ModelNumber.value,
                size: this.Size.value,
                customer: this.Customer.value,
                pcLotNumber: this.LotNumber.value || '-',
                TBN: this.TBN.value,
                TBNNumber: this.TBNNumber.value,
                defectiveCode: this.DefectCode.value,
                defectiveName: this.DefectName.value,
                inputQuantity: this.InputQ.value,
                ngQuantity: this.NGQ.value,
                ngRatio: this.NGR.value,
                sendNgAnalysis: this.SendNG.value,
                productionPhase: this.ProductPhase.value,
                defectCatagory: this.DefectCategory.value,
                claimNo: this.ClaimNo.value,
                occurAId: this.OccurA.value,
                occurAName: this.OccurAName,
                occurBName: this.OccurB.value,
                abnormalLotLevel: this.Abnormal.value,
                issuer: this.Issuer.value,
                userApprove: this.Aprrove.value,
                userApproveName: this.ApproveName,
                userApprove1: this.Aprrove.value,
                userApprove1Name: this.ApproveName,
                status: 1,
                noteApprove1: this.NoteApprove.value,
                noteNow: this.NoteApprove.value

              }
              // console.log(da);
              this.api.UpadateRequestForm(this.formId, da).subscribe((data: any) => {
                let Fname = localStorage.getItem('AR_UserFirstName')
                let Lname = localStorage.getItem('AR_UserLastName')
                if (data) {
                  const Content = "<p>To " + this.SendEmailUser.FirstName + " " + this.SendEmailUser.LastName + "(Requestor approval)</p><br>" +
                    "Please approve analysis request as below link : <a href='http://10.200.90.152:8081/Analysis-Report/'>http://10.200.90.152:8081/Analysis-Report/</a><br><br>" +
                    "<p>From " + Fname + " " + Lname + "(Issuer)</p>";

                  const sendMail = {
                    Content: Content,
                    To: this.SendEmailUser.Email,
                    From: "<Analysis-System@kyocera.co.th>",
                    Subject: "Please approve analysis request : " + this.RequestNumber.value + " / Model  " + this.ModelNumber.value + " " + this.Size.value + " " +
                      this.Customer.value + " Lot no. " + this.LotNumber.value + "from " + this.OccurAName + " " + this.OccurB.value + " = " + this.NGQ.value + "pcs."
                  }
                  // console.log("sendMail", sendMail);
                  this.api.SendEmailTo(sendMail).subscribe((data: any) => {
                    // console.log("Send mail ", data);
                    this.alertSuccess();
                    // location.href = "#/manageForm";
                    this.route.navigate(['/manageForm'])

                  })
                }
              })
            }
          })
        }
      }
    })


  }

  async oncancel() {
    Swal.fire({
      title: 'Do you want to Cancel ?',
      showCancelButton: true,
      icon: 'error',
      confirmButtonText: 'OK',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const a = await this.deleteEngFile();
        const b = await this.deleteRequesterFile();
        const c = await this.updateRequestForm()
      }
    })
  }

  async deleteEngFile() {
    // console.log('1');

    this.api.FindResultByFormIdMain(this.formId).subscribe((data: any) => {
      if (data.length > 0) {
        const result = data[0]
        const files = result.files
        //  * ลบfile report
        if (result.file) {
          // const reportFile = (result.file.split('/'))[6]
          const reportFile = (result.file.split('/'))[5]
          const temp = {
            name: reportFile
          }
          this.api.RemoveReport(temp).then(async (data: any) => {
            if (data) {
              await data
            }
          })
        }

        //  * ลบfile ของ result
        if (files.length > 0) {
          files.forEach(fileEng => {
            const temp = {
              name: fileEng.name
            }
            this.api.RemoveFileEng(temp).then(async (data) => {
              if (data) {
                const a = await data
              }
            })
          });
        }

      }
    })
  }
  async deleteRequesterFile() {
    // console.log('2');

    if (this.FileList.length > 0) {
      this.FileList.forEach(file => {
        // console.log(file);
        const temp = {
          name: file.name
        }
        this.api.RemoveFile(temp).then(async (data: any) => {
          if (data) {
            const a = await data
          }
        })
      });

    }
  }

  async updateRequestForm() {

    this.api.FindResultByFormIdMain(this.formId).subscribe((data: any) => {
      if (data.length > 0) {
        const result = data[0];
        const dataResult = {
          startAnalyzeDate: result.startAnalyzeDate,
          finishAnalyzeDate: result.finishAnalyzeDate,
          finishReportDate: result.finishReportDate,
          file: null,
          files: []
        }
        this.api.UpdateResult(result._id, dataResult).subscribe((data: any) => {
          if (data) {

            let dataForm = {
              issuedDate: this.IssueDate.value,
              replyDate: this.ReplyDate.value,
              files: [],
              status: 0,
              userApprove: null,
              userApproveName: null
            }
            this.api.UpadateRequestForm(this.formId, dataForm).subscribe((data: any) => {
              if (data) {
                this.alertSuccess();
                this.route.navigate(['/manageForm'])

                // location.href = "#/manageForm";
              }
            })

          }
        })
        let dataForm = {
          issuedDate: this.IssueDate.value,
          replyDate: this.ReplyDate.value,
          files: [],
          status: 0,
          userApprove: null,
          userApproveName: null
        }
        this.api.UpadateRequestForm(this.formId, dataForm).subscribe((data: any) => {
          if (data) {
            this.alertSuccess();
            this.route.navigate(['/manageForm'])

            // location.href = "#/manageForm";
          }
        })


      } else {
        let dataForm = {
          issuedDate: this.IssueDate.value,
          replyDate: this.ReplyDate.value,
          files: [],
          status: 0,
          userApprove: null,
          userApproveName: null
        }
        this.api.UpadateRequestForm(this.formId, dataForm).subscribe((data: any) => {
          if (data) {
            this.alertSuccess();
            this.route.navigate(['/manageForm'])

            // location.href = "#/manageForm";
          }
        })
      }

    })



  }

  // todo Cancle request and delete file list
  // OnCancle() {


  //   Swal.fire({
  //     title: 'Do you want to Cancel ?',
  //     showCancelButton: true,
  //     icon: 'error',
  //     confirmButtonText: 'OK',
  //   }).then((result) => {
  //     if (result.isConfirmed) {

  //       // ? เช็ค result เพื่อเช็คดูว่ามีไฟล์ค้างไหม
  //       this.rs.FindResultByFormId(this.FormId).subscribe((data: any) => {
  //         console.log(data);

  //         if (data.length > 0) {
  //           let result = data[0];
  //           let files = result.files

  //           //  * ลบfile ของ requester
  //           if (this.FileList.length > 0) {
  //             this.FileList.forEach(file => {
  //               console.log(file);
  //               const temp = {
  //                 name: file.name
  //               }
  //               this.rs.RemoveFile(temp).then(async (data: any) => {
  //                 if (data) {
  //                   const a = await data
  //                   return true
  //                 }
  //               })
  //             });

  //           }

  //           //  * ลบfile ของ result
  //           if (files.length > 0) {
  //             files.forEach(fileEng => {
  //               const temp = {
  //                 name: fileEng.name
  //               }
  //               this.rs.RemoveFileEng(temp).then((data) => {
  //                 if (data) {
  //                   return true
  //                 }
  //               })
  //             });
  //           }

  //           //  * ลบfile report
  //           if (result.file) {
  //             const reportFile = (result.file.split('/'))[5]
  //             const temp = {
  //               name: reportFile
  //             }
  //             this.rs.RemoveReport(temp).then((data: any) => {
  //               if (data) {
  //                 return true
  //               }
  //             })
  //           }



  //         } else {



  //         }



  //       })

  //     }
  //   })


  // }


  // ? Function

  // SetPathFile() {
  //   // console.log("Set file path");

  //   if (this.FileListname.length > 0) {
  //     this.FileListname.forEach(i => {
  //       this.reject1.FindPath(i).subscribe((data: any) => {
  //         if (data.length > 0) {
  //           this.PathListName.push(data[0].path);
  //         }

  //       })
  //     });

  //   }
  // }



  SetUserStatus() {
    // *  filter เลเวล ถ้าเป็นnull ให้ตัดออก
    for (let index = 0; index < 5; index++) {
      let str1 = "UserLevel" + (index + 1);
      let temp1 = sessionStorage.getItem(str1);
      if (temp1 != "null") {
        this.UserLevel[index] = sessionStorage.getItem(str1);
      }
    }
    // console.log(this.UserLevel);

  }

  SetDatePicker() {
    this.SetMinDate1();
    this.SetMaxDate1();
  }

  SetMinDate1() {
    let day = "";
    let date = String(this.dateToDay.day);
    let month = "";
    let mon = String(this.dateToDay.month);
    if (date.length == 1) {
      day = "0" + date;
    } else {
      day = date;
    }
    if (mon.length == 1) {
      month = "0" + mon;
    } else {
      month = mon;
    }
    this.MinDate1 = this.dateToDay.year + "-" + month + "-" + day;
    this.MinDate2 = this.MinDate1
  }
  SetMaxDate1() {
    const year = this.dateToDay.year;
    const month = this.dateToDay.month;
    const day = this.dateToDay.day + 1;
    let m = String(month);
    let d = String(day);
    if (m.length == 1) {
      m = "0" + m;
    }
    if (d.length == 1) {
      d = "0" + d;
    }

    this.MaxDate1 = year + "-" + m + "-" + d;
  }
  onChangeIssueDate() {
    this.ReplyDate.reset()
    this.MinDate2 = this.IssueDate.value
  }


  showComment(content) {
    this.CommentLists = [];
    this.setDataComment();
    this.modalService.open(content, { size: 'lg' });
  }
  setDataComment() {

    if (this.form.noteNow) {
      const temp = {
        note: this.form.noteNow,
        from: ``,
        to: `Last Comment`,
        class: "now"
      }
      this.CommentLists.push(temp)
    }
    // ? approve loop
    if (this.form.noteApprove1) {
      const temp = {
        note: this.form.noteApprove1,
        from: `Requestor issuer ( ${this.form.requesterName} )`,
        to: `Requestor approval ( ${this.form.userApprove1Name} )`,
        class: "approve"
      }
      this.CommentLists.push(temp)
    }
    if (this.form.noteApprove2) {
      const temp = {
        note: this.form.noteApprove2,
        from: `Requestor approval ( ${this.form.userApprove1Name} )`,
        to: `AE Window person ( ${this.form.userApprove2Name} )`,
        class: "approve"
      }
      this.CommentLists.push(temp)
    }
    if (this.form.noteApprove3) {
      const temp = {
        note: this.form.noteApprove3,
        from: `AE Window person ( ${this.form.userApprove2Name} )`,
        to: `AE Engineer ( ${this.form.userApprove3Name} )`,
        class: "approve"
      }
      this.CommentLists.push(temp)
    }
    if (this.form.noteApprove4) {
      const temp = {
        note: this.form.noteApprove4,
        from: `AE Engineer ( ${this.form.userApprove3Name} )`,
        to: `AE Section Head ( ${this.form.userApprove4Name} )`,
        class: "approve"
      }
      this.CommentLists.push(temp)
    }
    if (this.form.noteApprove5) {
      const temp = {
        note: this.form.noteApprove5,
        from: `AE Section Head ( ${this.form.userApprove4Name} )`,
        to: `AE Dep. Head ( ${this.form.userApprove5Name} )`,
        class: "approve"
      }
      this.CommentLists.push(temp)
    }
    if (this.form.noteApprove6) {
      const temp = {
        note: this.form.noteApprove6,
        from: `AE Dep. Head ( ${this.form.userApprove5Name} )`,
        to: "All",
        class: "approve"
      }
      this.CommentLists.push(temp)
    }

    // ? reject loop
    if (this.form.noteReject1) {
      const temp = {
        note: this.form.noteReject1,
        from: `Requestor approval ( ${this.form.userApprove1Name} )`,
        to: `Requestor issuer ( ${this.form.requesterName} )`,
        class: "reject"
      }
      this.CommentLists.push(temp)
    }
    if (this.form.noteReject2) {
      const temp = {
        note: this.form.noteReject2,
        from: `AE Window person ( ${this.form.userApprove2Name} )`,
        to: `Requestor issuer ( ${this.form.requesterName} )`,
        class: "reject"
      }
      this.CommentLists.push(temp)
    }
    if (this.form.noteReject3) {
      const temp = {
        note: this.form.noteReject3,
        from: `AE Engineer ( ${this.form.userApprove3Name} )`,
        to: `AE Window person ( ${this.form.userApprove2Name} )`,
        class: "reject"
      }
      this.CommentLists.push(temp)
    }
    if (this.form.noteReject4) {
      const temp = {
        note: this.form.noteReject4,
        from: `AE Section Head ( ${this.form.userApprove4Name} )`,
        to: `AE Engineer ( ${this.form.userApprove3Name} )`,
        class: "reject"
      }
      this.CommentLists.push(temp)
    }
    if (this.form.noteReject5) {
      const temp = {
        note: this.form.noteReject5,
        from: `AE Dep. Head ( ${this.form.userApprove5Name} )`,
        to: `AE Engineer ( ${this.form.userApprove3Name} )`,
        class: "reject"
      }
      this.CommentLists.push(temp)
    }
    // console.log(this.CommentLists);

  }

  // ? Modal

  ModalNote(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  get RequestItem() { return this.RequestForm.get('RequestItem') }
  get RequestNumber() { return this.RequestForm.get('RequestNumber') }
  get IssueDate() { return this.RequestForm.get('IssueDate') }
  get ReplyDate() { return this.RequestForm.get('ReplyDate') }
  get RequestSection() { return this.RequestForm.get('RequestSection') }
  get ModelNumber() { return this.RequestForm.get('ModelNumber') }
  get Size() { return this.RequestForm.get('Size') }
  get Customer() { return this.RequestForm.get('Customer') }
  get LotNumber() { return this.RequestForm.get('LotNumber') }
  get DefectName() { return this.RequestForm.get('DefectName') }
  get DefectCode() { return this.RequestForm.get('DefectCode') }
  get InputQ() { return this.RequestForm.get('InputQ') }
  get NGQ() { return this.RequestForm.get('NGQ') }
  get NGR() { return this.RequestForm.get('NGR') }
  get SendNG() { return this.RequestForm.get('SendNG') }
  get ProductPhase() { return this.RequestForm.get('ProductPhase') }
  get DefectCategory() { return this.RequestForm.get('DefectCategory') }
  get ClaimNo() { return this.RequestForm.get('ClaimNo') }
  get OccurA() { return this.RequestForm.get('OccurA') }
  get OccurB() { return this.RequestForm.get('OccurB') }
  get Abnormal() { return this.RequestForm.get('Abnormal') }
  get Issuer() { return this.RequestForm.get('Issuer') }
  get Aprrove() { return this.RequestForm.get('Aprrove') }
  get TempDefectName() { return this.RequestForm.get('TempDefectName') }
  get TempModelNumber() { return this.RequestForm.get('TempModelNumber') }
  get TBN() { return this.RequestForm.get('TBN') }
  get TBNNumber() { return this.RequestForm.get('TBNNumber') }
  get Treatment() { return this.RequestForm.get('Treatment') }
  alertSuccess() {
    Swal.fire({
      title: 'SUCCESS',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    })
  }


}
