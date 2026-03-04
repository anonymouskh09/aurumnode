# Aurum Node – Recovery / Setup Checklist

Jab bhi project mess up lage ya fresh start chahiye, ye steps follow karo:

## 1. Code theek karo (optional)
- **GitHub se bilkul wahi code lana ho:**  
  `git fetch origin`  
  `git reset --hard origin/main`  
  (Warning: Local changes delete ho jayenge.)
- **.env mat overwrite karo** – `git reset` se .env safe rehta hai (usually .gitignore mein hota hai).

## 2. Dependencies
```bash
composer install
npm install
```

## 3. Laravel cache clear
```bash
php artisan config:clear
php artisan cache:clear
php artisan view:clear
```

## 4. Database
- MySQL/XAMPP running ho.
- `.env` mein `DB_DATABASE=aurum_node`, `DB_USERNAME`, `DB_PASSWORD` sahi hon.
```bash
php artisan migrate
```

## 5. App chalana
- **Terminal 1:** `php artisan serve`  (e.g. http://127.0.0.1:8000)
- **Terminal 2:** `npm run dev`  (Vite – frontend)

## 6. Agar phir bhi error aaye
- **Page not found (Dashboard/Index.jsx etc.):** Check `resources/js/Pages/Dashboard/` mein woh file maujood hai.
- **Target class does not exist:** Us class ka file `app/` ke andar sahi namespace ke sath maujood hona chahiye.
- **WalletCard / import error:** Check `resources/js/Components/ui/index.js` – jo export hai woh file bhi honi chahiye.

---
*Last updated: recovery steps verified.*
