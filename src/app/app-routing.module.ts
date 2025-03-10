import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/pages/about/about.component';
import { AccountComponent } from './components/pages/account/account.component';
import { BlogListComponent } from './components/pages/blog-list/blog-list.component';
import { BlogdetailComponent } from './components/pages/blogdetail/blogdetail.component';
import { BloggridComponent } from './components/pages/bloggrid/bloggrid.component';
import { BloggridsidebarComponent } from './components/pages/bloggridsidebar/bloggridsidebar.component';
import { CartComponent } from './components/pages/cart/cart.component';
import { CheckoutComponent } from './components/pages/checkout/checkout.component';
import { ClassificationComponent } from './components/pages/classification/classification.component';
import { ComingsoonComponent } from './components/pages/comingsoon/comingsoon.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { FaqComponent } from './components/pages/faq/faq.component';
import { GalleryComponent } from './components/pages/gallery/gallery.component';
import { GallerytwoComponent } from './components/pages/gallerytwo/gallerytwo.component';
import { HomeComponent } from './components/pages/home/home.component';
import { HomefourComponent } from './components/pages/homefour/homefour.component';
import { HomethreeComponent } from './components/pages/homethree/homethree.component';
import { HometwoComponent } from './components/pages/hometwo/hometwo.component';
import { LegalComponent } from './components/pages/legal/legal.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { ShopdetailComponent } from './components/pages/shopdetail/shopdetail.component';
import { ShopleftComponent } from './components/pages/realEstate/shop/shopleft.component';
import { ShoplefttwoComponent } from './components/pages/shoplefttwo/shoplefttwo.component';
import { ShoprightComponent } from './components/pages/shopright/shopright.component';
import { ShoprighttwoComponent } from './components/pages/shoprighttwo/shoprighttwo.component';
import { TeamComponent } from './components/pages/team/team.component';
import { TypographyComponent } from './components/pages/typography/typography.component';
import { WishlistComponent } from './components/pages/wishlist/wishlist.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { ViewComponent } from './components/pages/realEstate/view/view.component';
import { MyPropertyComponent } from './components/pages/realEstate/my-property/my-property.component';

const routes: Routes = [
  {path:'',component:HomeComponent, data: { breadcrumb: 'Home' }},
  // {path:'home-two',component:HometwoComponent, data: { breadcrumb: 'Homepage 2' }},
  // {path:'home-three',component:HomethreeComponent, data: { breadcrumb: 'Homepage 3' }},
  // {path:'home-four',component:HomefourComponent, data: { breadcrumb: 'Homepage 4' }},
  {path:'about',component:AboutComponent, data: { breadcrumb: 'About Us' }},
  {path:'account',component:AccountComponent, data: { breadcrumb: 'My Account' }},
  {path:'blog-detail',component:BlogdetailComponent, data: { breadcrumb: 'Blog Detail' }},
  {path:'blog-grid',component:BloggridComponent, data: { breadcrumb: 'Blog Grid' }},
  {path:'blog-grid-sidebar',component:BloggridsidebarComponent, data: { breadcrumb: 'Blog Grid' }},
  {path:'blog-list',component:BlogListComponent, data: { breadcrumb: 'Blog List' }},
  {path:'cart',component:CartComponent, data: { breadcrumb: 'Cart' }},
  {path:'checkout',component:CheckoutComponent, data: { breadcrumb: 'Checkout' }},
  {path:'classification',component:ClassificationComponent, data: { breadcrumb: 'Classification' }},
  {path:'coming-soon',component:ComingsoonComponent, data: { breadcrumb: 'Coming Soon' }},
  {path:'contact',component:ContactComponent, data: { breadcrumb: 'Contact Us' }},
  {path:'faq',component:FaqComponent, data: { breadcrumb: "FAQ's" }},
  {path:'gallery',component:GalleryComponent, data: { breadcrumb: 'Gallery' }},
  {path:'gallery-two',component:GallerytwoComponent, data: { breadcrumb: 'Gallery' }},
  {path:'legal',component:LegalComponent, data: { breadcrumb: 'Legal' }},
  {path:'login',component:LoginComponent, data: { breadcrumb: 'Login' }},
  {path:'register',component:RegisterComponent, data: { breadcrumb: 'Register' }},
  {path:'shop-detail',component:ShopdetailComponent, data: { breadcrumb: 'Shop Detail' }},
  {path:'realEstate/shop',component:ShopleftComponent, data: { breadcrumb: 'Shop' }, canActivate: [AuthGuard] },
  {
    path: 'realEstate/view/:id',
    component: ViewComponent,
    data: { breadcrumb: "View Property"},
    canActivate: [AuthGuard]
  },
  {
    path: 'realEstate/myProperty',
    component: MyPropertyComponent,
    data: { breadcrumb: "My Property"},
    canActivate: [AuthGuard]
  },
  {path:'shop-left-two',component:ShoplefttwoComponent, data: { breadcrumb: 'Shop' }},
  {path:'shop-right',component:ShoprightComponent, data: { breadcrumb: 'Shop' }},
  {path:'shop-right-two',component:ShoprighttwoComponent, data: { breadcrumb: 'Shop' }},
  {path:'team',component:TeamComponent, data: { breadcrumb: 'Team' }},
  {path:'typography',component:TypographyComponent, data: { breadcrumb: 'Typography' }},
  {path:'wishlist',component:WishlistComponent, data: { breadcrumb: 'Wishlist' }},
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
