import express from 'express'
import type { Request,Response } from 'express'
import {body} from 'express-validator'
import { requireAuth,validateRequest } from '@ajaisgtickets/common'
import { Ticket } from '../models/users'
import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher'
import { natsWrapper } from '../nats-class-wrapper'
const router=express.Router()
router.post('/api/tickets',requireAuth,

    [
        body('title').not().isEmpty().withMessage('title is required'),
        body('price').isFloat({gt:0}).withMessage('invalid Price')

    ]
,validateRequest,
async (req: Request,res: Response)=>{
    console.log('reached post /api/tickets')
    const {title,price}=req.body;
    const ticket=Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    })
    await ticket.save()
    await new TicketCreatedPublisher(natsWrapper.client).publish({
         id: ticket.id, title: ticket.title, price: ticket.price, userId: ticket.userId,version: ticket.version
    })
    res.status(201).send(ticket)
})
export {router as createTicketRouterNew}