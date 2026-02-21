<?php
// ─────────────────────────────────────────────
// Hammerhead Cafe · Dynamic Menu
// Place in your XAMPP htdocs folder
// ─────────────────────────────────────────────

$host = 'localhost';
$db   = 'hammerhead_cafe';
$user = 'root';
$pass = '';            // default XAMPP password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    die('<div style="padding:3rem;color:#c8915a;font-family:sans-serif;text-align:center;">
         <h2>Database connection failed</h2>
         <p>' . htmlspecialchars($e->getMessage()) . '</p>
         <p style="opacity:.5;">Make sure MySQL is running in XAMPP and you\'ve imported <code>hammerhead_cafe.sql</code></p>
         </div>');
}

// Fetch categories
$categories = $pdo->query("SELECT * FROM categories ORDER BY sort_order")->fetchAll();

// Fetch all available items grouped by category
$stmt = $pdo->query("
    SELECT mi.*, c.slug AS cat_slug, c.name AS cat_name
    FROM menu_items mi
    JOIN categories c ON mi.category_id = c.id
    WHERE mi.is_available = 1
    ORDER BY c.sort_order, mi.sort_order
");
$allItems = $stmt->fetchAll();

// Group items by category slug
$grouped = [];
foreach ($allItems as $item) {
    $grouped[$item['cat_slug']][] = $item;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Menu · Hammerhead Cafe</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;0,6..96,700;0,6..96,800;0,6..96,900;1,6..96,400;1,6..96,500&family=Figtree:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>
    /* ═══════════════════════════════════════════
       DESIGN TOKENS
    ═══════════════════════════════════════════ */
    :root {
      --espresso: #1a0e08;
      --dark-roast: #2c1810;
      --roast: #3d2216;
      --brown: #5c3a28;
      --mocha: #7a5240;
      --caramel: #c8915a;
      --gold: #d4a45a;
      --amber: #e8b86d;
      --honey: #f0c97e;
      --cream: #f5ead6;
      --latte: #faf3e8;
      --foam: #fefcf8;
      --milk: #ffffff;
      --cinnamon: #a0522d;
      --cherry: #8b2f3a;
      --sage: #6b8f71;
      --olive: #8a9a5b;

      --glass: rgba(44, 24, 16, 0.55);
      --glass-border: rgba(200, 145, 90, 0.12);
      --glow-warm: 0 0 30px rgba(200, 145, 90, 0.2), 0 0 60px rgba(200, 145, 90, 0.06);
      --glow-gold: 0 0 20px rgba(212, 164, 90, 0.25);
      --shadow-deep: 0 16px 48px rgba(26, 14, 8, 0.5);
      --shadow-hover: 0 16px 48px rgba(26, 14, 8, 0.35), 0 0 30px rgba(200, 145, 90, 0.1);

      --radius-sm: 0.75rem;
      --radius-md: 1rem;
      --radius-lg: 1.5rem;
      --radius-xl: 2rem;
      --radius-pill: 100px;
      --ease: cubic-bezier(0.22, 1, 0.36, 1);
      --bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }

    body {
      font-family: 'Figtree', sans-serif;
      background: var(--espresso);
      color: var(--cream);
      line-height: 1.6;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      min-height: 100vh;
    }

    /* ═══ ATMOSPHERE ═══ */
    .atmosphere {
      position: fixed; inset: 0; pointer-events: none; z-index: -2;
      background:
        radial-gradient(ellipse 70% 45% at 25% 15%, rgba(200,145,90,0.05) 0%, transparent 60%),
        radial-gradient(ellipse 50% 35% at 80% 75%, rgba(139,47,58,0.03) 0%, transparent 50%),
        radial-gradient(ellipse 100% 50% at 50% 100%, rgba(60,34,22,0.25) 0%, transparent 50%),
        linear-gradient(180deg, #1a0e08 0%, #120a06 100%);
    }
    .grain {
      position: fixed; inset: 0; pointer-events: none; z-index: -1; opacity: 0.025;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-size: 200px;
    }

    /* ═══ LAYOUT ═══ */
    .container {
      max-width: 1180px;
      margin: 0 auto;
      padding: 0 clamp(1rem, 4vw, 2.5rem);
      width: 100%;
    }

    /* ═══════════════════════════════════════════
       NAVIGATION
    ═══════════════════════════════════════════ */
    .nav {
      position: sticky; top: 0; z-index: 100;
      background: rgba(26, 14, 8, 0.8);
      backdrop-filter: blur(24px) saturate(1.3);
      -webkit-backdrop-filter: blur(24px) saturate(1.3);
      border-bottom: 1px solid rgba(200, 145, 90, 0.08);
    }
    .nav.scrolled { box-shadow: 0 4px 30px rgba(0,0,0,0.5); }
    .nav-inner {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.8rem 0; max-width: 1180px; margin: 0 auto;
      padding-left: clamp(1rem, 4vw, 2.5rem);
      padding-right: clamp(1rem, 4vw, 2.5rem);
    }
    .logo { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; color: var(--cream); flex-shrink: 0; }
    .logo-mark {
      width: 38px; height: 38px;
      background: linear-gradient(145deg, var(--caramel), var(--brown));
      border-radius: 50%; display: grid; place-items: center;
      font-size: 0.9rem; color: var(--foam); box-shadow: var(--glow-gold); position: relative;
    }
    .logo-mark::after { content:''; position:absolute; inset:-3px; border-radius:50%; border:1px solid rgba(200,145,90,0.2); }
    .logo-text { font-family:'Bodoni Moda',serif; font-size:1.35rem; font-weight:700; }
    .logo-text span { color:var(--caramel); }
    .logo-sub { font-size:0.5rem; letter-spacing:0.18em; text-transform:uppercase; color:rgba(200,145,90,0.5); display:block; margin-top:-2px; font-family:'Figtree',sans-serif; font-weight:600; }

    .nav-links { display:flex; align-items:center; gap:2rem; }
    .nav-links a { text-decoration:none; color:rgba(245,234,214,0.45); font-size:0.83rem; font-weight:500; transition:color .2s; position:relative; white-space: nowrap; }
    .nav-links a:hover { color:var(--caramel); }
    .nav-links a::after { content:''; position:absolute; bottom:-4px; left:0; width:0; height:1.5px; background:var(--caramel); border-radius:2px; transition:width .3s var(--ease); }
    .nav-links a:hover::after { width:100%; }

    .order-btn {
      background:var(--caramel); color:var(--espresso);
      padding:0.6rem 1.4rem; border-radius:var(--radius-pill);
      font-weight:700; font-size:0.82rem; text-decoration:none;
      display:inline-flex; align-items:center; gap:0.4rem;
      transition:all .25s var(--ease);
      box-shadow:0 2px 12px rgba(200,145,90,0.3);
      border:none; cursor:pointer; font-family:inherit;
    }
    .order-btn:hover { background:var(--gold); transform:translateY(-2px); box-shadow:var(--glow-gold); }

    .menu-toggle { display:none; background:none; border:none; cursor:pointer; width:44px; height:44px; z-index:110; }
    .menu-toggle span { display:block; width:22px; height:2px; background:var(--caramel); margin:0 auto; border-radius:2px; transition:all .3s var(--ease); }
    .menu-toggle span:nth-child(1) { transform:translateY(-6px); }
    .menu-toggle span:nth-child(3) { transform:translateY(6px); }
    .menu-toggle.active span:nth-child(1) { transform:rotate(45deg); }
    .menu-toggle.active span:nth-child(2) { opacity:0; }
    .menu-toggle.active span:nth-child(3) { transform:rotate(-45deg); }

    /* ═══════════════════════════════════════════
       PAGE HEADER
    ═══════════════════════════════════════════ */
    .page-hero {
      text-align: center;
      padding: 4rem 0 2rem;
      position: relative;
    }
    .page-hero::after {
      content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
      width: 120px; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(200,145,90,0.25), transparent);
    }
    .page-eyebrow {
      font-size: 0.68rem; font-weight: 700;
      letter-spacing: 0.18em; text-transform: uppercase;
      color: var(--caramel); margin-bottom: 0.6rem;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    }
    .page-title {
      font-family: 'Bodoni Moda', serif;
      font-size: clamp(2.2rem, 5vw, 3.6rem);
      font-weight: 800; color: var(--foam);
      margin-bottom: 0.5rem; letter-spacing: -0.02em;
    }
    .page-sub {
      color: rgba(245,234,214,0.38);
      font-size: 0.92rem; max-width: 480px; margin: 0 auto;
    }
    .back-link {
      display: inline-flex; align-items: center; gap: 0.4rem;
      color: rgba(245,234,214,0.35); text-decoration: none;
      font-size: 0.8rem; font-weight: 500;
      transition: color 0.2s; margin-bottom: 1rem;
    }
    .back-link:hover { color: var(--caramel); }

    /* ═══════════════════════════════════════════
       CATEGORY TABS — scrollable on mobile
    ═══════════════════════════════════════════ */
    .tabs-wrapper {
      position: sticky; top: 56px; z-index: 50;
      background: rgba(26, 14, 8, 0.88);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(200,145,90,0.05);
    }
    .category-tabs {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 1.2rem 0;
      max-width: 1180px; margin: 0 auto;
      padding-left: clamp(1rem, 4vw, 2.5rem);
      padding-right: clamp(1rem, 4vw, 2.5rem);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .category-tabs::-webkit-scrollbar { display: none; }

    .cat-tab {
      background: transparent;
      border: 1px solid rgba(200,145,90,0.12);
      color: rgba(245,234,214,0.4);
      padding: 0.5rem 1.2rem; border-radius: var(--radius-pill);
      font-size: 0.78rem; font-weight: 600;
      cursor: pointer; font-family: inherit;
      transition: all 0.25s var(--ease);
      display: inline-flex; align-items: center; gap: 0.35rem;
      white-space: nowrap; flex-shrink: 0;
    }
    .cat-tab:hover { color: var(--caramel); border-color: rgba(200,145,90,0.25); }
    .cat-tab.active {
      background: var(--caramel); color: var(--espresso);
      border-color: var(--caramel);
      box-shadow: 0 2px 12px rgba(200,145,90,0.25);
    }
    .cat-tab .tab-count {
      background: rgba(26,14,8,0.2); padding: 0.1rem 0.4rem;
      border-radius: 20px; font-size: 0.62rem; margin-left: 0.1rem;
    }
    .cat-tab.active .tab-count { background: rgba(26,14,8,0.18); color: var(--espresso); }

    /* ═══════════════════════════════════════════
       SECTION HEADERS
    ═══════════════════════════════════════════ */
    .section-block { padding: 2rem 0 0.5rem; }
    .section-label {
      font-family: 'Bodoni Moda', serif;
      font-size: clamp(1.3rem, 2.5vw, 1.65rem); font-weight: 700;
      color: var(--foam);
      display: flex; align-items: center; gap: 0.6rem;
      margin-bottom: 0.3rem;
    }
    .section-label i { color: var(--caramel); font-size: 0.85rem; }
    .section-count {
      font-size: 0.72rem; color: rgba(245,234,214,0.28);
      font-weight: 500; margin-bottom: 1.5rem;
    }

    /* ═══════════════════════════════════════════
       CARD GRID
    ═══════════════════════════════════════════ */
    .menu-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.1rem;
      padding-bottom: 1.5rem;
    }

    /* ═══════════════════════════════════════════
       MENU CARDS — Glass-border rectangles
    ═══════════════════════════════════════════ */
    .menu-card {
      position: relative;
      background: linear-gradient(168deg, rgba(92,58,40,0.3) 0%, rgba(44,24,16,0.5) 100%);
      border: 1px solid rgba(200,145,90,0.07);
      border-radius: var(--radius-lg);
      padding: 1.6rem 1.2rem 1.4rem;
      text-align: center;
      transition: all 0.35s var(--ease);
      overflow: hidden;
      display: flex; flex-direction: column; align-items: center;
    }

    /* Left accent bar — slides in on hover */
    .menu-card::before {
      content: '';
      position: absolute;
      left: 0; top: 12%; bottom: 12%;
      width: 3px;
      background: linear-gradient(to bottom, var(--caramel), rgba(200,145,90,0.15));
      border-radius: 0 3px 3px 0;
      opacity: 0; transform: scaleY(0.3);
      transition: opacity 0.35s var(--ease), transform 0.35s var(--ease);
      transform-origin: center;
    }

    /* Top edge glow */
    .menu-card::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(200,145,90,0.12), transparent);
      transition: background 0.35s;
    }

    .menu-card:hover {
      transform: translateY(-6px);
      border-color: rgba(200,145,90,0.18);
      box-shadow:
        0 20px 50px rgba(26,14,8,0.4),
        0 0 0 1px rgba(200,145,90,0.05),
        0 0 30px rgba(200,145,90,0.04);
    }
    .menu-card:hover::before { opacity: 1; transform: scaleY(1); }
    .menu-card:hover::after {
      background: linear-gradient(90deg, transparent 5%, var(--caramel) 50%, transparent 95%);
    }

    /* Icon — rounded square */
    .card-icon {
      width: 50px; height: 50px;
      margin-bottom: 0.9rem;
      border-radius: 14px;
      background: rgba(200,145,90,0.07);
      border: 1px solid rgba(200,145,90,0.1);
      display: grid; place-items: center;
      font-size: 1.15rem; color: var(--caramel);
      transition: all 0.35s var(--bounce);
    }
    .menu-card:hover .card-icon {
      transform: scale(1.1) rotate(-3deg);
      background: rgba(200,145,90,0.14);
      box-shadow: var(--glow-gold);
    }
    .card-icon.sage   { color: var(--sage);   background: rgba(107,143,113,0.08); border-color: rgba(107,143,113,0.12); }
    .card-icon.cherry { color: var(--cherry); background: rgba(139,47,58,0.08);   border-color: rgba(139,47,58,0.12); }
    .menu-card:hover .card-icon.sage   { background: rgba(107,143,113,0.16); box-shadow: 0 0 18px rgba(107,143,113,0.15); }
    .menu-card:hover .card-icon.cherry { background: rgba(139,47,58,0.16);   box-shadow: 0 0 18px rgba(139,47,58,0.15); }

    /* Text */
    .card-name {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.08rem; font-weight: 600;
      color: var(--foam); margin-bottom: 0.15rem;
      line-height: 1.3;
    }
    .card-flavor {
      font-size: 0.72rem; color: rgba(245,234,214,0.3);
      margin-bottom: 0.7rem; line-height: 1.45;
    }
    .card-price {
      font-size: 1.1rem; font-weight: 700;
      color: var(--caramel); margin-bottom: 0.9rem;
      margin-top: auto;
    }

    /* CTA button */
    .card-btn {
      background: rgba(200,145,90,0.08);
      border: 1px solid rgba(200,145,90,0.18);
      color: var(--caramel);
      padding: 0.45rem 1rem; border-radius: var(--radius-pill);
      font-size: 0.72rem; font-weight: 600;
      cursor: pointer; font-family: inherit;
      transition: all 0.25s var(--ease);
      display: inline-flex; align-items: center; gap: 0.3rem;
    }
    .card-btn:hover {
      background: var(--caramel); color: var(--espresso);
      border-color: transparent;
      box-shadow: 0 4px 14px rgba(200,145,90,0.3);
    }

    /* Featured badge */
    .card-featured {
      position: absolute; top: 10px; right: 10px;
      background: rgba(212,164,90,0.12);
      border: 1px solid rgba(212,164,90,0.22);
      color: var(--gold);
      font-size: 0.58rem; font-weight: 700;
      padding: 0.18rem 0.5rem; border-radius: var(--radius-pill);
      letter-spacing: 0.06em; text-transform: uppercase;
      z-index: 2; display: flex; align-items: center; gap: 0.2rem;
    }

    /* Category section panel */
    .cat-section { display: none; }
    .cat-section.active { display: block; }

    /* ═══════════════════════════════════════════
       FOOTER
    ═══════════════════════════════════════════ */
    .footer {
      background: linear-gradient(180deg, var(--espresso), #0e0805);
      position: relative; overflow: hidden; margin-top: 3rem;
    }
    .footer::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg, transparent, rgba(200,145,90,0.15), transparent); }
    .footer-inner {
      display: flex; justify-content: space-between; align-items: center;
      padding: 2rem 0; flex-wrap: wrap; gap: 1rem;
    }
    .footer-sig {
      font-family: 'Bodoni Moda', serif;
      font-size: 0.9rem; font-style: italic;
      color: var(--caramel); display: flex; align-items: center; gap: 0.5rem; opacity: 0.55;
    }
    .footer-sig strong { font-weight: 700; font-style: normal; color: var(--cream); }
    .footer-tagline { font-size: 0.68rem; color: rgba(245,234,214,0.18); display: flex; align-items: center; gap: 0.4rem; }

    /* ═══ SCROLL REVEAL ═══ */
    .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.6s var(--ease), transform 0.6s var(--ease); }
    .reveal.visible { opacity: 1; transform: translateY(0); }

    /* ═══ MODAL ═══ */
    .modal-overlay {
      display:none; position:fixed; inset:0;
      background:rgba(14,8,5,0.7);
      backdrop-filter:blur(14px); z-index:200;
      align-items:center; justify-content:center; padding:1rem;
    }
    .modal {
      background:linear-gradient(160deg, var(--roast), var(--dark-roast));
      border:1px solid var(--glass-border);
      max-width:380px; width:100%;
      padding:2.5rem 2rem; border-radius:var(--radius-xl);
      text-align:center;
      box-shadow:var(--shadow-deep), var(--glow-warm);
    }
    .modal-icon {
      width:60px; height:60px; margin:0 auto 1.2rem;
      background:rgba(200,145,90,0.1); border:1px solid rgba(200,145,90,0.12);
      border-radius:50%; display:grid; place-items:center;
      font-size:1.5rem; color:var(--caramel);
    }
    .modal h3 { font-family:'Bodoni Moda',serif; font-size:1.35rem; font-weight:700; color:var(--foam); margin-bottom:0.5rem; }
    .modal p { font-size:0.83rem; color:rgba(245,234,214,0.38); margin-bottom:1.5rem; line-height:1.6; }
    .modal-close {
      background:rgba(200,145,90,0.1); border:1px solid rgba(200,145,90,0.18);
      color:var(--caramel); padding:0.5rem 1.4rem; border-radius:var(--radius-pill);
      font-weight:600; font-size:0.8rem; cursor:pointer; font-family:inherit; transition:all .2s;
    }
    .modal-close:hover { background:var(--caramel); color:var(--espresso); }

    /* ═══════════════════════════════════════════
       RESPONSIVE — 5 breakpoints for perfect fit
    ═══════════════════════════════════════════ */

    /* ── Tablet landscape / small desktop ── */
    @media (max-width: 1080px) {
      .menu-grid { grid-template-columns: repeat(3, 1fr); }
    }

    /* ── Tablet portrait ── */
    @media (max-width: 820px) {
      .menu-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }

      /* Mobile nav */
      .nav-links { display:none; }
      .menu-toggle { display:flex; align-items:center; justify-content:center; }
      .nav-links.open {
        display:flex; flex-direction:column; position:fixed; inset:0;
        background:rgba(26,14,8,0.97);
        backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
        justify-content:center; align-items:center; gap:1.8rem; z-index:105;
      }
      .nav-links.open a { font-size:1.15rem; color:var(--cream); }
      .nav-links.open a::after { display:none; }
      .nav-links.open .order-btn { font-size:1rem; padding:0.8rem 2rem; }

      .tabs-wrapper { top: 54px; }
      .page-hero { padding: 3rem 0 1.5rem; }
    }

    /* ── Large phone ── */
    @media (max-width: 600px) {
      .menu-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
      .menu-card { padding: 1.3rem 0.9rem 1.2rem; border-radius: var(--radius-md); }
      .card-icon { width: 44px; height: 44px; border-radius: 12px; font-size: 1rem; margin-bottom: 0.7rem; }
      .card-name { font-size: 0.92rem; }
      .card-flavor { font-size: 0.66rem; margin-bottom: 0.5rem; }
      .card-price { font-size: 0.98rem; margin-bottom: 0.7rem; }
      .card-btn { padding: 0.4rem 0.85rem; font-size: 0.66rem; }
      .card-featured { font-size: 0.52rem; padding: 0.14rem 0.4rem; top: 7px; right: 7px; }

      .section-block { padding: 1.5rem 0 0.3rem; }
      .section-count { margin-bottom: 1rem; }
      .category-tabs { gap: 0.35rem; padding-top: 1rem; padding-bottom: 1rem; }
      .cat-tab { padding: 0.42rem 0.9rem; font-size: 0.72rem; }

      .logo-mark { width: 34px; height: 34px; font-size: 0.8rem; }
      .logo-text { font-size: 1.2rem; }
      .page-sub { font-size: 0.84rem; }
      .footer-inner { flex-direction: column; text-align: center; }
      .footer-sig { font-size: 0.8rem; }
    }

    /* ── Small phone ── */
    @media (max-width: 400px) {
      .menu-grid { grid-template-columns: repeat(2, 1fr); gap: 0.6rem; }
      .menu-card { padding: 1rem 0.7rem 0.9rem; }
      .card-icon { width: 38px; height: 38px; font-size: 0.9rem; border-radius: 10px; margin-bottom: 0.55rem; }
      .card-name { font-size: 0.84rem; }
      .card-flavor { font-size: 0.6rem; }
      .card-price { font-size: 0.88rem; margin-bottom: 0.6rem; }
      .card-btn { padding: 0.35rem 0.7rem; font-size: 0.62rem; gap: 0.2rem; }
      .card-btn i { font-size: 0.58rem; }
      .cat-tab { padding: 0.36rem 0.7rem; font-size: 0.66rem; }
      .tab-count { display: none; }
      .page-hero { padding: 2.5rem 0 1.2rem; }
      .section-label { font-size: 1.15rem; gap: 0.4rem; }
      .section-label i { font-size: 0.75rem; }
      .logo-sub { display: none; }
      .modal { padding: 2rem 1.5rem; margin: 0 0.5rem; }
    }

    /* ── Tiny phone (320px / iPhone SE) ── */
    @media (max-width: 340px) {
      .menu-grid { grid-template-columns: 1fr; max-width: 260px; margin: 0 auto; }
      .menu-card { padding: 1.3rem 1.1rem 1.1rem; }
      .card-name { font-size: 1rem; }
      .card-price { font-size: 1rem; }
      .card-btn { font-size: 0.7rem; padding: 0.4rem 0.9rem; }
    }

    /* ── Touch devices: swap hover for active tap ── */
    @media (hover: none) {
      .menu-card:hover {
        transform: none;
        box-shadow: none;
        border-color: rgba(200,145,90,0.07);
      }
      .menu-card:hover::before { opacity: 0; transform: scaleY(0.3); }
      .menu-card:hover::after { background: linear-gradient(90deg, transparent, rgba(200,145,90,0.12), transparent); }
      .menu-card:hover .card-icon { transform: none; background: rgba(200,145,90,0.07); box-shadow: none; }
      .menu-card:hover .card-icon.sage { background: rgba(107,143,113,0.08); box-shadow: none; }
      .menu-card:hover .card-icon.cherry { background: rgba(139,47,58,0.08); box-shadow: none; }

      .menu-card:active {
        transform: scale(0.97);
        border-color: rgba(200,145,90,0.2);
        transition-duration: 0.1s;
      }
      .menu-card:active::before { opacity: 1; transform: scaleY(1); }
    }
  </style>
