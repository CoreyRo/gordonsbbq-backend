const db = require('../models')

module.exports = function (router) {

    router
        .get('/', function (req, res, next) {
            if (req.isAuthenticated()) {
                res.redirect('/home')
            } else {
                res.render('login', {
                    title: "Gordon's BBQ",
                    subTitle: 'Admin Access Level',
                    pageTitle: "Login",
                    error: req.flash('error')
                })
            }
        })
    router.get('/blog', function (req, res, next) {
        if (req.isAuthenticated()) {
            db
                .Blog
                .paginate({}, {
                    page: 1,
                    limit: 3,
                    sort: ({updatedAt: -1})
                })
                .then(function (dbModel) {
                    if (dbModel.docs.length <= 0) {
                        res.render('blog', {
                            title: "Blog Database is Empty",
                            subTitle: 'Click "Create a new blog post" to start',
                            username: req.user.username,
                            user: req.user
                        })
                    } else {
                        res.render('blog', {
                            blog: dbModel,
                            username: req.user.username,
                            title: 'Blog Entries Page ' + dbModel.page + ' of ' + dbModel.pages,
                            pageTitle: "Gordon's BBQ Blog Entries",
                            user: req.user,
                            type: 'blog'
                        })
                    }
                })
                .catch(function (err) {
                    req.flash('error', 'There was an error finding blog posts.')
                    res.redirect('/home')
                })
        } else {
            res.render('login', {
                title: "Gordon's BBQ",
                errors: [
                    {
                        alertType: 'danger',
                        alertIcon: 'fas fa-exclamation-triangle',
                        msg: 'You must be logged in to view this page'
                    }
                ],
                pageTitle: "Login"
            })
        }
    })

    router.get('/home', function (req, res) {
        if (req.isAuthenticated()) {
            res.render('home', {
                title: "Logged in as: " + req.user.username,
                pageTitle: 'Gordons BBQ Blog - Home',
                username: req.user.username,
                user: req.user
            })
        } else {
            res.render('login', {
                title: "Gordon's BBQ",
                errors: [
                    {
                        alertType: 'danger',
                        alertIcon: 'fas fa-exclamation-triangle',
                        msg: 'You must be logged in to view this page'
                    }
                ],
                pageTitle: "Login"
            })
        }
    })

    router.get('/newpost', function (req, res, next) {
        if (req.isAuthenticated()) {
            res.render('newblogpost', {
                user: req.user.username,
                title: "Create New Blog Entry",
                pageTitle: "Gordon's BBQ - New Blog Entry",
                username: req.user.username,
                user: req.user
            })
        } else {
            res.render('login', {
                title: "Gordon's BBQ",
                errors: [
                    {
                        alertType: 'danger',
                        alertIcon: 'fas fa-exclamation-triangle',
                        msg: 'You must be logged in to view this page'
                    }
                ],
                pageTitle: "Login"
            })
        }
    })

    router.get('/change-password', function (req, res, next) {
        if (req.isAuthenticated()) {
            res.render('changepass', {
                user: req.user.username,
                title: "Change Password",
                pageTitle: "Gordon's BBQ - Change Password",
                subTitle: 'Create a new password',
                username: req.user.username,
                user: req.user
            })
        } else {
            res.render('login', {
                title: "Gordon's BBQ",
                errors: [
                    {
                        alertType: 'danger',
                        alertIcon: 'fas fa-exclamation-triangle',
                        msg: 'You must be logged in to view this page'
                    }
                ],
                pageTitle: "Login"
            })
        }
    })

    router.get('/api*', function (req, res, next) {
        if (!req.isAuthenticated()) {
            res.redirect('/')
        } else {
            next()
        }
    })

    router.get('/register', function (req, res) {
        if (req.isAuthenticated()) {
            res.render('register', {
                user: req.user.username,
                title: "Register a new user",
                pageTitle: "Gordon's BBQ - Add User",
                username: req.user.username,
                user: req.user
            })
        } else {
            res.render('login', {
                title: "Gordon's BBQ",
                errors: [
                    {
                        alertType: 'danger',
                        alertIcon: 'fas fa-exclamation-triangle',
                        msg: 'You must be logged in to view this page'
                    }
                ],
                pageTitle: "Login"
            })
        }
    })

    router.get('/forgot', function (req, res) {
        (res.render('forgot', {
            title: 'Forgot Password',
            pageTitle: "Forgot Password",
            subTitle: 'Enter the email address for your account'
        }))

    })

    router.get('/manage-users', function (req, res, next) {
        if (req.isAuthenticated()) {
        db.User
        .paginate({}, {
            page: 1,
            limit: 3,
            sort: ({updatedAt:-1}),
        })
        .then(function(dbModel){
            if (dbModel.docs.length <= 0){
                res.render('users', {
                    title: "The user database is empty",
                    subTitle: 'Click "Create a new user post" to start',
                    username: req.user.username,
                })
            }
            else{
                res.render('users', {
                    users: dbModel,
                    title: 'User Accounts Page ' + dbModel.page + ' of ' + dbModel.pages,
                    username: req.user.username,
                    user: req.user,
                    type: 'users'
                })
            }
        })
        .catch(function(err){
            req.flash('error', 'There was an error the users.')
            res.redirect('/home')
        })
    }
    else{
        res.render('login', {
            title: "Gordon's BBQ",
            errors: [
                {
                    alertType: 'danger',
                    alertIcon: 'fas fa-exclamation-triangle',
                    msg: 'You must be logged in to view this page'
                }
            ],
            pageTitle: "Login"
        })        
    }

    })
    router.get('/edit-profile', function (req, res, next) {
        if (req.isAuthenticated()) {
            res.render('updateUser', {
                users: req.user,
                title: "Edit your information",
                pageTitle: "Gordon's BBQ - Edit information",
                subTitle: 'Edit your information',
                username: req.user.username,
                user: req.user
            })
        } else {
            res.render('login', {
                title: "Gordon's BBQ",
                errors: [
                    {
                        alertType: 'danger',
                        alertIcon: 'fas fa-exclamation-triangle',
                        msg: 'You must be logged in to view this page'
                    }
                ],
                pageTitle: "Login"
            })
        }
    })
}
