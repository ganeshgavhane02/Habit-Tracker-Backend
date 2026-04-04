# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a vulnerability in this project, please **do not open a public issue**. Instead, please contact us privately by:

1. **Email**: Send details to ganesh.dev@example.com
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Your name/organization (optional)

We will:
- Acknowledge receipt within 48 hours
- Investigate the issue
- Work on a fix
- Release a security update
- Credit you in the advisory (if you wish)

## Security Best Practices

When using this application in production:

1. **Environment Variables**: Never commit `.env` files with secrets
2. **Dependencies**: Keep dependencies updated (`npm audit fix`)
3. **Database**: Use strong passwords and encryption
4. **API Keys**: Rotate JWT secrets periodically
5. **HTTPS**: Always use HTTPS in production
6. **Rate Limiting**: Adjust based on your needs
7. **Logging**: Don't log sensitive information
8. **Updates**: Subscribe to security updates

## Known Security Features

- ✅ SQL Injection Protection (Parameterized queries)
- ✅ XSS Protection (Helmet middleware)
- ✅ CSRF Protection via same-site cookies
- ✅ Rate Limiting (configurable)
- ✅ Password Hashing (bcryptjs)
- ✅ JWT Token Expiration
- ✅ CORS Whitelist
- ✅ Input Validation

## Dependencies Security

We use `npm audit` to monitor dependencies:

```bash
npm audit              # Check for vulnerabilities
npm audit fix          # Auto-fix vulnerabilities
npm audit fix --force  # Force updates (use with caution)
```
