import { Outlet, LiveReload, Link, Links, Meta } from 'remix';
import globalStyles from '~/styles/global.css';

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
      {process.env.NODE_ENV === 'development' && <LiveReload />}
    </Document>
  );
}

export const meta = () => ({
  charset: 'UTF-8',
  name: 'viewport',
  content: 'width=device-width, initial-scale=1.0',
});

export const links = () => [{ rel: 'stylesheet', href: globalStyles }];

function Document({ children, title }) {
  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
        <title>{title || 'My Remix Blog'}</title>
      </head>
      <body>{children}</body>
    </html>
  );
}

function Layout({ children }) {
  return (
    <>
      <nav className='navbar'>
        <Link to='/' className='logo'>
          Remix Blog
        </Link>
        <ul className='nav'>
          <li>
            <Link to='/posts'>Posts</Link>
          </li>
          <li>
            <Link to='/auth/login'>Login</Link>
          </li>
        </ul>
      </nav>
      <div className='container'>{children}</div>
    </>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <Document>
      <Layout>
        <h1>Error</h1>
        <p>{error.message}</p>
      </Layout>
    </Document>
  );
}
