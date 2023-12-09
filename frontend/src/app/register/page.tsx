"use client";
import React, { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Register = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const toggleConfirmPasswordVisibility = (e: any) => {
    e.preventDefault();
    setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const username = e.target[1].value;
    const password = e.target[2].value;
    const confirm_password = e.target[4].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password is invalid");
      return;
    }

    if ( password !== confirm_password) {
      setError("Password doen't match");
      return;
    }
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      });
      if (res.status === 400) {
        setError("This username/email is already registered");
      }
      if (res.status === 200) {
        setError("");
        router.push("/login");
      }
    } catch (error) {
      setError("Error, try again");
      console.log(error);
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
                  <h2 className="text-2xl lg:text-3xl font-semibold leading-9 tracking-tight text-gray-900">Sign up
                   to</h2>
                  <h4 className="mb-10 mr-4 text-sm md:text-base">Lorem Ipsum is simply</h4>
                </div>

                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input type="text" name="email" id="email" className="block w-full p-4 bg-white border border-black text-gray-900 sm:text-md rounded-lg focus:ring-gray-900 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your email address" />
                </div>
                <div className="mb-5">
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User name</label>
                    <input type="text" id="username" className="block w-full p-4 bg-white border border-black text-gray-900 sm:text-md rounded-lg focus:ring-gray-900 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your user name" />
                </div>

                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <div className="relative w-full">
                    <input 
                        type={showPassword ? 'text' : 'password'}
                        name="password" id="password" 
                        placeholder="Enter your password" 
                        className="block w-full p-4 bg-white border border-black text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        
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
                <div className="mb-5">
                    <label htmlFor="cpassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                    <div className="relative w-full">
                    <input 
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirm_password" id="cpassword" placeholder="Enter your confirm password" 
                        className="block w-full p-4 bg-white border border-black text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        
                        <button
                          id="togglePassword"
                          type="button"
                          className="absolute inset-y-0 end-2.5 flex items-center"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {showConfirmPassword ? <EyeSlashIcon className="w-6 h-6 text-black" /> : <EyeIcon className="w-6 h-6 text-black" />}
                        </button>
                    </div>
                </div>

                <p className="text-red-800 text-[16px] mb-4">{error && error}</p>
                <button type="submit" className="w-full text-white bg-black hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-4 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">Register</button>


                <div className="text-center lg:text-center mt-6">

                  <p className="mb-0 mt-2 pt-1 text-sm text-gray-500">
                  Already have an Account ?
                    <Link
                      href="/login"
                      className="text-black front-bold transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700"
                      >{" "}Login</Link
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

export default Register;
