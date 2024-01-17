const jwt = require("jsonwebtoken")
const Auth = (req,res,next) => {
    const token = req.headers["authorization"]
       
      const receive = token && token.split(' ')[1]
      const jwtverify = jwt.verify(receive,process.env.USER_ACCESS_TOKEN_SECRET)
      //  console.log(jwtverify);
       if(jwtverify){
        res.token = jwtverify.id 
        next()
       } else {
         res.json("Permission decline")
       }
}

 module.exports = Auth