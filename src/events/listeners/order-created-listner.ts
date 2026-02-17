import { Listener,OrderCreatedEvent,OrderStatus,Subjects } from "@ajaisgtickets/common";
import { queueGroupName } from "./que-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/users";


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
readonly subject=Subjects.OrderCreated;
queueGroupName=queueGroupName;
async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    
    const ticket=await Ticket.findById(data.ticket.id)
    if(!ticket){
        throw new Error("Ticket not found in db")
    }
    ticket.set({orderId: data.id})
    await ticket.save()
    msg.ack()
}
}