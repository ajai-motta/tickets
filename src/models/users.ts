import mongoose from "mongoose";
interface TicketAttrs{
title: string;
price: number;
userId: string;
}
interface TicketDocs extends mongoose.Document{
title: string;
price: number;
userId: string;
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
ticketSchema.statics.build=(attritutes: TicketAttrs)=>{
return new Ticket(attritutes)
}
const Ticket=mongoose.model<TicketDocs,TicketModel>('Ticket',ticketSchema)
export {Ticket}