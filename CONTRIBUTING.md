# Contributing to Habit Tracker Backend

First off, thank you for considering a contribution to Habit Tracker Backend! It's people like you that make this project such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs if possible**
* **Include your environment details** (OS, Node.js version, npm version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior** and **the expected behavior**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Follow the styleguides
* Include appropriate test cases
* End all files with a newline

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

Example:
```
Add authentication middleware for secure endpoints

- Implement JWT verification
- Add Bearer token parsing
- Include error handling for invalid tokens

Closes #123
```

### JavaScript Styleguide

All JavaScript code must adhere to the ESLint configuration.

```javascript
// Good ✅
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// Bad ❌
function calculateTotal(items){
  var total = 0;
  for(var i = 0; i < items.length; i++){
    total += items[i].price;
  }
  return total;
}
```

Key rules:
- Use `const` by default, `let` only when necessary
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Parameterized SQL queries always (prevent SQL injection)
- 2-space indentation
- Include JSDoc comments for functions

### Database Queries

```javascript
// Good ✅ - Parameterized query prevents SQL injection
const result = await db.query(
  'SELECT * FROM habits WHERE user_id = $1',
  [userId]
);

// Bad ❌ - SQL injection vulnerability
const result = await db.query(
  `SELECT * FROM habits WHERE user_id = ${userId}`
);
```

### API Response Format

All API responses must follow this format:

```javascript
// Success
{ success: true, data: { /* data */ } }

// List
{ success: true, data: [{ /* items */ }] }

// Error
{ success: false, message: "Error description" }
```

## Development Environment Setup

1. **Fork and clone** the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/Habit-Tracker-Backend.git
   cd Habit-Tracker-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Set up database**
   ```bash
   npm run migrate
   npm run seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm test -- --watch

# Coverage report
npm test -- --coverage

# Run specific test
npm test -- models/Habit.test.js
```

## Testing Guidelines

- Write tests for new features
- Ensure existing tests still pass
- Aim for >80% code coverage
- Use meaningful test descriptions
- Mock external dependencies

Example test:
```javascript
describe('Habit Model', () => {
  test('creates habit with valid data', async () => {
    const habit = await Habit.create(1, 'Morning Exercise', 'Daily 30 min');
    expect(habit.userId).toBe(1);
    expect(habit.name).toBe('Morning Exercise');
  });

  test('throws error for missing name', async () => {
    await expect(Habit.create(1, '', 'Description')).rejects.toThrow();
  });
});
```

## Code Review Process

1. **Self-review** your own code first
2. **Run tests** to ensure they pass
3. **Run linter** to check code style
4. **Wait for maintainer review**
5. **Address feedback** constructively
6. **Request re-review** after changes

## Commit Process

1. Create a new branch for your feature
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit
   ```bash
   git commit -m "Add your feature"
   ```

3. Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help organize and categorize issues and pull requests.

* `bug` - Something isn't working
* `enhancement` - New feature or request
* `documentation` - Improvements or additions to documentation
* `good first issue` - Good for newcomers
* `help wanted` - Extra attention is needed
* `in progress` - Currently being worked on
* `priority: high` - Needs attention
* `wontfix` - This will not be worked on

## Recognition

Contributors will be recognized in:
- README.md file
- Release notes
- GitHub Sponsors (if available)

Thank you for your time and effort in making Habit Tracker Backend better!
