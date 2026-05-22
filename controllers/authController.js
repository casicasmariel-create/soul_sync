require('dotenv').config();

const db = require('../config/db');
const bcrypt = require('bcrypt');
const QRCode = require('qrcode');

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
// ADMIN DASHBOARD
// =====================================

exports.dashboard = async (req, res) => {

try{

// =====================================
// CHECK LOGIN
// =====================================

if(!req.session.user){

return res.redirect('/login');

}

// =====================================
// ADMIN ONLY
// =====================================

if(req.session.user.role !== 'admin'){

return res.redirect('/user/dashboard');

}

// =====================================
// TOTAL MEMBERS
// =====================================

const [memberResult] =
await db.promise().query(

`
SELECT COUNT(*) AS totalMembers
FROM users
`

);

// =====================================
// TOTAL EVENTS
// =====================================

const [eventResult] =
await db.promise().query(

`
SELECT COUNT(*) AS totalEvents
FROM events
`

);

// =====================================
// TOTAL PRAYER REQUESTS
// =====================================

const [prayerResult] =
await db.promise().query(

`
SELECT COUNT(*) AS totalPrayers
FROM prayer_requests
`

);

// =====================================
// TOTAL MUSIC CLASSES
// =====================================

const [musicResult] =
await db.promise().query(

`
SELECT COUNT(*) AS totalMusicClasses
FROM music_classes
`

);

// =====================================
// FINAL COUNTS
// =====================================

const totalMembers =
memberResult[0].totalMembers;

const totalEvents =
eventResult[0].totalEvents;

const totalPrayers =
prayerResult[0].totalPrayers;

const totalMusicClasses =
musicResult[0].totalMusicClasses;

// =====================================
// RENDER DASHBOARD
// =====================================

res.render(

'admin/dashboard',

{

user:req.session.user,

totalMembers,
totalEvents,
totalPrayers,
totalMusicClasses

}

);

}catch(error){

console.log(error);

return res.send(
'Dashboard Error'
);

}

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

    // =====================================
    // CHECK LOGIN
    // =====================================

    if(!req.session.user){

        return res.redirect('/login');

    }

    const eventId =
    req.params.id;

    const userId =
    req.session.user.id;

    const fullname =
    req.session.user.fullname;

    // =====================================
    // CHECK EXISTING RESPONSE
    // =====================================

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

                return res.send(
                    'Database Error'
                );

            }

            // =====================================
            // UPDATE EXISTING RESPONSE
            // =====================================

            if(results.length > 0){

                db.query(

                    `
                    UPDATE event_responses

                    SET response_status = ?

                    WHERE event_id = ?
                    AND user_id = ?
                    `,

                    [
                        'JOINING',
                        eventId,
                        userId
                    ],

                    (err) => {

                        if(err){

                            console.log(err);

                            return res.send(
                                'Update Failed'
                            );

                        }

                        return res.redirect(
                            '/user/events'
                        );

                    }

                );

            }

            // =====================================
            // INSERT NEW RESPONSE
            // =====================================

            else{

                db.query(

                    `
                    INSERT INTO event_responses
                    (
                        event_id,
                        user_id,
                        fullname,
                        response_status
                    )

                    VALUES (?, ?, ?, ?)
                    `,

                    [
                        eventId,
                        userId,
                        fullname,
                        'JOINING'
                    ],

                    (err) => {

                        if(err){

                            console.log(err);

                            return res.send(
                                'Insert Failed'
                            );

                        }

                        return res.redirect(
                            '/user/events'
                        );

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

    // =====================================
    // CHECK LOGIN
    // =====================================

    if(!req.session.user){

        return res.redirect('/login');

    }

    const eventId =
    req.params.id;

    const userId =
    req.session.user.id;

    const fullname =
    req.session.user.fullname;

    // =====================================
    // CHECK EXISTING RESPONSE
    // =====================================

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

                return res.send(
                    'Database Error'
                );

            }

            // =====================================
            // UPDATE EXISTING RESPONSE
            // =====================================

            if(results.length > 0){

                db.query(

                    `
                    UPDATE event_responses

                    SET response_status = ?

                    WHERE event_id = ?
                    AND user_id = ?
                    `,

                    [
                        'NOT JOINING',
                        eventId,
                        userId
                    ],

                    (err) => {

                        if(err){

                            console.log(err);

                            return res.send(
                                'Update Failed'
                            );

                        }

                        return res.redirect(
                            '/user/events'
                        );

                    }

                );

            }

            // =====================================
            // INSERT NEW RESPONSE
            // =====================================

            else{

                db.query(

                    `
                    INSERT INTO event_responses
                    (
                        event_id,
                        user_id,
                        fullname,
                        response_status
                    )

                    VALUES (?, ?, ?, ?)
                    `,

                    [
                        eventId,
                        userId,
                        fullname,
                        'NOT JOINING'
                    ],

                    (err) => {

                        if(err){

                            console.log(err);

                            return res.send(
                                'Insert Failed'
                            );

                        }

                        return res.redirect(
                            '/user/events'
                        );

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
        SELECT
            prayer_requests.*,

            (
                SELECT COUNT(*)
                FROM prayer_supports
                WHERE prayer_supports.prayer_id = prayer_requests.id
            ) AS support_count

        FROM prayer_requests

        ORDER BY created_at DESC
        `,

        (err, prayers) => {

            if(err){

                console.log(err);

                return res.send(
                    'Database Error'
                );

            }

            // ANALYTICS

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

            // RENDER PAGE

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
        SELECT

            prayer_requests.*,

            (
                SELECT COUNT(*)
                FROM prayer_supports
                WHERE prayer_supports.prayer_id = prayer_requests.id
            ) AS support_count

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

    // =====================================
    // CHECK LOGIN
    // =====================================

    if(!req.session.user){

        return res.redirect('/login');

    }

    const prayer_id =
    req.params.id;

    const fullname =
    req.session.user.fullname;

    // =====================================
    // CHECK IF ALREADY PRAYED
    // =====================================

    db.query(

        `
        SELECT *
        FROM prayer_supports
        WHERE prayer_id = ?
        AND fullname = ?
        `,

        [
            prayer_id,
            fullname
        ],

        (err, results) => {

            // DATABASE ERROR

            if(err){

                console.log(err);

                return res.send(
                    'Database Error'
                );

            }

            // =====================================
            // ALREADY PRAYED
            // =====================================

            if(results.length > 0){

                return res.send(`

                <script>

                alert(
                'You already prayed for this request.'
                );

                window.location.href =
                '/user/community-prayers';

                </script>

                `);

            }

            // =====================================
            // INSERT SUPPORT
            // =====================================

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

                    // INSERT ERROR

                    if(err){

                        console.log(err);

                        return res.send(
                            'Insert Failed'
                        );

                    }

                    // =====================================
                    // UPDATE PRAYER COUNT
                    // =====================================

                    db.query(

                        `
                        UPDATE prayer_requests

                        SET prayed_count =
                        prayed_count + 1

                        WHERE id = ?
                        `,

                        [prayer_id],

                        (err) => {

                            // UPDATE ERROR

                            if(err){

                                console.log(err);

                                return res.send(
                                    'Update Failed'
                                );

                            }

                            // SUCCESS

                            return res.send(`

                            <script>

                            alert(
                            'Prayer support added successfully.'
                            );

                            window.location.href =
                            '/user/community-prayers';

                            </script>

                            `);

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

    // ADMIN ONLY

    if(req.session.user.role !== 'admin'){

        return res.redirect('/dashboard');

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

            // ANALYTICS

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
// CREATE MUSIC CLASS
// =====================================

exports.createMusicClass = (req, res) => {

    if(!req.session.user){

        return res.redirect('/login');

    }

    if(req.session.user.role !== 'admin'){

        return res.redirect('/dashboard');

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

            WHERE music_class_members.music_class_id
            = music_classes.id

        )

        AS total_members,

        (

            SELECT COUNT(*)

            FROM music_class_members

            WHERE music_class_members.music_class_id
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
// VIEW MUSIC CLASS
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

    const userId =
    req.session.user.id;

    const classId =
    req.params.id;

    // CHECK EXISTING MEMBER

    db.query(

        `
        SELECT *

        FROM music_class_members

        WHERE user_id = ?
        AND music_class_id = ?
        `,

        [

            userId,
            classId

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
                INSERT INTO music_class_members
                (
                    user_id,
                    music_class_id
                )

                VALUES (?, ?)
                `,

                [

                    userId,
                    classId

                ],

                (err) => {

                    if(err){

                        console.log(err);

                        return res.send(
                            'Failed To Join'
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

        ON music_class_members.music_class_id
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

        WHERE music_class_id = ?
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

    if(req.session.user.role !== 'admin'){

        return res.redirect('/dashboard');

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

    if(req.session.user.role !== 'admin'){

        return res.redirect('/dashboard');

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

    if(req.session.user.role !== 'admin'){

        return res.redirect('/dashboard');

    }

    const id =
    req.params.id;

    // DELETE MEMBERS FIRST

    db.query(

        `
        DELETE FROM music_class_members

        WHERE music_class_id = ?
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

    if(req.session.user.role !== 'admin'){

        return res.redirect('/dashboard');

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

        WHERE music_class_members.music_class_id = ?

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
// MUSIC CLASS ATTENDANCE PAGE
// =====================================

exports.musicClassAttendancePage = async (req, res) => {

    try{

        // =====================================
        // CLASS ID
        // =====================================

        const classId =
        req.params.id;

        // =====================================
        // GET CLASS INFO
        // =====================================

        const [musicClassResult] =
        await db.promise().query(

            `
            SELECT *
            FROM music_classes
            WHERE id = ?
            `,

            [classId]

        );

        // =====================================
        // CHECK CLASS
        // =====================================

        if(musicClassResult.length === 0){

            return res.send(
                'Music class not found.'
            );

        }

        // =====================================
        // SINGLE CLASS
        // =====================================

        const musicClass =
        musicClassResult[0];

        // =====================================
        // TODAY DATE
        // =====================================

        const attendanceDate =
        new Date()
        .toISOString()
        .split('T')[0];

        // =====================================
        // GET MEMBERS
        // =====================================

        const [members] =
        await db.promise().query(

            `
            SELECT

            users.id,
            users.fullname,
            users.email

            FROM music_class_members

            JOIN users
            ON music_class_members.user_id = users.id

            WHERE music_class_members.music_class_id = ?

            ORDER BY users.fullname ASC
            `,

            [classId]

        );

        // =====================================
        // GET TODAY ATTENDANCE
        // =====================================

        const [attendanceRows] =
        await db.promise().query(

        `
        SELECT

        user_id,
        status

        FROM music_class_attendance

        WHERE music_class_id = ?
        AND attendance_date = CURDATE()
        AND created_at >= ?
        `,

        [
        classId,
        musicClass.attendance_start_time
        ]

);
        // =====================================
        // CREATE ATTENDANCE MAP
        // =====================================

        const attendanceMap = {};

        attendanceRows.forEach(item => {

            attendanceMap[item.user_id] =
            item.status;

        });

        // =====================================
        // FINAL MEMBERS
        // =====================================

        const finalMembers =
        members.map(member => {

            return {

                ...member,

                attendance_status:
                attendanceMap[member.id] || null

            };

        });

        // =====================================
        // RENDER PAGE
        // =====================================

        return res.render(

            'admin/music-class-attendance',

            {

                members:
                finalMembers,

                classId,

                musicClass,

                user:
                req.session.user

            }

        );

    }

    catch(error){

        console.log(error);

        return res.send(
            'Database Error'
        );

    }

};

// =====================================
// OPEN ATTENDANCE SESSION
// =====================================

exports.openAttendance = async (req, res) => {

try{

// =====================================
// CLASS ID
// =====================================

const classId =
req.params.id;

// =====================================
// CREATE NEW SESSION
// =====================================

const [sessionResult] =
await db.promise().query(

`
INSERT INTO music_attendance_sessions (

music_class_id,
session_date,
opened_at

)

VALUES (

?,
CURDATE(),
NOW()

)
`,

[classId]

);

// =====================================
// SESSION ID
// =====================================

const sessionId =
sessionResult.insertId;

// =====================================
// OPEN ATTENDANCE
// =====================================

await db.promise().query(

`
UPDATE music_classes

SET

attendance_open = 'OPEN',
attendance_start_time =
CONVERT_TZ(NOW(), '+00:00', '+08:00'),
current_session_id = ?

WHERE id = ?
`,

[
sessionId,
classId
]

);

// =====================================
// SUCCESS
// =====================================

return res.redirect(
'/admin/music-classes'
);

}catch(error){

console.log(error);

return res.send(
'Error Opening Attendance'
);

}

};

// =====================================
// CLOSE ATTENDANCE SESSION
// =====================================

exports.closeAttendance = async (req, res) => {

try{

// =====================================
// CLASS ID
// =====================================

const classId =
req.params.id;

// =====================================
// GET CLASS
// =====================================

const [classRows] =
await db.promise().query(

`
SELECT *
FROM music_classes
WHERE id = ?
`,

[classId]

);

// =====================================
// CHECK CLASS
// =====================================

if(classRows.length === 0){

return res.send(
'Music class not found.'
);

}

// =====================================
// CLASS DATA
// =====================================

const musicClass =
classRows[0];

// =====================================
// SESSION ID
// =====================================

const currentSessionId =
musicClass.current_session_id;

// =====================================
// GET MEMBERS
// =====================================

const [members] =
await db.promise().query(

`
SELECT user_id
FROM music_class_members
WHERE music_class_id = ?
`,

[classId]

);

// =====================================
// LOOP ALL MEMBERS
// =====================================

for(const member of members){

// =====================================
// CHECK IF ALREADY ATTENDED
// =====================================

const [existingAttendance] =
await db.promise().query(

`
SELECT *
FROM music_class_attendance

WHERE

music_class_id = ?
AND user_id = ?
AND session_id = ?
`,

[
classId,
member.user_id,
currentSessionId
]

);

// =====================================
// AUTO ABSENT
// =====================================

if(existingAttendance.length === 0){

await db.promise().query(

`
INSERT INTO music_class_attendance (

music_class_id,
user_id,
attendance_date,
status,
check_in_time,
session_id,
created_at

)

VALUES (

?,
?,
CURDATE(),
?,
NULL,
?,
NOW()

)
`,

[
classId,
member.user_id,
'Absent',
currentSessionId
]

);

}

}

// =====================================
// CLOSE SESSION
// =====================================

await db.promise().query(

`
UPDATE music_classes

SET

attendance_open = 'CLOSED'

WHERE id = ?
`,

[classId]

);

// =====================================
// SUCCESS
// =====================================

return res.send(`

<script>

alert('Attendance closed successfully.');

window.location.href =
'/admin/music-classes';

</script>

`);

}catch(error){

console.log(error);

return res.send(
'Close Attendance Failed'
);

}

};

// =====================================
// USER MUSIC ATTENDANCE
// =====================================

exports.userMusicAttendance = (req, res) => {

    // =====================================
    // CHECK LOGIN
    // =====================================

    if(!req.session.user){

        return res.redirect('/login');

    }

    // =====================================
    // USER ONLY
    // =====================================

    if(req.session.user.role === 'admin'){

        return res.redirect('/dashboard');

    }

    // =====================================
    // USER ID
    // =====================================

    const userId =
    req.session.user.id;

    // =====================================
    // GET ATTENDANCE
    // =====================================

    db.query(

        `
        SELECT

        music_class_attendance.*,

        music_classes.class_name

        FROM music_class_attendance

        INNER JOIN music_classes

        ON music_classes.id =
        music_class_attendance.music_class_id

        WHERE music_class_attendance.user_id = ?

        ORDER BY
        music_class_attendance.attendance_date DESC
        `,

        [userId],

        (err, attendance) => {

            if(err){

                console.log(err);

                return res.send(
                    'Database Error'
                );

            }

            // =====================================
            // RENDER PAGE
            // =====================================

            res.render(

                'user/music-attendance',

                {

                    attendance,

                    user:
                    req.session.user

                }

            );

        }

    );

};

// =====================================
// RECORD MUSIC CLASS ATTENDANCE
// =====================================

exports.recordAttendance = async (req, res) => {

try{

// USER ID

const userId =
req.session.user.id;

// CLASS ID

const classId =
req.params.id;

// GET CLASS

const [classRows] =
await db.promise().query(

`
SELECT *
FROM music_classes
WHERE id = ?
`,

[classId]

);

// CHECK CLASS

if(classRows.length === 0){

return res.send(
'Music class not found.'
);

}

// CLASS DATA

const musicClass =
classRows[0];

// CHECK IF OPEN

if(musicClass.attendance_open !== 'OPEN'){

return res.send(
'Attendance is currently closed.'
);

}

// ACTIVE SESSION

const currentSessionId =
musicClass.current_session_id;

// CURRENT TIME

const now =
new Date();

// OPEN TIME

const openTime =
new Date(
musicClass.attendance_start_time
);

// TIME DIFFERENCE

const diffMinutes =

Math.floor(

(now - openTime)

/

1000

/

60

);

// STATUS

let status = 'Present';

if(diffMinutes > 15){

status = 'Late';

}

// CHECK DUPLICATE

const [existingAttendance] =
await db.promise().query(

`
SELECT *
FROM music_class_attendance

WHERE

music_class_id = ?
AND user_id = ?
AND session_id = ?
`,

[
classId,
userId,
currentSessionId
]

);

// ALREADY RECORDED

if(existingAttendance.length > 0){

return res.send(`

<script>

alert('Attendance already recorded.');

window.location.href =
'/user/music-classes';

</script>

`);

}

// INSERT ATTENDANCE

await db.promise().query(

`
INSERT INTO music_class_attendance (

music_class_id,
user_id,
attendance_date,
status,
check_in_time,
session_id,
created_at

)

VALUES (

?,
?,
CURDATE(),
?,
CONVERT_TZ(NOW(), '+00:00', '+08:00'),
?,
NOW()

)
`,

[
classId,
userId,
status,
currentSessionId
]

);

// SUCCESS

return res.send(`

<script>

alert('Attendance recorded successfully.');

window.location.href =
'/user/music-classes';

</script>

`);

}catch(error){

console.log(error);

return res.send(
'Attendance Failed'
);

}

};

// =====================================
// MUSIC ATTENDANCE ANALYTICS
// =====================================

exports.musicAttendanceAnalytics = async (req, res) => {

try{

// =====================================
// TOTAL PRESENT
// =====================================

const [presentResult] =
await db.promise().query(

`
SELECT COUNT(*) AS total
FROM music_class_attendance
WHERE status = 'Present'
`
);

// =====================================
// TOTAL LATE
// =====================================

const [lateResult] =
await db.promise().query(

`
SELECT COUNT(*) AS total
FROM music_class_attendance
WHERE status = 'Late'
`
);

// =====================================
// TOTAL ABSENT
// =====================================

const [absentResult] =
await db.promise().query(

`
SELECT COUNT(*) AS total
FROM music_class_attendance
WHERE status = 'Absent'
`
);

// =====================================
// TOTAL RECORDS
// =====================================

const [totalResult] =
await db.promise().query(

`
SELECT COUNT(*) AS total
FROM music_class_attendance
`
);

// =====================================
// SESSION HISTORY
// =====================================

const [sessionHistory] =
await db.promise().query(

`
SELECT

music_attendance_sessions.id AS session_id,

music_attendance_sessions.session_date,

music_classes.class_name,

users.fullname,

music_class_attendance.status,

music_class_attendance.check_in_time

FROM music_class_attendance

LEFT JOIN users
ON music_class_attendance.user_id = users.id

LEFT JOIN music_attendance_sessions
ON music_class_attendance.session_id =
music_attendance_sessions.id

LEFT JOIN music_classes
ON music_attendance_sessions.music_class_id =
music_classes.id

ORDER BY
music_attendance_sessions.id DESC,
music_class_attendance.check_in_time ASC
`
);

// =====================================
// ATTENDANCE RATE
// =====================================

let attendanceRate = 0;

if(totalResult[0].total > 0){

attendanceRate = (

(
presentResult[0].total /
totalResult[0].total
) * 100

).toFixed(1);

}

// =====================================
// RENDER PAGE
// =====================================

res.render(

'admin/music-attendance-analytics',

{

totalPresent:
presentResult[0].total,

totalLate:
lateResult[0].total,

totalAbsent:
absentResult[0].total,

attendanceRate,

sessionHistory,

user:
req.session.user

}

);

}catch(error){

console.log(error);

return res.send(error.message);

}

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

// =====================================
// REGISTER USER
// =====================================

exports.registerUser = async (req, res) => {

    const {

        fullname,
        email,
        password

    } = req.body;

    // CHECK EMPTY FIELDS

    if(!fullname || !email || !password){

        return res.send(
            'Please fill in all fields'
        );

    }

    // CHECK EXISTING EMAIL

    db.query(

        `
        SELECT *
        FROM users
        WHERE email = ?
        `,

        [email],

        async (err, results) => {

            // DATABASE ERROR

            if(err){

                console.log(err);

                return res.send(
                    'Database Error'
                );

            }

            // EMAIL EXISTS

            if(results.length > 0){

                return res.send(
                    'Email Already Exists'
                );

            }

            try{

                // HASH PASSWORD

                const hashedPassword =
                await bcrypt.hash(password, 10);

                // =====================================
                // AUTO ADMIN DETECTION
                // =====================================

                const role =

                email === 'casicasmariel@gmail.com'

                ? 'admin'

                : 'youth_member';

                // =====================================
                // INSERT USER
                // =====================================

                db.query(

                    `
                    INSERT INTO users
                    (
                        fullname,
                        email,
                        password,
                        role
                    )

                    VALUES (?, ?, ?, ?)
                    `,

                    [

                        fullname,
                        email,
                        hashedPassword,
                        role

                    ],

                    (err) => {

                        // INSERT ERROR

                        if(err){

                            console.log(err);

                            return res.send(
                                'Registration Failed'
                            );

                        }

                        // SUCCESS

                        res.redirect('/login');

                    }

                );

            }

            catch(error){

                console.log(error);

                return res.send(
                    'Server Error'
                );

            }

        }

    );

};


// =====================================
// LOGIN USER
// =====================================

exports.loginUser = (req, res) => {

    const {

        email,
        password

    } = req.body;

    db.query(

        `
        SELECT *
        FROM users
        WHERE email = ?
        `,

        [email],

        async (err, results) => {

            if(err){

                console.log(err);

                return res.send(
                    'Database Error'
                );

            }

            // USER NOT FOUND

            if(results.length === 0){

                return res.send(
                    'User Not Found'
                );

            }

            const user =
            results[0];

            // CHECK PASSWORD

            const match =
            await bcrypt.compare(

                password,
                user.password

            );

            
            if(!match){

            return res.send(`

            <html>

            <head>

            <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
            />

            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

            </head>

            <body
            style="
            background:#12001f;
            "
            >

            <script>

            Swal.fire({

            icon: 'error',

            title: 'Authentication Failed',

            text: 'Incorrect password. Please try again.',

            confirmButtonColor: '#6a0dad',

            background: '#2c003e',

            color: '#ffffff',

            showClass: {

            popup: 'animate__animated animate__fadeInDown'

            },

            hideClass: {

            popup: 'animate__animated animate__fadeOutUp'

            }

            }).then(() => {

            window.location.href = '/login';

            });

            </script>

            </body>

            </html>

            `);

            }

            // SESSION

            req.session.user = {

                id:
                user.id,

                fullname:
                user.fullname,

                email:
                user.email,

                role:
                user.role

            };

            // =====================================
            // ADMIN LOGIN
            // =====================================

            if(user.role === 'admin'){

                return res.redirect(
                    '/dashboard'
                );

            }

            // =====================================
            // USER LOGIN
            // =====================================

            else{

                return res.redirect(
                    '/user/dashboard'
                );

            }

        }

    );

};



// =====================================
// LOGOUT USER
// =====================================

exports.logoutUser = (req, res) => {

    req.session.destroy(() => {

        res.redirect('/login');

    });

};
// =====================================
// MANAGE MEMBERS PAGE
// =====================================

exports.manageMembers = async (req, res) => {

try{

const [members] =
await db.promise().query(

`
SELECT *
FROM users
ORDER BY id DESC
`

);

res.render(

'admin/manage-members',

{

members,
user:req.session.user

}

);

}catch(error){

console.log(error);

return res.send(
'Manage Members Error'
);

}

};

// =====================================
// DELETE MEMBER
// =====================================

exports.deleteMember = async (req, res) => {

try{

const memberId =
req.params.id;

await db.promise().query(

`
DELETE FROM users
WHERE id = ?
`,

[memberId]

);

return res.redirect(
'/admin/manage-members'
);

}catch(error){

console.log(error);

return res.send(
'Delete Member Error'
);

}

};

// =====================================
// USER DASHBOARD
// =====================================

exports.userDashboard = async (req, res) => {

try{

// =====================================
// CHECK SESSION
// =====================================

if(!req.session.user){

return res.redirect('/login');

}

// USER ID

const userId =
req.session.user.id;

// DEFAULT VALUES

let joinedClasses = 0;
let joinedEvents = 0;
let prayerCount = 0;
let attendanceCount = 0;

// =====================================
// MUSIC CLASSES
// =====================================

try{

const [musicResult] =
await db.promise().query(

`
SELECT COUNT(*) AS total
FROM music_class_attendance
WHERE user_id = ?
`,

[userId]

);

joinedClasses =
musicResult[0].total;

}catch(error){

console.log(
'Music Classes Table Missing'
);

}

// =====================================
// EVENTS
// =====================================

try{

const [eventResult] =
await db.promise().query(

`
SELECT COUNT(*) AS total
FROM events
`

);

joinedEvents =
eventResult[0].total;

}catch(error){

console.log(
'Events Table Missing'
);

}

// =====================================
// PRAYER REQUESTS
// =====================================

try{

const [prayerResult] =
await db.promise().query(

`
SELECT COUNT(*) AS total
FROM prayer_requests
WHERE user_id = ?
`,

[userId]

);

prayerCount =
prayerResult[0].total;

}catch(error){

console.log(
'Prayer Requests Table Missing'
);

}

// =====================================
// ATTENDANCE
// =====================================

try{

const [attendanceResult] =
await db.promise().query(

`
SELECT COUNT(*) AS total
FROM music_class_attendance
WHERE user_id = ?
`,

[userId]

);

attendanceCount =
attendanceResult[0].total;

}catch(error){

console.log(
'Attendance Table Missing'
);

}

// =====================================
// RENDER DASHBOARD
// =====================================

res.render(

'user/dashboard',

{

user:req.session.user,

joinedClasses,
joinedEvents,
prayerCount,
attendanceCount

}

);

}catch(error){

console.log(error);

return res.send(
'User Dashboard Error'
);

}

};