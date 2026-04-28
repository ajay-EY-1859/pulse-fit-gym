import User from '../models/User.js';
import Membership from '../models/Membership.js';
import Subscription from '../models/Subscription.js';
import TrainerApplication from '../models/TrainerApplication.js';
import { memoryStore, usingMongo } from '../memoryStore.js';
import bcrypt from 'bcryptjs';

/**
 * Admin: Get all users with filters
 */
export async function getAllUsers(req, res, next) {
  try {
    const { role, subscription } = req.query;

    if (!usingMongo()) {
      let users = memoryStore.users || [];

      if (role) {
        users = users.filter((u) => u.role === role);
      }

      // Remove passwords before sending
      users = users.map(({ password, ...user }) => user);

      return res.json({ users, total: users.length });
    }

    let query = User.find().select('-password');

    if (role) {
      query = query.where('role').equals(role);
    }

    const users = await query.sort({ createdAt: -1 });

    return res.json({ users, total: users.length });
  } catch (error) {
    return next(error);
  }
}

/**
 * Admin: Change user role
 */
export async function changeUserRole(req, res, next) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['member', 'trainer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    if (!usingMongo()) {
      const user = memoryStore.users.find((u) => u._id === userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      user.role = role;
      const { password, ...userWithoutPassword } = user;
      return res.json({ message: 'Role updated', user: userWithoutPassword });
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ message: 'Role updated', user });
  } catch (error) {
    return next(error);
  }
}

/**
 * Admin: Delete user
 */
export async function deleteUser(req, res, next) {
  try {
    const { userId } = req.params;

    if (!usingMongo()) {
      const index = memoryStore.users.findIndex((u) => u._id === userId);
      if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
      }
      const deleted = memoryStore.users.splice(index, 1)[0];
      const { password, ...userWithoutPassword } = deleted;
      return res.json({ message: 'User deleted', user: userWithoutPassword });
    }

    const user = await User.findByIdAndDelete(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ message: 'User deleted', user });
  } catch (error) {
    return next(error);
  }
}

/**
 * Admin: Get all subscriptions
 */
export async function getAllSubscriptions(req, res, next) {
  try {
    const { status } = req.query;

    if (!usingMongo()) {
      let subscriptions = memoryStore.subscriptions || [];

      if (status) {
        subscriptions = subscriptions.filter((sub) => sub.status === status);
      }

      // Populate user and plan details
      subscriptions = subscriptions.map((sub) => {
        const user = memoryStore.users.find((u) => u._id === sub.userId);
        const plan = memoryStore.memberships.find((m) => m._id === sub.planId);
        return {
          ...sub,
          user: user ? { _id: user._id, name: user.name, email: user.email } : null,
          plan: plan ? { _id: plan._id, type: plan.type, price: plan.price } : null,
        };
      });

      return res.json({ subscriptions, total: subscriptions.length });
    }

    let query = Subscription.find()
      .populate('userId', 'name email')
      .populate('planId', 'type price');

    if (status) {
      query = query.where('status').equals(status);
    }

    const subscriptions = await query.sort({ startDate: -1 });

    return res.json({ subscriptions, total: subscriptions.length });
  } catch (error) {
    return next(error);
  }
}

/**
 * Admin: Get analytics
 */
export async function getAnalytics(req, res, next) {
  try {
    if (!usingMongo()) {
      const totalMembers = memoryStore.users?.filter((u) => u.role === 'member').length || 0;
      const totalTrainers = memoryStore.users?.filter((u) => u.role === 'trainer').length || 0;
      const activeSubscriptions = memoryStore.subscriptions?.filter((sub) => sub.status === 'active').length || 0;
      const totalRevenue = (memoryStore.subscriptions || [])
        .filter((sub) => sub.status === 'active')
        .reduce((sum) => sum + 100, 0); // Mock revenue (100 per subscription)

      return res.json({
        totalMembers,
        totalTrainers,
        activeSubscriptions,
        totalRevenue,
        timestamp: new Date(),
      });
    }

    const totalMembers = await User.countDocuments({ role: 'member' });
    const totalTrainers = await User.countDocuments({ role: 'trainer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });

    // Calculate revenue (sum of all active subscription plan prices)
    const subscriptions = await Subscription.find({ status: 'active' }).populate('planId', 'price');
    const totalRevenue = subscriptions.reduce((sum, sub) => sum + (sub.planId?.price || 0), 0);

    return res.json({
      totalMembers,
      totalTrainers,
      totalAdmins,
      activeSubscriptions,
      totalRevenue,
      timestamp: new Date(),
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Admin: Create membership plan
 */
export async function createMembershipPlan(req, res, next) {
  try {
    const { type, price, features, description } = req.body;
    const createdBy = req.user.id;

    if (!type || price === undefined || !features || !Array.isArray(features)) {
      return res.status(400).json({ error: 'type, price, and features (array) are required' });
    }

    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'price must be a non-negative number' });
    }

    if (!usingMongo()) {
      const plan = {
        _id: `plan-${Date.now()}`,
        type,
        price,
        features,
        description: description || '',
        createdBy,
      };
      memoryStore.memberships.push(plan);
      return res.status(201).json({ message: 'Plan created', plan });
    }

    const plan = await Membership.create({
      type,
      price,
      features,
      description: description || '',
      createdBy,
    });

    return res.status(201).json({ message: 'Plan created', plan });
  } catch (error) {
    return next(error);
  }
}

/**
 * Admin: Update membership plan
 */
export async function updateMembershipPlan(req, res, next) {
  try {
    const { planId } = req.params;
    const { type, price, features, description } = req.body;

    // Build update object - allow explicit empty strings and zero values
    const updateFields = {};
    if (type !== undefined) updateFields.type = type;
    if (price !== undefined) {
      if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ error: 'price must be a non-negative number' });
      }
      updateFields.price = price;
    }
    if (features !== undefined) updateFields.features = features;
    if (description !== undefined) updateFields.description = description;

    if (!usingMongo()) {
      const plan = memoryStore.memberships.find((m) => m._id === planId);
      if (!plan) {
        return res.status(404).json({ error: 'Plan not found' });
      }
      // Apply all provided updates
      Object.assign(plan, updateFields);
      return res.json({ message: 'Plan updated', plan });
    }

    const plan = await Membership.findByIdAndUpdate(planId, updateFields, { new: true });

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    return res.json({ message: 'Plan updated', plan });
  } catch (error) {
    return next(error);
  }
}

/**
 * Admin: Delete membership plan
 */
export async function deleteMembershipPlan(req, res, next) {
  try {
    const { planId } = req.params;

    if (!usingMongo()) {
      const index = memoryStore.memberships.findIndex((m) => m._id === planId);
      if (index === -1) {
        return res.status(404).json({ error: 'Plan not found' });
      }
      const deleted = memoryStore.memberships.splice(index, 1)[0];
      return res.json({ message: 'Plan deleted', plan: deleted });
    }

    const plan = await Membership.findByIdAndDelete(planId);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    return res.json({ message: 'Plan deleted', plan });
  } catch (error) {
    return next(error);
  }
}
