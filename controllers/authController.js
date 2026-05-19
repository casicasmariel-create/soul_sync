const db = require('../config/db');
const bcrypt = require('bcrypt');

// =====================================
// LOGIN PAGE
// =====================================

exports.loginPage = (req, res) => {
    res.render('login');
};

// =====================================
// REGISTER PAGE
// =====================================

exports.registerPage = (req, res) => {
    res.render('register');
};

// =====================================
// DASHBOARD
// =====================================

exports.dashboard = (req, res) => {

    if(!req.session.user){
        return res.redirect('/login');
    }

    const user = req.session.user;

    if(user.role === 'youth_president'){

        return res.render('admin/admin-dashboard', {
            user
        });

    }

    return res.render('user/user-dashboard', {
        user
    });

};

// =====================================
// ADMIN ANNOUNCEMENTS CREATE PAGE
// =====================================

exports.adminAnnouncements = (req, res) => {

    res.render('admin/announcements', {
        user: req.session.user
    });

};

// =====================================
// ADMIN ANNOUNCEMENT LIST PAGE
// =====================================

exports.adminAnnouncementList = (req, res) => {

    db.query(
        'SELECT * FROM announcements ORDER BY created_at DESC',
        (err, results) => {

            if(err){
                console.log(err);
                return res.send('Database Error');
            }

            res.render('admin/announcement-list', {
                announcements: results,
                user: req.session.user
            });

        }
    );

};

// =====================================
// USER ANNOUNCEMENTS
// =====================================

exports.userAnnouncements = (req, res) => {

    db.query(
        'SELECT * FROM announcements ORDER BY created_at DESC',
        (err, results) => {

            if(err){
                console.log(err);
                return res.send('Database Error');
            }

            res.render('user/announcements', {
                announcements: results,
                user: req.session.user
            });

        }
    );

};

// =====================================
// CREATE ANNOUNCEMENT
// =====================================

exports.createAnnouncement = (req, res) => {

    const { title, content } = req.body;

    db.query(
        'INSERT INTO announcements(title, content) VALUES (?, ?)',
        [title, content],
        (err) => {

            if(err){
                console.log(err);
                return res.send('Failed');
            }

            res.redirect('/admin/announcements-list');

        }
    );

};

// =====================================
// EDIT ANNOUNCEMENT PAGE
// =====================================

exports.editAnnouncementPage = (req, res) => {

    const id = req.params.id;

    db.query(
        'SELECT * FROM announcements WHERE id = ?',
        [id],
        (err, results) => {

            if(err){
                console.log(err);
                return res.send('Database Error');
            }

            res.render('admin/edit-announcement', {
                announcement: results[0]
            });

        }
    );

};

// =====================================
// UPDATE ANNOUNCEMENT
// =====================================

exports.updateAnnouncement = (req, res) => {

    const id = req.params.id;

    const { title, content } = req.body;

    db.query(
        `UPDATE announcements
         SET title = ?, content = ?
         WHERE id = ?`,
        [title, content, id],
        (err) => {

            if(err){
                console.log(err);
                return res.send('Update Failed');
            }

            res.redirect('/admin/announcements-list');

        }
    );

};

// =====================================
// DELETE ANNOUNCEMENT
// =====================================

exports.deleteAnnouncement = (req, res) => {

    const id = req.params.id;

    db.query(
        'DELETE FROM announcements WHERE id = ?',
        [id],
        (err) => {

            if(err){
                console.log(err);
                return res.send('Delete Failed');
            }

            res.redirect('/admin/announcements-list');

        }
    );

};

// =====================================
// ADMIN EVENTS CREATE PAGE
// =====================================

exports.adminEvents = (req, res) => {

    res.render('admin/events', {
        user: req.session.user
    });

};

// =====================================
// ADMIN EVENT LIST PAGE
// =====================================

