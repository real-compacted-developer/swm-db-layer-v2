import express from 'express';
import questionApi from './questionApi';
import studyDataApi from './studyDataApi';
import studyGroupApi from './studyGroupApi';
import userApi from './userApi';

const router = express.Router();

router.use('/question', questionApi);
router.use('/studydata', studyDataApi);
router.use('/studygroup', studyGroupApi);
router.use('/user', userApi);

export default router;
