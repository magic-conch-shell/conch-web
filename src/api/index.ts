import axios, { CancelTokenSource } from 'axios';

import { IAnswer } from '../interfaces/Answer';
import { IQuestion } from '../interfaces/Question';

const getQuestionsByUserId = (userId: number, callback: (questions: IQuestion[]) => void) => {
  console.log('[getQuestionsByUserId]');
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
  console.log('[getAnswersByUserId]');
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

const getQuestionByQuestionId = (questionId: number, callback: (question: IQuestion) => void, signal?: CancelTokenSource) => {
  console.log('[getQuestionByQuestionId]');
  axios({
    method: 'get',
    url: `/api/questions/${questionId}`,
    cancelToken: signal && signal.token
  })
    .then((result) => {
      const { data } = result;
      callback(data);
    })
    .catch((err) => console.log(err));
};

const getAnswersByQuestionId = (questionId: number, callback: (answers: IAnswer[]) => void) => {
  console.log('[getAnswersByQuestionId]');
  axios({
    method: 'get',
    url: `/api/questions/${questionId}/answers`
  })
    .then((result) => {
      const { data } = result;
      callback(data);
    })
    .catch((err) => console.log(err));
};


export { getQuestionsByUserId, getAnswersByUserId, getQuestionByQuestionId, getAnswersByQuestionId };