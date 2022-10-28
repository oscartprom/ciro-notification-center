const _ = require('lodash');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// TODO: check notifications every so often to get recurring data, update against user database

/**
 * Data model:
 * (actual notification data from API)
 * --
    id: 9733,
    companyName: 'Rockwall Oral Surgery',
    companyUrl: 'dentalimplantsurgery.com',
    companyPhone: '(469) 264-8921',
    companyAddress: '960 West Ralph Hall Pkwy, Rockwall, TX 75032',
    notificationBody: 'Rockwall Oral Surgery recently opened for business',
    notificationSource: 'https://www.yelp.com/biz/rockwall-oral-and-facial-surgery-rockwall?osq=Rockwall+Oral+Surgery',
    timestamp: '2022-10-28T13:36:03.929Z'
 * --
 * shownToUser BOOL
 * userDismissed BOOL
 */
const _notificationTable = {};

const getAllNotifications = async () => {
    try {
        const res = await axios.get(ENDPOINT_URL);
        // TODO: sort by timestamp
        return res.data;
    } catch (e) {
        console.error('Could not get all notifications from endpoint', e);
        return [];
    }
};

const PORT = 3001
const ENDPOINT_URL = 'https://app.ciro.io/api/notifications/ac6afe60-46d0-4f5a-9f5a-2eb9e26cbd9f';

const app = express();
app.use(cors());

app.get('/all', async (req, res) => {
    const ns = await getAllNotifications();
    res.status(200).end(JSON.stringify(ns))
});

app.get('/new', async (req, res) => {
    console.log(req.query);

    if (!req.query.userId) {
        return res.status(400).end('Must include userId param');
    }

    // TODO: move this to middlware
    let userId;
    try {
        userId = parseInt(req.query.userId);
    } catch (e) {
        console.error('Could not parse userId', e);
        return res.status(400).end('userId must be an integer');
    }

    // get new data if this user hasnt requested before
    if (!_notificationTable[userId]) {
        _notificationTable[userId] = await getAllNotifications();
    }

    // assemble array of unseen notifications
    const newNotifications = _.filter(_notificationTable[userId], (notif) => {
        return !notif.shownToUser && !notif.userDismissed;
    });

    return res.status(200).end(JSON.stringify(newNotifications));
});

// typically would be a POST, but moving quickly
app.get('/dismiss', async (req, res) => {
    console.log(req.query.userId);
    console.log(req.query.notificationId);

    if (!req.query.userId || !req.query.notificationId) {
        return res.status(400).end('Must include userId param');
    }

    // TODO: move this to middlware
    let userId;
    try {
        userId = parseInt(req.query.userId);
    } catch (e) {
        console.error('Could not parse userId', e);
        return res.status(400).end('userId must be an integer');
    }

    let notifId;
    try {
        notifId = parseInt(req.query.notificationId);
    } catch (e) {
        console.error('Could not parse notificationId', e);
        return res.status(400).end('notificationId must be an integer');
    }

    // if user hasnt requested notifications
    if (!_notificationTable[userId]) {
        return res.status(400).end('userId has never seen this notification');
    }

    // find the notification in question for this user
    const userNotifIndex = _.findIndex(_notificationTable[userId], (notif) => {
        return notif.id === notifId;
    });

    if (userNotifIndex === -1) {
        return res.status(400).end('Could not find notificationId for userId');
    }

    // update dismissed
    _notificationTable[userId][userNotifIndex].userDismissed = true;
    return res.status(200).end('OK');
});

app.listen(PORT, () => {
    console.log(`Ciro backend server listening on port ${PORT}`)
});
