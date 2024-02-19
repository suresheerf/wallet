import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Account from "./model.js";

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summery: add new account
 *     tags: [account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankName:
 *                 type: string
 *                 example: State Bank of India
 *               accountNumber:
 *                 type: number
 *                 example: 63089764885935775
 *               balance:
 *                 type: number
 *                 example: 10000
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
 *                 message:
 *                   type: string
 *                   example: account linked successfully
 *
 */
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

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summery: get a user accounts
 *     tags: [account]
 *     responses:
 *       200:
 *         description: a user accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: 
 *                   type: string
 *                   example: success
 *                 accounts:
 *                   type: array
 *                   items: 
 *                     $ref: '#/components/schemas/Account'
 *                     
 *
 */

export const getAccounts = catchAsync(async(req,res,next)=>{
    const accounts = await Account.find({userId:req.user._id});
    
    res.status(200).json({status:"success",accounts})
})

/**
 * @swagger
 * /api/accounts/one:
 *   get:
 *     summery: get a user account
 *     tags: [account]
 *     parameters:
 *        - in: query
 *          name: accountId
 *          type: string
 *          description: account id
 *     responses:
 *       200:
 *         description: a user accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: 
 *                   type: string
 *                   example: success
 *                 account:
 *                   $ref: '#/components/schemas/Account'
 *                     
 *
 */

export const getAccount = catchAsync(async(req,res,next)=>{
    const account = await Account.findById(req.query.accountId);
    
    res.status(200).json({status:"success",account})
})

