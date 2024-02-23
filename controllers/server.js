import logger from "../config/log/logger.js";
import Numbers_2D from "../models/Numbers_2D.js";
import Days2D from "../models/day.js";

const serverAdmin = {
    getDays: async(req,res,next)=>{
        const {page} = req.query;
        const Day = await Days2D.find({});
        if(Day){
            logger.info(page);
            res.status(200).json(Day.reverse());
            return
        }
        res.status(404).json({message:"ERROR: days not fond"});
      
    },
    fetchDay:async(req,res,next)=>{
        const {id} = req.body;
        if(id !== "null"){
            const Day = await Days2D.findOne({ _id: id });
            if (Day && id) {
                res.status(200).json(Day);
                return
            }
            return;
        } 
        res.status(404).json({ message: "ERROR: days not fond" });
    },
    closeServer: async(req,res,next) => {
        const {id} = req.body;
        const Day = await Days2D.findOne({_id:id});
        const Number = await Numbers_2D.find({dayId:id});

        if (Day) {
          Day.isOver = true;
          Day.status = false;
          Number.map(async(e)=>{
            e.finished = true;
            await e.save()
          });
          await Day.save();
          res.status(200).json({messae:"successfully closed"});
          return;
        }
        res.status(404).json({ message: "ERROR: days not fond" });
        
    },
    closeNumber: async(req,res,next) => {
        const {number,dayId} = req.body;
        const Day = await Days2D.findById(dayId);
        if(Day){
            Day.closedNumber.push(number);
            Day.markModified("closedNumber");
            await Day.save();
            res.status(200).json({message:number + "is closed"});
            return;
        }
        res.status(404).json({message:"Day not fond"})
        
    },
    openNumber: async(req,res,next) => {
        const { number, dayId } = req.body;
        const Day = await Days2D.findById(dayId);
        if (Day) {
        Day.closedNumber.pop(number);
        Day.markModified("closedNumber");
        await Day.save();
        res.status(200).json({ message: number + "is opened" });
        return;
        }
        res.status(404).json({ message: "Day not fond" });
                
    }
}
export default serverAdmin;