import { useActionData, json, redirect } from 'remix';
import badRequest from '~/utils/badRequest';
import { db } from '~/utils/db.server';
import { createUserSession, login } from '~/utils/session.server';
import validateField from '~/utils/validateField';

export const action = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get('loginType');
  const username = form.get('username');
  const password = form.get('password');

  const fields = { loginType, username, password };

  const fieldErrors = {
    username: validateField({ field: 'username', value: username }),
    password: validateField({ field: 'password', value: password }),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  switch (loginType) {
    case 'login': {
      const user = await login({ username, password });

      if (!user) {
        return badRequest({
          fields,
          fieldErrors: { username: 'Invalid credentials' },
        });
      }

      return createUserSession(user.id, '/posts');
    }
    case 'register':
    default:
      return badRequest({
        fields,
        formError: 'Invalid login type',
      });
  }
};

export default function Login() {
  const actionData = useActionData();

  return (
    <div className='auth-container'>
      <div className='page-header'>
        <h1>Login</h1>
      </div>
      <div className='page-content'>
        <form method='POST'>
          <fieldset>
            <legend>Login or Register</legend>
            <label>
              <input
                type='radio'
                name='loginType'
                value='login'
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === 'login'
                }
              />{' '}
              Login
            </label>
            <label>
              <input type='radio' name='loginType' value='register' /> Register
            </label>
          </fieldset>
          <div className='form-control'>
            <label htmlFor='username'>Username</label>
            <input
              type='text'
              name='username'
              id='username'
              defaultValue={actionData?.fields?.username}
            />
            <div className='error'>
              <p>
                {actionData?.fieldErrors?.username &&
                  actionData?.fieldErrors?.username}
              </p>
            </div>
          </div>
          <div className='form-control'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              name='password'
              id='password'
              defaultValue={actionData?.fields?.password}
            />
            <div className='error'>
              <p>
                {actionData?.fieldErrors?.password &&
                  actionData?.fieldErrors?.password}
              </p>
            </div>
          </div>
          <button className='btn btn-block' type='submit'>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
