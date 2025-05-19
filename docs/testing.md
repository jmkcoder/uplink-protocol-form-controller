# Form Controller Testing Notes

## Testing with @uplink-protocol/core

The `@uplink-protocol/core` dependency is mocked for tests to avoid issues with Jest's module resolution. The mock is located at:

```
src/__mocks__/@uplink-protocol/core.ts
```

This mock implements a simplified version of the `createBindings` function that matches the API expected by the controller.

## Jest Configuration

The Jest configuration includes a `moduleNameMapper` that redirects imports of `@uplink-protocol/core` to our mock implementation:

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
  '^@uplink-protocol/core$': '<rootDir>/src/__mocks__/@uplink-protocol/core.ts'
}
```

## Running Tests

To run tests, use:

```bash
npm test
```

## Troubleshooting

If you encounter issues with module resolution in tests:

1. Check that the mock implementation matches the expected API
2. Verify that the moduleNameMapper in jest.config.js is correctly configured
3. Make sure any new dependencies are properly mocked if they can't be resolved by Jest
