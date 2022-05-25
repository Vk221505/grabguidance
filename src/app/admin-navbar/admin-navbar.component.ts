import { Inject, Input, PLATFORM_ID } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/services/api.service';
import { DataService } from 'src/services/data.service';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { isPlatformBrowser } from "@angular/common";

declare var $: any;
@Component({
	selector: 'app-admin-navbar',
	templateUrl: './admin-navbar.component.html',
	styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent implements OnInit {
	@Input('isLoggedIn') isLoggedIn: Boolean = true;

	popoverTitle = 'Popover title';
	popoverMessage = 'Popover description';
	confirmClicked = false;
	cancelClicked = false;
	placements = top;
	adminPic: any;
	adminId: any;
	imageUrl: any = '../../assets/images/Grabguidance PP@2x.png';
	oldpass: string;
	newpass: string;
	usrSession = []
	sessDur = []
	expSession = []
	selectedItems = [];
	selectedDur = []
	selectedExp = []
	time = new FormControl();
	dropdownSettings: IDropdownSettings;
	dropdownSettingsExperts: IDropdownSettings;
	dropdownSettingsDuration: IDropdownSettings;
	dateNew: any;
	date = new FormControl();


	constructor(
		private route: Router,
		private apiService: ApiService,
		private toastr: ToastrService,
		private dataService: DataService,
		private sanitizer: DomSanitizer,
		@Inject(PLATFORM_ID) private platformId: Object
	) { }

	ngOnInit(): void {
		this.fetchAdminProfilePitcher();
		this.adminId = localStorage.getItem('id_admin');
		this.userForSession()
		this.expertForSession()
		this.sessionDuration()
		this.dropdownSettings = {
			singleSelection: false,
			idField: 'id_user',
			textField: 'full_name',
			selectAllText: 'Select All',
			unSelectAllText: 'UnSelect All',
			itemsShowLimit: 7,
			allowSearchFilter: true,
			limitSelection: 7,
		};
		this.dropdownSettingsExperts = {
			singleSelection: true,
			idField: 'id_expert',
			textField: 'full_name',
			selectAllText: 'Select Expert',
			unSelectAllText: 'UnSelect All',
			itemsShowLimit: 1,
			allowSearchFilter: true,
			closeDropDownOnSelection: true
		};
		this.dropdownSettingsDuration = {
			singleSelection: true,
			idField: 'id',
			textField: 'time',
			selectAllText: 'Select Duration',
			unSelectAllText: 'UnSelect All',
			itemsShowLimit: 1,
			allowSearchFilter: false,
			closeDropDownOnSelection: true
		};



	}

	logout() {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.clear();
			sessionStorage.clear();
			this.dataService.setUserLoggingStatus(null);
			this.route.navigate(['/']);
		}
	}

	ChangePassword() { }

	onSubmit() {
		let oldPassword: string = this.oldpass;
		let newPassword: string = this.newpass;
		this.apiService.adminChangePassword(this.adminId, oldPassword, newPassword).subscribe(
			(res) => {
				if (res.code == 1000) {
					this.toastr.success('Your password is changed successfully');
				} else if (res.code == 1001) {
					this.toastr.error(res.status);
				} else {
					this.toastr.error('Error in changing password');
				}
			},
			(err) => {
				this.toastr.error('Error in changing password');
			}
		);
	}


	userForSession() {

		this.apiService.fetchUsersForSession().subscribe(
			(res) => {
				this.usrSession = res.users
			},
			(err) => {
				// this.toastr.error('Error in changing password');
			}
		);
	}

	onItemSelect(item: any, data) {
		JSON.stringify(item)
		if (data == "user") {
			this.selectedItems.push(item.id_user)
		}
		if (data == "expert") {
			this.selectedExp.push(item.id_expert)
		}
		if (data == "dur") {
			this.selectedDur.push(item.id)
		}

	}

	onItemDeSelect(item: any, data) {


		if (data == "user") {
			let indx = this.selectedItems.indexOf(item.id_user)
			this.selectedItems.splice(indx, 1)
		}
		if (data == "expert") {
			let indx = this.selectedExp.indexOf(item.id_expert)
			this.selectedExp.splice(indx, 1)
		}
		if (data == "dur") {
			let indx = this.selectedDur.indexOf(item.id)
			this.selectedDur.splice(indx, 1)
		}

	}

	book() {

		let value = this.selectedDur[0]
		let times = this.sessDur[value - 1].time
		let startTime = moment(this.time.value, 'HH:mm').format('HH:mm:ss');
		let endTime = moment(this.time.value, 'HH:mm').add(times, 'minutes').format('HH:mm:ss');

		this.apiService.bookSessionFromAdmin(this.date.value, this.selectedExp[0], JSON.stringify(this.selectedItems), startTime, endTime).subscribe(
			(res) => {
				if (res.code == "1000") {
					this.toastr.success('Session Booked Successfully');
					this.closemodalOnbook()

				}
				else {
					this.toastr.error('Error in session booking');
					this.closemodalOnbook()
				}
			},
			(err) => {
				this.toastr.error('Error in session booking');
				this.closemodalOnbook()
			}

		);

	}

	closemodalOnbook() {
		if (isPlatformBrowser(this.platformId)) {
			$('#bookMultipleSessions').modal('hide');
			window.location.reload()
		}

	}

	expertForSession() {

		this.apiService.fetchExpertsForSession().subscribe(
			(res) => {
				this.expSession = res.experts


			},
			(err) => {
				// this.toastr.error('Error in changing password');
			}
		);
	}

	sessionDuration() {
		this.sessDur = [{ id: 1, time: 20 }, { id: 2, time: 40 }, { id: 3, time: 60 }]
	}

	dasboard() {
		this.route.navigate(['/admin/dashboard']);
	}

	fetchAdminProfilePitcher() {
		this.adminPic = localStorage.getItem('admin_pic');
		if (this.adminPic) {
			var base64String = btoa(
				new Uint8Array(this.adminPic).reduce(function (data, byte) {
					return data + String.fromCharCode(byte);
				}, '')
			);
			this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + base64String);
		}
	}

	openBookMultipleSessions() {
		if (isPlatformBrowser(this.platformId)) {
			$('#bookMultipleSessions').modal('show');
		}

	}
	confirm() {
		if (isPlatformBrowser(this.platformId)) {
			$("#manualTrigger").click(function () {
				$.confirm({
					text: "This is a confirmation dialog manually triggered! Please confirm:",
					confirm: function (button) {
						alert("You just confirmed.");
					},
					cancel: function (button) {
						alert("You cancelled.");
					}
				});
			});
		}
	}
}
