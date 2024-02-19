import { v4 as uuidv4 } from 'uuid';
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Account from "../account/model.js";
import Transaction from "./model.js";
import User from "../user/model.js";

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summery: create new transaction
 *     tags: [transaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               toUserId:
 *                 type: string
 *                 example: 654472af1320acd6e78f586a
 *               fromAccountId:
 *                 type: string
 *                 example: 6544727e1320acd6e78f5864
 *               amount:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: successful transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactionId:
 *                   type: string
 *                 fromAccount: 
 *                   type: string
 *                 fromUserId:
 *                   type: string
 *                 toUserId:
 *                   type: string
 *                 amount: 
 *                   type: string
 *                 status:
 *                   type: string
 *                 type:
 *                   type: string
 *
 */
export const newTransaction = catchAsync(async(req,res,next)=>{
    const transactionId = uuidv4();
    const fromAccount = await Account.findById(req.body.fromAccountId);
    if(!fromAccount) return next(new AppError("could not find the account,please link to proceed",400));
    console.log("fromAccount.userId: ",fromAccount.userId);
    console.log("req.user._id: ",req.user._id);
    if(fromAccount.userId.toString() !== req.user._id.toString()) return next(new AppError("account did not link with you",400))
    if(req.body.amount > fromAccount.balance) {
        const sentTransaction = await Transaction.create({
            transactionId,
            fromAccount: fromAccount._id,
            fromUserId: req.user._id,
            toUserId: toUser._id,
            amount: req.body.amount,
            status:'fail',
            type:'sent',
            message:"insufficient balance"
        });
        return next(new AppError('insufficient balance',400));
    }
    console.log("-1")
    const toUser = await User.findById(req.body.toUserId);
    if(!toUser.defaultAccount) return next(new AppError("receiver didn't link any account",400))
    console.log("0")
    const toAccount = await Account.findById(toUser.defaultAccount);
console.log("1")
    toAccount.balance += req.body.amount;
    fromAccount.balance -= req.body.amount;
    console.log("2")
    if(Math.random() >  0.8){
        await Transaction.create({
            transactionId,
            fromAccount: fromAccount._id,
            fromUserId: req.user._id,
            toUserId: toUser._id,
            amount: req.body.amount,
            status:'fail' ,
            type:'sent',
            message:"technical issue"
        });
        return next(new AppError("technical issue",402));
    }

    await toAccount.save();
    await fromAccount.save();

    const sentTransaction = await Transaction.create({
        transactionId,
        fromAccount: fromAccount._id,
        fromUserId: req.user._id,
        toUserId: toUser._id,
        amount: req.body.amount,
        status:'success' ,
        type:'sent'
    });

    const receivedTransaction = await Transaction.create({
        transactionId,
        fromUserId: req.user._id,
        toAccount: toAccount._id,
        toUserId: toUser._id,
        amount: req.body.amount,
        status:'success' ,
        type:'received'
    });
    res.status(201).json({status:"success",sentTransaction})
});

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summery: get user transactions
 *     tags: [transaction]
 *     responses:
 *       200:
 *         description: successful signup
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *
 */

export const getTransactions = catchAsync(async(req,res,next)=>{
    const transactions = await Transaction.aggregate([
        {

            $match:{
                $or:[{type:"sent",fromUserId:req.user._id},{type:'received',toUserId:req.user._id}]
            }
        },
        {
            $sort:{
                _id:-1
            }
        }
    ])

    res.status(200).json({status:"success",transactions});
})