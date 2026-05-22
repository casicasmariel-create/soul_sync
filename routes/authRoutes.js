const express = require('express');

const router = express.Router();

const authController =
require('../controllers/authController');



// =====================================
// AUTHENTICATION
// =====================================

// LOGIN PAGE

router.get(
    '/',
    authController.loginPage
);

router.get(
    '/login',
    authController.loginPage
);

// LOGIN USER

router.post(
    '/login',
    authController.loginUser
);

// REGISTER PAGE

router.get(
    '/register',
    authController.registerPage
);

// REGISTER USER

router.post(
    '/register',
    authController.registerUser
);

// DASHBOARD

router.get(
    '/dashboard',
    authController.dashboard
);

// =====================================
// USER DASHBOARD
// =====================================

router.get(
    '/user/dashboard',
    authController.userDashboard
);

// LOGOUT

router.get(
    '/logout',
    authController.logoutUser
);



// =====================================
// ANNOUNCEMENTS
// =====================================

// ADMIN CREATE ANNOUNCEMENT PAGE

router.get(
    '/admin/announcements',
    authController.adminAnnouncements
);

// ADMIN ANNOUNCEMENT LIST PAGE

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

// USER ANNOUNCEMENTS PAGE

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

// ADMIN PRAYER PAGE

router.get(
    '/admin/prayer-requests',
    authController.adminPrayerRequests
);

// ADMIN PRAYER LIST PAGE

router.get(
    '/admin/prayer-request-list',
    authController.prayerRequestListPage
);

// DELETE PRAYER REQUEST

router.get(
    '/admin/delete-prayer/:id',
    authController.deletePrayerRequest
);

// USER CREATE PRAYER PAGE

router.get(
    '/user/prayer-requests',
    authController.userPrayerRequests
);

// CREATE PRAYER REQUEST

router.post(
    '/user/create-prayer-request',
    authController.createPrayerRequest
);

// USER MY PRAYERS PAGE

router.get(
    '/user/my-prayers',
    authController.userMyPrayers
);

// COMMUNITY PRAYERS PAGE

router.get(
    '/user/community-prayers',
    authController.communityPrayers
);

// PRAY FOR REQUEST

router.get(
    '/user/pray-for-request/:id',
    authController.prayForRequest
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

// UPDATE MY PRAYER STATUS

router.get(
    '/user/update-my-prayer-status/:id/:status',
    authController.updateMyPrayerStatus
);

// SAVE TESTIMONY

router.post(
    '/user/save-testimony/:id',
    authController.saveTestimony
);

// ADD TESTIMONY

router.post(
    '/user/add-testimony/:id',
    authController.addTestimony
);


// =====================================
// MANAGE MEMBERS
// =====================================

// ADMIN MANAGE MEMBERS PAGE

router.get(
    '/admin/manage-members',
    authController.manageMembers
);

// DELETE MEMBER

router.get(
    '/admin/delete-member/:id',
    authController.deleteMember
);


// =====================================
// MUSIC CLASSES
// =====================================

// =====================================
// ADMIN MUSIC CLASSES PAGE
// =====================================

router.get(
    '/admin/music-classes',
    authController.adminMusicClasses
);

// =====================================
// CREATE MUSIC CLASS
// =====================================

router.post(
    '/admin/create-music-class',
    authController.createMusicClass
);

// =====================================
// EDIT MUSIC CLASS PAGE
// =====================================

router.get(
    '/admin/edit-music-class/:id',
    authController.editMusicClassPage
);

// =====================================
// UPDATE MUSIC CLASS
// =====================================

router.post(
    '/admin/update-music-class/:id',
    authController.updateMusicClass
);

// =====================================
// DELETE MUSIC CLASS
// =====================================

router.get(
    '/admin/delete-music-class/:id',
    authController.deleteMusicClass
);

// =====================================
// MUSIC CLASS MEMBERS PAGE
// =====================================

router.get(
    '/admin/music-class-members/:id',
    authController.musicClassMembers
);

// =====================================
// MUSIC CLASS ATTENDANCE PAGE
// =====================================

router.get(
    '/admin/music-class-attendance/:id',
    authController.musicClassAttendancePage
);

// =====================================
// OPEN ATTENDANCE SESSION
// =====================================

router.post(
    '/admin/open-attendance/:id',
    authController.openAttendance
);

// =====================================
// CLOSE ATTENDANCE SESSION
// =====================================

router.post(
    '/admin/close-attendance/:id',
    authController.closeAttendance
);

// =====================================
// MUSIC ATTENDANCE ANALYTICS
// =====================================

router.get(
    '/admin/music-attendance-analytics',
    authController.musicAttendanceAnalytics
);

// =====================================
// RECORD MUSIC ATTENDANCE
// =====================================

router.post(
    '/user/record-attendance/:id',
    authController.recordAttendance
);

// =====================================
// USER MUSIC ATTENDANCE PAGE
// =====================================

router.get(
    '/user/my-music-attendance',
    authController.userMusicAttendance
);

// =====================================
// SEARCH MUSIC CLASSES
// =====================================

router.get(
    '/admin/search-music-classes',
    authController.searchMusicClasses
);

// =====================================
// FILTER MUSIC CLASSES
// =====================================

router.get(
    '/admin/filter-music-classes',
    authController.filterMusicClasses
);

// =====================================
// USER MUSIC CLASSES PAGE
// =====================================

router.get(
    '/user/music-classes',
    authController.userMusicClasses
);

// =====================================
// RECORD MUSIC ATTENDANCE
// =====================================

router.post(
    '/user/record-attendance/:id',
    authController.recordAttendance
);

// =====================================
// VIEW SINGLE MUSIC CLASS
// =====================================

router.get(
    '/user/view-music-class/:id',
    authController.viewMusicClass
);

// =====================================
// JOIN MUSIC CLASS
// =====================================

router.get(
    '/user/join-music-class/:id',
    authController.joinMusicClass
);

// =====================================
// MY MUSIC CLASSES PAGE
// =====================================

router.get(
    '/user/my-music-classes',
    authController.myMusicClasses
);

// =====================================
// USER MUSIC ATTENDANCE PAGE
// =====================================

router.get(
    '/user/my-music-attendance',
    authController.userMusicAttendance
);

// =====================================
// LEAVE MUSIC CLASS
// =====================================

router.get(
    '/user/leave-music-class/:id',
    authController.leaveMusicClass
);

// =====================================
// USER MUSIC ATTENDANCE
// =====================================

router.get(
    '/user/music-attendance',
    authController.userMusicAttendance
);


// =====================================
// EXPORT ROUTER
// =====================================

module.exports = router;