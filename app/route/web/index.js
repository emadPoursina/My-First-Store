const express = require("express");
const router = express.Router();

// Middlewares
const redirectIfAuthenticated = require("app/http/middleware/RedirectIfAuthenticated");
const redirectIfNotAdmin = require("app/http/middleware/RedirectIfNotAdmin");
const errorHandler = require("app/http/middleware/ErrorHandler");

// Admin Router
const adminRouter = require("app/route/web/admin");
router.use("/admin", redirectIfNotAdmin.handle, adminRouter);

// Home Router
const homeRouter = require("app/route/web/home");
router.use("/", homeRouter);

// Auth Router
const authRouter = require("app/route/web/auth");
router.use("/auth", redirectIfAuthenticated.handle, authRouter);

// Error Handeling
router.all("*", errorHandler.handle404);

router.use(errorHandler.handle);

module.exports = router;
