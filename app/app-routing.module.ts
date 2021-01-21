import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquipmentComponent } from './equipment/equipment.component'
import { ProductsComponent } from './products/products.component'
import { FilterComponent } from './equipment/filter/filter.component'
import { HandsetComponent } from './equipment/handset/handset.component'
import { ContentsComponent } from './contents/contents.component'
import { AIComponent } from './ai/ai.component'
import { BillComponent } from './bill/bill.component'
import { TotalComponent } from './total/total.component'
import { LoginComponent } from './login/login.component'
import { BillDetailComponent } from './bill-detail/bill-detail.component'
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'equipment', component: EquipmentComponent, canActivate:[AuthGuard] },
  { path: 'products', component: ProductsComponent, canActivate:[AuthGuard] },
  { path: 'contents', component: ContentsComponent, canActivate:[AuthGuard] },
  { path: 'equipment/filter', component: FilterComponent, canActivate:[AuthGuard] },
  { path: 'equipment/handset', component: HandsetComponent, canActivate:[AuthGuard] } ,
  { path: 'ai', component: AIComponent, canActivate:[AuthGuard] } ,
  { path: 'bill', component: BillComponent, canActivate:[AuthGuard] } ,
  { path: 'total', component: TotalComponent, canActivate:[AuthGuard] } ,
  { path: 'billdetail', component: BillDetailComponent, canActivate:[AuthGuard] } ,
  { path: '**',   redirectTo: 'login', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
