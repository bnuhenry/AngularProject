import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouteReuseStrategy,RouterModule,Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ProductsComponent } from './products/products.component';
import { FilterComponent } from './equipment/filter/filter.component';
import { HandsetComponent } from './equipment/handset/handset.component';
import { ContentsComponent } from './contents/contents.component';
import { AIComponent } from './ai/ai.component';
import { DateToTopDirective } from './date-to-top.directive';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BillComponent } from './bill/bill.component';
import { BillDateToTopDirective } from './bill-date-to-top.directive';
import { TotalComponent } from './total/total.component';
import { BillDetailComponent } from './bill-detail/bill-detail.component';
import { ReuseStrategy } from './reuse-strategy';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    EquipmentComponent,
    ProductsComponent,
    FilterComponent,
    HandsetComponent,
    ContentsComponent,
    AIComponent,
    DateToTopDirective,
    BillComponent,
    BillDateToTopDirective,
    TotalComponent,
    BillDetailComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: RouteReuseStrategy, useClass: ReuseStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
