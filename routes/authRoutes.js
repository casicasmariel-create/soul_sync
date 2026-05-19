const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// =====================================
// LOGIN
// =====================================

router.get('/', authController.loginPage);

router.get('/login', authController.loginPage);

router.post('/login', authController.loginUser);

// =====================================
// REGISTER
// =====================================

router.get('/register', authController.registerPage);

router.post('/register', authController.registerUser);

// =====================================
// DASHBOARD
// =====================================

router.get('/dashboard', authController.dashboard);

// =====================================
// LOGOUT
// =====================================

router.get('/logout', authController.logoutUser);

// =====================================
// ANNOUNCEMENTS
// =====================================

// CREATE ANNOUNCEMENT PAGE

router.get(
'/admin/announcements',
authController.adminAnnouncements
);

// ANNOUNCEMENT LIST PAGE

router.get(
'/admin/announcements-list',
authController.adminAnnouncementList
);

// CREATE ANNOUNCEMENT

router.post(
'/admin/create-announcement',
authController.createAnnouncement
);

// EDIT ANNOUNCEMENT PAGE

router.get(
'/admin/edit-announcement/:id',
authController.editAnnouncementPage
);

// UPDATE ANNOUNCEMENT

router.post(
'/admin/update-announcement/:id',
authController.updateAnnouncement
);

// DELETE ANNOUNCEMENT

router.get(
'/admin/delete-announcement/:id',
authController.deleteAnnouncement
);

// USER ANNOUNCEMENTS

router.get(
'/user/announcements',
authController.userAnnouncements
);

// =====================================
// EVENTS
// =====================================

// CREATE EVENT PAGE

router.get(
'/admin/events',
authController.adminEvents
);

// EVENT LIST PAGE

router.get(
'/admin/event-list',
authController.eventListPage
);

// EVENT RESPONSES PAGE

router.get(
'/admin/event-responses/:id',
authController.eventResponsesPage
);

// CREATE EVENT

router.post(
'/admin/create-event',
authController.createEvent
);

// EDIT EVENT PAGE

router.get(
'/admin/edit-event/:id',
authController.editEventPage
);

// UPDATE EVENT

router.post(
'/admin/update-event/:id',
authController.updateEvent
);

// DELETE EVENT

router.get(
'/admin/delete-event/:id',
authController.deleteEvent
);

// USER EVENTS PAGE

router.get(
'/user/events',
authController.userEvents
);

// JOIN EVENT

router.get(
'/user/join-event/:id',
authController.joinEvent
);

// NOT JOIN EVENT

router.get(
'/user/not-join-event/:id',
authController.notJoinEvent
);

// =====================================
// PRAYER REQUESTS
// =====================================

// ADMIN PRAYER REQUESTS

router.get(
'/admin/prayer-requests',
authController.adminPrayerRequests
);

// =====================================
// PRAYER REQUEST LIST PAGE
// =====================================

router.get(
'/admin/prayer-request-list',
authController.prayerRequestListPage
);

// =====================================
// UPDATE PRAYER STATUS
// =====================================

router.get(
'/admin/update-prayer-status/:id/:status',
authController.updatePrayerStatus
);

// =====================================
// DELETE PRAYER REQUEST
// =====================================

router.get(
'/admin/delete-prayer/:id',
authController.deletePrayerRequest
);

// USER PRAYER REQUESTS

router.get(
'/user/prayer-requests',
authController.userPrayerRequests
);

// CREATE PRAYER REQUEST

router.post(
'/user/create-prayer-request',
authController.createPrayerRequest
);

// =====================================
// PRAYER REQUESTS
// =====================================

// ADMIN PRAYER REQUESTS

router.get(
'/admin/prayer-requests',
authController.adminPrayerRequests
);

// =====================================
// PRAYER REQUEST LIST PAGE
// =====================================

router.get(
'/admin/prayer-request-list',
authController.prayerRequestListPage
);

// =====================================
// UPDATE PRAYER STATUS
// =====================================

router.get(
'/admin/update-prayer-status/:id/:status',
authController.updatePrayerStatus
);

// =====================================
// DELETE PRAYER REQUEST
// =====================================

router.get(
'/admin/delete-prayer/:id',
authController.deletePrayerRequest
);

// USER PRAYER REQUESTS

router.get(
'/user/prayer-requests',
authController.userPrayerRequests
);

// CREATE PRAYER REQUEST

router.post(
'/user/create-prayer-request',
authController.createPrayerRequest
);

// =====================================
// MUSIC CLASSES
// =====================================

// ADMIN MUSIC CLASSES

router.get(
'/admin/music-classes',
authController.adminMusicClasses
);

// CREATE MUSIC CLASS

router.post(
'/admin/create-music-class',
authController.createMusicClass
);

// USER MUSIC CLASSES

router.get(
'/user/music-classes',
authController.userMusicClasses
);

module.exports = router;