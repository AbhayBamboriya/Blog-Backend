import { body, validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";

export const createPostValidator = [    
  body("title")
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Title too short"),

  body("content")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Content too short"),

  body("tags")
    .optional()
    .customSanitizer(v =>
      Array.isArray(v) ? v.map(t => t.trim()) : v
    ),

  body("status")
    .trim()
    .isIn(["DRAFT", "PUBLISHED"])
    .withMessage("Invalid status"),

  (req, res, next) => {
    console.log('hittttt');
    
    const errors = validationResult(req);
    console.log('sdks',errors);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log('sdk');
    
    // XSS sanitize
    req.body.title = sanitizeHtml(req.body.title);
    req.body.content = sanitizeHtml(req.body.content, {
      allowedTags: [],
      allowedAttributes: {}
    });

    if (req.body.tags) {
      req.body.tags = req.body.tags.map(t => sanitizeHtml(t));
    }
    console.log('assjadj');
    
    req.body.status = sanitizeHtml(req.body.status);

    next();
  }
];
