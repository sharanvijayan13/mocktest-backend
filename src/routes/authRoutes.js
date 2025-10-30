import express from "express";
import passport from "passport";
import { protect } from "../middleware/authMiddleware.js";
import { validateUser } from "../middleware/validationMiddleware.js";
import {
  signup,
  login,
  getProfile,
  googleAuthSuccess,
  googleAuthFailure,
  generateToken,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", validateUser, signup);
router.post("/login", login);
router.get("/profile", protect, getProfile);

// Force account chooser so the browser doesn't auto-login the currently signed-in Google user
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    accessType: "offline",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login?error=google-auth-failed",
    session: false
  }),
  (req, res) => {
    // Generate JWT token
    const token = generateToken(req.user.id);
    
    // Set HTTP-only cookie with the token
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Redirect to frontend with success
    res.redirect('http://localhost:3000/profile');
  }
);

router.get("/google/failure", googleAuthFailure);

router.get("/success", (req, res) => {
  const { token } = req.query;
  if (token) {
    res.json({
      message: "Authentication Successful!",
      token: token,
      note: "You can now use this token for API requests.",
    });
  } else {
    res.status(400).json({
      message: "No token provided",
    });
  }
});

router.get("/failure", (_req, res) => {
  res.send(`
        <html>
            <body>
                <h1>Authentication Failed...</h1>
                <a href="/api/auth/google">Try again</a>
            </body>
        </html>
    `);
});

export default router;
