export const required = value => (value ? undefined : 'Required')

// Only use this for warnings, not for errors. See https://hackernoon.com/the-100-correct-way-to-validate-email-addresses-7c4818f24643
export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Are you sure this is an email address?'
    : undefined