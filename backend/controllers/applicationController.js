import TrainerApplication from '../models/TrainerApplication.js';
import User from '../models/User.js';
import { memoryStore, usingMongo } from '../memoryStore.js';

/**
 * Member requests to become a trainer
 */
export async function requestTrainerRole(req, res, next) {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!usingMongo()) {
      // Check if already applied
      const existing = memoryStore.trainerApplications?.find((app) => app.userId === userId);
      if (existing && existing.status === 'pending') {
        return res.status(400).json({ error: 'You already have a pending application' });
      }

      const application = {
        _id: `app-${Date.now()}`,
        userId,
        requestDate: new Date(),
        status: 'pending',
        adminNotes: message || '',
        approvedBy: null,
        approvalDate: null,
      };
      if (!memoryStore.trainerApplications) memoryStore.trainerApplications = [];
      memoryStore.trainerApplications.push(application);

      return res.status(201).json({
        message: 'Application submitted',
        application,
      });
    }

    // Check if already applied (only block pending, allow re-application after rejected/approved)
    const existing = await TrainerApplication.findOne({ userId, status: 'pending' });
    if (existing) {
      return res.status(400).json({ error: 'You already have a pending application' });
    }

    const application = await TrainerApplication.create({
      userId,
      requestDate: new Date(),
      status: 'pending',
      adminNotes: message || '',
    });

    return res.status(201).json({
      message: 'Application submitted',
      application,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get current user's application status
 */
export async function getMyApplicationStatus(req, res, next) {
  try {
    const userId = req.user.id;

    if (!usingMongo()) {
      const application = memoryStore.trainerApplications?.find((app) => app.userId === userId);
      return res.json({
        application: application || null,
        status: application?.status || 'none',
      });
    }

    const application = await TrainerApplication.findOne({ userId }).populate('approvedBy', 'name email');

    return res.json({
      application,
      status: application?.status || 'none',
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Admin: Get all applications
 */
export async function getAllApplications(req, res, next) {
  try {
    const { status } = req.query;

    if (!usingMongo()) {
      let applications = memoryStore.trainerApplications || [];
      if (status) {
        applications = applications.filter((app) => app.status === status);
      }
      // Populate user details
      applications = applications.map((app) => {
        const user = memoryStore.users.find((u) => u._id === app.userId);
        return {
          ...app,
          user: user ? { _id: user._id, name: user.name, email: user.email } : null,
        };
      });
      return res.json({ applications });
    }

    let query = TrainerApplication.find().populate('userId', 'name email').populate('approvedBy', 'name email');

    if (status) {
      query = query.where('status').equals(status);
    }

    const applications = await query.sort({ requestDate: -1 });

    return res.json({ applications });
  } catch (error) {
    return next(error);
  }
}

/**
 * Admin: Approve trainer application
 */
export async function approveApplication(req, res, next) {
  try {
    const { applicationId } = req.params;
    const { notes } = req.body;
    const adminId = req.user.id;

    if (!usingMongo()) {
      const application = memoryStore.trainerApplications?.find((app) => app._id === applicationId);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      application.status = 'approved';
      application.adminNotes = notes || application.adminNotes;
      application.approvedBy = adminId;
      application.approvalDate = new Date();

      // Update user role to trainer
      const user = memoryStore.users.find((u) => u._id === application.userId);
      if (user) {
        user.role = 'trainer';
      }

      return res.json({
        message: 'Application approved',
        application,
      });
    }

    const application = await TrainerApplication.findByIdAndUpdate(
      applicationId,
      {
        status: 'approved',
        adminNotes: notes || undefined,
        approvedBy: adminId,
        approvalDate: new Date(),
      },
      { new: true },
    ).populate('userId', 'name email');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Update user role to trainer
    await User.findByIdAndUpdate(application.userId._id, { role: 'trainer' });

    return res.json({
      message: 'Application approved',
      application,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Admin: Reject trainer application
 */
export async function rejectApplication(req, res, next) {
  try {
    const { applicationId } = req.params;
    const { notes } = req.body;

    if (!usingMongo()) {
      const application = memoryStore.trainerApplications?.find((app) => app._id === applicationId);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      application.status = 'rejected';
      application.adminNotes = notes || application.adminNotes;

      return res.json({
        message: 'Application rejected',
        application,
      });
    }

    const application = await TrainerApplication.findByIdAndUpdate(
      applicationId,
      {
        status: 'rejected',
        adminNotes: notes || undefined,
      },
      { new: true },
    ).populate('userId', 'name email');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    return res.json({
      message: 'Application rejected',
      application,
    });
  } catch (error) {
    return next(error);
  }
}
