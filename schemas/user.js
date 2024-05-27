const { z } = require('zod');

const userSchema = z.object({
  username: z.string({
    invalid_type_error: 'User name must be a string',
    required_error: 'User name is required',
  }),
  email: z.string({
    invalid_type_error: 'User email must be a string',
    required_error: 'User email is required',
  }),
  password: z.string({
    required_error: 'User password is required',
  }),
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
