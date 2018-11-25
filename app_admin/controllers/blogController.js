const Article = require('../../app_api/models/article')

exports.index = function (req, res) {
    Article
        .find()
        .sort('-created_at')
        .exec((err, articles) => {
            if (err) articles = [];

            return res.render('blog/index', {articles: articles})
        })
}

exports.create = (req, res) => {
    if (Object.getOwnPropertyNames(req.body).length === 0) {
        if (! req.body.author) req.body.author = 'Jack Pickering'

        let article = new Article(req.body);

        return res.render('blog/create', { article: article, errors: {} })
    }

    let article = new Article(req.body);

    article
        .save()
        .then(() => res.redirect('/admin/blog'))
        .catch(err => {
            let errors = {};
            if (err.errors !== undefined) {
                errors = Object.keys(err.errors)
                    .map(field => err.errors[field].message);
            }

            console.log(errors);

            return res.render('blog/create', { article: article, errors })
        })
}

exports.edit = (req, res) => {
    if (Object.getOwnPropertyNames(req.body).length > 0) {
        return Article.update( { _id: req.params.id }, req.body, ( error, obj ) => {
            if( error ) {
                return res.redirect(`/admin/blog/${req.params.id}`)
            }

            return res.redirect('/admin/blog')
        });
    }

    Article.findById(req.params.id)
        .then(article => {
            return res.render('blog/edit', { article: article })
        })
}

exports.delete = (req, res) => {

}