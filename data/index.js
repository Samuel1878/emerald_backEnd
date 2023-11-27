import logger from "../config/log/logger.js";
import { dateGenerator } from "../libs/helper/generator.js";
import Days2D from "../models/day.js";

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
        (i) => e.volume >= 0 && i !== "NaN" && (e.volume += i)
      );
    }).catch((e)=>logger.err(e));
    
  }
  async _addBlockNumbers (number) {
    const Day = await this._fetchDay();

  }
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
      winner.map((e)=>{
        Day.winners.set(e.owner, e.amount);
      });
      await Day.save();

    }
  }
  _addMoney () {
    
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