module.exports = {

    //'url' : 'your-settings-here' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:<port>
    'url' : `${protocol}://admin:${process.env.MONGO_PASSWORD}@${mongoHost}/merry-tutor?retryWrites=true&w=majority` // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:<port>

};