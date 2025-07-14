import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment.prod'
import Swal from 'sweetalert2'

import { HttpService } from 'app/service/http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
@Component({
  selector: 'app-progress-form1',
  templateUrl: './progress-form1.component.html',
  // styleUrls: ['./progress-form1.component.css'],
  styleUrls: ['../pagesStyle.css']

})
export class ProgressForm1Component implements OnInit {

  constructor(private api: HttpService,
    // private api: RequestServiceService,
    private modalService: NgbModal,
    private route: Router,
    private routerActive: ActivatedRoute
  ) {
    this.routerActive.queryParams.subscribe((param: Params) => {
      if (param) {
        this.formId = param['formId']
      }
    })
  }

  // ? Form Conttrol
  RequestForm = new FormGroup({
    RequestItem: new FormControl(null, Validators.required),
    RequestNumber: new FormControl("-", Validators.required),
    IssueDate: new FormControl(null, Validators.required),
    ReplyDate: new FormControl(null, Validators.required),
    RequestSection: new FormControl("-", Validators.required),
    ModelNumber: new FormControl(null, Validators.required),
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
    Size: new FormControl(null, Validators.required),
    Customer: new FormControl(null, Validators.required),
    TBN: new FormControl(null, Validators.required),
    TBNNumber: new FormControl(null),
    Treatment: new FormControl(null, Validators.required),
  })

  NoteApprove = new FormControl(null);
  NoteReject = new FormControl(null);

  // ? Params
  formId: any = null



  // ? Variable API
  Form: any;
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

  // ? Variable
  ModelName: any;
  OccurAName: any;
  ApproveName: any;
  UserLevel = [];

  FileName: any;
  filterdOptions = [];
  ApproveSection: any;


  // *upload
  FileList: any = [];
  fileInput = new FormControl(null)
  PathServer = "C:/xampp/htdocs";

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
  toggleDefectName: any = false;
  ModelNumberToggle: any = false;
  ModelNumberFilter: any;

  // ? Email
  SendEmailApproved: any;
  SendEmailUser: any;

