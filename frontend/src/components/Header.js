import React, { useState } from 'react'
import Logo from './Logo'
import { IoSearch } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify'
import { setUserDetails } from '../store/userSlice'
import ROLE from '../common/role';

const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()

  const [menuDisplay, setMenuDisplay] = useState(false)


  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: 'include'
    })

    const data = await fetchData.json()

    if (data.success) {
      toast.success(data.message)
      dispatch(setUserDetails(null))
    } else if (data.error) {
      toast.error(data.message)
    }

  }

  return (
    <header className='h-16 shadow-md bg-white'>

      <div className='h-full container mx-auto flex items-center px-4 justify-between'>
        <div className=''>
          <Link to={"/"}>
            <Logo w={90} h={60} />
          </Link>
        </div>

        <div className='hidden lg:flex items-center w-full justify-between 
        max-w-sm border rounded-full focus-within:shadow-md pl-2'>
          <input type='text' placeholder='Search product...'
            className='w-full outline-none pl-2' />
          <div className='text-lg min-w-[50px] h-8 bg-red-600 flex 
          items-center justify-center rounded-r-full text-white'>
            <IoSearch />
          </div>
        </div>

        <div className='flex items-center gap-7'>

          <div className='relative flex justify-center'>
            {
              user?._id && (
                <div className='text-3xl cursor-pointer'
                  onClick={() => setMenuDisplay(prev => !prev)}>
                  {
                    user?.profilePic ? (
                      <img src={user?.profilePic} className='w-10 h-10 rounded-full' />
                    ) : (<FaRegCircleUser />)
                  }
                </div>
              )
            }


            {
              menuDisplay && (
                <div className='absolute bg-white bottom-0 top-11 h-fit p-2 
                shadow-lg rounded'>
                  <nav>
                    {
                      user?.role === ROLE.ADMIN && (
                        <Link to={"/admin_panel/all-products"}
                          className='whitespace-nowrap md:block hidden p-2 hover:bg-slate-100'
                          onClick={() => setMenuDisplay(prev => !prev)}>
                          Admin Panel
                        </Link>
                      )
                    }

                  </nav>
                </div>
              )
            }
          </div>

          <div className='text-3xl relative'>
            <span><IoCartOutline /></span>
            <div className='bg-red-600 text-white w-5 h-5 p-1 
            flex items-center justify-center rounded-full absolute -top-1 -right-3'>
              <p className='text-sm'>0</p>
            </div>
          </div>

          <div>
            {
              user?._id ? (
                <button className='px-3 py-1 rounded-full text-white bg-red-500 hover:bg-red-700'
                  onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <Link to={"/login"} className='px-3 py-1 rounded-full text-white bg-red-500 hover:bg-red-700'>
                  Login
                </Link>
              )
            }

          </div>

        </div>
      </div>

    </header>
  )
}

export default Header