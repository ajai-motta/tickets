import express from 'express'
import type { Request,Response } from 'express'
import { Ticket } from '../models/users'
import { NotFoundError } from '@ajaisgtickets/common'
const router=express.Router()
router.get('/api/tickets/:id',async (req: Request,res: Response)=>{
const id=req.params.id
const ticket=await Ticket.findById(id)
if(!ticket){
    console.log('record not found')
    throw new NotFoundError()
}
res.send({ticket})
})

export {router as showTicketRouter}