  SendRejectUser: any;

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
    // this.GetDefectByModelName();
    // this.GetApprove();
    this.SetUserStatus();
    // this.OnChangeOccurA();
    this.SetMaxMinIssueDate()
  }

  CheckStatusUser() {
    let LevelList = [];
    localStorage.getItem('AR_UserLevel1') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel1')) : false
    localStorage.getItem('AR_UserLevel2') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel2')) : false
    localStorage.getItem('AR_UserLevel3') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel3')) : false
    localStorage.getItem('AR_UserLevel4') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel4')) : false
    localStorage.getItem('AR_UserLevel5') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel5')) : false
    localStorage.getItem('AR_UserLevel6') != "null" ? LevelList.push(localStorage.getItem('AR_UserLevel6')) : false

    if (LevelList.find(i => i == '2') || LevelList.find(i => i == '0')) {
    } else {
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
        // console.log(data);
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
    // console.log("OccurA", name);

    if (this.ModelName.toLowerCase().includes('FM'.toLowerCase())) {
      this.api.GetOccurAAll().subscribe((data: any) => {
        if (data.length > 0) {
          this.OccurAList = data;
        } else {
          this.OccurAList = null;
        }
      })
    } else {

      this.api.GetOccurAByName(this.ModelName).subscribe((data: any) => {
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

  GetDefect() {
    this.api.GetDefectAll().subscribe((data: any) => {
      if (data.length > 0) {
        this.DefectList = data;
      }
    })
  }
  GetDefectByModelName() {
    this.api.GetDefectByModelName(this.ModelName).subscribe((data: any) => {
      if (data.length > 0) {
        this.DefectList = data;
        // console.log(data);

      }
    })
  }

  GetApprove() {
    this.Aprrove.reset();
    this.ApproveName = null;
    // console.log(this.RequestSection.value);

    if (this.RequestSection.valid) {
      this.api.GetApprove(this.ModelName, 3).subscribe((data: any) => {
        if (data.length > 0) {
          this.ApproveList = data;
          // if (data.length == 1) {
          //   this.Aprrove.setValue(data[0]._id);
          //   this.OnApproveChange();
          // }

        } else {
          this.ApproveList = [];
        }
      })
    }
  }

  GetRequestForm() {
    let d = this.formId;
    this.api.FindFormById(d).subscribe((data: any) => {
      if (data) {
        // console.log(data);

        this.Form = data;

        this.RequestItem.setValue(data.requestItemId);
        this.ModelName = data.requestItem;
        this.RequestNumber.setValue(data.requestNumber);

        this.RequestSection.setValue(data.requestFormSectionName);
        this.ModelNumber.setValue(data.ktcModelNumber);
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
        this.GetOccurAList(data.requestItem);
        this.GetOccurBList();
        this.FileList = data.files;
        // this.SetPathFile();
        let str = data.issuedDate.split("T");
        let str2 = data.replyDate.split("T");
        data.issuedDate = str[0];
        data.replyDate = str2[0];
        this.IssueDate.setValue(data.issuedDate);
        this.ReplyDate.setValue(data.replyDate);

        this.Size.setValue(data.size);
        this.Customer.setValue(data.customer);

        this.GetApprove();
        this.GetDefectByModelName();
        this.SetMinReplyDate();

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
      this.GetOccurBList();
      this.OccurB.reset();
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
        // console.log("Function set approve Name: ", this.ApproveName);
        this.SetApproveEmail();
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

              let name = `${this.Form.requestNumber}!${file.name}`
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
                  issuedDate: this.Form.issuedDate,
                  replyDate: this.Form.replyDate,
                  files: this.FileList
                }

                this.api.UpadateRequestForm(this.Form._id, dataToApi).subscribe((data: any) => {
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
              // this.FileList.push(file);
              // this.fileInput.reset();
              // this.alertSuccess();
            }


          } else {
            alert("File limit size 5Mb");
          }
        }
      }
    })



    // const ans = confirm("Upload " + event.target.files[0].name + " ?");



  }

  OnClickDeleteFile(file: any) {

    Swal.fire({
      title: 'Do you have remove file ?',
      text: `Remove ${file.name} ?`,
      icon: 'question',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {


        const IdForm = this.Form._id
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




  // todo When Submit
  OnApprove() {
    const ans = confirm("Do you want to Approve")
    if (ans == true) {
      if (this.RequestNumber.valid) {
        this.api.SearchReqeustForm(this.RequestNumber.value).subscribe((data: any) => {
          if (data.length < 0) {
            // this.RequestItem.reset();
            // this.RequestNumber.reset();
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
              userApprove2: this.Aprrove.value,
              userApprove2Name: this.ApproveName,
              noteNow: this.NoteApprove.value,
              noteApprove2: this.NoteApprove.value,
              status: 2

            }
            // console.log(da);


            this.api.UpadateRequestForm(this.formId, da).subscribe((data: any) => {

              let Fname = localStorage.getItem('AR_UserFirstName')
              let Lname = localStorage.getItem('AR_UserLastName')
              if (data) {
                const Content = "<p>To " + this.SendEmailUser.FirstName + " " + this.SendEmailUser.LastName + "(AE Window)</p><br>" +
                  "Please analysis the defect as link : <a href='http://10.200.90.152:8081/Analysis-Report/'>http://10.200.90.152:8081/Analysis-Report/</a><br><br>" +
                  "<p>From " + Fname + " " + Lname + "(Issuer)</p>";

                const sendMail = {
                  Content: Content,
                  To: this.SendEmailUser.Email,
                  From: "<Analysis-System@kyocera.co.th>",
                  Subject: "Please analysis the defect  : " + this.RequestNumber.value + " / Model  " + this.ModelNumber.value + " " + this.Size.value + " " +
                    this.Customer.value + " Lot no. " + this.LotNumber.value + "from " + this.OccurAName + " " + this.OccurB.value + " = " + this.NGQ.value + "pcs."
                }
                this.api.SendEmailTo(sendMail).subscribe((data: any) => {
                  // console.log("Send mail ", data);
                  this.alertSuccess();
                  this.route.navigate(['/manageForm'])

                  // location.href = "#/manageForm";
                })

              }


            })
          }
        })
      }

    }
  }

  OnReject() {

    let Ans = confirm("Reject?");
    if (Ans == true) {

      this.api.FindUserbyId(this.Form.requesterId).subscribe((data: any) => {
        if (data.length > 0) {
          let User = data[0];
          let f = User.FirstName;
          let l = User.LastName;
          let l2 = l.substring(0, 1);
          let sum = f + "-" + l2;

          let d = {
            issuedDate: this.IssueDate.value,
            replyDate: this.ReplyDate.value,
            status: 2.1,
            noteNow: this.NoteReject.value,
            noteReject1: this.NoteReject.value,
            userApprove: this.Form.requesterId,
            userApproveName: sum,
          }

          this.api.UpadateRequestForm(this.formId, d).subscribe((data: any) => {

            this.api.GetUser(d.userApprove).subscribe((data: any) => {
              if (data.length > 0) {
                this.SendRejectUser = data[0];
                let Fname = localStorage.getItem('AR_UserFirstName')
                let Lname = localStorage.getItem('AR_UserLastName')
                const Content = "<p>To " + this.SendRejectUser.FirstName + " " + this.SendRejectUser.LastName + "(Issuer)</p><br>" +
                  "Analysis request not approve as  link : <a href='http://10.200.90.152:8081/Analysis-Report/'>http://10.200.90.152:8081/Analysis-Report/</a><br><br>" +
                  "<p>From " + Fname + " " + Lname + "(Requestor approval)</p>";

                const sendMail = {
                  Content: Content,
                  To: this.SendRejectUser.Email,
                  From: "<Analysis-System@kyocera.co.th>",
                  Subject: "Analysis request not approve  : " + this.RequestNumber.value + " / Model  " + this.ModelNumber.value + " " + this.Size.value + " " +
                    this.Customer.value + " Lot no. " + this.LotNumber.value + "from " + this.OccurAName + " " + this.OccurB.value + " = " + this.NGQ.value + "pcs."
                }
                this.api.SendEmailTo(sendMail).subscribe((data: any) => {
                  this.alertSuccess();
                  this.route.navigate(['/manageForm'])

                  // location.href = "#/manageForm";
                })
              }
            })




          })
        }
      })


    }
  }

  onChangeDefectCategory() {
    if ((this.DefectCategory.value.toLowerCase()).includes('claim')) {
      this.ClaimNo.enable()
    } else {
      this.ClaimNo.reset()
      this.ClaimNo.disable()
    }
  }


  // ? Function

  // SetPathFile() {
  //   // console.log("Set file path");

  //   if (this.FileListname.length > 0) {
  //     this.FileListname.forEach(i => {
  //       this.progressForm1.FindPath(i).subscribe((data: any) => {
  //         if (data.length > 0) {
  //           this.PathListName.push(data[0].path);
  //           // console.log(this.FileListname);
  //           // console.log(i);
  //           // console.log("PathLIST", this.PathListName);

  //         }

  //       })
  //     });

  //   }
  // }

  SetMaxMinIssueDate() {
    const datenow = new Date().toLocaleDateString('en-US')
    const str1 = datenow.split('/');
    const mindate1 = `${str1[2]}-${str1[0]}-${str1[1]}`
    const maxdate1 = `${str1[2]}-${str1[0]}-${Number(str1[1]) + 1}`
    this.MinDate1 = mindate1
    this.MaxDate1 = maxdate1
  }
  SetMinReplyDate() {
    this.MinDate2 = this.IssueDate.value
  }
  onChangeIssueDate() {
    this.ReplyDate.reset()
    this.MinDate2 = this.IssueDate.value

  }

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


  SetApproveEmail() {
    this.ApproveList.forEach(item => {
      this.Aprrove.value == item._id ? this.SendEmailUser = item : false
    });
  }



  showComment(content) {
    this.CommentLists = []
    this.setDataComment()
    this.modalService.open(content, { size: 'lg' });
  }
  setDataComment() {

    if (this.Form.noteNow) {
      const temp = {
        note: this.Form.noteNow,
        from: ``,
        to: `Last Comment`,
        class: "now"
      }
      this.CommentLists.push(temp)
    }
    // ? approve loop
    if (this.Form.noteApprove1) {
      const temp = {
        note: this.Form.noteApprove1,
        from: `Requestor issuer ( ${this.Form.requesterName} )`,
        to: `Requestor approval ( ${this.Form.userApprove1Name} )`,
        class: "approve"
      }
      this.CommentLists.push(temp)
    }
    if (this.Form.noteApprove2) {
      const temp = {
        note: this.Form.noteApprove2,
        from: `Requestor approval ( ${this.Form.userApprove1Name} )`,
        to: `AE Window person ( ${this.Form.userApprove2Name} )`,
        class: "approve"
      }
      this.CommentLists.push(temp)
    }
    if (this.Form.noteApprove3) {
      const temp = {
        note: this.Form.noteApprove3,
        from: `AE Window person ( ${this.Form.userApprove2Name} )`,
        to: `AE Engineer ( ${this.Form.userApprove3Name} )`,
        class: "approve"
      }
      this.CommentLists.push(temp)
    }
    if (this.Form.noteApprove4) {
      const temp = {
        note: this.Form.noteApprove4,
        from: `AE Engineer ( ${this.Form.userApprove3Name} )`,
        to: `AE Section Head ( ${this.Form.userApprove4Name} )`,
        class: "approve"
      }
      this.CommentLists.push(temp)
    }
    if (this.Form.noteApprove5) {
      const temp = {
        note: this.Form.noteApprove5,
        from: `AE Section Head ( ${this.Form.userApprove4Name} )`,
        to: `AE Dep. Head ( ${this.Form.userApprove5Name} )`,
        class: "approve"
      }
      this.CommentLists.push(temp)
    }
    if (this.Form.noteApprove6) {
      const temp = {
        note: this.Form.noteApprove6,
        from: `AE Dep. Head ( ${this.Form.userApprove5Name} )`,
        to: "All",
        class: "approve"
      }
      this.CommentLists.push(temp)
    }

    // ? reject loop
    if (this.Form.noteReject1) {
      const temp = {
        note: this.Form.noteReject1,
        from: `Requestor approval ( ${this.Form.userApprove1Name} )`,
        to: `Requestor issuer ( ${this.Form.requesterName} )`,
        class: "reject"
      }
      this.CommentLists.push(temp)
    }
    if (this.Form.noteReject2) {
      const temp = {
        note: this.Form.noteReject2,
        from: `AE Window person ( ${this.Form.userApprove2Name} )`,
        to: `Requestor issuer ( ${this.Form.requesterName} )`,
        class: "reject"
      }
      this.CommentLists.push(temp)
    }
    if (this.Form.noteReject3) {
      const temp = {
        note: this.Form.noteReject3,
        from: `AE Engineer ( ${this.Form.userApprove3Name} )`,
        to: `AE Window person ( ${this.Form.userApprove2Name} )`,
        class: "reject"
      }
      this.CommentLists.push(temp)
    }
    if (this.Form.noteReject4) {
      const temp = {
        note: this.Form.noteReject4,
        from: `AE Section Head ( ${this.Form.userApprove4Name} )`,
        to: `AE Engineer ( ${this.Form.userApprove3Name} )`,
        class: "reject"
      }
      this.CommentLists.push(temp)
    }
    if (this.Form.noteReject5) {
      const temp = {
        note: this.Form.noteReject5,
        from: `AE Dep. Head ( ${this.Form.userApprove5Name} )`,
        to: `AE Engineer ( ${this.Form.userApprove3Name} )`,
        class: "reject"
      }
      this.CommentLists.push(temp)
    }

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
  get Size() { return this.RequestForm.get('Size') }
  get Customer() { return this.RequestForm.get('Customer') }
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
