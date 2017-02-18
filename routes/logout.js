exports.post = function (req, res, next) {

    var  sid = req.session.id;
    const io = req.app.get('io');
    // console.log('dddd',io);

    req.session.destroy((err) => {
        console.error('req.session.destroy', err);
        if(io) {
            // io.sockets.emit("session:reload", sid);
            io.sockets._events.sessreload(sid);
        }
        res.redirect('/');
        if (err) return next(err);
    });


};

