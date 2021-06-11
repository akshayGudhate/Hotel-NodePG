const { postgres } = require('./database');           // postgres pool instance


// service model
class Service {

    // add new service
    static addService(hotelID, name, cost) {
        return postgres.query(
            `
            INSERT INTO services(hotel_id, name, cost)
            VALUES ($1, $2, $3)
            RETURNING service_id;
            `,
            [hotelID, name, cost]
        );
    };

    // update service
    static updateService(serviceID, name, cost, hotelID) {
        return postgres.query(
            `
            UPDATE services
            SET
                name = $2,
                cost = $3,
                hotel_id = $4
            WHERE service_id = $1;
            `,
            [serviceID, name, cost, hotelID]
        );
    };

    // get service list
    static getHotelServiceList(ownerID) {
        return postgres.query(
            `
            SELECT s.service_id, s.name  AS name_service, s.cost,
            h.hotel_id, h.name AS name_hotel, h.city
            FROM services s
            JOIN hotels h ON h.hotel_id = s.hotel_id
            WHERE h.owner_id = $1
            ORDER BY s.service_id DESC;
            `,
            [ownerID]
        );
    };

    // get service
    static getServiceDetails(serviceID) {
        return postgres.query(
            `
            SELECT service_id, hotel_id, name, cost
            FROM services
            WHERE service_id = $1;
            `,
            [serviceID]
        );
    };

    // delete service
    static deleteHotelService(serviceID) {
        return postgres.query(
            `
            DELETE
            FROM services
            WHERE service_id = $1;
            `,
            [serviceID]
        );
    };

}



module.exports = Service;