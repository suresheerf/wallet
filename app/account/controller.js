import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Account from "./model.js";

export const createAccount = catchAsync(async(req,res,next)=>{
    const isLinked = await Account.findOne(req.body.accountNumber);
    if(isLinked) return next(new AppError("account already linked",400));
    const account = await Account.create({...req.body,userId:req.user._id});
    if(!req.user.defaultAccount){
        req.user.defaultAccount = account._id;
        await req.user.save();
    }
    res.status(201).json({status:"success",message:'account linked successfully'})
})

export const getAccounts = catchAsync(async(req,res,next)=>{
    const accounts = await Account.find({userId:req.user._id});
    
    res.status(201).json({status:"success",accounts})
})

