import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbModule } from 'angular-crumbs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgwWowModule } from 'ngx-wow';
import { NiceSelectModule } from "ng-nice-select";
import { CountUpModule } from 'ngx-countup';
import { HomeComponent } from './components/pages/home/home.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { AboutComponent } from './components/pages/about/about.component';
import { BlogdetailComponent } from './components/pages/blogdetail/blogdetail.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { ShopleftComponent } from './components/pages/realEstate/shop/shopleft.component';
import { PreloaderComponent } from './components/layouts/preloader/preloader.component';
import { HeaderComponent } from './components/layouts/header/header.component';
import { BacktotopComponent } from './components/layouts/backtotop/backtotop.component';
import { FooterthreeComponent } from './components/layouts/footerthree/footerthree.component';
import { BreadcrumbComponent } from './components/layouts/breadcrumb/breadcrumb.component';
import { CanvasComponent } from './components/layouts/canvas/canvas.component';
import { MobilemenuComponent } from './components/layouts/mobilemenu/mobilemenu.component';
import { QuickviewComponent } from './components/layouts/quickview/quickview.component';
import { NewsletterComponent } from './components/layouts/newsletter/newsletter.component';
import { CursorComponent } from './components/layouts/cursor/cursor.component';
import { LatestproComponent } from './components/layouts/latestpro/latestpro.component';
import { HaboutComponent } from './components/layouts/habout/habout.component';
import { OurproductsComponent } from './components/layouts/ourproducts/ourproducts.component';
import { BlogpostsComponent } from './components/layouts/blogposts/blogposts.component';
import { BlogsidebarComponent } from './components/layouts/blogsidebar/blogsidebar.component';
import { PaginationComponent } from './components/layouts/pagination/pagination.component';
import { ShopsidebarComponent } from './components/layouts/shopsidebar/shopsidebar.component';
import { ViewComponent as RealEstateViewComponent } from './components/pages/realEstate/view/view.component';
import { ViewComponent as SupplyChainViewComponent } from './components/pages/supplyChain/view/view.component';
import { MyPropertyComponent } from './components/pages/realEstate/my-property/my-property.component';
import { SupplyChainShopComponent } from './components/pages/supplyChain/shop/shop.component';
import { MyItemComponent } from './components/pages/supplyChain/my-item/my-item.component';
import { CpammComponent } from './components/pages/finance/cpamm/cpamm.component';
import { CsammComponent } from './components/pages/finance/csamm/csamm.component';
import { ObmmComponent } from './components/pages/finance/obmm/obmm.component';
import { PrismDirective } from './directives/prism/prism.directive';
import { AnalyticsComponent } from './components/pages/analytics/analytics.component';
// import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorComponent,
    AboutComponent,
    BlogdetailComponent,
    ContactComponent,
    ShopleftComponent,
    PreloaderComponent,
    HeaderComponent,
    BacktotopComponent,
    FooterthreeComponent,
    BreadcrumbComponent,
    CanvasComponent,
    MobilemenuComponent,
    QuickviewComponent,
    NewsletterComponent,
    CursorComponent,
    LatestproComponent,
    HaboutComponent,
    OurproductsComponent,
    BlogpostsComponent,
    BlogsidebarComponent,
    PaginationComponent,
    ShopsidebarComponent,
    RealEstateViewComponent,
    MyPropertyComponent,
    SupplyChainShopComponent,
    SupplyChainViewComponent,
    MyItemComponent,
    CpammComponent,
    CsammComponent,
    ObmmComponent,
    PrismDirective,
    AnalyticsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SlickCarouselModule,
    NiceSelectModule,
    BreadcrumbModule,
    NgwWowModule,
    CountUpModule,
    NgbModule,
    // SweetAlert2Module.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
