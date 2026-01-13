import jwt from 'jsonwebtoken';
import getUserModel from '../models/User.js';
import { successResponse, errorResponse } from '../utils/responses.js';

export async function login(req, res, next) {
  try {
    const email = (req.body?.email || '').trim().toLowerCase();

    if (!email) {
      return res.status(400).json(errorResponse('Bad Request', 'Email is required'));
    }

    const UserModel = getUserModel();
    const dbUser = await UserModel.findOne({ where: { user_email: email } });

    if (!dbUser) {
      return res.status(401).json(errorResponse('Unauthorized', 'Invalid email'));
    }

    // Προσαρμόζεις εδώ αν το πεδίο role λέγεται αλλιώς στη βάση σου
    const role = dbUser.role || dbUser.user_role || 'student';

    const userPayload = {
      user_id: dbUser.user_id,
      user_email: dbUser.user_email,
      role
    };

    const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.json(
      successResponse(
        { token, user: userPayload },
        'Login successful'
      )
    );
  } catch (err) {
    next(err);
  }
}
