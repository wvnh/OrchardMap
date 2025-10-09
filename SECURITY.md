# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability within OrchardMap, please send an email to the repository owner. All security vulnerabilities will be promptly addressed.

Please include the following information:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## Security Best Practices

When contributing to this project, please follow these security guidelines:

### Environment Variables
- **Never** commit `.env` files or secrets to the repository
- Use `.env.example` as a template for required variables
- Store production secrets in GitHub Secrets or hosting platform's secret management

### Database Security
- All database tables have Row Level Security (RLS) enabled
- Never expose the `service_role` key in frontend code
- Only use the `anon` key in client-side applications
- Test RLS policies thoroughly before deploying

### API Security
- Validate all user inputs
- Use parameterized queries to prevent SQL injection
- Implement rate limiting for API endpoints
- Use HTTPS in production

### Authentication
- Use Supabase Auth for all authentication
- Never store passwords in plain text
- Implement proper session management
- Use secure password requirements

### Frontend Security
- Sanitize user inputs to prevent XSS attacks
- Implement Content Security Policy (CSP) headers
- Use HTTPS for all production deployments
- Keep dependencies up to date

## Security Updates

Security updates will be released as needed. We recommend:

- Subscribe to repository notifications for security advisories
- Keep dependencies updated (`npm audit` regularly)
- Monitor Supabase security announcements
- Review GitHub Dependabot alerts

## Automated Security Measures

This project includes:

- **GitHub Actions**: Automated security audits on pull requests
- **Dependabot**: Automatic dependency updates
- **TruffleHog**: Secret scanning in CI/CD pipeline
- **npm audit**: Regular dependency vulnerability checks

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported releases
4. Release patches as soon as possible

## Comments on this Policy

If you have suggestions on how this process could be improved, please submit a pull request or open an issue.

---

Last updated: January 2025
