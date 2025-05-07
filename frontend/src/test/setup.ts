import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Automatically clean up after each test
afterEach(() => {
  cleanup();
});

// Add any global test setup or mocks here 