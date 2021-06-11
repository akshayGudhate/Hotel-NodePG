const { postgres } = require('./database');           // postgres pool instance


// owner model
class Owner {

    // get owner
    static getOwnerByPhone(phone) {
        return postgres.query(
            `
            SELECT
                owner_id,
                name_first,
                name_last,
                phone,
                has_chain,
                password,
                time_stamp
            FROM owners
            WHERE phone = $1;
            `,
            [phone]
        );
    };

    // register owner
    static registerOwner(nameFirst, nameLast, phone, hasChain, password) {
        return postgres.query(
            `
            INSERT INTO owners(name_first, name_last, phone, has_chain, password)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING owner_id, time_stamp;
            `,
            [nameFirst, nameLast, phone, hasChain, password]
        );
    };

    // get owner
    static getOwner(ownerID) {
        return postgres.query(
            `
            SELECT
                owner_id,
                name_first,
                name_last,
                phone,
                has_chain,
                time_stamp
            FROM owners
            WHERE owner_id = $1;
            `,
            [ownerID]
        );
    };

    // update owner
    static updateOwner(ownerID, nameFirst, nameLast, phone, hasChain, password) {
        return postgres.query(
            `
            UPDATE owners
            SET
                name_first = $2,
                name_last = $3,
                phone = $4,
                has_chain = $5,
                password = $6
            WHERE owner_id = $1;
            `,
            [ownerID, nameFirst, nameLast, phone, hasChain, password]
        );
    };

    // get owner list
    static getOwnersList() {
        return postgres.query(
            `
            SELECT
                owner_id,
                name_first,
                name_last,
                phone,
                has_chain,
                time_stamp
            FROM owners
            ORDER BY time_stamp DESC;
            `
        );
    };

}



module.exports = Owner;