import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface TicketAttrs{
title: string;
price: number;
userId: string;
}
interface TicketDocs extends mongoose.Document{
title: string;
price: number;
userId: string;
version: number;
orderId?: string;
}
interface TicketModel extends mongoose.Model<TicketDocs>{
build(attr: TicketAttrs):TicketDocs;
}
const ticketSchema=new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
orderId:{
    type: String
}},{
         toJSON:{
            transform(doc,ret){
              (ret as any).id=ret._id
              
              
              delete (ret as any)._id
            },
            versionKey: false


        }
    }
)
ticketSchema.set('versionKey','version')
ticketSchema.plugin(updateIfCurrentPlugin)
ticketSchema.statics.build=(attritutes: TicketAttrs)=>{
return new Ticket(attritutes)
}
const Ticket=mongoose.model<TicketDocs,TicketModel>('Ticket',ticketSchema)
export {Ticket}