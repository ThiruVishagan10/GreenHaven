import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  isSignUp: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isSignUp }) => {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            {isSignUp ? "Create an Account" : "Sign In to Vels Garden"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            {isSignUp && (
              <Input placeholder="Full Name" type="text" required className="p-3 rounded-lg" />
            )}
            <Input placeholder="Email Address" type="email" required className="p-3 rounded-lg" />
            <Input placeholder="Password" type="password" required className="p-3 rounded-lg" />
            {isSignUp && (
              <Input placeholder="Confirm Password" type="password" required className="p-3 rounded-lg" />
            )}
            <Button type="submit" className="w-full py-3 mt-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          <div className="flex items-center justify-center my-4">
            <div className="w-1/3 border-t border-gray-300"></div>
            <p className="px-2 text-gray-500 text-sm">OR</p>
            <div className="w-1/3 border-t border-gray-300"></div>
          </div>

          <Button variant="outline" className="w-full flex items-center justify-center py-3 border-gray-300 rounded-lg">
            <FcGoogle className="mr-2 text-xl" /> Continue with Google
          </Button>

          <p className="text-center text-gray-600 mt-4">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <span
              onClick={() => router.push(isSignUp ? "/auth/signin" : "/auth/signup")}
              className="text-green-600 cursor-pointer font-medium ml-1 hover:underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
