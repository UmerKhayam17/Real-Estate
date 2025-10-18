const express = require('express');
const Indexcontroller = require('../controllers');
const { authenticate } = require("../middlewares/auth.middleware")
const router = express.Router();

router.get('/registration-plans', Indexcontroller.Plan.getPlansForRegistration);
router.post('/create-plan', authenticate, Indexcontroller.Plan.createPlan);

//GET ALL PLANS ROUTE
router.get('/get-all-plans', Indexcontroller.Plan.getAllPlans);
router.patch('/update-plan/:id', authenticate, Indexcontroller.Plan.updatePlan);

router.delete('/delete-plan/:id', authenticate, Indexcontroller.Plan.deletePlan);

router.put('/change-your-plan', authenticate, Indexcontroller.Plan.changePlan);

module.exports = router;

