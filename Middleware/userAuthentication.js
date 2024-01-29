
const jwt = require('jsonwebtoken');

const Auth = (req, res, next) => {
  const token = req.headers["authorization"]
  const receive = token && token.split(' ')[1]
  // console.log(receive,"2");
  if (!receive) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }

const jwtverify = jwt.verify(receive,process.env.USER_ACCESS_TOKEN_SECRET)
       if(jwtverify){
        res.token = jwtverify.id 
        next()
       } else {
         res.json("Permission decline")
       }
  
};

module.exports = Auth;
