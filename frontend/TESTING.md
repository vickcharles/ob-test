# Frontend Testing Documentation

This project uses React Testing Library with Vitest for testing React components, following the guiding principle: "The more your tests resemble the way your software is used, the more confidence they can give you."

## Test Setup

- **Framework**: Vitest
- **Testing Library**: React Testing Library
- **User Interaction**: @testing-library/user-event
- **Mocking**: Vitest's built-in mocking capabilities

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests with coverage report
npm run test:coverage

# Run a specific test file
npm test -- src/components/Button/__tests__/Button.test.tsx
```

## Testing Guidelines

### 1. Test Behavior, Not Implementation

Focus on how users interact with your components:
- Use queries that reflect how users find elements (text, role, etc.)
- Avoid testing implementation details like component state
- Test user flows rather than internal functions

### 2. Common Test Structure

Tests follow the Arrange-Act-Assert pattern:

```tsx
it('does something when user interacts', async () => {
  // Arrange - set up the test
  render(<MyComponent />);
  
  // Act - perform the action
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  // Assert - check the expected outcome
  expect(screen.getByText('Success!')).toBeInTheDocument();
});
```

### 3. Mocks and Spies

When testing components that depend on services or other components:

```tsx
// Mock a service
vi.mock('@/services/balanceService', () => ({
  fetchEthereumBalance: vi.fn().mockResolvedValue({
    address: '0x123...',
    balances: [/* mock data */]
  })
}));

// Mock a child component
vi.mock('@/components/ChildComponent', () => ({
  ChildComponent: () => <div data-testid="mocked-child" />
}));
```

### 4. Testing Asynchronous Operations

When testing operations that involve state updates after asynchronous operations:

```tsx
it('updates UI after async operation', async () => {
  render(<MyAsyncComponent />);
  
  await userEvent.click(screen.getByRole('button'));
  
  // Wait for element to appear
  await waitFor(() => {
    expect(screen.getByText('Loaded!')).toBeInTheDocument();
  });
});
```

## Main UI Flow Tests

Our application has the following UI flow tests:

1. **Form Submission** - Tests the Ethereum address form validation and submission
2. **API Integration** - Tests fetching balance data from the backend API
3. **Results Display** - Tests displaying balance results after a successful API call
4. **Error Handling** - Tests displaying error messages when API calls fail
5. **Navigation Flow** - Tests the ability to check another address after viewing results

These tests ensure the main user journey through the application works as expected. 