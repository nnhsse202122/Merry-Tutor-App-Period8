var protocol = 'mongodb+srv';
var mongoHost = 'cluster0.zgj8a.mongodb.net';
const uri = `${protocol}://admin:${process.env.MONGO_PASSWORD}@${mongoHost}/merry-tutor?retryWrites=true&w=majority`;

module.exports = {

    //'url' : 'your-settings-here' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:<port>
    'url' : uri

};