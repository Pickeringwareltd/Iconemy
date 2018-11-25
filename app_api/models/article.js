'use strict';

const mongoose = require('mongoose')
const moment = require('moment')

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required : [true, 'Please provide a title'],
    },
    slug: {
        type: String,
        slug: 'title',
        unique: true
    },
    meta_title: {
        type: String
    },
    meta_description: {
        type: String
    },
    author: {
        type: String,
        required : [true, 'Please provide an author'],
    },
    intro : {
        type: String
    },
    content: {
        type: String,
        required : [true, 'Please some content'],
    }
})

articleSchema.plugin(require('mongoose-slug-updater'))

articleSchema.methods.getDate = function () {
    return moment(this.created_at).format('MMM D, YYYY');
}

const Article = mongoose.model('Article', articleSchema, 'articles')

module.exports = Article;