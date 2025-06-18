import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/pages/about/about.component';
import { BlogdetailComponent } from './components/pages/blogdetail/blogdetail.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ShopleftComponent } from './components/pages/realEstate/shop/shopleft.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { ViewComponent as RealEstateViewComponent } from './components/pages/realEstate/view/view.component';
import { ViewComponent as SupplyChainViewComponent } from './components/pages/supplyChain/view/view.component';
import { MyPropertyComponent } from './components/pages/realEstate/my-property/my-property.component';
import { SupplyChainShopComponent } from './components/pages/supplyChain/shop/shop.component';
import { MyItemComponent } from './components/pages/supplyChain/my-item/my-item.component';
import { CpammComponent } from './components/pages/finance/cpamm/cpamm.component';
import { CsammComponent } from './components/pages/finance/csamm/csamm.component';
import { ObmmComponent } from './components/pages/finance/obmm/obmm.component';
import { AnalyticsComponent } from './components/pages/analytics/analytics.component';

const routes: Routes = [
  {path:'',component:HomeComponent, data: { breadcrumb: 'Home' }},
  {path:'about',component:AboutComponent, data: { breadcrumb: 'About Me' }},
  {path:'blog-detail',component:BlogdetailComponent, data: { breadcrumb: 'Blog Detail' }},
  // {path:'blog-grid',component:BloggridComponent, data: { breadcrumb: 'Blog Grid' }},
  // {path:'blog-grid-sidebar',component:BloggridsidebarComponent, data: { breadcrumb: 'Blog Grid' }},
  {path:'contact',component:ContactComponent, data: { breadcrumb: 'Contact Me' }},
  {
    path:'realEstate/shop',
    component:ShopleftComponent,
    data: { breadcrumb: 'Shop' },
    canActivate: [AuthGuard]
  },
  {
    path: 'realEstate/view/:id',
    component: RealEstateViewComponent,
    data: { breadcrumb: "View Property"},
    canActivate: [AuthGuard]
  },
  {
    path: 'realEstate/myProperty',
    component: MyPropertyComponent,
    data: { breadcrumb: "My Property"},
    canActivate: [AuthGuard]
  },
  {
    path: 'supplyChain/shop',
    component: SupplyChainShopComponent,
    data: { breadcrumb: "Shop"},
    canActivate: [AuthGuard]
  },
  {
    path: 'supplyChain/view/:id',
    component: SupplyChainViewComponent,
    data: { breadcrumb: "View Item"},
    canActivate: [AuthGuard]
  },
  {
    path: 'supplyChain/myItem',
    component: MyItemComponent,
    data: { breadcrumb: "My Item"},
    canActivate: [AuthGuard]
  },
  {
    path: 'finance/cpamm',
    component: CpammComponent,
    data: { breadcrumb: "CPAMM" },
    canActivate: [AuthGuard]
  },
  {
    path: 'finance/csamm',
    component: CsammComponent,
    data: { breadcrumb: "CSAMM" },
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'finance/obmm',
  //   component: ObmmComponent,
  //   data: { breadcrumb: "OBMM" },
  //   canActivate: [AuthGuard]
  // },
  {
    path: "analytics",
    component: AnalyticsComponent,
    data: { breadcrumb: "Analytics" },
  },
  {path:'**',component:ErrorComponent, data: { breadcrumb: '404' }},
  {path:'error',component:ErrorComponent, data: { breadcrumb: '404' }}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
