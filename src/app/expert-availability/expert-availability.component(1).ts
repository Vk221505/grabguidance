import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { DataService } from 'src/services/data.service';
import * as moment from 'moment';


@Component({
  selector: 'app-expert-availability',
  templateUrl: './expert-availability.component.html',
  styleUrls: ['./expert-availability.component.css']
})
export class ExpertAvailabilityComponent implements OnInit {

  availabilityForm: FormGroup;
  submitted: boolean;
  guidanceFees: number;
  fortyMinFee: number;
  sixtyMinFee: number;
  twentyMinFee: number;
  guidanceFeeChanged: boolean;
  sessionOneFromValues0 = this.dataService.getSessionOneFromValues()
  sessionOneFromValues1 = this.dataService.getSessionOneFromValues()
  sessionOneFromValues2 = this.dataService.getSessionOneFromValues()
  sessionOneFromValues3 = this.dataService.getSessionOneFromValues()
  sessionOneFromValues4 = this.dataService.getSessionOneFromValues()
  sessionOneFromValues5 = this.dataService.getSessionOneFromValues()
  sessionOneFromValues6 = this.dataService.getSessionOneFromValues()

  sessionOneToValues0 = this.dataSerive.getSessionOneToValues();
  sessionOneToValues1 = this.dataSerive.getSessionOneToValues();
  sessionOneToValues2 = this.dataSerive.getSessionOneToValues();
  sessionOneToValues3 = this.dataSerive.getSessionOneToValues();
  sessionOneToValues4 = this.dataSerive.getSessionOneToValues();
  sessionOneToValues5 = this.dataSerive.getSessionOneToValues();
  sessionOneToValues6 = this.dataSerive.getSessionOneToValues();

  sessionTwoFromValues0 = this.dataSerive.getSessionTwoFromValues()
  sessionTwoFromValues1 = this.dataSerive.getSessionTwoFromValues()
  sessionTwoFromValues2 = this.dataSerive.getSessionTwoFromValues()
  sessionTwoFromValues3 = this.dataSerive.getSessionTwoFromValues()
  sessionTwoFromValues4 = this.dataSerive.getSessionTwoFromValues()
  sessionTwoFromValues5 = this.dataSerive.getSessionTwoFromValues()
  sessionTwoFromValues6 = this.dataSerive.getSessionTwoFromValues()

  sessionTwoToValues0 = this.dataSerive.getSsessionTwoToValues();
  sessionTwoToValues1 = this.dataSerive.getSsessionTwoToValues();
  sessionTwoToValues2 = this.dataSerive.getSsessionTwoToValues();
  sessionTwoToValues3 = this.dataSerive.getSsessionTwoToValues();
  sessionTwoToValues4 = this.dataSerive.getSsessionTwoToValues();
  sessionTwoToValues5 = this.dataSerive.getSsessionTwoToValues();
  sessionTwoToValues6 = this.dataSerive.getSsessionTwoToValues();

  expertId: any;
  slots: any[] = [];
  respCodeForSlots: any;
  respCodeForFee: any;
  days: any[] = [];
  finalList: any[] = [];
  sampleArray: any[];
  timingData = [];
  dayData = [];;

