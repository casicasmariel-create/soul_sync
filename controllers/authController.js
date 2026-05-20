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
// USER EVENTS PAGE
// =====================================

exports.userEvents = (req, res) => {

    db.query(

        `
        SELECT *
        FROM events
        ORDER BY created_at DESC
        `,

        (err, events) => {

            if(err){

                console.log(err);

                return res.send('Database Error');

            }

            db.query(

                `
                SELECT *
                FROM event_responses
                `,

                (err, responses) => {

                    if(err){

                        console.log(err);

                        return res.send('Database Error');

                    }

                    res.render(

                        'user/events',

                        {

                            events,

                            responses,

                            user: req.session.user

                        }

                    );

                }

            );

        }

    );

};

// =====================================
// JOIN EVENT
// =====================================

exports.joinEvent = (req, res) => {

    const eventId = req.params.id;

    const userId = req.session.user.id;

    db.query(

        `
        SELECT *
        FROM event_responses
        WHERE event_id = ?
        AND user_id = ?
        `,
        [eventId, userId],

        (err, results) => {

            if(err){
                console.log(err);
                return res.send('Database Error');
            }

            // =====================================
            // IF RESPONSE EXISTS -> UPDATE
            // =====================================

            if(results.length > 0){

                db.query(

                    `
                    UPDATE event_responses
                    SET response_status = 'JOINING'
                    WHERE event_id = ?
                    AND user_id = ?
                    `,
                    [eventId, userId],

                    (err) => {

                        if(err){
                            console.log(err);
                            return res.send('Update Error');
                        }

                        res.redirect('/user/events');

                    }

                );

            }

            // =====================================
            // IF NO RESPONSE -> INSERT
            // =====================================

            else{

                db.query(

                    `
                    INSERT INTO event_responses
                    (
                        event_id,
                        user_id,
                        response_status
                    )
                    VALUES (?, ?, 'JOINING')
                    `,
                    [eventId, userId],

                    (err) => {

                        if(err){
                            console.log(err);
                            return res.send('Insert Error');
                        }

                        res.redirect('/user/events');

                    }

                );

            }

        }

    );

};

// =====================================
// NOT JOIN EVENT
// =====================================

exports.notJoinEvent = (req, res) => {

    const eventId = req.params.id;

    const userId = req.session.user.id;

    db.query(

        `
        SELECT *
        FROM event_responses
        WHERE event_id = ?
        AND user_id = ?
        `,
        [eventId, userId],

        (err, results) => {

            if(err){
                console.log(err);
                return res.send('Database Error');
            }

            // =====================================
            // IF RESPONSE EXISTS -> UPDATE
            // =====================================

            if(results.length > 0){

                db.query(

                    `
                    UPDATE event_responses
                    SET response_status = 'NOT JOINING'
                    WHERE event_id = ?
                    AND user_id = ?
                    `,
                    [eventId, userId],

                    (err) => {

                        if(err){
                            console.log(err);
                            return res.send('Update Error');
                        }

                        res.redirect('/user/events');

                    }

                );

            }

            // =====================================
            // IF NO RESPONSE -> INSERT
            // =====================================

            else{

                db.query(

                    `
                    INSERT INTO event_responses
                    (
                        event_id,
                        user_id,
                        response_status
                    )
                    VALUES (?, ?, 'NOT JOINING')
                    `,
                    [eventId, userId],

                    (err) => {

                        if(err){
                            console.log(err);
                            return res.send('Insert Error');
                        }

                        res.redirect('/user/events');

                    }

                );

            }

        }

    );

};

// =====================================
// ADMIN PRAYER REQUESTS
// =====================================

