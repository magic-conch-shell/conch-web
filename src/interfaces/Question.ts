export type ResultStatusTypes =
  'NOT_SUBMITTED' |
  'SUBMITTED' |
  'ACCEPTED' |
  'ANSWERED' |
  'RESOLVED';

export interface IQuestion {
  content: string;
  created_at: string;
  id: number;
  solved: boolean;
  title: string;
  updated_at: string;
  user_id: number;
  tags: number[];
  question_status: IQuestionStatus;
}

export interface IQuestionStatus {
  created_at: string;
  id: number;
  mentor_id: number | null;
  question_id: number;
  status: ResultStatusTypes;
  updated_at: string;
}
