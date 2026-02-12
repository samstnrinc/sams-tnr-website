# Sam's TNR, Inc. — Website

React + Vite + Tailwind CSS website for Sam's TNR, Inc., a 501(c)(3) nonprofit in Brooks County, Georgia.

## Development

```bash
npm install
npm run dev    # runs on http://localhost:3555
```

## Build for Production

```bash
npm run build
```

This produces a `dist/` folder with static files ready for deployment.

## Deploy to IONOS

1. Run `npm run build`
2. Log into your IONOS account
3. Go to **Hosting** → **File Manager** (or use SFTP)
4. Upload the entire contents of the `dist/` folder to your web root (usually `/` or `/htdocs/`)
5. That's it — the site is a fully static SPA

### Optional: Add a `.htaccess` for SPA routing

If using Apache on IONOS, add this to `dist/.htaccess` before uploading:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

This ensures direct URL access and refreshes work correctly.
