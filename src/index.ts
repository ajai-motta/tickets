import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-class-wrapper'
import { OrderCancelledListener } from './events/listeners/order-cancelled'
import { OrderCreatedListener } from './events/listeners/order-created-listner'
const startUp=async()=>{
  if(!process.env.JWT_KEY){
    throw new Error('No env variable')
  }
  
  if(!process.env.MONGO_URI){
    throw new Error('no mongo env')
  }
  
  if(!process.env.NATS_CLIENT_ID &&!process.env.NATS_URL && !process.env.NATS_CLUSTER_ID){
    throw new Error('some nats env missing')
  }
  try{
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID!,process.env.NATS_CLIENT_ID!,process.env.NATS_URL!)
    natsWrapper.client.on('close',()=>{
      console.log('closing')
      process.exit()
    })
    new OrderCancelledListener(natsWrapper.client).listen()
    new OrderCreatedListener(natsWrapper.client).listen()
    process.on('SIGINT',()=>natsWrapper.client.close())
    process.on('SIGTERM',()=>natsWrapper.client.close())
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connnected to db")
  }catch(err){
    console.log(err)
  }

  app.listen(3000, () => {
    console.log(`🚀 Server is running `);
    console.log('1')
  });
}
startUp()