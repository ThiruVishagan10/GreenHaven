"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleLogin } from "../api/login";
import { handleGoogleSignIn } from "../api/signin";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  
 



  return (
    <div>
      <h1>Login</h1>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      {/* <button onClick={handleLogin}>Login</button> */}
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
    </div>
  );
}
