export interface IUser {
  id: number;
  email: string;
  nickname: string;
  avatar: string;
  is_mentor: boolean;
  tags: number[];
  phone?: string;
}
