import { useParams } from 'remix';

export default function Post() {
  const params = useParams();

  return (
    <div>
      <h1>{params.id}</h1>
    </div>
  );
}
