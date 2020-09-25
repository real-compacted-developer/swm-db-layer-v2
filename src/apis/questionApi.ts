import express from 'express';
import { body } from 'express-validator';
import ERROR_CODE from '../constants/errorCode';
import checkValidation from '../middlewares/validator';
import questionModel from '../database/models/questionModel';

const router = express.Router();

router.get('/', async (req, res) => {
  const data = await questionModel.find();
  res.status(200).json({
    success: true,
    data
  });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const data = await questionModel.findById(id);

  if (!data) {
    res.status(404).json({
      success: false,
      message: ERROR_CODE.QUESTION_NOT_FOUND
    });
    return;
  }

  res.status(200).json({
    success: true,
    data
  });
});

const createQuestionValidator = [
  body('user'),
  body('title').isString(),
  body('content').isString(),
  body('slideOrder').isNumeric(),
  body('slideImageURL').isString()
];
router.post('/', createQuestionValidator, checkValidation, async (req: express.Request, res: express.Response) => {
  const { title, content, user, slideOrder, slideImageURL } = req.body;

  const data = await questionModel.create({
    title,
    content,
    user,
    slideOrder,
    slideImageURL,
    like: 0
  });

  res.status(201).send({
    success: true,
    data
  });
});

const updateQuestionValidator = createQuestionValidator.slice(1);
router.put('/:id', updateQuestionValidator, checkValidation, async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { title, content, slideOrder, slideImageURL } = req.body;

  const data = await questionModel.findById(id);
  if (!data) {
    res.status(404).json({
      success: false,
      message: ERROR_CODE.QUESTION_NOT_FOUND
    });
    return;
  }

  await data.update({
    title,
    content,
    slideOrder,
    slideImageURL
  });

  res.status(200).send({
    success: true,
    data
  });
});

router.post('/like/:id', async (req, res) => {
  const { id } = req.params;

  const data = await questionModel.findById(id);
  if (!data) {
    res.status(404).json({
      success: false,
      message: ERROR_CODE.QUESTION_NOT_FOUND
    });
    return;
  }

  const currentLike = data.like;

  await data.update({
    like: currentLike + 1
  });

  res.status(200).send({
    success: true,
    data
  });
});

router.delete('/like/:id', async (req, res) => {
  const { id } = req.params;

  const data = await questionModel.findById(id);
  if (!data) {
    res.status(404).json({
      success: false,
      message: ERROR_CODE.QUESTION_NOT_FOUND
    });
    return;
  }

  const currentLike = data.like;

  if (currentLike <= 0) {
    res.status(400).json({
      success: false,
      message: ERROR_CODE.QUESTION_LIKE_NOT_MINUS
    });
    return;
  }

  await data.update({
    like: currentLike - 1
  });

  res.status(200).send({
    success: true,
    data
  });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const data = await questionModel.findById(id);
  if (!data) {
    res.status(404).json({
      success: false,
      message: ERROR_CODE.QUESTION_NOT_FOUND
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
