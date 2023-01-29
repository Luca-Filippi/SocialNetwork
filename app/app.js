const express = require("express");
const db = require("./db.js");
const api = require("./route.js");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.static("public"));
app.use(express.json());

app.use(cookieParser());

app.use("/api", api);

app.listen(3000, async ()=> {
    console.log("[server] sono attivo");
    await db.connect();
    console.log("[server] connesso a mongodb");
});
