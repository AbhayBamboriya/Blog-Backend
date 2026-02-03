import { body, validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";

export const loginValidator = [
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extra sanitize
    req.body.email = sanitizeHtml(req.body.email);
    req.body.password = sanitizeHtml(req.body.password);

    next();
  }
];
