import { OutsourceViewComponent } from './../../pages/outsource-analysis/outsource-view/outsource-view.component';
import { Routes } from '@angular/router';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { RequestFormComponent } from '../../pages/request-form/request-form.component';
import { ManageFormComponent } from 'app/pages/manage-form/manage-form.component';
import { MasterlistsComponent } from '../../pages/masterlists/masterlists.component';
import { ProgressForm1Component } from 'app/pages/progress-form1/progress-form1.component';
import { ProgressForm2Component } from 'app/pages/progress-form2/progress-form2.component';
import { ProgressForm3Component } from 'app/pages/progress-form3/progress-form3.component';
import { ProgressForm4Component } from 'app/pages/progress-form4/progress-form4.component';
import { ProgressForm5Component } from 'app/pages/progress-form5/progress-form5.component';

import { RejectForm1Component } from 'app/pages/reject-form1/reject-form1.component';
import { RejectForm2Component } from 'app/pages/reject-form2/reject-form2.component';
import { RejectForm3Component } from 'app/pages/reject-form3/reject-form3.component';

import { UserComponent } from 'app/pages/user/user.component';
import { SectionManageComponent } from 'app/pages/section-manage/section-manage.component';

import { AnalysisDataListComponent } from 'app/pages/analysis-data-list/analysis-data-list.component';
import { ViewFormComponent } from 'app/pages/view-form/view-form.component';
import { ProfileComponent } from 'app/pages/profile/profile.component';
import { LibrarySearchComponent } from 'app/pages/library-search/library-search.component';
// import { PdfComponent } from 'app/pages/pdf/pdf.component';
import { MaillerComponent } from 'app/pages/mailler/mailler.component';
import { RejectForm4Component } from 'app/pages/reject-form4/reject-form4.component';
import { ReportManageComponent } from 'app/pages/report-manage/report-manage.component';
import { DashboardGuestComponent } from 'app/pages/dashboard-guest/dashboard-guest.component';
import { DashboardV2Component } from 'app/pages/dashboard-v2/dashboard-v2.component';
import { MasterManageComponent } from 'app/pages/equipment/master-manage/master-manage.component';
import { AddEquipmentComponent } from 'app/pages/equipment/add-equipment/add-equipment.component';
import { EquipmentHomeComponent } from 'app/pages/equipment/equipment-home/equipment-home.component';
import { EquipmentManageComponent } from 'app/pages/equipment/equipment-manage/equipment-manage.component';
import { SearchEquipmentComponent } from 'app/pages/equipment/search-equipment/search-equipment.component';
import { EditViewComponent } from 'app/pages/outsource-analysis/edit-view/edit-view/edit-view.component';
import { MasterOutsourceComponent } from 'app/pages/outsource-analysis/master-outsource/master-outsource/master-outsource.component';
import { OutsourceAnalysisComponent } from 'app/pages/outsource-analysis/outsource-analysis.component';
import { SearchDatabaseComponent } from 'app/pages/outsource-analysis/search-database/search-database.component';
import { ElectricalSearchComponent } from 'app/pages/electrical-database/electrical-search-database/electrical-search/electrical-search.component';
import { ElectricalInputComponent } from 'app/pages/electrical-database/eletrical-input-database/electrical-input/electrical-input.component';
import { ElectricalMasterComponent } from 'app/pages/electrical-database/electrical-master/electrical-master/electrical-master.component';
import { ElectricalTftDrivingComponent } from 'app/pages/electrical-database/electrical-TFT-Driving-voltage/electrical-tft-driving/electrical-tft-driving.component';
import { ElectricalResistanceComponent } from 'app/pages/electrical-database/electrical-resistance/electrical-resistance/electrical-resistance.component';
import { ElectricalOtpComponent } from 'app/pages/electrical-database/electrical-otp/electrical-otp/electrical-otp.component';
import { BookingEquipmentNewComponent } from 'app/pages/booking-equipments/booking-equipment-new/booking-equipment-new.component';

// import { LoginComponent } from 'app/pages/login/login.component';

// const path = "http://10.200.90.152:4014/Analysis-Report";

export const AdminLayoutRoutes: Routes = [
  // { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard', component: DashboardV2Component },
  { path: 'requestform', component: RequestFormComponent },
  { path: 'manageForm', component: ManageFormComponent },
  { path: 'masterlists', component: MasterlistsComponent },
  // { path: 'login',          component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'progressForm1', component: ProgressForm1Component },
  { path: 'progressForm2', component: ProgressForm2Component },
  { path: 'progressForm3', component: ProgressForm3Component },
  { path: 'progressForm4', component: ProgressForm4Component },
  { path: 'progressForm5', component: ProgressForm5Component },
  // { path: 'progressForm6', component: ProgressForm6Component },

  { path: 'rejectForm1', component: RejectForm1Component },
  { path: 'rejectForm2', component: RejectForm2Component },
  { path: 'rejectForm3', component: RejectForm3Component },
  { path: 'rejectForm4', component: RejectForm4Component },

  { path: 'user', component: UserComponent },
  { path: 'sectionManage', component: SectionManageComponent },
  { path: 'analysisDataList', component: AnalysisDataListComponent },
  { path: 'viewForm', component: ViewFormComponent },
  { path: 'library', component: LibrarySearchComponent },
  // { path: 'pdf', component: PdfComponent },
  { path: 'mailler', component: MaillerComponent },
  { path: 'reportManage', component: ReportManageComponent },
  // { path: 'test',            component: TestComponent }

  { path: 'dashboard-guest', component: DashboardGuestComponent },

  { path: 'equipment', component: EquipmentHomeComponent },
  { path: 'equipment-master-manage', component: MasterManageComponent },
  { path: 'add-equipment', component: AddEquipmentComponent },
  { path: 'manage-equipment', component: EquipmentManageComponent },
  { path: 'search-equipment', component: SearchEquipmentComponent },

  //outsource-analysis
  { path: "outsource", component: OutsourceAnalysisComponent },
  { path: "searchDatabase", component: SearchDatabaseComponent },
  { path: "viewFormSearch", component: OutsourceViewComponent },
  { path: "MasterOutsource", component: MasterOutsourceComponent },
  { path: "editView", component: EditViewComponent },

  //Electrical-database
  { path: "electricalSearch", component: ElectricalSearchComponent },
  { path: "electricalInput", component: ElectricalInputComponent },
  { path: "electricalMaster", component: ElectricalMasterComponent },

  //TFT
  { path: "electricalTFT", component: ElectricalTftDrivingComponent },

  //Resistance
  { path: "electricalResistance", component: ElectricalResistanceComponent },

  //OTP
  { path: "electricalOtp", component: ElectricalOtpComponent },

  // booking
  { path: "booking-equipment-new", component: BookingEquipmentNewComponent },


];
