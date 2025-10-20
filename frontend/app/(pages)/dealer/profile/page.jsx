"use client";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../../lib/axios";

export default function DealerProfilePage() {
  const [form, setForm] = useState({
    businessName: "",
    businessAddress: "",
    businessPhone: "",
    taxId: "",
    yearsInBusiness: "",
    description: "",
  });

  // Check if user is dealer and get current status
  const { data: dealerStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['dealer-status'],
    queryFn: async () => {
      const res = await api.get("/auth/dealer-status");
      return res.data;
    },
  });

  const completeProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      const res = await api.post("/auth/complete-dealer-profile", profileData);
      return res.data;
    },
    onSuccess: (data) => {
      alert("Profile submitted successfully! Waiting for admin approval.");
      window.location.href = "/dealer/pending";
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Profile submission failed");
    },
  });

  useEffect(() => {
    if (dealerStatus?.hasDealerProfile) {
      // Redirect if profile already completed
      window.location.href = "/dealer";
    }
  }, [dealerStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    completeProfileMutation.mutate(form);
  };

  if (statusLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Complete Dealer Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Business Name"
            required
            className="w-full p-2 border mb-2"
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Business Phone"
            required
            className="w-full p-2 border mb-2"
            value={form.businessPhone}
            onChange={(e) => setForm({ ...form, businessPhone: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tax ID"
            required
            className="w-full p-2 border mb-2"
            value={form.taxId}
            onChange={(e) => setForm({ ...form, taxId: e.target.value })}
          />
          <input
            type="number"
            placeholder="Years in Business"
            required
            className="w-full p-2 border mb-2"
            value={form.yearsInBusiness}
            onChange={(e) => setForm({ ...form, yearsInBusiness: e.target.value })}
          />
        </div>

        <textarea
          placeholder="Business Description"
          required
          className="w-full p-2 border mb-2 h-24"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="text"
          placeholder="Business Address"
          required
          className="w-full p-2 border mb-4"
          value={form.businessAddress}
          onChange={(e) => setForm({ ...form, businessAddress: e.target.value })}
        />

        <button
          type="submit"
          disabled={completeProfileMutation.isLoading}
          className="bg-blue-600 text-white w-full py-2 rounded disabled:bg-blue-400"
        >
          {completeProfileMutation.isLoading ? "Submitting..." : "Submit Profile"}
        </button>
      </form>
    </div>
  );
}