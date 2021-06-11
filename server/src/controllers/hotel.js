const express = require("express");             // web framework for nodejs 
// models
const Hotel = require("../models/hotel");       // model - hotel
// router
const router = express.Router();


////////////////////////
//   register hotel   //
////////////////////////

router.post("/", async (req, res) => {
    try {
        const ownerID = req.owner.owner_id;
        const { name, rooms, city } = req.body;

        const hotelID = (await Hotel.registerHotel(ownerID, name, rooms, city)).rows[0].hotel_id;

        return res.status(200).json({
            status: true,
            info: 'New hotel added!',
            data: { hotelID }
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
//    hotel list    //
//////////////////////

router.get("/list", async (req, res) => {
    try {
        const ownerID = req.owner.owner_id;
        const hotelData = (await Hotel.getOwnersHotelList(ownerID)).rows;

        return res.status(200).json({
            status: true,
            info: 'List of hotels',
            data: hotelData
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
//   hotel details   //
///////////////////////

router.get("/:hotelID", async (req, res) => {
    try {
        const hotelID = req.params.hotelID;
        const hotelDetails = await Hotel.getHotelDetails(hotelID);

        return res.status(200).json({
            status: true,
            info: "Hotel Details!",
            data: hotelDetails
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
//   update hotel   //
//////////////////////

router.put("/:hotelID", async (req, res) => {
    try {
        const hotelID = req.params.hotelID;
        const { name, rooms, city } = req.body;

        await Hotel.updateHotel(hotelID, name, rooms, city);

        return res.status(200).json({
            status: true,
            info: 'hotel details updated successfully!',
            data: { hotelID }
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
//   delete hotel   //
//////////////////////

router.delete("/:hotelID", async (req, res) => {
    try {
        const hotelID = req.params.hotelID;
        await Hotel.deleteHotel(hotelID);

        return res.status(200).json({
            status: true,
            info: 'Hotel deleted successfully!',
            data: { hotelID }
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