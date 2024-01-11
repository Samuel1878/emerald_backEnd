import express from "express";
import register from "../../controllers/register.js";
import login from "../../controllers/login.js";
import dataController from "../../controllers/dataController.js";
import multer from "multer";
const authRouter = express.Router();

// var upload = multer();
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "/uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + "-" + Date.now());
//   },
// });
// const upload = multer({storage:storage})

authRouter.post("/register", register.createUser);
authRouter.post("/verification" , register.OTPverification)
authRouter.post("/login", login);
authRouter.get("/userData", dataController.userData);
authRouter.post("/changeName", dataController.nameChange)
authRouter.post("/changeProfile", upload.single('image'), dataController.profileChange)
authRouter.post("/addPayments", dataController.addPayments);


export default authRouter;