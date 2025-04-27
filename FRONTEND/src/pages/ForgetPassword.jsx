import React, { useState } from "react";
import { MdOutlineAttachEmail } from "react-icons/md"

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const emailChanger = (event) => {
    setEmail(event.target.value);
  };
  
  const submitHandler = (event) => {
    event.preventDefault();
    console.log(email);
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={submitHandler} className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm">
        <div className="flex justify-center mb-6">
          < MdOutlineAttachEmail className="text-3xl"/>
          {/* <h2 className="text-xl font-medium">M4x</h2> */}
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Forget Password!</h2>
        <p className="text-center mb-6">Enter your registered email to send OTP</p>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={emailChanger}
            placeholder="Enter Your email address"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
        >Send Email
        </button>
      </form>
    </div>
  );
};

export default ForgetPassword;
