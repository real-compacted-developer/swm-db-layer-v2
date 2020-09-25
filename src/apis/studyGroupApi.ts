import express from 'express';
import { body } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import ERROR_CODE from '../constants/errorCode';
import checkValidation from '../middlewares/validator';
import studyGroupModel from '../database/models/studyGroupModel';

const router = express.Router();

router.get('/', async (req, res) => {
  const data = await studyGroupModel.find();
  res.status(200).json({
    success: true,
    data
  });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const data = await studyGroupModel.findById(id);

  if (!data) {
    res.status(404).json({
      success: false,
      message: ERROR_CODE.STUDY_GROUP_NOT_FOUND
    });
    return;
  }

  res.status(200).json({
    success: true,
    data
  });
});

const createStudyGroupValidator = [
  body('title').isString(),
  body('category').isString(),
  body('password').isString(),
  body('salt').isString(),
  body('maxPeople').isNumeric(),
  body('isPremium').isBoolean()
];
router.post('/', createStudyGroupValidator, checkValidation, async (req: express.Request, res: express.Response) => {
  const { title, category, password, salt, maxPeople, isPremium } = req.body;

  const data = await studyGroupModel.create({
    _id: uuidv4(),
    title,
    category,
    password,
    salt,
    maxPeople,
    isPremium,
    people: []
  });

  res.status(201).send({
    success: true,
    data
  });
});

const updateStudyGroupValidator = [
  ...createStudyGroupValidator
];
router.put('/:id', updateStudyGroupValidator, checkValidation, async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { title, category, password, salt, limitCount, isPremium } = req.body;

  const data = await studyGroupModel.findById(id);
  if (!data) {
    res.status(404).json({
      success: false,
      message: ERROR_CODE.STUDY_GROUP_NOT_FOUND
    });
    return;
  }

  await data.update({
    title,
    category,
    password,
    salt,
    limitCount,
    isPremium
  });

  res.status(200).send({
    success: true,
    data
  });
});

const peopleValidator = [
  body('userId').isString()
];
router.post('/people/:id', peopleValidator, checkValidation, async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { userId } = req.body;

  const data = await studyGroupModel.findById(id);
  if (!data) {
    res.status(404).json({
      success: false,
      message: ERROR_CODE.STUDY_GROUP_NOT_FOUND
    });
    return;
  }

  const { people } = data;
  people.push(userId);

  await data.update({
    people
  });

  res.status(200).json({
    success: true,
    data
  });
});

router.delete('/people/:id', peopleValidator, checkValidation, async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { userId } = req.body;

  const data = await studyGroupModel.findById(id);
  if (!data) {
    res.status(404).json({
      success: false,
      message: ERROR_CODE.STUDY_GROUP_NOT_FOUND
    });
    return;
  }

  const { people } = data;
  const deletedIndex = people.findIndex((person) => person === userId);
  people.splice(deletedIndex, 1);

  await data.update({
    people
  });

  res.status(200).json({
    success: true,
    data
  });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const data = await studyGroupModel.findById(id);
  if (!data) {
    res.status(404).json({
      success: false,
      message: ERROR_CODE.STUDY_GROUP_NOT_FOUND
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