exports.eventListPage = (req, res) => {

    const eventSQL = `
        SELECT * FROM events
        ORDER BY created_at DESC
    `;

    const responseSQL = `
        SELECT
            event_responses.*,
            users.fullname
        FROM event_responses
        JOIN users
        ON event_responses.user_id = users.id
        ORDER BY event_responses.created_at DESC
    `;

    db.query(eventSQL, (err, events) => {

        if(err){
            console.log(err);
            return res.send('Database Error');
        }

        db.query(responseSQL, (err, responses) => {

            if(err){
                console.log(err);
                return res.send('Database Error');
            }

            res.render(
                'admin/event-list',
                {
                    events,
                    responses,
                    user: req.session.user
                }
            );

        });

    });

};

// =====================================
// EVENT RESPONSES PAGE
// =====================================

exports.eventResponsesPage = (req, res) => {

    const event_id = req.params.id;

    const eventSQL = `
        SELECT * FROM events
        WHERE id = ?
    `;

    const responseSQL = `
        SELECT
            event_responses.*,
            users.fullname
        FROM event_responses
        JOIN users
        ON event_responses.user_id = users.id
        WHERE event_responses.event_id = ?
        ORDER BY event_responses.created_at DESC
    `;

    db.query(eventSQL, [event_id], (err, eventResult) => {

        if(err){
            console.log(err);
            return res.send('Database Error');
        }

        db.query(responseSQL, [event_id], (err, responses) => {

            if(err){
                console.log(err);
                return res.send('Database Error');
            }

            res.render(
                'admin/event-responses',
                {
                    event: eventResult[0],
                    responses,
                    user: req.session.user
                }
            );

        });

    });

};

// =====================================
// CREATE EVENT
// =====================================

exports.createEvent = (req, res) => {

    const { title, description, event_date } = req.body;

    db.query(
        'INSERT INTO events(title, description, event_date) VALUES (?, ?, ?)',
        [title, description, event_date],
        (err) => {

            if(err){
                console.log(err);
                return res.send('Failed');
            }

            res.redirect('/admin/event-list');

        }
    );

};

// =====================================
// EDIT EVENT PAGE
// =====================================

exports.editEventPage = (req, res) => {

    const id = req.params.id;

    db.query(
        'SELECT * FROM events WHERE id = ?',
        [id],
        (err, results) => {

            if(err){
                console.log(err);
                return res.send('Database Error');
            }

            res.render('admin/edit-event', {
                event: results[0]
            });

        }
    );

};

// =====================================
// UPDATE EVENT
// =====================================

exports.updateEvent = (req, res) => {

    const id = req.params.id;

    const {
        title,
        description,
        event_date
    } = req.body;

    db.query(
        `UPDATE events
         SET title = ?,
             description = ?,
             event_date = ?
         WHERE id = ?`,
        [title, description, event_date, id],
        (err) => {

            if(err){
                console.log(err);
                return res.send('Update Failed');
            }

            res.redirect('/admin/event-list');

        }
    );

};

// =====================================
// DELETE EVENT
// =====================================

exports.deleteEvent = (req, res) => {

    const id = req.params.id;

    db.query(
        'DELETE FROM events WHERE id = ?',
        [id],
        (err) => {

            if(err){
                console.log(err);
                return res.send('Delete Failed');
            }

            res.redirect('/admin/event-list');

        }
    );

};

// =====================================
// USER EVENTS
// =====================================

exports.userEvents = (req, res) => {

    db.query(
        'SELECT * FROM events ORDER BY created_at DESC',
        (err, events) => {

            if(err){
                console.log(err);
                return res.send('Database Error');
            }

            db.query(
                'SELECT * FROM event_responses',
                (err, responses) => {

                    if(err){
                        console.log(err);
                        return res.send('Database Error');
                    }

                    res.render('user/events', {
                        events,
                        responses,
                        user: req.session.user
                    });

                }
            );

        }
    );

};

// =====================================
// JOIN EVENT
// =====================================

