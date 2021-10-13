import { body } from "express-validator";
import { validateBodyMiddleware } from "../../middleware/form-validation-middleware";
import { ValidationChainFunc } from "../../types";

export function validateContactUsRequest(): ValidationChainFunc {
  return [
    body("serviceType")
      .notEmpty()
      .withMessage((value, { req }) => {
        return req.t(
          "pages.contactUsPublic.section2.question1.validationError.required",
          {
            value,
          }
        );
      }),
    body("issueDescription")
      .notEmpty()
      .withMessage((value, { req }) => {
        return req.t(
          "pages.contactUsPublic.section2.question2.validationError.required",
          { value }
        );
      }),
    body("replyEmail")
      .optional({ nullable: true, checkFalsy: true })
      .isEmail()
      .withMessage((value, { req }) => {
        return req.t(
          "pages.contactUsPublic.section3.replyEmail.validationError.required",
          { value }
        );
      }),
    validateBodyMiddleware("contact-us/index-public-contact-us.njk"),
  ];
}