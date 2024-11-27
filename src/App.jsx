import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import JewelleryShop from "./pages/JewelleryShop";

import Shop from "./pages/Shop";
import ShopDetails from "./pages/ShopDetails";
import About from "./pages/About";
import Faq from "./pages/Faq";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";

import Contact from "./pages/Contact";
import Error from "./pages/Error";
import UserProfile from "./pages/UserProfilepage/profile";



import Login from "./components/Admin/Adminlogin/Login";
import Dashboard from "./pages/Dashboard/Dashboard"
import AddCategoryPage from "./pages/Dashboard/Addcategory"
import ManageCategoryPage from "./pages/Dashboard/manageCategory"
import AddProductPage from "./pages/Dashboard/AddProducts"
import ManageProductPage from "./pages/Dashboard/Manageproducts"
import ProductCSVUploadPageoductPage from "./pages/Dashboard/AddProductCsv"
import AddCustomizedProductsPage from "./pages/Dashboard/AddCustomizedProducts"
import ManageCustomizedProductsPage from "./pages/Dashboard/ManageCustomizedProducts"
import AddUserPage from "./pages/Dashboard/AddUser"
import ManageUserPage from "./pages/Dashboard/ManageUser"
import UserTypePage from "./pages/Dashboard/UserType"
import AddColorPage from "./pages/Dashboard/AddColor"
import ViewOrdersPage from "./pages/Dashboard/ViewOrders"
import MnageOrdersPage from "./pages/Dashboard/MnageOrders"
import Orderprofile from "./pages/orderprofile"
import ViewCustumOrdersPage from "./pages/Dashboard/ViewOrder"
import CustomePage from "./pages/CustomeproductPage/CustomePage"
import PendingCustumOrdersPage from "./pages/Dashboard/PendingOrder"
import CustomeFullPage from "./pages/CustomeproductPage/CustomFullPage";
import ManageCustumOrdersPage from "./pages/Dashboard/ManageOrder"
import StatusCustumOrdersPage from "./pages/Dashboard/UploadCsvStatus"
import PendingFullOrdersPage from "./pages/Dashboard/FullPendingorder"
import ViewFullOrdersPage from "./pages/Dashboard/FullVieworder"
import ManageFullCustumOrdersPage from "./pages/Dashboard/fullManageOrder"
import StatusFullOrdersPage from "./pages/Dashboard/FullStataus"
import AddImagePage from "./pages/Dashboard/AddImages"
import ManagemagePage from "./pages/Dashboard/ManageImages"
import ChangepasswordPage from "./pages/Dashboard/Changepassword"
import CustomShop from "./pages/Customshop";
// import ProductCategoryList from "./components/shop/ProductCategoryList"
function App() {
  
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Account />} />
        <Route path="/home" element={<JewelleryShop />} />





        <Route path="/shop" element={<Shop />} />
        <Route path="/custom-shop" element={<CustomShop />} />
        
        <Route path="/products/:SKU" element={<ShopDetails />} />
        <Route path="/shop/:categoryName" element={<Shop />} />
        <Route path="/customized-products/:SKU" element={<CustomePage />} />
        <Route path="/about" element={<About />} />
 
 
        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<Account />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
     
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/my-orders" element={<Orderprofile />} />
        <Route path="/custom-full" element={< CustomeFullPage />} />

        {/* .............................................................................................................. */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* ............................................................... */}
        <Route path="/add-category" element={<AddCategoryPage />} />
        <Route path="/manage-category" element={<ManageCategoryPage />} />

        {/* .................................................................. */}
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/manage-products" element={<ManageProductPage />} />
        <Route path="/add-product-csv" element={<ProductCSVUploadPageoductPage />} />
        {/* ................................................................ */}

        <Route path="/add-custom-product" element={<AddCustomizedProductsPage />} />
        <Route path="/manage-custom-products" element={<ManageCustomizedProductsPage />} />

        {/* ................................................................ */}
        <Route path="/color" element={< AddColorPage />} />

        {/* ............................ */}
        {/* ................................................................ */}
        <Route path="/view-order" element={< ViewOrdersPage />} />
        <Route path="/manage-order" element={< MnageOrdersPage />} />
        {/* ............................ */}

        <Route path="/add-user" element={<AddUserPage />} />
        <Route path="/manage-user" element={<ManageUserPage />} />
        <Route path="/user-type" element={<UserTypePage />} />
        {/* ............................ */}

        <Route path="/custom-view-order" element={<ViewCustumOrdersPage />} />
        <Route path="/custom-pending-order" element={<PendingCustumOrdersPage />} />
        <Route path="/custom-manage-order" element={<ManageCustumOrdersPage />} />
        <Route path="/status-csv" element={<StatusCustumOrdersPage />} />

        {/* ............................ */}

        <Route path="/full-custom-pending-order" element={<PendingFullOrdersPage />} />
        <Route path="/full-custom-view-order" element={<ViewFullOrdersPage />} />
        <Route path="/full-custom-manage-order" element={<ManageFullCustumOrdersPage />} />
        <Route path="/status-full-csv" element={<StatusFullOrdersPage />} />

        {/* ............................ */}

        <Route path="/media" element={<AddImagePage />} />
        <Route path="/manage-images" element={<ManagemagePage />} />
        {/* ............................ */}

        <Route path="/password-chanage" element={<ChangepasswordPage />} />
   




      </Routes>



    </Router>
  );
}

export default App;
