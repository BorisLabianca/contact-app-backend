const express = require("express");
const Contact = require("../models/Contacts");
const { uploadImage } = require("../middlewares/multer");
const { uploadImageToCloudinary } = require("../utils/helper");
const cloudinary = require("../cloudinary/index");

const router = express.Router();

router.post("/create", uploadImage.single("file"), async (req, res) => {
  try {
    // console.log(req.body);
    const contactInfo = req.body;
    const imageFile = req.file;
    // console.log(imageFile);
    const newContact = new Contact(contactInfo);
    // console.log("filePath before cloudinary: ", imageFile.path);
    const { url, public_id } = await uploadImageToCloudinary(
      imageFile.path,
      newContact._id
    );
    console.log(url, public_id);
    newContact.image = { url, public_id };
    const finalContact = await Contact.create(newContact);
    res.status(200).json({ status: "SUCCESS", finalContact });
  } catch (error) {
    console.log(error);
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

router.put("/update/:id", uploadImage.single("file"), async (req, res) => {
  const id = req.params.id;
  const { fullName, email, birthDate, phoneNumber } = req.body;
  const imageFile = req.file;
  console.log(imageFile);
  try {
    const contactToUpdate = await Contact.findById(id);
    if (!contactToUpdate)
      res
        .status(200)
        .json({ status: "FAILED", message: "Contact not found in database." });

    const public_id = contactToUpdate.image.public_id;
    if (public_id && imageFile) {
      const { result } = await cloudinary.uploader.destroy(public_id);
      if (result !== "ok") {
        res.status(200).json({
          status: "FAILED",
          message: "Could not remove the image from Cloidinary.",
        });
      }
    }
    if (imageFile) {
      const { url, public_id } = await uploadImageToCloudinary(
        imageFile.path,
        contactToUpdate._id
      );
      contactToUpdate.image = { url, public_id };
    }
    contactToUpdate.fullName = fullName;
    contactToUpdate.email = email;
    contactToUpdate.birthDate = birthDate;
    contactToUpdate.phoneNumber = phoneNumber;
    await contactToUpdate.save();
    res.status(200).json({ status: "SUCCESS", contactToUpdate });
  } catch (error) {
    res.status(500).json({ status: "FAILED", error });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      res.status(200).json({ status: "FAILED", message: "Contact not found." });
    }
    const public_id = contact?.image?.public_id;
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") {
      res.status(200).json({
        status: "FAILED",
        message: "Could not remove the image from Cloudinary.",
      });
    }
    await cloudinary.api.delete_folder(`/contact-app/contacts/${id}`);
    const contactToRemove = await Contact.findByIdAndRemove(id, req.body);
    res.status(200).json({ status: "SUCCESS", contactToRemove });
  } catch (error) {
    res.status(500).json({ status: "FAILED", error });
  }
});

module.exports = router;
