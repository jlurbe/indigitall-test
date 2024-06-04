const { z } = require('zod');

const userSchema = z.object({
  username: z.string({
    invalid_type_error: 'User name must be a string',
    required_error: 'User name is required',
  }),
  email: z.string().email({
    invalid_type_error: 'User email must be a string',
    required_error: 'User email is required',
  }),
  password: z.string({
    required_error: 'User password is required',
  }),
  longitude: z.optional(
    z.number({
      invalid_type_error: 'User longitude must be a decimal',
    })
  ),
  latitude: z.optional(
    z.number({
      invalid_type_error: 'User longitude must be a decimal',
    })
  ),
  browser_language: z.optional(
    z.string({
      invalid_type_error: 'User browser language must be a string',
    })
  ),
});

function validateUser(user) {
  return userSchema.safeParse(user);
}

function validatePartialUser(user) {
  return userSchema.partial().safeParse(user);
}

module.exports = {
  validateUser,
  validatePartialUser,
};
