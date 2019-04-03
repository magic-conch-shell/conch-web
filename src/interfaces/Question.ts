enum ResultStatusTypes {
  NOT_SUBMITTED,
  SUBMITTED,
  ACCEPTED,
  ANSWERED,
  RESOLVED,
}

export interface IQuestion {
  content: string;
  created_at: string;
  id: number;
  solved: boolean;
  title: string;
  updated_at: string;
  user_id: number;
  tags: number[];
  status: ResultStatusTypes;
}
