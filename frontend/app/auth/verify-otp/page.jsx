// app/auth/verify-otp/page.jsx
import { Suspense } from "react";
import VerifyOtpWrapper from "./VerifyOtpForm";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpWrapper />
    </Suspense>
  );
}