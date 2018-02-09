
const user = require('../controllers/userController.js')
const blog = require('../controllers/blogController.js')

module.exports = function(router){

	router
    .route('/db/getall')
	.get(blog.findAll)


	router
	.route('/db/create')
	.post(blog.create)

}
