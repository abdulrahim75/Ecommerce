import React, { useState } from 'react';
import { IoLogoInstagram } from 'react-icons/io';
import { RiTwitterXFill } from 'react-icons/ri';
import { TbBrandFacebook, TbBrandMeta } from 'react-icons/tb';
import { FiPhoneCall } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer = () => {

  const [email, setEmail] = useState('');
const [message, setMessage] = useState('');

const handleSubscribe = (e) => {
  e.preventDefault();

  if (email) {
    setMessage(`Thank you for subscribing, ${email}!`);
    setEmail(''); // clears input after submit
  } else {
    setMessage('Please enter a valid email.');
  }

  console.log('Subscribed email:', email);
};
    return (
        <footer className="border-t py-12">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
            <div>
              <h3 className="text-lg text-gray-800 mb-4">Newsletter</h3>
              <p className="text-gray-500 mb-4">
                Be the first to hear about new products, exclusive events, and online offers.
              </p>
              <p className="font-medium text-sm text-gray-600 mb-6">Sign up and get 10% off your first order.</p>
      
              {/* Newsletter Form */}
              <form className="flex mt-4" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                  required
                />
                 <button
                    type="submit"
                    className="px-6 py-3 bg-gray-800 text-white text-sm rounded-r-md hover:bg-gray-700 transition-all"
                  >
                  Subscribe
                </button>
              </form>
              {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
            </div>

            {/* links */}
            <div>
                <h3 className="text-lg text-gray-800 mb-4">Shop</h3>
                <ul className="space-y-2 text-gray-600">
                    <li>
                        <Link to="/collections/all?gender=Men" className="hover:text-gray-500 transition-colors">
                            Men's Top Wear
                        </Link>
                    </li>
                    <li>
                        <Link to="/collections/all?gender=Women" className="hover:text-gray-500 transition-colors">
                            Women's Top Wear
                        </Link>
                    </li>
                    <li>
                        <Link to="/collections/all?category=Top Wear" className="hover:text-gray-500 transition-colors">
                            Men's Bottom Wear
                        </Link>
                    </li>
                    <li>
                        <Link to="/collections/all?category=Bottom Wear" className="hover:text-gray-500 transition-colors">
                            Women's Bottom Wear
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Support Links */}
<div>
  <h3 className="text-lg text-gray-800 mb-4">Support</h3>
  <ul className="space-y-2 text-gray-600">
    <li>
      <Link to="/contact" className="hover:text-gray-500 transition-colors">
        Contact Us
      </Link>
    </li>
    <li>
      <Link to="/about" className="hover:text-gray-500 transition-colors">
        About Us
      </Link>
    </li>
    <li>
      <Link to="/faqs" className="hover:text-gray-500 transition-colors">
        FAQs
      </Link>
    </li>
    <li>
      <Link to="/features" className="hover:text-gray-500 transition-colors">
        Features
      </Link>
    </li>
  </ul>
</div>

            {/* Follow Us */}
            <div>
              <h3 className="text-lg text-gray-800 mb-4"> Follow Us</h3>
                <div className="flex items-center space-x-4 mb-6">
                  <a 
                        href="https://business.facebook.com/business/loginpage/?next=https%3A%2F%2Fbusiness.facebook.com%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_mbs&login_options%5B0%5D=FB&login_options%5B1%5D=IG&login_options%5B2%5D=SSO&config_ref=biz_login_tool_flavor_mbs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-500"
                    >
                        <TbBrandMeta className="h-5 w-5"/>
                    </a>
                    <a 
                        href="https://www.facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-500"
                    >
                        <TbBrandFacebook className="h-5 w-5"/>
                    </a>
                    <a 
                        href="https://www.instagram.com/rahxm7/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-500"
                    >
                        <IoLogoInstagram className="h-5 w-5"/>
                    </a>
                    <a 
                        href="https://x.com/rahimux7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-500"
                    >
                        <RiTwitterXFill className="h-4 w-4"/>
                </a>
              </div>
              <p className="text-gray-500"> Call Us </p>
              <p>
                <FiPhoneCall className='inline-block mr-2'/>
                +91 7337484843
              </p>
            </div>
          </div>
          {/* Footer Bottom */}
          <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
            <p className="text-gray-500 text-sm tracking-tighter text-center">© 2025, Ecom.  All Rights Reserved. </p>
          </div>
        </footer>
      );
       
}

export default Footer;