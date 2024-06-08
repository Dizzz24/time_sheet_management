const router = require("express").Router()
const Controller = require("../controllers/MainController")

router.get("/", Controller.R_Activities)
router.post("/", Controller.C_Activity)
router.get("/import", Controller.R_Activities)
router.get("/:activityId", Controller.R_Detail_Activity)
router.put("/:activityId", Controller.U_Activity)
router.delete("/:activityId", Controller.D_Activity)

module.exports = router