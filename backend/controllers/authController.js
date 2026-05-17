import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendEmail } from '../services/mail.service.js';
// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please provide all fields");
    }

    // Check Existing User
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Create User
    const user = await User.create({
      name,
      email,
      password,
      verified: false,
    });

    // Generate Verification Token
    const verificationToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    user.verificationToken = verificationToken;

    user.verificationTokenExpire =
      Date.now() + 10 * 60 * 1000;

    await user.save();

    // Frontend URL
     const verificationUrl =
`http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;
    // Send Email
    await sendEmail({
      to: user.email,
      subject: "Verify Your Email",
      text: `Verify your email using this link: ${verificationUrl}`,

      html: `
      <div style="
        max-width:600px;
        margin:auto;
        padding:30px;
        font-family:Arial;
        background:#f4f4f4;
      ">

        <div style="
          background:white;
          padding:30px;
          border-radius:10px;
        ">

          <h1 style="color:#111;">
            Welcome ${user.name} 👋
          </h1>

          <p style="
            font-size:16px;
            color:#444;
            line-height:1.6;
          ">
            Thank you for registering.
            Please verify your email address to continue.
          </p>

          <div style="margin:30px 0;">
            <a
              href="${verificationUrl}"
              style="
                background:#111;
                color:white;
                padding:14px 22px;
                text-decoration:none;
                border-radius:6px;
                display:inline-block;
                font-weight:bold;
              "
            >
              Verify Email
            </a>
          </div>

          <p style="color:#777;">
            This link will expire in 10 minutes.
          </p>

        </div>
      </div>
      `,
    });

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Verification email sent.",
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      if (!user.verified) {
        res.status(401);
        throw new Error('Please verify your email first');
      }
      
      res.json({
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
        },
        token: generateToken(user._id),
      });
   
      
    } else {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // For demo purposes, we will just return a mock token
    // In a real app, you would send an email with a reset link containing this token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '10m',
    });

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetUrl =
`${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click on the link below to reset your password: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: message,
       html: `
<div style="
  max-width:600px;
  margin:auto;
  padding:30px;
  background:#f4f4f4;
  font-family:Arial;
">

  <div style="
    background:white;
    padding:30px;
    border-radius:10px;
  ">

    <h1>Password Reset</h1>

    <p style="
      color:#555;
      line-height:1.6;
      font-size:16px;
    ">
      We received a request to reset your password.
    </p>

    <div style="margin-top:30px;">

      <a
        href="${resetUrl}"
        style="
          background:#111;
          color:white;
          padding:14px 22px;
          text-decoration:none;
          border-radius:6px;
          display:inline-block;
          font-weight:bold;
        "
      >
        Reset Password
      </a>

    </div>

    <p style="
      margin-top:30px;
      color:#888;
      font-size:14px;
    ">
      This link expires in 10 minutes.
    </p>

  </div>
</div>
`,
      });

      res.json({ success: true, data: 'Password reset email sent' });
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(500);
      throw new Error('Email could not be sent');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {



    const { token,newPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token missing",
      });
    }

    let decoded;

    try {

      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    } catch (error) {

      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {

      return res.status(400).json({
        success: false,
        message: "User not found or token expired",
      });

    }

    user.password = newPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email
// @access  Public
// verification email part 3
export const verifyEmail = async (req, res, next) => {
  try {

    const { token } = req.query;

    if (!token) {
      return res.send(`
        <h1>Verification Failed</h1>
        <p>Token missing.</p>
      `);
    }

    let decoded;

    try {

      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    } catch (error) {

      return res.send(`
        <h1>Invalid Token</h1>
        <p>Token expired or invalid.</p>
      `);
    }

    const user = await User.findOne({
      _id: decoded.id,
      verificationToken: token,
      verificationTokenExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {

      return res.send(`
        <h1>Verification Failed</h1>
        <p>User not found or token expired.</p>
      `);

    }

    user.verified = true;

    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;

    await user.save();

    // SUCCESS HTML PAGE

    res.send(`
      <div style="
        height:100vh;
        display:flex;
        justify-content:center;
        align-items:center;
        background:#f4f4f4;
        font-family:Arial;
      ">

        <div style="
          background:white;
          padding:40px;
          border-radius:10px;
          text-align:center;
          width:400px;
          box-shadow:0 0 10px rgba(0,0,0,0.1);
        ">

          <h1 style="color:green;">
            Email Verified Successfully ✅
          </h1>

          <p style="
            color:#555;
            margin-top:20px;
            line-height:1.6;
          ">
            Your account has been verified successfully.
            You can now login to your account.
          </p>

          <a
            href="http://localhost:5173/login"
            style="
              display:inline-block;
              margin-top:30px;
              padding:12px 20px;
              background:#111;
              color:white;
              text-decoration:none;
              border-radius:6px;
            "
          >
            Go To Login
          </a>

        </div>

      </div>
    `);

  } catch (error) {
    next(error);
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.verified) {
      res.status(400);
      throw new Error('Email is already verified');
    }

    const verificationToken = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "10m" }
);

user.verificationToken = verificationToken;

user.verificationTokenExpire =
  Date.now() + 10 * 60 * 1000;

await user.save();

const verificationUrl =
`http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;

    const message = `Please click on the link below to verify your email: \n\n ${verificationUrl}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Email Verification',
        text: message,
       html: `
<div style="
  max-width:600px;
  margin:auto;
  padding:30px;
  background:#f4f4f4;
  font-family:Arial;
">

  <div style="
    background:white;
    padding:30px;
    border-radius:10px;
  ">

    <h1 style="color:#111;">
      Welcome ${user.name} 👋
    </h1>

    <p style="
      color:#555;
      line-height:1.6;
      font-size:16px;
    ">
      Thank you for registering.
      Please verify your email to continue.
    </p>

    <div style="margin-top:30px;">

      <a
        href="${verificationUrl}"
        style="
          background:#111;
          color:white;
          padding:14px 22px;
          text-decoration:none;
          border-radius:6px;
          display:inline-block;
          font-weight:bold;
        "
      >
        Verify Email
      </a>

    </div>

    <p style="
      margin-top:30px;
      color:#888;
      font-size:14px;
    ">
      This link expires in 10 minutes.
    </p>

  </div>
</div>
`,
      });

      res.json({ success: true, data: 'Verification email sent' });
    } catch (err) {
      console.error(err);
      res.status(500);
      throw new Error('Email could not be sent');
    }
  } catch (error) {
    next(error);
  }
};

export default {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,

};
