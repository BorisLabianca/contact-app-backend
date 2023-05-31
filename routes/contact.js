const express = require("express");
const Contact = require("../models/Contacts");

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    // console.log(req.body);
    const newContact = await Contact.create(req.body);
    res.status(200).json({ status: "SUCCESS", newContact });
  } catch (error) {
    res.status(500).json({ status: "FAILED", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const allContacts = await Contact.find({});
    res.status(200).json({ status: "SUCCESS", allContacts });
  } catch (error) {
    res.status(500).json({ status: "FAILED", error });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const singleContact = await Contact.findById(id);
    res.status(200).json({ status: "SUCCESS", singleContact });
  } catch (error) {
    res.status(500).json({ status: "FAILED", error });
  }
});

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const contactToUpdate = await Contact.findByIdAndUpdate(id, req.body);
    res.status(200).json({ status: "SUCCESS", contactToUpdate });
  } catch (error) {
    res.status(500).json({ status: "FAILED", error });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const contactToRemove = await Contact.findByIdAndRemove(id, req.body);
    res.status(200).json({ status: "SUCCESS", contactToRemove });
  } catch (error) {
    res.status(500).json({ status: "FAILED", error });
  }
});

module.exports = router;
