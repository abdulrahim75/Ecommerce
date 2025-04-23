import React from 'react'
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const Topbar = () => {
  return <div className="bg-green-50 text-black">
    {/* return <div className="bg-ecom-red text-white"> */}
    <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <div className='hidden md:flex  items-center space-x-4'>
            <a href="https://business.facebook.com/business/loginpage/?next=https%3A%2F%2Fbusiness.facebook.com%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_mbs&login_options%5B0%5D=FB&login_options%5B1%5D=IG&login_options%5B2%5D=SSO&config_ref=biz_login_tool_flavor_mbs" className='hover:text-gray-300'>
                <TbBrandMeta className="h-5 w-5"/>
                
            </a>
            <a href="https://www.instagram.com/rahxm7/" className='hover:text-gray-300'>
                <IoLogoInstagram className="h-5 w-5"/>
            </a>
            <a href="https://x.com/rahimux7" className='hover:text-gray-300'>
                <RiTwitterXLine className="h-4 w-4"/>
            </a>
        </div>
        <div className="text-sm text-center flex-grow">
            <span>We ship worldwide - Fast and Reliable shipping!</span>
        </div>
        <div className="text-sm md:block">
            <a href="tel:+917337484843" className="hover:text-gray-300">+91 7337484843</a>
        </div>
    </div>
  </div>
};

export default Topbar;
