import { body, param, validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";

export const updatePostValidator = [
  param("id")
    .trim()
    .isInt()
    .withMessage("Invalid post id"),

  body("title")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Title too short"),

  body("content")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Content too short"),

  body("tags")
    .optional()
    .customSanitizer(v =>
      Array.isArray(v) ? v.map(t => t.trim()) : v
    ),

  body("status")
    .optional()
    .trim()
    .isIn(["DRAFT", "PUBLISHED"])
    .withMessage("Invalid status"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // XSS sanitize
    if (req.body.title) {
      req.body.title = sanitizeHtml(req.body.title);
    }

    if (req.body.content) {
      req.body.content = sanitizeHtml(req.body.content, {
        allowedTags: [],
        allowedAttributes: {}
      });
    }

    if (req.body.tags) {
      req.body.tags = req.body.tags.map(t => sanitizeHtml(t));
    }

    if (req.body.status) {
      req.body.status = sanitizeHtml(req.body.status);
    }

    next();
  }
];
