import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/auth.guard';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminExpertsTabComponent } from './admin-experts-tab/admin-experts-tab.component';
import { AdminSessionInfoComponent } from './admin-session-info/admin-session-info.component';
import { AdminSessionsComponent } from './admin-sessions/admin-sessions.component';
import { AdminSigninComponent } from './admin-signin/admin-signin.component';
import { AdminUsersTabComponent } from './admin-users-tab/admin-users-tab.component';
import { AgoraTestComponent } from './agora-test/agora-test.component';
import { ConfirmationOtpComponent } from './confirmation-otp/confirmation-otp.component';
import { ExpertAvailabilityComponent } from './expert-availability/expert-availability.component';
import { ExpertDasboardPageComponent } from './expert-dasboard-page/expert-dasboard-page.component';
import { ExpertDashboardComponent } from './expert-dashboard/expert-dashboard.component';
import { ExpertEducationComponent } from './expert-education/expert-education.component';
import { ExpertListingDetailsComponent } from './expert-listing-details/expert-listing-details.component';
import { ExpertProfileDetailsComponent } from './expert-profile-details/expert-profile-details.component';
import { ExpertProfileComponent } from './expert-profile/expert-profile.component';
import { ExpertSearchListComponent } from './expert-search-list/expert-search-list.component';
import { ExpertServicesComponent } from './expert-services/expert-services.component';
import { ExpertWelcomePageComponent } from './expert-welcome-page/expert-welcome-page.component';
import { ExpertsigninComponent } from './expertsignin/expertsignin.component';
import { ExpertsignupComponent } from './expertsignup/expertsignup.component';
import { LoginConfirmationComponent } from './login-confirmation/login-confirmation.component';
import { LoginGuard } from './login.guard';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';
import { PaymentErrorComponent } from './payment-error/payment-error.component';
import { PaymentComponent } from './payment/payment.component';
import { ReservationPastComponent } from './reservation-past/reservation-past.component';
import { ViewImgComponent } from './reservation-past/view-img/view-img.component';
import { ReservationUpcomingComponent } from './reservation-upcoming/reservation-upcoming.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { ReviewAndRatingComponent } from './review-and-rating/review-and-rating.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { UserDashboardPageComponent } from './user-dashboard-page/user-dashboard-page.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserSigninComponent } from './user-signin/user-signin.component';
import { UserSignupComponent } from './user-signup/user-signup.component';
import { UsersignupComponent } from './userSignup/usersignup.component';


const routes: Routes = [
  {
    path: '', component: LoginComponent,
    data: {
      title: '1:1 Academic, Career Guidance for Students | Best Online Doubt Solving Platform',
      descrption: 'Get online 1:1 Academic Guidance and personalized career counseling for Students from GrabGuidance - one of the best online doubt solving Platform in India',
    }
  },

  { path: 'expert-signup', component: ExpertsignupComponent, canActivate: [LoginGuard] },
  { path: 'expert-signin', component: ExpertsigninComponent, canActivate: [LoginGuard] },
  { path: 'user-signup', component: UserSignupComponent, canActivate: [LoginGuard]},
  { path: 'user-signin', component: UserSigninComponent, canActivate: [LoginGuard] },
  { path: 'confirmation-otp', component: ConfirmationOtpComponent },
  // { path: "", redirectTo: 'login', pathMatch: 'full'},
  { path: 'signup', component: SignupComponent, canActivate: [AuthGuard] },
  { path: 'signin', component: SigninComponent, canActivate: [AuthGuard] },
  { path: 'grab-admin', component: AdminSigninComponent },
  { path: 'loginConfirmation', component: LoginConfirmationComponent },

  {
    path: 'expert', component: ExpertWelcomePageComponent, children: [
      { path: 'education', component: ExpertEducationComponent, canActivate: [AuthGuard] },
      { path: 'profile', component: ExpertProfileComponent, canActivate: [AuthGuard] },
      { path: 'availability', component: ExpertAvailabilityComponent, canActivate: [AuthGuard] },
      { path: 'services', component: ExpertServicesComponent, canActivate: [AuthGuard] },
      { path: 'listing', component: ExpertListingDetailsComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'expert', component: ExpertDashboardComponent, children: [
      { path: 'reviews', component: ReviewsComponent, canActivate: [AuthGuard] },
      { path: 'dashboard', component: ExpertDasboardPageComponent, canActivate: [AuthGuard] },
      { path: 'view-profile/:userId', component: ExpertDasboardPageComponent, canActivate: [AuthGuard] },
      // { path: 'view-image', component: ViewImgComponent },
      {
        path: 'sessions', component: ReservationsComponent, children: [
          { path: 'upcoming', component: ReservationUpcomingComponent, canActivate: [AuthGuard] },
          { path: 'past', component: ReservationPastComponent, canActivate: [AuthGuard] },
        ]
      }
    ]
  },
  { path: 'view-image', component: ViewImgComponent },
  { path: 'expert-list/:searchedClass/:searchedSubject', component: ExpertSearchListComponent },
  { path: 'expert-list/:searchedClass', component: ExpertSearchListComponent },
  { path: 'expert-list', component: ExpertSearchListComponent },




  { path: 'expert/:id/:name', component: ExpertProfileDetailsComponent },
  { path: 'expert/:name', component: ExpertProfileDetailsComponent },

  { path: 'user/profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'user', component: UserDashboardComponent, children: [
      { path: 'reviews', component: ReviewsComponent, canActivate: [AuthGuard] },
      { path: "dashboard", component: UserDashboardPageComponent },
      {
        path: 'sessions', component: ReservationsComponent, children: [
          { path: 'upcoming', component: ReservationUpcomingComponent, canActivate: [AuthGuard] },
          { path: 'past', component: ReservationPastComponent, canActivate: [AuthGuard] }
        ]
      }
    ]
  },
  { path: 'user-sessions', component: UserDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin-sessions', component: AdminSessionsComponent, canActivate: [AuthGuard] },
  { path: 'admin-users', component: AdminUsersTabComponent, canActivate: [AuthGuard] },
  { path: 'admin-experts', component: AdminExpertsTabComponent, canActivate: [AuthGuard] },
  { path: 'admin/session-info', component: AdminSessionInfoComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'payment-confirmation', component: PaymentConfirmationComponent },
  { path: 'payment-error', component: PaymentErrorComponent },
  { path: 'reviews', component: ReviewsComponent, canActivate: [AuthGuard] },
  { path: 'agora-test', component: AgoraTestComponent, canActivate: [AuthGuard] },
  { path: 'review-rating', component: ReviewAndRatingComponent },

  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollOffset: [0, 0], scrollPositionRestoration: 'top', initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