exports.adminPrayerRequests = (req, res) => {

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
                'admin/prayer-requests',
                {
                    prayers: results,
                    user: req.session.user
                }
            );

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

        async (err, prayers) => {

            // =====================================
            // DATABASE ERROR
            // =====================================

            if(err){

                console.log(err);

                return res.send('Database Error');

            }

            // =====================================
            // GET SUPPORTERS OF EACH PRAYER
            // =====================================

            for (const prayer of prayers) {

                const [supporters] =
                await db.promise().query(

                    `
                    SELECT fullname
                    FROM prayer_supports
                    WHERE prayer_id = ?
                    `,

                    [prayer.id]

                );

                // SAVE SUPPORTERS

                prayer.supporters = supporters;

                // COUNT SUPPORTERS

                prayer.support_count =
                supporters.length;

            }

            // =====================================
            // ANALYTICS
            // =====================================

            const total =
            prayers.length;

            const praying =
            prayers.filter(
                p => p.status === 'Still Praying'
            ).length;

            const answered =
            prayers.filter(
                p => p.status === 'Answered Prayer'
            ).length;

            let supporters = 0;

            prayers.forEach(prayer => {

                supporters +=
                prayer.support_count;

            });

            // =====================================
            // RENDER PAGE
            // =====================================

            res.render(

                'admin/prayer-request-list',

                {

                    prayers,

                    total,

                    praying,

                    answered,

                    supporters,

                    user:
                    req.session.user

                }

            );

        }

    );

};

// =====================================
// UPDATE MY PRAYER STATUS
// =====================================

exports.updateMyPrayerStatus = (req, res) => {

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

            res.redirect('/user/my-prayers');

        }

    );

};

// =====================================
// SAVE TESTIMONY
// =====================================

exports.saveTestimony = (req, res) => {

    const id = req.params.id;

    const testimony = req.body.testimony;

    db.query(

        `
        UPDATE prayer_requests
        SET
        status = 'Answered Prayer',
        testimony = ?
        WHERE id = ?
        `,

        [testimony, id],

        (err) => {

            if(err){

                console.log(err);

                return res.send('Database Error');

            }

            res.redirect('/user/my-prayers');

        }

    );

};

// =====================================
// DELETE PRAYER REQUEST (ADMIN)
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
// USER CREATE PRAYER PAGE
// =====================================

exports.userPrayerRequests = (req, res) => {

    res.render(

        'user/prayer-requests',

        {
            user: req.session.user
        }

    );

};

// =====================================
// USER MY PRAYERS PAGE
// =====================================

exports.userMyPrayers = (req, res) => {

    // CHECK SESSION

    if(!req.session.user){

        return res.redirect('/login');

    }

    const fullname =
    req.session.user.fullname;

    db.query(

        `
        SELECT *
        FROM prayer_requests
        WHERE fullname = ?
        OR anonymous = 'YES'
        ORDER BY created_at DESC
        `,

        [fullname],

        (err, prayers) => {

            if(err){

                console.log(err);

                return res.send('Database Error');

            }

            res.render(

                'user/my-prayers',

                {

                    prayers,

                    user:
                    req.session.user

                }

            );

        }

    );

};

// =====================================
// COMMUNITY PRAYERS PAGE
// =====================================

exports.communityPrayers = (req, res) => {

    // CHECK LOGIN

    if(!req.session.user){

        return res.redirect('/login');

    }

    const fullname =
    req.session.user.fullname;

    db.query(

        `
        SELECT *
        FROM prayer_requests
        ORDER BY created_at DESC
        `,

        (err, prayers) => {

            if(err){

                console.log(err);

                return res.send('Database Error');

            }

            db.query(

                `
                SELECT *
                FROM prayer_supports
                `,

                (err, supports) => {

                    if(err){

                        console.log(err);

                        return res.send('Database Error');

                    }

                    // USER SUPPORTED PRAYERS

                    db.query(

                        `
                        SELECT prayer_id
                        FROM prayer_supports
                        WHERE fullname = ?
                        `,

                        [fullname],

                        (err, userSupports) => {

                            if(err){

                                console.log(err);

                                return res.send('Database Error');

                            }

                            res.render(

                                'user/community-prayers',

                                {

                                    prayers,

                                    supports,

                                    userSupports,

                                    user:
                                    req.session.user

                                }

                            );

                        }

                    );

                }

            );

        }

    );

};

