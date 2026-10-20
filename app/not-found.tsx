import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="loading-screen">
      <h1>A little off the path.</h1>
      <p>We couldn’t find that page.</p>
      <Link className="btn btn-primary" href="/">
        Back to Mellowoof
      </Link>
    </main>
  );
}
