import { IAnswer } from '../interfaces/Answer';
import { IQuestion } from '../interfaces/Question';
import axios from 'axios';

const getQuestionsByUserId = (userId: number, callback: (questions: IQuestion[]) => void) => {
  axios({
    method: 'get',
    url: `/api/users/${userId}/questions`
  })
    .then((result) => {
      const { data } = result;
      callback(data);
    })
    .catch((err) => console.log(err));
};

const getAnswersByUserId = (userId: number, callback: (answers: IAnswer[]) => void) => {
  axios({
    method: 'get',
    url: `/api/users/${userId}/answers`,
  })
    .then((result) => {
      const { data } = result;
      callback(data);
    })
    .catch((err) => console.log(err));
};


export { getQuestionsByUserId, getAnswersByUserId };