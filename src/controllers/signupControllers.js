import { validationResult } from "express-validator";
import database from "../model/database.js";

const getSignup =  (req,res)=>{
    res.render("signup", {errors: req.flash("errors")})
}

const getUser = async (req,res)=>{
    let errors = [];
    let isError = validationResult(req);

    if(!isError.isEmpty()){
        const allErrors = Object.values(isError.mapped());
        allErrors.forEach(err=>{
            errors.push(err.msg);
        }) 

        req.flash("errors", errors);
        return res.redirect("/signup");
    }

    try{
        let newUser = {
         name: req.body.name,
         email: req.body.email,
         password: req.body.password
        }
 
       const message =  await  database.createUser(newUser);
       req.flash("message", message)
        return res.redirect("/")
 
    }catch(e){
     
     req.flash("errors", ""+e);
     return res.redirect("/signup")
    };
}

const signupController = {
    getSignup: getSignup, 
    getUser: getUser
}

export default signupController;