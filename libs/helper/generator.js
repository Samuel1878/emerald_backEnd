import jwt from "jsonwebtoken";
export const gOTP = ()=>{
    return Math.random().toString(36).substring(2, 12);
}

export const gToken = id=>{
    return jwt.sign({id}, process.env.JWT_SECRET);
}
export const decodeToken = token => {
    return jwt.verify(token, process.env.JWT_SECRET);
}
export const generateId = ()=>{
    return
}
export const dateGenerator = () => {
  const date = new Date();
  let Y = date.getFullYear();
  let M = date.getMonth() + 1;
  let D = date.getDate();
  let T = date.getHours();
  let t = date.getTime();
  let P;
  T >= 12 ? (P = "ev") : (P = "af");
 
  return {Y,M,D,P,t}
};
