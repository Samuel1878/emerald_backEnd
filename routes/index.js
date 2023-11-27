import adminRouter from "./api/admin.js";
import authRouter from "./api/auth.js";
import dataRouter from "./api/data.js";

const Routes = (app) => {
    app.use("/api/auth", authRouter);
    app.use("/api/data", dataRouter);
    app.use("/api/admin", adminRouter);
    app.use("/api/bet", adminRouter)
    app.use("/", (req,res,next)=>{
        res.status(200).send("Welcome to emerald raffle");
        next();
    });
};
export default Routes;