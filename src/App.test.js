import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login prompt on home', () => {
  render(<App />);
  const text = screen.getByText(/sign in to your account/i);
  expect(text).toBeInTheDocument();
});