// =====================================
// EDIT PRAYER PAGE
// =====================================

exports.editPrayerPage = (req, res) => {

    const id = req.params.id;

    db.query(

        `
        SELECT *
        FROM prayer_requests
        WHERE id = ?
        `,

        [id],

        (err, results) => {

            if(err){

                console.log(err);

                return res.send('Database Error');

            }

            res.render(

                'user/edit-prayer',

                {

                    prayer:
                    results[0],

                    user:
                    req.session.user

                }

            );

        }

    );

};

// =====================================
// UPDATE PRAYER
// =====================================

exports.updatePrayer = (req, res) => {

    const id = req.params.id;

    const {
        prayer,
        category
    } = req.body;

    db.query(

        `
        UPDATE prayer_requests
        SET
        prayer = ?,
        category = ?
        WHERE id = ?
        `,

        [
            prayer,
            category,
            id
        ],

        (err) => {

            if(err){

                console.log(err);

                return res.send('Update Failed');

            }

            res.redirect('/user/my-prayers');

        }

    );

};

// =====================================
// DELETE USER PRAYER
// =====================================

exports.deleteUserPrayer = (req, res) => {

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

            res.redirect('/user/my-prayers');

        }

    );

};

// =====================================
// CREATE PRAYER REQUEST
// =====================================

exports.createPrayerRequest = (req, res) => {

    // CHECK LOGIN

    if(!req.session.user){

        return res.redirect('/login');

    }

    const fullname =
    req.session.user.fullname;

    const prayer =
    req.body.prayer;

    const category =
    req.body.category;

    const anonymous =
    req.body.anonymous || 'NO';

    // VALIDATION

    if(!prayer || !category){

        return res.send(
            'Please complete all fields'
        );

    }

    // INSERT

    db.query(

        `
        INSERT INTO prayer_requests
        (
            fullname,
            prayer,
            category,
            anonymous,
            status
        )
        VALUES (?, ?, ?, ?, ?)
        `,

        [

            anonymous === 'YES'
            ? 'Anonymous User'
            : fullname,

            prayer,

            category,

            anonymous,

            'Still Praying'

        ],

        (err) => {

            if(err){

                console.log(err);

                return res.send(err);

            }

            res.redirect('/user/my-prayers');

        }

    );

};

// =====================================
// PRAY FOR REQUEST
// =====================================

exports.prayForRequest = (req, res) => {

    const prayer_id =
    req.params.id;

    const fullname =
    req.session.user.fullname;

    // CHECK EXISTING SUPPORT

    db.query(

        `
        SELECT *
        FROM prayer_supports
        WHERE prayer_id = ?
        AND fullname = ?
        `,

        [prayer_id, fullname],

        (err, results) => {

            if(err){

                console.log(err);

                return res.send('Database Error');

            }

            // ALREADY PRAYED

            if(results.length > 0){

                return res.redirect(
                    '/user/community-prayers'
                );

            }

            // INSERT SUPPORT

            db.query(

                `
                INSERT INTO prayer_supports
                (
                    prayer_id,
                    fullname
                )
                VALUES (?, ?)
                `,

                [
                    prayer_id,
                    fullname
                ],

                (err) => {

                    if(err){

                        console.log(err);

                        return res.send('Database Error');

                    }

                    // UPDATE COUNT

                    db.query(

                        `
                        UPDATE prayer_requests
                        SET prayed_count =
                        prayed_count + 1
                        WHERE id = ?
                        `,

                        [prayer_id],

                        (err) => {

                            if(err){

                                console.log(err);

                                return res.send('Database Error');

                            }

                            res.redirect(
                                '/user/community-prayers'
                            );

                        }

                    );

                }

            );

        }

    );

};

// =====================================
// ADD TESTIMONY
// =====================================

