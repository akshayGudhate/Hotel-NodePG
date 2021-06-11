const express = require('express');                                     // web framework for nodejs
const bcrypt = require('bcrypt');                                       // generate random strings
// models
const Owner = require("../models/owner");                               // model - owner
// middleware
const { generateToken } = require('../middlewares/authentication');     // middleware - generate token
// router
const router = express.Router();


/////////////////////////
//      POST login     //
/////////////////////////

router.post("/login", async (req, res) => {
    try {
        const { phone, password } = req.body;

        // checking owner phone
        const resultOwnerDetails = await Owner.getOwnerByPhone(phone);
        const ownerExists = resultOwnerDetails.rowCount === 1 ? true : false;
        if (!ownerExists) {
            return res.status(401).json({
                status: false,
                info: 'No account with these credentials exists. Please sign-up instead.'
            });
        };

        // owner details object
        const ownerDetails = resultOwnerDetails.rows[0];

        // checking owner password
        const isPasswordMatching = await bcrypt.compare(password, ownerDetails.password);
        if (!isPasswordMatching) {
            return res.status(401).json({
                status: false,
                info: 'Incorrect credentials, please try again!'
            });
        };

        // generate JWT token
        const accessToken = await generateToken({
            owner_id: ownerDetails.owner_id,
            name_first: ownerDetails.name_first,
            name_last: ownerDetails.name_last,
            phone: ownerDetails.phone,
            has_chain: ownerDetails.has_chain,
            time_stamp: ownerDetails.time_stamp
        });

        return res.status(200).json({
            status: true,
            info: 'Log In Successful!',
            data: { accessToken }
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
//     POST signup     //
/////////////////////////

router.post("/signup", async (req, res) => {
    try {
        const { nameFirst, nameLast, phone, hasChain, password } = req.body;

        // checking Owner phone
        const resultOwnerDetails = await Owner.getOwnerByPhone(phone);
        const OwnerExists = resultOwnerDetails.rowCount === 1 ? true : false;
        if (OwnerExists) {
            return res.status(401).json({
                status: false,
                info: 'Owner already exists with this phone number.'
            });
        };

        const hashedPassword = bcrypt.hashSync(password, 10);
        // create new Owner
        const resultRegisterOwner = await Owner.registerOwner(
            nameFirst, nameLast, phone, hasChain, hashedPassword
        );
        const ownerID = resultRegisterOwner.rows[0].owner_id;
        const registrationTimeStamp = resultRegisterOwner.rows[0].time_stamp;

        // generate access token
        const accessToken = await generateToken({
            owner_id: ownerID,
            name_first: nameFirst,
            name_last: nameLast,
            phone: phone,
            has_chain: hasChain,
            time_stamp: registrationTimeStamp
        });

        return res.status(200).json({
            status: true,
            info: 'Signup Successful!',
            data: { accessToken }
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