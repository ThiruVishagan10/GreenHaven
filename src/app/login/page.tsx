"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/app/ui/card";
import { Input } from "@/app/ui/input";
import { Button } from "@/app/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/lib/context/AuthContent";
import { handleSignIn } from "../api/signin";
import { Alert, AlertDescription } from "@/app/ui/alert";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { user, googleSignIn } = UserAuth();

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      await googleSignIn();
      router.push("/");
    } catch (error) {
      setError("Unable to sign in with Google. Please try again.");
    }
  };

  const getErrorMessage = () => {
    return 'An error occurred during sign in. Please try again.';
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await handleSignIn({
        email,
        password
      });
      
      if (response.success) {
        router.push("/");
      }
    } catch (error: any) {
      // Convert Firebase error codes to user-friendly messages
      const errorMessage = getErrorMessage();
      setError(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription className="text-sm font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <Input 
              placeholder="Email Address" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="p-3 rounded-lg" 
            />
            <Input 
              placeholder="Password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="p-3 rounded-lg" 
            />
            <Button 
              type="submit" 
              className="w-full py-3 mt-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Login
            </Button>
          </form>

          <div className="flex items-center justify-center my-4">
            <div className="w-1/3 border-t border-gray-300"></div>
            <p className="px-2 text-gray-500 text-sm">OR</p>
            <div className="w-1/3 border-t border-gray-300"></div>
          </div>

          <Button 
            type="button"
            variant="outline" 
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center py-3 border-gray-300 rounded-lg"
          >
            <FcGoogle className="mr-2 text-xl" /> Continue with Google
          </Button>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account?
            <span
              onClick={() => router.push("/signup")}
              className="text-green-600 cursor-pointer font-medium ml-1 hover:underline"
            >
              Sign Up
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
