const express = require("express");             // web framework for nodejs 
// models
const Guest = require("../models/guest");       // model - guest
// router
const router = express.Router();


/////////////////////
//    add guest    //
/////////////////////

router.post("/", async (req, res) => {
    try {
        const { nameFirst, nameLast, phone } = req.body;
        const guestID = (await Guest.registerGuest(nameFirst, nameLast, phone)).rows[0].guest_id;

        return res.status(200).json({
            status: true,
            info: 'New guest added!',
            data: { guestID }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            info: err.message
        });
    }
});


///////////////////////
//   guest details   //
///////////////////////

router.get("/:guestID", async (req, res) => {
    try {
        const guestID = req.params.guestID;
        const guestDetails = (await Guest.getGuestDetails(guestID)).rows[0];

        return res.status(200).json({
            status: true,
            info: "guest Details!",
            data: guestDetails
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            info: err.message
        });
    }
});


//////////////////////
//   update guest   //
//////////////////////

router.put("/:guestID", async (req, res) => {
    try {
        const guestID = req.params.guestID;
        const { nameFirst, nameLast, phone } = req.body;

        await Guest.updateGuest(guestID, nameFirst, nameLast, phone);

        return res.status(200).json({
            status: true,
            info: 'guest details updated successfully!',
            data: { guestID }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            info: err.message
        });
    }
});


//////////////////////
//   delete guest   //
//////////////////////

router.delete("/:guestID", async (req, res) => {
    try {
        const guestID = req.params.guestID;
        await Guest.deleteGuest(guestID);

        return res.status(200).json({
            status: true,
            info: 'guest deleted successfully!',
            data: { guestID }
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