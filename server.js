import express from "express";
import parser from "body-parser";
import ejs from "ejs";
import allRoutes from "./src/routes/web.js";
import flash from "connect-flash";
import cookie from "cookie-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import passportLocal from "passport-local";
import database from "./src/model/database.js";
import cors from "cors";

const app = express();
app.use(cors({optionsSuccessStatus:200}))
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

app.use(cookieParser());
app.use(session({
    secret: process.env["secret"],
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*24
    }
    
}))
app.use(flash())

app.use(express.static("./src/public"));
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(passport.initialize());
app.use(passport.session());

const localStrategy = passportLocal.Strategy;

passport.use( new localStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, 
  async (req, email, password, done)=>{
        try{
            await database.getUserByEmail(email)
            .then(async user=>{
                if(!user){
                    return done(
                        null,
                        false,
                        req.flash("message", `The user with email ${email} does not exist`)
                      );
                }

                if(user){
                    let match = await database.comparePassword(password, user);

                    if(match === true){
                        return done(null, user, null);
                    }
                }
            })

        }catch(e){
             return done(null, false, req.flash("message", ""+e))
        }
  }
 ))

 passport.serializeUser((user, done)=>{
    done(null, user.userid);
 })

 passport.deserializeUser( (id, done)=>{
  database.getUserById(id)
  .then(user=>{
     return done(null, user)
  }).catch(err=>{
      return done(err, null)
  })
 })


allRoutes(app);

const port =   process.env.PORT || 5050; 

app.listen(port, ()=>{
    console.log("Server is running.")
})
