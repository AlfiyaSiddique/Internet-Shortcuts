import express from "express";
import passport from "passport";
import loginController from "../controllers/loginControllers.js";
import signupController from "../controllers/signupControllers.js";
import userHomeController from "../controllers/userHomeController.js";
import auth from "../validation/auth.js";
import url from "url";

const router = express.Router(); 

const allRoutes = (app) => {

  router.get("/", loginController.getLogin);
  router.get("/userHome", 
  userHomeController.getUserHome);
  router.get("/signup", signupController.getSignup);
  router.get("/logout",  (req, res) =>{
    req.session.destroy((err)=>{
        return res.redirect("/");
  });
})
router.get("/api/shorturl/:num", userHomeController.visitLink)

  
  router.post("/signup", auth.validateUserInfo, signupController.getUser);
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/userHome",
      failureRedirect: "/",
      successMessage: true,
      failureMessage: true,
    }) 
  );

  router.post("/api/shorturl", async (req,res)=>{
      const link = req.body.url;
      var urlVerify = url.parse(link, true);
    
      if(urlVerify.hostname === null){
        res.json({ error: 'invalid url' });
      }else{
        if(req.headers['origin'] === 'https://www.freecodecamp.org'){
            const data = await userHomeController.freecodecamp(req.body);
          res.json({ original_url : data.URL, short_url : data.id});
        }else{
          try{
            const obj = await userHomeController.storeUserData(req.body, req.user);
            res.json({ original_url : obj.URL, short_url : obj.dataId});
          }catch(e){
            res.json({error:'Cannot insert same url value'})
          } 
      }
        }
     
    })

  router.post("/deleteURL", userHomeController.deleteURL)
  
router.get("/deleteUser", userHomeController.deleteUser)

  return app.use("/", router);
};

export default allRoutes;
