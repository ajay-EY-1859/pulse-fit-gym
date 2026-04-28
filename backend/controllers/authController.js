import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createMemoryUser, memoryStore, usingMongo } from '../memoryStore.js';
import User from '../models/User.js';

function createToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name, role: user.role || 'member' },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role || 'member',
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({ message: 'Name, valid email, and 6 character password are required' });
    }

    if (!usingMongo()) {
      const existingUser = memoryStore.users.find((user) => user.email === email.toLowerCase());
      if (existingUser) {
        return res.status(409).json({ message: 'Email is already registered' });
      }

      const user = await createMemoryUser({ name, email, password });
      return res.status(201).json({ token: createToken(user), user: publicUser(user) });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!usingMongo()) {
      const user = memoryStore.users.find((item) => item.email === email.toLowerCase());
      const isValid = user ? await bcrypt.compare(password, user.password) : false;

      if (!user || !isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      return res.json({ token: createToken(user), user: publicUser(user) });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    const isValid = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

/**
 * Verify token is valid
 */
export async function verifyToken(req, res, next) {
  try {
    // If we get here, the token is valid (requireAuth middleware already verified it)
    return res.json({ valid: true, user: req.user });
  } catch (error) {
    return next(error);
  }
}
