const express = require("express");             // web framework for nodejs 
// models
const Admin = require("../models/admin");       // model - admin
// router
const router = express.Router();


///////////////////////////
//   single hotel list   //
///////////////////////////

router.get("/hotels", async (req, res) => {
    try {
        const singleHotelsData = (await Admin.listOfTotalSingleHotels()).rows;

        return res.status(200).json({
            status: true,
            info: 'List of single hotels!',
            data: singleHotelsData
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            info: err.message
        });
    }
});


//////////////////////////
//   hotel chain list   //
//////////////////////////

router.get("/chains", async (req, res) => {
    try {
        const hotelChainsData = (await Admin.listOfTotalHotelChains()).rows;

        return res.status(200).json({
            status: true,
            info: 'List of hotel chains!',
            data: hotelChainsData
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            info: err.message
        });
    }
});


///////////////////////////
//   all services list   //
///////////////////////////

router.get("/services", async (req, res) => {
    try {
        const totalServicesData = (await Admin.listOfTotalServices()).rows;

        return res.status(200).json({
            status: true,
            info: 'List of all services!',
            data: totalServicesData
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

router.get("/guests", async (req, res) => {
    try {
        const totalGuestData = (await Admin.listOfTotalGuests()).rows;

        return res.status(200).json({
            status: true,
            info: 'List of all guests!',
            data: totalGuestData
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