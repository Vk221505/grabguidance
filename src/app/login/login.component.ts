import { Inject, PLATFORM_ID, ViewChildren } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as _ from 'jquery';
import { ApiService } from 'src/services/api.service';
import { DataService } from 'src/services/data.service';
import {isPlatformBrowser} from "@angular/common";
import { Title, Meta } from '@angular/platform-browser';


declare var $: any;
declare var ga: Function;

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {
	myDate = new Date();
	name;
	showMe: boolean = false;
	countries;
	results = [];
	blogsData = [];
	blogtext: any;
	loginForm: FormGroup;
	submitted: boolean;
	classes: any[];
	guidanceSelected: any;
	class: any;
	result: any;
	clss: any;
	returnUrl: string;
	subjectGuidance: any[];
	reviews: any[];
	isLoginForm: boolean = false;
	NumberPoints = [
		{ heading: '100+ Experts', para: 'Best in Class' },
		{ heading: '20 Minutes Session ', para: 'For Short Doubts' },
		{ heading: 'Rs. 125 ', para: ' Price as Low' }
	];
	featured: any[];
	blogs = [];

	@ViewChildren('formRow') rows: any;

	constructor(
		private title: Title,
		private meta: Meta,
		private route: Router,
		private fb: FormBuilder,
		private apiService: ApiService,
		private dataService: DataService,
		@Inject(PLATFORM_ID) private platformId: Object
	) {
		this.submitted = false;
	}

	ngAfterViewInit(): void {
		this.route.events.subscribe(event => {
		  // I check for isPlatformBrowser here because I'm using Angular Universal, you may not need it
		  if (event instanceof NavigationEnd && isPlatformBrowser(this.platformId)) {
			console.log(ga); // Just to make sure it's actually the ga function
			ga('set', 'page', event.urlAfterRedirects);
			ga('send', 'pageview');
		  }
		});
	  }

	ngOnInit() {
		this.title.setTitle("Best Online Sessions, Classes & Doubt Solving for Students | March 2022");
		this.meta.updateTag({name:'keywords', content:'online classes, career guidance, academic counselling, live classes, career counselling,  job advising'});
		this.meta.updateTag({name:'description', content: 'Top Experts for your Online Sessions, Classes & Courses in India. Rightly designed and personalized to help you acquire, transform knowledge and grow. Call Us Now!.'});
	
		this.meta.updateTag({property:'og:title', content :'1:1 Academic, Career Guidance for Students | Best Online Doubt Solving Platform'});
		this.meta.updateTag({ property:'og:description', content:' Get online 1:1 Academic Guidance and personalized career counseling for Students from GrabGuidance - one of the best online doubt solving Platform in India.'});
		this.meta.updateTag({property:'og:site_name', content:'GrabGuidance'})

		this.dataService.setSearchCiteria({
			class: null,
			roleObj: null
		});
		this.reviews = this.dataService.getReviewForSlider();
		this.fetchClasses();
		this.featureExpert();
		this.countries = this.dataService.getCountries();
		if(isPlatformBrowser(this.platformId)){
			sessionStorage.removeItem('checkout');
			sessionStorage.removeItem('filters');
			sessionStorage.removeItem('short_by');
			this.featchBlog();
			$(document).ready(function() {
				var url = $('#Geeks3').attr('src');
				$('#Geeks2').on('hide.bs.modal', function() {
					$('#Geeks3').attr('src', '');
				});
				$('#Geeks2').on('show.bs.modal', function() {
					$('#Geeks3').attr('src', url);
				});
			});
	
			$(document).ready(function() {
				var url = $('#Geekscapf').attr('src');
				$('#Geekscap').on('hide.bs.modal', function() {
					$('#Geekscapf').attr('src', '');
				});
				$('#Geekscap').on('show.bs.modal', function() {
					$('#Geekscapf').attr('src', url);
				});
			});
	
			$(document).ready(function() {
				var url = $('#Geeksmehakf').attr('src');
				$('#Geeksmehak').on('hide.bs.modal', function() {
					$('#Geeksmehakf').attr('src', '');
				});
				$('#Geeksmehak').on('show.bs.modal', function() {
					$('#Geeksmehakf').attr('src', url);
				});
			});
	
			$(document).ready(function() {
				var url = $('#Geekssheryf').attr('src');
				$('#Geeksshery').on('hide.bs.modal', function() {
					$('#Geekssheryf').attr('src', '');
				});
				$('#Geeksshery').on('show.bs.modal', function() {
					$('#Geekssheryf').attr('src', url);
				});
			});
		}
	}
	toeeletag() {
		this.showMe = !this.showMe;
	}

	customOptions2: any = {
		loop: true,
		mouseDrag: true,
		touchDrag: true,
		pullDrag: true,
		dots: false,
		margin: 0,
		responsive: {
			0: {
				items: 2
			},
			600: {
				items: 4
			},
			1000: {
				items: 5
			}
		},
		nav: false
	};

	customOptions: any = {
		loop: true,
		mouseDrag: true,
		touchDrag: true,
		pullDrag: true,
		dots: false,
		margin: 15,
		autoHeight: true,
		navSpeed: 700,
		navText: [ '<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>' ],
		responsive: {
			0: {
				items: 2
			},
			400: {
				items: 2
			},
			740: {
				items: 4
			},
			940: {
				items: 5
			}
		},
		nav: true
	};

	continueToSearch() {
		this.route.navigate([ '/expert-list' ]);
	}

	gotoProfile(data: any) {
	  let burl = data.name;
      let fg = burl.split(' ');
      let join= fg.join('-');
	  if(isPlatformBrowser(this.platformId)){
		window.open('/expert/' + data.id + "/" + join)
	  }
	}

	featureExpert() {
		this.apiService.featuredExpert().subscribe((res) => {
			this.featured = res.experts;
			this.featured = this.featured.sort(() => Math.random() - 0.5);
		});
	}
	wpBlogs() {
		this.apiService.wpBlogs().subscribe((res) => {
			this.blogs = res.blogs;
			console.warn(res);
			this.blogs = this.blogs.sort(() => Math.random() - 0.5);
		});
	}
	createImageUrl(data: string) {
		if (data) {
			return data;
		}
		return '../../assets/images/image.png';
	}

	search() {
		this.submitted = true;
		if(isPlatformBrowser(this.platformId)){
			sessionStorage.removeItem('class');
			sessionStorage.removeItem('roleObj');
			sessionStorage.removeItem('searchedClass');
			sessionStorage.removeItem('searchedSubject');
		}
		if (this.loginForm.value.classDropDown) {
			if(isPlatformBrowser(this.platformId)){
				sessionStorage.setItem('class', this.loginForm.value.classDropDown);
			}
			
		}
		if (this.loginForm.value.searchValue) {
			if(isPlatformBrowser(this.platformId)){
				sessionStorage.setItem('roleObj', JSON.stringify(this.loginForm.value.searchValue));
			}
			
		}
		this.route.navigate([ '/expert-list' ]);
	}

	fetchClasses() {
		this.apiService.fetchClasses().subscribe((res) => {
			this.classes = res.class;
		});
	}

	featchBlog() {
		this.apiService.featchBlog().subscribe((data) => {
			this.blogsData = data;
		});
	}

	guidanceTab(classobj: any) {
		this.dataService.setSearchCiteria({
			class: classobj.id_class + '-' + classobj.class_name,
			roleObj: null
		});
		if (this.loginForm.value.classDropDown) {
			if(isPlatformBrowser(this.platformId)){
				sessionStorage.setItem('class', classobj.id_class + '-' + classobj.class_namen);
			}
			
		}
		if (this.loginForm.value.searchValue) {
			if(isPlatformBrowser(this.platformId)){
				sessionStorage.setItem('roleObj', null);
			}
		}
		this.route.navigate([ '/expert-list' ]);
	}

	autocompleteValue(event) {
		this.clss = this.loginForm.value;
		this.apiService.search(this.clss.classDropDown, this.clss.searchValue).subscribe((res) => {
			this.result = res.result;
			this.results = this.result.filter((c) =>
				c.name.toLowerCase().startsWith(this.clss.searchValue.toLowerCase())
			);
		});
	}

	navigate(option) {

	}

	becomeAnExpert() {
		this.apiService.openExpertSignUpModal('Expert SignUp');
	}
}
