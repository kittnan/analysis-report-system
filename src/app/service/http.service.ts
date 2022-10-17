import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'environments/environment'
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }
  Url: any = environment.UrlApi


  // ? data list
  GetModelAll(): Observable<any> {
    return this.http.get(this.Url + "/Model");
  }
  // GetRequestFormById(id: any): Observable<any> {
  //   return this.http.get(this.Url + "/RequestForm/" + id);
  // }
  // GetRequestFormBySearch(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/RequestFormFind", data);
  // }
  // FindResultByFormId2222(id: any): Observable<any> {
  //   return this.http.get(this.Url + "/ResultByFormId/" + id);
  // }
  SearchRequestForm(data: any): Observable<any> {
    return this.http.post(this.Url + "/RequestFilter/", data);
  }
  test(data: any): Observable<any> {
    return this.http.post(this.Url + "/ResultByMultiFormId/", data);
  }


  // ? dashboard
  // GetFormByYearNow(): Observable<any> {
  //   return this.http.get(this.Url + "/RequestFormByYearNow");
  // }
  GetForm(data: any): Observable<any> {
    return this.http.post(this.Url + "/RequestDashboard", data);
  }
  // GetResult(idForm: any): Observable<any> {
  //   return this.http.get(this.Url + "/ResultByFormId/" + idForm);
  // }
  // GetResultByYearNow(): Observable<any> {
  //   return this.http.get(this.Url + "/ResultByYearNow/");
  // }
  GetResultAll(): Observable<any> {
    return this.http.get(this.Url + "/Result/");
  }
  GetUsers(level: any): Observable<any> {
    return this.http.get(this.Url + "/UserByLevelAndSectionAll/" + level);
  }
  GetResultByIDs(data: any): Observable<any> {
    return this.http.post(this.Url + "/ResultByIDs/", data);
  }



  // ? library search
  GetForm_lib(data: any): Observable<any> {
    return this.http.post(this.Url + "/RequestFilter", data);
  }
  // FindResultByFormId(id: any): Observable<any> {
  //   return this.http.get(this.Url + "/ResultByFormId/" + id);
  // }
  GetResultByMultiFormId(data: any): Observable<any> {
    return this.http.post(this.Url + "/ResultByMultiFormId/", data);
  }

  // ? login
  // postLogin(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/postLogin", data);
  // }
  Login(data: any): Observable<any> {
    return this.http.post(this.Url + "/Login/in", data);
  }

  // ? manage form

  RequestManage(params: any): Observable<any> {
    return this.http.get(`${this.Url}/RequestManage/${params.action}/${params.id}/${params.limit}/${params.page}/${params.sort}/${params.level}/${params.count}`)
  }

  // GetRequestForm(level: any): Observable<any> {
  //   return this.http.get(this.Url + "/RequestFormByLevel/" + level);
  // }
  GetRequestFormByApprove(id: any): Observable<any> {
    return this.http.get(this.Url + "/RequestFormByIdApprove/" + id);
  }
  // GetFormByUserId(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/FindFormByUserId", data);
  // }
  GetMailler(): Observable<any> {
    return this.http.get(this.Url + "/Mailler");
  }
  PutMailler(data: any, id: any): Observable<any> {
    return this.http.put(this.Url + "/Mailler/" + id, data);
  }
  // DeleteMailler(id: any): Observable<any> {
  //   return this.http.delete(this.Url + "/Mailler/" + id);
  // }

  // ? master

  GetModel(): Observable<any> {
    return this.http.get(this.Url + "/Model");
  }
  GetMaster(): Observable<any> {
    return this.http.get(this.Url + "/Master");
  }
  GetListAll(): Observable<any> {
    return this.http.get(this.Url + "/List/");
  }
  // GetList(id1: any, id2: any): Observable<any> {
  //   return this.http.get(this.Url + "/List2/" + id1 + "/" + id2);
  // }
  GetListByMasterId(id: any): Observable<any> {
    return this.http.get(this.Url + "/List/" + id);
  }
  GetListByModelName(name: any): Observable<any> {
    return this.http.get(this.Url + "/ListByModelName/" + name);
  }
  PostList(data: any): Observable<any> {
    return this.http.post(this.Url + "/List", data);
  }
  UpdateList(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/List/" + id, data);
  }
  DeleteList(id: any): Observable<any> {
    return this.http.delete(this.Url + "/List/" + id);
  }

  PostDefect(data: any): Observable<any> {
    return this.http.post(this.Url + "/Defect", data);
  }
  GetDefectAll(): Observable<any> {
    return this.http.get(this.Url + "/Defect");
  }
  GetDefect(modelName: any): Observable<any> {
    return this.http.get(this.Url + "/DefectByModelName/" + modelName);
  }
  UpdateDefect(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/Defect/" + id, data);
  }
  DeleteDefect(id: any): Observable<any> {
    return this.http.delete(this.Url + "/Defect/" + id);
  }

  GetOccurA(): Observable<any> {
    return this.http.get(this.Url + "/OccurA");
  }
  GetOccurB(id: any): Observable<any> {
    return this.http.get(this.Url + "/OccurB/" + id);
  }
  GetOccurBAll(): Observable<any> {
    return this.http.get(this.Url + "/OccurB/");
  }
  PostOccur(data: any): Observable<any> {
    return this.http.post(this.Url + "/OccurB", data);
  }
  UpdateOccurB(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/OccurB/" + id, data);
  }
  DeleteOccurB(id: any): Observable<any> {
    return this.http.delete(this.Url + "/OccurB/" + id);
  }

  // ? profile
  GetUser(id: any): Observable<any> {
    return this.http.get(this.Url + "/User/" + id);
  }

  // ? user

  PostUser(data: any): Observable<any> {
    return this.http.post(this.Url + "/User", data);
  }
  GetUserByIdSection(SectionId: any): Observable<any> {
    return this.http.get(this.Url + "/UserByIdSection/" + SectionId);
  }
  GetUserAll(): Observable<any> {
    return this.http.get(this.Url + "/User");
  }
  GetUsersAll(): Observable<any> {
    return this.http.get(this.Url + "/UserNoAdmin");
  }
  GetUsersSectionAndLevel(sectionName: any, level: any): Observable<any> {
    return this.http.get(this.Url + "/User/" + sectionName + "/" + level);
  }
  GetUserByLevelAndSectionAll(level: any): Observable<any> {
    return this.http.get(this.Url + "/UserByLevelAndSectionAll/" + level);
  }
  GetUserById(id: any): Observable<any> {
    return this.http.get(this.Url + "/User/" + id);
  }
  UpdateUser(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/User/" + id, data);
  }
  DeleteUser(id: any): Observable<any> {
    return this.http.delete(this.Url + "/User/" + id);
  }
  GetRequestByUserIdFlow(id: any): Observable<any> {
    return this.http.get(this.Url + "/RequestFormByIdRemainFlow/" + id);
  }


  // ? section
  PostSection(data: any): Observable<any> {
    return this.http.post(this.Url + "/Section", data);
  }
  GetSection(): Observable<any> {
    return this.http.get(this.Url + "/Section");
  }
  UpdateSection(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/Section/" + id, data);
  }
  DeleteSection(id: any): Observable<any> {
    return this.http.delete(this.Url + "/Section/" + id);
  }

  GetUserBySectionName(name: any): Observable<any> {
    return this.http.get(this.Url + "/UserBySectionName/" + name);
  }

  // ?progress1 // request approve
  FindFormById(data: any): Observable<any> {
    return this.http.get(this.Url + "/RequestFormByIdForm/" + data);
  }
  FindPath(name: any): Observable<any> {
    return this.http.get(this.Url + "/FileName/" + name);
  }
  FindUserbyId(id: any): Observable<any> {
    return this.http.get(this.Url + "/User/" + id);
  }

  UpadateRequestForm(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/RequestForm/" + id, data);
  }
  DownloadFile(data: any): Observable<any> {
    return this.http.post<Blob>(this.Url + "/download/", data);
  }

  // ?progress 2 // ae window
  FindAeEng(item: any, level: any): Observable<any> {
    return this.http.get(this.Url + "/User/" + item + '/' + level);
  }
  // FindFormById(data:any):Observable<any> {
  //   return this.http.get(this.Url+"/RequestFormByIdForm/"+ data);
  // }
  // FindResultByFormId(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/view/FindResultByFormId", data);
  // }

  // ? progress 3 // analysis engineer
  // GetResult(data: any): Observable<any> {
  //   return this.http.post(this.Url +"/", data);
  // }
  GetList(data: any): Observable<any> {
    return this.http.get(this.Url + "/List/" + data);
  }
  GetResult(key: any, id: any): Observable<any> {
    return this.http.get(this.Url + "/ResultByYear/" + key + "/" + id);
  }
  GetUserByItemLevel(item: any, level: any): Observable<any> {
    return this.http.get(this.Url + "/User/" + item + '/' + level);
  }
  GetCause(data: any): Observable<any> {
    return this.http.post(this.Url + "/List2Con/", data);
  }
  PostResult(data: any): Observable<any> {
    return this.http.post(this.Url + "/Result/", data);
  }
  UpdateForm(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/RequestForm/" + id, data);
  }

  // ? progress 4 // analysis reviewer 
  // GetUser(item: any, level: any): Observable<any> {
  //   return this.http.get(this.Url + "/User/" + item + '/' + level);
  // }
  UpdateResult(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/Result/" + id, data);
  }

  // ? progress 5 // analysis approve
  // GetUser(item: any, level: any): Observable<any> {
  //   return this.http.get(this.Url + "/User/" + item + '/' + level);
  // }
  // GetUserAll(): Observable<any> {
  //   return this.http.get(this.Url + "/User");
  // }
  // GetUserBySectionName(name: any): Observable<any> {
  //   return this.http.get(this.Url + "/UserBySectionName/" + name);
  // }
  SendEmail(data: any): Observable<any> {
    return this.http.post(this.Url + "/SendEmail", data);
  }

  GetSectionByName(name: any): Observable<any> {
    return this.http.get(this.Url + "/SectionByName/" + name);
  }

  // PostResult(data: any): Observable<any> {
  //   return this.http.post(this.Url+"/Result/", data);
  // }
  // UpdateForm(id: any, data: any): Observable<any> {
  //   return this.http.put(this.Url + "/RequestForm/" + id, data);
  // }

  // ? request 
  // GetModel(): Observable<any> {
  //   return this.http.get(this.Url + "/Model");
  // }
  GetRequestFormByIdModel(id: any): Observable<any> {
    return this.http.get(this.Url + "/RequestForm/" + id);
  }
  GetListByIdMaster(id: any): Observable<any> {
    return this.http.get(this.Url + "/List/" + id);
  }
  GetOccurAByName(name: any): Observable<any> {
    return this.http.get(this.Url + "/OccurA/" + name);
  }
  GetOccurAAll(): Observable<any> {
    return this.http.get(this.Url + "/OccurA");
  }
  GetDefectByModelName(name: any): Observable<any> {
    return this.http.get(this.Url + "/DefectByModelName/" + name);
  }
  // GetOccurB(id: any): Observable<any> {
  //   return this.http.get(this.Url + "/OccurB/" + id);
  // }
  // GetUser(id: any): Observable<any> {
  //   return this.http.get(this.Url + "/User/" + id);
  // }
  SearchReqeustForm(id: any): Observable<any> {
    return this.http.get(this.Url + "/RequestFormSearchByNumber/" + id);
  }
  PostRequestForm(data: any): Observable<any> {
    return this.http.post(this.Url + "/RequestForm", data);
  }
  // GetDefect(): Promise<any> {
  //   return this.http.get(this.Url + "/Defect").toPromise();
  // }
  // GetListAll(): Promise<any> {
  //   return this.http.get(this.Url + "/List").toPromise();
  // }



  GetApprove(sectionName: any, Level: any): Observable<any> {
    return this.http.get(this.Url + "/User/" + sectionName + "/" + Level);
  }





  async UploadFile(file: any, data: any) {
    return new Promise((resolve, reject) => {
      const uploadData = new FormData();
      uploadData.append('File', file, data);
      this.http
        .post(this.Url + "/upload", uploadData,)
        .subscribe(
          (data) => {
            resolve(data);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  async UploadFileEng(file: any, data: any) {
    return new Promise((resolve, reject) => {
      const uploadData = new FormData();
      uploadData.append('File', file, data);
      this.http
        .post(this.Url + "/UploadFileEng", uploadData,)
        .subscribe(
          (data) => {
            resolve(data);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  async RemoveFileEng(name: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.Url + "/RemoveFileEng", name)
        .subscribe(
          (data) => {
            resolve(data);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  async UploadFileEReport(file: any, data: any) {
    return new Promise((resolve, reject) => {
      const uploadData = new FormData();
      uploadData.append('File', file, data);
      this.http
        .post(this.Url + "/UploadReport", uploadData,)
        .subscribe(
          (data) => {
            resolve(data);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  uploadReport2(data: any): Promise<any> {
    return this.http.post(this.Url + "/UploadReport/", data).toPromise()
  }

  // FindResultByFormId(id: any): Observable<any> {
  //   return this.http.get(this.Url + "/ResultByFormId/" + id);
  // }



  InsertFileName(data: any): Observable<any> {
    return this.http.post(this.Url + "/FileName/", data);
  }
  DeleteFileName(Url: any): Observable<any> {
    return this.http.post(this.Url + "/FileNameDel", Url);
  }




  async RemoveFile(data: any): Promise<any> {
    const res = await this.http.post(this.Url + "/Remove", data).toPromise();
    return res;
  }
  async RemoveReport(data: any): Promise<any> {
    const res = await this.http.post(this.Url + "/RemoveReport", data).toPromise();
    return res;
  }


  // UpdateResult(id: any, data: any): Observable<any> {
  //   return this.http.put(this.Url + "/Result/" + id, data);
  // }


  SendEmailTo(data: any): Observable<any> {
    return this.http.post(this.Url + "/SendEmailTo", data);
  }



  // ? Report
  AddReportList(data: any): Observable<any> {
    return this.http.post(this.Url + "/Report", data);
  }

  GetReportList(): Promise<any> {
    return this.http.get(this.Url + "/Report").toPromise();
  }
  UpdateReportList(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/Report/" + id, data);
  }
  DeleteReportList(id: any): Observable<any> {
    return this.http.delete(this.Url + "/Report/" + id);
  }


  // ? reject 1 -> request user
  // FindFormById(data: any): Observable<any> {
  //   return this.http.get(this.Url + "/RequestFormByIdForm/" + data);
  // }
  // FindPath(name: any): Observable<any> {
  //   return this.http.get(this.Url + "/FileName/" + name);
  // }

  // UpadateRequestForm(id: any, data: any): Observable<any> {
  //   return this.http.put(this.Url + "/RequestForm/" + id, data);
  // }
  // DownloadFile(data: any): Observable<any> {
  //   return this.http.post<Blob>(this.Url + "/download/", data);
  // }

  // ? reject 2 ->
  // GetList(data: any): Observable<any> {
  //   return this.http.get(this.Url + "/List/" + data);
  // }
  // GetResult(key: any, id: any): Observable<any> {
  //   return this.http.get(this.Url + "/ResultByYear/" + key + "/" + id);
  // }
  // GetUser(item: any, level: any): Observable<any> {
  //   return this.http.get(this.Url + "/User/" + item + '/' + level);
  // }
  // PostResult(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/Result/", data);
  // }
  // UpdateForm(id: any, data: any): Observable<any> {
  //   return this.http.put(this.Url + "/RequestForm/" + id, data);
  // }
  // UpdateResult(id: any, data: any): Observable<any> {
  //   return this.http.put(this.Url + "/Result/" + id, data);
  // }

  // ? reject 3 ->
  // getProgressForm1(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/getProgressForm1", data);
  // }
  // submitProgress(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/submitProgress", data);
  // }
  // getEng(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/getEng", data);
  // }

  // ? view
  // FindFormById(data: any): Observable<any> {
  //   return this.http.get(this.Url + "/RequestFormByIdForm/" + data);
  // }
  FindResultByFormIdMain(id: any): Observable<any> {
    return this.http.get(this.Url + "/ResultByFormId/" + id);
  }
  // FindAeEng(item: any, level: any): Observable<any> {
  //   return this.http.get(this.Url + "/User/" + item + '/' + level);
  // }
  // UpdateResult(id: any, data: any): Observable<any> {
  //   return this.http.put(this.Url + "/Result/" + id, data);
  // }
}
