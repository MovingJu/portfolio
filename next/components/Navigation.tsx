import Link from 'next/link';

export default function Navigation() {
  return (
    <ul>
      <li><Link href="/">Home</Link></li>
      <li style={{ marginTop: '5px' }}><Link href="/about">About</Link></li>
      <li style={{ marginTop: '5px' }}><Link href="/blog">Blog</Link></li>
      <li style={{ marginTop: '5px' }}><a href="https://api.movingju.com">APIs</a></li>
    </ul>
  );
}
