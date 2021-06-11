const { Pool } = require("pg");     // postgres connection pool
// env
require('dotenv').config();         // environment vars


/////////////////////////
//       pg pool       //
/////////////////////////

const postgres = new Pool({
    connectionString: process.env.DATABASE_URL
});


/////////////////////////
//        tables       //
/////////////////////////

// owners table
const initOwnersTable = async () => {
    return postgres.query(
        `
        CREATE TABLE IF NOT EXISTS owners(
            owner_id SERIAL PRIMARY KEY NOT NULL,
            name_first TEXT NOT NULL,
            name_last TEXT NOT NULL,
            phone NUMERIC(15) UNIQUE NOT NULL,
            has_chain BOOLEAN DEFAULT FALSE,
            password TEXT NOT NULL,
            time_stamp TIMESTAMPTZ DEFAULT NOW()
        );
        `
    );
};

// guest table
const initGuestTable = async () => {
    return postgres.query(
        `
        CREATE TABLE IF NOT EXISTS guests(
            guest_id SERIAL PRIMARY KEY NOT NULL,
            name_first TEXT NOT NULL,
            name_last TEXT NOT NULL,
            phone NUMERIC(15) UNIQUE NOT NULL,
            time_stamp TIMESTAMPTZ DEFAULT NOW()
        );
        `
    );
};

// hotels table
const initHotelsTable = () => {
    return postgres.query(
        `
        CREATE TABLE IF NOT EXISTS hotels(
            hotel_id SERIAL PRIMARY KEY NOT NULL,
            owner_id INTEGER REFERENCES owners(owner_id),
            name TEXT NOT NULL,
            rooms INTEGER NOT NULL,
            city TEXT NOT NULL,
            time_stamp TIMESTAMPTZ DEFAULT NOW()
        );
        `
    );
};

// services table
const initServicesTable = () => {
    return postgres.query(
        `
        CREATE TABLE IF NOT EXISTS services(
            service_id SERIAL PRIMARY KEY NOT NULL,
            hotel_id INTEGER REFERENCES hotels(hotel_id),
            name TEXT NOT NULL,
            cost NUMERIC(15, 2) NOT NULL
        );
        `
    );
};

// sessions table
const initSessionsTable = () => {
    return postgres.query(
        `
        CREATE TABLE IF NOT EXISTS sessions(
            session_id SERIAL PRIMARY KEY NOT NULL,
            hotel_id INTEGER REFERENCES hotels(hotel_id),
            guest_id INTEGER REFERENCES guests(guest_id),
            services INTEGER[] NOT NULL,
            cost NUMERIC(15, 2) NOT NULL DEFAULT 0,
            payment_status BOOLEAN DEFAULT FALSE,
            in_time_stamp TIMESTAMPTZ DEFAULT NOW(),
            out_time_stamp TIMESTAMPTZ
        );
        `
    );
};


/////////////////////////
//      functions      //
/////////////////////////

// function for getting session cost
const initGetSessionCostFunction = () => {
    return postgres.query(
        `
        CREATE OR REPLACE FUNCTION get_session_cost(
            specified_session_id INTEGER
        ) RETURNS NUMERIC(15, 2)
        AS
        $total_session_cost$
        DECLARE
            total_session_cost NUMERIC(15, 2);
        BEGIN
            --
            -- get cost
            --
            SELECT SUM(ss.cost)
            INTO total_session_cost
            FROM (
                SELECT UNNEST(services) AS service_id
                FROM sessions
                WHERE session_id = specified_session_id
            ) sn
            JOIN services ss ON ss.service_id = sn.service_id;

            --
            -- return cost
            --
            RETURN total_session_cost;
        END
        $total_session_cost$
        LANGUAGE plpgsql;
        `
    );
};


/////////////////////////
//         view        //
/////////////////////////

// sessions snapshot view
const initSessionSnapshotView = () => {
    return postgres.query(
        `
        CREATE OR REPLACE VIEW session_snapshot_view AS(
            SELECT
                s.session_id,
                s.services,
                s.in_time_stamp,
                s.out_time_stamp,
                s.payment_status,
                cardinality(services) AS total_service_count,
                get_session_cost(s.session_id) AS session_cost,
                h.hotel_id,
                h.name,
                h.city,
                o.owner_id,
                o.phone AS phone_owner,
                CONCAT(o.name_first, ' ', o.name_last) AS name_owner,
                g.guest_id,
                g.phone AS phone_guest,
                CONCAT(g.name_first, ' ', g.name_last) AS name_guest
            FROM sessions s
            JOIN hotels h ON h.hotel_id = s.hotel_id
            JOIN owners o ON o.owner_id = h.owner_id
            JOIN guests g ON g.guest_id = s.guest_id
        );
        `
    );
};


/////////////////////////
//         init        //
/////////////////////////

const initDatabase = async () => {
    await initOwnersTable();
    await initGuestTable();
    await initHotelsTable();
    await initServicesTable();
    await initSessionsTable();
    await initGetSessionCostFunction();
    return initSessionSnapshotView();
};



module.exports = { postgres, initDatabase };