import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'app/service/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  // ? Variabel API
  Section: any;
  SectionFromGroup: any;
  SectionList1: any;
  SectionList2: any;
  SectionList3: any;
  SectionList4: any;
  SectionList5: any;
  SectionList6: any;
  SectionView1: any;
  SectionView2: any;
  Users: any;
  TempUser: any = [];


  // ? Variable form control
  LevelList = [1, 2, 3, 4, 5, 6];
  LevelNameList = ["Requestor issuer", "Requestor approval", "AE Window person", "AE Engineer", "AE Section Head", "AE Dep. Head"];
  Section1Name: string;
  Section2Name: string;
  Section3Name: string;
  Section4Name: string;
  Section5Name: string;
  Section6Name: string;
  UserForm = new FormGroup({
    FirstName: new FormControl(null, Validators.required),
    LastName: new FormControl(null, Validators.required),
    Email: new FormControl(null, [Validators.required, Validators.email]),
    EmployeeCode: new FormControl(null, Validators.required),
    Section1: new FormControl(null, Validators.required),
    Section2: new FormControl(null, Validators.required),
    Section3: new FormControl(null, Validators.required),
    Section4: new FormControl(null, Validators.required),
    Section5: new FormControl(null, Validators.required),
    Section6: new FormControl(null, Validators.required),
    Authority1: new FormControl(null, Validators.required),
    Authority2: new FormControl(null, Validators.required),
    Authority3: new FormControl(null, Validators.required),
    Authority4: new FormControl(null, Validators.required),
    Authority5: new FormControl(null, Validators.required),
    Authority6: new FormControl(null, Validators.required),
    CB1: new FormControl(false),
    CB2: new FormControl(false),
    CB3: new FormControl(false),
    CB4: new FormControl(false),
    CB5: new FormControl(false),
  })

  // ? Variable Html Control
  SelectSection = new FormControl('all', Validators.required);
  // SelectGroup = new FormControl(null, Validators.required);
  SelectLevel = new FormControl('all', Validators.required);
  UserId: any;
  CountSelect = [1, 2, 3, 4, 5, 6];


  // ? filter
  ResultFilter: any;
  WordFilter = new FormControl(null, Validators.required);


  constructor(
    private modalService: NgbModal,
    private api: HttpService,
    private route: Router
  ) { }


  ngOnInit(): void {
    // this.SelectSection.setValue("all")
    // this.SelectLevel.setValue("all")
    this.CheckStatusUser();
    this.GetSection();
    this.GetUsersAll()

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
      // location.href = "#/manageForm"
      this.route.navigate(['/manageForm'])
    }
  }

  // ? API
  GetSection() {
    this.api.GetSection().subscribe((data: any) => {
      if (data.length > 0) {
        this.Section = data;
        this.SectionFromGroup = data;
        this.SectionView1 = this.Section.filter(item => item.view == 1)
        this.SectionView2 = this.Section.filter(item => item.view == 2)
        // console.log(this.SectionView1, this.SectionView2);

      } else {
        this.Section = null;
      }
    })
  }

  async GetUsersAll() {
    this.api.GetUserAll().subscribe(async (data: any) => {
      if (data.length > 0) {
        return new Promise(async (resolve) => {
          this.Users = await this.buildDataUsers(data)
          this.Users = await this.SetAuthority(this.Users);
          this.ResultFilter = this.Users;
          resolve(this.Users)
        })
      } else {
        this.Users = null;
      }
    })
  }
  buildDataUsers(datas) {
    return new Promise((resolve, reject) => {
      datas.forEach(data => {
        let temp = []
        if (data.Level1) {
          const a = {
            level: data.Level1,
            section: data.Section1Name
          }
          temp.push(a)
        }
        if (data.Level2) {
          const a = {
            level: data.Level2,
            section: data.Section2Name
          }
          temp.push(a)
        }
        if (data.Level3) {
          const a = {
            level: data.Level3,
            section: data.Section3Name
          }
          temp.push(a)
        }
        if (data.Level4) {
          const a = {
            level: data.Level4,
            section: data.Section4Name
          }
          temp.push(a)
        }
        if (data.Level5) {
          const a = {
            level: data.Level5,
            section: data.Section5Name
          }
          temp.push(a)
        }
        if (data.Level6) {
          const a = {
            level: data.Level6,
            section: data.Section6Name
          }
          temp.push(a)
        }
        // console.log(temp);
        data['Permission'] = temp

      });
      // console.log("Build");

      resolve(datas)

    })
  }
  GetUsersAlltoTemp() {
    this.api.GetUserAll().subscribe((data: any) => {
      if (data.length > 0) {
        this.TempUser = data
      } else {
        this.TempUser = null;
      }
    })
  }

  // GetUsersBySectionNameAndLevel(SectionName: any, Level: any) {
  //   this.us.GetUsersSectionAndLevel(SectionName, Level).subscribe((data: any) => {
  //     if (data.length > 0) {
  //       this.Users = data;
  //       this.SetAuthority();
  //     } else {
  //       this.Users = null;
  //     }
  //   })
  // }

  // GetUsersLevelSectionAll(Level: any) {
  //   this.us.GetUserByLevelAndSectionAll(Level).subscribe((data: any) => {
  //     if (data.length > 0) {
  //       this.Users = data;
  //       this.SetAuthority();
  //     } else {
  //       this.Users = null;
  //     }
  //   })
  // }


  // todo เพิ่มชื่อ authority ลงไปแทน level1,2,3,..
  SetAuthority(data) {
    // console.log(data);
    return new Promise((resolve) => {
      let levelAll = [];
      let sectionAll = [];
      // ? set data to using show in table
      data.forEach(item => {
        item.Level1 ? levelAll.push(item.Level1) : false
        item.Level2 ? levelAll.push(item.Level2) : false
        item.Level3 ? levelAll.push(item.Level3) : false
        item.Level4 ? levelAll.push(item.Level4) : false
        item.Level5 ? levelAll.push(item.Level5) : false
        item.Level6 ? levelAll.push(item.Level6) : false

        item.Section1Name ? sectionAll.push(item.Section1Name) : false
        item.Section2Name ? sectionAll.push(item.Section2Name) : false
        item.Section3Name ? sectionAll.push(item.Section3Name) : false
        item.Section4Name ? sectionAll.push(item.Section4Name) : false
        item.Section5Name ? sectionAll.push(item.Section5Name) : false
        item.Section6Name ? sectionAll.push(item.Section6Name) : false

        if (levelAll) {
          let tempObj1: any = []
          levelAll.forEach((level, index) => {
            let tempObj2 = {
              Level: levelAll[index],
              Section: sectionAll[index]
            }
            tempObj1.push(tempObj2)

          });
          item['objAuthority'] = tempObj1;
          levelAll = [];
          sectionAll = [];

        }


      });

      // console.log("pass insert obj",this.User);


      // ? Replace Level to position
      data.forEach(item => {
        item.objAuthority.forEach(item2 => {
          if (item2.Level == 1) {
            item2.Level = "Requestor issuer"
          }
          if (item2.Level == 2) {
            item2.Level = "Requestor approval"
          }
          if (item2.Level == 3) {
            item2.Level = "AE Window person"
          }
          if (item2.Level == 4) {
            item2.Level = "AE Engineer"
          }
          if (item2.Level == 5) {
            item2.Level = "AE Section Head"
          }
          if (item2.Level == 6) {
            item2.Level = "AE Dep. Head"
          }
        });
      });
      resolve(data)
    })

  }

  diasbleAll() {
    this.Section1.disable();

    this.Authority2.disable();
    this.Section2.disable();
    this.CB2.disable();

    this.Authority3.disable();
    this.Section3.disable();
    this.CB3.disable();

    this.Authority4.disable();
    this.Section4.disable();
    this.CB4.disable();

    this.Authority5.disable();
    this.Section5.disable();
    this.CB5.disable();

    this.Authority6.disable();
    this.Section6.disable();

  }
  disableAll2() {
    this.Section1.disable();
    this.Section2.disable();
    this.Section3.disable();
    this.Section4.disable();
    this.Section5.disable();
    this.Section6.disable();
    this.Authority1.disable();
    this.Authority2.disable();
    this.Authority3.disable();
    this.Authority4.disable();
    this.Authority5.disable();
    this.Authority6.disable();
    this.CB1.disable();
    this.CB2.disable();
    this.CB3.disable();
    this.CB4.disable();
    this.CB5.disable();
  }
  enableAll() {
    this.Section1.enable();
    this.Authority1.enable();

    this.CB1.enable();
    this.Authority2.enable();
    this.Section2.enable();
    this.CB2.enable();

    this.Authority3.enable();
    this.Section3.enable();
    this.CB3.enable();

    this.Authority4.enable();
    this.Section4.enable();
    this.CB4.enable();

    this.Authority5.enable();
    this.Section5.enable();
    this.CB5.enable();

    this.Authority6.enable();
    this.Section6.enable();
  }

  // ? Modal
  OpenModelAddUser(content) {
    this.GetUsersAlltoTemp();
    this.Section1.enable();
    this.Authority1.enable();
    this.diasbleAll();
    this.modalService.open(content, { size: 'lg' });
  }


  OpenModelEditSection(content, item) {
    this.enableAll();
    this.UserId = item._id;
    this.FirstName.setValue(item.FirstName);
    this.LastName.setValue(item.LastName);
    this.Email.setValue(item.Email);
    this.EmployeeCode.setValue(item.EmployeeCode);
    this.Section1.setValue(item.Section1Id);
    this.Section2.setValue(item.Section2Id);
    this.Section3.setValue(item.Section3Id);
    this.Section4.setValue(item.Section4Id);
    this.Section5.setValue(item.Section5Id);
    this.Section6.setValue(item.Section6Id);
    this.Section1Name = item.Section1Name;
    this.Section2Name = item.Section2Name;
    this.Section3Name = item.Section3Name;
    this.Section4Name = item.Section4Name;
    this.Section5Name = item.Section5Name;
    this.Section6Name = item.Section6Name;
    this.Authority1.setValue(item.Level1);
    this.Authority2.setValue(item.Level2);
    this.Authority3.setValue(item.Level3);
    this.Authority4.setValue(item.Level4);
    this.Authority5.setValue(item.Level5);
    this.Authority6.setValue(item.Level6);



    if (this.Section6.valid) {
      this.CB5.setValue(true)
      this.CB4.setValue(true)
      this.CB3.setValue(true)
      this.CB2.setValue(true)
      this.CB1.setValue(true)
      this.onChangeLevel(1)
      this.onChangeLevel(2)
      this.onChangeLevel(3)
      this.onChangeLevel(4)
      this.onChangeLevel(5)
      this.onChangeLevel(6)
    } else if (this.Section5.valid) {
      this.CB4.setValue(true)
      this.CB3.setValue(true)
      this.CB2.setValue(true)
      this.CB1.setValue(true)
      this.onChangeLevel(1)
      this.onChangeLevel(2)
      this.onChangeLevel(3)
      this.onChangeLevel(4)
      this.onChangeLevel(5)

      this.CB5.setValue(false)
      this.Authority6.disable();
      this.Section6.disable();
    } else if (this.Section4.valid) {
      this.CB3.setValue(true)
      this.CB2.setValue(true)
      this.CB1.setValue(true)
      this.onChangeLevel(1)
      this.onChangeLevel(2)
      this.onChangeLevel(3)
      this.onChangeLevel(4)

      this.CB5.setValue(false)
      this.CB4.setValue(false)
      this.Authority6.disable();
      this.Section6.disable();
      this.Authority5.disable();
      this.Section5.disable();
    } else if (this.Section3.valid) {
      this.CB2.setValue(true)
      this.CB1.setValue(true)
      this.onChangeLevel(1)
      this.onChangeLevel(2)
      this.onChangeLevel(3)

      this.CB5.setValue(false)
      this.CB4.setValue(false)
      this.CB3.setValue(false)
      this.Authority6.disable();
      this.Section6.disable();
      this.Authority5.disable();
      this.Section5.disable();
      this.Authority4.disable();
      this.Section4.disable();
    } else if (this.Section2.valid) {
      this.CB1.setValue(true)
      this.onChangeLevel(1)
      this.onChangeLevel(2)

      this.CB5.setValue(false)
      this.CB4.setValue(false)
      this.CB3.setValue(false)
      this.CB2.setValue(false)
      this.Authority6.disable();
      this.Section6.disable();
      this.Authority5.disable();
      this.Section5.disable();
      this.Authority4.disable();
      this.Section4.disable();
      this.Authority3.disable();
      this.Section3.disable();
    } else if (this.Section1.valid) {
      this.onChangeLevel(1)

      this.CB5.setValue(false)
      this.CB4.setValue(false)
      this.CB3.setValue(false)
      this.CB2.setValue(false)
      this.CB1.setValue(false)
      this.Authority6.disable();
      this.Section6.disable();
      this.Authority5.disable();
      this.Section5.disable();
      this.Authority4.disable();
      this.Section4.disable();
      this.Authority3.disable();
      this.Section3.disable();
      this.Authority2.disable();
      this.Section2.disable();
    }




    this.modalService.open(content, { size: 'lg' });
  }

  OpenModalDeleteSection(content, item) {
    this.UserId = item._id;
    this.FirstName.setValue(item.FirstName);
    this.LastName.setValue(item.LastName);
    this.Email.setValue(item.Email);
    this.EmployeeCode.setValue(item.EmployeeCode);
    this.Section1.setValue(item.Section1Id);
    this.Section2.setValue(item.Section2Id);
    this.Section3.setValue(item.Section3Id);
    this.Section4.setValue(item.Section4Id);
    this.Section5.setValue(item.Section5Id);
    this.Section6.setValue(item.Section6Id);
    this.Section1Name = item.Section1Name;
    this.Section2Name = item.Section2Name;
    this.Section3Name = item.Section3Name;
    this.Section4Name = item.Section4Name;
    this.Section5Name = item.Section5Name;
    this.Section6Name = item.Section6Name;
    this.Authority1.setValue(item.Level1);
    this.Authority2.setValue(item.Level2);
    this.Authority3.setValue(item.Level3);
    this.Authority4.setValue(item.Level4);
    this.Authority5.setValue(item.Level5);
    this.Authority6.setValue(item.Level6);
    this.onChangeLevel(1)
    this.onChangeLevel(2)
    this.onChangeLevel(3)
    this.onChangeLevel(4)
    this.onChangeLevel(5)
    this.onChangeLevel(6)
    this.disableAll2();

    this.modalService.open(content, { size: 'lg' });
  }


  // ? Set Form Group
  get FirstName() { return this.UserForm.get('FirstName'); }
  get LastName() { return this.UserForm.get('LastName'); }
  get Email() { return this.UserForm.get('Email'); }
  get EmployeeCode() { return this.UserForm.get('EmployeeCode'); }
  get CountSection() { return this.UserForm.get('CountSection'); }
  get Section1() { return this.UserForm.get('Section1'); }
  get Section2() { return this.UserForm.get('Section2'); }
  get Section3() { return this.UserForm.get('Section3'); }
  get Section4() { return this.UserForm.get('Section4'); }
  get Section5() { return this.UserForm.get('Section5'); }
  get Section6() { return this.UserForm.get('Section6'); }
  get Authority1() { return this.UserForm.get('Authority1'); }
  get Authority2() { return this.UserForm.get('Authority2'); }
  get Authority3() { return this.UserForm.get('Authority3'); }
  get Authority4() { return this.UserForm.get('Authority4'); }
  get Authority5() { return this.UserForm.get('Authority5'); }
  get Authority6() { return this.UserForm.get('Authority6'); }
  get CB1() { return this.UserForm.get('CB1'); }
  get CB2() { return this.UserForm.get('CB2'); }
  get CB3() { return this.UserForm.get('CB3'); }
  get CB4() { return this.UserForm.get('CB4'); }
  get CB5() { return this.UserForm.get('CB5'); }


  // ? EVENT SELECT LEVEL
  onChangeLevel(item: any) {
    let View1 = [1, 2];
    let View2 = [3, 4, 5, 6];
    if (item == 1) {
      let result1 = View1.filter(a => a == this.Authority1.value)
      if (result1.length > 0) {
        this.SectionList1 = this.SectionView1;
      }
      let result2 = View2.filter(a => a == this.Authority1.value)
      if (result2.length > 0) {
        this.SectionList1 = this.SectionView2;
      }
      this.Section1.enable();
      // console.log(this.SectionList1);

    }
    if (item == 2) {
      let result1 = View1.filter(a => a == this.Authority2.value)
      if (result1.length > 0) {
        this.SectionList2 = this.SectionView1;
      }
      let result2 = View2.filter(a => a == this.Authority2.value)
      if (result2.length > 0) {
        this.SectionList2 = this.SectionView2;
      }
      this.Section2.enable();
    }
    if (item == 3) {
      let result1 = View1.filter(a => a == this.Authority3.value)
      if (result1.length > 0) {
        this.SectionList3 = this.SectionView1;
      }
      let result2 = View2.filter(a => a == this.Authority3.value)
      if (result2.length > 0) {
        this.SectionList3 = this.SectionView2;
      }
      this.Section3.enable();
    }
    if (item == 4) {
      let result1 = View1.filter(a => a == this.Authority4.value)
      if (result1.length > 0) {
        this.SectionList4 = this.SectionView1;
      }
      let result2 = View2.filter(a => a == this.Authority4.value)
      if (result2.length > 0) {
        this.SectionList4 = this.SectionView2;
      }
      this.Section4.enable();
    }
    if (item == 5) {
      let result1 = View1.filter(a => a == this.Authority5.value)
      if (result1.length > 0) {
        this.SectionList5 = this.SectionView1;
      }
      let result2 = View2.filter(a => a == this.Authority5.value)
      if (result2.length > 0) {
        this.SectionList5 = this.SectionView2;
      }
      this.Section5.enable();
    }
    if (item == 6) {
      let result1 = View1.filter(a => a == this.Authority6.value)
      if (result1.length > 0) {
        this.SectionList6 = this.SectionView1;
      }
      let result2 = View2.filter(a => a == this.Authority6.value)
      if (result2.length > 0) {
        this.SectionList6 = this.SectionView2;
      }
      this.Section6.enable();
    }

  }

  // ? Event CheckBox
  onCheckBox(index: any) {
    if (index == 1) {
      if (this.CB1.value == true) {
        this.Authority2.enable();
        this.CB2.enable();
      } else {
        this.Section2.reset();
        this.Authority2.reset();

        this.CB2.reset();
        this.Section3.reset();
        this.Authority3.reset();

        this.CB3.reset();
        this.Section4.reset();
        this.Authority4.reset();

        this.CB4.reset();
        this.Section5.reset();
        this.Authority5.reset();

        this.CB5.reset();
        this.Section6.reset();
        this.Authority6.reset();

        this.Section2.disable();
        this.Authority2.disable();

        this.CB2.disable();
        this.Section3.disable();
        this.Authority3.disable();

        this.CB3.disable();
        this.Section4.disable();
        this.Authority4.disable();

        this.CB4.disable();
        this.Section5.disable();
        this.Authority5.disable();

        this.CB5.disable();
        this.Section6.disable();
        this.Authority6.disable();



      }
    }
    if (index == 2) {
      if (this.CB2.value == true) {
        this.Authority3.enable();
        this.CB3.enable();
      } else {
        this.CB2.reset();
        this.Section3.reset();
        this.Authority3.reset();

        this.CB3.reset();
        this.Section4.reset();
        this.Authority4.reset();

        this.CB4.reset();
        this.Section5.reset();
        this.Authority5.reset();

        this.CB5.reset();
        this.Section6.reset();
        this.Authority6.reset();

        this.Section3.disable();
        this.Authority3.disable();

        this.CB3.disable();
        this.Section4.disable();
        this.Authority4.disable();

        this.CB4.disable();
        this.Section5.disable();
        this.Authority5.disable();

        this.CB5.disable();
        this.Section6.disable();
        this.Authority6.disable();



      }
    }
    if (index == 3) {
      if (this.CB3.value == true) {
        this.Authority4.enable();
        this.CB4.enable();
      } else {

        this.CB3.reset();
        this.Section4.reset();
        this.Authority4.reset();

        this.CB4.reset();
        this.Section5.reset();
        this.Authority5.reset();

        this.CB5.reset();
        this.Section6.reset();
        this.Authority6.reset();


        this.Section4.disable();
        this.Authority4.disable();

        this.CB4.disable();
        this.Section5.disable();
        this.Authority5.disable();

        this.CB5.disable();
        this.Section6.disable();
        this.Authority6.disable();



      }
    }
    if (index == 4) {
      if (this.CB4.value == true) {
        this.Authority5.enable();
        this.CB5.enable();
      } else {



        this.CB4.reset();
        this.Section5.reset();
        this.Authority5.reset();

        this.CB5.reset();
        this.Section6.reset();
        this.Authority6.reset();



        this.Section5.disable();
        this.Authority5.disable();

        this.CB5.disable();
        this.Section6.disable();
        this.Authority6.disable();



      }
    }
    if (index == 5) {
      if (this.CB5.value == true) {
        this.Authority6.enable();
      } else {

        this.CB5.reset();
        this.Section6.reset();
        this.Authority6.reset();

        this.Section6.disable();
        this.Authority6.disable();



      }
    }

  }

  onChangeSection(index: any) {
    if (index == 1) {
      const tempSection = this.Section.find(a => a._id == this.Section1.value)
      tempSection ? this.Section1Name = tempSection.name : null
    }
    if (index == 2) {
      const tempSection = this.Section.find(a => a._id == this.Section2.value)
      tempSection ? this.Section2Name = tempSection.name : null
    }
    if (index == 3) {
      const tempSection = this.Section.find(a => a._id == this.Section3.value)
      tempSection ? this.Section3Name = tempSection.name : null
    }
    if (index == 4) {
      const tempSection = this.Section.find(a => a._id == this.Section4.value)
      tempSection ? this.Section4Name = tempSection.name : null
    }
    if (index == 5) {
      const tempSection = this.Section.find(a => a._id == this.Section5.value)
      tempSection ? this.Section5Name = tempSection.name : null
    }
    if (index == 6) {
      const tempSection = this.Section.find(a => a._id == this.Section6.value)
      tempSection ? this.Section6Name = tempSection.name : null
    }
  }



  // ? Event
  AddUser() {
    if (this.UserForm.valid) {
      const resultFind = this.TempUser.find(user => user.EmployeeCode == this.EmployeeCode.value) || null
      if (resultFind == null) {
        let d = {
          FirstName: this.FirstName.value,
          LastName: this.LastName.value,
          EmployeeCode: this.EmployeeCode.value,
          Password: this.EmployeeCode.value,
          Email: this.Email.value,
          Section1Id: this.Section1.value,
          Section2Id: this.Section2.value || null,
          Section3Id: this.Section3.value || null,
          Section4Id: this.Section4.value || null,
          Section5Id: this.Section5.value || null,
          Section6Id: this.Section6.value || null,
          Section1Name: this.Section1Name,
          Section2Name: this.Section2Name || null,
          Section3Name: this.Section3Name || null,
          Section4Name: this.Section4Name || null,
          Section5Name: this.Section5Name || null,
          Section6Name: this.Section6Name || null,
          Level1: this.Authority1.value,
          Level2: this.Authority2.value || null,
          Level3: this.Authority3.value || null,
          Level4: this.Authority4.value || null,
          Level5: this.Authority5.value || null,
          Level6: this.Authority6.value || null,
        }

        this.api.PostUser(d).subscribe(async (data: any) => {
          if (data.length > 0) {
            this.alertSuccess();
            this.Clear();
            await this.GetUsersAll()
            this.onEventCRUD();
            // if (this.SelectLevel.value == "all") {
            //   this.GetUsersAll();
            // } else if (this.SelectLevel.valid) {
            //   this.ChangeSection();
            // }

          }

        })

      } else {
        Swal.fire({
          title: 'Duplicate EmployeeCode',
          icon: 'error',
          showCloseButton: true
        })
        this.Clear()
      }

    }
  }

  EditUser() {
    if (this.UserForm.valid) {
      let d = {
        FirstName: this.FirstName.value,
        LastName: this.LastName.value,
        EmployeeCode: this.EmployeeCode.value,
        Email: this.Email.value,
        Section1Id: this.Section1.value,
        Section2Id: this.Section2.value || null,
        Section3Id: this.Section3.value || null,
        Section4Id: this.Section4.value || null,
        Section5Id: this.Section5.value || null,
        Section6Id: this.Section6.value || null,
        Section1Name: this.Section1Name,
        Section2Name: this.Section2Name || null,
        Section3Name: this.Section3Name || null,
        Section4Name: this.Section4Name || null,
        Section5Name: this.Section5Name || null,
        Section6Name: this.Section6Name || null,
        Level1: this.Authority1.value,
        Level2: this.Authority2.value || null,
        Level3: this.Authority3.value || null,
        Level4: this.Authority4.value || null,
        Level5: this.Authority5.value || null,
        Level6: this.Authority6.value || null,
      }
      this.api.UpdateUser(this.UserId, d).subscribe(async (data: any) => {
        if (data) {
          // alert("Edit success");
          this.alertSuccess();
          this.Clear();
          await this.GetUsersAll()

          this.onEventCRUD();
          // if (this.SelectLevel.value == "all") {
          //   this.GetUsersAll();
          // } else {

          //     this.ChangeSection();
          // }

        }
      })
    }
  }

  DeleteUser() {

    try {


      Swal.fire({
        title: 'Do you want to delete user?',
        icon: 'question',
        showCancelButton: true
      }).then(r => {
        if (r.isConfirmed) {
          const id = this.UserId
          this.api.GetRequestByUserIdFlow(id).subscribe(res => {
            // console.log(res);
            if (res.length > 0) {
              Swal.fire('Can not delete user. User have remain request!', '', 'error')
            } else {
              this.api.DeleteUser(this.UserId).subscribe(async (data: any) => {
                if (data == null) {
                  this.alertSuccess();
                  this.Clear();
                  await this.GetUsersAll()
                  this.onEventCRUD();

                }
              })
            }
          })
        }
      })


    } catch (error) {

    }

    // let Ans = confirm("Delete ?");
    // if (Ans == true) {
    //   this.api.DeleteUser(this.UserId).subscribe(async (data: any) => {
    //     if (data == null) {
    //       this.alertSuccess();
    //       this.Clear();
    //       await this.GetUsersAll()

    //       this.onEventCRUD();

    //       // if (this.SelectLevel.value == "all") {
    //       //   this.GetUsersAll();
    //       // } else {

    //       //   this.ChangeSection();
    //       // }

    //     }
    //   })
    // }
  }

  checkUserInFlow() {
    const requests: any = this.api
  }

  onResetPassword() {
    Swal.fire({
      title: 'Do you want to reset password ?',
      icon: 'warning',
      text: 'Password will reset to employee code.',
      showConfirmButton: true,
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        let d = {
          Password: this.EmployeeCode.value,
        }
        this.api.UpdateUser(this.UserId, d).subscribe(async (data: any) => {
          if (data) {
            // alert("Edit success");
            this.alertSuccess();
            this.Clear();
            await this.GetUsersAll()

            this.onEventCRUD();
            this.modalService.dismissAll();

            // if (this.SelectLevel.value == "all") {
            //   this.GetUsersAll();
            //   this.modalService.dismissAll();

            // } else {

            //   this.ChangeSection();
            // }

          }
        })

      }
    })
  }
  // OnSelectLevel() {
  //   this.SelectSection.reset();
  //   this.Users = null;
  //   if (this.SelectLevel.valid) {
  //     if (this.SelectLevel.value == "all") {
  //       this.SectionFromGroup = null;
  //       this.GetUsersAll();

  //     } else if (this.SelectLevel.value == 1 || this.SelectLevel.value == 2) {
  //       this.SectionFromGroup = this.SectionView1;
  //     } else {
  //       this.SectionFromGroup = this.SectionView2;
  //     }
  //   }
  // }


  // ChangeSection() {
  //   if (this.SelectSection.value == 'all') {
  //     this.GetUsersLevelSectionAll(this.SelectLevel.value);
  //   } else if (this.SelectSection.valid) {
  //     this.GetUsersBySectionNameAndLevel(this.SelectSection.value, this.SelectLevel.value)
  //   } else {
  //     alert("Please Select Group");

  //   }

  // }

  // async onSortUsers() {
  //   // console.log(this.Users);
  //   // console.log(this.SectionView1);
  //   // console.log(this.SectionView2);

  //   if (this.SelectLevel.valid && this.SelectSection.valid) {
  //     alert("2")
  //   } else
  //     if (this.SelectLevel.valid) {
  //       if (this.SelectLevel.value == "null") {
  //         this.ResultFilter = this.Users
  //       } else {
  //         const result = await this.buildUsersByLevel(this.Users, this.SelectLevel.value)
  //         this.ResultFilter = result
  //         if (this.SelectLevel.value == 1 || this.SelectLevel.value == 2) {
  //           this.SectionFromGroup = this.SectionView1
  //         } else {
  //           this.SectionFromGroup = this.SectionView2
  //         }
  //       }
  //     } else
  //       if (this.SelectSection.valid) {
  //         if (this.SelectSection.value == "null") {
  //           this.ResultFilter = this.Users
  //         } else {
  //           const result = await this.buildUserBySection(this.Users, this.SelectSection.value)
  //           this.ResultFilter = result
  //         }
  //       }
  // }
  async onEventCRUD() {
    this.SelectLevel.setValue('all')
    this.SelectSection.setValue('all')
    // if (this.SelectSection.valid && this.SelectLevel.valid) {
    //   console.log(1);

    //   const result = await this.buildUserByLevelAndSection(this.Users, this.SelectLevel.value, this.SelectSection.value)
    //   this.ResultFilter = result
    //   console.log(result);

    // } else
    //   if (this.SelectLevel.valid) {
    //     console.log(2);

    //     const result = await this.buildUsersByLevel(this.Users, this.SelectLevel.value)
    //     this.ResultFilter = result
    //     console.log(result);
    //   } else
    //     if (this.SelectSection.valid) {
    //       console.log(3);

    //       const result = await this.buildUserBySection(this.Users, this.SelectSection.value)
    //       this.ResultFilter = result
    //       console.log(result);
    //     }
  }

  async onSelectAuthority() {
    this.SelectSection.reset();
    if (this.SelectLevel.value == "all") {
      this.ResultFilter = this.Users
    } else {
      const result = await this.buildUsersByLevel(this.Users, this.SelectLevel.value)
      this.ResultFilter = result
      if (this.SelectLevel.value == 1 || this.SelectLevel.value == 2) {
        this.SectionFromGroup = this.SectionView1
      } else {
        this.SectionFromGroup = this.SectionView2
      }
    }
  }

  async onSelectSection() {
    // console.log(this.SelectLevel.value,this.SelectSection.value);

    if ((this.SelectLevel.value != "all") && (this.SelectSection.value != "all")) {
      const result = await this.buildUserByLevelAndSection(this.Users, this.SelectLevel.value, this.SelectSection.value)
      this.ResultFilter = result
    } else
      if ((this.SelectLevel.value != "all") && (this.SelectSection.value == "all")) {
        const result = await this.buildUsersByLevel(this.Users, this.SelectLevel.value)
        this.ResultFilter = result
      } else
        if ((this.SelectLevel.value == "all") && (this.SelectSection.value != "all")) {
          const result = await this.buildUserBySection(this.Users, this.SelectSection.value)
          this.ResultFilter = result
        }
  }

  buildUsersByLevel(datas, level) {

    return new Promise((resolve) => {
      const temp = datas.filter((data) => {
        let permission = data.Permission;
        const result = permission.filter(i => i.level == level)
        if (result.length != 0) {
          return data
        }
      })
      resolve(temp)
    })
  }
  buildUserBySection(datas, section) {
    // console.log("buildUserBySection");

    return new Promise((resolve) => {
      const temp = datas.filter((data) => {
        let permission = data.Permission;
        const result = permission.filter(i => i.section == section)
        if (result.length != 0) {
          // console.log(data);

          return data
        }
      })
      resolve(temp)
    })
  }
  buildUserByLevelAndSection(datas, level, section) {
    return new Promise((resolve) => {
      const temp = datas.filter((data) => {
        let permission = data.Permission;
        const result = permission.filter(i => (i.section == section) && (i.level == level))
        if (result.length != 0) {
          return data
        }
      })
      resolve(temp)
    })
  }


  // OnChangeSelectGroup() {
  //   this.SelectSection.reset();
  //   this.User = null;
  //   if (this.SelectGroup.valid) {
  //     if (this.SelectGroup.value == 1) {
  //       this.SectionFromGroup = this.SectionView1;
  //     } else if (this.SelectGroup.value == 2) {
  //       this.SectionFromGroup = this.SectionView2;
  //     } else if (this.SelectGroup.value == 'all') {
  //       this.SectionFromGroup = null;
  //       this.GetUserAll();
  //     }
  //   }
  // }

  onFilter() {
    if (this.WordFilter.valid) {
      this.ResultFilter = this.Users.filter(i =>
        ((i.FirstName).toLowerCase()).includes((this.WordFilter.value).toLowerCase()) ||
        ((i.LastName).toLowerCase()).includes((this.WordFilter.value).toLowerCase()) ||
        ((i.EmployeeCode).toLowerCase()).includes((this.WordFilter.value).toLowerCase()) ||
        ((i.EmployeeCode).toLowerCase()).includes((this.WordFilter.value).toLowerCase())
      )
    } else {
      this.ResultFilter = this.Users
    }
  }

  alertSuccess() {
    Swal.fire({
      title: 'SUCCESS',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    })
  }



  Clear() {
    this.UserForm.reset();
    this.Section1Name = null;
    this.Section2Name = null;
    this.Section3Name = null;
    this.Section4Name = null;
    this.Section5Name = null;
    this.Section6Name = null;
  }


}
