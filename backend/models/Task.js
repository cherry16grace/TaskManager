const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    title:{type:String,required:true},
    description:{type:String},
    status:{
        type:String,
        enum:['To-do','In Progress','Completed'],
        default:'To-do'
    },
    priority:{type:String,enum:['Low','Medium','High'],default:'Medium'},
    dueDate:{type:Date},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now}
});
module.exports = mongoose.model('Task',TaskSchema);