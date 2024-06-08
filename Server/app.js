const cors = require('cors')
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const express = require('express');
const port = process.env.PORT || 4000
const app = express()
const errorHandler = require('./middleware/ErrorHandle');
const router = require('./routers');

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors())

app.get("/", (req, res) => res.send("RUNNING --->"))
app.use(router)

app.use(errorHandler)

app.listen(port, () => console.log("Success run on port", port))

module.exports = app