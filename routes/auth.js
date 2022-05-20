let express = require("express");
const req = require("express/lib/request");
const { json } = require("express/lib/response");
const CLIENT_ID = "463712655499-f9d45054qk3ag0bbebvnqd5q8cndsepr.apps.googleusercontent.com"

let {OAuth2Client} = require('google-auth-library');
const { eachAsyncSeries } = require("mongodb/lib/core/utils");
let oAuth2Client = new OAuth2Client(CLIENT_ID);

const db = require("../db.js");
const bcrypt=require('bcrypt')



 //please ignore this
 //the user schema is in db.js
/*
    User Data Schema:
    {
        _id: "string",
        name: {
            first: "First",
            last: "Last"
        },
        email: "example@gmail.com", (optional)
        password" "password", (optional)
        google_sub: "string", (optional)
        roles: ["tutee", "parent", "tutor", "board"],
        children: ["id1", "id2"],
        graduation_year: XXXX (omtitted only if parent),

    }
*/
router=express.Router();
router.post("/v1/google", async (req, res) => { //login.js sends the id_token to this url, we'll verify it and extract its data
    let { token }  = req.body; //get the token from the request body
  
    let ticket = await oAuth2Client.verifyIdToken({ //verify and decode the id_token
        idToken: token,
        audience: CLIENT_ID
    });

    let {sub, email, given_name, family_name} = ticket.getPayload(); //get the user data we care about from the id_token
    let user = await getOrMakeUser(sub, email, (given_name || "").toLowerCase(), (family_name || "").toLowerCase(), null); //call this function to get a reference to the user that's stored in the database
    req.session.userId = user._id; //sets "userId" on the session to the id of the user in the database
    console.log("SAVING _ID", req.session.userId)
    res.status(201);
    res.json(user);
})

//registering new user
router.post("/v1/passportUser", async (req, res) => {
    let {newPassportUserData}=req.body;//get the user data from the stuff that was sent
    let passportUser=await makePassportUser(newPassportUserData.given_name.toLowerCase(), newPassportUserData.family_name.toLowerCase(), newPassportUserData.email, newPassportUserData.password, newPassportUserData.roles, newPassportUserData.graduation_year);//makes the new user 
    res.status(201);
    res.json(passportUser);
})




router.post("/v1/newUser", async (req, res) => {
    console.log(req.user)
    if (!req.user || req.user.roles.length != 0) {
        console.log("user does not exist!");
        return
    }
    let newUserData = req.body;
    let user = req.user;
    if (newUserData.isParent) {
        user.roles.push("parent");
        if (newUserData.existingChildEmail) {
            let child_id = await findIdByEmail(newUserData.existingChildEmail);
            if (child_id) user.children.push(String(child_id));
        } else if (newUserData.newChildData) {
            let child = {
                name: {
                    first: (newUserData.newChildData.name.first || "").toLowerCase(),
                    last: (newUserData.newChildData.name.last || "").toLowerCase(),   
                },
                email: newUserData.newChildData.email,
                google_sub: null,
                roles: ["tutee"],
                children: [],
                graduation_year: newUserData.newChildData.gradYear
            }
            console.log(child);
            user.children.push(String((await (await db.getUserModel()).insertOne(child)).ops[0]._id));
            await (await db.getUserModel()).replaceOne({_id: user._id}, user, {upsert: true})
        } 
    } else { // user is a tutee
        console.log("BBBB")
        user.graduation_year = newUserData.gradYear //update tutee with graduation year
        user.roles.push("tutee");
        // currently not storing parent email
    }
    await (await db.getUserModel()).replaceOne({_id: user._id}, user, {upsert: true})
    res.json(true);
})

router.post("/v1/passportUserLogin", async (req, res) => {
    let {PassportUserData}=req.body;
    let response=await login(PassportUserData);
    if (response.message=="Login success"){
        req.session.userId = response.userDoc._id;
        res.json(response);
        console.log(response.userDoc)
    }
    else{
        res.json(response);
    }
})

router.post("/v1/checkForDuplicate", async (req, res) => {
    
    let {newPassportUserData}=req.body;
    let message=await findByEmail(newPassportUserData.email);
    res.json(message);
    

})

/*
Return + update a user if match in database otherwise make a new user, add it to the database and return it
Matching priority:
1. google_sub
2. email
3. name (first and last)
*/
async function getOrMakeUser(google_sub, email, given_name, family_name, graduation_year) {
    if (google_sub) var user = await (await db.getUserModel()).findOne({google_sub: google_sub}); //see if a user exists with their google account
    if (!user) user = await (await db.getUserModel()).findOne({email: email, google_sub: null}); //see if a user exists with their email
    if (!user) user = await (await db.getUserModel()).findOne({name: {first: given_name, last: family_name}, google_sub: null}); //see if a user exists with their name
    if (!user) { //we are certain the user doesn't exist yet, let's make them from scratch
        user = new (await db.getUserModel())({
            // _id generated when .insertOne is called with _id undefined
            name: {
                first: given_name,
                last: family_name
            },
            email: email,
            password: null, 
            google_sub: google_sub,
            role: [],
            children: [],
            graduation_year: graduation_year
        });
        await user.save(); // insert the user into the collection
    } else {
        user.google_sub = google_sub;
        (await db.getUserModel()).replaceOne({_id: user._id}, user);
    }
    return user; //return the user (either newly made or updated)
}

async function makePassportUser(given_name, family_name, email, password, roles, graduation_year){
    user=new (await db.getUserModel())({
        name: {
            first: given_name,
            last: family_name
        },
        email: email,
        password: await bcrypt.hash(password, 10),
        roles: [roles],
        google_sub: null,
        children: [],
        graduation_year: graduation_year
    });
    await user.save();
    return user
}
async function findIdByEmail(email) {
    // find one doc with name.first being the first name and name.last being the last name. All names are stored in lower case.
    let userDoc = await (await db.getUserModel()).findOne({email:email});
    if (!userDoc) {
        return undefined;
    }
    user_id = userDoc["_id"];
    return user_id;
}

async function findByEmail(email) {
    // find one doc with name.first being the first name and name.last being the last name. All names are stored in lower case.
    let userDoc = await (await db.getUserModel()).findOne({email:email});
    if (!userDoc) {
        return "no";
    }
    
    return "yes";
}

//DO NOT CHANGE ANY OF THE MESSAGES
//DYLAN WON'T BE HERE TO HELP YOU!!!!!
async function login(user){
    let userDoc = await (await db.getUserModel()).findOne({email:user.email});
    if (!userDoc) {
        return {message:"The user does not exist", userDoc};
    }
    else{
        if (/*user.password==userDoc.password*/await bcrypt.compare(user.password, userDoc.password)){
            return {message:"Login success", userDoc};
        }
        else{
            return {message:"Password incorrect", userDoc}
        }
    }
    
}


// Logout
router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect("/");
});

module.exports = router;