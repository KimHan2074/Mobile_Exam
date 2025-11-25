import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const getDb = (): SQLite.SQLiteDatabase => {
  if (!db) {
    db = SQLite.openDatabaseSync('myDatabase.db');
  }
  return db;
};

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  img: string;
  categoryId: number;
};

export type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};

export type UserProfile = {
  userId: number;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
};

export type CartItemWithProduct = {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  name: string;
  price: number;
  img: string;
};

export type Order = {
  id: number;
  userId: number;
  totalAmount: number;
  createdAt: string;
  status: string;
  shippingName?: string | null;
  shippingPhone?: string | null;
  shippingAddress?: string | null;
};

export type OrderWithItems = Order & {
  items: Array<{
    id: number;
    productId: number;
    quantity: number;
    price: number;
    name: string;
    img: string;
  }>;
};

const initialCategories: Category[] = [
  { id: 1, name: 'Áo' },
  { id: 2, name: 'Giày' },
  { id: 3, name: 'Balo' },
  { id: 4, name: 'Mũ' },
  { id: 5, name: 'Túi' },
];

const initialProducts: Product[] = [
  { id: 1, name: 'Áo thun Doreamon', price: 250000, img: 'aothun.jpg', categoryId: 1 },
  { id: 2, name: 'Giày sneaker', price: 1100000, img: 'shoesDRM.jpg', categoryId: 2 },
  { id: 3, name: 'Balo thời trang', price: 490000, img: 'balo.jpg', categoryId: 3 },
  { id: 4, name: 'Mũ bảo hiểm thời trang', price: 120000, img: 'hat.jpg', categoryId: 4 },
  { id: 5, name: 'Túi đeo chéo dễ thương', price: 980000, img: 'tui.jpg', categoryId: 5 },
];

// // ====================== KHỞI TẠO DATABASE ======================
// export const initDatabase = async (onSuccess?: () => void): Promise<void> => {
//   try {
//     const db = getDb();

//     await db.execAsync(`
//       CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, name TEXT);
//       CREATE TABLE IF NOT EXISTS products (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT,
//         price REAL,
//         img TEXT,
//         categoryId INTEGER,
//         FOREIGN KEY (categoryId) REFERENCES categories(id)
//       );
//       CREATE TABLE IF NOT EXISTS users (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         username TEXT UNIQUE,
//         password TEXT,
//         role TEXT
//       );
//     `);

//     // Thêm dữ liệu mẫu
//     for (const c of initialCategories) {
//       await db.runAsync('INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)', [c.id, c.name]);
//     }

//     for (const p of initialProducts) {
//       await db.runAsync(
//         'INSERT OR IGNORE INTO products (id, name, price, img, categoryId) VALUES (?, ?, ?, ?, ?)',
//         [p.id, p.name, p.price, p.img, p.categoryId]
//       );
//     }

//     await db.runAsync(
//       `INSERT INTO users (username, password, role)
//        SELECT 'admin', '123456', 'admin'
//        WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')`
//     );

//     console.log(' Database initialized');
//     if (onSuccess) onSuccess();
//   } catch (error) {
//     console.error(' initDatabase error:', error);
//   }
// };

// ====================== KHỞI TẠO DATABASE ======================
export const initDatabase = async (onSuccess?: () => void): Promise<void> => {
  try {
    const db = getDb();

    // Tạo bảng categories, products, users
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY,
        name TEXT
      );

      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        img TEXT,
        categoryId INTEGER,
        FOREIGN KEY (categoryId) REFERENCES categories(id)
      );

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
      );

      CREATE TABLE IF NOT EXISTS user_profiles (
        userId INTEGER PRIMARY KEY,
        fullName TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        FOREIGN KEY (userId) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        productId INTEGER,
        quantity INTEGER,
        UNIQUE(userId, productId),
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (productId) REFERENCES products(id)
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        totalAmount REAL,
        createdAt TEXT,
        status TEXT,
        shippingName TEXT,
        shippingPhone TEXT,
        shippingAddress TEXT,
        FOREIGN KEY (userId) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER,
        productId INTEGER,
        quantity INTEGER,
        price REAL,
        FOREIGN KEY (orderId) REFERENCES orders(id),
        FOREIGN KEY (productId) REFERENCES products(id)
      );
    `);

    console.log("✅ Tables created (categories, products, users)");

    // Thêm categories mẫu
    for (const c of initialCategories) {
      await db.runAsync(
        "INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)",
        [c.id, c.name]
      );
    }

    // Thêm products mẫu
    for (const p of initialProducts) {
      await db.runAsync(
        "INSERT OR IGNORE INTO products (id, name, price, img, categoryId) VALUES (?, ?, ?, ?, ?)",
        [p.id, p.name, p.price, p.img, p.categoryId]
      );
    }

    // Thêm user admin nếu chưa có
    await db.runAsync(
      `INSERT INTO users (username, password, role)
       SELECT 'admin', '123456', 'admin'
       WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')`
    );

    console.log("✅ Admin user created");

    console.log("✅ Database initialized");

    if (onSuccess) onSuccess(); // Gọi loadData() trong useEffect()

  } catch (error) {
    console.error("❌ initDatabase error:", error);
  }
};

