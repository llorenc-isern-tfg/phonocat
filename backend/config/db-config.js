import mongoose from 'mongoose'

const dbOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  };

const createDBConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, dbOptions)
      } catch (error) {
        console.log('MongoDb connection error: ', e)
        process.exit()
      }
}

const mongooseConn = mongoose.connection
mongooseConn.once('open', ()=> {
    console.log('MongoDb connection stablished')
}) 

mongooseConn.on('error', (e)=> {
    console.log('MongoDb connection error: ', e)
    process.exit()
})

export default createDBConnection
