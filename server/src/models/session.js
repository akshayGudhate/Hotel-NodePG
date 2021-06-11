const { postgres } = require('./database');           // postgres pool instance


// session model
class Session {

    // add session
    static addSession(hotelID, guestID, services) {
        return postgres.query(
            `
            INSERT INTO sessions(hotel_id, guest_id, services)
            VALUES ($1, $2, $3)
            RETURNING session_id;
            `,
            [hotelID, guestID, services]
        );
    };

    // update session services
    static updateSessionService(sessionID, services) {
        return postgres.query(
            `
            UPDATE sessions
            SET services = $2
            WHERE session_id = $1;
            `,
            [sessionID, services]
        );
    };

    // update session payment status to true
    static updateSessionToPaymentCompleted(sessionID) {
        return postgres.query(
            `
            UPDATE sessions
            SET
                payment_status = TRUE,
                out_time_stamp = NOW()
            WHERE session_id = $1;
            `,
            [sessionID]
        );
    };

    // delete session
    static deleteSession(sessionID) {
        return postgres.query(
            `
            DELETE
            FROM sessions
            WHERE session_id = $1;
            `,
            [sessionID]
        );
    };

    // get session details
    static getSessionDetails(sessionID) {
        return postgres.query(
            `
            SELECT *
            FROM session_snapshot_view
            WHERE session_id = $1;
            `,
            [sessionID]
        );
    };

    // get active sessions
    static getActiveSessionList(ownerID) {
        return postgres.query(
            `
            SELECT *
            FROM session_snapshot_view
            WHERE
                owner_id = $1 AND
                payment_status = FALSE;
            `,
            [ownerID]
        );
    };

}



module.exports = Session;