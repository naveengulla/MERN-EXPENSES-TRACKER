//!  User Registration
const asyncHandler = require("express-async-handler");
const Category = require("../model/Category");
const Transaction = require("../model/Transaction");
const categoryController = {
  //? Create
  create: asyncHandler(async (req, res) => {
    const { name, type } = req.body;
    if (!type || !name) {
      throw new Error("Name and type are required for creating a category");
    }
    //convert the name to lowercase
    const normalizedName = name.toLowerCase();
    //! check if type is valid
    const validTypes = ["expense", "income"];
    if (!validTypes.includes(type.toLowerCase())) {
      throw new Error("Invalid category type" + type);
    }
    //! Check if category already exists
    const categoryExists = await Category.findOne({
      name: normalizedName,
      user: req.user,
    });
    if (categoryExists) {
      throw new Error(`Category ${categoryExists.name} already exists`);
    }

    //! create the category
    const category = await Category.create({
      name: normalizedName,
      user: req.user,
      type,
    });
    res.status(201).json(category);
  }),
  //? List
  lists: asyncHandler(async (req, res) => {
    const categories = await Category.find({
      user: req.user,
    });
    res.status(200).json(categories);
  }),
  //? Update
  update: asyncHandler(async (req,res) => {
    const category = await Category.findById(req.params.id);
    const {name,type}=req.body;
    if(category && category.user.toString()===req.user.toString()){
      const oldName=category.name;
      category.name=name || category.name;
      category.type=type || category.type;
      const updatedCategory=await category.save();
      //! Update all the affected transactions
      await Transaction.updateMany({user:req.user,category:oldName},{$set:{category:updatedCategory.name,type:updatedCategory.type}});
      res.json(updatedCategory)
    }else{
      throw new Error("Invalid Update Operation");
    }
  }),
  //? Delete
  delete: asyncHandler(async (req,res) => {
    const category = await Category.findById(req.params.id);
    const {name} = req.body;
    if(category && category.user.toString()===req.user.toString()){
      const defaultCategory="Uncategorized";
      //! Update all Transactions affected
      await Transaction.updateMany({user:req.user,category:category.name},{$set:{category:defaultCategory}});
      await Category.findByIdAndDelete(req.params.id);
      res.json({message:"Successfully deleted and updated Transactions"});
    }else{
      res.json({message:"category not found or user not authorized"});
    }
  }),
};

module.exports = categoryController;
