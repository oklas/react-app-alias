import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Main/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders internal component from src', () => {
  render(<App />);
  const nearElement = screen.getByText(/Internal/i);
  expect(nearElement).toBeInTheDocument();
});