import React from 'react'
import useAuth from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';


const Order = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('access-token')



  const { refetch, data: orders = [] } = useQuery({
      queryKey: ['orders', user?.email],
      queryFn: async () => {
          const res = await fetch(`http://localhost:6001/orders?email=${user?.email}`, {
              headers: {
                  authorization: `Bearer ${token}`
              }
          })
          return res.json();
      },
  })

  

 console.log(orders)  
    const formatDate = (createdAt) => {
      const createdAtDate = new Date(createdAt)
      return createdAtDate.toLocaleDateString()
    }
  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className="">
        <div className="py-28 flex flex-col items-center justify-center">
          {/* content */}
          <div className=" text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug text-white">
              Tracking All Your<span className="text-prime"> Order</span> 
            </h2>
          </div>
        </div>
      </div>
      {/*table */}
      
      {
        (orders.length > 0) ? <div>
        <div className="bg-white">
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead className="bg-prime text-white rounded-sm">
                <tr>
                  <th>#</th>
                  <th>Order Date</th>
                  <th>Transaction Id</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="font-medium">{item.transactionId}</td>
                    <td>
                           ₱{item.price}
                    </td>
                    <td>{item.status}</td>
                    <td>
                      <Link to='/contact'
                        className="btn btn-sm border-none text-prime bg-transparent"
                      
                      >
                        Contact
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* foot */}
            </table>
          </div>
        </div>
        <hr />
      </div> : <div className="text-center mt-20">
        <p>Cart is empty. Please add products.</p>
        <Link to="/menu"><button className="btn bg-prime text-white mt-3">Back to Menu</button></Link>
      </div>
      }
      
    </div>
  )
}

export default Order