import axios from "axios";
import logger from "../../config/log/logger.js";
const instanceReq = async(options)=>{
    try {
          const response = await axios.request(options);
          return response?.data;
        } catch (error) {
          logger.err(error);
        }
}
export default instanceReq;