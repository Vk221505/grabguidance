import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

@Injectable({
	providedIn: 'root'
})
export class UtilityService {
	private _activeExpertId: BehaviorSubject<string> = new BehaviorSubject(null);
	activatedExpert$ = this._activeExpertId.asObservable();

	setActivExpertId(id: string) {
		this._activeExpertId.next(id);
	}

	formatSessionDate(date: string) {
		var startDate = moment(new Date()).format().split('T')[0];
		var endDate = moment(date).format().split('T')[0];
		var diff = moment(endDate).diff(moment(startDate), 'days');
		if (diff === 0) {
			return 'Today';
		}
		return moment(date).format('Do MMMM YYYY');
	}

	calculateSessionDuration(sessionStart, sessionEnd, sessionDate) {
		let dateTime = sessionDate.split('T');
		let startTime = dateTime[0] + 'T' + sessionStart + '+05:30';
		let endTime = dateTime[0] + 'T' + sessionEnd + '+05:30';

		return moment(endTime).diff(moment(startTime), 'minutes');
	}

	createTimeFormat(date: string) {
		let currentDate = moment(new Date()).format('YYYY-MM-DD');
		let currentDateTime = currentDate + 'T' + date + '+05:30';
		return moment(currentDateTime).format('h:mm a');
	}
	// added by ritesh
	createTimeFormats(date: string) {
		let currentDate = moment(new Date()).format('YYYY-MM-DD');
		let currentDateTime = currentDate + 'T' + date + '+05:30';
		return moment(currentDateTime).format('hh:mm a');
	}

	createDayFromDate(date: any) {
		return moment(date).format('ddd');
	}

	getGender(value: any) {
		switch (value) {
			case 1:
				return 'Male';
				break;
			case 2:
				return 'Female';
				break;
			case 3:
				return 'Other';
		}
	}
}
