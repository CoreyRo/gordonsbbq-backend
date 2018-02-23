const blog = require('../controllers/blogController.js')

module.exports = function (router) {

    router
        .route('/api/blog/getall')
        .get(blog.findAll)

    router
        .route('/blog/getpages/:num')
        .get(blog.findPages)

    router
        .route('/api/blog/create')
        .post(blog.create)

    router
        .route('/api/blog/edit/:id')
        .put(blog.update)

    router
        .route('/:id')
        .get(blog.findOne)

    router
        .route('/json/blog/getone/:id')
        .get(blog.findOneJson)

    router
        .route('/api/blog/destroy/:id')
        .delete(blog.destroy)

    router
        .route('/imageupload')
        .post(blog.imageUpload)

    router
        .route('/imageDelete')
        .post(blog.imageDel)

    router
        .route('/rte-post')
        .post(blog.rtePost)

}
