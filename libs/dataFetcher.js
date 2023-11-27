import instanceReq from "./helper/axios.js";
export async function fetchLive (){
        const options = {
          method: "GET",
          url: `https://thai-lotto-new-api.p.rapidapi.com/api/v1/live`,
          headers: {
            "X-RapidAPI-Key":
              "2ebad97563msh9ab84284298e633p12a16cjsnd20f2d3f24a4",
            "X-RapidAPI-Host": "thai-lotto-new-api.p.rapidapi.com",
          },
        };
        return (await instanceReq(options));
    }
export async function fetchResults() {
        const options = {
          method: "GET",
          url: `https://thai-lotto-new-api.p.rapidapi.com/api/v1/results`,
          headers: {
            "X-RapidAPI-Key":
              "2ebad97563msh9ab84284298e633p12a16cjsnd20f2d3f24a4",
            "X-RapidAPI-Host": "thai-lotto-new-api.p.rapidapi.com",
          },
        };
       return await instanceReq(options);
    }
    export async function fetchthreed() {
      const options = {
        method: "GET",
        url: `https://thai-lotto-new-api.p.rapidapi.com/api/v1/threed`,
        headers: {
          "X-RapidAPI-Key":
            "2ebad97563msh9ab84284298e633p12a16cjsnd20f2d3f24a4",
          "X-RapidAPI-Host": "thai-lotto-new-api.p.rapidapi.com",
        },
      };
      return await instanceReq(options);
    }
    export async function fetchTwoD({page,limit}){
      const options = {
        method: 'GET',
        url: 'https://thai-lotto-new-api.p.rapidapi.com/api/v1/calendar',
        params: {
          page: {page},
          limit: {limit}
        },
        headers: {
          'X-RapidAPI-Key': '2ebad97563msh9ab84284298e633p12a16cjsnd20f2d3f24a4',
          'X-RapidAPI-Host': 'thai-lotto-new-api.p.rapidapi.com'
        }
      };
      return await instanceReq(options);
}
