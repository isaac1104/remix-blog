import { json } from 'remix';

export default function badRequest(data) {
  return json(data, { status: 400 });
}
