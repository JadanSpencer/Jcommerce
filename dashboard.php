<?php
// admin_dashboard.php
// CRUD for Hammerhead Cafe menu items (no login/auth)
// Use with MySQL. Create database 'hammerhead_cafe' and table 'menu_items' (see SQL below)

session_start(); // optional, not used for auth but good practice

// --- Database configuration ---
$host = 'localhost';
$dbname = 'hammerhead_cafe';
$username = 'root';      // change to your DB user
$password = '';          // change to your DB password

// --- PDO connection ---
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// --- Handle CRUD actions ---
$message = '';
$error = '';

// CREATE / UPDATE
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // ADD new item
    if (isset($_POST['action']) && $_POST['action'] === 'add') {
        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $price = floatval($_POST['price'] ?? 0);
        $category = trim($_POST['category'] ?? '');
        $organic_shape = $_POST['organic_shape'] ?? 'default'; // optional style hint

        if ($name && $price > 0) {
            $stmt = $pdo->prepare("INSERT INTO menu_items (name, description, price, category, organic_shape) VALUES (?, ?, ?, ?, ?)");
            if ($stmt->execute([$name, $description, $price, $category, $organic_shape])) {
                $message = "Menu item added successfully.";
            } else {
                $error = "Failed to add item.";
            }
        } else {
            $error = "Name and valid price required.";
        }
    }
    // UPDATE existing item
    elseif (isset($_POST['action']) && $_POST['action'] === 'update') {
        $id = intval($_POST['id'] ?? 0);
        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $price = floatval($_POST['price'] ?? 0);
        $category = trim($_POST['category'] ?? '');
        $organic_shape = $_POST['organic_shape'] ?? 'default';

        if ($id && $name && $price > 0) {
            $stmt = $pdo->prepare("UPDATE menu_items SET name=?, description=?, price=?, category=?, organic_shape=? WHERE id=?");
            if ($stmt->execute([$name, $description, $price, $category, $organic_shape, $id])) {
                $message = "Item updated.";
            } else {
                $error = "Update failed.";
            }
        } else {
            $error = "Invalid data.";
        }
    }
}

// DELETE
if (isset($_GET['delete'])) {
    $id = intval($_GET['delete']);
    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM menu_items WHERE id = ?");
        if ($stmt->execute([$id])) {
            $message = "Item deleted.";
        } else {
            $error = "Delete failed.";
        }
    }
}

// Fetch all menu items for display
$items = $pdo->query("SELECT * FROM menu_items ORDER BY category, name")->fetchAll(PDO::FETCH_ASSOC);

// For editing, fetch one item if edit ID is present
$editItem = null;
if (isset($_GET['edit'])) {
    $editId = intval($_GET['edit']);
    $stmt = $pdo->prepare("SELECT * FROM menu_items WHERE id = ?");
    $stmt->execute([$editId]);
    $editItem = $stmt->fetch(PDO::FETCH_ASSOC);
}

