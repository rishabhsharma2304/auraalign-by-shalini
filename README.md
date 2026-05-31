# AuraAlign by Shalini — Website

A fast, modern, mobile-friendly website for **AuraAlign by Shalini**, the astrology,
numerology and Vastu practice of **Shalini Chaudhary**. It's a plain static site
(HTML, CSS and a little JavaScript) — no build tools, no logins, no monthly fees.
It's designed to drive **WhatsApp consultations** and to be published free on
**GitHub Pages**.

---

## 1. What this is

Five pages — Home, About, Services, Testimonials and Contact — plus a friendly
404 page. Everything reads from **one settings file** so you can update your phone
number, address and links in a single place. The whole site loads in well under a
second and works on phones, tablets and desktops.

---

## 2. Customise in 5 minutes — `assets/config.js`

Open **`assets/config.js`** in any text editor. Change the values inside the quotes.
**Don't touch the field names** (the part before the colon). Save, and the whole
site updates.

The most important ones to confirm or replace:

```js
location: "Delhi NCR",          // ← put your exact city, e.g. "Noida" or "Gurugram"
experienceYears: 10,            // ← REPLACE with your real number of years
consultationsCount: "1,000+",   // ← REPLACE with your real figure (or e.g. "500+")
phone: "+91-9953566554",        // ← your phone number
whatsappNumber: "919953566554", // ← WhatsApp number: country code first, no +, no spaces
email: "shalini2224@gmail.com", // ← your email
address: "Delhi NCR, India",    // ← your full address or service area
hours: "Mon–Sun: 10:00 AM – 7:00 PM",
```

**Optional links** — fill these in only if you have them. If you leave them empty
(`""`), the matching icons/buttons simply won't appear anywhere on the site:

```js
instagramUrl: "",        // e.g. "https://instagram.com/yourhandle"
facebookUrl: "",         // e.g. "https://facebook.com/yourpage"
googleBusinessUrl: "",   // your Google reviews link
googleMapsEmbed: ""      // optional map (see note below)
```

> **Tip — Google Map:** to show a live map on the Contact page, open Google Maps,
> search your location, click **Share → Embed a map → Copy HTML**, and paste only
> the `src="..."` URL (the part inside the quotes) into `googleMapsEmbed`. If you
> leave it blank, a tidy placeholder card shows instead.

---

## 3. Add your photos — `assets/img/`

See **`assets/img/README.md`** for full details. In short, add:

| File                   | What it's for         | Size          |
|------------------------|-----------------------|---------------|
| `shalini-portrait.jpg` | Your portrait         | 600 × 800 px  |
| `og-image.jpg`         | Social share preview  | 1200 × 630 px |

Until you add a portrait, the site shows an elegant placeholder, so it never looks
broken. The folder's README explains how to swap the placeholder for your real photo.

---

## 4. Update testimonials

The current reviews are **real client testimonials** (lightly edited for clarity).
They live in two places:

- **`testimonials.html`** — the full grid of all reviews.
- **`index.html`** — the rotating carousel on the home page.

To add a new review, copy one existing review block (a `<figure class="testimonial">…</figure>`)
and edit the quote, the name and the role line. Keep existing names exactly as written.

---

## 5. Deploy to GitHub Pages (free)

1. **Create a repository.** On GitHub, click **New repository**. Name it something
   like `auraalign-by-shalini`. Make it **Public**. Click **Create**.
2. **Upload the files.** Either drag-and-drop all the site files into the repo's
   upload page, or push with Git:
   ```bash
   git init
   git add .
   git commit -m "Launch AuraAlign by Shalini website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/auraalign-by-shalini.git
   git push -u origin main
   ```
   > Upload the **contents** of this folder so that `index.html` sits at the top
   > level of the repository.
3. **Turn on Pages.** In the repo, go to **Settings → Pages**. Under **Source**,
   choose **Deploy from a branch**. Pick the **`main`** branch and the **`/ (root)`**
   folder. Click **Save**.
4. **Visit your site.** After about a minute it goes live at:
   ```
   https://<your-username>.github.io/auraalign-by-shalini/
   ```

That's it. To make changes later, edit the files, commit and push (or re-upload) —
the live site updates automatically.

---

## 6. Custom domain (optional)

If you own a domain (e.g. `auraalign.in`), see the instructions inside the **`CNAME`**
file. In short: put your domain in `CNAME`, set the same domain under
**Settings → Pages → Custom domain**, and add the matching DNS record at your
registrar.

---

## 7. Add Google Analytics later (optional)

Each page has a clearly-marked spot in the `<head>` for analytics:

```html
<!-- GOOGLE ANALYTICS (GA4) — owner: paste your snippet here when ready. -->
```

When you're ready, get your GA4 snippet from Google Analytics and paste it right
after that comment on each page. The site ships with **no tracking by default**.

---

## Need to change something not covered here?

Almost everything visitor-facing is in `assets/config.js`, the page text in the
`.html` files, and the look in `assets/css/styles.css`. Make a backup before large
edits, and you're good to go.

— Built with care, for AuraAlign by Shalini.
