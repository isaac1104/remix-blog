import { Link, useLoaderData } from 'remix';

export const loader = () => {
  const data = {
    posts: [
      { id: 1, title: 'Post 1', body: 'This is post 1' },
      { id: 2, title: 'Post 2', body: 'This is post 2' },
      { id: 3, title: 'Post 3', body: 'This is post 3' },
    ],
  };
  return data;
};

export default function PostItems() {
  const { posts } = useLoaderData();

  return (
    <>
      <div className='page-header'>
        <h1>Posts</h1>
        <Link to='/posts/new' className='btn'>
          New Post
        </Link>
      </div>
      <ul className='posts-list'>
        {posts.map(({ id, title, body }) => (
          <li key={id}>
            <Link to={id}>
              <h3>{title}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
