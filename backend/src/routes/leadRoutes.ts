import express from "express";
import Lead from "../models/Lead";

const router = express.Router();

// GET all leads
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads" });
  }
});

// ADD lead
router.post("/", async (req, res) => {
  try {
    const { name, email, status } = req.body;

    const newLead = new Lead({
      name,
      email,
      status,
    });

    const savedLead = await newLead.save();

    res.status(201).json(savedLead);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding lead" });
  }
});

// DELETE lead
router.delete("/:id", async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lead" });
  }
});

export default router;