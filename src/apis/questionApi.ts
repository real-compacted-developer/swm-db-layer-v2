import express from 'express';
import { body } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import ERROR_CODE from '../constants/errorCode';
import checkValidation from '../middlewares/validator';
import studyDataModel from '../database/models/studyDataModel';

const router = express.Router();

/**
 * @api {get} /question/:studyDataId
 * @apiName 스터디데이터의 모든 질문 가져오기
 * @apiGroup Database/Question
 *
 * @apiParam {String} studyDataId 스터디데이터 ID
 *
 * @apiSuccess {Boolean} success 성공 여부
 * @apiSuccess {Array} data 질문 데이터
 *
 * @apiError STUDY_DATA_NOT_FOUND 해당 스터디데이터가 없는 경우
 */
router.get('/:studyDataId', async (req, res) => {
  const { studyDataId } = req.params;
  const data = await studyDataModel.findOne({
    id: studyDataId
  });

  if (!data) {
    res.status(200).json({
      success: false,
      message: ERROR_CODE.STUDY_DATA_NOT_FOUND
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: data.questions
  });
});

const createQuestionValidator = [
  body('user').isString(),
  body('title').isString(),
  body('content').isString(),
  body('slideOrder').isNumeric(),
  body('slideImageURL').isString(),
  body('studyDataId').isString()
];
/**
 * @api {post} /question/
 * @apiName 새로운 질문 만들기
 * @apiGroup Database/Question
 *
 * @apiSuccess {Boolean} success 성공 여부
 * @apiSuccess {Object} data 추가한 질문 데이터
 *
 * @apiError STUDY_DATA_NOT_FOUND 해당 스터디데이터가 없는 경우
 */
router.post('/', createQuestionValidator, checkValidation, async (req: express.Request, res: express.Response) => {
  const { title, content, user, slideOrder, slideImageURL, studyDataId } = req.body;

  const currentStudyData = await studyDataModel.findOne({
    id: studyDataId
  });

  if (!currentStudyData) {
    res.status(200).json({
      success: false,
      message: ERROR_CODE.STUDY_DATA_NOT_FOUND
    });
    return;
  }

  const currentQuestions = currentStudyData.questions;

  const newQuestion = {
    id: uuidv4(),
    user,
    title,
    content,
    slideOrder,
    slideImageURL,
    like: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  currentQuestions.push(newQuestion);

  await studyDataModel.findOneAndUpdate({
    id: studyDataId
  }, {
    questions: currentQuestions
  });

  res.status(201).send({
    success: true,
    data: newQuestion
  });
});

/**
 * @api {post} /question/like/:studyDataId/:questionId
 * @apiName 질문 좋아요 올리기
 * @apiGroup Database/Question
 *
 * @apiParam {String} studyDataId 스터디데이터 ID
 * @apiParam {String} questionId 질문 ID
 *
 * @apiSuccess {Boolean} success 성공 여부
 * @apiSuccess {Object} data 좋아요 변경한 질문 데이터
 *
 * @apiError STUDY_DATA_NOT_FOUND 해당 스터디데이터가 없는 경우
 * @apiError QUESTION_NOT_FOUND 해당 질문이 없는 경우
 */
router.post('/like/:studyDataId/:questionId', async (req, res) => {
  const { studyDataId, questionId } = req.params;

  const currentStudyData = await studyDataModel.findOne({
    id: studyDataId
  });

  if (!currentStudyData) {
    res.status(200).json({
      success: false,
      message: ERROR_CODE.STUDY_DATA_NOT_FOUND
    });
    return;
  }

  const question = currentStudyData.questions.find((item) => item.id === questionId);
  if (!question) {
    res.status(200).json({
      success: false,
      message: ERROR_CODE.QUESTION_NOT_FOUND
    });
    return;
  }

  question.like += 1;

  const data = await studyDataModel.findOneAndUpdate({
    id: studyDataId,
  }, {
    questions: currentStudyData.questions,
    updatedAt: new Date()
  }, { new: true });

  res.status(200).send({
    success: true,
    data
  });
});

/**
 * @api {delete} /question/like/:studyDataId/:questionId
 * @apiName 질문 좋아요 내리기
 * @apiGroup Database/Question
 *
 * @apiParam {String} studyDataId 스터디데이터 ID
 * @apiParam {String} questionId 질문 ID
 *
 * @apiSuccess {Boolean} success 성공 여부
 * @apiSuccess {Object} data 좋아요 변경한 질문 데이터
 *
 * @apiError STUDY_DATA_NOT_FOUND 해당 스터디데이터가 없는 경우
 * @apiError QUESTION_NOT_FOUND 해당 질문이 없는 경우
 * @apiError QUESTION_LIKE_NOT_MINUS 질문 좋아요를 음수로 바꾸려고 시도했을 때
 */
router.delete('/like/:studyDataId/:questionId', async (req, res) => {
  const { studyDataId, questionId } = req.params;

  const currentStudyData = await studyDataModel.findOne({
    id: studyDataId
  });

  if (!currentStudyData) {
    res.status(200).json({
      success: false,
      message: ERROR_CODE.STUDY_DATA_NOT_FOUND
    });
    return;
  }

  const question = currentStudyData.questions.find((item) => item.id === questionId);
  if (!question) {
    res.status(200).json({
      success: false,
      message: ERROR_CODE.QUESTION_NOT_FOUND
    });
    return;
  }

  if (question.like <= 0) {
    res.status(200).json({
      success: false,
      message: ERROR_CODE.QUESTION_LIKE_NOT_MINUS
    });
    return;
  }

  question.like -= 1;

  const data = await studyDataModel.findOneAndUpdate({
    id: studyDataId,
  }, {
    questions: currentStudyData.questions,
    updatedAt: new Date()
  }, { new: true });

  res.status(200).send({
    success: true,
    data
  });
});

/**
 * @api {delete} /question/:studyDataId/:questionId
 * @apiName 질문 삭제하기
 * @apiGroup Database/Question
 *
 * @apiParam {String} studyDataId 스터디데이터 ID
 * @apiParam {String} questionId 질문 ID
 *
 * @apiSuccess {Boolean} success 성공 여부
 * @apiSuccess {Object} data 삭제한 질문 데이터
 *
 * @apiError STUDY_DATA_NOT_FOUND 해당 스터디데이터가 없는 경우
 * @apiError QUESTION_NOT_FOUND 해당 질문이 없는 경우
 */
router.delete('/:studyDataId/:questionId', async (req, res) => {
  const { studyDataId, questionId } = req.params;

  const currentStudyData = await studyDataModel.findOne({
    id: studyDataId
  });

  if (!currentStudyData) {
    res.status(200).json({
      success: false,
      message: ERROR_CODE.STUDY_DATA_NOT_FOUND
    });
    return;
  }

  const questionIndex = currentStudyData.questions
    .findIndex((item) => item.id === questionId);

  if (questionIndex === -1) {
    res.status(200).json({
      success: false,
      message: ERROR_CODE.QUESTION_NOT_FOUND
    });
    return;
  }

  currentStudyData.questions.splice(questionIndex, 1);

  const data = await studyDataModel.findOneAndUpdate({
    id: studyDataId,
  }, {
    questions: currentStudyData.questions
  }, { new: true });

  res.status(200).send({
    success: true,
    data
  });
});

export default router;
