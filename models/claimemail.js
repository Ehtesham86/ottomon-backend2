const mongoose=require('mongoose')

const claimemailSchema=new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    from:String,
    mailgunResponseId:String,
    sentAt:String,
    subject:String,
    type:String,
    to:String,
    message:String,
    body:String,
   
    text:String
})
module.exports=mongoose.model('Claimemail',claimemailSchema)