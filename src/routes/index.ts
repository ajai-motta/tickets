import type { Request,Response } from 'express'
import express from 'express'
import { Ticket } from '../models/users'

const router=express.Router()
router.get('/api/tickets',async (req:Request,res:Response)=>{
const tickets=await Ticket.find({})// {set filterinside if you need one} returns all records
console.log(tickets,"tickets")
res.send(tickets)
})
export {router as myIngeinousRouterForAllTickets}