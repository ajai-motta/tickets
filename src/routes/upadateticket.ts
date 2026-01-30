import type { Request, Response } from "express";
import express from "express";
import { body } from "express-validator";
import {
  NotAuthorizedError,
  NotFoundError,
  validateRequest,
  requireAuth,
} from "@ajaisgtickets/common";
import { Ticket } from "../models/users";
import { TicketUpdatedPublisher } from "../events/publisher/ticket-updated-publisher";
import { natsWrapper } from "../nats-class-wrapper";
import mongoose from "mongoose";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  [
    body("title").not().isEmpty().withMessage("title is required"),
    body("price").not().isEmpty().withMessage("price cant be empty"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("price must be greater than zero"),
  ],
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log("not found triggred in verfication of mongoose id");
      throw new NotFoundError();
    }
    if (!ticket) {
      console.log("not found in ticket update with :id");
      throw new NotFoundError();
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError("ticket owmer mis-match");
    }
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
    res.send(ticket);
  },
);
export { router as updateRouter };
