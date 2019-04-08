export enum AnswerStatusTypes {
  SELECTED = 'SELECTED',
  PASSED = 'PASSED'
}

export interface IAnswer {
  content: string;
  created_at: string;
  id: number;
  question_id: number;
  selected: boolean;
  updated_at: string;
  user_id: number;
}