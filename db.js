const mongoose = require('mongoose')

if(process.env.PRODUCTION) {
	console.log("Running on production server...");
	var protocol = "mongodb";
	var mongoHost = "localhost";
}
else {
	console.log("Running for development...");
	var protocol = "mongodb+srv";
	var mongoHost = "cluster0.zgj8a.mongodb.net";
}
const uri = `${protocol}://admin:${process.env.MONGO_PASSWORD}@${mongoHost}/merry-tutor?retryWrites=true&w=majority`;

const connected = mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => console.log(err));

// change user schema to be more inclusive for parents and children
const userSchema = new mongoose.Schema({
    name: {
        first: String,
        last: String
    },
    email: String,
    google_sub: String,
    roles: [String],
    children: [String],
    graduation_year: Number
});
const User = mongoose.model("User", userSchema);

// new passport model
const PassportUserSchema = new mongoose.Schema({
    name: {
        first: String,
        last: String
    },
    email: String,
    password: String,
    roles: [String],
    children: [String],
    graduation_year: Number
});
const PassportUser = mongoose.model('PassportUser', PassportUserSchema);

const sessionSchema = new mongoose.Schema({
    date: Date,
    tutor: {
        id: String,
        name: {
            first: String,
            last: String
        }
    },
    tutee: {
        id: String,
        name: {
            first: String,
            last: String
        }
    },
    shadow: {
        id: String,
        name: {
            first: String,
            last: String
        }
    },
    subject: String,
    session_duration: Number,
    fields: {
        what_they_learned: String,
        homework: String,
        next_time: String
    }
});
const Session = mongoose.model("Session", sessionSchema);

module.exports = {
    async getSessionModel() {
        await connected;    // wait until connected to MongoDB
        return Session;
    },
    async getUserModel() {
        await connected;    // wait until connected to MongoDB
        return User;
    },
    async getPassportUserModel(){
        await connected;
        return PassportUser
    }
};
