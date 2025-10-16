const express=  require('express');
const Indexcontroller=  require('../controllers');
const { authenticate } =require("../middlewares/auth.middleware")
const router = express.Router();

router.post(
  '/create-plan',
  // passport.authenticate('jwt', { session: false }),
  authenticate,
  Indexcontroller.Plan.createPlan
);

//GET ALL PLANS ROUTE
router.get(
  '/get-all-plans',
  // passport.authenticate('jwt', { session: false }),
  Indexcontroller.Plan.getAllPlans
);

router.patch(
  '/update-plan/:id',
  // passport.authenticate('jwt', { session: false }),
  authenticate,
  Indexcontroller.Plan.updatePlan
);

router.delete(
  '/delete-plan/:id',
  // passport.authenticate('jwt', { session: false }),
  authenticate,
  Indexcontroller.Plan.deletePlan
);

router.put(
  '/change-your-plan',
  // passport.authenticate('jwt', { session: false }),
  authenticate,
  Indexcontroller.Plan.changePlan
);

module.exports = router;

