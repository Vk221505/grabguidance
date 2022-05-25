export class ClassService{
    id_class: string;
}
export class Reviews {
  id_expert: number;
  id_user: number;
  rating: string;
  review: string;
  user_name: string
}

export interface searchCriteria {
  class: any;
  roleObj: any;
}
