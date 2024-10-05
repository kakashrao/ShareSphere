import Joi from "joi";

const signUpSchema = Joi.object({
  fullName: Joi.string()
    .required()
    .error(new Error("Please provide your name.")),
  username: Joi.string()
    .required()
    .error(new Error("Please provide a unique username.")),
  email: Joi.string()
    .allow("")
    .email()
    .error(new Error("Please enter a valid email address.")),
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,15}$"
      )
    )
    .error((errors) => {
      if (Array.isArray(errors)) {
        if (errors.some((e) => e.code === "any.required")) {
          return new Error("Password is required.");
        } else if (errors.some((e) => e.code === "any.pattern")) {
          return new Error(
            "Password must contain atleast one uppercase letter, one lowercase letter, one number and one special symbol with 8 to 15 characters long."
          );
        } else {
          return errors;
        }
      } else {
        return errors;
      }
    }),
});

export { signUpSchema };
