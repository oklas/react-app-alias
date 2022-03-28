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

test('renders component from near src', () => {
  render(<App />);
  const nearElement = screen.getByText(/Near Src/i);
  expect(nearElement).toBeInTheDocument();
});

test('renders JS component from above root', () => {
  render(<App />);
  const aboveElement = screen.getByText(/Above root js/i);
  expect(aboveElement).toBeInTheDocument();
});

test('renders TS component from above root', () => {
  render(<App />);
  const aboveElement = screen.getByText(/Above root ts/i);
  expect(aboveElement).toBeInTheDocument();
});