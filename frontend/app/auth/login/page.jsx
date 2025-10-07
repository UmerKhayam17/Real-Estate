// app/auth/login/page.js
'use client';
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import Link from "next/link";
import { useAuth } from "../../../hooks/useAuth";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async (loginData) => {
      const res = await api.post("/auth/login", loginData);
      console.log("the res is ",res)
      return res.data;
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      
      // Handle redirection based on user role
      if (data.user.role === "dealer") {
        if (data.dealerStatus?.status === "profile_incomplete") {
          router.push("/dealer/profile");
        } else if (data.dealerStatus?.status === "pending_approval") {
          router.push("/dealer/pending");
        } else {
          router.push("/dealer/dashboard");
        }
      } 
      else if(data.user.role==="admin"){
        router.push("/admin/dashboard")
      } 
      else {
        router.push("/dashboard");
      }
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Login failed");
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation.mutate(form);
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loginMutation.isLoading ? "Signing In..." : "Sign In"}
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}