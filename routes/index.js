const path = require("path");
const router = require("express").Router();
const api = require("./api.js");
const users = require("./users.js");
const html = require("./html.js");
const auth = require("./auth.js");
const mongo = require("../mongo/mongoRoute.js");


// // ******************************************************************************
// // *** Setup api routes
// // ==============================================================================
router.use("/", html); //adds /api to apiRoutes
router.use("/", mongo); //adds /api to apiRoutes
router.use("/api", api); //adds /api to apiRoutes
router.use("/users", users); //adds /api to apiRoutes
router.use("/auth", auth); //adds /api to apiRoutes
// // ******************************************************************************
// // *** export app routes
// // ==============================================================================
module.exports = router