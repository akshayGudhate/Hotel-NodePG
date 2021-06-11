const { postgres } = require('./database');           // postgres pool instance


// session model
class Admin {

    // list of single hotels
    static listOfTotalSingleHotels() {
        return postgres.query(
            `
            SELECT
                COUNT(h.hotel_id) OVER() AS total_hotels,
                h.hotel_id,
                h.name AS name_hotel,
                h.rooms, h.city,
                o.owner_id,
                o.phone AS phone_owner,
                CONCAT(o.name_first, ' ', o.name_last) AS name_owner
            FROM hotels h
            JOIN owners o ON o.owner_id = h.owner_id
            WHERE o.has_chain = FALSE
            ORDER BY h.time_stamp DESC;
            `
        );
    };

    // list of hotel chains
    static listOfTotalHotelChains() {
        return postgres.query(
            `
            SELECT
                COUNT(h.hotel_id) OVER() AS total_chains,
                h.hotel_id,
                h.name AS name_hotel,
                h.rooms, h.city,
                o.owner_id,
                o.phone AS phone_owner,
                CONCAT(o.name_first, ' ', o.name_last) AS name_owner
            FROM hotels h
            JOIN owners o ON o.owner_id = h.owner_id
            WHERE o.has_chain = TRUE
            ORDER BY h.time_stamp DESC;
            `
        );
    };

    // list of services
    static listOfTotalServices() {
        return postgres.query(
            `
            SELECT
                COUNT(s.service_id) OVER()  AS total_services,
                s.service_id,
                s.name AS name_service,
                s.cost,
                h.hotel_id,
                h.name AS name_hotel,
                h.city
            FROM services s
            JOIN hotels h ON h.hotel_id = s.hotel_id
            ORDER BY s.service_id DESC;
            `
        );
    };

    // list of guests
    static listOfTotalGuests() {
        return postgres.query(
            `
            SELECT
                COUNT(guest_id) OVER() AS total_guests,
                guest_id,
                CONCAT(name_first, ' ', name_last) AS name,
                phone,
                time_stamp
            FROM guests
            ORDER BY time_stamp DESC;
            `
        );
    };

}



module.exports = Admin;