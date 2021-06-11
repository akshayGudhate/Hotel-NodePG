const express = require("express");                 // web framework for nodejs 
// models
const Service = require("../models/service");       // model - service
// router
const router = express.Router();


///////////////////////
//    add service    //
///////////////////////

router.post("/", async (req, res) => {
    try {
        const { hotelID, name, cost } = req.body;
        const serviceID = (await Service.addService(hotelID, name, cost)).rows[0].service_id;

        return res.status(200).json({
            status: true,
            info: 'New service added!',
            data: { serviceID }
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
//    service list    //
////////////////////////

router.get("/list", async (req, res) => {
    try {
        const ownerID = req.owner.owner_id;
        const serviceData = (await Service.getHotelServiceList(ownerID)).rows;

        return res.status(200).json({
            status: true,
            info: 'List of services',
            data: serviceData
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
//   service details   //
/////////////////////////

router.get("/:serviceID", async (req, res) => {
    try {
        const serviceID = req.params.serviceID;
        const serviceDetails = (await Service.getServiceDetails(serviceID)).rows[0];

        return res.status(200).json({
            status: true,
            info: "service Details!",
            data: serviceDetails
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
//   update service   //
////////////////////////

router.put("/:serviceID", async (req, res) => {
    try {
        const serviceID = req.params.serviceID;
        const { name, cost, hotelID } = req.body;

        await Service.updateService(serviceID, name, cost, hotelID);

        return res.status(200).json({
            status: true,
            info: 'service details updated successfully!',
            data: { serviceID }
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
//   delete service   //
////////////////////////

router.delete("/:serviceID", async (req, res) => {
    try {
        const serviceID = req.params.serviceID;
        await Service.deleteHotelService(serviceID);

        return res.status(200).json({
            status: true,
            info: 'service deleted successfully!',
            data: { serviceID }
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