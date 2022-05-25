import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgoraConfig, AngularAgoraRtcModule } from 'angular-agora-rtc';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { AuthGuard } from 'src/auth.guard';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminExpertsTabComponent } from './admin-experts-tab/admin-experts-tab.component';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { AdminSessionInfoComponent } from './admin-session-info/admin-session-info.component';
import { AdminSessionsComponent } from './admin-sessions/admin-sessions.component';
import { AdminSigninComponent } from './admin-signin/admin-signin.component';
import { AdminUsersTabComponent } from './admin-users-tab/admin-users-tab.component';
import { AgoraTestComponent } from './agora-test/agora-test.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExpertAvailabilityComponent } from './expert-availability/expert-availability.component';
import { ExpertDasboardPageComponent } from './expert-dasboard-page/expert-dasboard-page.component';
import { ExpertDashboardComponent } from './expert-dashboard/expert-dashboard.component';
import { ExpertDetailTabsComponent } from './expert-detail-tabs/expert-detail-tabs.component';
import { ExpertEducationComponent } from './expert-education/expert-education.component';
import { ExpertListingDetailsComponent } from './expert-listing-details/expert-listing-details.component';
import { ExpertNavbarComponent } from './expert-navbar/expert-navbar.component';
import { ExpertOtpVerifyComponent } from './expert-otp-verify/expert-otp-verify.component';
import { ExpertProfileDetailsComponent } from './expert-profile-details/expert-profile-details.component';
import { ExpertProfileComponent } from './expert-profile/expert-profile.component';
import { ExpertSearchListComponent } from './expert-search-list/expert-search-list.component';
import { ExpertServicesComponent } from './expert-services/expert-services.component';
import { ExpertWelcomePageComponent } from './expert-welcome-page/expert-welcome-page.component';
import { FooterComponent } from './footer/footer.component';
import { LandingClassesDataComponent } from './landing-classes-data/landing-classes-data.component';
import { LoginConfirmationComponent } from './login-confirmation/login-confirmation.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';
import { PaymentErrorComponent } from './payment-error/payment-error.component';
import { PaymentComponent } from './payment/payment.component';
import { ReservationPastComponent } from './reservation-past/reservation-past.component';
import { ReservationTabsComponent } from './reservation-tabs/reservation-tabs.component';
import { ReservationUpcomingComponent } from './reservation-upcoming/reservation-upcoming.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { ReviewAndRatingComponent } from './review-and-rating/review-and-rating.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { SearchExpertComponent } from './search-expert/search-expert.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { UserDashboardPageComponent } from './user-dashboard-page/user-dashboard-page.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserExpertNavbarComponent } from './user-expert-navbar/user-expert-navbar.component';
import { UserNavbarComponent } from './user-navbar/user-navbar.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ViewImgComponent } from './reservation-past/view-img/view-img.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ExpertsigninComponent } from './expertsignin/expertsignin.component';
import { ExpertsignupComponent } from './expertsignup/expertsignup.component';
import { ConfirmationOtpComponent } from './confirmation-otp/confirmation-otp.component';
import { UserSigninComponent } from './user-signin/user-signin.component';
import { UserSignupComponent } from './user-signup/user-signup.component';
import { UsersignupComponent } from './userSignup/usersignup.component';

const agoraConfig: AgoraConfig = {
  AppID: 'b414beee0d714fd0bbd968c9e12da559'
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserDashboardComponent,
    ExpertDashboardComponent,
    NavbarComponent,
    ExpertWelcomePageComponent,
    ExpertNavbarComponent,
    ExpertEducationComponent,
    ExpertServicesComponent,
    ExpertProfileComponent,
    ExpertAvailabilityComponent,
    ExpertSearchListComponent,
    ExpertProfileDetailsComponent,
    SignupComponent,
    ExpertListingDetailsComponent,
    PaymentComponent,
    SigninComponent,
    LoginConfirmationComponent,
    ReservationsComponent,
    ReviewsComponent,
    ReservationTabsComponent,
    ReservationUpcomingComponent,
    ReservationPastComponent,
    ExpertDetailTabsComponent,
    UserExpertNavbarComponent,
    UserProfileComponent,
    UserNavbarComponent,
    AdminNavbarComponent,
    AdminDashboardComponent,
    AdminSessionsComponent,
    AdminUsersTabComponent,
    AdminExpertsTabComponent,
    PaymentConfirmationComponent,
    ReviewAndRatingComponent,
    LandingClassesDataComponent,
    FooterComponent,
    AdminSigninComponent,
    ExpertDasboardPageComponent,
    UserDashboardPageComponent,
    AgoraTestComponent,
    ExpertOtpVerifyComponent,
    AdminSessionInfoComponent,
    PaymentErrorComponent,
    SearchExpertComponent,
    PageNotFoundComponent,
    ViewImgComponent,
    ExpertsigninComponent,
    ExpertsignupComponent,
    ConfirmationOtpComponent,
    UserSigninComponent,
    UserSignupComponent,
    UsersignupComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    TableModule,
    AutoCompleteModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    MultiSelectModule,
    SliderModule,
    ToastrModule.forRoot(),
    BsDatepickerModule.forRoot(),
    AngularAgoraRtcModule.forRoot(agoraConfig),
    CarouselModule,
    NgMultiSelectDropDownModule.forRoot()

  ],
  bootstrap: [AppComponent],
  exports: [],
  providers: [AuthGuard],

})
export class AppModule { }
