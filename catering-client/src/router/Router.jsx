import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import Menu from "../pages/menuPage/Menu";
import Signup from "../components/Signup";
import Order from "../pages/dashboard/Order";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import UserProfile from "../pages/dashboard/UserProfile";
import CartPage from "../pages/menuPage/CartPage";
import Login from "../components/Login";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/dashboard/admin/Dashboard";
import Users from "../pages/dashboard/admin/Users";
import AddMenu from "../pages/dashboard/admin/AddMenu";
import ManageItems from "../pages/dashboard/admin/ManageItems";
import UpdateMenu from "../pages/dashboard/admin/UpdateMenu";
import Payment from "../pages/menuPage/Payment";
import EventRental from "../pages/servicePage/EventRental";
import AddRental from "../pages/dashboard/admin/AddRental";
import ManageRentals from "../pages/dashboard/admin/ManageRentals";
import UpdateRental from "../pages/dashboard/admin/UpdateRental";
import ProductDetails from "../pages/productPage/ProductDetails";
import RentalDetails from "../pages/productPage/RentalDetails";
import AddVoucher from "../pages/dashboard/admin/AddVoucher";
import ManageVouchers from "../pages/dashboard/admin/ManageVouchers";
import UpdateVoucher from "../pages/dashboard/admin/UpdateVoucher";
import OnlineBooking from "../pages/bookPage/OnlineBooking"
import AddPackage from "../pages/dashboard/admin/AddPackage";
import Venue from "../pages/venuePage/Venue";
import AddVenue from "../pages/dashboard/admin/AddVenue";
import UpdateVenue from "../pages/dashboard/admin/UpdateVenue";
import ManageVenues from "../pages/dashboard/admin/ManageVenues";
import ManageBookings from "../pages/dashboard/admin/ManageBookings";
import VenueDetails from "../pages/venuePage/VenueDetails";
import OrderConfirmed from "../pages/dashboard/admin/OrderConfirmed";
const router = createBrowserRouter([
    {
      path: "/",
      element: <Main/>,
      children: [
        {
            path: "/",
            element: <Home/>
        },
        {
          path: "/menu",
          element: <Menu/>
        },
        {
          path: "/order",
          element:<Order/>
        },
        {
          path: "/update-profile",
          element: <UserProfile/>
        },
        {
          path: "/cart-page",
          element: <CartPage/>
        },
        {
          path: "/process-checkout",
          element: <Payment/>
        },
        {
          path: "/rental",
          element: <EventRental/>
        },
        {
          path: "products/:id",
          element: <ProductDetails/>,
        },
        {
          path: "rentaldetails/:id",
          element: <RentalDetails/>,
        },
        {
          path: "venuedetails/:id",
          element: <VenueDetails/>,
        },


        {
          path: "/book",
          element: <OnlineBooking/>
        },
        
        {
          path: "/venue",
          element: <Venue/>
        },
  

      ] 
    },
     {
      path: "/signup",
      element: <Signup/>
    },
    
    {
      path: "/login",
      element: <Login/>
    },
    // admin routes
    {
      path: 'dashboard',
      element: <PrivateRoute><DashboardLayout/></PrivateRoute>,
      children: [
        {
          path: '',
          element: <Dashboard/>
        },
        {
          path: 'users', 
          element: <Users/>
        },
        {
          path: 'add-menu',
          element: <AddMenu/>
        }, 
        {
          path: 'add-rental',
          element: <AddRental/>
        },
        {
          path: 'add-venue',
          element: <AddVenue/>
        },
        {
          path: 'add-voucher',
          element: <AddVoucher/>
        },
        {
          path: 'add-package',
          element: <AddPackage/>
        }, 
        {
          path: "manage-items",
          element: <ManageItems/>
        },
        {
          path: "manage-bookings",
          element: <ManageBookings/>
        },
        {
          path: "manage-rentals",
          element: <ManageRentals/>
        },
        {
          path: "manage-venues",
          element: <ManageVenues/>
        },
        {
          path: "manage-vouchers",
          element: <ManageVouchers/>
        },
        {
          path: "manage-venues",
          element: <ManageVouchers/>
        },
        {
          path: "orderconfirmed",
          element: <OrderConfirmed/>
        },
        {
          path: "update-menu/:id",
          element: <UpdateMenu/>,
          loader: ({params}) => fetch(`http://localhost:6001/menu/${params.id}`)
        },
        {
          path: "update-rental/:id",
          element: <UpdateRental/>,
          loader: ({params}) => fetch(`http://localhost:6001/rental/${params.id}`)
        },
        {
          path: "update-venues/:id",
          element: <UpdateVenue/>,
          loader: ({params}) => fetch(`http://localhost:6001/venues/${params.id}`)
        },
        {
          path: "update-voucher/:id",
          element: <UpdateVoucher/>,
          loader: ({params}) => fetch(`http://localhost:6001/voucher/${params.id}`)
        },
      ]
    }
  ]);

  export default router;