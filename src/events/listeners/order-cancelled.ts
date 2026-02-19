import { Listener,OrdercancelledEvent,OrderStatus,Subjects } from "@ajaisgtickets/common";
import { queueGroupName } from "./que-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/users";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";


export class OrderCancelledListener extends Listener<OrdercancelledEvent>{
readonly subject=Subjects.Ordercancelled;
queueGroupName=queueGroupName;
async onMessage(data: OrdercancelledEvent['data'], msg: Message) {
    
    const ticket=await Ticket.findById(data.ticket.id)
    if(!ticket){
        throw new Error("Ticket not found in db")
    }
    ticket.set({orderId: undefined}) // some say null dosent work good with ts
    await ticket.save()
     await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
    version: ticket.version,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    orderId: ticket.orderId, 
     })
    msg.ack()
}
}