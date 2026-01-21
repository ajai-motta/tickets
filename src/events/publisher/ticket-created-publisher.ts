import { Publisher,Subjects,TicketCreatedEvent } from "@ajaisgtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject=Subjects.TicketCreated
}