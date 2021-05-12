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
    console.log('MongoDb connection error: ', error)
    process.exit()
  }
}

const mongooseConn = mongoose.connection
mongooseConn.once('open', () => {
  console.log('MongoDb connection stablished')
})

mongooseConn.on('error', (error) => {
  console.log('MongoDb connection error: ', error)
  process.exit()
})

export const closeConnection = async () => {
  mongooseConn.close()
}

export default createDBConnection
