'use strict';

exports.require = function (req, res, next) {
    if (req.user.isAdmin()) return next()

    return res.status(400).json({
        message: 'Not an admin'
    })
};
