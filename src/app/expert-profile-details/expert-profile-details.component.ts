import { HostListener, Component, ElementRef, Input, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/services/api.service';
import { UtilityService } from 'src/services/utility.service';
import { Reviews } from '../models/expert.service.model';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'jquery';
import {isPlatformBrowser} from "@angular/common";

declare var $: any;
declare let ga: Function;

@Component({
	selector: 'app-expert-profile-details',
	templateUrl: './expert-profile-details.component.html',
	styleUrls: [ './expert-profile-details.component.css' ]
})
export class ExpertProfileDetailsComponent implements OnInit {
	@Input('roleToNavigateBack') roleToNavigateBack: string;
	@ViewChild('shareUrl', { static: true })
	shareInput: ElementRef;
	@ViewChild('shareButton', { static: true })
	shareButton: ElementRef;
	@ViewChild('desc', { static: true })
	descParagraph: ElementRef;

	screenWidth: any;
	showNaveBar: boolean = true;
	cardShow: boolean = false;
	dummySubject: any[];
	classes: any;
	boards: any[];
	personalGuidance: any[];
	showShortDesciption = true;
	reviews: any;
	showReviewShortDesc = true;
	showMoreDates = true;
	multiSessionError: boolean = false;
	experts: any;
	name: string;
	languages: any;
	review: Reviews;
	countReview: any = 0;
	overAllRating: string = '0';
	numberOflines: number;
	desc: string;
	descLength: number;
	sin: any;
	education: any;
	experience: any;
	slot: any;
	degree: any;
	spec: any;
	id: string;
	total_experience: number;
	imgUrl: any;
	isAdmin: any;
	slotDisplay: any[] = [];
	showSessions: any;
	selectedSessionDay: number[] = [];
	minDate: Date = new Date();
	selectTimeFrame: string = '';
	timeframeArray: any[] = [];
	selectedTimeFrame: any = '';
	multiSessionObj: any = {};
	reviewBtn: boolean = false;
	format: string = 'hh:mm:ss';
	days = [];
	place: string;
	startDateDisabled: boolean = true;
	endDateDisabled: boolean = true;
	sessionPrices: any = {};
	showSessionPrice: any;
	isLoggedIn: string;
	id_user: string;
	role: string;
	multiSessionCount: number = 0;
	isSelected: number = 0;
	userType: string;
	shareLocation: string;
	facebookLocation: string;
	twitterLocation: string;
	pinterestLocation: string;
	linkedInLocation: string;
	whatsappLocation: string;
	postTitle: string;
	approved: number;
	showReviewShortDesc1 = true;
	showReviewShortDesc2 = true;
	showReviewShortDesc3 = true;
	showReviewShortDesc4 = true;
	selectedSessionTiming: string;
	sixtySessionBasePrice: string;
	availableSessions: any = {
		twenty: [],
		forty: [],
		sixty: []
	};
	weekDaysValue = {
		Sun: 0,
		Mon: 1,
		Tue: 2,
		Wed: 3,
		Thu: 4,
		Fri: 5,
		Sat: 6
	};
	videos;
	video_url;
	video_msg;

	constructor(
		private route: ActivatedRoute,
		private sanitizer: DomSanitizer,
		private router: Router,
		private apiService: ApiService,
		private UtilityService: UtilityService,
		private toast: ToastrService,
		@Inject(PLATFORM_ID) private platformId: Object
	) {
		if(isPlatformBrowser(this.platformId)){
			this.roleToNavigateBack = sessionStorage.getItem('role');
			this.role = sessionStorage.getItem('role');
		}

		this.showShortDesciption = true;
		this.showReviewShortDesc = true;
		this.showMoreDates = true;
		
		this.id = this.route.snapshot.params.id;
		this.isAdmin = localStorage.getItem('isadmin');
	}

	ngAfterViewInit(): void {
		this.router.events.subscribe(event => {
		  // I check for isPlatformBrowser here because I'm using Angular Universal, you may not need it
		  if (event instanceof NavigationEnd && isPlatformBrowser(this.platformId)) {
			console.log(ga); // Just to make sure it's actually the ga function
			ga('set', 'page', event.urlAfterRedirects);
			ga('send', 'pageview');
		  }
		});
	  }

	@HostListener('window:resize', [ '$event' ])
	getScreenSize(event?) {
		if(isPlatformBrowser(this.platformId)){
			this.screenWidth = window.innerWidth;
		}
	}

	ngOnInit(): void {
		this.facebookLocation = 'https://www.facebook.com/sharer.php?u=' + this.shareLocation;
		this.twitterLocation = 'https://twitter.com/share?url=' + this.shareLocation;
		this.pinterestLocation = 'https://pinterest.com/pin/create/bookmarklet/?url=' + this.shareLocation;
		this.linkedInLocation = 'https://www.linkedin.com/shareArticle?url=' + this.shareLocation;
		this.whatsappLocation = 'https://api.whatsapp.com/send?text=' + this.shareLocation;
		this.postTitle = 'Hi, please check this out';
		this.numberOflines = 144 / 20;
		this.isLoggedIn = localStorage.getItem('isLoggedIn');
		this.id_user = localStorage.getItem('id_user');
		this.userType = localStorage.getItem('user_role');
		this.fetchProfilePitcher();
		this.expertDetail();
		this.slots();
		this.getVideo(this.id);
		if(isPlatformBrowser(this.platformId)){
			this.shareLocation = encodeURI(window.location.href);
			this.screenWidth = window.innerWidth;
			$(document).ready(function() {
				var url = $('#Geeks3').attr('src');
				$('#Geeks2').on('hide.bs.modal', function() {
					$('#Geeks3').attr('src', '');
				});
				$('#Geeks2').on('show.bs.modal', function() {
					$('#Geeks3').attr('src', url);
				});
			});
		}
	}

	showNavBar() {
		this.showNaveBar = false;
	}
	showResponsiveCard() {
		this.cardShow = !this.cardShow;
		if (this.cardShow) {
			this.showNaveBar = false;
		} else {
			this.showNaveBar = true;
		}
	}

	CopyUrl() {
		this.shareInput.nativeElement.select();
		this.shareInput.nativeElement.setSelectionRange(0, 99999); /* For mobile devices */
		document.execCommand('copy');
		if(isPlatformBrowser(this.platformId)){
			$('#ShareExpertModal').modal('hide');
		}
		this.toast.success('Expert profile link is copied');
	}

	private expertDetail() {
		this.apiService.fetchUserExpertDetails(this.id, this.id_user).subscribe((res) => {
			this.experts = res.experts;
			this.classes = this.experts.class;
			this.boards = this.experts.boards;
			this.education = this.experts.education;
			this.degree = this.education[0].degree;
			this.spec = this.education[0].specialization;
			this.dummySubject = this.experts.subject;
			this.personalGuidance = this.experts.personalGuidance;
			this.name = this.experts.name;
			this.languages = this.removeUndefined(this.experts.languages);
			this.review = this.experts.review;
			console.warn("experts reviw", this.experts.review);
			this.desc = this.experts.desc; 
			this.descLength = this.desc.split(' ').length;
			this.place = this.experts.place;
			this.experience = this.experts.experience;
			this.total_experience = this.experts.total_experience;
			this.sin = this.experts.sign;
			this.isSelected = this.experts.selected;
			this.countReview = this.experts.count;
			this.reviews = this.experts.review;
			this.approved = this.experts.approved;
			this.overAllRating = this.calculateOverallRating(this.experts.review);
			this.getTwentyMinuteSessions();
			this.getFortyMinuteSessions();
			this.getSixtyMinuteSessions();
		});
	}

	removeUndefined(languages: string) {
		let filteresLanguage = languages.split(', ').filter((l) => {
			return l != 'undefined';
		});
		return filteresLanguage.join(', ');
	}

	getReviewShortDescription(index: number) {
		switch (index) {
			case 0:
				return this.showReviewShortDesc1;
				break;
			case 1:
				return this.showReviewShortDesc2;
				break;
			case 2:
				return this.showReviewShortDesc3;
				break;
			case 3:
				return this.showReviewShortDesc4;
		}
	}

	toggleReviewShowMore(index: number) {
		switch (index) {
			case 0:
				this.showReviewShortDesc1 = !this.showReviewShortDesc1;
				break;
			case 1:
				this.showReviewShortDesc2 = !this.showReviewShortDesc2;
				break;
			case 2:
				this.showReviewShortDesc3 = !this.showReviewShortDesc3;
				break;
			case 3:
				this.showReviewShortDesc4 = !this.showReviewShortDesc4;
		}
	}

	calculateStringData(review: string) {
		return review.split(' ').length;
	}

	calculateOverallRating(reviews: any[]) {
		if (reviews && reviews.length > 0) {
			let ratingCount = reviews.length;
			let sum: number = 0;
			reviews.forEach((review) => {
				sum = sum + +review.rating;
			});
			return (sum / ratingCount).toFixed(1);
		}
		return '0';
	}

	fetchProfilePitcher() {
		this.apiService.fetchProfilePitcher(this.id).subscribe((data: any) => {
			if (data.code == 1000) {
				this.imgUrl = data.file;
			} else {
				this.imgUrl = '../../assets/images/image.png';
			}
		});
	}

	createImageUrl(pic: string) {
		if (pic) {
			return pic;
		}
		return '../../assets/images/image.png';
	}

	bookmarkExpert() {
		if (this.isLoggedIn) {
			if (this.isSelected == 1) {
				this.isSelected = 0;
			} else {
				this.isSelected = 1;
			}
			this.apiService.saveUserExpert(this.id, this.id_user, this.isSelected).subscribe((data) => {
				console.log(data);
			});
		} else {
			this.apiService.openExpertSignInModal('User LoggedIn');
			localStorage.setItem('redirectUrl', this.router.url);
		}
	}

	onClick(event) {
		console.log(event);
	}

	slots() {
		this.apiService.slots(this.id).subscribe((res) => {
			let slots = res.slots;
			if (Object.keys(slots).length === 0) {
				this.slotDisplay = null;
			} else {
				for (let day in slots) {
					this.slotDisplay.push({
						weekday: day,
						timing: slots[day]
					});
				}
			}
			this.createTimeSlotForMultipleBooking();
		});
	}

	createTimeSlotForMultipleBooking() {
		let timeArray = [];
		this.slotDisplay.forEach((slot) => {
			slot.timing.forEach((time: any) => {
				let startTime = time.start;
				let endTime = time.end;
				let totaltiming = startTime + '-' + endTime;
				if (timeArray.indexOf(totaltiming) == -1) {
					if (totaltiming != '00:00:00-00:00:00') {
						timeArray.push(totaltiming);
					}
				}
			});
		});
		this.breakTheTimeFrame(timeArray);
	}

	breakTheTimeFrame(timeArray: any[]) {
		let finalArray = [];
		timeArray.forEach((time) => {
			let times = time.split('-');
			var startTime = moment(times[0], 'HH:mm:ss');
			var endTime = moment(times[1], 'HH:mm:ss');
			var duration = moment.duration(endTime.diff(startTime));
			var hours = parseInt(duration.asHours().toString());
			if (hours > 1) {
				for (let i = 0; i < hours; i++) {
					let start = startTime.format();
					let end: string = moment(start).add(1, 'hours').format();
					startTime = moment(end);
					let finalTime = moment(start).format('h:mm a') + '-' + moment(end).format('h:mm a');
					if (finalArray.indexOf(finalTime) == -1) {
						finalArray.push(finalTime);
					}
				}
			} else {
				let finalTime = moment(startTime).format('h:mm a') + '-' + moment(endTime).format('h:mm a');
				if (finalArray.indexOf(finalTime) == -1) {
					finalArray.push(finalTime);
				}
			}
		});
		this.timeframeArray = finalArray;
	}

	onTimeFrame(event: any) {
		this.days = [];
		let timeframe = event.target.value.split('-');
		let startTime = moment(timeframe[0], 'hh:mm A').format('HH:mm:ss');
		let endTime = moment(timeframe[1], 'hh:mm A').format('HH:mm:ss');
		this.slotDisplay.forEach((slot) => {
			slot.timing.forEach((time: any) => {
				let startTimeBetween = moment(startTime, this.format);
				let endTimeBetween = moment(endTime, this.format);
				let beforeTime = moment(time.start, this.format);
				let afterTime = moment(time.end, this.format);
				let isBetweenStart = startTimeBetween.isBetween(beforeTime, afterTime, null, '[]');
				let isBetweenEnd = endTimeBetween.isBetween(beforeTime, afterTime, null, '[]');
				if (isBetweenStart && isBetweenEnd) {
					this.days.push(this.weekDaysValue[slot.weekday]);
				}
			});
		});
		this.multiSessionObj.start_time = startTime;
		this.multiSessionObj.end_time = endTime;
		this.multiSessionObj.date = moment().format();
		this.startDateDisabled = false;
	}

	checkDays(day: number) {
		if (this.days.indexOf(day) != -1) {
			return false;
		}
		return true;
	}

	showAllReview() {
		if(isPlatformBrowser(this.platformId)){
			$('#showAllReview').modal('show');
		}
	}

	createTimeFormat(date: string) {
		let currentDate = moment(new Date()).format('YYYY-MM-DD');
		let currentDateTime = currentDate + 'T' + date + '+05:30';
		return moment(currentDateTime).format('h:mm a');
	}

	back() {
		if(isPlatformBrowser(this.platformId)){
			window.history.back();
			window.close();
		}

	}

	openBookMultipleSessions() {
		if(isPlatformBrowser(this.platformId)){
			$('#bookMultipleSessions').modal('show');
		}
	}

	closeMulipleSAession() {
		this.days = [];
		if(isPlatformBrowser(this.platformId)){
			$('#bookMultipleSessions').on('hidden.bs.modal', function() {
				$(this).find('form').trigger('reset');
			});
		}
	}

	sessionTimingChange(time: string) {
		if (time === '20') {
			this.createAvailabalitySession(this.availableSessions.twenty);
			this.showSessionPrice = this.sessionPrices.twenty;
		} else if (time === '40') {
			this.createAvailabalitySession(this.availableSessions.forty);
			this.showSessionPrice = this.sessionPrices.forty;
		} else {
			this.createAvailabalitySession(this.availableSessions.sixty);
			this.showSessionPrice = this.sessionPrices.sixty;
		}
		this.selectedSessionTiming = time;
	}

	formatSessionDate(date: string) {
		var todaysDate = moment(new Date()).format().split('T')[0];
		var endDate = moment(date).format().split('T')[0];
		var diff = moment(endDate).diff(moment(todaysDate), 'days');
		if (diff === 0) {
			return 'Today';
		}
		return moment(date).format('ddd, DD MMM');
	}

	calculateSessionDuration(sessionStart: string, sessionEnd: string, sessionDate: string) {
		return this.UtilityService.calculateSessionDuration(sessionStart, sessionEnd, sessionDate);
	}

	getUserSessions() {
		let todayDate = moment(new Date()).format('YYYY-MM-DD');
		let dateAfter7Days = moment().add(7, 'days').format('YYYY-MM-DD');
		this.apiService.getSessions(this.experts.id, todayDate, dateAfter7Days).subscribe((data) => {
			if (data.code === 1000) {
				(this.availableSessions.twenty = data.twenty),
					(this.availableSessions.forty = data.forty),
					(this.availableSessions.sixty = data.sixty);
				this.sessionPrices = data.price;
				this.showSessionPrice = data.price.sixty;
				this.createAvailabalitySession(this.availableSessions.sixty);
			}
		});
	}

	getTwentyMinuteSessions() {
		let dateAfter15hours = moment(new Date()).add(15, 'hours').format();
		let dateAfter15Days = moment(new Date()).add(15, 'hours').format().split('T');
		let dateValue = dateAfter15Days[0];
		let timeValue = dateAfter15Days[1].split('+')[0];
		let dateAfter7Days = moment(dateAfter15hours).add(7, 'days').format('YYYY-MM-DD');
		this.apiService
			.userGetTwentySession(dateValue, timeValue, dateAfter7Days, this.experts.id)
			.subscribe((data) => {
				if (data.code == 1000) {
					this.availableSessions.twenty = data.twenty;
					this.sessionPrices.twenty = data.price;
				}
			});
	}

	getFortyMinuteSessions() {
		let dateAfter15hours = moment(new Date()).add(15, 'hours').format();
		let dateAfter15Days = moment(new Date()).add(15, 'hours').format().split('T');
		let dateValue = dateAfter15Days[0];
		let timeValue = dateAfter15Days[1].split('+')[0];
		let dateAfter7Days = moment(dateAfter15hours).add(7, 'days').format('YYYY-MM-DD');
		this.apiService.userGetFortySession(dateValue, timeValue, dateAfter7Days, this.experts.id).subscribe((data) => {
			if (data.code == 1000) {
				this.availableSessions.forty = data.forty;
				this.sessionPrices.forty = data.price;
			}
		});
	}

	getSixtyMinuteSessions() {
		let dateAfter15hours = moment(new Date()).add(15, 'hours').format();
		let dateAfter15Days = moment(new Date()).add(15, 'hours').format().split('T');
		let dateValue = dateAfter15Days[0];
		let timeValue = dateAfter15Days[1].split('+')[0];
		let dateAfter7Days = moment(dateAfter15hours).add(7, 'days').format('YYYY-MM-DD');
		this.apiService.userGetSixtySession(dateValue, timeValue, dateAfter7Days, this.experts.id).subscribe((data) => {
			if (data.code == 1000) {
				this.availableSessions.sixty = data.sixty;
				this.sessionPrices.sixty = data.price;
				this.showSessionPrice = data.price;
				this.sixtySessionBasePrice = data.price;
				this.createAvailabalitySession(data.sixty);
				this.selectedSessionTiming = '60';
			}
		});
	}

	createSingleSessionObjToSave() {
		return {
			session_date: moment(new Date()).format('YYYY-MM-DD')
		};
	}

	createAvailabalitySession(showSessions: any) {
		let finalArray = [];
		showSessions.forEach((sessionArray: any) => {
			sessionArray.forEach((session: any) => {
				finalArray.push(session);
			});
		});
		this.showSessions = finalArray;
	}

	onSelect(day: number, event: any) {
		if (event.target.checked) {
			this.selectedSessionDay.push(day);
		} else {
			let index = this.selectedSessionDay.indexOf(day);
			this.selectedSessionDay.splice(index, 1);
		}
	}

	onstartValueChange(value: Date) {
		this.multiSessionObj.startDate = moment(value).format('YYYY-MM-DD');
		this.endDateDisabled = false;
	}

	onEndValueChange(value) {
		let finalSessions = [];
		this.multiSessionObj.endDate = moment(value).format('YYYY-MM-DD');
		let startDate = new Date(this.multiSessionObj.startDate);
		let endDate = new Date(this.multiSessionObj.endDate);
		let dates = this.getDates(startDate, endDate);
		dates.forEach((date) => {
			if (this.selectedSessionDay.indexOf(date.getDay()) != -1) {
				finalSessions.push(date.getDay());
			}
		});
		this.multiSessionCount = finalSessions.length;
	}

	setSelectedTimeFrame(event) {
		console.log(event);
	}

	getDates(dateStart, dateEnd) {
		let dates = [];
		let currentDate = dateStart;
		while (currentDate <= dateEnd) {
			// append date to array
			dates.push(currentDate);
			// add one day
			// automatically rolling over to next month
			var d = new Date(currentDate.valueOf());
			d.setDate(d.getDate() + 1);
			currentDate = d;
		}
		return dates;
	}

	createSingleSession(session: any, price: string, count: number) {
		let sessionCheckOutObj = this.createSesionObject(session, price, 1);
		session.multi = 0;
		if(isPlatformBrowser(this.platformId)){
			sessionStorage.setItem('checkout', JSON.stringify(sessionCheckOutObj));
		}
		if (!this.isLoggedIn) {
			this.apiService.openExpertSignInModal('User LogIn');
			localStorage.setItem('redirectUrl', '/payment');
		}

		if (this.isLoggedIn && this.userType == 'expert') {
			alert('Expert are not allowed to book a session. To book a session, please Login as the user.');
			return;
		}

		if (this.isLoggedIn && this.userType != 'expert') {
			this.router.navigate([ '/payment' ]);
		}
	}

	createMultiSession() {
		if (!this.checkForMultiSession()) {
			console.log(false);
			this.multiSessionError = true;
			return;
		} else {
			console.log(true);
			this.multiSessionError = false;
			this.multiSessionObj.days = this.selectedSessionDay;
			this.multiSessionObj.multi = 1;
			let sessionCheckOutObj = this.createSesionObject(
				this.multiSessionObj,
				this.sixtySessionBasePrice,
				this.multiSessionCount
			);
			if(isPlatformBrowser(this.platformId)){
				sessionStorage.setItem('checkout', JSON.stringify(sessionCheckOutObj));
				if (!this.isLoggedIn) {
					$('#bookMultipleSessions').modal('hide');
					this.apiService.openExpertSignInModal('User Login');
					localStorage.setItem('redirectUrl', '/payment');
				}
				if (this.isLoggedIn && this.userType == 'expert') {
					$('#bookMultipleSessions').modal('hide');
					alert(
						'Expert are not allowed to book a session. In order to book a session please loggin as the user.'
					);
					return;
				}
				if (this.isLoggedIn && this.userType != 'expert') {
					$('#bookMultipleSessions').modal('hide');
					this.router.navigate([ '/payment' ]);
				}
			}
		}
	}

	checkForMultiSession() {
		if (
			this.multiSessionObj.startDate != null &&
			this.multiSessionObj.endDate != null &&
			this.multiSessionObj.start_time &&
			this.multiSessionObj.end_time &&
			this.selectedSessionDay.length > 0
		) {
			return true;
		} else {
			return false;
		}
	}

	createSesionObject(session: any, price: string, count: number) {
		return {
			session: session,
			price: price,
			count: count,
			expert: this.experts
		};
	}

	shareExpert() {
		if(isPlatformBrowser(this.platformId)){
			$('#ShareExpertModal').modal('show');
		}	
	}

	getVideo(id_expert) {
		this.apiService.ExpertVideo(id_expert).subscribe((data) => {
			if (data.code == 1000) {
				this.videos = data.video;
			} else {
				this.video_msg = 'No Videos Found';
			}
		});
	}
	openModal(url) {
		this.video_url = this.getSafeUrl(url);
	}
	getSafeUrl(url) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}
}
