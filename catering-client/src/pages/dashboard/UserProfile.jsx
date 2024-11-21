import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthProvider';
import { useForm } from 'react-hook-form';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const { updateUserProfile } = useContext(AuthContext);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');


  useEffect(() => {
    if (user && user.displayName) {
      const names = user.displayName.split(' ');
      const first = names.slice(0, 2).join(' ');
      const last = names[names.length - 1];
      setFirstName(first || '');
      setLastName(last || '');
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const fullName = `${data.firstName} ${data.lastName}`;
    const photoURL = data.photoURL;

    updateUserProfile(fullName, photoURL)
      .then(() => {
        alert('Profile updated successfully');
      })
      .catch((error) => {
        console.error('Error updating profile: ', error);
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-lg bg-white p-8 shadow-md rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* My Profile Section */}
          <h2 className="text-2xl font-bold mb-4">My profile</h2>

          {/* First Name */}
          <div className="bg-white p-2 rounded-lg">
            <div className="relative bg-inherit">
              <input
                type="text"
                id="firstName"
                className="peer bg-transparent h-10 w-full rounded-lg text-gray-400 placeholder-transparent ring-2 px-2 ring-gray-400 focus:ring-black focus:outline-none focus:border-black text-xs"
                value={firstName}
                {...register('firstName', { required: true })}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Type inside me"
              />
              <label
                htmlFor="firstName"
                className="absolute start-2 cursor-text left-0 -top-3 text-xs text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-black peer-focus:text-xs transition-all font-bold"
              >
                First name
              </label>
              {errors.firstName && <p className="text-red-500 text-sm">First name is required</p>}
            </div>
          </div>

          {/* Last Name */}
          <div className="bg-white p-2 rounded-lg">
            <div className="relative bg-inherit">
              <input
                type="text"
                id="lastName"
                className="peer bg-transparent start-2 h-10 w-full rounded-lg text-gray-400 placeholder-transparent ring-2 px-2 ring-gray-400 focus:ring-black focus:outline-none focus:border-black text-xs"
                value={lastName}
                {...register('lastName', { required: true })}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Type inside me"
              />
              <label
                htmlFor="lastName"
                className="absolute start-2 cursor-text left-0 -top-3 text-xs text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-black peer-focus:text-xs transition-all font-bold"
              >
                Last name
              </label>

            </div>
          </div>

          {/* Mobile Number */}
          <div className="bg-white p-2 rounded-lg">
            <div className="relative bg-inherit">
              <input
                type="text"
                id="mobileNumber"
                className="peer bg-transparent h-10 w-full rounded-lg text-gray-400 placeholder-transparent ring-2 px-2 ring-gray-400 focus:ring-black focus:outline-none focus:border-black"
                placeholder="Type inside me"
                {...register('mobileNumber')}
              />
              <label
                htmlFor="mobileNumber"
                className="absolute start-2 cursor-text left-0 -top-3 text-xs text-gray-400 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-black peer-focus:text-xs transition-all font-bold"
              >
                Mobile number
              </label>
            </div>
          </div>
          {/* Save Button */}
          <div className="flex justify-start p-4 ">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-prime hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>

          <div className='divider'>

          </div>

          {/* Email */}

          <h1 className='p-4 font-bold'>Email</h1>
          <div className="bg-white p-4 rounded-lg">
            <div className="relative bg-inherit">
              <input
                value={user.email}
                type="email"
                id="email"
                className="peer start-2 bg-transparent h-10 w-full rounded-lg text-gray-400 placeholder-transparent ring-2 px-2 ring-gray-400 focus:ring-black focus:outline-none focus:border-black"
                {...register('email', { required: true })}
                placeholder="Type inside me"
              />
              <label
                htmlFor="email"
                className="absolute cursor-text left-0 -top-3 text-xs text-black bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-black peer-focus:text-xs transition-all font-bold"
              >
                Email
              </label>
            </div>

            <span className="flex bg-blue-100 text-blue-800 text-xs w-20 mt-3 font-medium me-2 px-2.5 py-0.5 rounded-full ">  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path fill="currentColor" d="m18.774 8.245-.892-.893a1.5 1.5 0 0 1-.437-1.052V5.036a2.484 2.484 0 0 0-2.48-2.48H13.7a1.5 1.5 0 0 1-1.052-.438l-.893-.892a2.484 2.484 0 0 0-3.51 0l-.893.892a1.5 1.5 0 0 1-1.052.437H5.036a2.484 2.484 0 0 0-2.48 2.481V6.3a1.5 1.5 0 0 1-.438 1.052l-.892.893a2.484 2.484 0 0 0 0 3.51l.892.893a1.5 1.5 0 0 1 .437 1.052v1.264a2.484 2.484 0 0 0 2.481 2.481H6.3a1.5 1.5 0 0 1 1.052.437l.893.892a2.484 2.484 0 0 0 3.51 0l.893-.892a1.5 1.5 0 0 1 1.052-.437h1.264a2.484 2.484 0 0 0 2.481-2.48V13.7a1.5 1.5 0 0 1 .437-1.052l.892-.893a2.484 2.484 0 0 0 0-3.51Z" />
              <path fill="#fff" d="M8 13a1 1 0 0 1-.707-.293l-2-2a1 1 0 1 1 1.414-1.414l1.42 1.42 5.318-3.545a1 1 0 0 1 1.11 1.664l-6 4A1 1 0 0 1 8 13Z" />
            </svg>Verified
            </span>

            {/* Save Button */}
            <div className="flex justify-start mt-4">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-prime hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </div>

          {/* Password */}
          <div className='divider'>

          </div>
          <h1 className='p-4 font-bold'>Password</h1>
          <div className="bg-white p-4 rounded-lg">
            <div className="relative bg-inherit">
              <input
                type="text"
                id="currentPassword"
                className="peer bg-transparent h-10 w-full rounded-lg text-gray-400 placeholder-transparent ring-2 px-2 ring-gray-400 focus:ring-black focus:outline-none focus:border-black"
                placeholder="Type inside me"
                {...register('currentPassword')}
              />
              <label
                htmlFor="currentPassword"
                className="absolute start-2 cursor-text left-0 -top-3 text-xs text-gray-400 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-black peer-focus:text-xs transition-all font-bold"
              >
                Current password
              </label>
            </div>

            <div className="relative bg-inherit mt-4">
              <input
                type="text"
                id="newPassword"
                className="peer bg-transparent h-10 w-full rounded-lg text-gray-400 placeholder-transparent ring-2 px-2 ring-gray-400 focus:ring-black focus:outline-none focus:border-black"
                placeholder="Type inside me"
                {...register('newPassword')}
              />
              <label
                htmlFor="newPassword"
                className="absolute start-2 cursor-text left-0 -top-3 text-xs text-gray-400 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-black peer-focus:text-xs transition-all font-bold"
              >
                New password
              </label>

            </div>
            {/* Save Button */}
            <div className="flex justify-start mt-4">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-prime hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </div>

          {/*connected accounts */}
          <div className='divider'>

          </div>

          <h1 className='font-bold text-lg p-4'>Connected accounts</h1>



        </form>
      </div>
    </div>
  );
};

export default UserProfile;
