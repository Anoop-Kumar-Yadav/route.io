import User from '@/models/user';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { logger } from '@/lib/winston';

const updateCurrentUser = async (req: Request, res: Response) => {
  const userId = req.userId;

  const requestToUpdate = req.body;

  if (requestToUpdate.new_password) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(requestToUpdate.new_password, salt);

    requestToUpdate.password = hashPassword;
  }
  try {
    await User.updateOne({ _id: userId }, requestToUpdate);

    res.sendStatus(204);
  } catch (error) {}
};

export default updateCurrentUser;
