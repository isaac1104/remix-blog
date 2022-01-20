import { Link, redirect, useActionData, json } from 'remix';
import badRequest from '~/utils/badRequest';
import { db } from '~/utils/db.server';
import validateField from '~/utils/validateField';

export const action = async ({ request }) => {
  const form = await request.formData();
  const title = form.get('title');
  const body = form.get('body');

  const fields = { title, body };

  const fieldErrors = {
    title: validateField({ field: 'title', value: title }),
    body: validateField({ field: 'body', value: body }),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields })
  }

  const { id } = await db.post.create({ data: fields });

  return redirect(`/posts/${id}`);
};

export default function NewPost() {
  const actionData = useActionData();

  return (
    <>
      <div className='page-header'>
        <h1>New Post</h1>
        <Link to='/posts' className='btn btn-reverse'>
          Back
        </Link>
      </div>
      <div className='page-content'>
        <form method='POST'>
          <div className='form-control'>
            <label htmlFor='title'>Title</label>
            <input
              type='text'
              name='title'
              id='title'
              defaultValue={actionData?.fields?.title}
            />
            <div className='error'>
              <p>
                {actionData?.fieldErrors?.title &&
                  actionData?.fieldErrors?.title}
              </p>
            </div>
          </div>
          <div className='form-control'>
            <label htmlFor='body'>Post Body</label>
            <textarea
              name='body'
              id='body'
              defaultValue={actionData?.fields?.body}
            />
            <div className='error'>
              <p>
                {actionData?.fieldErrors?.body && actionData?.fieldErrors?.body}
              </p>
            </div>
          </div>
          <button type='submit' className='btn btn-block'>
            Add Post
          </button>
        </form>
      </div>
    </>
  );
}
