'use strict';

exports.render = function(req, res) {
    console.log('done dsaf safdsaf dsafds');
    res.render('index', {
        user: req.user ? JSON.stringify(req.user) : 'null'
    });
};
