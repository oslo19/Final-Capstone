import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import DashboardLayout from "../layout/DashboardLayout";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

// User Pages
import Home from "../pages/home/Home";
import Menu from "../pages/menuPage/Menu";
import Order from "../pages/dashboard/OrderSummary";
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
import Users from "../pages/dashboard/admin/Users";
import AddMenu from "../pages/dashboard/admin/AddMenu";
import AddRental from "../pages/dashboard/admin/AddRental";
import AddVenue from "../pages/dashboard/admin/AddVenue";
import AddVoucher from "../pages/dashboard/admin/AddVoucher";
import AddPackage from "../pages/dashboard/admin/AddPackage";
import ManageItems from "../pages/dashboard/admin/ManageItems";
import ManageRentals from "../pages/dashboard/admin/ManageRentals";
import ManageVenues from "../pages/dashboard/admin/ManageVenues";
import ManageVouchers from "../pages/dashboard/admin/ManageVouchers";
import PendingBookings from "../pages/dashboard/admin/PendingBookings";
import ConfirmBookings from "../pages/dashboard/admin/ConfirmBookings";
import CompletedBookings from "../pages/dashboard/admin/CompletedBookings";
import CancelledBookings from "../pages/dashboard/admin/CancelledBookings";
import UpdateMenu from "../pages/dashboard/admin/UpdateMenu";
import UpdateRental from "../pages/dashboard/admin/UpdateRental";
import UpdateVenue from "../pages/dashboard/admin/UpdateVenue";
import UpdateVoucher from "../pages/dashboard/admin/UpdateVoucher";

// Auth Pages
import Signup from "../components/Signup";
import Login from "../components/Login";

// Backend Base URL
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// User Routes
const userRoutes = [
  { path: "/", element: <Home /> },
  { path: "/menu", element: <Menu /> },
  { path: "/order", element: <Order /> },
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
  { path: "manage-vouchers", element: <ManageVouchers /> },
  { path: "pending-bookings", element: <PendingBookings /> },
  { path: "confirm-bookings", element: <ConfirmBookings /> },
  { path: "completed-bookings", element: <CompletedBookings /> },
  { path: "cancelled-bookings", element: <CancelledBookings /> },
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
