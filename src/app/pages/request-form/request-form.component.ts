import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment.prod'
import Swal from 'sweetalert2'
import { HttpService } from 'app/service/http.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  // styleUrls: ['./request-form.component.css',],
  styleUrls: ['../pagesStyle.css']
})



export class RequestFormComponent implements OnInit {

  // ?
  LoadingPage: boolean;

  RequestForm = new FormGroup({
    RequestItem: new FormControl(null, Validators.required),
    RequestNumber: new FormControl("-", Validators.required),
    IssueDate: new FormControl(null, Validators.required),
    ReplyDate: new FormControl(null, Validators.required),
    RequestSection: new FormControl(null, Validators.required),
    ModelNumber: new FormControl(null, Validators.required),
    LotNumber: new FormControl(null, Validators.required),
    DefectName: new FormControl(null, Validators.required),
    DefectCode: new FormControl(null, Validators.required),
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
    TempDefectName: new FormControl(null, Validators.required),
    TempModelNumber: new FormControl(null),
    Size: new FormControl(null, Validators.required),
    Customer: new FormControl(null, Validators.required),
    TBN: new FormControl(null, Validators.required),
    TBNNumber: new FormControl(null),

  })

  NoteApprove = new FormControl(null)




  constructor(
    private md: NgbModal,
    private api: HttpService,
    private route: Router) { }

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

  // ? Variable
  ModelName: any;
  OccurAName: any;
  ApproveName: any;

  tempSectionId = [];
  tempSectionName = [];
  SectionId: any;
  SectionList = [];

  FileName: any;
  filterdOptions = [];
  UserLevel = [];

  // *upload
  // FileTemp: any;
  // FileListname = [];
  // PathListName = [];
  ApproveSection: any;
  fileToUp = [];

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
  DefectFilter: any = [];
  Toggle = false;

  ModelNumberFilter: any = [];
  ModelNumberToggle = false;

  // ? Email
  // SendEmailApproved: any;
  SendEmailUser: any;

  // ? file attacnt
  FileList: any = [];
  fileInput = new FormControl(null)


  ngOnInit(): void {
    this.CheckStatusUser();
    this.pageLoadStart();
    this.GetModel();
    this.SetDatePicker();
    this.GetModelNumberList();
    this.GetProductPhaseList();
    this.GetDefectCategoryList();
    this.GetAbnormalLevel();
    // this.GetDefect();
    this.SetUserStatus();
    // this.GetApprove();

    this.SetSectionList();
    this.SetIssuer();
    this.pageLoadEnd();
    this.ClaimNo.disable()

  }