exports.addTestimony = (req, res) => {

    const id =
    req.params.id;

    const testimony =
    req.body.testimony;

    db.query(

        `
        UPDATE prayer_requests
        SET testimony = ?
        WHERE id = ?
        `,

        [
            testimony,
            id
        ],

        (err) => {

            if(err){

                console.log(err);

                return res.send('Database Error');

            }

            res.redirect('/user/my-prayers');

        }

    );

};

// =====================================
// ADMIN MUSIC CLASSES PAGE
// =====================================

exports.adminMusicClasses = (req, res) => {

    // CHECK LOGIN

    if(!req.session.user){

        return res.redirect('/login');

    }

    db.query(

        `
        SELECT *
        FROM music_classes

        ORDER BY created_at DESC
        `,

        (err, results) => {

            if(err){

                console.log(err);

                return res.send(
                    'Database Error'
                );

            }

            // =====================================
            // ANALYTICS
            // =====================================

            const totalClasses =
            results.length;

            const trainers =
            [
                ...new Set(
                    results.map(
                        item => item.trainer
                    )
                )
            ].length;

            const schedules =
            [
                ...new Set(
                    results.map(
                        item => item.schedule
                    )
                )
            ].length;

            // =====================================
            // RENDER PAGE
            // =====================================

            res.render(

                'admin/music-classes',

                {

                    classes: results,

                    totalClasses,

                    trainers,

                    schedules,

                    user:
                    req.session.user

                }

            );

        }

    );

};

// =====================================
// CREATE MUSIC CLASS
// =====================================

exports.createMusicClass = (req, res) => {

    if(!req.session.user){

        return res.redirect('/login');

    }

    const {

        class_name,
        trainer,
        schedule,
        category,
        location,
        description

    } = req.body;

    // VALIDATION

    if(
        !class_name ||
        !trainer ||
        !schedule
    ){

        return res.send(
            'Please complete required fields'
        );

    }

    db.query(

        `
        INSERT INTO music_classes
        (
            class_name,
            trainer,
            schedule,
            category,
            location,
            description
        )

        VALUES (?, ?, ?, ?, ?, ?)
        `,

        [

            class_name,

            trainer,

            schedule,

            category || 'General',

            location || 'Church Building',

            description || 'No description provided'

        ],

        (err) => {

            if(err){

                console.log(err);

                return res.send(
                    'Failed To Create Music Class'
                );

            }

            res.redirect(
                '/admin/music-classes'
            );

        }

    );

};

// =====================================
// USER MUSIC CLASSES
// =====================================

exports.userMusicClasses = (req, res) => {

    if(!req.session.user){

        return res.redirect('/login');

    }

    const userId =
    req.session.user.id;

    db.query(

        `
        SELECT

        music_classes.*,

        (
            SELECT COUNT(*)
            FROM music_class_members

            WHERE music_class_members.class_id
            = music_classes.id
        )

        AS total_members,

        (
            SELECT COUNT(*)
            FROM music_class_members

            WHERE music_class_members.class_id
            = music_classes.id

            AND music_class_members.user_id = ?
        )

        AS joined

        FROM music_classes

        ORDER BY created_at DESC
        `,

        [userId],

        (err, results) => {

            if(err){

                console.log(err);

                return res.send(
                    'Database Error'
                );

            }

            res.render(

                'user/music-classes',

                {

                    classes: results,

                    user:
                    req.session.user

                }

            );

        }

    );

};

// =====================================
// VIEW SINGLE MUSIC CLASS
// =====================================

exports.viewMusicClass = (req, res) => {

    if(!req.session.user){

        return res.redirect('/login');

    }

    const id =
    req.params.id;

    db.query(

        `
        SELECT *
        FROM music_classes

        WHERE id = ?
        `,

        [id],

        (err, results) => {

            if(err){

                console.log(err);

                return res.send(
                    'Database Error'
                );

            }

            if(results.length === 0){

                return res.send(
                    'Music Class Not Found'
                );

            }

            res.render(

                'user/view-music-class',

                {

                    musicClass:
                    results[0],

                    user:
                    req.session.user

                }

            );

        }

    );

};

