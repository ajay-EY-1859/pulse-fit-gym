import Subscription from '../models/Subscription.js';
import Membership from '../models/Membership.js';
import User from '../models/User.js';
import { calculateEndDate, isSubscriptionActive, getDaysRemaining } from '../utils/subscriptionHelper.js';
import { processMockPayment } from '../utils/paymentMock.js';
import { memoryStore, usingMongo } from '../memoryStore.js';

/**
 * Get user's current active subscription
 */
export async function getMySubscription(req, res, next) {
  try {
    const userId = req.user.id;

    if (!usingMongo()) {
      const subscription = memoryStore.subscriptions?.find((sub) => sub.userId === userId && sub.status === 'active');
      if (!subscription) {
        return res.json({ subscription: null, message: 'No active subscription' });
      }
      return res.json({ subscription });
    }

    const subscription = await Subscription.findOne({ userId, status: 'active' })
      .populate('planId')
      .populate('userId', 'email name');

    if (!subscription) {
      return res.json({ subscription: null, message: 'No active subscription' });
    }

    return res.json({
      subscription: {
        ...subscription.toObject(),
        daysRemaining: getDaysRemaining(subscription.endDate),
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Purchase a new subscription (mock payment)
 */
export async function purchaseSubscription(req, res, next) {
  try {
    const userId = req.user.id;
    const { planId, cardNumber, expiry, cvc, cardholderName } = req.body;

    if (!planId || !cardNumber || !expiry || !cvc || !cardholderName) {
      return res.status(400).json({ error: 'Missing required payment fields' });
    }

    // Get plan details first to get the actual price
    let plan;
    if (!usingMongo()) {
      plan = memoryStore.memberships.find((m) => m._id === planId);
    } else {
      plan = await Membership.findById(planId);
    }

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Process mock payment with actual plan price
    const paymentResult = processMockPayment({
      cardNumber,
      expiry,
      cvc,
      amount: plan.price,
      email: req.user.email,
    });

    if (!paymentResult.success) {
      return res.status(400).json({ error: paymentResult.error });
    }

    // Check for existing active subscription
    if (!usingMongo()) {
      const existingSub = memoryStore.subscriptions?.find(
        (sub) => sub.userId === userId && sub.status === 'active'
      );
      if (existingSub) {
        return res.status(409).json({ error: 'You already have an active subscription' });
      }
    } else {
      const existingSub = await Subscription.findOne({ userId, status: 'active' });
      if (existingSub) {
        return res.status(409).json({ error: 'You already have an active subscription' });
      }
    }

    // Create subscription
    const startDate = new Date();
    const endDate = calculateEndDate(startDate, 30);

    if (!usingMongo()) {
      const subscription = {
        _id: `sub-${Date.now()}`,
        userId,
        planId,
        startDate,
        endDate,
        status: 'active',
        autoRenew: true,
        mockPaymentId: paymentResult.paymentId,
      };
      if (!memoryStore.subscriptions) memoryStore.subscriptions = [];
      memoryStore.subscriptions.push(subscription);
      return res.status(201).json({
        message: 'Subscription purchased successfully',
        subscription,
        paymentId: paymentResult.paymentId,
      });
    }

    const subscription = await Subscription.create({
      userId,
      planId,
      startDate,
      endDate,
      status: 'active',
      autoRenew: true,
      mockPaymentId: paymentResult.paymentId,
    });

    return res.status(201).json({
      message: 'Subscription purchased successfully',
      subscription,
      paymentId: paymentResult.paymentId,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Cancel active subscription
 */
export async function cancelSubscription(req, res, next) {
  try {
    const userId = req.user.id;

    if (!usingMongo()) {
      const subscription = memoryStore.subscriptions?.find((sub) => sub.userId === userId && sub.status === 'active');
      if (!subscription) {
        return res.status(404).json({ error: 'No active subscription to cancel' });
      }
      subscription.status = 'cancelled';
      return res.json({ message: 'Subscription cancelled', subscription });
    }

    const subscription = await Subscription.findOne({ userId, status: 'active' });
    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription to cancel' });
    }

    subscription.status = 'cancelled';
    await subscription.save();

    return res.json({ message: 'Subscription cancelled', subscription });
  } catch (error) {
    return next(error);
  }
}

/**
 * Renew subscription (for testing)
 */
export async function renewSubscription(req, res, next) {
  try {
    const userId = req.user.id;

    if (!usingMongo()) {
      let subscription = memoryStore.subscriptions?.find((sub) => sub.userId === userId && sub.status === 'active');
      if (!subscription) {
        return res.status(404).json({ error: 'No active subscription to renew' });
      }
      const oldEndDate = new Date(subscription.endDate);
      subscription.endDate = calculateEndDate(oldEndDate, 30);
      return res.json({ message: 'Subscription renewed', subscription });
    }

    let subscription = await Subscription.findOne({ userId, status: 'active' });
    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription to renew' });
    }

    const oldEndDate = new Date(subscription.endDate);
    subscription.endDate = calculateEndDate(oldEndDate, 30);
    await subscription.save();

    return res.json({ message: 'Subscription renewed', subscription });
  } catch (error) {
    return next(error);
  }
}
