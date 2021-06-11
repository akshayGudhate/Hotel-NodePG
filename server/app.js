const express = require("express");                                         // express server base app
// models
const database = require("./src/models/database");                          // models - database methods
// middleware
const { authenticateToken } = require('./src/middlewares/authentication');  // middleware - authenticateToken
// env
require('dotenv').config();
const PORT = process.env.PORT;                                              // server port


/////////////////////////
//         app         //
/////////////////////////

const app = express();


/////////////////////////
//     body parser     //
/////////////////////////

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


/////////////////////////
//     api routes      //
/////////////////////////

// authentication
app.use("/api/auth", require('./src/controllers/auth'));                                // route - auth
// CRUD routes
app.use("/api/owner", authenticateToken, require('./src/controllers/owner'));           // route - owner
app.use("/api/hotel", authenticateToken, require('./src/controllers/hotel'));           // route - hotel
app.use("/api/service", authenticateToken, require('./src/controllers/service'));       // route - service
app.use("/api/guest", authenticateToken, require('./src/controllers/guest'));           // route - guest
app.use("/api/session", authenticateToken, require('./src/controllers/session'));       // route - session
// ADMIN route
app.use("/api/admin", authenticateToken, require('./src/controllers/admin'));           // route - admin


/////////////////////////
//     start server    //
/////////////////////////


(async () => {
    try {
        // load full database
        await database.initDatabase();

        // start the app
        return app.listen(PORT, () => {
            console.log(`Your server is running at: http://localhost:${PORT}`);
        });

    } catch (err) {
        console.log(err);
    }
})();