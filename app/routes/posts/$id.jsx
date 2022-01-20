import { Link, useLoaderData, redirect } from 'remix';
import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';

export const loader = async ({ request, params }) => {
  const user = await getUser(request);
  const post = await db.post.findUnique({
    where: { id: params.id },
  });

  if (!post) throw new Error('Post not found');

  return {
    post,
    user,
  };
};

export const action = async ({ request, params }) => {
  const form = await request.formData();

  if (form.get('_method') === 'delete') {
    const user = await getUser(request);
    const post = await db.post.findUnique({
      where: { id: params.id },
    });

    if (!post) throw new Error('Post not found');

    if (user && post.userId === user.id) {
      await db.post.delete({ where: { id: params.id } });
    }

    return redirect('/posts');
  }
};

export default function Post() {
  const {
    post: { title, body, userId },
    user,
  } = useLoaderData();

  return (
    <div>
      <div className='page-header'>
        <h1>{title}</h1>
        <Link to='/posts' className='btn btn-reverse'>
          Back
        </Link>
      </div>
      <div className='page-content'>{body}</div>
      <div className='page-footer'>
        {/* Let the server know that this is a delete request */}
        {user?.id === userId && (
          <form method='POST'>
            <input type='hidden' name='_method' value='delete' />
            <button className='btn btn-delete'>Delete</button>
          </form>
        )}
      </div>
    </div>
  );
}
