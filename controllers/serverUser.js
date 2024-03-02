import Transactions from "../models/transaction.js";
import logger from "../config/log/logger.js";
import { dateGenerator, decodeToken, gToken } from "../libs/helper/generator.js";
import Winners_2D from "../models/2DWinners.js";
import Winners_3D from "../models/3DWinners.js";
import Numbers_2D from "../models/Numbers_2D.js";
import Numbers_3D from "../models/Numbers_3D.js";
import User from "../models/user.js";
import CashInOuts from "../models/cashInOut.js";
import Payments from "../models/payments.js";
import Days2D from "../models/day.js";
import SemiMonth from "../models/Month.js";
import Bet2D_Controller from "../data/index.js";
import { fetchReceiveHis, fetchTransferHis } from "../libs/index.js";

const serverUser = {
  serverLogin: async (req, res, next) => {
    const { password } = req.body;
    logger.debug(password);
    if (password == process.env.KEY_TOKEN) {
      let token = gToken(password);
      res.status(201).json({ token: token });
      return;
    } else {
      res.status(401).json({ token: null });
    }
  },
  users: async (req, res, next) => {
    const { page } = req.query;
    const users = await User.find({});
    logger.tip(page);
    users && res.status(200).json({ users: users });
  },
  transactions: async (req, res, next) => {
    const { userId } = req.query;
    const tran = await fetchTransferHis(userId);
    const rec = await fetchReceiveHis(userId);
    let Trans = tran.concat(rec);
    Trans && res.status(200).json(Trans);
  },
  depositAdmin: async (req, res, next) => {
    const { page } = req.query;
    const data = await CashInOuts.find({type:"deposit"});
    data.reverse();
    data && res.status(200).json(data);
  },
  withdrawlAdmin: async (req, res, next) => {
    const { page } = req.query;
    const data = await CashInOuts.find({ type: "withdrawl" });
    data && data.reverse() ;
    data && res.status(200).json(data);
  },
  addMoney: async (req, res, next) => {
    const { userId, amount,userToken,receiptID} = req.body;
    const decodedId = decodeToken(userToken);
    const cashIO = await CashInOuts.findById(receiptID);
    if (decodedId && decodedId.id == process.env.KEY_TOKEN && cashIO) {
      const user = await User.findById(userId);
      user.money += amount;
      cashIO.status = "success";
      cashIO.completed = true;
      await user.save();
      await cashIO.save();
      res.status(200).json({ message: "Successfully added " + amount });
      return;
    }
    res.status(401).json({ message: "ERROR" });
  },
  reduceMOney:async(req,res,next)=>{
     const { userId, amount, userToken,receiptID } = req.body;
     const decodedId = decodeToken(userToken);
     if (decodedId && decodedId.id == process.env.KEY_TOKEN) {
       const user = await User.findById(userId);
       user.money -= amount;
       user.save();
       res.status(200).json({message:"Successfully reduced " + user.amount});
       return;
     }
     res.status(401).json({ message: "ERROR" });
  },
  changePassword: async (req, res, next) => {
    const { userToken, oldPwd, newPwd } = req.body;
    const decodedId = decodeToken(userToken);
    const user = await User.findOne({ _id: decodedId.id });
    if (user && user.password == oldPwd) {
      user.password = newPwd;
      user.save();
      res.status(200).json({ message: "successfully changed" });
      return;
    } else {
      res.status(403).json({ message: "current password invalid" });
    }
  },
  open3D: async(req,res,next)=> {
    const {Y,M,D} = dateGenerator();
    let start;
    let range ;
    let end ;
    if(D<16 && D>=1){
      start = 1;
      end = 16;
      range = "font-month";
    }else if( D>=16 || D<=31){
      end = 30;
      range = "back-month";
      start = 16;
    }
    const month = new SemiMonth({
      year:Y,
      month:M,
      start:start,
      end:end,
      range:range
    });
    await month.save();
    res.status(200).json({message:"success"})
  },
  openServer: async (req, res, next) => {
    const {maxVolume} = req.body;
    const {Y,M,D,t,P} = dateGenerator()
    // const isDay = Days2D.findOne({
    //   $an: [
    //     { date: { $e: date } },
    //     { month: { $e: month } },
    //     { year: { $e: year } },
    //   ],
    // });
    // if(!isDay){
    const day = new Days2D({
      date: D,
      month: M,
      year: Y,
      maxVolume: parseInt(maxVolume),
      section:P,
    });
    await day.save();
    res.status(201).json(day);

    // }
    // console.log(isDay);
    // res.status(404).json({message:"Already exit"});
  },
  //closeServer: async (req, res, next) => {},
  bet2D: async (req, res, next) => {
    const betDigit2D = req.body;
    const { userToken } = req.query;
    let numbers;
    const {Y,M,D,P,t} = dateGenerator();
    const decodedId = decodeToken(userToken);
    const Day = await Bet2D_Controller._checkDay();
    const user = await User.findOne({ _id: decodedId.id });
      if (Day==null || Day=="undefined") {
        res.status(404).json({message:"Today is closed"});
        return
      } else if (user && betDigit2D && Day) {
        for (let i = 0; i < betDigit2D.length; i++) {
          const betData = betDigit2D[i];
          numbers = new Numbers_2D({
            number: betData.number,
            owner: decodedId.id,
            amount: betData.amount,
            date: Day.date,
            year: Day.year,
            month: Day.month,
            section: Day.section,
            dayId: Day._id,
            time:t,
          });
          Day.sold.push(numbers);
          Day.bets[betData.number] += parseInt(betData.amount);
          Day.markModified("bets");
          user.money -= parseInt(betData.amount);
          Day.markModified("investors");
          Day.investors[user._id] += parseInt(betData.amount);
            await numbers.save();
        }
        await Day.save()
      
        await user.save();
        res.status(200).json({ message: Day.bets });
        return;
      }
       res.status(401).json({ message: "Ops! Something Error" });
  },
  bet3D: async (req, res, next) => {
    const betDigit3D = req.body;
    const { userToken } = req.query;
    let numbers;
    const decodedId = decodeToken(userToken);
    const { Y, M, D, P } = dateGenerator();
    let end ;
    let start ;
    if(D<16 && D>=1){
      end = 16;
      start = 1;
      
    }else if (D>=16 || D<=31){
      end = 30;
      start = 16;
    }
    const Month = await SemiMonth.findOne(
      {
        $and: [
          { year: { $eq: Y.toString() } },
          { month: { $eq: M.toString() } },
          { end: { $eq: end } },
          { start: { $eq: start } },
        ],
      }
    );
    logger.debug(Month);
    logger.debug(end,start)

    const user = await User.findOne({ _id: decodedId.id });
    if (Month && user && betDigit3D) {
      for (let i = 0; i < betDigit3D.length; i++) {
        const betData = betDigit3D[i];
        numbers = new Numbers_3D({
          number: betData.number,
          owner: decodedId.id,
          amount: betData.amount,
          date: D, 
          MonthId:Month._id,
          year:Y,
          month:M,
          range:Month.range,
          time:t
        });

        user.money -= parseInt(betData.amount);
        console.log(user.money, parseInt(betData.amount));
      }
      await numbers.save();
      await user.save();
      return res.status(200).json({ message: "Successfully bet!" });
    }
    res.status(401).json({ message: "User not found" });
  },
  add2dWinners: async (req, res, next) => {
    const { id, capital, earn, number } = req.body;
    const user = await User.findOne({ _id: id });
    if (user) {
      const winner = new Winners_2D({
        id: id,
        name: user.name,
        phone: user.phone,
        capital: capital,
        earn: earn,
        luckyNo: number,
      });
      let orEarn = user.earn;
      user.earn = orEarn + earn;
      user.save();
      winner.save();
      res.status(200).json({ message: "winners successfully added!" });
      return;
    }
    res.status(401).json({ message: "user not found" });
  },
  add3dWinners: async (req, res, next) => {
    const { id, capital, earn, number } = req.body;
    const user = await User.findOne({ _id: id });
    if (user) {
      const winner = new Winners_3D({
        id: id,
        name: user.name,
        phone: user.phone,
        capital: capital,
        earn: earn,
        luckyNo: number,
      });
      let orEarn = user.earn;
      user.earn = orEarn + earn;
      res.status(200).json({ message: "winners successfully added!" });
      user.save();
      winner.save();
      return;
    }
    res.status(401).json({ message: "user not found" });
  },
  transfer: async (req, res, next) => {
    const { phone, name, amount, pin } = req.body;
    const { userToken } = req.query;
    const decodedId = decodeToken(userToken);
    const user = await User.findOne({ _id: decodedId.id });
    const To = await User.findOne({ phone: phone });
    const { Y, M, D, P, t,c } = dateGenerator();
    if (user && To && user.pin === pin) {
      user.money -= amount;
      const tran = new Transactions({
        toName: name,
        fromName: user.name,
        amount: amount,
        toPhone: phone,
        fromPhone: user.phone,
        from: user._id.toString(),
        to: To._id.toString(),
        date: D,
        month:M,
        year:Y,
        time: c,
      });
      To.money += amount;
      To.save();
      tran.save();
      user.save();
      res.status(200).json({ message: "successfully transfer" });
      return;
    }
    res.status(403).json({ message: "transaction failed" });
  },
  pinManagement: async (req, res, next) => {
    const { pin, userToken } = req.body;
    const decodedId = decodeToken(userToken);
    const user = await User.findOne({ _id: decodedId.id });
    if (user) {
      user.pin = pin;
      user.save();
      res.status(200).json({ message: "successfully added pin" });
      return;
    }
    res.status(403).json({ message: "user not found" });
    next();
  },
  deposit: async (req, res, next) => {
    const { phone, name, type, method, amount, oneTimeNo } = req.body;
    const { userToken } = req.query;
    const decodedId = decodeToken(userToken);
    const user = await User.findOne({ _id: decodedId.id });
    if (user) {
      const depo = new CashInOuts({
        id: decodedId.id,
        type: type,
        method: method,
        amount: amount,
        name: name,
        phone: phone,
        oneTimeNo: oneTimeNo,
      });
      depo.save();
      res.status(201).json({ message: "successfully submitted",id:depo._id });
      return;
    }
    res.status(404).json({ message: "user not found" });
  },
  withdrawl: async (req, res, next) => {
    const { phone, name, type, method, amount } = req.body;
    const { userToken } = req.query;
    const decodedId = decodeToken(userToken);
    const user = await User.findOne({ _id: decodedId.id });
    if (user) {
      const withdrawl = new CashInOuts({
        id: decodedId.id,
        type: type,
        method: method,
        amount: amount,
        name: name,
        phone: phone,
      });
      user.money -= amount;
      withdrawl.save();
      user.save();
      res.status(201).json({ message: "successfully submitted" });
      return;
    }
    res.status(404).json({ message: "user not found" });
  },
  CashInoutHis: async (req, res, next) => {
    const { userToken } = req.query;
    const decodedId = decodeToken(userToken);
    const his = await CashInOuts.find({ id: decodedId.id });
    if (his) {
      res.status(200).json(his);
      return;
    }
    res.status(404).json({
      message: "user not found",
    });
  },
  checkCashInOut: async (req, res, next) => {
    const { amount, transactionId, id } = req.body;
    const trans = await CashInOuts.findOne({ _id: transactionId });
    if (trans) {
      trans.completed = true;
      trans.status = "succeed";
      trans.amount = amount;
      trans.save();
      res.status(201).json({ message: "successfully updated" });
      return;
    }
    res.status(404).json({ message: "User Not found" });
  },
  addPayments: async (req, res, next) => {
    const { name, phone, maximum, method } = req.body;
    const payments = new Payments({
      name: name,
      phone: phone,
      maximum: maximum,
      method: method,
    });
    await payments.save();
    res.status(200).json({ message: "successfully added payments" });
  },
  getPayments: async (req, res, next) => {
    const { userToken, method } = req.query;
    const decodedId = decodeToken(userToken);
    const user = await User.findOne({ _id: decodedId.id });
    if (user) {
      const payments = await Payments.find({ method: method });
      res.status(200).json(payments);
      return;
    }
    res.status(404).json({ message: "request failed" });
  },
};
export default serverUser;