import express from 'express';
import { body } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import ERROR_CODE from '../constants/errorCode';
import checkValidation from '../middlewares/validator';
import studyDataModel from '../database/models/studyDataModel';

const router = express.Router();

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

  currentQuestions.push({
    id: uuidv4(),
    user,
    title,
    content,
    slideOrder,
    slideImageURL,
    like: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const data = await studyDataModel.findOneAndUpdate({
    id: studyDataId
  }, {
    questions: currentQuestions
  }, { new: true });

  res.status(201).send({
    success: true,
    data
  });
});

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
