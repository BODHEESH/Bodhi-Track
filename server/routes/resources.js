const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  updateProgress,
  addReview,
  toggleFavorite,
  getStatistics
} = require('../controllers/resourceController');

// All routes are protected
// router.use(auth);

router.route('/')
  .get(getAllResources)
  .post(createResource);

router.route('/statistics')
  .get(getStatistics);

router.route('/:id')
  .get(getResource)
  .put(updateResource)
  .delete(deleteResource);

router.route('/:id/progress')
  .put(updateProgress);

router.route('/:id/reviews')
  .post(addReview);

router.route('/:id/favorite')
  .put(toggleFavorite);

module.exports = router;
