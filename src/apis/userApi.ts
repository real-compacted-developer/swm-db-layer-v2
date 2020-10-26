import express from 'express';
import { body } from 'express-validator';
import ERROR_CODE from '../constants/errorCode';
import checkValidation from '../middlewares/validator';
import userModel from '../database/models/userModel';

const router = express.Router();

/**
 * @api {get} /user/
 * @apiName 모든 유저 가져오기
 * @apiGroup Database/User
 *
 * @apiSuccess {Boolean} success 성공 여부
 * @apiSuccess {Array} data 모든 유저 데이터
 */
router.get('/', async (req, res) => {
  const data = await userModel.find();
  res.status(200).json({
    success: true,
    data
  });
});

/**
 * @api {get} /user/:id
 * @apiName 유저 가져오기
 * @apiGroup Database/User
 *
 * @apiParam {String} id 유저 ID
 *
 * @apiSuccess {Boolean} success 성공 여부
 * @apiSuccess {Object} data 해당 id 유저 데이터
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const data = await userModel.findOne({
    id
  });

  if (!data) {
    res.status(200).json({
      success: false,
      message: ERROR_CODE.USER_NOT_FOUND
    });
    return;
  }

  res.status(200).json({
    success: true,
    data
  });
});

const createUserValidator = [
  body('provider').isString(),
  body('id').isString(),
  body('nickname').isString(),
  body('email').isString(),
  body('profileImage').isString(),
  body('isPremium').isBoolean()
];
/**
 * @api {post} /user/
 * @apiName 유저 추가하기
 * @apiGroup Database/User
 *
 * @apiSuccess {Boolean} success 성공 여부
 * @apiSuccess {Object} data 추가된 유저 데이터
 *
 * @apiError USER_ALREADY_EXISTS 해당 이메일 유저가 이미 존재하는 경우
 */
router.post('/', createUserValidator, checkValidation, async (req: express.Request, res: express.Response) => {
  const { provider, id, nickname, email, profileImage, isPremium } = req.body;

  const userId = `${provider}${id}`;

  const current = await userModel.findOne({
    email
  });
  if (current) {
    res.status(200).json({
      success: false,
      message: ERROR_CODE.USER_ALREADY_EXISTS
    });
    return;
  }

  const data = await userModel.create({
    id: userId,
    nickname,
    email,
    profileImage,
    isPremium
  });

  res.status(201).send({
    success: true,
    data
  });
});

const updateUserValidator = createUserValidator.slice(2);
/**
 * @api {put} /user/:id
 * @apiName 유저 정보 수정하기
 * @apiGroup Database/User
 *
 * @apiParam {String} id 유저 ID
 *
 * @apiSuccess {Boolean} success 성공 여부
 * @apiSuccess {Object} data 추가된 유저 데이터
 *
 * @apiError USER_NOT_FOUND 해당 id의 유저가 없는 경우
 */
router.put('/:id', updateUserValidator, checkValidation, async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { nickname, email, profileImage, isPremium } = req.body;

  const data = await userModel.findOneAndUpdate({
    id
  }, {
    email,
    nickname,
    profileImage,
    isPremium
  }, { new: true });

  if (!data) {
    res.status(200).json({
      success: false,
      message: ERROR_CODE.USER_NOT_FOUND
    });
    return;
  }

  res.status(200).send({
    success: true,
    data
  });
});

/**
 * @api {delete} /user/:id
 * @apiName 유저 삭제하기
 * @apiGroup Database/User
 *
 * @apiParam {String} id 유저 ID
 *
 * @apiSuccess {Boolean} success 성공 여부
 * @apiSuccess {Object} data 삭제된 유저 데이터
 *
 * @apiError USER_NOT_FOUND 해당 id의 유저가 없는 경우
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const data = await userModel.findOneAndDelete({
    id
  });

  if (!data) {
    res.status(200).json({
      success: false,
      message: ERROR_CODE.USER_NOT_FOUND
    });
    return;
  }

  res.status(200).json({
    success: true,
    data
  });
});

export default router;