// CRUD USERS
// ======================= CRUD USERS =======================

// ➕ Thêm người dùng
export const addUser = async (username: string, password: string, role: string): Promise<boolean> => {
  try {
    const db = getDb();
    await db.runAsync(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, password, role]
    );
    console.log('✅ User added');
    return true;
  } catch (error) {
    console.error('❌ Error adding user:', error);
    return false;
  }
};


// ✏️ Cập nhật người dùng
export const updateUser = async (user: User): Promise<boolean> => {
  try {
    const db = getDb();
    await db.runAsync(
      'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?',
      [user.username, user.password, user.role, user.id]
    );
    console.log('✅ User updated');
    return true;
  } catch (error) {
    console.error('❌ Error updating user:', error);
    return false;
  }
};

// ❌ Xóa người dùng theo ID
export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const db = getDb();
    await db.runAsync('DELETE FROM users WHERE id = ?', [id]);
    console.log('✅ User deleted');
    return true;
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    return false;
  }
};


// 📌 Lấy danh sách tất cả người dùng
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const db = getDb();
    const rows = await db.getAllAsync('SELECT * FROM users');
    return rows as User[];
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return [];
  }
};

// 🔐 Lấy người dùng theo username + password (đăng nhập)
export const getUserByCredentials = async (
  username: string,
  password: string
): Promise<User | null> => {
  try {
    const db = getDb();
    const row = await db.getFirstAsync(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    return (row as User) ?? null;
  } catch (error) {
    console.error('❌ Error getting user by credentials:', error);
    return null;
  }
};

// 🔎 Lấy người dùng theo ID
export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const db = getDb();
    const row = await db.getFirstAsync('SELECT * FROM users WHERE id = ?', [id]);
    return (row as User) ?? null;
  } catch (error) {
    console.error('❌ Error getting user by id:', error);
    return null;
  }
};

// ====================== CATEGORY ======================
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const db = getDb();
    const rows = await db.getAllAsync('SELECT * FROM categories');
    return rows as Category[];
  } catch (error) {
    console.error(' Error fetching categories:', error);
    return [];
  }
};

export const addCategory = async (name: string): Promise<boolean> => {
  try {
    const db = getDb();
    await db.runAsync('INSERT INTO categories (name) VALUES (?)', [name]);
    console.log('✅ Category added');
    return true;
  } catch (error) {
    console.error('❌ Error adding category:', error);
    return false;
  }
};

export const updateCategoryById = async (
  id: number,
  name: string,
): Promise<boolean> => {
  try {
    const db = getDb();
    await db.runAsync('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    console.log('✅ Category updated');
    return true;
  } catch (error) {
    console.error('❌ Error updating category:', error);
    return false;
  }
};

export const deleteCategoryById = async (id: number): Promise<boolean> => {
  try {
    const db = getDb();
    await db.runAsync('DELETE FROM products WHERE categoryId = ?', [id]);
    await db.runAsync('DELETE FROM categories WHERE id = ?', [id]);
    console.log('✅ Category deleted');
    return true;
  } catch (error) {
    console.error('❌ Error deleting category:', error);
    return false;
  }
};

// ====================== PRODUCT ======================
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const db = getDb();
    const rows = await db.getAllAsync('SELECT * FROM products');
    return rows as Product[];
  } catch (error) {
    console.error(' Error fetching products:', error);
    return [];
  }
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const db = getDb();
    await db.runAsync(
      'INSERT INTO products (name, price, img, categoryId) VALUES (?, ?, ?, ?)',
      [product.name, product.price, product.img, product.categoryId]
    );
    console.log(' Product added');
  } catch (error) {
    console.error(' Error adding product:', error);
  }
};

export const updateProduct = async (product: Product) => {
  try {
    const db = getDb();
    await db.runAsync(
      'UPDATE products SET name = ?, price = ?, img = ?, categoryId = ? WHERE id = ?',
      [product.name, product.price, product.img, product.categoryId, product.id]
    );
    console.log(' Product updated');
  } catch (error) {
    console.error(' Error updating product:', error);
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const db = getDb();
    await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
    console.log(' Product deleted');
  } catch (error) {
    console.error(' Error deleting product:', error);
  }
};

// ====================== SEARCH ======================
export const searchProductsByNameOrCategory = async (keyword: string): Promise<Product[]> => {
  try {
    const db = getDb();
    const rows = await db.getAllAsync(
      `SELECT products.* FROM products
       JOIN categories ON products.categoryId = categories.id
       WHERE products.name LIKE ? OR categories.name LIKE ?`,
      [`%${keyword}%`, `%${keyword}%`]
    );
    return rows as Product[];
  } catch (error) {
    console.error(' Error searching products:', error);
    return [];
  }
};

