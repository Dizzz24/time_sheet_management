const { verifyToken } = require("../utilities/jwt");
const { Employee } = require("../models");

const authentication = async (req, res, next) => {
    try {
        console.log("Enter Auth ==========================================")
        if (!req.headers.authorization) throw { name: "invalidToken" }

        const token = req.headers.authorization.split(' ')[1]

        const payload = verifyToken(token)

        const employee = await Employee.findByPk(payload.id)
        if (!employee) throw { name: "invalidToken" }

        req.employee = { EmployeeId: payload.id }

        next()
    } catch (error) {
        next(error)
    }
}

module.exports = authentication