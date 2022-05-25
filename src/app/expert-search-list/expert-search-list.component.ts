import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { DataService } from 'src/services/data.service';
import { searchCriteria } from '../models/expert.service.model';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

declare let ga: Function;

@Component({
	selector: 'app-expert-search-list',
	templateUrl: './expert-search-list.component.html',
	styleUrls: [ './expert-search-list.component.css' ]
})
export class ExpertSearchListComponent implements OnInit, OnDestroy {
	showSearchList: boolean;
	showBookNowBtn: boolean;
	subject: string;
	class: string;
	activatedClass: string;
	activatedSubject: string;
	expertCount: number;
	isLoggedIn: string;
	userId: any;
	selectedSortBy: string = 'None';
	selectedPrize: string = 'All';
	selectedLanguage: string = 'Any';
	selectedAccessbility: string = 'Everyone';
	selectedGender: any = 0;
	sortByCriteria: string[];
	userType: string;
	prizeCriteria: string[];
	languageCritria: string[];
	accessibilityCriteria: string[];
	genderCriteria: any[];
	start: number = 0;
	end: number = 15;
	searchCriteria: searchCriteria;
	searchCount: number;
	filterCount: number;
	searchObject: Subscription;
	expertsList: any[] = [];
	filterObj: any = {};
	expert_Id: any;
	constructor(
		private title: Title,
		private meta: Meta,
		private router: Router,
		private apiService: ApiService,
		private dataService: DataService,
		private tostr: ToastrService,
		private routerAct: ActivatedRoute,
		@Inject(PLATFORM_ID) private platformId: Object
	) {}

	ngAfterViewInit(): void {
		this.router.events.subscribe((event) => {
			// I check for isPlatformBrowser here because I'm using Angular Universal, you may not need it
			if (event instanceof NavigationEnd && isPlatformBrowser(this.platformId)) {
				console.log(ga); // Just to make sure it's actually the ga function
				ga('set', 'page', event.urlAfterRedirects);
				ga('send', 'pageview');
			}
		});
	}

