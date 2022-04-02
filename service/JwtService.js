const jsonwebtoken = require('jsonwebtoken')

class JwtService {
     constructor(){}
      createJwtToken(userid,email,role) {
         const data ={userid,email,role}
         const token= jsonwebtoken.sign(data,process.env.JWT_SECRET,{expiresIn : "1d"})
         return token
      }
      checkJwtToken(token){
         try{
         const check=jsonwebtoken.verify(token,process.env.JWT_SECRET);
         return check;
         }catch(e){
            return e.message;
         }
      }
}
module.exports=JwtService