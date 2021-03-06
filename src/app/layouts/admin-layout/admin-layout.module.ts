import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent }       from '../../pages/dashboard/dashboard.component';

import { RequestFormComponent }     from '../../pages/request-form/request-form.component';
import { MasterlistsComponent }      from 'app/pages/masterlists/masterlists.component';
import { ManageFormComponent }       from 'app/pages/manage-form/manage-form.component';


import { ProgressForm1Component } from 'app/pages/progress-form1/progress-form1.component';
import { ProgressForm2Component } from 'app/pages/progress-form2/progress-form2.component';
import { ProgressForm3Component } from 'app/pages/progress-form3/progress-form3.component';
import { ProgressForm4Component } from 'app/pages/progress-form4/progress-form4.component';
import { ProgressForm5Component } from 'app/pages/progress-form5/progress-form5.component';
import { LoginComponent } from 'app/pages/login/login.component';

import { RejectForm1Component } from 'app/pages/reject-form1/reject-form1.component';
import { RejectForm2Component } from 'app/pages/reject-form2/reject-form2.component';
import { RejectForm3Component } from 'app/pages/reject-form3/reject-form3.component';

import { UserComponent } from 'app/pages/user/user.component';
import { SectionManageComponent } from 'app/pages/section-manage/section-manage.component';
import { AnalysisDataListComponent } from 'app/pages/analysis-data-list/analysis-data-list.component';

import { ViewFormComponent } from 'app/pages/view-form/view-form.component';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from 'app/pages/profile/profile.component';
import { LibrarySearchComponent } from 'app/pages/library-search/library-search.component';
// import { PdfComponent } from 'app/pages/pdf/pdf.component';
import { MaillerComponent } from 'app/pages/mailler/mailler.component';
import { RejectForm4Component } from 'app/pages/reject-form4/reject-form4.component';
import { ReportManageComponent } from 'app/pages/report-manage/report-manage.component';
import { FileSizePipe } from 'app/pages/progress-form3/file-size.pipe';

import { AgGridModule } from 'ag-grid-angular';
import { DashboardGuestComponent } from 'app/pages/dashboard-guest/dashboard-guest.component';
import { DashboardV2Component } from 'app/pages/dashboard-v2/dashboard-v2.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([])
    
  ],
  declarations: [
    DashboardComponent,
    DashboardV2Component,
    FileSizePipe,
    RequestFormComponent,
    ProgressForm1Component,
    ProgressForm2Component,
    ProgressForm3Component,
    ProgressForm4Component,
    ProgressForm5Component,
    // ProgressForm6Component,

    RejectForm1Component,
    RejectForm2Component,
    RejectForm3Component,
    RejectForm4Component,

    UserComponent,
    SectionManageComponent,

    MasterlistsComponent,
    ManageFormComponent,
    // LoginComponent,
    AnalysisDataListComponent,
    ViewFormComponent,
    ProfileComponent,
    LibrarySearchComponent,
    // PdfComponent,
    MaillerComponent,
    ReportManageComponent,


    DashboardGuestComponent
  ]
})

export class AdminLayoutModule {}
