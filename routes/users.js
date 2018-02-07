const router = require("express").Router();
const user = require('../controllers/userController.js')


/* GET users listing. */
// router
//   .route('/login')
//   .post(user.create)

router
  .route('/create')
  .post(user.create)

router
  .route('/getall')
  .get(user.findAll)


module.exports = router;
