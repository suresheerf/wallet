import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    accountNumber:{type: Number,required:[true,'Please pass account number']},
    bankName:{type: String,required:[true,'please pass bankName']},
    userId:{type: mongoose.Schema.Types.ObjectId,ref:'User'},
    balance:{type: Number,default:0}
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model('Account', accountSchema);

export default Account;