// =====================================
// JOIN MUSIC CLASS
// =====================================

exports.joinMusicClass = (req, res) => {

    if(!req.session.user){

        return res.redirect('/login');

    }

    const classId =
    req.params.id;

    const userId =
    req.session.user.id;

    // CHECK EXISTING MEMBER

    db.query(

        `
        SELECT *
        FROM music_class_members

        WHERE class_id = ?
        AND user_id = ?
        `,

        [
            classId,
            userId
        ],

        (err, results) => {

            if(err){

                console.log(err);

                return res.send(
                    'Database Error'
                );

            }

            // ALREADY JOINED

            if(results.length > 0){

                return res.redirect(
                    '/user/music-classes'
                );

            }

            // INSERT MEMBER

            db.query(

                `
                INSERT INTO
                music_class_members
                (
                    class_id,
                    user_id
                )

                VALUES (?, ?)
                `,

                [
                    classId,
                    userId
                ],

                (err) => {

                    if(err){

                        console.log(err);

                        return res.send(
                            'Database Error'
                        );

                    }

                    res.redirect(
                        '/user/my-music-classes'
                    );

                }

            );

        }

    );

};

// =====================================
// MY MUSIC CLASSES
// =====================================

exports.myMusicClasses = (req, res) => {

    if(!req.session.user){

        return res.redirect('/login');

    }

    const userId =
    req.session.user.id;

    db.query(

        `
        SELECT

        music_classes.*,

        music_class_members.created_at
        AS joined_at

        FROM music_class_members

        JOIN music_classes

        ON music_class_members.class_id
        = music_classes.id

        WHERE music_class_members.user_id = ?

        ORDER BY joined_at DESC
        `,

        [userId],

        (err, results) => {

            if(err){

                console.log(err);

                return res.send(
                    'Database Error'
                );

            }

            res.render(

                'user/my-music-classes',

                {

                    classes: results,

                    user:
                    req.session.user

                }

            );

        }

    );

};

// =====================================
// LEAVE MUSIC CLASS
// =====================================

exports.leaveMusicClass = (req, res) => {

    if(!req.session.user){

        return res.redirect('/login');

    }

    const classId =
    req.params.id;

    const userId =
    req.session.user.id;

    db.query(

        `
        DELETE FROM music_class_members

        WHERE class_id = ?
        AND user_id = ?
        `,

        [
            classId,
            userId
        ],

        (err) => {

            if(err){

                console.log(err);

                return res.send(
                    'Database Error'
                );

            }

            res.redirect(
                '/user/my-music-classes'
            );

        }

    );

};

// =====================================
// EDIT MUSIC CLASS PAGE
// =====================================

exports.editMusicClassPage = (req, res) => {

    if(!req.session.user){

        return res.redirect('/login');

    }

    const id =
    req.params.id;

    db.query(

        `
        SELECT *
        FROM music_classes

        WHERE id = ?
        `,

        [id],

        (err, results) => {

            if(err){

                console.log(err);

                return res.send(
                    'Database Error'
                );

            }

            if(results.length === 0){

                return res.send(
                    'Music Class Not Found'
                );

            }

            res.render(

                'admin/edit-music-class',

                {

                    musicClass:
                    results[0],

                    user:
                    req.session.user

                }

            );

        }

    );

};

// =====================================
// UPDATE MUSIC CLASS
// =====================================

exports.updateMusicClass = (req, res) => {

    if(!req.session.user){

        return res.redirect('/login');

    }

    const id =
    req.params.id;

    const {

        class_name,
        trainer,
        schedule,
        category,
        location,
        description

    } = req.body;

    db.query(

        `
        UPDATE music_classes

        SET

        class_name = ?,
        trainer = ?,
        schedule = ?,
        category = ?,
        location = ?,
        description = ?

        WHERE id = ?
        `,

        [

            class_name,
            trainer,
            schedule,
            category,
            location,
            description,
            id

        ],

        (err) => {

            if(err){

                console.log(err);

                return res.send(
                    'Database Error'
                );

            }

            res.redirect(
                '/admin/music-classes'
            );

        }

    );

};

