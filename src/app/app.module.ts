import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from "ngx-toastr";
import { HttpClient, HttpClientModule } from '@angular/common/http'

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FixedPluginModule } from './shared/fixedplugin/fixedplugin.module';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
// import { DatePickerComponent } from './date-picker/date-picker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from "./pages/login/login.component";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ProgressForm3FmComponent } from './pages/progress-form3-fm/progress-form3-fm.component';
import { ProgressForm4FmComponent } from './pages/progress-form4-fm/progress-form4-fm.component';
import { RejectForm3FmComponent } from './pages/reject-form3-fm/reject-form3-fm.component';
import { ProgressForm5FmComponent } from './pages/progress-form5-fm/progress-form5-fm.component';
import { ViewFormFmComponent } from './pages/view-form-fm/view-form-fm.component';

// Import reusable form component and wrappers
import { ReusableFormComponent } from './shared/engineer-form/reusable-form.component';
import { ProgressForm3FmWrapperComponent } from './pages/progress-form3-fm/progress-form3-fm-wrapper.component';
import { ProgressForm4FmWrapperComponent } from './pages/progress-form4-fm/progress-form4-fm-wrapper.component';
import { ProgressForm5FmWrapperComponent } from './pages/progress-form5-fm/progress-form5-fm-wrapper.component';
import { RejectForm3FmWrapperComponent } from './pages/reject-form3-fm/reject-form3-fm-wrapper.component';
import { MasterFmPositionComponent } from './pages/master-fm-position/master-fm-position.component';
import { MasterMaterialComponent } from './pages/master-material/master-material.component';
import { MasterEstimateResultProcessComponent } from './pages/master-estimate-result-process/master-estimate-result-process.component';




@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    ProgressForm3FmComponent,
    ProgressForm4FmComponent,
    RejectForm3FmComponent,
    ProgressForm5FmComponent,
    ViewFormFmComponent,
    
    // Add reusable form component and wrappers
    ReusableFormComponent,
    ProgressForm3FmWrapperComponent,
    ProgressForm4FmWrapperComponent,
    ProgressForm5FmWrapperComponent,
    RejectForm3FmWrapperComponent,
    MasterFmPositionComponent,
    MasterMaterialComponent,
    MasterEstimateResultProcessComponent,



  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes, {
    useHash: true,
    relativeLinkResolution: 'legacy'
}),
    SidebarModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FixedPluginModule,
    NgbModule,
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
