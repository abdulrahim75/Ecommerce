import React, { useState, useRef } from 'react';
import { FaFingerprint } from 'react-icons/fa';
import Timer from './Timer';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, ""); // allow only numbers
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < 5 && inputsRef.current[index + 1]) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    console.log("OTP entered:", otp.join(""));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={submitHandler} className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm">
        <div className="flex justify-center mb-6">
          <FaFingerprint className="text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Verify OTP!</h2>
        <p className="text-center mb-6">Enter OTP which was sent to your mail</p>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">OTP *</label>
          <div className="flex justify-between gap-2">
            {otp.map((data, index) => (
              <input
              required
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="w-12 h-12 text-center border rounded focus:outline-none focus:ring-2 focus:ring-black text-xl"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Verify OTP
        </button>
        <br />
        <br />
        <div className="">
            <Timer />
        </div>
      </form>
    </div>
  );
};

export default VerifyOtp;
