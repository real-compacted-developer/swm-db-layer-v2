import express from 'express';
import { body } from 'express-validator';
import ERROR_CODE from '../constants/errorCode';
import checkValidation from '../middlewares/validator';
import userModel from '../database/models/userModel';

const router = express.Router();

router.get('/', async (req, res) => {
  const data = await userModel.find();
  res.status(200).json({
    success: true,
    data
  });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const data = await userModel.findById(id);

  if (!data) {
    res.status(404).json({
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
router.post('/', createUserValidator, checkValidation, async (req: express.Request, res: express.Response) => {
  const { provider, id, nickname, email, profileImage, isPremium } = req.body;

  const userId = `${provider}${id}`;

  const current = await userModel.findOne({
    email
  });
  if (current) {
    res.status(409).json({
      success: false,
      message: ERROR_CODE.USER_ALREADY_EXISTS
    });
    return;
  }

  const data = await userModel.create({
    _id: userId,
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
router.put('/:id', updateUserValidator, checkValidation, async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { nickname, email, profileImage, isPremium } = req.body;

  const data = await userModel.findById(id);
  if (!data) {
    res.status(404).json({
      success: false,
      message: ERROR_CODE.USER_NOT_FOUND
    });
    return;
  }

  await data.update({
    email,
    nickname,
    profileImage,
    isPremium
  });

  res.status(200).send({
    success: true,
    data
  });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const data = await userModel.findById(id);
  if (!data) {
    res.status(404).json({
      success: false,
      message: ERROR_CODE.USER_NOT_FOUND
    });
    return;
  }

  await data.remove();

  res.status(200).json({
    success: true,
    data
  });
});

export default router;
