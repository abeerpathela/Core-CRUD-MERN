import User from '../model/user.js';
import Activity from '../model/activity.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getUsers = async (req, res, next) => {
  try {
    const { search, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query).sort(sortOptions).skip(skip).limit(parseInt(limit)),
      User.countDocuments(query),
    ]);

    successResponse(res, HTTP_STATUS.OK, {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addUser = async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();

    await Activity.create({
      action: 'CREATE',
      entity: 'USER',
      entityId: savedUser._id,
      details: savedUser,
    });

    successResponse(res, HTTP_STATUS.CREATED, savedUser, MESSAGES.USER_CREATED);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return errorResponse(res, HTTP_STATUS.CONFLICT, `${field} already exists`);
    }
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
    }
    successResponse(res, HTTP_STATUS.OK, user);
  } catch (error) {
    next(error);
  }
};

export const editUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return errorResponse(res, HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
    }

    await Activity.create({
      action: 'UPDATE',
      entity: 'USER',
      entityId: user._id,
      details: user,
    });

    successResponse(res, HTTP_STATUS.OK, user, MESSAGES.USER_UPDATED);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return errorResponse(res, HTTP_STATUS.CONFLICT, `${field} already exists`);
    }
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return errorResponse(res, HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
    }

    await Activity.create({
      action: 'DELETE',
      entity: 'USER',
      entityId: user._id,
      details: user,
    });

    successResponse(res, HTTP_STATUS.OK, null, MESSAGES.USER_DELETED);
  } catch (error) {
    next(error);
  }
};

export const getActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(50);
    successResponse(res, HTTP_STATUS.OK, activities);
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, recentActivities] = await Promise.all([
      User.countDocuments(),
      Activity.find().sort({ createdAt: -1 }).limit(10),
    ]);

    const usersCreatedThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) },
    });

    successResponse(res, HTTP_STATUS.OK, {
      totalUsers,
      usersCreatedThisMonth,
      recentActivities,
    });
  } catch (error) {
    next(error);
  }
};
