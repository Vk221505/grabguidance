import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { searchCriteria } from 'src/app/models/expert.service.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  experts: any[] = [];
  filteredExperts: any[] = []
  totalExpertCount: number = 0;
  start: number;
  end: any;
  initialLoggingState = localStorage.getItem('isLoggedIn');
  classes: any[] = [
    {
      "class": "8th",
      "id_class": 1,
      "class_name": "\r\n8th\r\n"
    },
    {
      "class": "9th",
      "id_class": 2,
      "class_name": "\r\n9th\r\n",
    },
    {
      "class": "10th",
      "id_class": 3,
      "class_name": "\r\n10th\r\n",
    },
    {
      "class": "11th",
      "id_class": 4,
      "class_name": "\r\n11th\r\n",
    },
    {
      "class": "12th",
      "id_class": 5,
      "class_name": "\r\n12th\r\n",
    },
    {
      "class": "BBA",
      "id_class": 6,
      "class_name": "\r\nBBA\r\n",
    },
    {
      "class": "BBA",
      "id_class": 7,
      "class_name": "\r\nB.Com\r\n",
    },
    {
      "class": "BBS",
      "id_class": 8,
      "class_name": "\r\nBBS\r\n"
    },
    {
      "class": "BMS",
      "id_class": 9,
      "class_name": "\r\nBMS\r\n",
    },
    {
      "class": "BBE",
      "id_class": 10,
      "class_name": "\r\nBBE\r\n",
    },
    {
      "class": "BCA",
      "id_class": 11,
      "class_name": "\r\nBCA\r\n",
    },
    {
      "class": "BA",
      "id_class": 12,
      "class_name": "\r\nBA\r\n",
    },
    {
      "class": "MA",
      "id_class": 13,
      "class_name": "\r\nMA\r\n",
    },
    {
      "class": "MBA",
      "id_class": 14,
      "class_name": "\r\nMBA\r\n",
    },
    {
      "class": "M.Com",
      "id_class": 15,
      "class_name": "\r\nM.Com\r\n",
    },
    {
      "class": "PGDM",
      "id_class": 16,
      "class_name": "\r\nPGDM\r\n",
    },
    {
      "class": "MCA",
      "id_class": 17,
      "class_name": "\r\nMCA\r\n",
    }
  ]
  acadmicSubject: any[] = [
    {
      "id_subject": 1,
      "subject_name": "Science"
    },
    {
      "id_subject": 2,
      "subject_name": "Maths"
    },
    {
      "id_subject": 3,
      "subject_name": "Social Science"
    },
    {
      "id_subject": 4,
      "subject_name": "Physics"
    },
    {
      "id_subject": 5,
      "subject_name": "Chemistry"
    },
    {
      "id_subject": 6,
      "subject_name": "Biology"
    },
    {
      "id_subject": 7,
      "subject_name": "Economics"
    },
    {
      "id_subject": 8,
      "subject_name": "Business Studies"
    },
    {
      "id_subject": 9,
      "subject_name": "Accounts"
    },
    {
      "id_subject": 10,
      "subject_name": "Quants & Statistics"
    },
    {
      "id_subject": 11,
      "subject_name": "Business Economics"
    },
    {
      "id_subject": 12,
      "subject_name": "Taxation"
    },
    {
      "id_subject": 13,
      "subject_name": "Marketing Management"
    },
    {
      "id_subject": 14,
      "subject_name": "Digital Marketing"
    },
    {
      "id_subject": 15,
      "subject_name": "Sales & Distribution Management"
    },
    {
      "id_subject": 16,
      "subject_name": "Human Resource Management"
    },
    {
      "id_subject": 17,
      "subject_name": "Organisation Behaviour"
    },
    {
      "id_subject": 18,
      "subject_name": "System Analysis & Design"
    },
    {
      "id_subject": 19,
      "subject_name": "Database Management System"
    },
    {
      "id_subject": 20,
      "subject_name": "\r\nProduction & Operations Management\r\n"
    },
    {
      "id_subject": 21,
      "subject_name": "Supply Chain Management"
    },
    {
      "id_subject": 22,
      "subject_name": "Financial Management"
    },
    {
      "id_subject": 23,
      "subject_name": "Financial Accounting"
    },
    {
      "id_subject": 24,
      "subject_name": "Management Accounting"
    },
    {
      "id_subject": 25,
      "subject_name": "Programming and Languages"
    },
    {
      "id_subject": 26,
      "subject_name": "Business Communication"
    }
  ];
  careerSubject: any[] = [

    {
      "id_guidance": 1,
      "guidance_name": "Stream Selection"
    },
    {
      "id_guidance": 2,
      "guidance_name": "Course Selection"
    },
    {
      "id_guidance": 3,
      "guidance_name": "College Selection"
    },
    {
      "id_guidance": 4,
      "guidance_name": "School Life Issues"
    },
    {
      "id_guidance": 5,
      "guidance_name": "Interview Preparation"
    },
    {
      "id_guidance": 7,
      "guidance_name": "Internship Selection"
    },
    {
      "id_guidance": 8,
      "guidance_name": "Job Selection"
    },
    {
      "id_guidance": 9,
      "guidance_name": "Personality Development"
    },
    {
      "id_guidance": 10,
      "guidance_name": "Communication Skills"
    },
    {
      "id_guidance": 11,
      "guidance_name": "Entrepreneurship"
    },
    {
      "id_guidance": 12,
      "guidance_name": "Digital Marketing"
    },
    {
      "id_guidance": 13,
      "guidance_name": "Study Abroad"
    }

  ]


  isUserLoogedIn = new BehaviorSubject<string>(this.initialLoggingState);
  isUserLoggedInSub$ = this.isUserLoogedIn.asObservable();

  searchCriteria = new BehaviorSubject<searchCriteria>(null);
  searchCriteriaSub$ = this.searchCriteria.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      let classData = sessionStorage.getItem('class');
      let roleData = JSON.parse(sessionStorage.getItem('roleObj'));
      let searchCriteria = {
        class: classData,
        roleObj: roleData
      }
      this.setSearchCiteria(searchCriteria);
    }
  }

  getReviewForSlider() {
    return [
      {
        'name': 'Amit Jain',
        'class': '8th Class Student',
        'comment': 'I had a crisp online session for 20 mins and got solution for three of my maths doubts so easily.'
      },
      {
        'name': 'Rahul Saxena',
        'class': 'B.Com. Student',
        'comment': 'I got a brilliant guide for accounts with whom I take ongoing  weekly sessions for conceptual clarity on various topics as per my requirements.'
      },
      {
        'name': 'Rajat Kumar',
        'class': ' MBA Student',
        'comment': 'I am delighted to get a superb mentor though this platform who constantly guide me through at various stages.'
      },
    ]
  }


  getWeekDays(): string[] {
    return [
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ];
  }

  getSlotData(): any {
    return {
      "Mon": [
        {
          "start": "",
          "end": ""
        },
        {
          "start": "",
          "end": ""
        }
      ],
      "Tue": [
        {
          "start": "",
          "end": ""
        },
        {
          "start": "",
          "end": ""
        }
      ],
      "Wed": [
        {
          "start": "",
          "end": ""
        },
        {
          "start": "",
          "end": ""
        }
      ],
      "Thu": [
        {
          "start": "",
          "end": ""
        },
        {
          "start": "",
          "end": ""
        }
      ],
      "Fri": [
        {
          "start": "",
          "end": ""
        },
        {
          "start": "",
          "end": ""
        }
      ],
      "Sat": [
        {
          "start": "",
          "end": ""
        },
        {
          "start": "",
          "end": ""
        }
      ],
      "Sun": [
        {
          "start": "",
          "end": ""
        },
        {
          "start": "",
          "end": ""
        }
      ],
    };
  }

  getGender() {
    return [
      { "id_gender": 0, "gender_name": "All" },
      { "id_gender": 1, "gender_name": "Male" },
      { "id_gender": 2, "gender_name": "Female" },
      { "id_gender": 3, "gender_name": "Others" },
    ]
  }

  getSessionOneFromValues() {
    return ['06:00:00', '07:00:00', '08:00:00', '09:00:00', '10:00:00', '11:00:00']
  }
  getSessionOneToValues() {
    return ['07:00:00', '08:00:00', '09:00:00', '10:00:00', '11:00:00', '12:00:00']
  }
  getSessionTwoFromValues() {
    return ['12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00', '18:00:00', '19:00:00', '20:00:00', '21:00:00', '22:00:00', '23:00:00',]
  }
  getSsessionTwoToValues() {
    return ['13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00', '18:00:00', '19:00:00', '20:00:00', '21:00:00', '22:00:00', '23:00:00', '24:00:00']
  }

  getTimeFrameData(): string[] {
    return [
      "00:00:00 - 01:00:00",
      '01:00:00 - 02:00:00',
      '02:00:00 - 03:00:00',
      '03:00:00 - 04:00:00',
      '04:00:00 - 05:00:00',
      '05:00:00 - 06:00:00',
      '06:00:00 - 07:00:00',
      '07:00:00 - 08:00:00',
      '08:00:00 - 09:00:00',
      '09:00:00 - 10:00:00',
      '10:00:00 - 11:00:00',
      '11:00:00 - 12:00:00',
      '13:00:00 - 14:00:00',
      '14:00:00 - 15:00:00',
      '15:00:00 - 16:00:00',
      '16:00:00 - 17:00:00',
      '17:00:00 - 18:00:00',
      '18:00:00 - 19:00:00',
      '19:00:00 - 20:00:00',
      '21:00:00 - 22:00:00',
      '22:00:00 - 23:00:00',
      '23:00:00 - 00:00:00',
    ]
  }

  getCountries() {
    return [
      {
        'role': 'Subject',
        'name': 'Math'
      },
      {
        'role': 'Subject',
        'name': 'Science'
      },
      {
        'role': 'Subject',
        'name': 'Social'
      },
      {
        'role': 'Subject',
        'name': 'Physics'
      },
      {
        'role': 'Subject',
        'name': 'Chemistry'
      },
      {
        'role': 'Expert',
        'name': 'Sunny 1'
      },
      {
        'role': 'Expert',
        'name': 'Sunny'
      },
      {
        'role': 'Expert',
        'name': 'Madhavan'
      },
      {
        'role': 'Expert',
        'name': 'Angie'
      }, ,
      {
        'role': 'Expert',
        'name': 'Vijaya'
      },
      {
        'role': 'Expert',
        'name': 'Dummy'
      }
    ];

  }

  getSortByOptions() {
    return [
      "None",
      "By Name",
      "Price - High To Low",
      "Price - Low To High",
      "By Rating",
      "Year Of Experience"
    ]
  }

  getPrizeFilter() {
    return [
      "All",
      "< 250",
      "250-500",
      "500-1000",
      "1000+"
    ]
  }

  getSpecialAccesebilityFilter() {
    return [
      "Everyone",
      "Only to Normal Users",
      "Speech Impairments",
      "Deaf",
      "Visual Impairments"
    ]
  }

  getLanguagesFilter() {
    return [
      "Any",
      "Hindi",
      "English",
      "Malayalam",
      "Punjabi",
      "Gujarati",
      "Tamil",
      "Bangla",
      "Telugu",
      "Oriya",
      "Lushai",
      "Marathi",
      "Konkani",
      "Khasi",
      "Kannada",
      "Nepali",
      "Manipuri",
      "Assamese",
      "Nissi"
    ]
  }

  getUserReason() {
    return [
      'Session booked by mistake',
      'Wrong time selected while booking',
      'Wrong expert selected for the session',
      'wrong tenture selected for the session',
      'Any other'
    ]
  }

  getExpertReason() {
    return [
      'Have another grab Gauidance session at that time',
      'Not available due to emergency',
      'Forgot to update my availability and not available at that time',
      "Don't know the doubts/concept/agenda raised by the learner",
      "Any other"
    ]
  }

  getUserRescheduleText() {
    return "Only select if changing n session is'nt an option.This might be uncomfortable for experts."
  }

  getUserCancelText() {
    return "We feel sad that you have come this far, your feedback will help us serve you better in future."
  }

  getExpertRescheduleText() {
    return "Only select if changing n session is'nt an option. Might be unportable for user and can lead for cancellation"
  }

  getExpertCancelText() {
    return "Only select if changing n session is'nt an option. User palenty may apply"
  }

  getSubjectData() {
    return [
      {
        "id_class": 1,
        "class_name": "\r\n8th\r\n",
        "academic": [
          {
            "id_subject": 1,
            "subject_name": "Science"
          },
          {
            "id_subject": 2,
            "subject_name": "Maths"
          },
          {
            "id_subject": 3,
            "subject_name": "Social Science"
          },
          {
            "id_subject": 4,
            "subject_name": "Physics"
          },
          {
            "id_subject": 5,
            "subject_name": "Chemistry"
          },
          {
            "id_subject": 6,
            "subject_name": "Biology"
          }
        ],
        "carrer": [
          {
            "id_guidance": 1,
            "guidance_name": "Stream Selection"
          },
          {
            "id_guidance": 9,
            "guidance_name": "Personality Development"
          },
          {
            "id_guidance": 10,
            "guidance_name": "Communication Skills"
          },
          {
            "id_guidance": 4,
            "guidance_name": "School Life Issues"
          }
        ]
      },
      {
        "id_class": 2,
        "class_name": "\r\n9th\r\n",
        "academic": [
          {
            "id_subject": 1,
            "subject_name": "Science"
          },
          {
            "id_subject": 2,
            "subject_name": "Maths"
          },
          {
            "id_subject": 3,
            "subject_name": "Social Science"
          },
          {
            "id_subject": 4,
            "subject_name": "Physics"
          },
          {
            "id_subject": 5,
            "subject_name": "Chemistry"
          },
          {
            "id_subject": 6,
            "subject_name": "Biology"
          }
        ],
        "carrer": [
          {
            "id_guidance": 1,
            "guidance_name": "Stream Selection"
          },
          {
            "id_guidance": 9,
            "guidance_name": "Personality Development"
          },
          {
            "id_guidance": 10,
            "guidance_name": "Communication Skills"
          },
          {
            "id_guidance": 4,
            "guidance_name": "School Life Issues"
          }
        ]
      },
      {
        "id_class": 3,
        "class_name": "\r\n10th\r\n",
        "academic": [
          {
            "id_subject": 1,
            "subject_name": "Science"
          },
          {
            "id_subject": 2,
            "subject_name": "Maths"
          },
          {
            "id_subject": 3,
            "subject_name": "Social Science"
          },
          {
            "id_subject": 4,
            "subject_name": "Physics"
          },
          {
            "id_subject": 5,
            "subject_name": "Chemistry"
          },
          {
            "id_subject": 6,
            "subject_name": "Biology"
          }
        ],
        "carrer": [
          {
            "id_guidance": 1,
            "guidance_name": "Stream Selection"
          },
          {
            "id_guidance": 9,
            "guidance_name": "Personality Development"
          },
          {
            "id_guidance": 10,
            "guidance_name": "Communication Skills"
          },
          {
            "id_guidance": 4,
            "guidance_name": "School Life Issues"
          }
        ]
      },
      {
        "id_class": 4,
        "class_name": "\r\n11th\r\n",
        "academic": [
          {
            "id_subject": 7,
            "subject_name": "Economics"
          },
          {
            "id_subject": 8,
            "subject_name": "Business Studies"
          },
          {
            "id_subject": 9,
            "subject_name": "Accounts"
          },
          {
            "id_subject": 2,
            "subject_name": "Maths"
          },
          {
            "id_subject": 4,
            "subject_name": "Physics"
          },
          {
            "id_subject": 5,
            "subject_name": "Chemistry"
          },
          {
            "id_subject": 6,
            "subject_name": "Biology"
          }
        ],
        "carrer": [
          {
            "id_guidance": 1,
            "guidance_name": "Stream Selection"
          },
          {
            "id_guidance": 9,
            "guidance_name": "Personality Development"
          },
          {
            "id_guidance": 10,
            "guidance_name": "Communication Skills"
          },
          {
            "id_guidance": 4,
            "guidance_name": "School Life Issues"
          },
          {
            "id_guidance": 2,
            "guidance_name": "Course Selection"
          },
          {
            "id_guidance": 3,
            "guidance_name": "College Selection"
          },
          {
            "id_guidance": 13,
            "guidance_name": "Study Abroad"
          }
        ]
      },
      {
        "id_class": 5,
        "class_name": "\r\n12th\r\n",
        "academic": [
          {
            "id_subject": 7,
            "subject_name": "Economics"
          },
          {
            "id_subject": 8,
            "subject_name": "Business Studies"
          },
          {
            "id_subject": 9,
            "subject_name": "Accounts"
          },
          {
            "id_subject": 2,
            "subject_name": "Maths"
          },
          {
            "id_subject": 4,
            "subject_name": "Physics"
          },
          {
            "id_subject": 5,
            "subject_name": "Chemistry"
          },
          {
            "id_subject": 6,
            "subject_name": "Biology"
          }
        ],
        "carrer": [
          {
            "id_guidance": 1,
            "guidance_name": "Stream Selection"
          },
          {
            "id_guidance": 9,
            "guidance_name": "Personality Development"
          },
          {
            "id_guidance": 10,
            "guidance_name": "Communication Skills"
          },
          {
            "id_guidance": 4,
            "guidance_name": "School Life Issues"
          },
          {
            "id_guidance": 2,
            "guidance_name": "Course Selection"
          },
          {
            "id_guidance": 3,
            "guidance_name": "College Selection"
          },
          {
            "id_guidance": 13,
            "guidance_name": "Study Abroad"
          }
        ]
      },
      {
        "id_class": 6,
        "class_name": "\r\nBBA\r\n",
        "academic": [
          {
            "id_subject": 13,
            "subject_name": "Marketing Management"
          },
          {
            "id_subject": 14,
            "subject_name": "Digital Marketing"
          },
          {
            "id_subject": 15,
            "subject_name": "Sales & Distribution Management"
          },
          {
            "id_subject": 16,
            "subject_name": "Human Resource Management"
          },
          {
            "id_subject": 17,
            "subject_name": "Organisation Behaviour"
          },
          {
            "id_subject": 20,
            "subject_name": "\r\nProduction & Operations Management\r\n"
          },
          {
            "id_subject": 11,
            "subject_name": "Business Economics"
          }
        ],
        "carrer": [
          {
            "id_guidance": 3,
            "guidance_name": "College Selection"
          },
          {
            "id_guidance": 5,
            "guidance_name": "Interview Preparation"
          },
          {
            "id_guidance": 9,
            "guidance_name": "Personality Development"
          },
          {
            "id_guidance": 10,
            "guidance_name": "Communication Skills"
          },
          {
            "id_guidance": 7,
            "guidance_name": "Internship Selection"
          },
          {
            "id_guidance": 8,
            "guidance_name": "Job Selection"
          },
          {
            "id_guidance": 11,
            "guidance_name": "Entrepreneurship"
          },
          {
            "id_guidance": 12,
            "guidance_name": "Digital Marketing"
          },
          {
            "id_guidance": 13,
            "guidance_name": "Study Abroad"
          }
        ]
      },
      {
        "id_class": 7,
        "class_name": "\r\nB.Com\r\n",
        "academic": [
          {
            "id_subject": 22,
            "subject_name": "Financial Management"
          },
          {
            "id_subject": 26,
            "subject_name": "Business Communication"
          },
          {
            "id_subject": 11,
            "subject_name": "Business Economics"
          },
          {
            "id_subject": 12,
            "subject_name": "Taxation"
          }
        ],
        "carrer": [
          {
            "id_guidance": 3,
            "guidance_name": "College Selection"
          },
          {
            "id_guidance": 5,
            "guidance_name": "Interview Preparation"
          },
          {
            "id_guidance": 9,
            "guidance_name": "Personality Development"
          },
          {
            "id_guidance": 10,
            "guidance_name": "Communication Skills"
          },
          {
            "id_guidance": 7,
            "guidance_name": "Internship Selection"
          },
          {
            "id_guidance": 8,
            "guidance_name": "Job Selection"
          },
          {
            "id_guidance": 11,
            "guidance_name": "Entrepreneurship"
          },
          {
            "id_guidance": 12,
            "guidance_name": "Digital Marketing"
          },
          {
            "id_guidance": 13,
            "guidance_name": "Study Abroad"
          }
        ]
      },
      {
        "id_class": 8,
        "class_name": "\r\nBBS\r\n",
        "academic": [
          {
            "id_subject": 26,
            "subject_name": "Business Communication"
          },
          {
            "id_subject": 24,
            "subject_name": "Management Accounting"
          },
          {
            "id_subject": 13,
            "subject_name": "Marketing Management"
          },
          {
            "id_subject": 17,
            "subject_name": "Organisation Behaviour"
          },
          {
            "id_subject": 16,
            "subject_name": "Human Resource Management"
          },
          {
            "id_subject": 22,
            "subject_name": "Financial Management"
          }
        ],
        "carrer": [
          {
            "id_guidance": 3,
            "guidance_name": "College Selection"
          },
          {
            "id_guidance": 5,
            "guidance_name": "Interview Preparation"
          },
          {
            "id_guidance": 9,
            "guidance_name": "Personality Development"
          },
          {
            "id_guidance": 10,
            "guidance_name": "Communication Skills"
          },
          {
            "id_guidance": 7,
            "guidance_name": "Internship Selection"
          },
          {
            "id_guidance": 8,
            "guidance_name": "Job Selection"
          },
          {
            "id_guidance": 11,
            "guidance_name": "Entrepreneurship"
          },
          {
            "id_guidance": 12,
            "guidance_name": "Digital Marketing"
          },
          {
            "id_guidance": 13,
            "guidance_name": "Study Abroad"
          }
        ]
      },
      {
        "id_class": 9,
        "class_name": "\r\nBMS\r\n",
        "academic": [
          {
            "id_subject": 26,
            "subject_name": "Business Communication"
          },
          {
            "id_subject": 24,
            "subject_name": "Management Accounting"
          },
          {
            "id_subject": 13,
            "subject_name": "Marketing Management"
          },
          {
            "id_subject": 17,
            "subject_name": "Organisation Behaviour"
          },
          {
            "id_subject": 16,
            "subject_name": "Human Resource Management"
          },
          {
            "id_subject": 22,
            "subject_name": "Financial Management"
          }
        ],
        "carrer": [
          {
            "id_guidance": 3,
            "guidance_name": "College Selection"
          },
          {
            "id_guidance": 5,
            "guidance_name": "Interview Preparation"
          },
          {
            "id_guidance": 9,
            "guidance_name": "Personality Development"
          },
          {
            "id_guidance": 10,
            "guidance_name": "Communication Skills"
          },
          {
            "id_guidance": 7,
            "guidance_name": "Internship Selection"
          },
          {
            "id_guidance": 8,
            "guidance_name": "Job Selection"
          },
          {
            "id_guidance": 11,
            "guidance_name": "Entrepreneurship"
          },
          {
            "id_guidance": 12,
            "guidance_name": "Digital Marketing"
          },
          {
            "id_guidance": 13,
            "guidance_name": "Study Abroad"
          }
        ]
      },
      {
        "id_class": 10,
        "class_name": "\r\nBBE\r\n",
        "academic": [
          {
            "id_subject": 11,
            "subject_name": "Business Economics"
          },
          {
            "id_subject": 26,
            "subject_name": "Business Communication"
          },
          {
            "id_subject": 23,
            "subject_name": "Financial Accounting"
          },
          {
            "id_subject": 22,
            "subject_name": "Financial Management"
          },
          {
            "id_subject": 13,
            "subject_name": "Marketing Management"
          },
          {
            "id_subject": 17,
            "subject_name": "Organisation Behaviour"
          }
        ],
        "carrer": [
          {
            "id_guidance": 3,
            "guidance_name": "College Selection"
          },
          {
            "id_guidance": 5,
            "guidance_name": "Interview Preparation"
          },
          {
            "id_guidance": 9,
            "guidance_name": "Personality Development"
          },
          {
            "id_guidance": 10,
            "guidance_name": "Communication Skills"
          },
          {
            "id_guidance": 7,
            "guidance_name": "Internship Selection"
          },
          {
            "id_guidance": 8,
            "guidance_name": "Job Selection"
          },
          {
            "id_guidance": 11,
            "guidance_name": "Entrepreneurship"
          },
          {
            "id_guidance": 12,
            "guidance_name": "Digital Marketing"
          },
          {
            "id_guidance": 13,
            "guidance_name": "Study Abroad"
          }
        ]
      },
      {
        "id_class": 11,
        "class_name": "\r\nBCA\r\n",
        "academic": [
          {
            "id_subject": 17,
            "subject_name": "Organisation Behaviour"
          },
          {
            "id_subject": 19,
            "subject_name": "Database Management System"
          },
          {
            "id_subject": 25,
            "subject_name": "Programming and Languages"
          },
          {
            "id_subject": 18,
            "subject_name": "System Analysis & Design"
          },
          {
            "id_subject": 23,
            "subject_name": "Financial Accounting"
          },
          {
            "id_subject": 22,
            "subject_name": "Financial Management"
          }
        ],
        "carrer": [
          {
            "id_guidance": 3,
            "guidance_name": "College Selection"
          },
          {
            "id_guidance": 5,
            "guidance_name": "Interview Preparation"
          },
          {
            "id_guidance": 9,
            "guidance_name": "Personality Development"
          },
          {
            "id_guidance": 10,
            "guidance_name": "Communication Skills"
          },
          {
            "id_guidance": 7,
            "guidance_name": "Internship Selection"
          },
          {
            "id_guidance": 8,
            "guidance_name": "Job Selection"
          },
          {
            "id_guidance": 11,
            "guidance_name": "Entrepreneurship"
          },
          {
            "id_guidance": 12,
            "guidance_name": "Digital Marketing"
          },
          {
            "id_guidance": 13,
            "guidance_name": "Study Abroad"
          }
        ]
      },
      {
        "id_class": 12,
        "class_name": "\r\nBA\r\n",
        "academic": [
          {
            "id_subject": 16,
            "subject_name": "Human Resource Management"
          },
          {
            "id_subject": 17,
            "subject_name": "Organisation Behaviour"
          },
          {
            "id_subject": 26,
            "subject_name": "Business Communication"
          },
          {
            "id_subject": 11,
            "subject_name": "Business Economics"
          },
          {
            "id_subject": 10,
            "subject_name": "Quants & Statistics"
          }
        ],
        "carrer": [
          {
            "id_guidance": 3,
            "guidance_name": "College Selection"
          },
          {
            "id_guidance": 5,
            "guidance_name": "Interview Preparation"
          },
          {
            "id_guidance": 9,
            "guidance_name": "Personality Development"
          },
          {
            "id_guidance": 10,
            "guidance_name": "Communication Skills"
          },
          {
            "id_guidance": 7,
            "guidance_name": "Internship Selection"
          },
          {
            "id_guidance": 8,
            "guidance_name": "Job Selection"
          },
          {
            "id_guidance": 11,
            "guidance_name": "Entrepreneurship"
          },
          {
            "id_guidance": 12,
            "guidance_name": "Digital Marketing"
          },
          {
            "id_guidance": 13,
            "guidance_name": "Study Abroad"
          }
        ]
      },
      {
        "id_class": 13,
        "class_name": "\r\nMA\r\n",
        "academic": [
          {
            "id_subject": 16,
            "subject_name": "Human Resource Management"
          },
          {
            "id_subject": 17,
            "subject_name": "Organisation Behaviour"
          },
          {
            "id_subject": 26,
            "subject_name": "Business Communication"
          },
          {
            "id_subject": 11,
            "subject_name": "Business Economics"
          },
          {
            "id_subject": 10,
            "subject_name": "Quants & Statistics"
          }
        ],
        "carrer": [
          {
            "id_guidance": 3,
            "guidance_name": "College Selection"
          },
          {
            "id_guidance": 5,
            "guidance_name": "Interview Preparation"
          },
          {
            "id_guidance": 9,
            "guidance_name": "Personality Development"
          },
          {
            "id_guidance": 10,
            "guidance_name": "Communication Skills"
          },
          {
            "id_guidance": 7,
            "guidance_name": "Internship Selection"
          },
          {
            "id_guidance": 8,
            "guidance_name": "Job Selection"
          },
          {
            "id_guidance": 11,
            "guidance_name": "Entrepreneurship"
          },
          {
            "id_guidance": 12,
            "guidance_name": "Digital Marketing"
          },
          {
            "id_guidance": 13,
            "guidance_name": "Study Abroad"
          }
        ]
      },
      {
        "id_class": 14,
        "class_name": "\r\nMBA\r\n",
        "academic": [
          {
            "id_subject": 16,
            "subject_name": "Human Resource Management"
          },
          {
            "id_subject": 17,
            "subject_name": "Organisation Behaviour"
          },
          {
            "id_subject": 26,
            "subject_name": "Business Communication"
          },
          {
            "id_subject": 12,
            "subject_name": "Taxation"
          },
          {
            "id_subject": 13,
            "subject_name": "Marketing Management"
          },
          {
            "id_subject": 22,
            "subject_name": "Financial Management"
          },
          {
            "id_subject": 20,
            "subject_name": "\r\nProduction & Operations Management\r\n"
          },
          {
            "id_subject": 23,
            "subject_name": "Financial Accounting"
          },
          {
            "id_subject": 11,
            "subject_name": "Business Economics"
          }
        ],
        "carrer": [
          {
            "id_guidance": 3,
            "guidance_name": "College Selection"
          },
          {
            "id_guidance": 5,
            "guidance_name": "Interview Preparation"
          },
          {
            "id_guidance": 9,
            "guidance_name": "Personality Development"
          },
          {
            "id_guidance": 10,
            "guidance_name": "Communication Skills"
          },
          {
            "id_guidance": 7,
            "guidance_name": "Internship Selection"
          },
          {
            "id_guidance": 8,
            "guidance_name": "Job Selection"
          },
          {
            "id_guidance": 11,
            "guidance_name": "Entrepreneurship"
          },
          {
            "id_guidance": 12,
            "guidance_name": "Digital Marketing"
          },
          {
            "id_guidance": 13,
            "guidance_name": "Study Abroad"
          }
        ]
      },
      {
        "id_class": 15,
        "class_name": "\r\nM.Com\r\n",
        "academic": [
          {
            "id_subject": 17,
            "subject_name": "Organisation Behaviour"
          },
          {
            "id_subject": 22,
            "subject_name": "Financial Management"
          },
          {
            "id_subject": 24,
            "subject_name": "Management Accounting"
          },
          {
            "id_subject": 16,
            "subject_name": "Human Resource Management"
          },
          {
            "id_subject": 13,
            "subject_name": "Marketing Management"
          }
        ],
        "carrer": [
          {
            "id_guidance": 3,
            "guidance_name": "College Selection"
          },
          {
            "id_guidance": 5,
            "guidance_name": "Interview Preparation"
          },
          {
            "id_guidance": 9,
            "guidance_name": "Personality Development"
          },
          {
            "id_guidance": 10,
            "guidance_name": "Communication Skills"
          },
          {
            "id_guidance": 7,
            "guidance_name": "Internship Selection"
          },
          {
            "id_guidance": 8,
            "guidance_name": "Job Selection"
          },
          {
            "id_guidance": 11,
            "guidance_name": "Entrepreneurship"
          },
          {
            "id_guidance": 12,
            "guidance_name": "Digital Marketing"
          },
          {
            "id_guidance": 13,
            "guidance_name": "Study Abroad"
          }
        ]
      },
      {
        "id_class": 16,
        "class_name": "\r\nPGDM\r\n",
        "academic": [
          {
            "id_subject": 17,
            "subject_name": "Organisation Behaviour"
          },
          {
            "id_subject": 26,
            "subject_name": "Business Communication"
          },
          {
            "id_subject": 20,
            "subject_name": "\r\nProduction & Operations Management\r\n"
          },
          {
            "id_subject": 22,
            "subject_name": "Financial Management"
          },
          {
            "id_subject": 13,
            "subject_name": "Marketing Management"
          },
          {
            "id_subject": 16,
            "subject_name": "Human Resource Management"
          },
          {
            "id_subject": 12,
            "subject_name": "Taxation"
          },
          {
            "id_subject": 15,
            "subject_name": "Sales & Distribution Management"
          },
          {
            "id_subject": 21,
            "subject_name": "Supply Chain Management"
          },
          {
            "id_subject": 14,
            "subject_name": "Digital Marketing"
          }
        ],
        "carrer": [
          {
            "id_guidance": 3,
            "guidance_name": "College Selection"
          },
          {
            "id_guidance": 5,
            "guidance_name": "Interview Preparation"
          },
          {
            "id_guidance": 9,
            "guidance_name": "Personality Development"
          },
          {
            "id_guidance": 10,
            "guidance_name": "Communication Skills"
          },
          {
            "id_guidance": 7,
            "guidance_name": "Internship Selection"
          },
          {
            "id_guidance": 8,
            "guidance_name": "Job Selection"
          },
          {
            "id_guidance": 11,
            "guidance_name": "Entrepreneurship"
          },
          {
            "id_guidance": 12,
            "guidance_name": "Digital Marketing"
          },
          {
            "id_guidance": 13,
            "guidance_name": "Study Abroad"
          }
        ]
      },
      {
        "id_class": 17,
        "class_name": "\r\nMCA\r\n",
        "academic": [
          {
            "id_subject": 17,
            "subject_name": "Organisation Behaviour"
          },
          {
            "id_subject": 19,
            "subject_name": "Database Management System"
          },
          {
            "id_subject": 18,
            "subject_name": "System Analysis & Design"
          },
          {
            "id_subject": 24,
            "subject_name": "Management Accounting"
          }
        ],
        "carrer": [
          {
            "id_guidance": 3,
            "guidance_name": "College Selection"
          },
          {
            "id_guidance": 5,
            "guidance_name": "Interview Preparation"
          },
          {
            "id_guidance": 9,
            "guidance_name": "Personality Development"
          },
          {
            "id_guidance": 10,
            "guidance_name": "Communication Skills"
          },
          {
            "id_guidance": 7,
            "guidance_name": "Internship Selection"
          },
          {
            "id_guidance": 8,
            "guidance_name": "Job Selection"
          },
          {
            "id_guidance": 11,
            "guidance_name": "Entrepreneurship"
          },
          {
            "id_guidance": 12,
            "guidance_name": "Digital Marketing"
          },
          {
            "id_guidance": 13,
            "guidance_name": "Study Abroad"
          }
        ]
      }
    ]
  }

  setUserLoggingStatus(status: any) {
    this.isUserLoogedIn.next(status);
  }

  setSearchCiteria(criteria: searchCriteria) {
    this.searchCriteria.next(criteria);
  }

  setInitailFilter() {
    this.filteredExperts = [];
  }

  setExpertList(data: any, loadType: string) {
    if ((this.filteredExperts.length == 0) && loadType == "initial") {
      this.experts = this.createNewExpert(data)
    }
    if ((this.filteredExperts.length > 0) && loadType == "loadmore") {
      this.experts = this.experts.concat(this.createNewExpert(data));
    }
    this.experts.sort((a, b) => (a.name > b.name) ? 1 :
      ((b.name > a.name) ? -1 : 0));
    this.filteredExperts = this.experts;
  }

  truncateExpert() {
    this.experts = [];
    this.filteredExperts = [];
  }

  setTotalexpertCount(totalCount: number) {
    this.totalExpertCount += totalCount;
  }

  getTotalExpertCount() {
    return this.totalExpertCount;
  }

  createNewExpert(data: any[]) {
    return data.map(expert => {
      let language = expert.language.split(', ');
      let sign = expert.sign.split(', ');
      let ratePerSession = +expert.ratePerSession;
      return { ...expert, language, sign, ratePerSession }
    })
  }

  getExpertList() {
    return this.filteredExperts;
  }

  filterTheExperts(priceFilter: string, language: string, accessibility: string, gender: any) {
    console.log(priceFilter, language, accessibility, gender);

    if (priceFilter != "All" && language == "Any" && accessibility == "Everyone" && gender == 0) {
      this.filteredExperts = this.filterByPrice(priceFilter);
    }

    if (priceFilter != "All" && language != "Any" && accessibility == "Everyone" && gender == 0) {
      let expertsByPrice = this.filterByPrice(priceFilter);
      this.filteredExperts = expertsByPrice.filter(expert => {
        return expert.language.indexOf(language) != -1;
      })
    }

    if (priceFilter != "All" && language != "Any" && accessibility != "Everyone" && gender == 0) {
      let expertsByPrice = this.filterByPrice(priceFilter);
      this.filteredExperts = expertsByPrice.filter(expert => {
        return (expert.language.indexOf(language) != -1 && expert.sign.indexOf(accessibility) != -1);
      })
    }

    if (priceFilter != "All" && language != "Any" && accessibility != "Everyone" && gender != 0) {
      let expertsByPrice = this.filterByPrice(priceFilter);
      this.filteredExperts = expertsByPrice.filter(expert => {
        return (expert.language.indexOf(language) != -1 &&
          expert.sign.indexOf(accessibility) != -1 &&
          expert.gender == gender)
      })
    }

    if (priceFilter != "All" && language == "Any" && accessibility != "Everyone" && gender == 0) {
      let expertsByPrice = this.filterByPrice(priceFilter);
      this.filteredExperts = expertsByPrice.filter(expert => {
        return (expert.sign.indexOf(accessibility) != -1)
      })
    }

    if (priceFilter != "All" && language == "Any" && accessibility == "Everyone" && gender != 0) {
      let expertsByPrice = this.filterByPrice(priceFilter);
      this.filteredExperts = expertsByPrice.filter(expert => {
        return expert.gender == gender;
      })
    }

    if (priceFilter != "All" && language != "Any" && accessibility == "Everyone" && gender != 0) {
      let expertsByPrice = this.filterByPrice(priceFilter);
      this.filteredExperts = expertsByPrice.filter(expert => {
        return (expert.gender == gender && expert.language.indexOf(language) != -1)
      })
    }

    if (priceFilter != "All" && language == "Any" && accessibility != "Everyone" && gender != 0) {
      let expertsByPrice = this.filterByPrice(priceFilter);
      this.filteredExperts = expertsByPrice.filter(expert => {
        return (expert.gender == gender && expert.language.indexOf(language) != -1)
      })
    }

    if (priceFilter == "All" && language != "Any" && accessibility == "Everyone" && gender == 0) {
      this.filteredExperts = this.experts.filter(expert => {
        return (expert.language.indexOf(language) != -1)
      })
    }

    if (priceFilter == "All" && language != "Any" && accessibility != "Everyone" && gender == 0) {
      this.filteredExperts = this.experts.filter(expert => {
        return (expert.language.indexOf(language) != -1 && expert.sign.indexOf(accessibility) != -1)
      })

    }

    if (priceFilter == "All" && language != "Any" && accessibility != "Everyone" && gender != 0) {
      this.filteredExperts = this.experts.filter(expert => {
        return (expert.language.indexOf(language) != -1 &&
          expert.sign.indexOf(accessibility) != -1 &&
          expert.gender == gender)
      })
    }

    if (priceFilter == "All" && language != "Any" && accessibility == "Everyone" && gender != 0) {
      this.filteredExperts = this.experts.filter(expert => {
        return (expert.language.indexOf(language) != -1 &&
          expert.gender == gender)
      })
    }

    if (priceFilter == "All" && language == "Any" && accessibility != "Everyone" && gender == 0) {
      this.filteredExperts = this.experts.filter(expert => {
        return (expert.sign.indexOf(accessibility) != -1)
      })

    }

    if (priceFilter == "All" && language == "Any" && accessibility != "Everyone" && gender != 0) {
      this.filteredExperts = this.experts.filter(expert => {
        return (expert.sign.indexOf(accessibility) != -1 &&
          expert.gender == gender)
      })
    }

    if (priceFilter == "All" && language == "Any" && accessibility == "Everyone" && gender != 0) {
      this.filteredExperts = this.experts.filter(expert => {
        return (expert.gender == gender)
      })
    }

    if (priceFilter == "All" && language == "Any" && accessibility == "Everyone" && gender == 0) {
      this.filteredExperts = this.experts;
    }
  }


  filterByPrice(priceFilter: string) {
    let filterByPriceExperts = [];
    if (priceFilter == "< 250") {
      filterByPriceExperts = this.experts.filter(expert => {
        return expert.ratePerSession < 250
      })
    }

    if (priceFilter == "250-500") {
      filterByPriceExperts = this.experts.filter(expert => {
        return (expert.ratePerSession >= 250 && expert.ratePerSession <= 500)
      })
    }

    if (priceFilter == "500-1000") {
      filterByPriceExperts = this.experts.filter(expert => {
        return (expert.ratePerSession > 500 && expert.ratePerSession <= 1000)
      })
    }

    if (priceFilter == "1000+") {
      filterByPriceExperts = this.experts.filter(expert => {
        return (expert.ratePerSession > 1000)
      })
    }
    return filterByPriceExperts;
  }

}
