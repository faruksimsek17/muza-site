# Grosper — muza-site

Statik kurumsal site ve tarayıcı tabanlı yönetim paneli.

## Canlı site

Yayınlandıktan sonra adres:

**https://faruksimsek17.github.io/muza-site/**

Yönetim paneli: **https://faruksimsek17.github.io/muza-site/admin/**  
Giriş: `admin` / `grosper`

## Önemli not

İçerikler (haberler, slider, bülten aboneleri vb.) ziyaretçinin **tarayıcısındaki localStorage** içinde tutulur. Admin panelinde yaptığınız değişiklikler yalnızca **o tarayıcıda** görünür; başka bir bilgisayar veya tarayıcı varsayılan demo verisiyle açılır. Kalıcı ortak içerik için ileride sunucu/API eklenebilir.

## Yerel çalıştırma

```bash
python3 -m http.server 5500
```

Ardından: http://127.0.0.1:5500/
