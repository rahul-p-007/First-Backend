require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const path = require("path");
const hbs = require("hbs");
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
require("../src/db/conn")
const RegisterModal  = require("../src/models/register");


const public_static_path = path.join(__dirname,"../public")
const template_path = path.join(__dirname, "../template/views");
const partials_path = path.join(__dirname, "../template/partials");

app.set("view engine", "hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);
app.use(express.static(public_static_path));

app.use(express.json());


app.use(express.urlencoded({extended : true}))

// console.log(process.env.SECRET_KEY);
app.get('/', (req, res) => {
    res.render("index")
});
app.get('/login', (req, res) => {
    res.render("login")
});
app.get('/registration', (req, res) => {
    res.render("registration")
});


app.post('/registration', async(req, res) => {
        try {
          const password = req.body.password;
          const cpassword = req.body.confirmpassword;
          if(password === cpassword){
                const registerEmp = new RegisterModal({
                    email : req.body.email,
                    password : password,
                    confirmpassword : cpassword
                })
                console.log("The success part" + registerEmp);
                const token  = await registerEmp.genrateAuthToken();
                console.log("The token part " + token);

                const Result = await registerEmp.save();
                res.status(201).render("index")
          }else{
            res.send("password are not match");
          }
        } catch (error) {
            res.send(error)
        }
});

// login form 
app.post('/login', async(req,res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        // console.log(`${email} and ${password}`);
     const userEmail = await RegisterModal.findOne({email:email});

        const isMatch = await bcrypt.compare(password,userEmail.password);

        const token  = await userEmail.genrateAuthToken();
   console.log("The token part " + token);

        if(isMatch){
            res.status(201).render("index");
        }else{
            res.send("Invalid Login Details");
        }

    } catch (error) {
        res.status(400).send("Invalid email")
    }
});



// const bcyrypt = require('bcrypt');

// const securePassword = async(password)=>{
// const passwrodHash = await bcyrypt.hash(password,10);
// console.log(passwrodHash);

// const passwordMatch = await bcyrypt.compare(password,passwrodHash);



// console.log(passwordMatch);
// }

// securePassword("rahul123");

// const jwt = require('jsonwebtoken');

// const createToken = async() =>{
// const token =  await jwt.sign({_id:"6351158009a96aabfe3cbefe"},"liveisaswomeffafuafajfakfjakfjakfjakfj aofajf",{
//     expiresIn: "2 minute"
// })   
// console.log(token);

// const userVer = await jwt.verify(token,"liveisaswomeffafuafajfakfjakfjakfjakfj aofajf")
// console.log(userVer);
// }

// createToken();




app.listen(port, () => console.log(`Example app listening on port ${port}!`))