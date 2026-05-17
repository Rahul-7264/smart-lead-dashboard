import { Request, Response } from "express";
import Lead from "../models/Lead";

export const getLeads = async (
  req: Request,
  res: Response
) => {
  try {
    const leads = await Lead.find();

    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching leads",
    });
  }
};

export const createLead = async (
  req: Request,
  res: Response
) => {
  try {
    const newLead = new Lead(req.body);

    const savedLead = await newLead.save();

    res.status(201).json(savedLead);
  } catch (error) {
    res.status(500).json({
      message: "Error creating lead",
    });
  }
};