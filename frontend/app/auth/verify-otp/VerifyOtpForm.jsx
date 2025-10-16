// app/auth/verify-otp/page.js
"use client";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../../lib/axios";
import Link from "next/link";

export default function VerifyOtpPage() {
   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
   const searchParams = useSearchParams();
   const email = searchParams.get('email');
   const router = useRouter();

   const verifyOtpMutation = useMutation({
      mutationFn: async (otpData) => {
         const res = await api.post("/auth/verify-otp", otpData);
         return res.data;
      },
      onSuccess: (data) => {
         localStorage.setItem("token", data.token);
         localStorage.setItem("user", JSON.stringify(data.user));

         if (data.user.role === "dealer" && data.dealerStatus?.status === "profile_incomplete") {
            router.push("/dealer/profile");
         } else {
            router.push(data.user.role === "dealer" ? "/dealer/dashboard" : "/dashboard");
         }
      },
      onError: (error) => {
         alert(error.response?.data?.message || "OTP verification failed");
      },
   });

   const handleVerifyOtp = (e) => {
      e.preventDefault();
      const otpString = otp.join('');
      if (otpString.length !== 6) {
         alert("Please enter a valid 6-digit OTP");
         return;
      }
      verifyOtpMutation.mutate({ email, otp: otpString });
   };

   const handleOtpChange = (value, index) => {
      if (!/^\d?$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
         document.getElementById(`otp-${index + 1}`)?.focus();
      }
   };

   const handleKeyDown = (e, index) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
         document.getElementById(`otp-${index - 1}`)?.focus();
      }
   };

   if (!email) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <h2 className="text-2xl font-bold text-red-600">Invalid Access</h2>
               <p className="text-gray-600">Please register first to verify OTP</p>
               <Link href="/auth/register" className="text-blue-600 mt-4 inline-block">
                  Go to Registration
               </Link>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
         <div className="max-w-md w-full">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
               </svg>
               Back to Home
            </Link>

            <div className="bg-white rounded-2xl shadow-xl p-8">
               <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
                  <p className="text-gray-600">Enter the verification code sent to your email</p>
                  <p className="text-sm text-blue-600 mt-2">{email}</p>
               </div>

               <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="flex justify-center space-x-3">
                     {otp.map((digit, index) => (
                        <input
                           key={index}
                           id={`otp-${index}`}
                           type="text"
                           maxLength={1}
                           value={digit}
                           onChange={(e) => handleOtpChange(e.target.value, index)}
                           onKeyDown={(e) => handleKeyDown(e, index)}
                           className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                     ))}
                  </div>

                  <button
                     type="submit"
                     disabled={verifyOtpMutation.isLoading}
                     className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                  >
                     {verifyOtpMutation.isLoading ? "Verifying..." : "Verify Email"}
                  </button>

                  <div className="text-center">
                     <p className="text-gray-600">
                        Didn't receive the code?{" "}
                        <button type="button" className="text-blue-600 hover:text-blue-800 font-semibold">
                           Resend Code
                        </button>
                     </p>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
}