const express = require("express");
const router = express.Router();
const Claimemail = require("../models/claimemail");
const mongoose = require("mongoose");
const checkAuth=require('../middleware/check-auth')
const cloudinary=require('cloudinary').v2;
cloudinary.config({ 
  cloud_text: 'alpja', 
  api_key: '556517137364383', 
  api_secret: 'FCqYSd-J1Kew_VgMCOBZSIcqnJY'

});
router.post("/", async (req, res, next) => {
  try {
    const claimemail = new Claimemail({
      _id: new mongoose.Types.ObjectId(),
      from: req.body.message?.headers?.from || "No Sender", // Safely accessing nested fields
      to: req.body.message?.headers?.to || "No Recipient", // Fixed the 'to' field mapping
      mailgunResponseId: req.body.id || "No ID", // Mapping the Mailgun event ID
      sentAt: req.body.timestamp
        ? new Date(req.body.timestamp * 1000).toISOString()
        : new Date().toISOString(), // Convert timestamp to ISO
      subject: req.body.message?.headers?.subject || "No Subject",
      type: req.body.type || "email",
      messages: req.body.messages || "No messages",
      body: req.body.body || "",
      bodyPlain: req.body["body-plain"] || "",
      bodyHtml: req.body["body-html"] || "",
      text: req.body.text || "",
    });

    const result = await claimemail.save();
    res.status(200).json({
      success: true,
      newClaimemail: result,
    });
  } catch (error) {
    console.error("Error saving claim email:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/", (req, res, next) => {
    Claimemail.find()
    .then((result) => {
      res.status(200).json({
        claimemailData: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:id", (req, res, next) => {
  console.log(req.params.id);
  Claimemail.findById(req.params.id).then(result=>{
res.status(200).json({
    claimemail:result
})
  }).catch(err=>{
    console.log(err);
    res.status(500).json({
        error:err
    })
  })
});
router.delete('/:id', (req, res, next) => {
    Claimemail.deleteOne({ _id: req.params.id }) // Use deleteOne instead of remove
        .then(result => {
            if (result.deletedCount > 0) {
                res.status(200).json({
                    message: "Claimemail deleted",
                    result: result,
                });
            } else {
                res.status(404).json({
                    message: "Claimemail not found",
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err,
            });
        });
});

router.put('/:id', (req, res, next) => {
    console.log(req.params.id);
  
    // Use the query parameter if it exists; otherwise, fall back to the request body
    const updatedFields = {
      from: req.body.from,
      mailgunResponseId: req.body.mailgunResponseId,
      sentAt: req.body.sentAt,
      subject: req.query.subject || req.body.subject, // Use query parameter if provided
      type: req.body.type,
      to: req.body.to,
      text: req.body.text,
      messages: req.body.messages,
      body: req.body.body,
    };
  
    Claimemail.findOneAndUpdate(
      { _id: req.params.id },
      updatedFields,
      { new: true } // Return the updated document
    )
      .then((result) => {
        if (result) {
          res.status(200).json({
            updated_claimemail: result,
          });
        } else {
          res.status(404).json({ message: 'Email not found' });
        }
      })
      .catch((err) => {
        console.log('Error updating email:', err);
        res.status(500).json({
          error: err,
        });
      });
  });
  
module.exports = router;