// Category list for filter (static + from db)
$categories = ['coffee', 'tea', 'matcha', 'meals', 'pastries', 'custom'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hammerhead · admin dashboard (CRUD)</title>
  <!-- fonts & icons (same as homepage) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,700;9..144,900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>
    /* ----- design system: cobalt + royal purple + underwater ----- */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: linear-gradient(165deg, #f2f7ff 0%, #e9effa 100%);
      color: #13294b;
      min-height: 100vh;
      position: relative;
      padding-bottom: 2rem;
    }

    :root {
      --cobalt-deep: #003b6f;
      --cobalt-bright: #0066b2;
      --royal-purple: #5a3e8a;
      --purple-soft: #8f77b5;
      --purple-mist: #b6a0d4;
      --white-ice: #f0f7ff;
      --shadow-organic: 0 18px 35px -10px rgba(0, 59, 111, 0.2), 0 8px 18px rgba(90, 62, 138, 0.1);
    }

    .container {
      max-width: 1300px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    /* underwater background bubbles */
    .underwater-bg {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: -1;
    }
    .bubble1 { width: 350px; height: 350px; top: 5%; left: -50px; background: rgba(0,102,178,0.03); border-radius: 50%; filter: blur(60px); position: absolute; }
    .bubble2 { width: 450px; height: 450px; bottom: 0; right: -50px; background: rgba(90,62,138,0.03); filter: blur(70px); border-radius: 50%; position: absolute; }

    /* admin header */
    .admin-header {
      background: rgba(255,255,255,0.75);
      backdrop-filter: blur(12px);
      padding: 1.5rem 2rem;
      border-bottom: 2px solid rgba(0,102,178,0.15);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .logo {
      font-family: 'Fraunces', serif;
      font-size: 2rem;
      font-weight: 900;
      background: linear-gradient(135deg, var(--cobalt-deep), var(--royal-purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .badge {
      background: var(--royal-purple);
      color: white;
      border-radius: 60px;
      padding: 0.3rem 1.2rem;
      font-weight: 600;
      font-size: 0.85rem;
    }

    /* form card (organic shape) */
    .form-card {
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(8px);
      border-radius: 65% 35% 62% 38% / 42% 55% 45% 58%;
      padding: 2rem 2rem 2.5rem;
      margin: 2rem 0 3rem;
      box-shadow: var(--shadow-organic);
      border: 1px solid rgba(255,255,255,0.7);
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.2rem;
      margin-top: 1.5rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
    }
    .form-group label {
      font-weight: 600;
      font-size: 0.85rem;
      color: var(--cobalt-deep);
      margin-bottom: 0.2rem;
    }
    .form-control {
      padding: 0.7rem 1rem;
      border: 2px solid rgba(0,102,178,0.2);
      border-radius: 60px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: white;
      transition: 0.15s;
    }
    .form-control:focus {
      outline: none;
      border-color: var(--royal-purple);
      box-shadow: 0 0 0 3px rgba(90,62,138,0.2);
    }
    .btn {
      background: var(--cobalt-deep);
      color: white;
      border: none;
      padding: 0.8rem 2rem;
      border-radius: 60px;
      font-weight: 700;
      cursor: pointer;
      transition: 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-purple {
      background: var(--royal-purple);
    }
    .btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(90,62,138,0.3);
    }

    /* message alerts */
    .message {
      background: #d4edda;
      border-left: 8px solid #003b6f;
      color: #004085;
      padding: 1rem 2rem;
      border-radius: 100px;
      margin: 1rem 0;
    }
    .error {
      background: #f8d7da;
      border-left-color: #5a3e8a;
    }

    /* table – clean admin style */
    .table-wrapper {
      background: rgba(255,255,255,0.8);
      backdrop-filter: blur(8px);
      border-radius: 48% 52% 37% 63% / 56% 41% 59% 44%;
      padding: 2rem 1.5rem;
      box-shadow: var(--shadow-organic);
      margin: 2rem 0;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      text-align: left;
      padding: 1rem 0.5rem 0.8rem;
      color: var(--cobalt-deep);
      font-weight: 700;
      border-bottom: 2px solid var(--purple-soft);
    }
    td {
      padding: 0.8rem 0.5rem;
      border-bottom: 1px solid rgba(0,102,178,0.1);
      vertical-align: middle;
    }
    .action-icons a {
      margin: 0 0.5rem 0 0;
      color: var(--cobalt-deep);
      font-size: 1.1rem;
    }
    .action-icons a:hover {
      color: var(--royal-purple);
    }

    /* organic chip for category */
    .cat-chip {
      background: var(--cobalt-bright);
      color: white;
      border-radius: 40px;
      padding: 0.2rem 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      display: inline-block;
    }

    .footer {
      background: linear-gradient(145deg, #022b49, #1e2b5a);
      color: rgba(255,255,255,0.8);
      border-radius: 3rem 3rem 0 0;
      padding: 2rem 2rem 1.5rem;
      margin-top: 3rem;
      text-align: center;
    }
    .signature {
      font-family: 'Fraunces', serif;
      font-size: 1.2rem;
      font-style: italic;
      color: #bba6db;
      border-top: 1px dashed rgba(255,255,255,0.2);
      padding-top: 1.2rem;
      width: fit-content;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="underwater-bg">
    <div class="bubble1"></div>
    <div class="bubble2"></div>
  </div>

  <!-- admin header -->
  <div class="admin-header">
    <div class="logo"><i class="fa-solid fa-fish"></i> Hammerhead · admin</div>
    <div class="badge"><i class="fa-regular fa-pen-to-square"></i> CRUD menu (no auth)</div>
  </div>

  <main class="container">
    <!-- status messages -->
    <?php if ($message): ?>
      <div class="message"><i class="fa-regular fa-circle-check"></i> <?= htmlspecialchars($message) ?></div>
    <?php endif; ?>
    <?php if ($error): ?>
      <div class="message error"><i class="fa-regular fa-circle-exclamation"></i> <?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <!-- ADD / EDIT FORM (organic card) -->
    <div class="form-card">
      <h2 style="font-family: 'Fraunces'; color: var(--cobalt-deep);">
        <?= $editItem ? '<i class="fa-regular fa-pen-to-square"></i> edit item' : '<i class="fa-regular fa-plus"></i> add new menu item' ?>
      </h2>
      <form method="POST" class="form-grid">
        <?php if ($editItem): ?>
          <input type="hidden" name="action" value="update">
          <input type="hidden" name="id" value="<?= $editItem['id'] ?>">
        <?php else: ?>
          <input type="hidden" name="action" value="add">
        <?php endif; ?>

        <div class="form-group">
          <label>item name *</label>
          <input type="text" name="name" class="form-control" required value="<?= htmlspecialchars($editItem['name'] ?? '') ?>">
        </div>
        <div class="form-group">
          <label>description</label>
          <input type="text" name="description" class="form-control" value="<?= htmlspecialchars($editItem['description'] ?? '') ?>">
        </div>
        <div class="form-group">
          <label>price ($) *</label>
          <input type="number" step="0.01" name="price" class="form-control" required value="<?= $editItem['price'] ?? '' ?>">
        </div>
        <div class="form-group">
          <label>category</label>
          <select name="category" class="form-control">
            <option value="">— select —</option>
            <?php foreach ($categories as $cat): ?>
              <option value="<?= $cat ?>" <?= (isset($editItem) && $editItem['category']==$cat) ? 'selected' : '' ?>><?= ucfirst($cat) ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="form-group">
          <label>organic shape (style)</label>
          <select name="organic_shape" class="form-control">
            <option value="default" <?= (isset($editItem) && $editItem['organic_shape']=='default') ? 'selected' : '' ?>>default blob</option>
            <option value="wavy" <?= (isset($editItem) && $editItem['organic_shape']=='wavy') ? 'selected' : '' ?>>wavy</option>
            <option value="coral" <?= (isset($editItem) && $editItem['organic_shape']=='coral') ? 'selected' : '' ?>>coral edge</option>
          </select>
        </div>
        <div style="display: flex; align-items: end;">
          <button type="submit" class="btn <?= $editItem ? 'btn-purple' : '' ?>">
            <?= $editItem ? '<i class="fa-regular fa-floppy-disk"></i> update' : '<i class="fa-regular fa-plus"></i> create' ?>
          </button>
          <?php if ($editItem): ?>
            <a href="admin_dashboard.php" style="margin-left:1rem; color:var(--cobalt-deep);">cancel</a>
          <?php endif; ?>
        </div>
      </form>
    </div>

    <!-- MENU ITEMS TABLE (CRUD read) -->
    <div class="table-wrapper">
      <h3 style="font-family:'Fraunces'; margin-bottom:1rem; color:var(--royal-purple);"><i class="fa-regular fa-list"></i> current menu</h3>
      <table>
        <thead>
          <tr><th>ID</th><th>name</th><th>description</th><th>price</th><th>category</th><th>shape</th><th>actions</th></tr>
        </thead>
        <tbody>
          <?php foreach ($items as $item): ?>
          <tr>
            <td><?= $item['id'] ?></td>
            <td><strong><?= htmlspecialchars($item['name']) ?></strong></td>
            <td><?= htmlspecialchars($item['description']) ?></td>
            <td>$<?= number_format($item['price'], 2) ?></td>
            <td><span class="cat-chip"><?= htmlspecialchars($item['category'] ?: '—') ?></span></td>
            <td><?= htmlspecialchars($item['organic_shape'] ?: 'default') ?></td>
            <td class="action-icons">
              <a href="?edit=<?= $item['id'] ?>"><i class="fa-regular fa-pen-to-square" title="edit"></i></a>
              <a href="?delete=<?= $item['id'] ?>" onclick="return confirm('Delete this item?')"><i class="fa-regular fa-trash-can" style="color:#b00020;"></i></a>
            </td>
          </tr>
          <?php endforeach; ?>
          <?php if (empty($items)): ?>
          <tr><td colspan="7" style="text-align:center; padding:2rem;">🌊 menu empty — add some cobalt & purple items</td></tr>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </main>

  <!-- footer with Jcommerce signature (pretty) -->
  <footer class="footer">
    <div style="max-width:1300px; margin:0 auto;">
      <div class="signature">
        <span><i class="fa-regular fa-pen-fancy"></i> developed by <strong>JCommerce & Tech</strong> · admin dashboard</span>
      </div>
      <div style="margin-top:1rem; opacity:0.5; font-size:0.85rem;">
        <i class="fa-solid fa-water"></i> cobalt · royal purple · underwater admin
      </div>
    </div>
  </footer>
</body>
</html>