exports.joinEvent = (req, res) => {

    const event_id = req.params.id;

    const user = req.session.user;

    db.query(
        `SELECT * FROM event_responses
         WHERE event_id = ?
         AND user_id = ?`,
        [event_id, user.id],
        (err, results) => {

            if(err){
                console.log(err);
                return res.send('Database Error');
            }

            if(results.length > 0){
                return res.redirect('/user/events');
            }

            db.query(
                `INSERT INTO event_responses(
                    event_id,
                    user_id,
                    fullname,
                    response_status
                )
                VALUES (?, ?, ?, 'JOINING')`,
                [
                    event_id,
                    user.id,
                    user.fullname
                ],
                (err) => {

                    if(err){
                        console.log(err);
                        return res.send('Join Failed');
                    }

                    res.redirect('/user/events');

                }
            );

        }
    );

};

// =====================================
// NOT JOIN EVENT
// =====================================

exports.notJoinEvent = (req, res) => {

    const event_id = req.params.id;

    const user = req.session.user;

    db.query(
        `SELECT * FROM event_responses
         WHERE event_id = ?
         AND user_id = ?`,
        [event_id, user.id],
        (err, results) => {

            if(err){
                console.log(err);
                return res.send('Database Error');
            }

            if(results.length > 0){
                return res.redirect('/user/events');
            }

            db.query(
                `INSERT INTO event_responses(
                    event_id,
                    user_id,
                    fullname,
                    response_status
                )
                VALUES (?, ?, ?, 'NOT JOINING')`,
                [
                    event_id,
                    user.id,
                    user.fullname
                ],
                (err) => {

                    if(err){
                        console.log(err);
                        return res.send('Failed');
                    }

                    res.redirect('/user/events');

                }
            );

        }
    );

};

// =====================================
// ADMIN PRAYER REQUESTS
// =====================================

exports.adminPrayerRequests = (req, res) => {

    db.query(
        'SELECT * FROM prayer_requests ORDER BY created_at DESC',
        (err, results) => {

            if(err){
                console.log(err);
                return res.send('Database Error');
            }

            res.render('admin/prayer-requests', {
                prayers: results,
                user: req.session.user
            });

        }
    );

};

// =====================================
// PRAYER REQUEST LIST PAGE
// =====================================

exports.prayerRequestListPage = (req, res) => {

    db.query(
        `
        SELECT *
        FROM prayer_requests
        ORDER BY created_at DESC
        `,
        (err, results) => {

            if(err){
                console.log(err);
                return res.send('Database Error');
            }

            res.render(
                'admin/prayer-request-list',
                {
                    prayers: results,
                    user: req.session.user
                }
            );

        }
    );

};

// =====================================
// UPDATE PRAYER STATUS
// =====================================

exports.updatePrayerStatus = (req, res) => {

    const id = req.params.id;

    const status = req.params.status;

    db.query(
        `
        UPDATE prayer_requests
        SET status = ?
        WHERE id = ?
        `,
        [status, id],
        (err) => {

            if(err){
                console.log(err);
                return res.send('Database Error');
            }

            res.redirect('/admin/prayer-request-list');

        }
    );

};

// =====================================
// DELETE PRAYER REQUEST
// =====================================

exports.deletePrayerRequest = (req, res) => {

    const id = req.params.id;

    db.query(
        `
        DELETE FROM prayer_requests
        WHERE id = ?
        `,
        [id],
        (err) => {

            if(err){

                console.log(err);

                return res.send('Delete Failed');

            }

            res.redirect('/admin/prayer-request-list');

        }
    );

};

// =====================================
// USER PRAYER REQUESTS
// =====================================

exports.userPrayerRequests = (req, res) => {

    db.query(
        'SELECT * FROM prayer_requests ORDER BY created_at DESC',
        (err, results) => {

            if(err){
                console.log(err);
                return res.send('Database Error');
            }

            res.render('user/prayer-requests', {
                prayers: results,
                user: req.session.user
            });

        }
    );

};

