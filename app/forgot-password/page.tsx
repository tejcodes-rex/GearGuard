"use client";

import { useState } from "react";
import Link from "next/link";
import { Wrench, ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock sending email
        setTimeout(() => {
            setIsSubmitted(true);
        }, 1000);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                        <Wrench className="h-6 w-6 text-purple-600" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Reset Password</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        {!isSubmitted ? "Enter your email to receive reset instructions" : "Check your inbox for instructions"}
                    </p>
                </div>

                {!isSubmitted ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-slate-700">
                                Email address
                            </label>
                            <div className="mt-1 relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-lg border border-slate-300 py-3 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                                    placeholder="admin@gearguard.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-500 focus:outline-none"
                        >
                            Send Reset Link
                        </button>

                        <div className="text-center">
                            <Link href="/login" className="flex items-center justify-center text-sm font-medium text-purple-600 hover:text-purple-500">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Sign In
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div className="mt-8 space-y-6 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <p className="text-slate-600">
                            We have sent a password reset link to <strong>{email}</strong>.
                            Please check your email.
                        </p>
                        <div className="pt-4">
                            <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
                                Back to Sign In
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
