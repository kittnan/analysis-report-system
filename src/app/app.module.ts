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
import { BookingEquipmentNewComponent } from './pages/booking-equipments/booking-equipment-new/booking-equipment-new.component';
import { BookingEquipmentEditComponent } from './pages/booking-equipments/booking-equipment-edit/booking-equipment-edit.component';
import { BookingEquipmentDeleteComponent } from './pages/booking-equipments/booking-equipment-delete/booking-equipment-delete.component';
import { BookingEquipmentTableComponent } from './pages/booking-equipments/booking-equipment-table/booking-equipment-table.component';
import { BookingEquipmentHomeComponent } from './pages/booking-equipments/booking-equipment-home/booking-equipment-home.component';




@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    BookingEquipmentNewComponent,
    BookingEquipmentEditComponent,
    BookingEquipmentDeleteComponent,
    BookingEquipmentTableComponent,
    BookingEquipmentHomeComponent,



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
