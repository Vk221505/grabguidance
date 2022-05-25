import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import * as moment from "moment";
import { Observable } from 'rxjs';
import { LoginPayload } from 'src/app/models/admin.model';
import { UserProfile } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { ConstantService } from './constant.service';
import { isPlatformBrowser } from '@angular/common';


declare var $: any;


@Injectable({
  providedIn: 'root'
})
export class ApiService implements OnInit {

  modalOpenText: string;
  private _url = "https://jsonplaceholder.typicode.com/posts";

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
  }

  headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
  options = { headers: this.headers };
  
  featchBlog(): Observable<any> {
    return this.http.get(ConstantService.WPBLOGS);
  }



  fetchClasses(): Observable<any> {
    return this.http.post(environment.restUrl + ConstantService.FETCHCLASSES, '');
  }

  fetchGenders(): Observable<any> {
    return this.http.post(environment.restUrl + ConstantService.FETCHGENDER, '');
  }

  fetchBoards(): Observable<any> {
    return this.http.post(environment.restUrl + ConstantService.FETCHBOARDS, '');
  }

  fetchUsersForSession(): Observable<any> {
    return this.http.get(environment.restUrl + ConstantService.USERFORSESSION, );
  }

  fetchExpertsForSession(): Observable<any> {
    return this.http.get(environment.restUrl + ConstantService.EXPERTFORSESSION, );
  }
  bookSessionFromAdmin(session_date, id_expert, users, start_time, end_time): Observable<any> {
    let params = new HttpParams().set("session_date", session_date).set("id_expert", id_expert).set("users", users).set("start_time", start_time).set("end_time", end_time);
    debugger
    return this.http.post(environment.restUrl + ConstantService.ADMINBOOKING, params, this.options );
  }

  fetchSubjectGuidance(): Observable<any> {
    return this.http.post(environment.restUrl + ConstantService.FETCHSUBJECT, '');
  }

  fetchPersonalGuidance(): Observable<any> {
    return this.http.post(environment.restUrl + ConstantService.FETCHPERSONALGUIDANCE, '');
  }

  fetchPincode(pincode): Observable<any> {
    let params = new HttpParams().set("pincode", pincode);
    return this.http.post(environment.restUrl + ConstantService.FETCHPINCODE, params, this.options);
  }

  fetchProfilePitcher(experId: string) {
    return this.http.get(environment.restUrl + ConstantService.FETCHPROFILEPITCHER + experId, {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    });
  }

  fetchDocumentPitcher(experId: string) {
    return this.http.get(environment.restUrl + ConstantService.FETCHDOCUMENTPITCHER + experId);
  }

  adminSignIn(loginPayload: LoginPayload) {
    let params = new HttpParams().set("email", loginPayload.email).set("password", loginPayload.password);
    return this.http.post(environment.restUrl + ConstantService.ADMINLOGIN, params);
  }

  fetchCurrentSession() {
    return this.http.get(environment.restUrl + ConstantService.ADMINGETRECENTSESSION);
  }

  fetchThisMonthTransaction() {
    return this.http.get(environment.restUrl + ConstantService.ADMINGETCURRENTMONTHTRANSACTION);
  }

  fetchPreviousMonthTransaction() {
    return this.http.get(environment.restUrl + ConstantService.ADMINGETPREVIOUSMONTHTRANSACTION);
  }

  fetchTotalRevenue() {
    return this.http.get(environment.restUrl + ConstantService.ADMINGETTOTALTRANSACTION);
  }

  fetchAdminUserList() {
    return this.http.get(environment.restUrl + ConstantService.ADMINGETUSER);
  }

  fetchAdminExpertList() {
    return this.http.get(environment.restUrl + ConstantService.ADMINGETEXPERTS);
  }

  fetchAdminSessionList() {
    return this.http.get(environment.restUrl + ConstantService.ADMINSESSIONS);
  }

  deleteDocumentPitcher(documentId) {
    let params = new HttpParams().set("id_document", documentId);
    return this.http.post(environment.restUrl + ConstantService.DELETEDOCUMENTPITCHER, params);
  }

  modalEvent(text: string) {

  }

  openExpertSignInModal(text: string) {
    if (isPlatformBrowser(this.platformId)) {
      $('#signInModal').on('show.bs.modal', function () {
        var modal = $(this)
        modal.find('#ModalLabel').text(text)
      })
      $("#signInModal").modal('show');
    }

  }

  closeExpertSignInModal() {
    if (isPlatformBrowser(this.platformId)) {
      $("#signInModal").modal('hide');
    }
  }

  openOtpVerificationModal() {
    if (isPlatformBrowser(this.platformId)) {
      $('#loginConfirmModal').on('show.bs.modal', function () {
        var modal = $(this)
        modal.find('#hideNumner').text(localStorage.getItem('hideNumber'));
      })
      $('#loginConfirmModal').modal('show');
    }
  }

  closeOtpVerificationModal() {
    if (isPlatformBrowser(this.platformId)) {
      $('#loginConfirmModal').modal('hide');
    }
  }

  openExpertSignUpModal(text: string) {
    if (isPlatformBrowser(this.platformId)) {
      $('#signupModal').on('show.bs.modal', function () {
        var modal = $(this)
        modal.find('#ModalLabel').text(text)
      })
      $('#signupModal').modal('show');
    }
   
  }

  closeExpertSignUpModal() {
    if (isPlatformBrowser(this.platformId)) {
      $('#signupModal').modal('hide');
    }
  }


  signup(signupForm): Observable<any> {
    //let params = new HttpParams().set("fullname", fullname).set("expert_email", expert_email).set("expert_mobile", expert_mobile);
    return this.http.post(environment.restUrl + ConstantService.SIGNUP, signupForm);
  }

  userSignup(signupForm: any): Observable<any> {
    return this.http.post(environment.restUrl + ConstantService.USERSIGNUP, signupForm);
  }

  fetchSlots(expertId): Observable<any> {
    let params = new HttpParams().set("id_expert", expertId);
    return this.http.post(environment.restUrl + ConstantService.FETCHSLOTSBYID, params, this.options);
  }

  saveExpertProfile(expertProfileForm, expertId, isAdmin): Observable<any> {
    let params;
    if (isAdmin) {
      params = new HttpParams().set("address", expertProfileForm.address).set("city", expertProfileForm.city).set("pincode", expertProfileForm.pincode)
        .set("state", expertProfileForm.state).set("id_gender", expertProfileForm.gender).set("id_expert", expertId).set('expert_mobile', expertProfileForm.phNumber)
         .set('full_name', expertProfileForm.name).set('expert_email', expertProfileForm.email)
        .set("value", "1").set("admin", '1').set('time', moment(new Date()).format('YYYY-MM-DD')).set('pan',expertProfileForm.pan);
    } else {
      params = new HttpParams().set("address", expertProfileForm.address).set("city", expertProfileForm.city).set("pincode", expertProfileForm.pincode)
        .set("state", expertProfileForm.state).set("id_gender", expertProfileForm.gender).set("id_expert", expertId)
        .set("value", "1").set('time', moment(new Date()).format('YYYY-MM-DD')).set('expert_mobile', expertProfileForm.phNumber)
        .set('full_name', expertProfileForm.name).set('expert_email', expertProfileForm.email).set('pan',expertProfileForm.pan);
    }

    return this.http.post(environment.restUrl + ConstantService.SAVEEXPERTPROFILE, params, this.options);
  }

  uploadExpertDocumentPitcher(fd: FormData): Observable<any> {
    return this.http.post(environment.restUrl + ConstantService.UPLOADEXPEERTDOCUMENTIMAGE, fd);
  }

  uploadExpertProfilePitcher(fd: FormData): Observable<any> {
    return this.http.post(environment.restUrl + ConstantService.UPLOADEXPERTPROFILEIMAGE, fd);
  }

  saveExpertEducationAndExperience(educationForm, experienceForm, expertId, totalExperience, isAdmin): Observable<any> {
    let params;
    if (isAdmin) {
      params = new HttpParams().set("id_expert", expertId).set("experience", JSON.stringify(experienceForm))
        .set("qualification", JSON.stringify(educationForm)).set("value", "2").set('total_experience', totalExperience)
        .set('admin', '1').set('time', moment(new Date()).format('YYYY-MM-DD'));
    } else {
      params = new HttpParams().set("id_expert", expertId).set("experience", JSON.stringify(experienceForm))
        .set("qualification", JSON.stringify(educationForm)).set("value", "2")
        .set('total_experience', totalExperience).set('time', moment(new Date()).format('YYYY-MM-DD'));
    }
    return this.http.post(environment.restUrl + ConstantService.SAVEEXPERTEDUCATIONANDEXPERIENCE, params, this.options);
  }

  saveExpertServices(expertServiceForm, expertId, isAdmin): Observable<any> {
    console.log("Services =" + JSON.stringify(expertServiceForm))
    let params;
    if (isAdmin) {
      params = new HttpParams().set("classes", JSON.stringify(expertServiceForm.class)).set("board", JSON.stringify(expertServiceForm.boards))
        .set("subject", JSON.stringify(expertServiceForm.subjectGuidance)).set("personal", JSON.stringify(expertServiceForm.personalGuidance)).set("id_expert", expertId)
        .set("value", "3").set("admin", '1').set('time', moment(new Date()).format('YYYY-MM-DD'));
    } else {
      params = new HttpParams().set("classes", JSON.stringify(expertServiceForm.class)).set("board", JSON.stringify(expertServiceForm.boards))
        .set("subject", JSON.stringify(expertServiceForm.subjectGuidance))
        .set("personal", JSON.stringify(expertServiceForm.personalGuidance))
        .set("id_expert", expertId).set("value", "3").set('time', moment(new Date()).format('YYYY-MM-DD'));
    }
    return this.http.post(environment.restUrl + ConstantService.SAVEEXPERTSERVICES, params, this.options);
  }

  saveExpertFee(sixtyMinFee, fortyMinFee, twentyMinFee, expertId, isAdmin): Observable<any> {
    let params;
    if (isAdmin) {
      params = new HttpParams().set("sixty", sixtyMinFee).set("forty", fortyMinFee).
        set("twenty", twentyMinFee).set("id_expert", expertId).set("value", "4").set('admin', '1').set('time', moment(new Date()).format('YYYY-MM-DD'));
    } else {
      params = new HttpParams().set("sixty", sixtyMinFee).set("forty", fortyMinFee).
        set("twenty", twentyMinFee).set("id_expert", expertId).set("value", "4").set('time', moment(new Date()).format('YYYY-MM-DD'));
    }
    return this.http.post(environment.restUrl + ConstantService.SAVEEXPERTFEE, params, this.options);
  }

  createExpertSlots(slots, expertId, isAdmin): Observable<any> {
    let params;
    if (isAdmin) {
      params = new HttpParams().set("slots", JSON.stringify(slots))
        .set("id_expert", expertId).set('admin', '1')
        .set('time', moment(new Date()).format('YYYY-MM-DD'))
        .set("value", "4");
    } else {
      params = new HttpParams().set("slots", JSON.stringify(slots)).
        set("id_expert", expertId)
        .set('time', moment(new Date()).format('YYYY-MM-DD'))
        .set("value", "4");
    }
    return this.http.post(environment.restUrl + ConstantService.CREATEEXPERTSLOTS, params, this.options);
  }

  fetchExpertProfileDetails(expertId): Observable<any> {
    let params = new HttpParams().set("id_expert", expertId);
    return this.http.post(environment.restUrl + ConstantService.FETCHEXPERTPROFILEDETAILS, params, this.options);
  }

  saveExpertListing(listingForm, expertId, isAdmin): Observable<any> {
    let params;
    if (isAdmin) {
      params = new HttpParams().set("description", listingForm.description).set("languages", JSON.stringify(listingForm.primaryLanguage)).
        set("sign_languages", JSON.stringify(listingForm.secondaryLanguage))
        .set("id_expert", expertId).set("value", "5").set('admin', '1').set('time', moment(new Date()).format('YYYY-MM-DD'));
    } else {
      params = new HttpParams().set("description", listingForm.description).set("languages", JSON.stringify(listingForm.primaryLanguage)).
        set("sign_languages", JSON.stringify(listingForm.secondaryLanguage)).set("id_expert", expertId).set("value", "5").set('time', moment(new Date()).format('YYYY-MM-DD'));
    }

    return this.http.post(environment.restUrl + ConstantService.SAVEEXPERTLISTING, params, this.options);
  }

  sendWelcomeEmail(expertId: any) {
    let params = new HttpParams().set("id_expert", expertId)
    return this.http.post(environment.restUrl + ConstantService.WELCOMEMAIL, params);
  }

  fetchQualificationById(expertId): Observable<any> {
    let params = new HttpParams().set("id_expert", expertId);
    return this.http.post(environment.restUrl + ConstantService.FETCHQUALIFICATIONBYID, params, this.options);
  }

  login(mobile): Observable<any> {
    let params = new HttpParams().set('mobile', mobile);
    return this.http.post(environment.restUrl + ConstantService.LOGIN, params, this.options);
  }

  fetchExperienceById(expertId): Observable<any> {
    let params = new HttpParams().set('id_expert', expertId);
    return this.http.post(environment.restUrl + ConstantService.FETCHEXPERIENCEBYID, params, this.options);
  }

  fetchPersonalById(expertId): Observable<any> {
    let params = new HttpParams().set('id_expert', expertId);
    return this.http.post(environment.restUrl + ConstantService.FETCHPERSONALBYID, params, this.options);
  }

  fetchClassesById(expertId): Observable<any> {
    let params = new HttpParams().set('id_expert', expertId);
    return this.http.post(environment.restUrl + ConstantService.FETCHCLASSBYID, params, this.options);
  }

  fetchExpertListById(expertId): Observable<any> {
    let params = new HttpParams().set('id_expert', expertId);
    return this.http.post(environment.restUrl + ConstantService.FETCHEXPERTLISTBYID, params, this.options);
  }

  fetchFeeById(expertId): Observable<any> {
    let params = new HttpParams().set('id_expert', expertId);
    return this.http.post(environment.restUrl + ConstantService.FETCHFEEBYID, params, this.options);
  }

  fetchBoardsById(expertId): Observable<any> {
    let params = new HttpParams().set('id_expert', expertId);
    return this.http.post(environment.restUrl + ConstantService.FETCHBOARDBYID, params, this.options);
  }

  fetchSubjectById(expertId): Observable<any> {
    let params = new HttpParams().set('id_expert', expertId);
    return this.http.post(environment.restUrl + ConstantService.FETCHSUBJECTBYID, params, this.options);
  }

  fetchExperts(id_class, value): Observable<any> {
    let params = new HttpParams().set("id_class", id_class).set("value", value);
    return this.http.post<any>(environment.restUrl + ConstantService.FETCHEXPERTRESULT, params, this.options)
  }

  search(id_class, value): Observable<any> {
    let params = new HttpParams().set("id_class", id_class).set("value", value);
    return this.http.post<any>(environment.restUrl + ConstantService.USERSEARCH, params, this.options)
  }

  slots(id_expert): Observable<any> {
    let params = new HttpParams().set("id_expert", id_expert);
    return this.http.post<any>(environment.restUrl + ConstantService.FETCHSLOTSBYID, params, this.options)
  }

  searchAll(): Observable<any> {
    return this.http.post<any>(environment.restUrl + ConstantService.SEARCHALLUSER, this.options)
  }

  fetchUserExpertDetails(expertId: any, userId: any): Observable<any> {
    let params = null;
    if (userId) {
      params = new HttpParams().set("id_expert", expertId).set('id_user', userId);
    } else {
      params = new HttpParams().set("id_expert", expertId);
    }
    return this.http.post<any>(environment.restUrl + ConstantService.FETCHUSEREXPERTDETAILS, params, this.options);

  }

  getRecentSessions(expertId) {
    let params = new HttpParams().set("id_expert", expertId);
    return this.http.post<any>(environment.restUrl + ConstantService.GETEXPERTRECENTSESSION, params, this.options);
  }

  getExpertTransaction(expertId) {
    let params = new HttpParams().set("id_expert", expertId);
    return this.http.post<any>(environment.restUrl + ConstantService.GETEXPERTTRANSACTION, params, this.options);
  }

  getUpcominReservationSession(expertId: any) {
    let params = new HttpParams().set("id_expert", expertId);
    return this.http.post<any>(environment.restUrl + ConstantService.RESERVATIONUPCOMINGSESSION, params);

  }

  getPastReservationSession(expertId: any) {
    let params = new HttpParams().set("id_expert", expertId);
    return this.http.post<any>(environment.restUrl + ConstantService.RESERVATIONPASTSESSION, params);

  }

  getExpertReview(expertId) {
    let params = new HttpParams().set("id_expert", expertId);
    return this.http.post<any>(environment.restUrl + ConstantService.EXPERTREVIEW, params);

  }

  getSingleSession(sessionId: any) {
    let params = new HttpParams().set("id_session", sessionId);
    return this.http.post<any>(environment.restUrl + ConstantService.SINGLESESSION, params);
  }

  getMultiSession(sessionId: any) {
    let params = new HttpParams().set("id_session", sessionId);
    return this.http.post<any>(environment.restUrl + ConstantService.MULTISESSION, params);

  }

  getSessions(expertId: any, sessionStartDate: string, sesssionEndDate: string) {
    let params = new HttpParams().set("start_date", sessionStartDate)
      .set("end_date", sesssionEndDate).set("id_expert", expertId);
    return this.http.post<any>(environment.restUrl + "user/get/session", params);
  }

  saveUserProfile(userDetails: UserProfile, userId: string, isAdmin: any) {
    let params = new HttpParams()
      .set('id_gender', userDetails.gender)
      .set('dob', userDetails.dob).set('id_user', userId)
      .set('id_user', userId)
      .set('full_name', userDetails.name)
      .set('user_mobile', userDetails.phNumber)
      .set('user_email', userDetails.email)
      .set('time', moment(new Date()).format('YYYY-MM-DD'))
      .set("address", userDetails.address)
      .set("city", userDetails.city)
      .set("pincode", userDetails.pincode)
      .set("state", userDetails.state)
      .set("gstin", userDetails.gstin)


    if (isAdmin) {
      params.set('admin', '1');
    }
    return this.http.post<any>(environment.restUrl + ConstantService.USERSAVEPROFILE, params);
  }

  getUserProfile(userId: any) {
    let params = new HttpParams().set("id_user", userId);
    return this.http.post<any>(environment.restUrl + ConstantService.USERGETPROFILE, params);
  }

  uploadUserProfilePitcher(fd: FormData): Observable<any> {
    return this.http.post<any>(environment.restUrl + ConstantService.USERSAVEPROFILEPITCHER, fd);
  }

  getUserProfilePitcher(userId: any) {
    return this.http.get<any>(environment.restUrl + ConstantService.USERGETPROFILEPITCHER + userId)
  }

  getUserRecentSessions(userId: string) {
    let params = new HttpParams().set("id_user", userId);
    return this.http.post<any>(environment.restUrl + ConstantService.USERRECENTSESSION, params, this.options);
  }


  getUserUpcomingSessions(userId: string) {
    let params = new HttpParams().set("id_user", userId);
    return this.http.post<any>(environment.restUrl + ConstantService.USERUPCOMINGSESSION, params);
  }

  getUserPastSessions(userId: string) {
    let params = new HttpParams().set("id_user", userId);
    return this.http.post<any>(environment.restUrl + ConstantService.USERPASTSESSION, params);
  }

  createMultiSession(multiSessionObj: any, expertId: string, userId: string, query: string, admin: any, days: string) {
    if (isPlatformBrowser(this.platformId)) {
      let sessionClass = sessionStorage.getItem('searchedClass');
      let sessionRole = sessionStorage.getItem('role');
      let params = new HttpParams().set("id_user", userId)
        .set('id_expert', expertId).set('start_date', multiSessionObj.startDate)
        .set('end_date', multiSessionObj.endDate).set('start_time', multiSessionObj.start_time + ":00")
        .set('end_time', multiSessionObj.end_time + ":00").set('days', days)
        .set('data', query)
        .set('classes', sessionClass)
        .set('subject', sessionRole)
      if (admin) {
        params.set('admin', admin);
      }
      return this.http.post<any>(environment.restUrl + ConstantService.USERCREATEMULTISESSION, params);
    }
    
   
  }

  createSingleSession(SingleSessionObj: any, expertId: string, userId: string, query: string, admin: any) {
    if (isPlatformBrowser(this.platformId)) {
      let sessionClass = sessionStorage.getItem('searchedClass');
      let sessionRole = sessionStorage.getItem('role');
      let params = new HttpParams().set("id_user", userId)
        .set('id_expert', expertId)
        .set('session_date', SingleSessionObj.date)
        .set('start_time', SingleSessionObj.start_time)
        .set('end_time', SingleSessionObj.end_time)
        .set('classes', sessionClass)
        .set('subject', sessionRole)
        .set('data', query);
      if (admin) {
        params.set('admin', admin);
      }
      return this.http.post<any>(environment.restUrl + ConstantService.USERCREATESINGLESESSION, params);
    }
  
  }

  getUserSavedExpertList(userId: string) {
    let params = new HttpParams().set("id_user", userId);
    return this.http.post<any>(environment.restUrl + ConstantService.USERGETSAVEDEXPERTS, params);
  }

  saveUserExpert(experId: any, userId: string, select: any) {
    let params = new HttpParams().set("id_user", userId)
      .set('id_expert', experId)
      .set('select', select);
    return this.http.post<any>(environment.restUrl + ConstantService.USERSAVEEXPERT, params);
  }

  getUserListForDropDown() {
    return this.http.post<any>(environment.restUrl + ConstantService.USERLISTFORDROPDOWN, this.options);
  }

  createPayment(data: any) {
    console.log(data)
    //  let params = new HttpParams().set("name", name).set('file', JSON.stringify(document))
    //   .set('email', email).set('mobile', mobile).set('amount', amount).set('id_user', userId).set('id_expert', expertId)
    //    .set('multi', multi).set('start_time', startTime).set('end_time', endTime).set('session_date', sessionDate)
    //    .set('classes', classes).set('subject', subject).set('query', query);
    // // console.log(JSON.stringify(document));
    return this.http.post<any>(environment.restUrl + ConstantService.EXPERTCREATEPAYMENT, data);
  }

  saveChannelId(channelId: any, sessionId: any, multi: any) {
    let params = new HttpParams().set("id_session", sessionId)
      .set('id_channel', channelId)
      .set('multi', multi)
    
    return this.http.post<any>(environment.restUrl + ConstantService.EXPERTSAVECHANNELID, params);
  }

  getChannelId(sessionId: any, multi: any) {
    let params = new HttpParams().set("id_session", sessionId)
      .set('multi', multi)
    return this.http.post<any>(environment.restUrl + ConstantService.EXPERTGETCHANNEL, params);
  }

  resheduleSession(sessionId: any, multi: any, start_time:
    string, end_time: string, sessionDate: string, rescheduleBy: string, feedback: string) {

    let params = new HttpParams().set("id_session", sessionId).set('multi', multi)
      .set('start_time', start_time).set('end_time', end_time).set('session_date', sessionDate)
      .set('rescheduled_by', rescheduleBy).set('feedback', feedback)
    return this.http.post<any>(environment.restUrl + ConstantService.RESHEDULESESSION, params);
  }

  cancelSession(sessionId: string, multi: any, feedback: string, canceledBy: string) {
    let params = new HttpParams().set("id_session", sessionId).set('multi', multi)
      .set('cancelled_by', canceledBy).set('feedback', feedback)
    return this.http.post<any>(environment.restUrl + ConstantService.CANCELSESSION, params);
  }

  sendUserOtp(mobile: any) {
    let params = new HttpParams().set('mobile', mobile);
    return this.http.post<any>(environment.restUrl + ConstantService.SENDUSERLOGINOTP, params);
  }

  verifyUserOtp(userId: any, otp: any) {
    let params = new HttpParams().set('id_user', userId).set('otp', otp);
    return this.http.post<any>(environment.restUrl + ConstantService.VERIFYUSERLOGINOTP, params);
  }

  sendUserSignUpOtp(email: string, mobile: string, name: string) {
    let params = new HttpParams().set('user_email', email).set('user_mobile', mobile).set('full_name', name)
    return this.http.post<any>(environment.restUrl + ConstantService.SENDUSERSIGNUPOTP, params);
  }

  verifyUserSignUpOtp(email: string, mobile: string, name: string, otp: any) {
    let params = new HttpParams().set('user_email', email)
      .set('user_mobile', mobile).set('full_name', name)
      .set('mobile', mobile).set('otp', otp)
    return this.http.post<any>(environment.restUrl + ConstantService.VERIFYUSERSIGNUPOTP, params);
  }

  sendExpertOtp(mobile: any) {
    let params = new HttpParams().set('mobile', mobile);
    return this.http.post<any>(environment.restUrl + ConstantService.SENDEXPERTLOGINOTP, params);
  }

  verifyExpertOtp(expertId: string, otp: any) {
    let params = new HttpParams().set('id_expert', expertId).set('otp', otp);
    return this.http.post<any>(environment.restUrl + ConstantService.VERIFYEXPERTLOGINOTP, params);
  }

  sendExpertSignUpOtp(email: string, mobile: string, name: string) {
    let params = new HttpParams().set('expert_email', email).set('expert_mobile', mobile).set('full_name', name)
    return this.http.post<any>(environment.restUrl + ConstantService.SENDEXPERTSIGNUPOTP, params);
  }

  verifyExpertSignUpOtp(email: string, mobile: string, name: string, otp: any) {
    let params = new HttpParams().set('expert_email', email)
      .set('expert_mobile', mobile).set('full_name', name)
      .set('mobile', mobile).set('otp', otp)
    return this.http.post<any>(environment.restUrl + ConstantService.VERIFYEXPERTSIGNUPOTP, params);
  }

  // searchExpert(classId: string, id: string, role: string, start: any, end: any, userId: any) {
  //   let params = new HttpParams().set('id_class', classId).set('id', id).set('role', role)
  //     .set('start', start).set('end', end).set('id_user', userId);
  //   return this.http.post<any>(environment.restUrl + ConstantService.SEARCHEXPERT, params);
  // }

  searchExpert(classId: string, role_id: string, role: string, filter: any, short_by: string, expert_ids:any,
    start: any, end: any, userId: any) {

      let params = {
        id_class: classId,
        id: role_id,
        role: role,
        filter: filter,
        sort_by: short_by,
        expert_ids: expert_ids,
        start: start,
        end: end,
        id_user: userId
      }


    // let params = new HttpParams()
    //     .set('id_class', classId)
    //     .set('id', role_id)
    //     .set('role', role)
    //     .set('filter', JSON.stringify(filter))
    //     .set('sort_by', short_by)
    //     .set('expert_ids', JSON.stringify(expert_ids))
    //     .set('start', start)
    //     .set('end', end)
    //     .set('id_user', userId);
    return this.http.post<any>(environment.restUrl + ConstantService.SEARCHEXPERT, params);
  }

  AdminDeleteExpert(expertId: string) {
    let params = new HttpParams().set('id_expert', expertId);
    return this.http.post<any>(environment.restUrl + ConstantService.ADMINDELETEEXPERT, params);
  }

  AdminApproveExpert(expertId: string) {
    let params = new HttpParams().set('id_expert', expertId);
    return this.http.post<any>(environment.restUrl + ConstantService.ADMINAPPROVEEXPERT, params);
  }

  AdminDeleteUser(userId: string,status:any) {
    let params = new HttpParams().set('id_user', userId).set("status",status);
    return this.http.post<any>(environment.restUrl + ConstantService.ADMINDELETEUSER, params);
  }

  userGetSixtySession(startDate: string, time: string, endDate: string, expertId: any) {
    let params = new HttpParams().set('id_expert', expertId)
      .set('start_date', startDate).set('end_date', endDate).set('time',time)
    return this.http.post<any>(environment.restUrl + ConstantService.USERGETSIXTYSESSION, params);
  }

  userGetFortySession(startDate: string, time: string, endDate: string, expertId: any) {
    let params = new HttpParams().set('id_expert', expertId)
      .set('start_date', startDate).set('end_date', endDate).set('time', time)
    return this.http.post<any>(environment.restUrl + ConstantService.USERGETFORTYSESSION, params);
  }

  userGetTwentySession(startDate: string, time: string, endDate: string, expertId: any) {
    let params = new HttpParams().set('id_expert', expertId)
      .set('start_date', startDate).set('end_date', endDate).set('time', time)
    return this.http.post<any>(environment.restUrl + ConstantService.USERGETTWENTYSESSION, params);
  }

  userAddReview(expertId: string, userId: string, rating: any, review: string) {
    let params = new HttpParams().set('id_expert', expertId)
      .set('id_user', userId).set('rating', rating).set('review', review);
    return this.http.post<any>(environment.restUrl + ConstantService.USERADDREVIEW, params);
  }

  ExpertLoginResndOTp(expertId: any) {
    let params = new HttpParams().set('id_expert', expertId);
    return this.http.post<any>(environment.restUrl + ConstantService.EXPERTLOGINRESENDOTP, params);
  }

  UsertLoginResndOTp(userId: any) {
    let params = new HttpParams().set('id_user', userId);
    return this.http.post<any>(environment.restUrl + ConstantService.USERLOGINRESENDOTP, params);
  }

  SignUpResendOTP(mobile: any) {
    let params = new HttpParams().set('mobile', mobile);
    return this.http.post<any>(environment.restUrl + ConstantService.SIGNUPRESENDOTP, params);
  }

  adminInsertClass(newValue: any) {
    let params = new HttpParams().set('classes', newValue);
     return this.http.post<any>(environment.restUrl + ConstantService.ADMININSERTCLASS, params);
  }

  adminInsertBoard(newValue: any) {
    let params = new HttpParams().set('boards', newValue);
     return this.http.post<any>(environment.restUrl + ConstantService.ADMININSERTBOARD, params);
  }

  adminInsertSubjectGuidance(newValue: any) {
    let params = new HttpParams().set('subject_guidances', newValue);
     return this.http.post<any>(environment.restUrl + ConstantService.ADMININSERTSUBJECTGUIDANCE, params);
  }

  adminInsertPersonalGuidance(newValue: any) {
    let params = new HttpParams().set('personal_guidances', newValue);
     return this.http.post<any>(environment.restUrl + ConstantService.ADMININSERTPERSONALGUIDANCE, params);
  }

  adminDeleteClass(classId: any) {
    let params = new HttpParams().set('id_class', classId);
    return this.http.post<any>(environment.restUrl + ConstantService.ADMINDELETECLASS, params);
  }
  adminDeleteBoard(boardId: any) {
    let params = new HttpParams().set('id_board', boardId);
    return this.http.post<any>(environment.restUrl + ConstantService.ADMINDELETEBOARD, params);
  }
  adminDeleteSubject(subjectId: any) {
    let params = new HttpParams().set('id_subject', subjectId);
    return this.http.post<any>(environment.restUrl + ConstantService.ADMINDELETESUBJECTGUIDANCE, params);
  }
  adminDeletePersonal(personalId: any) {
    let params = new HttpParams().set('id_personal', personalId);
    return this.http.post<any>(environment.restUrl + ConstantService.ADMINDELETEPERSONALGUIDANCE, params);
  }

  adminDownloadAllSession() {
    return this.http.get(environment.restUrl + ConstantService.ADMINALLSESSIONDOWNLOAD, {
      responseType: 'arraybuffer'
    });
  }

  adminDownloadCurrSession() {
    return this.http.get(environment.restUrl + ConstantService.ADMINCURRSESSIONDOWNLOAD, {
      responseType: 'arraybuffer'
    });
  }
  adminDownloadPrevSession() {
    return this.http.get(environment.restUrl + ConstantService.ADMINPREVSESSIONDOWNLOAD, {
      responseType: 'arraybuffer'
    });
  }

  adminDownloadAllUser() {
    return this.http.get(environment.restUrl + ConstantService.ADMINALLUSERDOWNLOAD, {
      responseType: 'arraybuffer'
    });
  }

  adminDownloadAllExpert() {
    return this.http.get(environment.restUrl + ConstantService.ADMINALLEXPERTDOWNLOAD, {
      responseType: 'arraybuffer'
    });
  }

  adminDownloadCurrentUser() {
    return this.http.get(environment.restUrl + ConstantService.ADMINCURRENTUSERDOWNLOAD, {
      responseType: 'arraybuffer'
    });
  }

  adminDownloadCurrentExpert() {
    return this.http.get(environment.restUrl + ConstantService.ADMINCURRENTEXPERTDOWNLOAD, {
      responseType: 'arraybuffer'
    });
  }

  adminDownloadPreviousUser() {
    return this.http.get(environment.restUrl + ConstantService.ADMINPREVIOUSUSERDOWNLOAD, {
      responseType: 'arraybuffer'
    });
  }

  adminDownloadPreviousExpert() {
    return this.http.get(environment.restUrl + ConstantService.ADMINPREVIOUSEXPERTDOWNLOAD, {
      responseType: 'arraybuffer'
    });
  }

  downloadExpertSessions(expertId: any) {
    return this.http.get(environment.restUrl + ConstantService.EXPERTSESSIONDOWNLOAD + "/" + expertId, {
      responseType: 'arraybuffer'
    });
  }

  adminChangePassword(id_admin: any, oldPassword: string, newPassword: string) {
    let params = new HttpParams().set('id_admin', id_admin).set('old_passwd', oldPassword).set('new_passwd', newPassword);
    return this.http.post<any>(environment.restUrl + ConstantService.ADMINCHANGENPASSWORD, params);
  }
  adminSessionBooking(multi:any, session_date:any, id_expert:any, id_user:any, start_time:any, end_time:any, classes:any, subject:any, query:any, days:any) {
    let params = new HttpParams().set('multi', multi)
    .set('session_date', session_date).set('id_expert',id_expert).set('id_user' , id_user).set('start_time',start_time).set('end_time',end_time).set('classes',classes).set('subject' ,subject).set('query',query).set('days','');
    return this.http.post<any>(environment.restUrl + ConstantService.ADMINSESSION, params);
  }


  getPromoCode(promo:string,id_user,duration,id_expert,fees) {

    let params = new HttpParams().set('promo',promo).set('id_user', id_user).set('duration', duration).set('id_expert', id_expert).set('fees', fees);
    // console.log(ConstantService.PROMOCODE)
    return this.http.post<any>(environment.restUrl + ConstantService.PROMOCODE, params);
  }

  updateExpert(id_expert,value) {
    let params = new HttpParams().set('id_expert',id_expert).set('value', value)
    return this.http.post<any>(environment.restUrl + ConstantService.UPDATEEXPERT, params);
  }

  featuredExpert() {
    return this.http.post<any>(environment.restUrl + ConstantService.FEATUREDEXPERT, '');
  }
  wpBlogs() {
    return this.http.post<any>(ConstantService.WPBLOGS, '');
  }
  ExpertVideo(id_expert) {
    let params = new HttpParams().set('id_expert',id_expert)
    return this.http.post<any>(environment.restUrl + ConstantService.EXPERTVIDEO, params);
  }

}
