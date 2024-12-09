import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import DashboardLayout from "../layout/DashboardLayout";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

// User Pages
import Home from "../pages/home/Home";
import Menu from "../pages/menuPage/Menu";
import OrderSummary from "../pages/dashboard/OrderSummary";
import UserProfile from "../pages/dashboard/UserProfile";
import CartPage from "../pages/menuPage/CartPage";
import Payment from "../pages/menuPage/Payment";
import EventRental from "../pages/servicePage/EventRental";
import ProductDetails from "../pages/productPage/ProductDetails";
import RentalDetails from "../pages/productPage/RentalDetails";
import VenueDetails from "../pages/venuePage/VenueDetails";
import OnlineBooking from "../pages/bookPage/OnlineBooking";
import Venue from "../pages/venuePage/Venue";
import OrderTracking from "../pages/dashboard/OrderTracking";

// Admin Pages
import Dashboard from "../pages/dashboard/admin/Dashboard";
import Users from "../pages/dashboard/admin/Manage/Users";
import AddMenu from "../pages/dashboard/admin/Add Items/AddMenu";
import AddRental from "../pages/dashboard/admin/Add Items/AddRental";
import AddVenue from "../pages/dashboard/admin/Add Items/AddVenue";
import AddVoucher from "../pages/dashboard/admin/Add Items/AddVoucher";
import AddPackage from "../pages/dashboard/admin/Add Items/AddPackage";
import ManageItems from "../pages/dashboard/admin/Manage/ManageItems";
import ManageRentals from "../pages/dashboard/admin/Manage/ManageRentals";
import ManageVenues from "../pages/dashboard/admin/Manage/ManageVenues";
import ManagePackages from "../pages/dashboard/admin/Manage/ManagePackages";
import ManageVouchers from "../pages/dashboard/admin/Manage/ManageVouchers";
import PendingBookings from "../pages/dashboard/admin/Manage Bookings/PendingBookings";
import ConfirmBookings from "../pages/dashboard/admin/Manage Bookings/ConfirmBookings";
import CompletedBookings from "../pages/dashboard/admin/Manage Bookings/CompletedBookings";
import CancelledBookings from "../pages/dashboard/admin/Manage Bookings/CancelledBookings";
import PendingOrders from "../pages/dashboard/admin/Manage Orders/PendingOrders";
import ConfirmOrders from "../pages/dashboard/admin/Manage Orders/ConfirmOrders";
import CompletedOrders from "../pages/dashboard/admin/Manage Orders/CompletedOrders";
import CancelledOrders from "../pages/dashboard/admin/Manage Orders/CancelledOrders";
import UpdateMenu from "../pages/dashboard/admin/UpdateMenu";
import UpdateRental from "../pages/dashboard/admin/UpdateRental";
import UpdateVenue from "../pages/dashboard/admin/UpdateVenue";
import UpdateVoucher from "../pages/dashboard/admin/UpdateVoucher";
import SalesReport from "../pages/dashboard/admin/SalesReport";
// Auth Pages
import Signup from "../components/Signup";
import Login from "../components/Login";
import Inbox from "../pages/dashboard/admin/Inbox";
import PrivacyPolicy from "../pages/privacy/PrivacyPolicy";
import DataDeletion from "../pages/privacy/DataDeletion";
import ManageContracts from "../pages/dashboard/admin/Manage/ManageContracts";

// Backend Base URL
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// User Routes
const userRoutes = [
  { path: "/", element: <Home /> },
  { path: "/menu", element: <Menu /> },
  { path: "/order/:transactionId", element: <OrderSummary/> },
  { path: "/order-tracking/:transactionId", element: <OrderTracking /> },
  { path: "/update-profile", element: <UserProfile /> },
  { path: "/cart-page", element: <CartPage /> },
  { path: "/process-checkout", element: <Payment /> },
  { path: "/rental", element: <EventRental /> },
  { path: "/products/:id", element: <ProductDetails /> },
  { path: "/rentaldetails/:id", element: <RentalDetails /> },
  { path: "/venuedetails/:id", element: <VenueDetails /> },
  { path: "/book", element: <OnlineBooking /> },
  { path: "/venue", element: <Venue /> },
  { path: "/privacy-policy", element: <PrivacyPolicy/> },
  { path: "/data-deletion", element: <DataDeletion/> },
];

// Admin Routes
const adminRoutes = [
  { path: "", element: <Dashboard /> },
  { path: "users", element: <Users /> },
  { path: "add-menu", element: <AddMenu /> },
  { path: "add-rental", element: <AddRental /> },
  { path: "add-venue", element: <AddVenue /> },
  { path: "add-voucher", element: <AddVoucher /> },
  { path: "add-package", element: <AddPackage /> },
  { path: "manage-items", element: <ManageItems /> },
  { path: "manage-rentals", element: <ManageRentals /> },
  { path: "manage-venues", element: <ManageVenues /> },
  { path: "manage-packages", element: <ManagePackages /> },
  { path: "manage-contracts", element: <ManageContracts /> },
  { path: "manage-vouchers", element: <ManageVouchers /> },
  { path: "pending-bookings", element: <PendingBookings /> },
  { path: "confirm-bookings", element: <ConfirmBookings /> },
  { path: "completed-bookings", element: <CompletedBookings /> },
  { path: "cancelled-bookings", element: <CancelledBookings /> },
  { path: "pending-orders", element: <PendingOrders/> },
  { path: "confirm-orders", element: <ConfirmOrders /> },
  { path: "completed-orders", element: <CompletedOrders /> },
  { path: "cancelled-orders", element: <CancelledOrders/> },
  { path: "salesreport", element: <SalesReport/> },
  { path: "inbox", element: <Inbox/> },
  {
    path: "update-menu/:id",
    element: <UpdateMenu />,
    loader: ({ params }) => fetch(`${BASE_URL}/menu/${params.id}`),
  },
  {
    path: "update-rental/:id",
    element: <UpdateRental />,
    loader: ({ params }) => fetch(`${BASE_URL}/rental/${params.id}`),
  },
  {
    path: "update-venues/:id",
    element: <UpdateVenue />,
    loader: ({ params }) => fetch(`${BASE_URL}/venues/${params.id}`),
  },

  {
    path: "update-voucher/:id",
    element: <UpdateVoucher />,
    loader: ({ params }) => fetch(`${BASE_URL}/voucher/${params.id}`),
  },
];

// Combine Routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: userRoutes,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: adminRoutes,
  },
]);

export default router;
