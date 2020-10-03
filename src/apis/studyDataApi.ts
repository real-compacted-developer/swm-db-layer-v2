import express from 'express';
import { body } from 'express-validator';
import ERROR_CODE from '../constants/errorCode';
import checkValidation from '../middlewares/validator';
import studyDataModel from '../database/models/studyDataModel';
import studyGroupModel from '../database/models/studyGroupModel';

const router = express.Router();

router.get('/', async (req, res) => {
  const data = await studyDataModel.find();
  res.status(200).json({
    success: true,
    data
  });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const data = await studyDataModel.findOne({
    id
  });

  if (!data) {
    res.status(404).json({
      success: false,
      message: ERROR_CODE.STUDY_DATA_NOT_FOUND
    });
    return;
  }

  res.status(200).json({
    success: true,
    data
  });
});

router.get('/bystudy/:id', async (req, res) => {
  const { id } = req.params;
  const data = await studyDataModel.find({
    studyGroupId: id
  });

  if (!data) {
    res.status(404).json({
      success: false,
      message: ERROR_CODE.STUDY_DATA_NOT_FOUND
    });
    return;
  }

  res.status(200).json({
    success: true,
    data
  });
});

const createStudyDataValidator = [
  body('week').isNumeric(),
  body('date').isDate(),
  body('slideInfo').isArray(),
  body('studyGroupId').isString(),
  body('questions').isArray()
];
router.post('/', createStudyDataValidator, checkValidation, async (req: express.Request, res: express.Response) => {
  const { week, date, slideInfo, studyGroupId, questions } = req.body;

  const currentStudyGroup = await studyGroupModel.findOne({
    id: studyGroupId
  });
  if (!currentStudyGroup) {
    res.status(404).json({
      success: false,
      message: ERROR_CODE.STUDY_GROUP_NOT_FOUND
    });
    return;
  }

  const data = await studyDataModel.create({
    week,
    date,
    slideInfo,
    studyGroupId,
    questions
  });

  res.status(201).send({
    success: true,
    data
  });
});

router.put('/:id', createStudyDataValidator, checkValidation, async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { week, date, slideInfo, studyGroupId, questions } = req.body;

  const currentStudyGroup = await studyGroupModel.findOne({
    id: studyGroupId
  });
  if (!currentStudyGroup) {
    res.status(404).json({
      success: false,
      message: ERROR_CODE.STUDY_GROUP_NOT_FOUND
    });
    return;
  }

  const data = await studyDataModel.findOneAndUpdate({
    id
  }, {
    week,
    date,
    slideInfo,
    studyGroupId,
    questions
  }, { new: true });

  if (!data) {
    res.status(404).json({
      success: false,
      message: ERROR_CODE.STUDY_DATA_NOT_FOUND
    });
    return;
  }

  res.status(200).send({
    success: true,
    data
  });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const data = await studyDataModel.findOneAndDelete({
    id
  });

  if (!data) {
    res.status(404).json({
      success: false,
      message: ERROR_CODE.STUDY_DATA_NOT_FOUND
    });
    return;
  }

  res.status(200).json({
    success: true,
    data
  });
});

export default router;
