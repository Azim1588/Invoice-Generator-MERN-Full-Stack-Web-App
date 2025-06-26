# 🤝 Contributing to Invoice Generator Pro

Thank you for your interest in contributing to Invoice Generator Pro! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## 🚀 How Can I Contribute?

### Reporting Bugs

- Use the GitHub issue tracker
- Include detailed steps to reproduce the bug
- Provide screenshots if applicable
- Include your browser and OS information

### Suggesting Enhancements

- Use the GitHub issue tracker
- Describe the enhancement clearly
- Explain why this enhancement would be useful
- Include mockups or examples if possible

### Pull Requests

- Fork the repository
- Create a feature branch
- Make your changes
- Add tests if applicable
- Submit a pull request

## 🛠️ Development Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### Local Development

1. **Fork and Clone**

   ```bash
   git clone https://github.com/your-username/invoice-generator-pro.git
   cd invoice-generator-pro
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp env.example .env
   # Edit .env with your backend URL
   npm run dev
   ```

## 🔄 Pull Request Process

1. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**

   - Write clean, readable code
   - Follow the coding standards
   - Add tests if applicable
   - Update documentation

3. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Push and Create PR**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Submit Pull Request**
   - Use a clear title
   - Describe the changes
   - Link related issues
   - Request reviews

## 📝 Coding Standards

### JavaScript/React

- Use ES6+ features
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Add PropTypes or TypeScript types

### CSS

- Use CSS variables for theming
- Follow BEM methodology
- Ensure responsive design
- Maintain accessibility standards

### Backend

- Use async/await
- Implement proper error handling
- Follow REST API conventions
- Add input validation
- Use environment variables

### Git Commit Messages

Use conventional commit format:

```
type(scope): description

feat: add new feature
fix: resolve bug
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add tests
chore: maintenance tasks
```

## 🧪 Testing

### Frontend Testing

```bash
cd frontend
npm test
```

### Backend Testing

```bash
cd backend
npm test
```

### Manual Testing

- Test on different browsers
- Test responsive design
- Test accessibility features
- Test error scenarios

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What should happen.

**Actual Behavior**
What actually happens.

**Screenshots**
If applicable, add screenshots.

**Environment**

- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Version: [e.g. 1.0.0]

**Additional Context**
Any other context about the problem.
```

## 💡 Suggesting Enhancements

### Enhancement Request Template

```markdown
**Enhancement Description**
A clear description of the enhancement.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this work?

**Alternative Solutions**
Any alternative solutions considered.

**Additional Context**
Any other context or screenshots.
```

## 📚 Documentation

- Update README.md if needed
- Add inline code comments
- Update API documentation
- Include usage examples

## 🔍 Code Review

### What We Look For

- Code quality and readability
- Performance considerations
- Security implications
- Test coverage
- Documentation updates
- Accessibility compliance

### Review Process

1. Automated checks pass
2. Code review by maintainers
3. Testing in development environment
4. Final approval and merge

## 🎯 Areas for Contribution

### High Priority

- Bug fixes
- Security improvements
- Performance optimizations
- Accessibility enhancements

### Medium Priority

- New features
- UI/UX improvements
- Documentation updates
- Test coverage

### Low Priority

- Code refactoring
- Style improvements
- Minor enhancements

## 📞 Getting Help

- Check existing issues and PRs
- Read the documentation
- Ask questions in issues
- Join our community discussions

## 🙏 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Invoice Generator Pro! 🎉
