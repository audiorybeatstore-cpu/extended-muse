# Extended Muse Storefront — Tailwind CSS CDN

A responsive multi-page hair store starter based on the Extended Muse design reference. The supplied Extended Muse logo is installed in the header and footer. Layout safety overrides prevent the logo and product grids from expanding beyond their containers.

## Pages
- `index.html` — home page
- `shop.html` — all products, search and sorting
- `bundles.html`
- `wigs.html`
- `frontals.html`
- `hair-care.html`
- `product.html?id=straight-bundles` — product detail page template
- `cart.html` — cart saved in browser localStorage
- `checkout.html` — demo checkout form
- `account.html` — account setup placeholder
- `about.html`
- `contact.html`
- `shipping.html`
- `returns.html`
- `faq.html`

## Run locally
Open `index.html` in a browser, or use a local static server. The pages use Tailwind CDN and Google Fonts, so those require an internet connection.

## Deploy with GitHub Pages
1. Create a GitHub repository.
2. Upload all files and the entire `assets/` directory.
3. In repository Settings → Pages, select the branch and root folder.
4. Save and wait for the published site link.
5. If using a custom domain, configure it in Pages and your DNS provider.

## Important before real sales
This is a frontend starter, not yet a production e-commerce backend.
- Cart persists in the customer's browser.
- Product inventory/prices are demo data in `store.js`.
- Checkout currently records a demo order in the current browser only. It does not charge a card, send an order to the store owner, or save it centrally.
- Contact/newsletter forms show inline confirmations but need a connected email service/backend.
- Customer login is not connected.
- Add a real payment gateway and secure backend (e.g. a suitable commerce platform or a server/API) before accepting payments.
- The included hair artwork is illustrative placeholder imagery, not verified product photography. Replace the images in `assets/` with your actual/licensed product photographs and update product prices, descriptions, shipping, return policy, and social links before launch.

No native browser alert popups are used.
