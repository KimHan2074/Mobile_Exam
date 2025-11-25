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