</head>
<body>
  <div class="atmosphere" aria-hidden="true"></div>
  <div class="grain" aria-hidden="true"></div>

  <!-- NAV -->
  <nav class="nav" id="nav">
    <div class="nav-inner">
      <a href="index.html" class="logo">
        <span class="logo-mark"><i class="fa-solid fa-mug-hot"></i></span>
        <span>
          <span class="logo-text">Hammer<span>head</span></span>
          <span class="logo-sub">Coffee · Food · Novelties</span>
        </span>
      </a>
      <div class="nav-links" id="navLinks">
        <a href="index.html">Home</a>
        <a href="menu.php" style="color:var(--caramel);">Menu</a>
        <a href="index.html#novelties">Novelties</a>
        <a href="index.html#how-it-works">How it Works</a>
        <a href="#" class="order-btn" onclick="openModal()"><i class="fa-solid fa-mug-hot"></i> Order Ahead</a>
      </div>
      <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- PAGE HEADER -->
  <div class="container">
    <div class="page-hero reveal">
      <a href="index.html" class="back-link"><i class="fa-solid fa-arrow-left"></i> Back to Home</a>
      <div class="page-eyebrow"><i class="fa-solid fa-fire"></i> Full Menu <i class="fa-solid fa-fire"></i></div>
      <h1 class="page-title">Our Menu</h1>
      <p class="page-sub">Every brew, bite, and novelty — pulled fresh from our kitchen</p>
    </div>
  </div>

  <!-- CATEGORY TABS -->
  <div class="tabs-wrapper">
    <div class="category-tabs" id="categoryTabs">
      <button class="cat-tab active" data-cat="all">
        <i class="fa-solid fa-border-all"></i> All
        <span class="tab-count"><?= count($allItems) ?></span>
      </button>
      <?php foreach ($categories as $cat): ?>
        <button class="cat-tab" data-cat="<?= htmlspecialchars($cat['slug']) ?>">
          <i class="<?= htmlspecialchars($cat['icon_class']) ?>"></i>
          <?= htmlspecialchars($cat['name']) ?>
          <span class="tab-count"><?= isset($grouped[$cat['slug']]) ? count($grouped[$cat['slug']]) : 0 ?></span>
        </button>
      <?php endforeach; ?>
    </div>
  </div>

  <!-- MENU CONTENT -->
  <div class="container" id="menuContent">

    <!-- ALL -->
    <div class="cat-section active" data-section="all">
      <?php foreach ($categories as $cat):
        if (empty($grouped[$cat['slug']])) continue;
      ?>
        <div class="section-block">
          <div class="section-label reveal"><i class="<?= htmlspecialchars($cat['icon_class']) ?>"></i> <?= htmlspecialchars($cat['name']) ?></div>
          <div class="section-count reveal"><?= count($grouped[$cat['slug']]) ?> items</div>
          <div class="menu-grid">
            <?php foreach ($grouped[$cat['slug']] as $item): ?>
              <div class="menu-card reveal">
                <?php if ($item['is_featured']): ?>
                  <span class="card-featured"><i class="fa-solid fa-star"></i> Popular</span>
                <?php endif; ?>
                <div class="card-icon <?= htmlspecialchars($item['icon_color']) ?>">
                  <i class="<?= htmlspecialchars($item['icon_class']) ?>"></i>
                </div>
                <h3 class="card-name"><?= htmlspecialchars($item['name']) ?></h3>
                <p class="card-flavor"><?= htmlspecialchars($item['flavor_note']) ?></p>
                <div class="card-price">$<?= number_format($item['price'], 2) ?></div>
                <button class="card-btn" onclick="openModal()">
                  <i class="fa-solid fa-cart-plus"></i> Add to Order
                </button>
              </div>
            <?php endforeach; ?>
          </div>
        </div>
      <?php endforeach; ?>
    </div>

    <!-- Individual category panels -->
    <?php foreach ($categories as $cat):
      if (empty($grouped[$cat['slug']])) continue;
    ?>
      <div class="cat-section" data-section="<?= htmlspecialchars($cat['slug']) ?>">
        <div class="section-block">
          <div class="section-label reveal"><i class="<?= htmlspecialchars($cat['icon_class']) ?>"></i> <?= htmlspecialchars($cat['name']) ?></div>
          <div class="section-count reveal"><?= count($grouped[$cat['slug']]) ?> items</div>
          <div class="menu-grid">
            <?php foreach ($grouped[$cat['slug']] as $item): ?>
              <div class="menu-card reveal">
                <?php if ($item['is_featured']): ?>
                  <span class="card-featured"><i class="fa-solid fa-star"></i> Popular</span>
                <?php endif; ?>
                <div class="card-icon <?= htmlspecialchars($item['icon_color']) ?>">
                  <i class="<?= htmlspecialchars($item['icon_class']) ?>"></i>
                </div>
                <h3 class="card-name"><?= htmlspecialchars($item['name']) ?></h3>
                <p class="card-flavor"><?= htmlspecialchars($item['flavor_note']) ?></p>
                <div class="card-price">$<?= number_format($item['price'], 2) ?></div>
                <button class="card-btn" onclick="openModal()">
                  <i class="fa-solid fa-cart-plus"></i> Add to Order
                </button>
              </div>
            <?php endforeach; ?>
          </div>
        </div>
      </div>
    <?php endforeach; ?>
  </div>

  <!-- MODAL -->
  <div class="modal-overlay" id="modalOverlay" onclick="closeModal(event)">
    <div class="modal">
      <div class="modal-icon"><i class="fa-solid fa-mug-hot"></i></div>
      <h3>Order Coming Soon</h3>
      <p>This is a demo of the Hammerhead Cafe ordering flow. In production, it links to JCommerce POS.</p>
      <button class="modal-close" onclick="closeModal(event)">Close</button>
    </div>
  </div>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="container">
      <div class="footer-inner">
        <div class="footer-sig">
          <i class="fa-regular fa-pen-fancy"></i> Developed by <strong>&nbsp;JCommerce &amp; Tech&nbsp;</strong> · Kingston
        </div>
        <div class="footer-tagline"><i class="fa-solid fa-mug-saucer"></i> brewed with intention</div>
      </div>
    </div>
  </footer>

  <script>
    // ── Nav scroll ──
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10));

    // ── Mobile menu ──
    const toggle = document.getElementById('menuToggle');
    const links  = document.getElementById('navLinks');
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
      document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
      document.body.style.overflow = '';
    }));

    // ── Category Tabs ──
    document.querySelectorAll('.cat-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const cat = tab.dataset.cat;
        document.querySelectorAll('.cat-section').forEach(s => s.classList.remove('active'));
        document.querySelector(`.cat-section[data-section="${cat}"]`).classList.add('active');

        // Re-trigger reveal
        document.querySelector(`.cat-section[data-section="${cat}"]`).querySelectorAll('.reveal').forEach(el => {
          el.classList.remove('visible');
          void el.offsetWidth;
          obs.observe(el);
        });

        document.getElementById('menuContent').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // ── Modal ──
    const overlay = document.getElementById('modalOverlay');
    function openModal()  { overlay.style.display = 'flex'; }
    function closeModal(e) {
      if (e.target === overlay || e.target.closest('.modal-close')) overlay.style.display = 'none';
    }
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.style.display === 'flex') overlay.style.display = 'none';
    });

    // ── Scroll Reveal ──
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblings = entry.target.parentElement.querySelectorAll('.reveal');
          const idx = Array.from(siblings).indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 0.05}s`;
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  </script>
</body>
</html>