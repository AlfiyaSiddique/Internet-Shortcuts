const getLogin = (req,res)=>{
   if(req.isAuthenticated()){
     res.redirect("/userHome");
   }else{
   res.render("index", {message: req.flash("message")})
   }
}

const loginController = {
    getLogin: getLogin,  
}

export default loginController;