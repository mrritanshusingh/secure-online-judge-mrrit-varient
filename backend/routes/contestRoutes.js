const express = require('express');
const router = express.Router();
const contestController = require('../controllers/contestController');
const auth = require('../middleware/auth');

router.post('/', auth, contestController.createContest);
router.get('/', contestController.getAllContests);
router.get('/:id', auth, contestController.getContestById); 

router.post('/finalize/:id', auth, contestController.finalizeContest);
router.delete('/:id', auth, contestController.deleteContest);

module.exports = router;