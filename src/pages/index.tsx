import { useState } from 'react';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';

export default function HomePage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (password === 'password123') {
      router.push('/selection');
    } else {
      setError('Invalid password. Please try again.');
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
