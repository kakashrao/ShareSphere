import Joi from "joi";

const createPostSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string()
    .required()
    .min(100)
    .error((errors) => {
      if (errors.some((e) => e.code === "any.required")) {
        return new Error(
          "Cannot publish empty content, please write atleast 100 characters long content."
        );
      } else if (errors.some((e) => e.code === "any.min")) {
        return new Error("Content should be atleast 100 characters long.");
      } else {
        return errors;
      }
    }),
});

export { createPostSchema };
