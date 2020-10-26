import express from 'express';
import { body } from 'express-validator';
import ERROR_CODE from '../constants/errorCode';
import checkValidation from '../middlewares/validator';
import studyDataModel from '../database/models/studyDataModel';
import studyGroupModel from '../database/models/studyGroupModel';

const router = express.Router();

/**
 * @api {get} /studydata/
 * @apiName 모든 스터디데이터 가져오기
 * @apiGroup Database/StudyData
 *
 * @apiSuccess {Boolean} success 성공 여부
 * @apiSuccess {Array} data 모든 스터디데이터
 */
router.get('/', async (req, res) => {
  const data = await studyDataModel.find();
  res.status(200).json({
    success: true,
    data
  });
});

/**
 * @api {get} /studydata/:id
 * @apiName 스터디데이터 가져오기
 * @apiGroup Database/StudyData
 *
 * @apiParam {String} id 스터디데이터 ID
 *
 * @apiSuccess {Boolean} success 성공 여부
 * @apiSuccess {Object} data 스터디데이터
 *
 * @apiError STUDY_DATA_NOT_FOUND 존재하지 않는 스터디데이터
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const data = await studyDataModel.findOne({
    id
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
    data
  });
});

/**
 * @api {get} /studydata/bystudy/:id
 * @apiName 스터디그룹 ID로 스터디데이터 가져오기
 * @apiGroup Database/StudyData
 *
 * @apiParam {String} id 스터디그룹 ID
 *
 * @apiSuccess {Boolean} success 성공 여부
 * @apiSuccess {Array} data 스터디그룹에 속한 모든 스터디데이터
 */
router.get('/bystudy/:id', async (req, res) => {
  const { id } = req.params;
  const data = await studyDataModel.find({
    studyGroupId: id
  });

  res.status(200).json({
    success: true,
    data
  });
});

const createStudyDataValidator = [
  body('week').isNumeric(),
  body('date').isDate(),
  body('slideInfo').isArray(),
  body('studyGroupId').isString()
];
/**
 * @api {post} /studydata/
 * @apiName 스터디데이터 만들기
 * @apiGroup Database/StudyData
 *
 * @apiSuccess {Boolean} success 성공 여부
 * @apiSuccess {Object} data 추가된 스터디데이터
 *
 * @apiError STUDY_GROUP_NOT_FOUND 스터디그룹이 없는 경우
 */
router.post('/', createStudyDataValidator, checkValidation, async (req: express.Request, res: express.Response) => {
  const { week, date, slideInfo, studyGroupId } = req.body;

  const currentStudyGroup = await studyGroupModel.findOne({
    id: studyGroupId
  });
  if (!currentStudyGroup) {
    res.status(200).json({
      success: false,
      message: ERROR_CODE.STUDY_GROUP_NOT_FOUND
    });
    return;
  }

  const data = await studyDataModel.create({
    week,
    date,
    slideInfo,
    studyGroupId
  });

  res.status(201).send({
    success: true,
    data
  });
});

/**
 * @api {put} /studydata/:id
 * @apiName 스터디데이터 수정하기
 * @apiGroup Database/StudyData
 *
 * @apiParam {String} id 스터디데이터 ID
 *
 * @apiSuccess {Boolean} success 성공 여부
 * @apiSuccess {Object} data 수정된 스터디데이터
 *
 * @apiError STUDY_GROUP_NOT_FOUND 스터디그룹이 없는 경우
 * @apiError STUDY_DATA_NOT_FOUND 스터디데이터가 없는 경우
 */
router.put('/:id', createStudyDataValidator, checkValidation, async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { week, date, slideInfo, studyGroupId } = req.body;

  const currentStudyGroup = await studyGroupModel.findOne({
    id: studyGroupId
  });
  if (!currentStudyGroup) {
    res.status(200).json({
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
    studyGroupId
  }, { new: true });

  if (!data) {
    res.status(200).json({
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

/**
 * @api {delete} /studydata/:id
 * @apiName 스터디데이터 삭제하기
 * @apiGroup Database/StudyData
 *
 * @apiParam {String} id 스터디데이터 ID
 *
 * @apiSuccess {Boolean} success 성공 여부
 * @apiSuccess {Object} data 삭제된 스터디데이터
 *
 * @apiError STUDY_DATA_NOT_FOUND 스터디데이터가 없는 경우
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const data = await studyDataModel.findOneAndDelete({
    id
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
    data
  });
});

export default router;
