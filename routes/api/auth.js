import express from "express";
import register from "../../controllers/register.js";
import login from "../../controllers/login.js";
import dataController from "../../controllers/dataController.js";
import multer from "multer";
import path from "path"
const authRouter = express.Router();
import { fileURLToPath } from "url";




 const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,  "uploads/");
  },
  filename: (req, file, cb) => {
   cb(null, file.fieldname + "-" + Date.now() + file.originalname );
  },
});



const upload = multer({
  storage: storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const fileType = /jpeg|jpg|png|gif/;
    const mimeType = fileType.test(file.mimetype);
    const extname = fileType.test(path.extname(file.originalname));
    if (mimeType && extname) {
      return callback(null, true);
    }
    callback("Give proper file format to upload");
  },
});

authRouter.post("/register", register.createUser);
authRouter.post("/verification" , register.OTPverification)
authRouter.post("/login", login);
authRouter.get("/userData", dataController.userData);
authRouter.post("/changeName", dataController.nameChange)
authRouter.post("/changeProfile", upload.single("image"), dataController.profileChange)
authRouter.post("/addPayments", dataController.addPayments);
authRouter.post("/deletePayment", dataController.deletePayments);


export default authRouter;