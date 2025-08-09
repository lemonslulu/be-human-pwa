# Be Human — PWA

## Run locally
1. Unzip this folder.
2. In Terminal:
   ```bash
   cd be-human-pwa
   python3 -m http.server 8080
   ```
3. Open http://localhost:8080 in Safari/Chrome. Install: iPhone Safari → Share → Add to Home Screen.

## Deploy
### GitHub Pages
- Push these files to a new repo.
- Repo → Settings → Pages → Branch: main → /(root).

### Netlify
- Drag-and-drop the folder into app.netlify.com → New site from Git.

## Monetize without App Store
- Create a Stripe **Payment Link** or a Gumroad product.
- In your browser console:
  ```js
  localStorage.setItem('bh:paymentLink', 'https://buy.stripe.com/XXXX');
  location.reload();
  ```
- The “Go Pro” button will open that link.
