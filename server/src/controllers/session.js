const express = require("express");                 // web framework for nodejs 
// models
const Session = require("../models/session");       // model - session
// router
const router = express.Router();


///////////////////////
//    add session    //
///////////////////////

router.post("/", async (req, res) => {
    try {
        const { hotelID, guestID, services } = req.body;
        const sessionID = (await Session.addSession(hotelID, guestID, services)).rows[0].session_id;

        return res.status(200).json({
            status: true,
            info: 'New session added!',
            data: { sessionID }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            info: err.message
        });
    }
});


////////////////////////
//    session list    //
////////////////////////

router.get("/active/list", async (req, res) => {
    try {
        const ownerID = req.owner.owner_id;
        const sessionData = (await Session.getActiveSessionList(ownerID)).rows;

        return res.status(200).json({
            status: true,
            info: 'List of sessions',
            data: sessionData
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            info: err.message
        });
    }
});


/////////////////////////
//   session details   //
/////////////////////////

router.get("/:sessionID", async (req, res) => {
    try {
        const sessionID = req.params.sessionID;
        const sessionDetails = (await Session.getSessionDetails(sessionID)).rows[0];

        return res.status(200).json({
            status: true,
            info: "session Details!",
            data: sessionDetails
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            info: err.message
        });
    }
});


////////////////////////
//   update session   //
////////////////////////

// session services
router.put("/:sessionID", async (req, res) => {
    try {
        const services = req.body.services;
        const sessionID = req.params.sessionID;

        await Session.updateSessionService(sessionID, services);

        return res.status(200).json({
            status: true,
            info: 'session services updated successfully!',
            data: { sessionID }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            info: err.message
        });
    }
});

// payment completed
router.put("/payment/:sessionID", async (req, res) => {
    try {
        const sessionID = req.params.sessionID;
        await Session.updateSessionToPaymentCompleted(sessionID);

        return res.status(200).json({
            status: true,
            info: 'session payment is successful!',
            data: { sessionID }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            info: err.message
        });
    }
});


////////////////////////
//   delete session   //
////////////////////////

router.delete("/:sessionID", async (req, res) => {
    try {
        const sessionID = req.params.sessionID;
        await Session.deleteSession(sessionID);

        return res.status(200).json({
            status: true,
            info: 'session deleted successfully!',
            data: { sessionID }
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            info: err.message
        });
    }
});



module.exports = router;