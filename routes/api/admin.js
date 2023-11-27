import express from "express";
import serverUser from "../../controllers/serverUser.js";
import { resetControllers } from "../../controllers/login.js";
import serverAdmin from "../../controllers/server.js";
const adminRouter = express.Router();

//post
adminRouter.post("/addMoney", serverUser.addMoney);
adminRouter.post("/reduceMoney", serverUser.reduceMOney);
adminRouter.post("/changePwd", serverUser.changePassword);
adminRouter.post("/2D", serverUser.bet2D)
adminRouter.post("/3D", serverUser.bet3D);
adminRouter.post("/adminLogin", serverUser.serverLogin);
adminRouter.post("/add2dWinner", serverUser.add2dWinners)
adminRouter.post("/add3dWinner", serverUser.add3dWinners);
adminRouter.post("/transfer", serverUser.transfer);
adminRouter.post("/changePin",serverUser.pinManagement);
adminRouter.post("/deposit",serverUser.deposit );
adminRouter.post("/withdrawl", serverUser.withdrawl);
adminRouter.post ("/checkCashInOut", serverUser.checkCashInOut);
adminRouter.post("/payments", serverUser.addPayments);
adminRouter.post("/resetPin", resetControllers.resetPin);
adminRouter.post("/resetPwd",resetControllers.resetPassword);
////ADMIN
adminRouter.post("/open", serverUser.openServer);
adminRouter.post("/close", serverAdmin.closeServer);
adminRouter.post("/fetchDay", serverAdmin.fetchDay);
adminRouter.post("/open3D", serverUser.open3D);
adminRouter.post("/closeNumber", serverAdmin.closeNumber);
adminRouter.post("/openNumber", serverAdmin.openNumber);

//get
///ADMIN
adminRouter.get("/users", serverUser.users);
adminRouter.get("/transactionAd", serverUser.transactions);
adminRouter.get("/depositAd", serverUser.depositAdmin);
adminRouter.get("/withdrawlAd", serverUser.withdrawlAdmin);
adminRouter.get("/days", serverAdmin.getDays);

///USER
adminRouter.get("/cashinout", serverUser.CashInoutHis);
adminRouter.get("/payments", serverUser.getPayments);

export default adminRouter
