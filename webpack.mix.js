'use strict';

let mix = require('laravel-mix');

mix.webpackConfig({
    devtool : 'inline-source-map',
    node: {
        fs: 'empty'
    }
});

mix
    // User-facing
    .js('app_server/web3_addons/token_web3.js', 'public/javascripts')
    .js('app_server/web3_addons/capped_sale_web3.js', 'public/javascripts')
    .autoload({
        jquery: ['$', 'window.jQuery', 'jQuery', 'jquery']
    })
    .sourceMaps();