  session2Selected = false;
  isAdmin: any;
  @ViewChild("sessionOneToValues", { static: true }) sessionOneToAttr: ElementRef;
  slotData: any = this.dataSerive.getSlotData();
  selectedDay: any;
  selectedFromTime: any;
  selectedToTime: any;
  selected2FromTime: any;
  selected2ToTime: any;
  errorMsg: string;
  feeResponse: any;
  showAvailabilityActive: boolean;
  routeIn: string;
  spinnerFlag: boolean;
  weekdays: string[] = this.dataSerive.getWeekDays();
  isSignUp: string;
  savedValue: any;

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    private dataService: DataService,
    private dataSerive: DataService
  ) {
    this.submitted = false;
    this.spinnerFlag = false;
    this.isSignUp = localStorage.getItem('isSignUp');
    this.isAdmin = localStorage.getItem('isadmin');
  }

  get slotsForm(): FormArray {
    return this.availabilityForm.get('slots') as FormArray;
  }

  ngOnInit() {
    this.slots = [];
    this.selectedFromTime = '';
    this.selectedToTime = '';
    this.selected2FromTime = '';
    this.selected2ToTime = '';
    this.errorMsg = '';
    this.sixtyMinFee = 250;
    this.fortyMinFee = 183;
    this.twentyMinFee = 104;
    this.expertId = localStorage.getItem('id_expert');
    this.guidanceFeeChanged = false;
    this.routeIn = "availability";
    this.availabilityForm = this.fb.group({
      'day': ['', Validators.required],
      'guidanceFee': ['', [Validators.required]],
      'slots': this.fb.array([])
    });
    this.savedValue = localStorage.getItem('value');
    this.buildSlots(this.weekdays);
    if (this.isSignUp) {
      if (this.savedValue != "3") {
        this.fetchData();
      }
    } else {
      this.fetchData();
    }
  }

  fetchData() {
    this.fetchSlots();
    this.fetchFeeById();
  }

  getWeekDays(index): string {
    return this.weekdays[index];
  }

  getSessionOneFromValues(index: number) {
    switch (index) {
      case 0: return this.sessionOneFromValues0;
        break;
      case 1: return this.sessionOneFromValues1;
        break;
      case 2: return this.sessionOneFromValues2;
        break;
      case 3: return this.sessionOneFromValues3;
        break;
      case 4: return this.sessionOneFromValues4;
        break;
      case 5: return this.sessionOneFromValues5;
        break;
      case 6: return this.sessionOneFromValues6;
    }
  }

  getSessionOneToValues(index: number) {
    switch (index) {
      case 0: return this.sessionOneToValues0;
        break;
      case 1: return this.sessionOneToValues1;
        break;
      case 2: return this.sessionOneToValues2;
        break;
      case 3: return this.sessionOneToValues3;
        break;
      case 4: return this.sessionOneToValues4;
        break;
      case 5: return this.sessionOneToValues5;
        break;
      case 6: return this.sessionOneToValues6;
    }
  }

  getSessionTwoFromValues(index: number) {
    switch (index) {
      case 0: return this.sessionTwoFromValues0;
        break;
      case 1: return this.sessionTwoFromValues0;
        break;
      case 2: return this.sessionTwoFromValues0;
        break;
      case 3: return this.sessionTwoFromValues0;
        break;
      case 4: return this.sessionTwoFromValues0;
        break;
      case 5: return this.sessionTwoFromValues0;
        break;
      case 6: return this.sessionTwoFromValues0;
    }
  }

  getSessionTwoToValues(index: number) {
    switch (index) {
      case 0: return this.sessionTwoToValues0;
        break;
      case 1: return this.sessionTwoToValues0;
        break;
      case 2: return this.sessionTwoToValues0;
        break;
      case 3: return this.sessionTwoToValues0;
        break;
      case 4: return this.sessionTwoToValues0;
        break;
      case 5: return this.sessionTwoToValues0;
        break;
      case 6: return this.sessionTwoToValues0;
    }
  }

  onSelection(value: string, i: number) {
    // console.log(this.availabilityForm);
    switch (i) {
      case 0:
        this.setSessionToValues(this.sessionOneFromValues0, this.sessionOneToValues0, value);
        break;
      case 1:
        this.setSessionToValues(this.sessionOneFromValues1, this.sessionOneToValues1, value);
        break;
      case 2:
        this.setSessionToValues(this.sessionOneFromValues2, this.sessionOneToValues2, value);
        break;
      case 3:
        this.setSessionToValues(this.sessionOneFromValues3, this.sessionOneToValues3, value);
        break;
      case 4:
        this.setSessionToValues(this.sessionOneFromValues4, this.sessionOneToValues4, value);
        break;
      case 5:
        this.setSessionToValues(this.sessionOneFromValues5, this.sessionOneToValues5, value);
      case 6:
        this.setSessionToValues(this.sessionOneFromValues6, this.sessionOneToValues6, value);
    }
    //this.selectAllSession1From(value);
  }

  // selectAllSession1From(value: any) {
  //   this.slotsForm.controls.forEach(slot => {
  //     slot.patchValue({
  //       'weekDaySession1From': slot.value.weekDaySession1From ? slot.value.weekDaySession1From : value
  //     })
  //   })
  // }

  // selectAllSession1To(value: any) {
  //   this.slotsForm.controls.forEach(slot => {
  //     slot.patchValue({
  //       'weekDaySession1To': slot.value.weekDaySession1To ? slot.value.weekDaySession1To : value
  //     })
  //   })
  // }

  // selectAllSession2From(value: any) {
  //   this.slotsForm.controls.forEach(slot => {
  //     slot.patchValue({
  //       'weekDaySession2From': slot.value.weekDaySession2From ? slot.value.weekDaySession2From : value
  //     })
  //   })
  // }

  // selectAllSessionToValues(value: any) {
  //   this.slotsForm.controls.forEach(slot => {
  //     slot.patchValue({
  //       'weekDaySession2To': slot.value.weekDaySession2To ? slot.value.weekDaySession2To : value
  //     })
  //   })
  // }


  onSelection2(value: string, i: number) {
    console.log("value "+ value , "i " + i )
    switch (i) {
      case 0:
        this.setSessionToValues(this.sessionTwoFromValues0, this.sessionTwoToValues0, value);
        break;
      case 1:
        this.setSessionToValues(this.sessionTwoFromValues1, this.sessionTwoToValues1, value);
        break;
      case 2:
        this.setSessionToValues(this.sessionTwoFromValues2, this.sessionTwoToValues2, value);
        break;
      case 3:
        this.setSessionToValues(this.sessionTwoFromValues3, this.sessionTwoToValues3, value);
        break;
      case 4:
        this.setSessionToValues(this.sessionTwoFromValues4, this.sessionTwoToValues4, value);
        break;
      case 5:
        this.setSessionToValues(this.sessionTwoFromValues5, this.sessionTwoToValues5, value);
        break;
      case 6:
        this.setSessionToValues(this.sessionTwoFromValues6, this.sessionTwoToValues6, value);
    }
    //this.selectAllSession2From(value);
  }

  setSessionToValues(sessionOneFrom: any, sessionTwoTo: any, value: string) {
    const index = sessionOneFrom.indexOf(value);
    sessionTwoTo = sessionTwoTo.filter((time, i) => {
      return i > index;
    });
  }


  onSubmit(buttonType) {
    this.submitted = true;
    this.availabilityForm.value.slots.forEach((slot, i) => {
      let weekDay = this.getWeekDays(i);

      if (slot.weekDaySession1From) {
        this.slotData[weekDay][0].start = moment(slot.weekDaySession1From, 'h:mm a').format('HH:mm:ss')
      }
      if (slot.weekDaySession1To) {
        this.slotData[weekDay][0].end = moment(slot.weekDaySession1To, 'h:mm a').format('HH:mm:ss')
      }
      if (slot.weekDaySession2From) {
        this.slotData[weekDay][1].start = moment(slot.weekDaySession2From, 'h:mm a').format('HH:mm:ss')
      }
      if (slot.weekDaySession2To) {
        this.slotData[weekDay][1].end = moment(slot.weekDaySession2To, 'h:mm a').format('HH:mm:ss')
      }
      if (!slot.weekDaySession1From && !slot.weekDaySession1To
        && !slot.weekDaySession2From && !slot.weekDaySession2To) {
        delete this.slotData[weekDay];
      }
    });
    console.log("this.slotData ", this.slotData)
    this.apiService.saveExpertFee(this.sixtyMinFee, this.fortyMinFee, this.twentyMinFee, this.expertId, this.isAdmin).subscribe(res => {
      this.respCodeForFee = res['code'];

      this.apiService.createExpertSlots(this.slotData, this.expertId, this.isAdmin).subscribe(res => {
        this.respCodeForSlots = res['code'];
        if (this.respCodeForFee == 1000 && this.respCodeForSlots == 1000) {
          this.spinnerFlag = false;
          if (this.isSignUp) {
            this.apiService.updateExpert(this.expertId, '4').subscribe(data => {
              if (data.code == '1000') {
                if (buttonType === 'next') {
                  this.route.navigate(['/expert/listing']);
                } else {
                  this.route.navigate(['/expert/dashboard/']);
                }
              }
            })
          } else {
            if (buttonType === 'next') {
              this.route.navigate(['/expert/listing']);
            } else {
              this.route.navigate(['/expert/dashboard/']);
            }
          }


        }
      });
    });
  }

  formatTimeArray(timeArray: any[]) {
    let finalArray = [];
    timeArray.forEach(time => {
      let newTime = this.createTimeFormat(time);
      finalArray.push(newTime);
    })
    return finalArray;
  }


  createTimeFormat(date: string) {
    let currentDate = moment(new Date()).format("YYYY-MM-DD");
    let currentDateTime = currentDate + "T" + date + "+05:30";
    return moment(currentDateTime).format('h:mm a');
  }


  buildSlots(weekdays: string[]): void {
    weekdays.forEach(element => {
      this.slotsForm.push(this.buildSlot());
    });
  }


  buildSlot() {
    return this.fb.group({
      'weekDaySession1From': [''],
      'weekDaySession1To': [''],
      'weekDaySession2To': [''],
      'weekDaySession2From': [''],
    })
  }

  back() {
    this.route.navigate(['/expert/services']);
  }

  fetchSlots() {
    this.apiService.fetchSlots(this.expertId).subscribe(res => {
      let slots = res.slots;
      console.log("response " , slots)
      for (let day in slots) {
        if (day == 'Mon') {
          this.assignValueToForm(slots, day, 0);
        }

        if (day == 'Tue') {
          this.assignValueToForm(slots, day, 1);
        }

        if (day == 'Wed') {
          this.assignValueToForm(slots, day, 2);
        }

        if (day == 'Thu') {
          this.assignValueToForm(slots, day, 3);
        }

        if (day == 'Fri') {
          this.assignValueToForm(slots, day, 4);
        }

        if (day == 'Sat') {
          this.assignValueToForm(slots, day, 5);
        }

        if (day == 'Sun') {
          this.assignValueToForm(slots, day, 6);
        }
      }
    })
  }

  assignValueToForm(slots: any[], day: string, index: number) {
    this.slotsForm.controls[index].patchValue({
      // 'weekDaySession1From': slots[day][0].start != "00:00:00" ? this.createTimeFormat(slots[day][0].start) : "",
      // 'weekDaySession1To': slots[day][0].end != "00:00:00" ? this.createTimeFormat(slots[day][0].end) : "",
      // 'weekDaySession2From': slots[day][1].start != "00:00:00" ? this.createTimeFormat(slots[day][1].start) : "",
      // 'weekDaySession2To': slots[day][1].end != "00:00:00" ? this.createTimeFormat(slots[day][1].end) : ""

      'weekDaySession1From':  this.createTimeFormat(slots[day][0].start) ,
      'weekDaySession1To':  this.createTimeFormat(slots[day][0].end) ,
      'weekDaySession2From':  this.createTimeFormat(slots[day][1].start) ,
      'weekDaySession2To':  this.createTimeFormat(slots[day][1].end)

      
    })
  }

  onChangeFee(value) {
    this.guidanceFeeChanged = true;
    this.sixtyMinFee = value;
    this.fortyMinFee = (value * 40) / 60;
    let fortyMinFee = this.fortyMinFee * (10 / 100);
    this.fortyMinFee = fortyMinFee + this.fortyMinFee;
    this.twentyMinFee = (value * 20) / 60;
    let twentyMinFee = this.twentyMinFee * (25 / 100);
    this.twentyMinFee = twentyMinFee + this.twentyMinFee;
  }


  fetchFeeById() {
    this.apiService.fetchFeeById(this.expertId).subscribe(res => {
      this.feeResponse = res['fees'];
      if (this.feeResponse) {
        this.sixtyMinFee = this.feeResponse[0].sixty;
        this.fortyMinFee = this.feeResponse[0].forty;
        this.twentyMinFee = this.feeResponse[0].twenty;
        this.guidanceFees = this.feeResponse[0].sixty;
      }
      console.log("res fee = " + this.sixtyMinFee + "" + this.fortyMinFee + "" + this.twentyMinFee)
    })
  }
}
