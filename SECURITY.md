# Keeping the public project free of secrets

This app needs no API keys, passwords, or backend credentials.

- Keep local credentials in ignored files. Never paste them into React source, CSS, documentation, or workflow files.
- Any value bundled into browser JavaScript is public. A `VITE_` prefix does not protect a secret.
- `.gitignore` prevents accidental additions of matching untracked files. It does not hide a file already committed, remove old commits, or sanitize a manual upload.
- Run `pnpm check:secrets` before publishing. It checks tracked and untracked source files for common token patterns, private files, local user paths, and personal email addresses. It prints locations rather than matching values.
- The GitHub workflow runs the same check. A failed workflow happens after the push, so review your files before pushing.
- Optionally run `node scripts/check-secrets.mjs --staged` immediately before each commit to inspect the exact staged content.
- The checks are a precaution, not a guarantee that every possible secret can be detected.

If a real credential is accidentally published, revoke or rotate it promptly. Removing the current file or adding it to `.gitignore` does not invalidate an exposed credential or erase repository history.

The public source package intentionally excludes local Git history, Sites configuration, generated builds, logs, and installed dependencies.
