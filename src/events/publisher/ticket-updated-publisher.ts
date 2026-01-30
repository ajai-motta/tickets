import { Publisher,Subjects,TicketUpdatedEvent } from "@ajaisgtickets/common";
import { type Stan } from "node-nats-streaming";
export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject=Subjects.TicketUpdated
    constructor(client: Stan){
        super(client)
    }
}