// =====================================
// CREATE PRAYER REQUEST
// =====================================

exports.createPrayerRequest = (req, res) => {

    const fullname = req.session.user.fullname;

    const {
        prayer,
        category,
        anonymous
    } = req.body;

    db.query(

        `
        INSERT INTO prayer_requests
        (
            fullname,
            prayer,
            category,
            anonymous
        )
        VALUES (?, ?, ?, ?)
        `,

        [
            anonymous === 'YES'
            ? 'Anonymous User'
            : fullname,

            prayer,

            category,

            anonymous || 'NO'
        ],

        (err) => {

            if(err){

                console.log(err);

                return res.send(err);

            }

            res.redirect('/user/prayer-requests');

        }

    );

};

// =====================================
// PRAY FOR REQUEST
// =====================================

exports.prayForRequest = (req, res) => {

    const id = req.params.id;

    db.query(
        `
        UPDATE prayer_requests
        SET prayed_count = prayed_count + 1
        WHERE id = ?
        `,
        [id],
        (err) => {

            if(err){

                console.log(err);

                return res.send('Failed');

            }

            res.redirect('/user/prayer-requests');

        }
    );

};

// =====================================
// ADMIN MUSIC CLASSES
// =====================================

exports.adminMusicClasses = (req, res) => {

    db.query(
        'SELECT * FROM music_classes ORDER BY created_at DESC',
        (err, results) => {

            if(err){
                console.log(err);
                return res.send('Database Error');
            }

            res.render('admin/music-classes', {
                classes: results,
                user: req.session.user
            });

        }
    );

};

// =====================================
// CREATE MUSIC CLASS
// =====================================

exports.createMusicClass = (req, res) => {

    const { class_name, trainer, schedule } = req.body;

    db.query(
        `INSERT INTO music_classes(class_name, trainer, schedule)
         VALUES (?, ?, ?)`,
        [class_name, trainer, schedule],
        (err) => {

            if(err){
                console.log(err);
                return res.send('Failed');
            }

            res.redirect('/admin/music-classes');

        }
    );

};

// =====================================
// USER MUSIC CLASSES
// =====================================

exports.userMusicClasses = (req, res) => {

    db.query(
        'SELECT * FROM music_classes ORDER BY created_at DESC',
        (err, results) => {

            if(err){
                console.log(err);
                return res.send('Database Error');
            }

            res.render('user/music-classes', {
                classes: results,
                user: req.session.user
            });

        }
    );

};

// =====================================
// REGISTER USER
// =====================================

exports.registerUser = async (req, res) => {

    const { fullname, email, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        async (err, results) => {

            if(err){
                console.log(err);
                return res.send('Database Error');
            }

            if(results.length > 0){
                return res.send('Email already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.query(
                `INSERT INTO users(fullname, email, password, role)
                 VALUES (?, ?, ?, 'youth_member')`,
                [fullname, email, hashedPassword],
                (err) => {

                    if(err){
                        console.log(err);
                        return res.send('Registration Failed');
                    }

                    res.redirect('/login');

                }
            );

        }
    );

};

// =====================================
// LOGIN USER
// =====================================

exports.loginUser = (req, res) => {

    const { email, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        async (err, results) => {

            if(err){
                console.log(err);
                return res.send('Database Error');
            }

            if(results.length === 0){

                return res.render('login', {
                    error: 'User Not Found'
                });

            }

            const user = results[0];

            const match = await bcrypt.compare(password, user.password);

            if(!match){

                return res.render('login', {
                    error: 'Incorrect Password'
                });

            }

            req.session.user = {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            };

            res.redirect('/dashboard');

        }
    );

};

// =====================================
// LOGOUT
// =====================================

exports.logoutUser = (req, res) => {

    req.session.destroy(() => {

        res.redirect('/login');

    });

};