// ====================== CART ======================
export const addToCart = async (
  userId: number,
  productId: number,
  quantity: number = 1,
): Promise<void> => {
  const db = getDb();
  const existing = await db.getFirstAsync<{ id: number; quantity: number }>(
    'SELECT id, quantity FROM cart_items WHERE userId = ? AND productId = ?',
    [userId, productId],
  );
  if (existing) {
    await db.runAsync(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [existing.quantity + quantity, existing.id],
    );
  } else {
    await db.runAsync(
      'INSERT INTO cart_items (userId, productId, quantity) VALUES (?, ?, ?)',
      [userId, productId, quantity],
    );
  }
};

export const updateCartItemQuantity = async (
  userId: number,
  productId: number,
  quantity: number,
): Promise<void> => {
  const db = getDb();
  if (quantity <= 0) {
    await db.runAsync('DELETE FROM cart_items WHERE userId = ? AND productId = ?', [
      userId,
      productId,
    ]);
    return;
  }
  await db.runAsync(
    'UPDATE cart_items SET quantity = ? WHERE userId = ? AND productId = ?',
    [quantity, userId, productId],
  );
};

export const removeCartItem = async (userId: number, productId: number): Promise<void> => {
  const db = getDb();
  await db.runAsync('DELETE FROM cart_items WHERE userId = ? AND productId = ?', [
    userId,
    productId,
  ]);
};

export const clearCart = async (userId: number): Promise<void> => {
  const db = getDb();
  await db.runAsync('DELETE FROM cart_items WHERE userId = ?', [userId]);
};

export const fetchCartItems = async (userId: number): Promise<CartItemWithProduct[]> => {
  const db = getDb();
  const rows = await db.getAllAsync(
    `SELECT ci.id,
            ci.userId,
            ci.productId,
            ci.quantity,
            p.name,
            p.price,
            p.img
     FROM cart_items ci
     JOIN products p ON p.id = ci.productId
     WHERE ci.userId = ?`,
    [userId],
  );
  return rows as CartItemWithProduct[];
};

// ====================== ORDERS ======================
export const createOrderFromCart = async (
  userId: number,
  shippingName?: string,
  shippingPhone?: string,
  shippingAddress?: string,
): Promise<number> => {
  const db = getDb();
  const cartItems = await fetchCartItems(userId);
  if (!cartItems.length) {
    throw new Error('Cart is empty');
  }
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const createdAt = new Date().toISOString();
  const status = 'pending';

  const orderResult = await db.runAsync(
    `INSERT INTO orders (userId, totalAmount, createdAt, status, shippingName, shippingPhone, shippingAddress)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      totalAmount,
      createdAt,
      status,
      shippingName ?? null,
      shippingPhone ?? null,
      shippingAddress ?? null,
    ],
  );
  const orderId = orderResult.lastInsertRowId as number;

  for (const item of cartItems) {
    await db.runAsync(
      `INSERT INTO order_items (orderId, productId, quantity, price)
       VALUES (?, ?, ?, ?)`,
      [orderId, item.productId, item.quantity, item.price],
    );
  }

  await clearCart(userId);
  return orderId;
};

export const fetchOrdersByUser = async (userId: number): Promise<OrderWithItems[]> => {
  const db = getDb();
  const orders = (await db.getAllAsync(
    `SELECT * FROM orders WHERE userId = ? ORDER BY datetime(createdAt) DESC`,
    [userId],
  )) as Order[];

  const result: OrderWithItems[] = [];
  for (const order of orders) {
    const items = await db.getAllAsync<{
      id: number;
      productId: number;
      quantity: number;
      price: number;
      name: string;
      img: string;
    }>(
      `SELECT oi.id,
              oi.productId,
              oi.quantity,
              oi.price,
              p.name,
              p.img
       FROM order_items oi
       JOIN products p ON p.id = oi.productId
       WHERE oi.orderId = ?`,
      [order.id],
    );
    result.push({
      ...order,
      items,
    });
  }
  return result;
};

// ====================== USER PROFILE ======================
export const getUserProfile = async (userId: number): Promise<UserProfile | null> => {
  const db = getDb();
  const row = await db.getFirstAsync('SELECT * FROM user_profiles WHERE userId = ?', [
    userId,
  ]);
  return (row as UserProfile) ?? null;
};

export const upsertUserProfile = async (profile: UserProfile): Promise<void> => {
  const db = getDb();
  await db.runAsync(
    `INSERT INTO user_profiles (userId, fullName, email, phone, address)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(userId) DO UPDATE SET
       fullName=excluded.fullName,
       email=excluded.email,
       phone=excluded.phone,
       address=excluded.address`,
    [
      profile.userId,
      profile.fullName ?? null,
      profile.email ?? null,
      profile.phone ?? null,
      profile.address ?? null,
    ],
  );
};

// ====================== FETCH PRODUCTS BY CATEGORY ======================
export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  try {
    const db = getDb();
    const rows = await db.getAllAsync(
      'SELECT * FROM products WHERE categoryId = ?',
      [categoryId]
    );
    return rows as Product[];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};
