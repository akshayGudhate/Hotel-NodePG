const { postgres } = require('./database');           // postgres pool instance


// hotel model
class Hotel {

    // register hotel
    static registerHotel(ownerID, name, rooms, city) {
        return postgres.query(
            `
            INSERT INTO hotels(owner_id, name, rooms, city)
            VALUES ($1, $2, $3, $4)
            RETURNING hotel_id;
            `,
            [ownerID, name, rooms, city]
        );
    };

    // get hotel
    static async getHotelDetails(hotelID) {
        const hotelDetails = (await postgres.query(
            `
            SELECT
                h.hotel_id, h.name AS name_hotel, h.city,
                o.owner_id, o.phone, CONCAT(o.name_first, ' ', o.name_last) AS name_owner
            FROM hotels h
            JOIN owners o ON o.owner_id = h.owner_id
            WHERE hotel_id = $1;
            `,
            [hotelID]
        )).rows[0];

        const hotelServices = (await postgres.query(
            `
            SELECT service_id, name, cost
            FROM services
            WHERE hotel_id = $1;
            `,
            [hotelID]
        )).rows;

        return { ...hotelDetails, hotelServices };
    };

    // update hotel
    static updateHotel(hotelID, name, rooms, city) {
        return postgres.query(
            `
            UPDATE hotels
            SET
                name = $2,
                rooms = $3,
                city = $4
            WHERE hotel_id = $1;
            `,
            [hotelID, name, rooms, city]
        );
    };

    // list hotel
    static getOwnersHotelList(ownerID) {
        return postgres.query(
            `
            SELECT hotel_id, name, city
            FROM hotels
            WHERE owner_id = $1
            ORDER BY hotel_id DESC;
            `,
            [ownerID]
        );
    };

    // delete hotel
    static deleteHotel(hotelID) {
        return postgres.query(
            `
            DELETE
            FROM hotels
            WHERE hotel_id = $1;
            `,
            [hotelID]
        );
    };

}



module.exports = Hotel;