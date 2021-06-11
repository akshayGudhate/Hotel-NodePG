const { postgres } = require('./database');           // postgres pool instance


// guest model
class Guest {

    // register guest
    static registerGuest(nameFirst, nameLast, phone) {
        return postgres.query(
            `
            INSERT INTO guests(name_first, name_last, phone)
            VALUES ($1, $2, $3)
            RETURNING guest_id;
            `,
            [nameFirst, nameLast, phone]
        );
    };

    // get guest details
    static getGuestDetails(guestID) {
        return postgres.query(
            `
            SELECT
                guest_id,
                name_first,
                name_last,
                phone,
                time_stamp
            FROM guests
            WHERE guest_id = $1;
            `,
            [guestID]
        );
    };

    // update guest
    static updateGuest(guestID, nameFirst, nameLast, phone) {
        return postgres.query(
            `
            UPDATE guests
            SET
                name_first = $2,
                name_last = $3,
                phone = $4
            WHERE guest_id = $1;
            `,
            [guestID, nameFirst, nameLast, phone]
        );
    };

    // delete guest
    static deleteGuest(guestID) {
        return postgres.query(
            `
            DELETE
            FROM guests
            WHERE guest_id = $1;
            `,
            [guestID]
        );
    };

}



module.exports = Guest;