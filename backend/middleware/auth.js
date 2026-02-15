const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse('User not found', 404));
    }

    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

// Optional auth - doesn't require token but attaches user if present
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch (error) {
      // Silently fail for optional auth
    }
  }

  next();
};

module.exports = { protect, authorize, optionalAuth };
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const ErrorResponse = require('../utils/errorResponse');

// // Protect routes
// const protect = async (req, res, next) => {
//   let token;

//   // Check for token in Authorization header or cookies
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//     console.log('🔑 Token found in Authorization header');
//   } else if (req.cookies?.token) {
//     token = req.cookies.token;
//     console.log('🔑 Token found in cookies');
//   }

//   if (!token) {
//     console.log('❌ No token found');
//     return next(new ErrorResponse('Not authorized to access this route', 401));
//   }

//   try {
//     // Verify token
//     console.log('🔍 Verifying token...');
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('✅ Token verified. User ID:', decoded.id);

//     // Find user by ID
//     console.log('🔍 Looking for user in database...');
//     req.user = await User.findById(decoded.id);

//     if (!req.user) {
//       console.log('❌ User not found in database for ID:', decoded.id);
//       console.log('🔍 Checking if any users exist...');
//       const userCount = await User.countDocuments();
//       console.log('📊 Total users in database:', userCount);
      
//       return next(new ErrorResponse('User not found', 404));
//     }

//     console.log('✅ User found:', req.user.email);
//     next();
//   } catch (error) {
//     console.log('❌ Token verification error:', error.message);
//     return next(new ErrorResponse('Not authorized to access this route', 401));
//   }
// };

// // Grant access to specific roles
// const authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new ErrorResponse(
//           `User role ${req.user.role} is not authorized to access this route`,
//           403
//         )
//       );
//     }
//     next();
//   };
// };

// // Optional auth - doesn't require token but attaches user if present
// const optionalAuth = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   } else if (req.cookies?.token) {
//     token = req.cookies.token;
//   }

//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id);
//     } catch (error) {
//       // Silently fail for optional auth
//     }
//   }

//   next();
// };

// module.exports = { protect, authorize, optionalAuth };