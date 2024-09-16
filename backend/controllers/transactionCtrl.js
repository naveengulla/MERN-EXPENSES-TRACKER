const Transaction = require("../model/Transaction");
const asyncHandler=require("express-async-handler")

const transactionController = {
    create:asyncHandler(async (req,res)=>{
        const {type,category,amount,date,description}=req.body;
        if(!type || !amount || !date){
            throw new Error("Type , Amount and Date are required");
        }
        const transaction= await Transaction.create({
            user:req.user,
            type,
            date,
            amount,
            description,
            category,
        });
        res.status(201).json(transaction);
    }),
    filteredList:asyncHandler(async (req,res)=>{
        const {startDate,endDate,type,category}= req.query;
        let query={user:req.user};
        if(startDate){
            query.date={...query.date,$gte:new Date(startDate)};
        }
        if(endDate){
            query.date={...query.date,$lte:new Date(endDate)};
        }
        if(type){
            query.type=type;
        }
        if(category){
            if(category=="All"){
                //! No  filter required
            }else{
                query.category=category;
            }
        }
        const transactions=await Transaction.find(query);
        res.json(transactions);
    }),
    //!Update
    update:asyncHandler(async(req,res)=>{
        const transaction= await Transaction.findById(req.params.id);
        if(transaction && transaction.user.toString()===req.user.toString()){
            // type,category,amount,date,description
            transaction.type=req.body.type || transaction.type;
            transaction.category=req.body.category || transaction.category;
            transaction.amount=req.body.amount || transaction.amount;
            transaction.date=req.body.date || transaction.date;
            transaction.description=req.body.description || transaction.description;
        }
        const updatedTransaction= await transaction.save();
        res.json(updatedTransaction);
    }),
    //! Delete
    delete:asyncHandler(async(req,res)=>{
        const transaction=await Transaction.findById(req.params.id);
        if(transaction && transaction.user.toString()===req.user.toString()){
            await Transaction.findByIdAndDelete(req.params.id);
            res.json({message:"Transaction Deleted Successfully"});
        }
    })
};
module.exports = transactionController;