  // ? check status ก่อน  เข้า page
  CheckStatusUser() {
    let LevelList = [];
    LevelList.push(localStorage.getItem('AR_UserLevel1'))
    LevelList.push(localStorage.getItem('AR_UserLevel2'))
    LevelList.push(localStorage.getItem('AR_UserLevel3'))
    LevelList.push(localStorage.getItem('AR_UserLevel4'))
    LevelList.push(localStorage.getItem('AR_UserLevel5'))
    LevelList.push(localStorage.getItem('AR_UserLevel6'))
    const Level = LevelList.filter(lvl => (lvl == '1') || (lvl == '0'));
    if (Level.length == 0) {
      // alert("No access")
      // location.href = "#/manageForm"
      this.route.navigate(['/manageForm'])
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

  GetRequestFormByIdRequest() {
    const IdModelToSeclect = this.RequestItem.value;
    // console.log(IdModelToSeclect);

    this.api.GetRequestFormByIdModel(IdModelToSeclect).subscribe((data: any) => {
      if (data.length > 0) {
        // * get last request form for see request number
        this.FormByModel = data[data.length - 1];
      } else {
        this.FormByModel = null;
      }
      this.SetRequestNumber();
    })
  }

  GetModelNumberList() {
    this.api.GetListByIdMaster(this.IdModelNumber).subscribe((data: any) => {
      if (data.length > 0) {
        this.ModelNumberList = data;
        this.ModelNumberFilter = data;
        // console.log(this.ModelNumberFilter);

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
  GetOccurAList() {
    // console.log(this.ModelName);
    this.OccurAList = null;
    this.OccurBList = null;
    this.OccurA.reset();
    this.OccurB.reset();
    this.OccurAName = null;

    // const CheckWord = this.ModelName.filter(item => item.toLowerCase().includes('FM'.toLowerCase()))
    // console.log("CheckWord",CheckWord);
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
  // GetDefect() {
  //   this.DefectList = null;
  //   this.DefectName.reset();
  //   // todo ถ้ามีคำว่า fm ให้ get defectname  ทั้งหมด
  //   var re = /fm/gi;
  //   const findFm = this.ModelName.search(re);
  //   if(findFm != -1){
  //     this.rs.GetDefect().subscribe((data: any) => {
  //       if (data.length > 0) {
  //         this.DefectList = data;
  //         this.DefectFilter = data;
  //       }
  //     })
  //   } else {
  //     this.rs.GetDefectByModelName(this.ModelName).subscribe((data: any) => {
  //       if (data.length > 0) {
  //         this.DefectList = data;
  //         this.DefectFilter = data;
  //       }
  //     })
  //   }
  // }
  GetDefect() {
    this.DefectList = null;
    this.DefectName.reset();


    // if(this.ModelName.includes('FM')){
    //   this.rs.GetDefect().then
    // }


    this.api.GetDefectByModelName(this.ModelName).subscribe((data: any) => {
      if (data.length > 0) {
        this.DefectList = data;
        this.DefectFilter = data;
      }
    })

  }
  GetApprove2() {
    this.Aprrove.reset();
    this.ApproveName = null;
    if (this.RequestSection.valid) {
      this.api.GetApprove(this.RequestSection.value, 2).subscribe((data: any) => {
        if (data.length > 0) {
          const MyUserId = localStorage.getItem('AR_UserId')
          this.ApproveList = data.filter(user => user._id != MyUserId)
          // this.ApproveList = data;
          // this.OnApproveChange();
          if (this.ApproveList.length == 1) {
            this.ApproveName = `${this.ApproveList[0].FirstName}-${this.ApproveList[0].LastName}`;
            this.SendEmailUser = this.ApproveList
          }

        } else {
          this.ApproveList = [];
        }
      })
    }
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

  OnChangeRequestItem() {

    this.Model.forEach(i => {
      if (i._id == this.RequestItem.value) {
        this.ModelName = i.name;
      }
    });
    this.GetRequestFormByIdRequest();

    // * get master list
    this.GetDefect();
    this.GetOccurAList();

  }


  // todo Lock Number
  CheckNumber() {
    if (this.InputQ.value <= 0) {
      this.InputQ.reset();
    }
    if (this.InputQ.value < this.NGQ.value) {
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

  // todo Claim number
  onChangeDefectCategory() {
    if ((this.DefectCategory.value.toLowerCase()).includes('claim')) {
      this.ClaimNo.enable()
    } else {
      this.ClaimNo.reset()
      this.ClaimNo.disable()
    }
  }



  // todo เลือก Occur A แล้ว ยิงapi ไป get ค่า ของ occurB
  OnChangeOccurA() {
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
  OnApproveChange() {

    // if(this.ApproveList.filter(item=>item._id==this.Aprrove.value).length == 1)

    this.ApproveList.forEach(i => {

      if (i._id == this.Aprrove.value) {
        let Fname = i.FirstName;
        let Lname = i.LastName;
        let str = Lname.substring(0, 1);
        this.ApproveName = Fname + " " + str + ".";
        this.SetApproveEmail()

      }
    });
  }

  OnChangeSection() {
    this.tempSectionName.forEach((item, index) => {
      if (item == this.RequestSection.value) {
        this.SectionId = this.tempSectionId[index]
      }
    });
    this.GetApprove2();
  }

  // todo When Submit
  OnSubmit() {
    Swal.fire({
      title: 'Do you want to Submit ?',
      showCancelButton: true,
      icon: 'success',
      confirmButtonText: 'Submit',
    }).then(async (result) => {
      if (result.isConfirmed) {

        try {
          await this.uploadFile()
        } catch (error) {
          console.error(error);
        } finally {
          // console.log("Request completed");

        }
      }
    })

  }

  async uploadFile() {
    let count = 0;
    if (this.FileList.length > 0) {
      this.FileList.forEach(file => {
        let name = `${this.RequestNumber.value}!${file.name}`
        this.api.UploadFile(file, name).then(async (res) => {
          if (res) {
            count += 1;
            const b = {
              path: res,
              name: name,
              size: file.size
            }
            this.fileToUp.push(b);
            // console.log('1');

            if (count == this.FileList.length) {
              // console.log("file finish");
              this.updateForm();
            }


          }
        })
      });

    } else {
      this.updateForm();
    }


  }

  openModalSubmit(content) {
    this.md.open(content, { size: 'lg' });

  }

  async updateForm() {
    // ? insert form
    // console.log('2');
    // console.log("form start");
    // console.log(this.fileToUp);


    if (this.RequestNumber.valid) {
      this.api.SearchReqeustForm(this.RequestNumber.value).subscribe((data: any) => {
        if (data.length > 0) {
          const Str = data[0].requestNumber.split("-");
          this.SetRequestNumberNext(Str);
          alert("Duplicate request number continue to change request number !!");
          window.scrollTo(0, 0);
        } else {
          // const fname = localStorage.getItem('AR_UserFirstName');
          // const lname = localStorage.getItem('AR_UserLastName');
          let Fname = localStorage.getItem('AR_UserFirstName')
          let Lname = localStorage.getItem('AR_UserLastName')
          let da = {
            requesterId: localStorage.getItem('AR_UserId'),
            requesterName: `${Fname}-${Lname}`,
            requestItem: this.ModelName,
            requestItemId: this.RequestItem.value,
            requestNumber: this.RequestNumber.value,
            issuedDate: this.IssueDate.value,
            replyDate: this.ReplyDate.value,
            requestFormSectionId: this.SectionId,
            requestFormSectionName: this.RequestSection.value,
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
            files: this.fileToUp,
            status: 1,
            noteApprove1: this.NoteApprove.value,
            noteNow: this.NoteApprove.value

          }

          this.api.PostRequestForm(da).subscribe((data: any) => {
            if (data.length > 0) {
              const Content = "<p>To " + this.SendEmailUser.FirstName + " " + this.SendEmailUser.LastName + "(Requestor approval)</p><br>" +
                "Please approve analysis request as link : <a href='http://10.200.90.152:8081/Analysis-Report/'>http://10.200.90.152:8081/Analysis-Report/</a><br><br>" +
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

  SetApproveEmail() {
    this.ApproveList.forEach(item => {
      this.Aprrove.value == item._id ? this.SendEmailUser = item : false
    });
  }

  // todo Cancle request and delete file list
  OnCancel() {

    Swal.fire({
      title: 'Do you want to Delete ?',
      showCancelButton: true,
      icon: 'error',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.alertSuccess();
        location.reload();
      }
    })


  }


  // ? Defect Name filter and dropdown
  ToggleFilter() {
    this.Toggle = !this.Toggle;
  }

  Filter() {
    this.DefectFilter = this.DefectList.filter(
      item => item.defectName.toLowerCase().includes(this.DefectName.value.toLowerCase())
    );
  }

  OnClickSelect(item: any) {
    this.DefectCode.setValue(item.defectCode);
    this.DefectName.setValue(item.defectName);
    this.ToggleFilter();
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




  attach(event) {
    let file = event.target.files[0];
    Swal.fire({
      title: 'Do you want to attach' + event.target.files[0].name + '?',
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: 'attach',
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

            // ? check file duplicate
            if (this.FileList.filter(item => item.name == file.name).length > 0) {
              this.fileInput.reset();
              Swal.fire({
                icon: 'error',
                title: 'File duplicate',
                text: 'Try Again',
              })
            } else {
              this.FileList.push(file);
              this.fileInput.reset();
              this.alertSuccess();
            }


          } else {
            this.fileInput.reset();
            Swal.fire({
              icon: 'error',
              title: 'Limit File Size 5Mb',
              text: 'Try Again',
            })
            // this.file = null;
          }
        }
      }
    })
  }

  OnClickDeleteFile(file: any) {
    Swal.fire({
      title: 'Do you want to delete file?',
      text: `Delete ${file.name} ?`,
      confirmButtonText: 'DELETE',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        const indexToRemove = this.FileList.indexOf(file)
        if (indexToRemove >= 0) {
          this.FileList.splice(indexToRemove, 1)
          this.alertSuccess();
        }
      }
    })
  }


  ClearDefectCode() {
    if (this.DefectName.invalid) {
      this.DefectCode.reset();
    }
  }






  // ? Function

  // todo filter


  SetIssuer() {
    const fName = localStorage.getItem('AR_UserFirstName');
    let lName = localStorage.getItem('AR_UserLastName');
    lName = lName.substring(0, 1);
    const SumName = fName + '-' + lName;
    this.Issuer.setValue(SumName);
  }

  SetRequestNumber() {
    if (this.ModelName) {
      if (this.FormByModel) {
        const Name = this.FormByModel.requestNumber;
        const Str = Name.split("-");
        // console.log(Str);

        // ? เช็ค ปี (ปีใหม่รันเลขใหม่)
        if (this.dateToDay.year > Str[1]) {
          this.SetRequestNumberForNewYear(Str);
        } else {
          this.SetRequestNumberNext(Str);
        }

      } else {
        this.SetRequestNumberNew();
      }
    }
  }

  // ? Set RequestNumber
  SetRequestNumberForNewYear(str: any) {
    const Sum = str[0] + "-" + this.dateToDay.year + "-" + "0001";
    this.RequestNumber.setValue(Sum);
  }

  // ? Set ใหม่ เมื่อไม่มีเลย
  SetRequestNumberNew() {
    const Sum = this.ModelName + "-" + this.dateToDay.year + "-" + "0001";
    this.RequestNumber.setValue(Sum);
  }

  // ? Set ต่อจากอันเดิม
  SetRequestNumberNext(str: any) {
    // console.log(this.FormByModel);

    const number = Number(str[2]);
    const newNumber = number + 1;
    const newStr = String(newNumber);
    let Str = "";
    if (newStr.length == 1) {
      Str = "000" + newStr;
    } else if (newStr.length == 2) {
      Str = "00" + newStr;
    } else if (newStr.length == 3) {
      Str = "0" + newStr;
    } else {
      Str = newStr;
    }
    const Sum = this.ModelName + "-" + this.dateToDay.year + "-" + Str;
    this.RequestNumber.setValue(Sum);
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


  SetUserStatus() {
    // ?  filter เลเวล ถ้าเป็นnull ให้ตัดออก
    for (let index = 0; index < 5; index++) {
      let str1 = "UserLevel" + (index + 1);
      let temp1 = sessionStorage.getItem(str1);
      if (temp1 != "null") {
        this.UserLevel[index] = sessionStorage.getItem(str1);
      }
    }
  }

  SetSectionList() {
    this.tempSectionName = [
      localStorage.getItem('AR_UserSection1Name'),
      localStorage.getItem('AR_UserSection2Name'),
      localStorage.getItem('AR_UserSection3Name'),
      localStorage.getItem('AR_UserSection4Name'),
      localStorage.getItem('AR_UserSection5Name'),
      localStorage.getItem('AR_UserSection6Name')
    ]
    this.tempSectionId = [
      localStorage.getItem('AR_UserSection1Id'),
      localStorage.getItem('AR_UserSection2Id'),
      localStorage.getItem('AR_UserSection3Id'),
      localStorage.getItem('AR_UserSection4Id'),
      localStorage.getItem('AR_UserSection5Id'),
      localStorage.getItem('AR_UserSection6Id'),
    ]

    if (this.tempSectionName.length > 0) {
      this.tempSectionName.forEach((item, index) => {
        if (item != "null") {
          this.SectionList.push(item);
        }

        if (index + 1 == this.tempSectionName.length) {
          if (this.SectionList.length == 1) {
            this.RequestSection.setValue(this.SectionList[0]);
            this.tempSectionName.forEach((name, index) => {
              if (name == this.SectionList[0]) {
                this.SectionId = this.tempSectionId[index];
              }
            });

            this.GetApprove2();
            // this.OnApproveChange();
          }
        } else {
          this.RequestSection.reset();
        }
      });
    }

  }

  // * Send Mail To...
  public FnSendMailTo(obj: any) {
    const data = obj

  }



  // this.Griup.get('asdasd').value
  // this.asdasd.value
  get RequestItem() { return this.RequestForm.get('RequestItem') }
  get RequestNumber() { return this.RequestForm.get('RequestNumber') }
  get IssueDate() { return this.RequestForm.get('IssueDate') }
  get ReplyDate() { return this.RequestForm.get('ReplyDate') }
  get RequestSection() { return this.RequestForm.get('RequestSection') }
  get ModelNumber() { return this.RequestForm.get('ModelNumber') }
  get LotNumber() { return this.RequestForm.get('LotNumber') }
  get DefectName() { return this.RequestForm.get('DefectName') }
  get DefectCode() { return this.RequestForm.get('DefectCode') }
  get ClaimNo() { return this.RequestForm.get('ClaimNo') }
  get InputQ() { return this.RequestForm.get('InputQ') }
  get NGQ() { return this.RequestForm.get('NGQ') }
  get NGR() { return this.RequestForm.get('NGR') }
  get SendNG() { return this.RequestForm.get('SendNG') }
  get ProductPhase() { return this.RequestForm.get('ProductPhase') }
  get DefectCategory() { return this.RequestForm.get('DefectCategory') }
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


  pageLoadStart() {
    this.LoadingPage = true;
  }
  pageLoadEnd() {
    setTimeout(() => {
      this.LoadingPage = false;

    }, 500);
  }

  alertSuccess() {
    Swal.fire({
      title: 'SUCCESS',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    })
  }

}
