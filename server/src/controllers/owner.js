const express = require("express");             // web framework for nodejs
// models
const Owner = require("../models/owner");       // model - owners
// router
const router = express.Router();


////////////////////////
//    owner detail    //
////////////////////////

router.get("/", async (req, res) => {
    try {
        const ownerID = req.owner.owner_id;
        const ownerDetails = (await Owner.getOwner(ownerID)).rows[0];

        return res.status(200).json({
            status: true,
            info: "Owner Details!",
            data: ownerDetails
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
//    update owner    //
////////////////////////

router.put("/", async (req, res) => {
    try {
        const ownerID = req.owner.owner_id;
        const { nameFirst, nameLast, phone, hasChain, password } = req.body;

        await Owner.updateOwner(ownerID, nameFirst, nameLast, phone, hasChain, password);

        return res.status(200).json({
            status: true,
            info: "Owner updated successfully!",
            data: { ownerID }
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
//     owners list     //
/////////////////////////

router.get("/list", async (req, res) => {
    try {
        const ownersList = (await Owner.getOwnersList()).rows;

        return res.status(200).json({
            status: true,
            info: "Owners List!",
            data: ownersList
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