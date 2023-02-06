import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'app/service/http.service';
import Swal from 'sweetalert2';
import { match } from 'assert';
import { element } from 'protractor';
import { Timeouts } from 'selenium-webdriver';

@Component({
  selector: 'app-electrical-tft-driving',
  templateUrl: './electrical-tft-driving.component.html',
  styleUrls: ['./electrical-tft-driving.component.scss']
})
export class ElectricalTftDrivingComponent implements OnInit {
  LoadingPage: boolean;

  //TODO Var
  @Input() model: any
  @ViewChild('fileUpload') fileUpload!: ElementRef

  tempUpload: any[] = []
  urlImagePart: any
  urlImageCircuit: any
  getDataM: any
  errorValue: any
  onZoom: boolean
  dataUrl: any
  data: any
  idUrl: any
  editOn: boolean
  active: boolean
  listFile: any[] = []
  nameFile: any[] = []
  listDelete: any[] = []
  urlOld: any[] = []
  urlOldShow : any[] = []
  listFileName: any[] = []
  // test : any = "col-lg-6"
  // master:any
  constructor(private api: HttpService) { }


  //TODO init
  async ngOnInit(): Promise<void> {

    this.dataUrl = await this.getUrl()
    this.nameFile = await this.getUrlImage()
    // console.log(this.nameFile);
    // this.nameFile = this.SplitNameFile(this.nameFile)
    this.listFile = this.nameFile

    this.getDataM = await this.getData()
    this.setUrlImage()
    this.data = this.getValueData()
    this.getId()
    this.calculator()

  }



  async EditUpdate() {
    let getData = await this.getUrl()
    let item = getData[0]?.urlImage
    this.listFile = this.SplitNameFile(item)
  }


  async showEdit(e: boolean) {
    this.editOn = e
    let test = await this.getUrlid(this.model)
    if (test) {
      this.urlOld = test.urlImage
    }
    // console.log(test.urlImage);
    this.urlOldShow = []
    for (const iterator of this.urlOld) {
      this.urlOldShow.push(iterator.split("TFT/")[1])
    }
    // console.log(this.urlOld.iterator.split(this.model)[0]);

    // this.urlOldShow = this.urlOld.
  }
  // editOn

  //TODO getID
  async getId() {
    const file = await this.getUrl()
    const data = file.find(e => e.model == this.model)
    if (data) {
      return data._id
    }
  }

  //TODO getValueData
  getValueData() {
    const data = this.getDataM.find(e => e.model == this.model)
    if (data) {
      return data.value
    }
  }

  //TODO getDataMaster
  getData() {
    const data = this.api.getMasterTFT().toPromise()
    if (data) {
      return data
    }
  }

  //TODO setURLImageng
  async setUrlImage() {
    this.dataUrl = await this.getUrl()
    const data = this.dataUrl.find(e => e.model == this.model)
    if (data) {
      // console.log(data.urlImage[0]);

      // this.urlImagePart = [data.urlImage[0]]
      this.urlImagePart = data.urlImage.slice(0,1)
      // data.urlImage.splice(0, 1)
      this.urlImageCircuit = data.urlImage.slice(1)
    }
  }

  //TODO URL
  getUrl() {
    const data = this.api.getUrlTFT().toPromise()
    if (data) {
      return data
    }
  }

  async getUrlImage() {
    const data = await this.api.getUrlTFT().toPromise()
    if (data) {
      return data[0]?.urlImage
    }
  }


  async getUrlid(model: any) {
    const data = await this.api.getUrlTFT().toPromise()
    if (data) {
      // console.log(data);
      const item = await data.find(e => e.model == model)
      return item
      // console.log(item);

    }
  }

  //TODO calculator
  calculator() {

    for (const item of this.getDataM[0].value) {
      item.err ? item.err : item.err = 0
      let vat = (item.good * (item.err / 100))
      let min = item.good - vat
      let max = item.good + vat
      // console.log(min, "  ", max);

      if (min > 0) {
        if (min <= item.Ng && item.Ng <= max) {
          item.status = true
        } else {
          item.status = false
        }
      } else {
        if (min >= item.Ng && item.Ng >= max) {
          item.status = true
        } else {
          item.status = false
        }
      }
    }

    // console.log(this.data);

  }

  //TODO error %
  setErrorValue() {
    for (const item of this.getDataM[0].value) {
      item.err = this.errorValue
    }
    this.calculator()
    this.errorValue = null
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

  //TODO cutNameUrl
  SplitNameFile(DataOld: any[]) {
    let DataNew: any[] = []
    if (DataOld.length > 0) {
      for (const item of DataOld) {
        let items = item.split("/")
        DataNew.push({ name: items[items.length - 1] })
      }
      return DataNew
      // console.log(DataNew);
      // http://127.0.0.1:80/mastereletrical/TFT/3001-rPM.png
      // to
      // { name : 3001--rPm.png }
    }
  }


  async submit() {
    let resUpload = []
    if (this.model) {
      if (this.tempUpload.length > 0) {
        const formData = await this.addFormData(this.tempUpload, this.model)
        resUpload = await this.api.uploadImage(formData).toPromise()
      }
      const sendData = {
        model: this.model,
        urlImage: this.urlOld.concat(resUpload),
        delete : this.listDelete
      }

      let CheckHave = await this.getUrlid(this.model)
      if (CheckHave) {
        const sandDataForm = await this.api.putUrlTFT(CheckHave._id, sendData).toPromise()
      } else {
        const sandDataForm = await this.api.addUrlTFT(sendData).toPromise()
      }
      // console.log(sendData);

      Swal.fire('Success', '', 'success')
      this.tempUpload = []
      this.temp = []
      this.listDelete = []
      // this.showEdit(true)
      this.setUrlImage()
      this.showEdit(false)
    } else {
      Swal.fire({
        title: 'Warning !',
        icon: 'warning',
        text: 'Please Choose data'
      })
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
  upload(e: any) {
    const data: any[] = []
    const files = e.target.files
    data.push(...files)
    // console.log(data);
    this.fileUpload.nativeElement.value = ""
    this.tempUpload = this.duplicate(data)
    // console.log(this.tempUpload);
  }

  //---------------------------------DeleteFile----------------------------------------//
  onClickDel(file: File) {
    Swal.fire({
      title: `Do you want to delete ${file.name}?`,
      icon: 'warning',
      showCancelButton: true
    }).then(ans => {
      if (ans.isConfirmed) {
        console.log(file);

        this.tempUpload = this.tempUpload.filter((f: any) => f != file);
        this.temp = this.temp.filter((f: any) => f != file);
        this.urlOld = this.urlOld.filter((f: any) => f != this.urlOld[0].split(this.model)[0]+file);
        this.urlOldShow = this.urlOldShow.filter((f: any) => f != file);
        this.listDelete.push(file)
        console.log(this.listDelete);

        setTimeout(() => {
          Swal.fire('Success', '', 'success')
        }, 200);
      }
    })
  }
  //---------------------------------CheckSizeFile-----------------------------------------//
  //TODO CheckSizeFile







  //---------------------------------Token-----------------------------------------//


  addFormData(files: any, controlNo: any) {
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
    function generateToken(n: number) {
      var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var token = '';
      for (var i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
      }
      return token;
    }
  }
  //---------------------------------Token-----------------------------------------//


}
