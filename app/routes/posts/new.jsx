import { Link, redirect, useActionData, json } from 'remix';
import { db } from '~/utils/db.server';

function validateField({ field, value }) {
  if (typeof value !== 'string' || value.length < 3) {
    return `${field} should be at least 3 characters long.`;
  }
}

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
    return json({ fieldErrors, fields }, { status: 400 });
  }

  const { id } = await db.post.create({ data: fields });

  return redirect(`/posts/${id}`);
};

export default function NewPost() {
  const { fieldErrors, fields } = useActionData();

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
              defaultValue={fields?.title}
            />
            <div className='error'>
              <p>{fieldErrors?.title && fieldErrors.title}</p>
            </div>
          </div>
          <div className='form-control'>
            <label htmlFor='body'>Post Body</label>
            <textarea name='body' id='body' defaultValue={fields?.body} />
            <div className='error'>
              <p>{fieldErrors?.body && fieldErrors.body}</p>
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
