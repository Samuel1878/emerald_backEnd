import logger from "../config/log/logger.js";
import { dateGenerator } from "../libs/helper/generator.js";
import Winners_2D from "../models/2DWinners.js";
import Days2D from "../models/day.js";
import User from "../models/user.js";

class Bet2D_Controller {
  constructor(id) {
    this.id = id
  }
  
  async _fetchDay () {
    const Day = await Days2D.findOne({_id:this.id});
    return Day || null
  }
   _syncDay (){
    const Day = this._fetchDay();
    Day && Day.then(async(e)=>{
      e.markModified("volume");
      Object.values(e.bets).map(
        (i) => i !== NaN && (e.volume += i)
      );
     await e.save();
    }).catch((e)=>logger.err(e));
    
  }
  // async _addBlockNumbers (number) {
  //   const Day = await this._fetchDay();

  // }
  async _check () {
    let winner;
    const Day = await this._fetchDay();
    if(Day && Day.winNumber){
    winner = Day.sold.filter((e) => e.number === Day.winNumber);
   } 
   return winner;
  }
  async _passWinners () {
    const winner = await this._check();
    if (winner) {
      const Day = await this._fetchDay();
      this._syncDay()
      winner.map((e)=>{
        Day.winners.set(e.owner, e.amount);
      });
      await Day.save();
    }
  }
  async _addMoney (times,socket) {
    const Day = await this._fetchDay();
    Day.winners.forEach(async(key,value)=>{
      const user = await User.findById(value);
      if(user){
        const Winner = new Winners_2D({
          id:user._id,
          name:user.name,
          phone:user.phone,
          luckyNo:Day.winNumber,
          capital:parseInt(key),
          times:times,
          dayId:Day._id,
          earn:parseInt(key) * parseInt(times),
        });
        console.log(Winner);
        await Winner.save();
        user.money += Winner.earn || parseInt(key) * parseInt(times);
        user.earn += (Winner.earn || parseInt(key) * parseInt(times)) - parseInt(key);
        await user.save();
        return
      };
    });
  }
  
  static async _checkDay() {
    const {Y,M,D,P} = dateGenerator();
    const isDay = await Days2D.findOne({
      $and: [
        { date: { $eq: D } },
        { year: { $eq: Y } },
        { month: { $eq: M } },
        { section: {$eq: P }},
        { isOver: {$eq: false}},
      ],
    });
    console.log(isDay)
    return isDay || null;
  }

};
export default Bet2D_Controller;