module.exports = {

    //'url' : 'your-settings-here' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:<port>
    'url' : `mongodb://admin:${process.env.MONGO_PASSWORD}@localhost/merry-tutor?retryWrites=true&w=majority` // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:<port>

};