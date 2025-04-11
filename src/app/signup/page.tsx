"use client";

import { useState } from "react";
import { UserAuth } from "../../lib/context/AuthContent"; // Adjust the import path as needed
import { Button } from "@/app/ui/button";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const { emailSignUp, googleSignIn, error, loading } = UserAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormError(null); // Clear form error when user types
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Form validation
    if (!formData.displayName || !formData.email || !formData.password) {
      setFormError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    try {
      await emailSignUp(formData.email, formData.password, formData.displayName);
      router.push("/");
    } catch (error) {
      // Error is handled by the context, but you can add additional handling here
      console.error("Signup error:", error);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await googleSignIn();
      router.push("/"); 
    } catch (error){
      console.error(error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white px-8 py-10 shadow-md rounded-lg">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>

          {/* Error Messages */}
          {(error || formError) && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {formError || error}
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-6">
            <div>
              <label 
                htmlFor="displayName" 
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                value={formData.displayName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? "Creating account..." : "Sign up"}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center justify-center">
            <div className="border-t flex-grow border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">or</span>
            <div className="border-t flex-grow border-gray-300"></div>
          </div>

          {/* Google Sign Up Button */}
          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <FcGoogle className="h-5 w-5" />
            <span>Continue with Google</span>
          </button>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
