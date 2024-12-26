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
router.post("/",
// checkAuth,
(req, res, next) => {
  const file=req.files.photo;
  cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
    console.log(result.url);

  const claimemail = new Claimemail({
    _id:new mongoose.sentAts.ObjectId(),


    from:req.body.from,
    mailgunResponseId:req.body.mailgunResponseId,
    sentAt:req.body.sentAt,
    subject:req.body.subject,
    type:req.body.type,
    to:req.body.to,
    text:req.body.text,
    

    
  })
  claimemail.save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        newClaimemail: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    })  
  })
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
