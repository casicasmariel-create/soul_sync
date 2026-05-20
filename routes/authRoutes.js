const express = require('express');

const router = express.Router();

const authController =
require('../controllers/authController');



// =====================================
// LOGIN
// =====================================

router.get(
'/',
authController.loginPage
);

router.get(
'/login',
authController.loginPage
);

router.post(
'/login',
authController.loginUser
);



// =====================================
// REGISTER
// =====================================

router.get(
'/register',
authController.registerPage
);

router.post(
'/register',
authController.registerUser
);



// =====================================
// DASHBOARD
// =====================================

router.get(
'/dashboard',
authController.dashboard
);



// =====================================
// LOGOUT
// =====================================

router.get(
'/logout',
authController.logoutUser
);



// =====================================
// ANNOUNCEMENTS
// =====================================

// ADMIN CREATE PAGE

router.get(
'/admin/announcements',
authController.adminAnnouncements
);

// ANNOUNCEMENT LIST

router.get(
'/admin/announcements-list',
authController.adminAnnouncementList
);

// CREATE ANNOUNCEMENT

router.post(
'/admin/create-announcement',
authController.createAnnouncement
);

// EDIT PAGE

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

// ADMIN EVENTS PAGE

router.get(
'/admin/events',
authController.adminEvents
);

// EVENT LIST PAGE

router.get(
'/admin/event-list',
authController.eventListPage
);

// EVENT RESPONSES

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

// ADMIN PAGE

router.get(
'/admin/prayer-requests',
authController.adminPrayerRequests
);

// PRAYER LIST PAGE

router.get(
'/admin/prayer-request-list',
authController.prayerRequestListPage
);

// UPDATE PRAYER STATUS

router.get(
'/user/update-my-prayer-status/:id/:status',
authController.updateMyPrayerStatus
);

// SAVE TESTIMONY

router.post(
'/user/save-testimony/:id',
authController.saveTestimony
);

// DELETE PRAYER

router.get(
'/admin/delete-prayer/:id',
authController.deletePrayerRequest
);

// USER CREATE PAGE

router.get(
'/user/prayer-requests',
authController.userPrayerRequests
);

// MY PRAYERS

router.get(
'/user/my-prayers',
authController.userMyPrayers
);

// COMMUNITY PRAYERS

router.get(
'/user/community-prayers',
authController.communityPrayers
);

// EDIT PRAYER PAGE

router.get(
'/user/edit-prayer/:id',
authController.editPrayerPage
);

// UPDATE PRAYER

router.post(
'/user/update-prayer/:id',
authController.updatePrayer
);

// DELETE USER PRAYER

router.get(
'/user/delete-prayer/:id',
authController.deleteUserPrayer
);

// CREATE PRAYER REQUEST

router.post(
'/user/create-prayer-request',
authController.createPrayerRequest
);

// PRAY FOR REQUEST

router.get(
'/user/pray-for/:id',
authController.prayForRequest
);

// ADD TESTIMONY

router.post(
'/user/add-testimony/:id',
authController.addTestimony
);



// =====================================
// MUSIC CLASSES
// =====================================

// ADMIN MUSIC PAGE

router.get(
'/admin/music-classes',
authController.adminMusicClasses
);

// CREATE MUSIC CLASS

router.post(
'/admin/create-music-class',
authController.createMusicClass
);

// EDIT MUSIC CLASS PAGE

router.get(
'/admin/edit-music-class/:id',
authController.editMusicClassPage
);

// UPDATE MUSIC CLASS

router.post(
'/admin/update-music-class/:id',
authController.updateMusicClass
);

// DELETE MUSIC CLASS

router.get(
'/admin/delete-music-class/:id',
authController.deleteMusicClass
);

// USER MUSIC PAGE

router.get(
'/user/music-classes',
authController.userMusicClasses
);

// VIEW SINGLE MUSIC CLASS

router.get(
'/user/view-music-class/:id',
authController.viewMusicClass
);

// JOIN MUSIC CLASS

router.get(
'/user/join-music-class/:id',
authController.joinMusicClass
);

// MY MUSIC CLASSES

router.get(
'/user/my-music-classes',
authController.myMusicClasses
);

// LEAVE MUSIC CLASS

router.get(
'/user/leave-music-class/:id',
authController.leaveMusicClass
);



// =====================================
// EXPORT ROUTER
// =====================================

module.exports = router;