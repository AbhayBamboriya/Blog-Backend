import { body, validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";

export const registerValidator = [
  body("name")
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage("Name too short"),

  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars"),

  body("role")
    .trim()
    .escape()
    .optional(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extra XSS protection
    req.body.name = sanitizeHtml(req.body.name);
    req.body.role = sanitizeHtml(req.body.role || "");

    next();
  }
];