	ngOnInit(): void {
		let roleObj: any = null;
		let classObj: any = null;
		let activatedRouteCriteria: any;
		this.routerAct.params.subscribe((data) => {
			if (data.searchedClass && data.searchedClass != 'all-classes') {
				let classData = this.dataService.classes.filter((c) => {
					return c.class == data.searchedClass.split('-')[1];
				});
				classObj = classData[0].id_class + '-' + classData[0].class_name;
				this.activatedClass = classData[0].class;
			}

			if (data.searchedSubject) {
				let sub: any = data.searchedSubject.split('-').join(' ');
				this.activatedSubject = sub;
				let academicSub = this.dataService.acadmicSubject.filter((acdemic) => {
					return acdemic.subject_name == sub;
				});
				if (academicSub.length > 0) {
					roleObj = {
						id: academicSub[0].id_subject,
						name: academicSub[0].subject_name,
						role: 'Academic'
					};
				} else {
					let carrerSub = this.dataService.careerSubject.filter((carrer) => {
						return carrer.guidance_name == sub;
					});
					if (carrerSub.length > 0) {
						roleObj = {
							id: carrerSub[0].id_guidance,
							name: carrerSub[0].guidance_name,
							role: 'Career'
						};
					}
				}
			}
			activatedRouteCriteria = {
				class: classObj,
				roleObj: roleObj
			};

			if (this.activatedClass == '10th' && this.activatedSubject == 'Maths') {
				this.title.setTitle('Get Online Classes For Class 10th Maths From Best Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Take class 10th maths online classes with best experienced teachers who will guide you & help you understand the root of concepts. Book a session with us!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 10th maths, cbse online maths class 10, online class 10 maths, online classes for class 10 maths, online math class 10, 10th class online classes maths, maths cbse online class 10, class 10 maths cbse online, class 10 cbse online maths, 10th online maths, 10th maths online class, live class 10th math, cbse online class 10th maths, maths class 10 cbse online'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic Advising For Students From Leading Experts'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance has the best experts onboard to provide you with the best academic advising & career counselling through interactive live sessions. Book Now!'
				});
			
			}
			else if (this.activatedClass == '8th' && this.activatedSubject == 'Science') {
				this.title.setTitle('Get Online Experts For Class 8 Science');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have top experts to help you with your class 8 science queries & doubts through live 1:1 sessions. So go ahead & book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 8 science, online class 8 science, cbse online class 8 science, 8th class science online classes, class 8 science online classes, ncert class 8 science online, ncert science class 8 online, 8th science online class'
				});
			
			}
			else if (this.activatedClass == '8th' && this.activatedSubject == 'Maths') {
				this.title.setTitle('Learn Class 8 Maths From Leading Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have experienced teachers onboard to help you with your class 8 maths concepts. So go ahead & book a session with us!'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 8 maths, online class 8 maths, online maths classes for class 8, maths online classes for class 8, online math class 8, class 8 maths online classes, class 8 math online class'
				});
			
			}
			else if (this.activatedClass == '11th' && this.activatedSubject == 'Maths') {
				this.title.setTitle('Book a Session With Best Experts For Online Class 11th Maths');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have the leading experts onboard to help you with your class 11th maths doubts through interactive live sessions.So do not wait anymore and book now!.'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'cbse online class 11 maths, online class 11th maths, online classes for class 11 maths cbse'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			} 

			else if (this.activatedClass == '8th' && this.activatedSubject == 'Social-Science') {
				this.title.setTitle('Learn class 8 Social Science From Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have the leading experts onboard to help you with your class 8 social science doubts through interactive live sessions.So don not wait anymore and book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 8 social science, cbse online class 8 social science,online class 8 social science, online class 8 social science, online social science classes for class 8, social science online classes for class 8, online social science class 8, class 8 social science online classes, class 8 social science online class'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Best Career Counselling Online For Students In India'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance provides the best online doubt solving & career counselling for students in India through leading experts onboard. Book a Session with us Now!'
				});
			}
			
			else if (this.activatedClass == '8th' && this.activatedSubject == 'Physics') {
				this.title.setTitle('Book a Session With Best Experts For Class 8 Physics');
				this.meta.updateTag({
					name: 'description',
					content:
						'Book a session for class 8 physics with experienced teachers to help you with your queries & doubts. You can choose the expert of your choice from the list'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 8 physics, cbse online physics class 8, online class 8 physics, online classes for class 8 physics, online physics class 8, 8th class online classes physics, physics cbse online class 8, class 8 physics cbse online, class 8 cbse online physics'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic Advising For Students From Leading Experts'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance has the best experts onboard to provide you with the best academic advising & career counselling through interactive live sessions. Book Now!'
				});
			}
			else if (this.activatedClass == '10th' && this.activatedSubject == 'Chemistry') {
				this.title.setTitle('Book a Session With Best Experts For Class 10th Chemistry');
				this.meta.updateTag({
					name: 'description',
					content:
						'Book a session for class 10th chemistry with experienced teachers to help you with your queries & doubts. You can choose the expert of your choice from the list'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 10th chemistry, cbse online chemistry class 10, online class 10 chemistry, online classes for class 10 chemistry, online chemistry class 10, 10th class online classes chemistry, chemistry cbse online class 10, class 10 chemistry cbse online, class 10 cbse online chemistry'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}
			else if (this.activatedClass == '8th' && this.activatedSubject == 'Chemistry') {
				this.title.setTitle('Book Online Class For Chemistry Class 8 With Our Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Top leading teachers with years of expertise to help you with your chemistry class 8 queries. There are live 1:1 sessions. So, go ahead and book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'chemistry class 8, cbse online chemistry class 8, online class 8 chemistry, online classes for class 8 chemistry, online chemistry class 8, 8th class online classes chemistry, chemistry cbse online class 8, class 8 chemistry cbse online, class 8 cbse online chemistry'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India"s best leading experts. Go ahead & book a session Now!'
				});
			}
			else if (this.activatedClass == '10th' && this.activatedSubject == 'Biology') {
				this.title.setTitle('Learn Class 10th Biology From Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have the leading experts onboard to help you with your class 10th biology doubts through interactive live sessions. So do not wait anymore and book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 10th biology, cbse online biology class 10, online class 10 biology, online classes for class 10 biology, online biology class 10, 10th class online classes biology, biology cbse online class 10, class 10 biology cbse online, class 10 cbse online biology'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Best Career Counselling Online For Students In India'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance provides the best online doubt solving & career counselling for students in India through leading experts onboard. Book a Session with us Now!'
				});
			}

			else if (this.activatedClass == '8th' && this.activatedSubject == 'Biology') {
				this.title.setTitle('Get Online Experts For Biology Class 8');
				this.meta.updateTag({
					name: 'description',
					content:
						'Best experts for online classes of biology class 8 to help you understand the concepts & clear your doubts through live 1:1 & interactive sessions. Call us now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'biology class 8, cbse online biology class 8, online class 8 biology, online classes for class 8 biology, online biology class 8, 8th class online classes biology, biology cbse online class 8, class 8 biology cbse online, class 8 cbse online biology'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}


			// change
			else if (this.activatedClass == '9th' && this.activatedSubject == 'Science') {
				this.title.setTitle('Best Online Classes For Class 9 Science From Leading Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'India’s best teachers to help you with your doubts & make you deeply understand the concepts of class 9 science through interactive sessions. Book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 9 science, online class 9 science, cbse online science class 9, class 9 science online class, 9th science online class, live classes for class 9 science'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}
			else if (this.activatedClass == '9th' && this.activatedSubject == 'Maths') {
				this.title.setTitle('Get Online Classes For Class 9 Maths From Best Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Take class 9 maths online classes with best experienced teachers who will guide you & help you understand the root of concepts. Book a session with us!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 9 maths, online class 9 maths, online math class 9, 9th class maths online classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Best Career Counselling Online For Students In India'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance provides the best online doubt solving & career counselling for students in India through leading experts onboard. Book a Session with us Now!'
				});
			}
			
			else if (this.activatedClass == '10th' && this.activatedSubject == 'Social-Science') {
				this.title.setTitle('Get Online Experts For Class 10th Social Science');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have top experts to help you with your class 10th social science queries & doubts through live interactive 1:1 sessions. So go ahead & book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 10th social science, cbse online class 10 social science, cbse online social science class 10, cbse online sst class 10, social science 10 cbse online'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India"s best leading experts. Go ahead & book a session Now!'
				});
			}

			else if (this.activatedClass == '9th' && this.activatedSubject == 'Social-Science') {
				this.title.setTitle('Get Online Experts For Class 9 Social Science');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have top experts to help you with your class 9 social science queries & doubts through live interactive 1:1 sessions. So go ahead & book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 9 social science, cbse online social science class 9, online class 9 social science, online classes for class 9 social science, online social science class 9, 9th class online classes social science, social science cbse online class 9, class 9 social science cbse online, class 9 cbse online social science'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic Advising For Students From Leading Experts'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance has the best experts onboard to provide you with the best academic advising & career counselling through interactive live sessions. Book Now!'
				});
			}
			
			else if (this.activatedClass == '9th' && this.activatedSubject == 'Physics') {
				this.title.setTitle('Learn Physics Class 9 From Leading Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have experienced teachers onboard to help you with your physics class 9 concepts. So go ahead & book a session with us!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'physics class 9, cbse online physics class 9, online class 9 physics, online classes for class 9 physics, online physics class 9, 9th class online classes physics, physics cbse online class 9, class 9 physics cbse online, class 9 cbse online physics'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India"s best leading experts. Go ahead & book a session Now!'
				});
			}
			else if (this.activatedClass == '9th' && this.activatedSubject == 'Chemistry') {
				this.title.setTitle('Book a Session With Best Experts For Chemistry Class 9');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have India’s top experts to help you with your chemistry class 9 queries and doubts. There are live 1:1 sessions. So go ahead a book a session with us!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'chemistry class 9, cbse online chemistry class 9, online class 9 chemistry, online classes for class 9 chemistry, online chemistry class 9, 9th class online classes chemistry, chemistry cbse online class 9, class 9 chemistry cbse online, class 9 cbse online chemistry'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}
			else if (this.activatedClass == '9th' && this.activatedSubject == 'Biology') {
				this.title.setTitle('Learn Biology Class 9 From Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have the leading experts onboard to help you with your biology class 9 doubts through interactive live sessions. So do not wait anymore and book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'biology class 9, cbse online biology class 9, online class 9 biology, online classes for class 9 biology, online biology class 9, 9th class online classes biology, biology cbse online class 9, class 9 biology cbse online, class 9 cbse online biology'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}
			
			
			
			else if (this.activatedClass == '12th' && this.activatedSubject == 'Maths') {
				this.title.setTitle('Get 12th Maths Online Classes From Leading Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Book a session for 12th maths online classes with experienced teachers to help you with your doubts. You can choose the expert of your choice from the list.'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'12th maths online classes, best online classes for class 12 maths, class 12 maths online classes, online classes for class 12 maths, online class 12 maths'
				});
			} 
			
			
			else if (this.activatedClass == '10th' && this.activatedSubject == 'Physics') {
				this.title.setTitle('Learn Class 10th Physics From Leading Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have experienced teachers onboard to help you with your class 10th physics concepts. So go ahead & book a session with us!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 10th physics, hss live class 10 physics, cbse online physics class 10, online class 10 physics, online classes for class 10 physics, online physics class 10, 10th class online classes physics, physics cbse online class 10, class 10 physics cbse online, class 10 cbse online physics'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}

			else if (this.activatedClass == '10th' && this.activatedSubject == 'Science') {
				this.title.setTitle('Get Experts For Online Class 10th Science');
				this.meta.updateTag({
					name: 'description',
					content:
						'Top leading teachers with years of expertise to help you with your online class 10th science queries. There are live 1:1 sessions. So, go ahead and book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'cbse online science class 10, online class 10 science, class 10 science cbse online, class 10 cbse online science, science class 10 cbse online, cbse online 10 science, online class 10th science, cbse online class 10th science'
				});
			} 
			
			else if (this.activatedClass == '11th' && this.activatedSubject == 'Economics') {
				this.title.setTitle('Learn Class 11th Economics From Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Top leading teachers with years of expertise to help you with your class 11th economics queries. There are live 1:1 sessions. So, go ahead and book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 11th economics, online classes for economics class 11, cbse online economics class 11, online class 11 economics, online classes for class 11 economics, online economics class 11, 11th class online classes economics, economics cbse online class 11, class 11 economics cbse online, class 11 cbse online economics'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic Advising For Students From Leading Experts'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance has the best experts onboard to provide you with the best academic advising & career counselling through interactive live sessions. Book Now!'
				});
			}

			else if (this.activatedClass == '11th' && this.activatedSubject == 'Business-Studies') {
				this.title.setTitle('Get Online Experts For Class 11th Business Studies');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have top experts to help you with your class 11th business studies queries & doubts through live interactive 1:1 sessions. So go ahead & book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 11th business studies, cbse online business studies class 11, online class 11 business studies, online classes for class 11 business studies, online business studies class 11, 11th class online classes business studies, business studies cbse online class 11, class 11 business studies cbse online, class 11 cbse online business studies'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India"s best leading experts. Go ahead & book a session Now!'
				});
			}

			else if (this.activatedClass == '11th' && this.activatedSubject == 'Physics') {
				this.title.setTitle('Get Online Experts For Class 11th Physics');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have experienced teachers onboard to help you with your class 11th physics concepts. So go ahead & book a session with us!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 11th physics, class 11 physics online classes, online physics classes for class 11, best online classes for class 11 physics, physics class 11 online classes, online class 11 physics, physics online classes for class 11, 11th physics online class, class 11 physics online class, best website for physics class 11, physics online class 11, cbse class 11 physics online classes, online physics class 11, class 11 physics online study, online classes of physics class 11'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Best Career Counselling Online For Students In India'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance provides the best online doubt solving & career counselling for students in India through leading experts onboard. Book a Session with us Now!'
				});
			}
			
			else if (this.activatedClass == '11th' && this.activatedSubject == 'Chemistry') {
				this.title.setTitle('Book a Session With Best Experts For Class 11th Chemistry');
				this.meta.updateTag({
					name: 'description',
					content:
						'Book a session for class 11th chemistry with experienced teachers to help you with your queries & doubts. You can choose the expert of your choice from the list'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 11th chemistry, online chemistry classes for class 11, class 11 chemistry online classes, chemistry class 11 online classes, online class 11 chemistry, ncert class 11 chemistry online, 11th chemistry online class, online chemistry classes for class 11 in hindi, chemistry online class 11, online classes for class 11 chemistry, class 11 chemistry online study'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic Advising For Students From Leading Experts'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance has the best experts onboard to provide you with the best academic advising & career counselling through interactive live sessions. Book Now!'
				});
			}
			
			
			else if (this.activatedClass == '11th' && this.activatedSubject == 'Biology') {
				this.title.setTitle('Book Online Class For Class 11th Biology With Our Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have the leading experts onboard to help you with your class 11th biology doubts through interactive live sessions. So do not wait anymore and book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'cclass 11th biology, cbse online biology class 11, online class 11 biology, online classes for class 11 biology, online biology class 11, 11th class online classes biology, biology cbse online class 11, class 11 biology cbse online, class 11 cbse online biology'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India`s best leading experts. Go ahead & book a session Now!'
				});
			}

			else if (this.activatedClass == '11th' && this.activatedSubject == 'Accounts') {
				this.title.setTitle('Get Online Classes For Class 11th Accounts From Best Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Take class 11th accounts online classes with best experienced teachers who will guide you & help you understand the root of concepts. Book a session with us!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 11th accounts, online classes for class 11 accounts, accounts online classes class 11, class 11 accounts online classes, accountancy class 11 online classes, class 11 accountancy online class, online accountancy classes for class 11, cbse online class 11 accountancy, cbse class 11 accountancy online classes, accountancy class 11 online'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}
			
			
			
			else if (this.activatedClass == '12th' && this.activatedSubject == 'Economics') {
				this.title.setTitle('Learn Class 12th Economics From Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Top leading teachers with years of expertise to help you with your class 12th economics queries. There are live 1:1 sessions. So, go ahead and book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 12th economics, economics class 12 online classes, class 12 economics online classes, online classes for economics class 12, 12th economics online classes, economics online class 12'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}

			else if (this.activatedClass == '12th' && this.activatedSubject == 'Business-Studies') {
				this.title.setTitle('Get Online Experts For Class 12th Business Studies');
				this.meta.updateTag({
					name: 'description',
					content:
						'We`ve top experts to help you with your class 12th business studies queries & doubts through live interactive 1:1 sessions. So go ahead & book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 12th business studies, cbse online business studies class 12, online class 12 business studies, online classes for class 12 business studies, online business studies class 12, 12th class online classes business studies, business studies cbse online class 12, class 12 business studies cbse online, class 12 cbse online business studies'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}

			else if (this.activatedClass == '12th' && this.activatedSubject == 'Accounts') {
				this.title.setTitle('Get Online Classes For Class 12th Accounts From Best Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Take class 12th accounts online classes with best experienced teachers who will guide you & help you understand the root of concepts. Book a session with us!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 12th accounts, class 12 accounts online classes, accountancy class 12 online classes, class 12 accountancy online classes, online classes for accounts class 12, 12th accounts online classes, accounts online classes class 12, accounts class 12 online classes, online accounts class 12, online classes for accountancy class 12, online class 12 accountancy, online coaching for class 12 accountancy'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Best Career Counselling Online For Students In India'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance provides the best online doubt solving & career counselling for students in India through leading experts onboard. Book a Session with us Now!'
				});
			}
			
			else if (this.activatedClass == '12th' && this.activatedSubject == 'Maths') {
				this.title.setTitle('Get Online Classes For Class 12th Accounts From Best Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Take class 12th accounts online classes with best experienced teachers who will guide you & help you understand the root of concepts. Book a session with us!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 12th accounts, class 12 accounts online classes, accountancy class 12 online classes, class 12 accountancy online classes, online classes for accounts class 12, 12th accounts online classes, accounts online classes class 12, accounts class 12 online classes, online accounts class 12, online classes for accountancy class 12, online class 12 accountancy, online coaching for class 12 accountancy'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Best Career Counselling Online For Students In India'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance provides the best online doubt solving & career counselling for students in India through leading experts onboard. Book a Session with us Now!'
				});
			}
			
			else if (this.activatedClass == '12th' && this.activatedSubject == 'Physics') {
				this.title.setTitle('Get Online Experts For Class 12th Physics');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have experienced teachers onboard to help you with your class 12th physics concepts. So go ahead & book a session with us!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 12th physics, online physics classes for class 12, physics class 12 online classes in hindi, class 12 physics online classes, physics class 12 online classes, 12th physics online class, online class 12 physics, online classes for physics class 12, physics online class 12, online physics class 12, 12th physics live class, plus two physics online classes, class 12 physics online'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India`s best leading experts. Go ahead & book a session Now!'
				});
			}

			else if (this.activatedClass == '12th' && this.activatedSubject == 'Chemistry') {
				this.title.setTitle('Book a Session With Best Experts For Class 12th Chemistry');
				this.meta.updateTag({
					name: 'description',
					content:
						'Book a session for class 12th chemistry with experienced teachers to help you with your queries & doubts. You can choose the expert of your choice from the list'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 12th chemistry, class 12th chemistry live classes, cbse online chemistry class 12, online class 12 chemistry, online classes for class 12 chemistry, online chemistry class 12, 12th class online classes chemistry, chemistry cbse online class 12, class 12 chemistry cbse online, class 12 cbse online chemistry'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}

			else if (this.activatedClass == '12th' && this.activatedSubject == 'Biology') {
				this.title.setTitle('Book Online Class For Class 12th Biology With Our Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have the leading experts onboard to help you with your class 12th biology doubts through interactive live sessions. So do not wait anymore and book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'class 12th biology, cbse online biology class 12, online class 12 biology, online classes for class 12 biology, online biology class 12, 12th class online classes biology, biology cbse online class 12, class 12 biology cbse online, class 12 cbse online biology'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}

			else if (this.activatedClass == 'BBA' && this.activatedSubject == 'Marketing-Management') {
				this.title.setTitle('Learn BBA Marketing Management From Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Top leading teachers with years of expertise to help you with your bba marketing management queries. There are live 1:1 sessions. So go ahead & book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bba marketing management, online classes for bba marketing management, online bba marketing management, bba marketing management online classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Best Career Counselling Online For Students In India'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance provides the best online doubt solving & career counselling for students in India through leading experts onboard. Book a Session with us Now!'
				});
			}

			else if (this.activatedClass == 'BBA' && this.activatedSubject == 'Digital-Marketing') {
				this.title.setTitle('Get Online Experts For BBA Digital Marketing');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have top experts to help you with your bba digital marketing queries & doubts through live interactive 1:1 sessions. So go ahead & book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bba digital marketing, online classes for bba digital marketing, bba digital marketing live classes, bba digital marketing online classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic Advising For Students From Leading Experts'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance has the best experts onboard to provide you with the best academic advising & career counselling through interactive live sessions. Book Now!'
				});
			}

			else if (this.activatedClass == 'BBA' && this.activatedSubject == 'Sales-&-Distribution-Management') {
				this.title.setTitle('Learn Sales and Distribution Management BBA Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Take sales and distribution management bba online class with experienced teachers who will guide you & help you understand the root of concepts. Call Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'sales and distribution management bba, online classes for bba sales and distribution management, bba sales and distribution management live classes, bba sales and distribution management online classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India`s best leading experts. Go ahead & book a session Now!'
				});
			}

			else if (this.activatedClass == 'BBA' && this.activatedSubject == 'Human-Resource-Management') {
				this.title.setTitle('Learn BBA Human Resource Management From Best Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have India’s top experts to help you with your bba human resource management queries and doubts. There are live 1:1 sessions. Call Us Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bba human resource management, bba human resource management online classes, best online classes for bba human resource management, bba human resource management online classes, online classes for bba human resource management, online bba human resource management, online bba human resource management, online bba human resource management, bba human resource management online, bba human resource management online class, live class bba human resource management, bba human resource management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}

			else if (this.activatedClass == 'BBA' && this.activatedSubject == 'Organisation-Behaviour') {
				this.title.setTitle('Get Online Experts For BBA Organisation Behaviour');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have experienced teachers onboard to help you with your bba organisation behaviour concepts. So go ahead & book a session with us!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bba organisation behaviour, online organisation behaviour classes for bba, bba organisation behaviour online classes, bba organisation behaviour online class, online class bba organisation behaviour, online classes for bba organisation behaviour, bba organisation behaviour live class'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}

			else if (this.activatedClass == 'BBA' && this.activatedSubject == 'Production-&-Operations-Management') {
				this.title.setTitle('Learn BBA Production and Operations Management With Expert');
				this.meta.updateTag({
					name: 'description',
					content:
						'Book a session for bba production and operations management with India`s top teachers to help you with your queries & doubts. Click here to know more!"'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bba production and operations management, bba production and operations management live classes, online bba production and operations management, online classes for bba production and operations management, bba production and operations management live classes, bba online classes production and operations management'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}

			else if (this.activatedClass == 'BBA' && this.activatedSubject == 'Business-Economics') {
				this.title.setTitle('Book a Session For BBA Business Economics With Top Teachers');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have the leading experts onboard to help you with your bba business economics doubts through interactive live sessions. So don`t wait & book now!"'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bba business economics, online class bba business economics, online classes for bba business economics, bba online classes business economics, bba business economics live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}

			else if (this.activatedClass == 'BBA' && this.activatedSubject == 'Financial-Management') {
				this.title.setTitle('Get Online Expert For B.Com Financial Management');
				this.meta.updateTag({
					name: 'description',
					content:
						'Best experts for online classes of b.com financial management to help you understand the concepts clearly through live 1:1 interactive sessions. Call Us Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'b.com financial management, online b.com financial management, online classes for b.com financial management, b.com online classes financial management, b.com financial management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}

			else if (this.activatedClass == 'B.Com' && this.activatedSubject == 'Business-Communication') {
				this.title.setTitle('Best Classes For B.Com Business Communication From Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'India’s top teachers to help you with your doubts & make you deeply understand concepts of b.com business communication through live sessions. Book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'b.com business communication, online b.com business communication, b.com business communication online class, live classes for b.com business communication'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}

			else if (this.activatedClass == 'B.Com' && this.activatedSubject == 'Business-Communication') {
				this.title.setTitle('Best Classes For B.Com Business Communication From Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'India’s top teachers to help you with your doubts & make you deeply understand concepts of b.com business communication through live sessions. Book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'b.com business communication, online b.com business communication, b.com business communication online class, live classes for b.com business communication'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}

			else if (this.activatedClass == 'B.Com' && this.activatedSubject == 'Business-Economics') {
				this.title.setTitle('Get Online Class For B.Com Business Economics From Expert');
				this.meta.updateTag({
					name: 'description',
					content:
						'Take b.com business economics 1:1 online classes with best experienced teachers who will guide you & help you understand the root of concepts. Book Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'b.com business economics, online b.com business economics, b.com business economics online classes, b.com business economics live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Best Career Counselling Online For Students In India'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance provides the best online doubt solving & career counselling for students in India through leading experts onboard. Book a Session with us Now!'
				});
			}

			else if (this.activatedClass == 'B.Com' && this.activatedSubject == 'Taxation') {
				this.title.setTitle('Learn B.Com Taxation With Experienced Teachers');
				this.meta.updateTag({
					name: 'description',
					content:
						'GG has leading experts onboard to help you with your b.com taxation queries & doubts through live interactive 1:1 sessions. So go ahead & book a session now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'b.com taxation, online  b.com taxation, online classes for  b.com taxation, b.com online classes taxation,  b.com taxation live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic Advising For Students From Leading Expert'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance has the best experts onboard to provide you with the best academic advising & career counselling through interactive live sessions. Book Now!'
				});
			}
			else if (this.activatedClass == 'BBS' && this.activatedSubject == 'Business-Communication') {
				this.title.setTitle('Learn BBS Business Communication From Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'GrabGuidance has best experienced teachers onboard to help you with your bbs business communication concepts. So go ahead & book a session with us!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bbs business communication, online bbs business communication, online classes for bbs business communication, bbs online classes business communication, bbs business communication live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India`s best leading experts. Go ahead & book a session Now!'
				});
			}

			else if (this.activatedClass == 'B.Com' && this.activatedSubject == 'Taxation') {
				this.title.setTitle('Learn BBS Business Communication From Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'GrabGuidance has best experienced teachers onboard to help you with your bbs business communication concepts. So go ahead & book a session with us!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bbs business communication, online bbs business communication, online classes for bbs business communication, bbs online classes business communication, bbs business communication live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India`s best leading experts. Go ahead & book a session Now!'
				});
			}

			else if (this.activatedClass == 'BBS' && this.activatedSubject == 'Management-Accounting') {
				this.title.setTitle('Book a Session With Experts For BBS Management Accounting');
				this.meta.updateTag({
					name: 'description',
					content:
						'GG has India’s top experts to help you with your bbs management accounting queries & doubts. There are live 1:1 sessions. Go ahead & book a session now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bbs management accounting, online bbs management accounting, online classes for bbs management accounting, bbs online classes management accounting, bbs management accounting live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}

			else if (this.activatedClass == 'BBS' && this.activatedSubject == 'Marketing-Management') {
				this.title.setTitle('Learn BBS Marketing Management From Top Leading Teachers');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have best leading experts onboard to help you with your bbs marketing management doubts & concepts through interactive 1:1 live sessions. Call Us Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bbs marketing management, online bbs marketing management, online classes for bbs marketing management, bbs online classes marketing management, bbs marketing management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}

			else if (this.activatedClass == 'BBS' && this.activatedSubject == 'Organisation-Behaviour') {
				this.title.setTitle('Book Online Class For BBS Organisation Behaviour With Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Top leading teachers with years of expertise to help you with your bbs organisation behaviour queries. There are live 1:1 sessions. So, go ahead and book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bbs organisation behaviour, online bbs organisation behaviour, bbs organisation behaviour online classes, bbs organisation behaviour live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Best Career Counselling Online For Students In India'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance provides the best online doubt solving & career counselling for students in India through leading experts onboard. Book a Session with us Now!'
				});
			}

			else if (this.activatedClass == 'BBS' && this.activatedSubject == 'Human-Resource-Management') {
				this.title.setTitle('Learn BBS Human Resource Management From Leading Expert');
				this.meta.updateTag({
					name: 'description',
					content:
						'Take bbs human resource management online sessions with experienced teachers who will guide you & help you understand the root of concepts. Book Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bbs human resource management, online bbs human resource management, online classes for bbs human resource management, bbs human resource management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic Advising For Students From Leading Experts'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance has the best experts onboard to provide you with the best academic advising & career counselling through interactive live sessions. Book Now!'
				});
			}

			else if (this.activatedClass == 'BBS' && this.activatedSubject == 'Financial-Management') {
				this.title.setTitle('Get Online Experts For BBS Financial Management');
				this.meta.updateTag({
					name: 'description',
					content:
						'GrabGuidance has top experts to help you with your bbs financial management queries & doubts through live interactive 1:1 sessions. Click here to know more!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bbs financial management, bbs financial management online classes, bbs financial management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India`s best leading experts. Go ahead & book a session Now!'
				});
			}

			else if (this.activatedClass == 'BMS' && this.activatedSubject == 'Business-Communicationt') {
				this.title.setTitle('Learn BMS Business Communication From Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'GrabGuidance has experienced teachers onboard to help you in understanding bms business communication concepts clearly through live classes. Book Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bms business communication, online bms business communication, online classes for bms business communication, bms online classes business communication, bms business communication live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}

			else if (this.activatedClass == 'BMS' && this.activatedSubject == 'Management-Accounting') {
				this.title.setTitle('Book a Session With Experts For BMS Management Accounting');
				this.meta.updateTag({
					name: 'description',
					content:
						'Book an online session at GrabGuidance for bms management accounting with top teachers to help you understand the concepts clearly. Call Us Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bms management accounting, online classes for bms management accounting, bms online classes management accounting, bms management accounting live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}

			else if (this.activatedClass == 'BMS' && this.activatedSubject == 'Marketing-Management') {
				this.title.setTitle('Learn BMS Marketing Management From Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'GrabGuidance has India`s top experts onboard to help you with your bms marketing management queries through 1:1 online sessions. Click here to know more!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bms marketing management, online bms marketing management, online classes for bms marketing management, bms online classes marketing management, bms marketing management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Best Career Counselling Online For Students In India'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance provides the best online doubt solving & career counselling for students in India through leading experts onboard. Book a Session with us Now!'
				});
			}

			else if (this.activatedClass == 'BMS' && this.activatedSubject == 'Organisation-Behaviour') {
				this.title.setTitle('Best 1:1 Classes For BMS Organisation Behaviour From Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Learn bms organisation behaviour at GrabGuidance from best teachers with years of expertise to help you with your doubts through online sessions. Book Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bms organisation behaviour, online classes for bms organisation behaviour, online bms organisation behaviour,  bms online classes organisation behaviour, bms organisation behaviour live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic Advising For Students From Leading Experts'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance has the best experts onboard to provide you with the best academic advising & career counselling through interactive live sessions. Book Now!'
				});
			}

			else if (this.activatedClass == 'BMS' && this.activatedSubject == 'Human-Resource-Management') {
				this.title.setTitle('Get Online Experts For BMS Human Resource Management');
				this.meta.updateTag({
					name: 'description',
					content:
						'GrabGuidance has India`s top experts to help you with your bms human resource management doubts through interactive live 1:1 sessions. Call Us Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bms human resource management, online bms human resource management, online classes for bms human resource management, bms human resource management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India`s best leading experts. Go ahead & book a session Now!'
				});
			}

			else if (this.activatedClass == 'BMS' && this.activatedSubject == 'Financial-Management') {
				this.title.setTitle('Get BMS Financial Management Online Sessions From Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Learn bms financial management at GG from experienced teachers who will guide you & help you understand the root of concepts. Book a Session Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bms financial management, online classes for bms financial management, bms financial management online classes, bms financial management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}

			else if (this.activatedClass == 'BBE' && this.activatedSubject == 'Business-Economics') {
				this.title.setTitle('Learn BBE Business Economics From Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'GG has India’s leading experts to help you with your bbe business economics concepts and doubts. There are live 1:1 sessions. Click here to know more!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bbe business economics, online bbe business economics, online classes for bbe business economics, bbe business economics live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}

			else if (this.activatedClass == 'BBE' && this.activatedSubject == 'Business-Communication') {
				this.title.setTitle('Get Online Experts for BBE Business Communication');
				this.meta.updateTag({
					name: 'description',
					content:
						'GrabGuidance provides 1:1 online classes for bbe business communication. Get guidance from experienced teachers. Click here to know more!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bbe business communication, bbe business communication online classes, online bbe business communication, best online classes for bbe business communication, bbe business communication live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Best Career Counselling Online For Students In India'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance provides the best online doubt solving & career counselling for students in India through leading experts onboard. Book a Session with us Now!'
				});
			}

			else if (this.activatedClass == 'BBE' && this.activatedSubject == 'Financial-Accounting') {
				this.title.setTitle('Book a Session With Best Experts For BBE Financial Accounting');
				this.meta.updateTag({
					name: 'description',
					content:
						'Book a session for bbe financial accounting with experienced teachers at GG to help you with your queries & doubts. Live 1:1 interactive sessions. Book Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bbe financial accounting, online financial accounting classes for bbe, bbe financial accounting online classes, online bbe financial accounting, online classes bbe financial accounting, bbe financial accounting live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic Advising For Students From Leading Experts'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance has the best experts onboard to provide you with the best academic advising & career counselling through interactive live sessions. Book Now!'
				});
			}


			else if (this.activatedClass == 'BBE' && this.activatedSubject == 'Financial-Management') {
				this.title.setTitle('Book Online Class For BBE Financial Management With Our Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have best teachers onboard with years of expertise to help you with your bbe financial management doubts through interactive live sessions. Call Us Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bbe financial management, online bbe financial management, online classes for bbe financial management, bbe online classes financial management, bbe financial management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India`s best leading experts. Go ahead & book a session Now!'
				});
			}


			else if (this.activatedClass == 'BBE' && this.activatedSubject == 'Marketing-Management') {
				this.title.setTitle('Learn BBE Marketing Management From Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'GrabGuidance has best teachers with years of expertise to help you with your bbe marketing management queries. There are live 1:1 sessions. Book Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bbe marketing management, bbe marketing management online classes, online classes for bbe marketing management, bbe marketing management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}

			else if (this.activatedClass == 'BBE' && this.activatedSubject == 'Organisation-Behaviour') {
				this.title.setTitle('Get Online Experts For BBE Organisation Behaviour');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have top experts to help you with your bbe organisation behaviour concepts & doubts through live interactive 1:1 sessions. Click here to know more!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bbe organisation behaviour, online bbe organisation behaviour, online classes for bbe organisation behaviour, bbe organisation behaviour live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}
			
			else if (this.activatedClass == 'BCA' && this.activatedSubject == 'Organisation-Behaviour') {
				this.title.setTitle('Learn BCA Organisation Behaviour From Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'GG provides bca organisation behaviour online classes from experienced teachers who will guide you & help you understand the root of concepts. Book Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bca organisation behaviour, bca organisation behaviour online classes, organisation behaviour bca online classes, online classes for bca organisation behaviour, bca organisation behaviour live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Best Career Counselling Online For Students In India'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance provides the best online doubt solving & career counselling for students in India through leading experts onboard. Book a Session with us Now!'
				});
			}

			else if (this.activatedClass == 'BCA' && this.activatedSubject == 'Database-Management-System') {
				this.title.setTitle('Learn BCA Database Management System From Leading Expert');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have India’s top experts to help you with your bca database management system queries and doubts. There are live 1:1 sessions. Book a Session Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bca database management system, bca database management system online classes, best online classes for bca database management system, online classes for bca database management system, online bca database management system, online bca database management system classes, live bca database management system, bca database management system live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic Advising For Students From Leading Experts'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance has the best experts onboard to provide you with the best academic advising & career counselling through interactive live sessions. Book Now!'
				});
			}


			else if (this.activatedClass == 'BCA' && this.activatedSubject == 'Programming-and-Languages') {
				this.title.setTitle('Get Online Experts For BCA Programming Language');
				this.meta.updateTag({
					name: 'description',
					content:
						'GrabGuidance has experienced teachers onboard to help you with your bca programming language concepts. So go ahead & book a session now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bca programming language, online programming language for bca, bca programming language online classes, online classes for bca programming language, bca programming language live class'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India`s best leading experts. Go ahead & book a session Now!'
				});
			}

			else if (this.activatedClass == 'BCA' && this.activatedSubject == 'System-Analysis-&-Design') {
				this.title.setTitle('Book a Session With Experts For BCA System Analysis & Design');
				this.meta.updateTag({
					name: 'description',
					content:
						'Book a session for bca system analysis & design with experienced teachers at GrabGuidance to help you with your queries & doubts. Click here to know more!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bca system analysis & design, bca system analysis & design live classes, onlinebca system analysis & design, online classes for bca system analysis & design'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}

			else if (this.activatedClass == 'BCA' && this.activatedSubject == 'Financial-Accounting') {
				this.title.setTitle('Book Live Class For BCA Financial Accounting With Our Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'GrabGuidance has leading experts onboard to help you with your bca financial accounting doubts through interactive live 1:1 sessions. Book a Session Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bca financial accounting, online bca financial accounting, onine classes for bca financial accounting, bca financial accounting online classes, bca financial accounting live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}

			else if (this.activatedClass == 'BCA' && this.activatedSubject == 'Financial-Management') {
				this.title.setTitle('Get Online Experts For BCA Financial Management');
				this.meta.updateTag({
					name: 'description',
					content:
						'GrabGuidance has top experts to help you with your bca financial management queries & doubts through live 1:1 sessions. So go ahead & book a session now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bca financial management, online bca financial management, bca financial management online classes, bca financial management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}

			else if (this.activatedClass == 'BA' && this.activatedSubject == 'Human-Resource-Management') {
				this.title.setTitle('Learn BA Human Resource Management From Leading Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'GrabGuidance has best experienced teachers onboard to help you with your ba human resource management concepts and doubts. Click here to know more!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'ba human resource management, online ba human resource management, online human resource management classes for ba, ba human resource management online classes, ba human resource management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}

			else if (this.activatedClass == 'BA' && this.activatedSubject == 'Organisation-Behaviour') {
				this.title.setTitle('Learn BA Organisation Behaviour From Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'GG has top leading experts onboard to help you with your ba organisation behaviour doubts and queries through interactive live 1:1 sessions. Book Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'ba organisation behaviour, online ba organisation behaviour, online organisation behaviour classes for ba, organisation behaviour online classes for ba, ba organisation behaviour live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Best Career Counselling Online For Students In India'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance provides the best online doubt solving & career counselling for students in India through leading experts onboard. Book a Session with us Now!'
				});
			}


			else if (this.activatedClass == 'BA' && this.activatedSubject == 'Business-Communication') {
				this.title.setTitle('Book a Session With Experts For BA Business Communication');
				this.meta.updateTag({
					name: 'description',
					content:
						'Book a session for ba business communication with experienced teachers at GG to help you with your queries through live sessions. Click here to know more!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'bachelor of arts in business communication, ba business communication, online ba business communication, online classes for ba business communication, ba online classes business communication, ba business communication live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic Advising For Students From Leading Experts'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance has the best experts onboard to provide you with the best academic advising & career counselling through interactive live sessions. Book Now!'
				});
			}


			else if (this.activatedClass == 'BA' && this.activatedSubject == 'Business-Economics') {
				this.title.setTitle('Book Online Class For BA Business Economics With Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Top leading teachers with years of expertise to help you with your ba business economics queries. There are live 1:1 sessions. So, go ahead and book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'ba business economics, online ba business economics, online classes for ba business economics, ba business economics live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India`s best leading experts. Go ahead & book a session Now!'
				});
			}


			else if (this.activatedClass == 'BA' && this.activatedSubject == 'Quants-&-Statistics') {
				this.title.setTitle('Get Online Experts For BA Quants & Statistics');
				this.meta.updateTag({
					name: 'description',
					content:
						'Best experts for online classes of ba quants & statistics to help you understand the concepts & clear your doubts through live & interactive sessions. Book Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'ba quants & statistics, online ba quants & statistics, online classes for ba quants & statistics, ba online classes quants & statistics, ba quants & statistics live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}

			else if (this.activatedClass == 'MA' && this.activatedSubject == 'Human-Resource-Management') {
				this.title.setTitle('Live Class For MA Human Resource Management From Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'India’s best teachers to help you deeply understand the concepts of MA human resource management through interactive live sessions. Book Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'ma human resource management, online ma human resource management, ma human resource management online class, live classes for ma human resource management'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}

			else if (this.activatedClass == 'MA' && this.activatedSubject == 'Business-Communication') {
				this.title.setTitle('Get Online Experts For MA Business Communication');
				this.meta.updateTag({
					name: 'description',
					content:
						'GG has India`s top experts to help you with your MA business communication queries & doubts through live interactive 1:1 sessions. So go ahead & book now!">'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'masters in business communication, ma business communication, online ma business communication, online classes for ma business communication, ma business communication live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic Advising For Students From Leading Experts'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance has the best experts onboard to provide you with the best academic advising & career counselling through interactive live sessions. Book Now!'
				});
			}

			else if (this.activatedClass == 'MA' && this.activatedSubject == 'Business-Economics') {
				this.title.setTitle('Learn MA Business Economics From Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Book online sessions at GG for MA business economics with best experienced teachers to get all your concepts & doubts cleared. Click here to know more!">'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'ma business economics, online ma business economics, online classes for ma business economics, ma online classes business economics, ma business economics live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India`s best leading experts. Go ahead & book a session Now!'
				});
			}

			else if (this.activatedClass == 'MA' && this.activatedSubject == 'Quants-&-Statistics') {
				this.title.setTitle('Book Live Session With Best Experts For MA Quants & Statistics');
				this.meta.updateTag({
					name: 'description',
					content:
						'We at GrabGuidance have India’s top experts to help you with your MA quants & statistics queries and doubts. There are live 1:1 sessions. Call Us Now!">'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'ma quants & statistics, online ma quants & statistics, online classes for ma quants & statistics, ma quants & statistics live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}

			else if (this.activatedClass == 'MBA' && this.activatedSubject == 'Human-Resource-Management') {
				this.title.setTitle('Learn MBA Human Resource Management From Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have leading experts onboard to help you with your MBA human resource management doubts through interactive live sessions. Click here to know more!">'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'mba human resource management, online mba human resource management, online classes for mba human resource management, mba human resource management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}

			else if (this.activatedClass == 'MBA' && this.activatedSubject == 'Organisation-Behaviour') {
				this.title.setTitle('Book Session For MBA Organisation Behaviour With Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Top leading teachers with years of expertise to help you with your MBA organisation behaviour queries. There are live 1:1 sessions. Go ahead and book now!">'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'mba organisation behaviour, online class 10 science, mba organisation behaviour online classes, mba organisation behaviour live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Best Career Counselling Online For Students In India'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance provides the best online doubt solving & career counselling for students in India through leading experts onboard. Book a Session with us Now!'
				});
			}
			
			else if (this.activatedClass == 'MBA' && this.activatedSubject == 'Business-Communication') {
				this.title.setTitle('Get Live Class For MBA Business Communication From Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Take MBA business communication online classes with experienced teachers at GG who will guide you & help you understand the root of concepts. Book Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'mba business communication, online mba business communication, online classes for mba business communication, mba business communication live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic Advising For Students From Leading Experts'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance has the best experts onboard to provide you with the best academic advising & career counselling through interactive live sessions. Book Now!'
				});
			}

			else if (this.activatedClass == 'MBA' && this.activatedSubject == 'Taxation') {
				this.title.setTitle('Get Online Classes For MBA Taxation From Leading Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'GrabGuidance has top experts to help you with your MBA taxation queries & doubts through live interactive 1:1 sessions. So go ahead & book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'mba taxation, mba taxation online classes, mba taxation live classes, online classes for mba taxation'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India`s best leading experts. Go ahead & book a session Now!'
				});
			}

			else if (this.activatedClass == 'MBA' && this.activatedSubject == 'Marketing-Management') {
				this.title.setTitle('Learn MBA Marketing Management From Experienced Teachers');
				this.meta.updateTag({
					name: 'description',
					content:
						'GrabGuidance has highly experienced teachers onboard to help you with your MBA marketing management concepts. Click here to know more!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'mba marketing management, online mba marketing management, online classes for mba marketing management, mba online classes marketing management, mba marketing management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}

			
			else if (this.activatedClass == 'MBA' && this.activatedSubject == 'Financial-Management') {
				this.title.setTitle('Book a Session With Top Experts for MBA Financial Management');
				this.meta.updateTag({
					name: 'description',
					content:
						'Book a session for MBA financial management with experienced teachers to help you with your queries & doubts through live sessions. Book Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'mba financial management, online mba financial management, online classes for mba financial management, mba financial management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}

			else if (this.activatedClass == 'MBA' && this.activatedSubject == '%0D%0AProduction-&-Operations-Management%0D%0A') {
				this.title.setTitle('Live Sessions for MBA Production and Operations Management');
				this.meta.updateTag({
					name: 'description',
					content:
						'GG has leading experts onboard to help you with your MBA production & operations management doubts through interactive 1:1 live sessions. Call Us Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'mba in production and operations management, mba in production, mba in production management, online mba in production and operations management, online classes for mba in production and operations management, mba in production and operations management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Best Career Counselling Online For Students In India'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance provides the best online doubt solving & career counselling for students in India through leading experts onboard. Book a Session with us Now!'
				});
			}


			else if (this.activatedClass == 'MBA' && this.activatedSubject == 'Financial-Accounting') {
				this.title.setTitle('Learn MBA Financial Accounting From Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Top leading teachers with years of expertise to help you with your MBA financial accounting queries. There are live 1:1 sessions. Click here to know more!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'mba finance accounting, mba accounting and finance, mba financial accounting, online classes for mba financial accounting, mba financial accounting live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic Advising For Students From Leading Experts'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance has the best experts onboard to provide you with the best academic advising & career counselling through interactive live sessions. Book Now!'
				});
			}

			else if (this.activatedClass == 'MBA' && this.activatedSubject == 'Business-Economics') {
				this.title.setTitle('Get Online Experts For MBA Business Economics');
				this.meta.updateTag({
					name: 'description',
					content:
						'GrabGuidance has top experts to help you with your MBA business economics queries & doubts through live interactive 1:1 sessions. So go ahead & book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'online mba economics, mba in economics and finance, economist mba,mba business economics, online mba business economics, online classes for mba business economics, mba business economics live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India`s best leading experts. Go ahead & book a session Now!'
				});
			}

			
			else if (this.activatedClass == 'M.Com' && this.activatedSubject == 'Organisation-Behaviour') {
				this.title.setTitle('Get Online Class for M.Com Organisation Behaviour from Expert');
				this.meta.updateTag({
					name: 'description',
					content:
						'Take M.Com organisation behaviour online classes with best experienced teachers who will guide you & help you understand the root of concepts. Book Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'm.com organisation behaviour, online classes for m.com organisation behaviour, organisation behaviour online classes m.com, m.com organisation behaviour online classes, m.com organisation behaviour live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}


			else if (this.activatedClass == 'M.Com' && this.activatedSubject == 'Financial-Management') {
				this.title.setTitle('Learn M.Com Financial Management From Top Leading Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'GrabGuidance has India’s top experts to help you with your M.Com financial management queries and doubts. There are live 1:1 sessions. Call Us Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'm.com financial management, online m.com financial management, online classes for m.com financial management, m.com financial management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}


			else if (this.activatedClass == 'M.Com' && this.activatedSubject == 'Management-Accounting') {
				this.title.setTitle('Get Online Experts For M.Com Management Accounting');
				this.meta.updateTag({
					name: 'description',
					content:
						'GrabGuidance has best experienced teachers onboard to help you with your M.Com management accounting concepts. So go ahead & book a session with us!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'm.com management accounting, m.com management accounting online classes, online management accounting classes for m.com, best online classes for m.com management accounting, m.com management accounting live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Best Career Counselling Online For Students In India'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance provides the best online doubt solving & career counselling for students in India through leading experts onboard. Book a Session with us Now!'
				});
			}


			else if (this.activatedClass == 'M.Com' && this.activatedSubject == 'Human-Resource-Management') {
				this.title.setTitle('Learn M.Com Human Resource Management From Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Book a session for M.Com human resource management with experienced teachers at GG to help you with your queries & doubts. Live Sessions. Call Us Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'm.com human resource management, m.com human resource management, online human resource management classes for m.com, online classes for m.com human resource management, m.com human resource management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic Advising For Students From Leading Experts'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance has the best experts onboard to provide you with the best academic advising & career counselling through interactive live sessions. Book Now!'
				});
			}

			else if (this.activatedClass == 'M.Com' && this.activatedSubject == 'Marketing-Management') {
				this.title.setTitle('Book M.Com Marketing Management Online Class With Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'We at GG have the leading experts onboard to help you with your M.Com marketing management doubts through interactive live 1:1 sessions. Call Us Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'marketing management mcom, m.com marketing management, online m.com marketing management, online classes for m.com marketing management, m.com marketing management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India`s best leading experts. Go ahead & book a session Now!'
				});
			}

			else if (this.activatedClass == 'PGDM' && this.activatedSubject == 'Organisation-Behaviour') {
				this.title.setTitle('Get Online Experts For PGDM Organisation Behaviou');
				this.meta.updateTag({
					name: 'description',
					content:
						'GG has top experts to help you with your PGDM organisation behaviour queries & doubts through interactive live 1:1 sessions. Click here to know more!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'pgdm organisation behaviour, online pgdm organisation behaviour, pgdm organisation behaviour online classes, pgdm organisation behaviour live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}


			else if (this.activatedClass == 'PGDM' && this.activatedSubject == 'Business-Communication') {
				this.title.setTitle('Learn PGDM Business Communication From Leading Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have experienced teachers onboard to help you with your PGDM business communication concepts through live sessions. Go ahead & book a session now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'pgdm business communications, online pgdm business communications, online business communications classes for pgdm, pgdm business communications live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}

			else if (this.activatedClass == 'PGDM' && this.activatedSubject == '%0D%0AProduction-&-Operations-Management%0D%0A') {
				this.title.setTitle('Learn PGDM Production & Operations Management from Expert');
				this.meta.updateTag({
					name: 'description',
					content:
						'GG has leading experts onboard to help you with your PGDM production & operations management doubts through interactive live sessions. Book Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'pgdm in production management, pgdm production & operations management, cpgdm production & operations management online classes, pgdm production & operations management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Best Career Counselling Online For Students In India'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance provides the best online doubt solving & career counselling for students in India through leading experts onboard. Book a Session with us Now!'
				});
			}

			else if (this.activatedClass == 'PGDM' && this.activatedSubject == 'Financial-Management') {
				this.title.setTitle('Book a Session With Experts For PGDM Financial Management');
				this.meta.updateTag({
					name: 'description',
					content:
						'Book a session at GG for PGDM financial management with experienced teachers to help you with your queries & doubts. Click here to know more!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'pgdm financial management, online pgdm financial management, online classes forpgdm financial management, pgdm financial management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic Advising For Students From Leading Experts'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance has the best experts onboard to provide you with the best academic advising & career counselling through interactive live sessions. Book Now!'
				});
			}

			else if (this.activatedClass == 'PGDM' && this.activatedSubject == 'Marketing-Management') {
				this.title.setTitle('Book Online Class for PGDM Marketing Management with Expert');
				this.meta.updateTag({
					name: 'description',
					content:
						'Top leading teachers with years of expertise to help you with your PGDM marketing management queries. There are live 1:1 sessions. Call Us Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'pgdm marketing management, online pgdm marketing management, online classes for pgdm marketing management, pgdm marketing management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India`s best leading experts. Go ahead & book a session Now!'
				});
			}

			else if (this.activatedClass == 'PGDM' && this.activatedSubject == 'Human-Resource-Management') {
				this.title.setTitle('Get Online Experts For PGDM Human Resource Management');
				this.meta.updateTag({
					name: 'description',
					content:
						'Best experts for online classes of PGDM human resource management to help you understand the concepts clearly through 1:1 live sessions. Book Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'pgdm in hr management, pgdm in hr, pgdm human resource management, online pgdm human resource management, online classes for pgdm human resource management, pgdm human resource management online classes, pgdm human resource management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}

			else if (this.activatedClass == 'PGDM' && this.activatedSubject == 'Taxation') {
				this.title.setTitle('Best Online Classes For PGDM Taxation From Leading Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'India’s best teachers to help you with your doubts & make you deeply understand the concepts of PGDM taxation through interactive sessions. Book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'pgdm in taxation, pgdm taxation, online pgdm taxation, pgdm taxation online class, live classes for pgdm taxation'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}


			else if (this.activatedClass == 'PGDM' && this.activatedSubject == 'Sales-&-Distribution-Management') {
				this.title.setTitle('Best Online Classes for PGDM Sales & Distribution Management');
				this.meta.updateTag({
					name: 'description',
					content:
						'Take PGDM sales & distribution management online classes with top experts who will guide you & help you understand the root of concepts. Book Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'pgdm sales & distribution management, online pgdm sales & distribution management, pgdm sales & distribution management online classes, pgdm sales & distribution management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Best Career Counselling Online For Students In India'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance provides the best online doubt solving & career counselling for students in India through leading experts onboard. Book a Session with us Now!'
				});
			}


			else if (this.activatedClass == 'PGDM' && this.activatedSubject == 'Supply-Chain-Management') {
				this.title.setTitle('Get Online Experts For PGDM Supply Chain Management');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have top experts to help you with your PGDM supply chain management & doubts through live interactive 1:1 sessions. Click here to know more!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'pgdm in supply chain, pgdm in operations and supply chain management, supply chain management pgdm, pgdm logistics supply chain management, pgdm in logistics and supply chain management, pgdm supply chain management, online pgdm supply chain management, online classes for pgdm supply chain management, pgdm supply chain management live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic Advising For Students From Leading Experts'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance has the best experts onboard to provide you with the best academic advising & career counselling through interactive live sessions. Book Now!'
				});
			}

			else if (this.activatedClass == 'PGDM' && this.activatedSubject == 'Digital-Marketing') {
				this.title.setTitle('Learn PGDM In Digital Marketing Leading Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'We at GrabGuidance have experienced teachers onboard to help you with your PGDM digital marketing concepts. So go ahead & book a session with us!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'pgdm in digital marketing, pgdm digital marketing, onlinepgdm digital marketing, online classes for pgdm digital marketing, pgdm digital marketing live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic & Career Guidance | Best Doubt Solving Website'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get career counselling and academic guidance at GrabGuidance through 1:1 live sessions from India`s best leading experts. Go ahead & book a session Now!'
				});
			}

			else if (this.activatedClass == 'MCA' && this.activatedSubject == 'Organisation-Behaviour') {
				this.title.setTitle('Book a Session With Experts For MCA Organisation Behaviour');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have India’s top experts to help you with your MCA organisation behaviour queries and doubts. There are live 1:1 sessions. So go ahead a book a session with us!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'mca organisation behaviour, online mca organisation behaviour, online classes for mca organisation behaviour, mca online classes organisation behaviour, mca organisation behaviour live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Online Career Guidance | Best Online Doubt Solving Platform'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Get online 1:1 academic guidance and personalized career counselling from GrabGuidance - One of the best online doubt solving platform in India. Call Now!'
				});
			}


			else if (this.activatedClass == 'MCA' && this.activatedSubject == 'Database-Management-System') {
				this.title.setTitle('Learn MCA Database Management System From Top Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'We have the leading experts onboard to help you with your dbms MCA doubts through interactive live sessions. So do not wait anymore and book now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'dbms mca, dbms mca online classes, mca database management system, online mca database management system, online classes for mca database management system, mca database management system live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Online Career Counselling & Academic Advising for Students'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'Are you in search of an excellent online career counselling & academic advising? GG has top experts who can guide you in the best way possible. Call Us Now!'
				});
			}


			else if (this.activatedClass == 'MCA' && this.activatedSubject == 'System-Analysis-&-Design') {
				this.title.setTitle('Book Live Class for MCA System Analysis & Design with Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'GG has top leading teachers with years of expertise to help you with your MCA system analysis & design queries. There are live 1:1 sessions. Book Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'mca system analysis & design, online mca system analysis & design, mca system analysis & desig online classes, mca system analysis & design live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'Best Career Counselling Online For Students In India'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance provides the best online doubt solving & career counselling for students in India through leading experts onboard. Book a Session with us Now!'
				});
			}

			else if (this.activatedClass == 'MCA' && this.activatedSubject == 'Management-Accounting') {
				this.title.setTitle('Get Online Class for MCA Management Accounting from Experts');
				this.meta.updateTag({
					name: 'description',
					content:
						'Take MCA management accounting online classes with best experienced teachers who will guide you & help you understand the root of concepts. Call Us Now!'
				});
				this.meta.updateTag({
					name: 'keywords',
					content:
						'mca management accounting, online mca management accounting, online classes for mca management accounting, mca management accounting live classes'
				});
				this.meta.updateTag({
					name: 'og:title',
					content:
						'1:1 Academic Advising For Students From Leading Experts'
				});
				this.meta.updateTag({
					name: 'og:description"',
					content:
						'GrabGuidance has the best experts onboard to provide you with the best academic advising & career counselling through interactive live sessions. Book Now!'
				});
			}
			
		
			else {
				this.title.setTitle('Best Online Sessions, Classes & Doubt Solving for Students');
				this.meta.updateTag({
					name: 'keywords',
					content:
						'online classes, career guidance, academic counselling, live classes, career counselling,  job advising'
				});
				this.meta.updateTag({
					name: 'description',
					content:
						'Top Experts for your Online Sessions, Classes and Courses in India. Rightly designed and personalized to help you acquire, transform knowledge and grow. Call Us Now!.'
				});
			}
		});
		this.showSearchList = true;
		this.isLoggedIn = localStorage.getItem('isLoggedIn');
		this.userId = localStorage.getItem('id_user');
		this.userType = localStorage.getItem('user_role');
		if (isPlatformBrowser(this.platformId)) {
			this.selectedSortBy =
				sessionStorage.getItem('short_by') != null ? sessionStorage.getItem('short_by') : 'None';
			this.filterObj = JSON.parse(sessionStorage.getItem('filters'));
		}
		this.initializeFilter();
		this.sortByCriteria = this.dataService.getSortByOptions();
		this.prizeCriteria = this.dataService.getPrizeFilter();
		this.languageCritria = this.dataService.getLanguagesFilter();
		this.accessibilityCriteria = this.dataService.getSpecialAccesebilityFilter();
		this.genderCriteria = this.dataService.getGender();
		this.searchObject = this.dataService.searchCriteriaSub$.subscribe((criteria) => {
			if (criteria.class == null && criteria.roleObj == null) {
				criteria = activatedRouteCriteria;
			}
			this.dataService.truncateExpert();
			this.searchCriteria = criteria;
			this.getTheSearchedExpertList('');
		});
	}

	ngOnDestroy() {
		this.searchObject.unsubscribe();
	}

	getTheSearchedExpertList(type: string) {
		let searchCriteria = this.createSearchCriteria();
		let filter = this.createFilterCriteria();
		let short_by = this.createSortCriteria();
		let expert_ids = this.createExpertIds(type);
		this.apiService
			.searchExpert(
				searchCriteria.selectedClassId,
				searchCriteria.selectedRoleId,
				searchCriteria.selectedRoleName,
				filter,
				short_by,
				expert_ids,
				this.start,
				this.end,
				this.userId
			)
			.subscribe((data) => {
				if (data.code == 1000) {
					if (isPlatformBrowser(this.platformId)) {
						sessionStorage.setItem('searchedClass', searchCriteria.selectedClassValue);
						sessionStorage.setItem('searchedSubject', searchCriteria.selectedRoleSubject);

						localStorage.setItem('searchedClass', searchCriteria.selectedClassValue);
						localStorage.setItem('searchedSubject', searchCriteria.selectedRoleSubject);
					}

					this.subject = searchCriteria.selectedRoleSubject;
					if (type == 'load_more') {
						this.expertsList = this.expertsList.concat(data.experts);
					} else {
						this.expertsList = data.experts;
						this.searchCount = data.count;
						this.filterCount = data.filter;
					}
				}
			});
	}

	LoadMoreCount() {
		return this.expertsList.length < this.filterCount;
	}

	loadMoreData() {
		this.start = this.end;
		this.end = this.start + 15;
		// console.log("loadmor called");
		this.getTheSearchedExpertList('load_more');
	}

	createExpertIds(type: string) {
		if (type == 'load_more') {
			let expert_id = [];
			console.log(expert_id);
			this.expertsList.forEach((exp) => {
				expert_id.push(exp.id);
			});
			return expert_id;
		} else {
			return [];
		}
	}

	createSortCriteria() {
		if (this.selectedSortBy == 'Price - High To Low') {
			return 'price_high';
		}

		if (this.selectedSortBy == 'Price - Low To High') {
			return 'price_low';
		}

		if (this.selectedSortBy == 'By Rating') {
			return 'rating';
		}

		if (this.selectedSortBy == 'By Name') {
			return 'name';
		}

		if (this.selectedSortBy == 'Year Of Experience') {
			return 'experience';
		}

		return '';
	}

	createSearchCriteria() {
		let searchCriteria = {
			selectedClassId: null,
			selectedClassValue: null,
			selectedRoleId: null,
			selectedRoleName: 'all',
			selectedRoleSubject: null
		};

		if (this.searchCriteria && this.searchCriteria.class) {
			let selectedClassData = this.searchCriteria.class;
			let classData = selectedClassData.split('-');
			searchCriteria.selectedClassId = classData[0];
			searchCriteria.selectedClassValue = classData[1];
			this.class = searchCriteria.selectedClassValue;
		}

		if (this.searchCriteria && this.searchCriteria.roleObj) {
			let roleObj = this.searchCriteria.roleObj;
			searchCriteria.selectedRoleId = roleObj.id;
			searchCriteria.selectedRoleSubject = roleObj.name;
			searchCriteria.selectedRoleName = roleObj.role;
			this.subject = searchCriteria.selectedRoleSubject;
		}
		return searchCriteria;
	}

	initializeFilter() {
		for (let x in this.filterObj) {
			switch (x) {
				case 'language':
					this.selectedLanguage = this.filterObj[x];
					break;
				case 'accesebility':
					this.selectedAccessbility = this.filterObj[x];
					break;
				case 'gender':
					this.selectedGender = this.filterObj[x];
					break;
				case 'price':
					this.selectedPrize = this.createInitialPrice(this.filterObj[x]);
			}
		}
	}

	createInitialPrice(price: any) {
		let max = price.max;
		let min = price.min;

		if (max && !min) {
			return '< 250';
		}

		if (!max && min) {
			return '1000+';
		}

		if (min && max) {
			return min + '-' + max;
		}
	}

	createFilterCriteria() {
		let filter = {
			gender: '',
			language: '',
			accesebility: '',
			price: { max: '', min: '' }
		};

		if (this.selectedPrize == 'All') {
			delete filter.price;
		} else {
			filter.price = this.filterByPrice(this.selectedPrize);
		}

		if (this.selectedLanguage == 'Any') {
			delete filter.language;
		} else {
			filter.language = this.selectedLanguage;
		}

		if (this.selectedAccessbility == 'Everyone') {
			delete filter.accesebility;
		} else {
			filter.accesebility = this.selectedAccessbility;
		}

		if (this.selectedGender == 0) {
			delete filter.gender;
		} else {
			filter.gender = this.selectedGender;
		}
		this.filterObj = filter;
		return filter;
	}

	filterByPrice(priceFilter: string) {
		let price = { max: null, min: null };

		if (priceFilter == '< 250') {
			price.max = 249;
			delete price.min;
		}
		if (priceFilter == '250-500') {
			price.min = 250;
			price.max = 500;
		}

		if (priceFilter == '500-1000') {
			price.min = 500;
			price.max = 1000;
		}

		if (priceFilter == '1000+') {
			price.min = 1001;
			delete price.max;
		}
		return price;
	}

	applyFilter() {
		if (isPlatformBrowser(this.platformId)) {
			sessionStorage.setItem('filters', JSON.stringify(this.createFilterCriteria()));
			sessionStorage.setItem('short_by', this.selectedSortBy);

			localStorage.setItem('filters', JSON.stringify(this.createFilterCriteria()));
			localStorage.setItem('short_by', this.selectedSortBy);
		}
		this.getTheSearchedExpertList('');
	}

	totalFilterApplied() {
		let filter = this.createFilterCriteria();
		return Object.keys(filter).length;
	}

	clearFilters() {
		this.selectedSortBy = 'By Name';
		this.selectedPrize = 'All';
		this.selectedLanguage = 'Any';
		this.selectedAccessbility = 'Everyone';
		this.selectedGender = 0;
		if (isPlatformBrowser(this.platformId)) {
			sessionStorage.removeItem('filters');
			sessionStorage.removeItem('short_by');
			localStorage.removeItem('filters');
			localStorage.removeItem('short_by');
		}
		this.getTheSearchedExpertList('');
	}

	createImageUrl(data: string) {
		if (data) {
			return data;
		}
		return '../../assets/images/image.png';
	}

	gotoProfile(data: any) {
		this.showSearchList = false;
		let burl = data.name;
		let fg = burl.split(' ');
		let join = fg.join('-');
		if (isPlatformBrowser(this.platformId)) {
			window.open('/expert/' + data.id + '/' + join);
		}
	}

	bookmarkExpert(expert: any) {
		if (this.isLoggedIn) {
			if (this.userType == 'user') {
				let message = null;
				if (expert.selected == 1) {
					expert.selected = 0;
					message = 'Removed From Favourites';
				} else {
					expert.selected = 1;
					message = 'Saved To Favourites';
				}
				this.apiService.saveUserExpert(expert.id, this.userId, expert.selected).subscribe((data) => {
					if (data.code == 1000) {
						this.tostr.success(message);
					}
				});
			} else {
				alert(this.userType + ' are not allowed to save the experts');
			}
		} else {
			if (isPlatformBrowser(this.platformId)) {
				this.apiService.openExpertSignInModal('User signIn');
				sessionStorage.setItem('redirectUrl', this.router.url);
				localStorage.setItem('redirectUrl', this.router.url);
			}
		}
	}

	mouseEnter(rowData, value) {
		rowData.showBookNowBtn = true;
	}

	mouseLeave(rowData, value) {
		rowData.showBookNowBtn = false;
	}

	refresh(): void {
		if (isPlatformBrowser(this.platformId)) {
			window.location.reload();
		}
	}
}
