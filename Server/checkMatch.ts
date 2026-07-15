import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI!);
const Match = mongoose.model('match', new mongoose.Schema({}, {strict: false}));

const userId = '6a4a3b10162a8b51eb247a86';
const targetUserId = '6a3cf4f746f5e024e591058a';

const matches = await Match.find({
  $or: [
    {userOne: userId, userTwo: targetUserId},
    {userOne: targetUserId, userTwo: userId}
  ]
});

console.log(JSON.stringify(matches, null, 2));
await mongoose.disconnect();