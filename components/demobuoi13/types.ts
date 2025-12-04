// .ts (TypeScript file) → Chỉ chứa code TypeScript, không có JSX (JSX là cú pháp dùng trong React để viết UI).
// => Mục đích của file này là để lưu trữ các kiểu dữ liệu (type, interface) dùng chung giữa các màn hình.
// .tsx (TypeScript with JSX) → Chứa cả code TypeScript và JSX (ví dụ: <View><Text>Hello</Text></View>).
import { ImageSourcePropType } from 'react-native';

//interface trước khi tạo CAtegory
export interface Product1 {
  id: string;
  name: string;
  price: string;
  image: ImageSourcePropType;
}

//interface khi tạo Category
export interface Product {
    id: number;  
    name: string;
    price: number; 
    img: string;
    categoryId: number;
  }
// HomeStackParamList: Là kiểu (type) bạn định nghĩa để mô tả danh sách các màn hình (routes) và các tham số tương ứng của chúng trong navigator
export type HomeStackParamList = {
    Home: undefined;
    Details: { product: Product };  //tham số nhận vào là product
    ProductsByCategory: { categoryId: number; categoryName?: string };
    Cart: undefined;
    Checkout: undefined;
    OrderHistory: undefined;
    Profile: undefined;
  };

export type AdminStackParamList = {
    AdminDashboard: undefined;
    UserManagement: undefined;
    CategoryManagement: undefined;
    ProductManagement: undefined;
    OrderManagement: undefined;
  };
