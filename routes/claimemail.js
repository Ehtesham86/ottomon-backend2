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
          from: req.body.from,
          mailgunResponseId: req.body.mailgunResponseId,
          sentAt: req.body.sentAt || new Date().toISOString(), // Default to current timestamp if not provided
          subject: req.body.subject || "No Subject",
          type: req.body.type || "email",
          to: req.body.to,
          messages: req.body.messages || "No messages",
          body: req.body.body || "",
          bodyPlain: req.body['body-plain'] || "",
          bodyHtml: req.body['body-html'] || "",
          text: req.body.text || "",
      });

      const result = await claimemail.save();
      res.status(200).json({
          success: true,
          newClaimemail: result,
      });
  } catch (error) {
      console.error(error);
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
router.delete('/:id',(req,res,next)=>{
    Claimemail.remove({_id:req.params.id})
.then(result=>{
    res.status(200).json({
        message:"Claimemail deleted",
        result:result
    })
}).catch(err=>{
    res.status(500).json({
        error:err
    })
})
})
router.put('/:id',(req,res,next)=>{
console.log(req.params.id);
Claimemail.findOneAndUpdate({
    _id:req.params.id
},{
    from:req.body.from,
    mailgunResponseId:req.body.mailgunResponseId,
    sentAt:req.body.sentAt,
    subject:req.body.subject,
    type:req.body.type,
    to:req.body.to,
    text:req.body.text,
    messages: req.body.messages,
    
    body: req.body.body,

    }).then(result=>{
        res.status(200).json({
            updated_claimemail:result
        })
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})
module.exports = router;
