export interface IUser {
  id: number;
  email: string;
  nickname: string;
  avatar_url: string;
  is_mentor: boolean;
  tags: number[];
  phone?: string;
}
