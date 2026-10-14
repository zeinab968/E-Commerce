# EmanStore

A responsive storefront prototype with a product catalogue, product details, a saved shopping bag, and account sign-in and registration pages.

## Run locally

Serve the repository root with a local web server, then open `index.html`. For example:

```powershell
python -m http.server 8000
```

The catalogue is loaded from the public product JSON endpoint in `JS/script.js`, so the shop needs an internet connection to display products. Product selection and the shopping bag are saved in browser local storage.

## Pages

- `index.html` — storefront, search, and category filters
- `product.html` — selected product details and add-to-bag action
- `login.html` / `register.html` — local demo account flow
