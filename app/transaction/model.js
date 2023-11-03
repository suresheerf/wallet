import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    transactionId:{type: String, required:[true,"please pass transactionId"]},
    fromAccount: {type: mongoose.Schema.Types.ObjectId,ref:'Account'},
    fromUserId: {type: mongoose.Schema.Types.ObjectId,ref:'User'},
    toAccount: {type: mongoose.Schema.Types.ObjectId,ref:'Account'},
    toUserId: {type: mongoose.Schema.Types.ObjectId,ref:'User'},
    amount: {type: Number,default:0},
    status: {type: String, enum:['fail','success','processing']},
    type: {type: String, enum: ['sent','received']},
    message: {type:String, default:''}
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
