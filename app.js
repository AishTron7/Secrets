//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
})
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin-Aishwary:" + process.env.MONGOSECRET + "@cluster0.hpwki.mongodb.net/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log(`connection to database established`)
}).catch(err => {
  console.log(`db error ${err.message}`);
  process.exit(-1)
});


mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String,
});

//this is gonna hash and salt our passwords and to save our users into our db
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets", //secrets website link
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);

      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

app.get("/", function (req, res) {
  res.render("home");
});


app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => res.redirect("/secrets")
);

app.get("/login", (req, res) => res.render("login"));

app.get("/register", (req, res) => res.render("register"));


//Everyone can see secrets, only submitting one requires login.
//If you want secrets page behind authentication, use the isAuthenticated function like in app.get("/submit".. route
app.get("/secrets", async (req, res) => {
  try {
    const foundUsers = await User.find({ secret: { $ne: null } });
    res.render("secrets", { usersWithSecrets: foundUsers });
  } catch (err) {
    console.log(err);
  }
});

app.get("/submit", (req, res) => {
  req.isAuthenticated() ? res.render("submit") : res.redirect("/login");
});

//Once the user is authenticated and their session gets saved, their user details are saved to req.user.
app.post("/submit", async (req, res) => {
  const submittedSecret = req.body.secret;
  try {
    const foundUser = await User.findById(req.user.id);
    if (foundUser) {
      foundUser.secret = submittedSecret;
      await foundUser.save();
      res.redirect("/secrets");
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/logout", (req, res) => {
  req.logout(); //passport function
  res.redirect("/");
});

app.post("/register", (req, res) => {
  User.register({ username: req.body.username }, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets");
      });
    }
  });
});

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets");
      });
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server has started successfully");
});
