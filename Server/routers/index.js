const router = require("express").Router()
const Controller = require("../controllers/MainController")
const actRouter = require("./actRouter")
const authentication = require("../middleware/authentication")

// Multer setup
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// =============>

// Route Activities
router.use("/activities", authentication, actRouter)
router.get("/export", Controller.exportData)
router.post('/import', authentication, upload.single('file'), Controller.importData);

// Project
router.get("/projects", authentication, Controller.R_Project)
router.post("/projects", authentication, Controller.C_Project)

// employee/user
router.post("/employee", Controller.C_Or_R_Employee)
router.get("/employee", authentication, Controller.G_Employee)
router.put("/employee", authentication, Controller.U_Employee)

module.exports = router