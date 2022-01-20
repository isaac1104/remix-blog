export default function validateField({ field, value }) {
  if (typeof value !== 'string' || value.length < 3) {
    return `${field} should be at least 3 characters long.`;
  }
}