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
import { BloggridComponent } from './components/pages/bloggrid/bloggrid.component';
import { BloggridsidebarComponent } from './components/pages/bloggridsidebar/bloggridsidebar.component';
import { BlogListComponent } from './components/pages/blog-list/blog-list.component';
import { CartComponent } from './components/pages/cart/cart.component';
import { CheckoutComponent } from './components/pages/checkout/checkout.component';
import { ClassificationComponent } from './components/pages/classification/classification.component';
import { ComingsoonComponent } from './components/pages/comingsoon/comingsoon.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { FaqComponent } from './components/pages/faq/faq.component';
import { GalleryComponent } from './components/pages/gallery/gallery.component';
import { GallerytwoComponent } from './components/pages/gallerytwo/gallerytwo.component';
import { HometwoComponent } from './components/pages/hometwo/hometwo.component';
import { HomethreeComponent } from './components/pages/homethree/homethree.component';
import { HomefourComponent } from './components/pages/homefour/homefour.component';
import { LegalComponent } from './components/pages/legal/legal.component';
import { LoginComponent } from './components/pages/login/login.component';
import { AccountComponent } from './components/pages/account/account.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { ShopdetailComponent } from './components/pages/shopdetail/shopdetail.component';
import { ShopleftComponent } from './components/pages/realEstate/shop/shopleft.component';
import { ShoplefttwoComponent } from './components/pages/shoplefttwo/shoplefttwo.component';
import { ShoprightComponent } from './components/pages/shopright/shopright.component';
import { ShoprighttwoComponent } from './components/pages/shoprighttwo/shoprighttwo.component';
import { TeamComponent } from './components/pages/team/team.component';
import { TypographyComponent } from './components/pages/typography/typography.component';
import { WishlistComponent } from './components/pages/wishlist/wishlist.component';
import { PreloaderComponent } from './components/layouts/preloader/preloader.component';
import { HeaderComponent } from './components/layouts/header/header.component';
import { HeadertwoComponent } from './components/layouts/headertwo/headertwo.component';
import { BacktotopComponent } from './components/layouts/backtotop/backtotop.component';
import { FooterComponent } from './components/layouts/footer/footer.component';
import { FootertwoComponent } from './components/layouts/footertwo/footertwo.component';
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
import { InstafeedsComponent } from './components/layouts/instafeeds/instafeeds.component';
import { BlogsidebarComponent } from './components/layouts/blogsidebar/blogsidebar.component';
import { PaginationComponent } from './components/layouts/pagination/pagination.component';
import { ShoprelatedComponent } from './components/layouts/shoprelated/shoprelated.component';
import { ShopsidebarComponent } from './components/layouts/shopsidebar/shopsidebar.component';
import { ViewComponent } from './components/pages/realEstate/view/view.component';
import { MyPropertyComponent } from './components/pages/realEstate/my-property/my-property.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorComponent,
    AboutComponent,
    BlogdetailComponent,
    BloggridComponent,
    BloggridsidebarComponent,
    BlogListComponent,
    CartComponent,
    CheckoutComponent,
    ClassificationComponent,
    ComingsoonComponent,
    ContactComponent,
    FaqComponent,
    GalleryComponent,
    GallerytwoComponent,
    HometwoComponent,
    HomethreeComponent,
    HomefourComponent,
    LegalComponent,
    LoginComponent,
    AccountComponent,
    RegisterComponent,
    ShopdetailComponent,
    ShopleftComponent,
    ShoplefttwoComponent,
    ShoprightComponent,
    ShoprighttwoComponent,
    TeamComponent,
    TypographyComponent,
    WishlistComponent,
    PreloaderComponent,
    HeaderComponent,
    HeadertwoComponent,
    BacktotopComponent,
    FooterComponent,
    FootertwoComponent,
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
    InstafeedsComponent,
    BlogsidebarComponent,
    PaginationComponent,
    ShoprelatedComponent,
    ShopsidebarComponent,
    ViewComponent,
    MyPropertyComponent,
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
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
