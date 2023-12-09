"use client";
import React, { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  // const session = useSession();
  const { data: session, status: sessionStatus } = useSession();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const [isChecked, setIsChecked] = useState(false);
  const checkHandler = () => {
    setIsChecked(!isChecked)
  }

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const username = e.target[0].value;
    const password = e.target[1].value;
    const rememberMe = isChecked;

    if (!username) {
      setError("Username is invalid");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password is invalid");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
      rememberMe,
    });

    if (res?.error) {
      setError("Invalid email or password");
      if (res?.url) router.replace("/dashboard");
    } else {
      setError("");
    }
  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <section className="h-screen">
        <div className="flex justify-center">
          <div
            className="max-w-screen m-6 sm:m-20 bg-white sm:rounded-lg flex justify-center flex-1">
    
            <div className="w-full bg-white border border-gray-400 rounded-lg shadow mb-12 md:mb-0 md:w-8/12 lg:w-4/12 xl:w-4/12">
              <form className="p-6 xl:p-12" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <h4 className="mb-8 mr-4 text-lg md:text-2xl text-black">Welcome !</h4>
                  <h2 className="text-2xl lg:text-3xl font-semibold leading-9 tracking-tight text-gray-900">Sign in to</h2>
                  <h4 className="mb-10 mr-4 text-sm md:text-base">Lorem Ipsum is simply</h4>
                </div>

                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User name</label>
                    <input type="text" name="email" id="email" className="block w-full p-4 bg-white border border-black text-gray-900 sm:text-md rounded-lg focus:ring-gray-900 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your user name" />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <div className="relative w-full">
                    <input 
                        type={showPassword ? 'text' : 'password'}
                        name="password" id="password" placeholder="Enter your password" className="block w-full p-4 bg-white border border-black text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        
                        <button
                          id="togglePassword"
                          type="button"
                          className="absolute inset-y-0 end-2.5 flex items-center"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <EyeSlashIcon className="w-6 h-6 text-black" /> : <EyeIcon className="w-6 h-6 text-black" />}
                        </button>
                    </div>

                </div>
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input id="remember" aria-describedby="remember" type="checkbox" 
                          checked={isChecked}
                          onChange={checkHandler}
                          className="w-4 h-4 border border-black rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="remember" className="text-black dark:text-gray-300">Remember me</label>
                        </div>
                    </div>
                    <a href="#" className="text-sm text-gray-600 hover:underline dark:text-primary-500">Forgot password?</a>
                </div>
                <p className="text-red-800 text-[16px] mb-4">{error && error}</p>
                <button type="submit" className="w-full text-white bg-black hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-4 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">Login</button>


                <div className="text-center lg:text-center mt-12">


                  <p className="mb-0 mt-2 pt-1 text-sm text-gray-500">
                    Don't have an account? 
                    <Link
                      href="/register"
                      className="text-black front-bold transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700"
                      >{" "}Register</Link
                    >
                  </p>
                </div>
              </form>
            </div>
            <div className="flex-1 bg-white text-center hidden lg:flex">
                <div className="w-full bg-contain bg-center bg-no-repeat"
                    style={{backgroundImage: `url('/images/discussing-ideas.svg')`}}>
                </div>
            </div>
          </div>
        </div>
      </section>
    )
  );
};

export default Login;
