const db = require('../models')
const formidable = require('formidable');
const path = require('path');
const nl2br = require('nl2br');
const async = require('async')
const fs = require('fs')

module.exports = {
    create: function (req, res) {
        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            db
                .Blog
                .create({
                    title: fields.title,
                    text: fields.text,
                    img: files.imageURL.name || fields.default_imageURL
                })
                .then(function (dbModel) {
                    req.flash('success', 'Your blog post was successfully created.')
                    res.redirect('/home')
                })
                .catch(function (err) {
                    req.flash('error', 'There was an error creating your post.')
                    res.redirect('/home')
                })
        })

        form.on('fileBegin', function (name, file) {
            if (file.name) {
                file.path = path.basename(path.dirname('../')) + '/public/imgs/' + file.name;
            }
            return console.log('No new image uploaded')
        });

        form.on('end', function () {
            console.log('Thanks File Uploaded');
        });

    },

    findPages: function (req, res) {
        db
            .Blog
            .paginate({}, {
                page: parseInt(req.params.num),
                limit: 6,
                sort: ({
                    updatedAt: -1
                })
            })
            .then(function (dbModel) {
                if (dbModel.docs.length <= 0) {
                    res.render('bloglist', {
                        title: "The blog database is empty",
                        subTitle: 'Click "Create a new blog post" to start',
                        username: req.user.username,
                        user: req.user,
                        href: 'blog'
                    })
                } else {
                    res.render('bloglist', {
                        blog: dbModel,
                        title: 'Blog Entries Page ' + dbModel.page + ' of ' + dbModel.pages,
                        username: req.user.username,
                        user: req.user,
                        type: 'blog',
                        href: 'blog'
                    })
                }

            })
            .catch(function (err) {
                req.flash('error', 'There was an error finding that user.')
                res.redirect('/home')
            })
    },

    findAll: function (req, res) {
        db
            .Blog
            .find({})
            .sort({
                dateAdded: -1
            })
            .then(function (dbModel) {
                res.json(dbModel)
            })
            .catch(function (err) {
                res.json(err)
            })
    },

    findOne: function (req, res) {
        db
            .Blog
            .findOne({
                _id: req.params.id
            })
            .then(function (dbModel) {
                res.render('editblog', {
                    blog: dbModel,
                    title: "Update Blog Post",
                    pageTitle: "Gordons BBQ - Update Post",
                    username: req.user.username,
                    href: 'blog'

                })
            })
            .catch(function (err) {
                req.flash('error', 'There was an error finding that user.')
                res.redirect('/home')
            })
    },

    findOneJson: function (req, res) {
        db
            .Blog
            .findOne({
                _id: req.params.id
            })
            .then(function (dbModel) {
                res.json(dbModel)
            })
            .catch(function (err) {
                res.json(err)
            })
    },

    update: function (req, res) {

        db.Blog
            .findOneAndUpdate({
                _id: req.params.id
            }, {
                title: req.body.title,
                richText: req.body.editordata
            })
            .then(function (dbModel) {
                res.redirect('/blog')
            })
            .catch(function (err) {
                req.flash('error', 'There was an error updating.')
                res.redirect('/blog')
            })

    },

    destroy: function (req, res) {
        db
            .Blog
            .findOne({
                _id: req.params.id
            })
            .then(function (dbModel) {
                dbModel.remove()
                req.flash('success', 'The post was deleted.')
                res.redirect('/blog')
            })
            .catch(function (err) {
                req.flash('error', 'There was an error deleting the post.')
                res.redirect('/blog')
            })
    },

    rtePost: function (req, res, next) {
        db.Blog.create({
                title: req.body.title,
                richText: req.body.editordata
            })
            .then(blog => {
                res.render('rte', {
                    username: req.user.username,
                    user: req.user,
                    href: 'rte-post',
                    text: blog.richText
                })
            })
    },

    imageUpload: function (req, res) {
        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            let url = {}
            url.name = files.file.name
            url.url = `../imgs/${files.file.name}`
            res.send(url)
        })
        form.on('fileBegin', function (name, file) {
            if (file.name) {
                file.path = path.basename(path.dirname('../')) + '/public/imgs/' + file.name;
            } else {
                return console.log('No new image uploaded')
            }
        });
        form.on('end', function (res) {
            console.log('Thanks File Uploaded');
        });
    },

    imageDel: function (req, res, next) {
        async.waterfall([
            function (done) {
                let form = new formidable.IncomingForm();
                form.parse(req, function (err, fields, files) {
                    let filename = fields
                        .file
                        .split('imgs/')[1]
                    let pathTo = path.basename(path.dirname('../')) + '/public/imgs/' + filename;
                    done(null, pathTo)
                })
            },

            function (pathTo, done) {
                fs.unlink(pathTo, function (err) {
                    if (err && err.code == 'ENOENT') {
                        // file doens't exist
                        console.info("File doesn't exist, won't remove it.");
                    } else if (err) {
                        // other errors, e.g. maybe we don't have enough permission
                        console.error("Error occurred while trying to remove file");
                    } else {
                        console.info(`removed`);
                    }
                });
            }
        ])

    }
}