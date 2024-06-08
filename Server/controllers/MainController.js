const { Op } = require("sequelize")
const { Activity, Project, Employee } = require("../models")
const calculateDuration = require("../utilities/calculateDuration")
const calculateOvertime = require("../utilities/calculateOverTime")
const { createToken } = require("../utilities/jwt")
const fs = require("fs")
const ExcelJS = require('exceljs')
const XLSX = require("xlsx")

class Controller {
    // Export
    static async exportData(req, res, next) {
        try {
            console.log("MASUK EXPORT ================================================== )")
            // const { EmployeeId } = req.employee

            const data = await Activity.findAll({
                raw: true,
                attributes: { exclude: ["id", "EmployeeId", "ProjectId", "createdAt", "updatedAt"] },
                include: [{
                    model: Employee,
                    attributes: ["name", "rate"]
                }, {
                    model: Project,
                    attributes: ["name"]
                }],
                where: { EmployeeId: 1 }
            })

            const worksheet = XLSX.utils.json_to_sheet(data)

            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, "Data")

            const filePath = './HH_Timesheet.xlsx'
            XLSX.writeFile(workbook, filePath)

            res.download(filePath, 'HH_Timesheet.xlsx', (err) => {
                if (err) {
                    console.log("gagal bro", err)
                }
                fs.unlinkSync(filePath)
            })
        } catch (error) {
            console.log(error, "========= Error On createTemplate =>")
            next(error)
        }
    }

    // Import
    static async importData(req, res, next) {
        try {
            const { EmployeeId } = req.employee

            if (!req?.file?.path) throw { name: "invalidFile" }

            const workbook = XLSX.readFile(req.file.path)
            const worksheet = workbook.Sheets[workbook.SheetNames[0]]
            const jsonData = XLSX.utils.sheet_to_json(worksheet)

            for (const item of jsonData) {
                const employee = await Employee.findOne({ where: { name: item['Employee.name'] } })
                if (!employee) {
                    return res.status(400).json({ error: `Employee '${item['Employee.name']}' not found.` })
                }

                const project = await Project.findOne({ where: { name: item['Project.name'] } })
                if (!project) {
                    return res.status(400).json({ error: `Project '${item['Project.name']}' not found.` })
                }

                await Activity.create({
                    name: item['name'],
                    startDate: item['startDate'],
                    endDate: item['endDate'],
                    startTime: item['startTime'],
                    endTime: item['endTime'],
                    duration: item['duration'],
                    EmployeeId,
                    ProjectId: project.id
                })
            }

            fs.unlinkSync(req.file.path)

            res.status(200).json({ message: 'Data imported successfully.' })
        } catch (error) {
            console.log(error, "========= Error On importData =>")
            next(error)
        }
    }

    // ======================================== Employee (

    static async C_Or_R_Employee(req, res, next) {
        try {
            const { name } = req.body

            if (!name.trim()) throw { name: "required", message: "Employee name is required" }

            const [employee, isCreated] = await Employee.findOrCreate({ where: { name }, default: { name } })

            if (!employee) throw { name: "notFound", type: "Employee" }

            const payload = { id: employee.id }

            const access_token = createToken(payload)

            let code = 201
            let message = "Welcome"

            if (!isCreated) {
                code = 200
                message += " back"
            }

            res.status(code).json({ access_token, message: `${message} to HH M-Timesheet '${name}'` })
        } catch (error) {
            console.log(error, "========= Error On C_Or_R_Employee =>")
            next(error)
        }
    }

    // Detail Employee
    static async G_Employee(req, res, next) {
        try {
            let { EmployeeId } = req.employee
            const employee = await Employee.findByPk(EmployeeId, { attributes: { exclude: ["id", "createdAt", "updatedAt"] } })

            if (!employee) throw { name: "notFound", type: "Employee" }

            res.status(200).json(employee)
        } catch (error) {
            console.log(error, "========= Error On C_Or_R_Employee =>")
            next(error)
        }
    }

    // Update Employee
    static async U_Employee(req, res, next) {
        try {
            let { EmployeeId } = req.employee
            let { name, rate } = req.body

            await Employee.update({ name, rate }, { where: { id: EmployeeId } })

            res.status(200).json({ message: `Profile has been successfully updated` })
        } catch (error) {
            console.log(error, "========= Error On U_Employee =>")
            next(error)
        }
    }

    // =========)

    // ======================================== Project (

    // Create Project
    static async C_Project(req, res, next) {
        try {
            const { name } = req.body
            await Project.create({ name })

            res.status(201).json({ message: `project with name '${name}' successfully created` })
        } catch (error) {
            console.log(error, "========= Error On C_Project =>")
            next(error)
        }
    }

    // Read Project
    static async R_Project(req, res, next) {
        try {
            let project = await Project.findAll({ attributes: ["id", "name"] })

            res.status(200).json(project)
        } catch (error) {
            console.log(error, "========= Error On R_Project =>")
            next(error)
        }
    }

    // =========)

    // ======================================== Activity (

    // Create Activity
    static async C_Activity(req, res, next) {
        try {
            let { EmployeeId } = req.employee
            let { name, startDate, endDate, startTime, endTime, ProjectId } = req.body

            console.log(req.body, "Req brody")

            if (isNaN(EmployeeId)) throw { name: "invalidIdFormat" }

            const duration = calculateDuration({ startDate, startTime, endDate, endTime })

            await Activity.create({ name, startDate, endDate, startTime, endTime, duration, ProjectId, EmployeeId })

            res.status(201).json({ message: `Activity with name '${name}' successfully created` })
        } catch (error) {
            console.log(error, "========= Error On Activity =>")
            next(error)
        }
    }

    static async R_Activities(req, res, next) {
        try {
            const { EmployeeId } = req.employee
            const { filter, search } = req.query

            const paramsQuery = {
                attributes: { exclude: ["ProjectId", "createdAt", "updatedAt"] },
                include: [{
                    model: Employee,
                    attributes: ["name", "rate"]
                }, {
                    model: Project,
                    attributes: ["name"]
                }],
                where: { EmployeeId }
            }

            let activities = await Activity.findAll(paramsQuery)

            let totalOvertimeDuration = 0
            let totalOvertimeEarnings = 0

            if (activities.length > 0) {
                const overtimeCalculations = calculateOvertime(activities)
                totalOvertimeDuration = overtimeCalculations.totalOvertimeDuration
                totalOvertimeEarnings = overtimeCalculations.totalOvertimeEarnings
            }

            if (filter || search) {
                const whereConditions = [{ EmployeeId }] // EmployeeId dari req.employee

                if (filter) {
                    const projectIds = filter.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id))
                    if (projectIds.length) {
                        whereConditions.push({ ProjectId: { [Op.in]: projectIds } })
                    }
                }

                if (search) {
                    whereConditions.push({ name: { [Op.iLike]: `%${search}%` } })
                }

                paramsQuery.where = { [Op.and]: whereConditions }
            }

            activities = await Activity.findAll(paramsQuery)

            res.status(200).json({ data: activities, totalOvertimeDuration, totalOvertimeEarnings })
        } catch (error) {
            console.log(error, "========= Error On R_Activities =>")
            next(error)
        }
    }

    // Read Detail Activity
    static async R_Detail_Activity(req, res, next) {
        try {
            const { EmployeeId } = req.employee
            const activityId = parseInt(req.params.activityId)

            if (isNaN(activityId)) throw { name: "invalidIdFormat" }

            const activity = await Activity.findOne({
                where: {
                    [Op.and]: [
                        { id: activityId },
                        { EmployeeId }
                    ]
                },
                attributes: { exclude: ["EmployeeId", "createdAt", "updatedAt"] },
                include: {
                    model: Project,
                    attributes: ["name"]
                }
            })

            if (!activity) throw { name: "notFound", type: "Activity" }

            res.status(200).json(activity)
        } catch (error) {
            console.log(error, "========= Error On R_Detail_Activity =>")
            next(error)
        }
    }

    // Update Activity
    static async U_Activity(req, res, next) {
        try {
            const { EmployeeId } = req.employee
            const activityId = parseInt(req.params.activityId)
            let { name, startDate, endDate, startTime, endTime, ProjectId } = req.body

            if (isNaN(activityId)) throw { name: "invalidIdFormat" }

            const activity = await Activity.findOne({
                where: {
                    [Op.and]: [
                        { id: activityId },
                        { EmployeeId }
                    ]
                }
            })

            if (!activity) throw { name: "notFound", type: "Activity" }

            await Activity.update({ name, startDate, endDate, startTime, endTime, ProjectId }, { where: { id: activityId } })

            res.status(200).json({ message: `Activity with prev name '${activity.name}' was successfully updated` })
        } catch (error) {
            console.log(error, "========= Error On U_Activity =>")
            next(error)
        }
    }

    // Delete Activity
    static async D_Activity(req, res, next) {
        try {
            const { EmployeeId } = req.employee
            const activityId = parseInt(req.params.activityId)

            if (isNaN(activityId)) throw { name: "invalidIdFormat" }

            let activity = await Activity.findOne({
                where: {
                    [Op.and]: [
                        { id: activityId },
                        { EmployeeId }
                    ]
                }
            })

            if (!activity) throw { name: "notFound", type: "Activity" }

            res.status(200).json({ message: `Activity with name '${activity.name}' was successfully deleted` })
            await Activity.destroy({ where: { id: activityId } })
        } catch (error) {
            console.log(error, "========= Error On D_Activity =>")
            next(error)
        }
    }

    // =========)

}

module.exports = Controller