// =====================================
// DELETE MUSIC CLASS
// =====================================

exports.deleteMusicClass = (req, res) => {

    if(!req.session.user){

        return res.redirect('/login');

    }

    const id =
    req.params.id;

    // DELETE MEMBERS FIRST

    db.query(

        `
        DELETE FROM music_class_members

        WHERE class_id = ?
        `,

        [id],

        (err) => {

            if(err){

                console.log(err);

                return res.send(
                    'Database Error'
                );

            }

            // DELETE CLASS

            db.query(

                `
                DELETE FROM music_classes

                WHERE id = ?
                `,

                [id],

                (err) => {

                    if(err){

                        console.log(err);

                        return res.send(
                            'Database Error'
                        );

                    }

                    res.redirect(
                        '/admin/music-classes'
                    );

                }

            );

        }

    );

};

// =====================================
// MUSIC CLASS MEMBERS
// =====================================

exports.musicClassMembers = (req, res) => {

    if(!req.session.user){

        return res.redirect('/login');

    }

    const classId =
    req.params.id;

    db.query(

        `
        SELECT

        users.fullname,
        users.email,

        music_class_members.created_at

        FROM music_class_members

        JOIN users

        ON music_class_members.user_id
        = users.id

        WHERE music_class_members.class_id = ?

        ORDER BY music_class_members.created_at DESC
        `,

        [classId],

        (err, results) => {

            if(err){

                console.log(err);

                return res.send(
                    'Database Error'
                );

            }

            res.render(

                'admin/music-class-members',

                {

                    members: results,

                    user:
                    req.session.user

                }

            );

        }

    );

};

// =====================================
// SEARCH MUSIC CLASSES
// =====================================

exports.searchMusicClasses = (req, res) => {

    if(!req.session.user){

        return res.redirect('/login');

    }

    const search =
    req.query.search || '';

    db.query(

        `
        SELECT *
        FROM music_classes

        WHERE

        class_name LIKE ?
        OR trainer LIKE ?
        OR category LIKE ?

        ORDER BY created_at DESC
        `,

        [

            `%${search}%`,
            `%${search}%`,
            `%${search}%`

        ],

        (err, results) => {

            if(err){

                console.log(err);

                return res.send(
                    'Database Error'
                );

            }

            const totalClasses =
            results.length;

            const trainers =
            [
                ...new Set(
                    results.map(
                        item => item.trainer
                    )
                )
            ].length;

            const schedules =
            [
                ...new Set(
                    results.map(
                        item => item.schedule
                    )
                )
            ].length;

            res.render(

                'admin/music-classes',

                {

                    classes: results,

                    totalClasses,

                    trainers,

                    schedules,

                    user:
                    req.session.user

                }

            );

        }

    );

};

// =====================================
// FILTER MUSIC CLASSES
// =====================================

exports.filterMusicClasses = (req, res) => {

    if(!req.session.user){

        return res.redirect('/login');

    }

    const category =
    req.query.category;

    db.query(

        `
        SELECT *
        FROM music_classes

        WHERE category = ?

        ORDER BY created_at DESC
        `,

        [category],

        (err, results) => {

            if(err){

                console.log(err);

                return res.send(
                    'Database Error'
                );

            }

            const totalClasses =
            results.length;

            const trainers =
            [
                ...new Set(
                    results.map(
                        item => item.trainer
                    )
                )
            ].length;

            const schedules =
            [
                ...new Set(
                    results.map(
                        item => item.schedule
                    )
                )
            ].length;

            res.render(

                'admin/music-classes',

                {

                    classes: results,

                    totalClasses,

                    trainers,

                    schedules,

                    user:
                    req.session.user

                }

            );

        }

    );

};