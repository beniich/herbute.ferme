'use client';

import React from 'react';
import Link from 'next/link';
import {
    CheckCircle,
    ArrowRight,
    Lock
} from 'lucide-react';
import { BadgeCheck } from 'lucide-react';

export default function OrderSummaryPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen">
            {/* Main Content Area */}
            <main className="flex-1 flex justify-center py-12 px-4 md:px-0">
                <div className="max-w-4xl w-full flex flex-col gap-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm font-medium px-4">
                        <Link className="text-slate-500 dark:text-slate-400 hover:text-primary" href="/en/pricing">Pricing Plans</Link>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-900 dark:text-white">Order Summary</span>
                    </nav>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column: Plan Summary */}
                        <div className="flex-1 flex flex-col gap-6 p-4">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Review Order</h1>
                                <p className="text-slate-600 dark:text-slate-400 mt-2">Confirm your subscription details and apply any promotional codes.</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <BadgeCheck className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-primary uppercase tracking-wider">Current Selection</p>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Gold Plan</h3>
                                        </div>
                                    </div>
                                    <Link className="text-primary text-sm font-semibold hover:underline" href="/en/pricing">Change Plan</Link>
                                </div>
                                <hr className="border-slate-100 dark:border-slate-800 my-4" />
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                                        <CheckCircle className="text-green-500 w-5 h-5" />
                                        Unlimited complaints management
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                                        <CheckCircle className="text-green-500 w-5 h-5" />
                                        24/7 Priority support access
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                                        <CheckCircle className="text-green-500 w-5 h-5" />
                                        Advanced real-time analytics
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                                        <CheckCircle className="text-green-500 w-5 h-5" />
                                        White-labeling options
                                    </li>
                                </ul>
                            </div>

                            {/* Billing Selection */}
                            <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Billed Monthly</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">Next billing on March 12, 2026</span>
                                </div>
                                <button className="bg-white dark:bg-slate-700 px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-50 transition-colors">
                                    Switch to Yearly (Save 20%)
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Checkout Breakdown */}
                        <div className="w-full lg:w-[380px] flex flex-col gap-6">
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-md">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Payment Summary</h3>
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 dark:text-slate-400">Gold Plan (Monthly)</span>
                                        <span className="font-medium text-slate-900 dark:text-white">$99.00</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                                        <span className="font-medium text-slate-900 dark:text-white">$99.00</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 dark:text-slate-400">Estimated Tax (10%)</span>
                                        <span className="font-medium text-slate-900 dark:text-white">$9.90</span>
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-slate-200 dark:border-slate-700 py-6">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block tracking-tight">Promo Code</label>
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-primary focus:border-primary px-3 py-2 border outline-none"
                                            placeholder="CMS2026"
                                            type="text"
                                        />
                                        <button className="bg-primary px-4 py-2 text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity uppercase">Apply</button>
                                    </div>
                                </div>

                                <div className="bg-primary/5 dark:bg-primary/10 -mx-8 px-8 py-6 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">Total Amount</span>
                                        <div className="text-right">
                                            <p className="text-3xl font-black text-primary tracking-tight">$108.90</p>
                                            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Including all taxes</p>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href="/en/checkout"
                                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <span>Proceed to Checkout</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Link>

                                <div className="mt-6 flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium text-center">
                                        <Lock className="w-4 h-4" />
                                        Secure 256-bit SSL encrypted payment
                                    </div>
                                    {/* Credit Card Icons placeholder */}
                                    <div className="flex gap-3 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                                        <div className="h-6 w-10 bg-slate-200 dark:bg-slate-700 rounded-sm flex items-center justify-center text-[8px] font-bold">VISA</div>
                                        <div className="h-6 w-10 bg-slate-200 dark:bg-slate-700 rounded-sm flex items-center justify-center text-[8px] font-bold">MASTER</div>
                                        <div className="h-6 w-10 bg-slate-200 dark:bg-slate-700 rounded-sm flex items-center justify-center text-[8px] font-bold">PAYPAL</div>
                                    </div>
                                </div>
                            </div>

                            {/* Secondary Info */}
                            <div className="px-4">
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
                                    By clicking &apos;Proceed to Checkout&apos;, you agree to our <a className="underline" href="#">Terms of Service</a> and <a className="underline" href="#">Privacy Policy</a>. Your subscription will renew automatically unless cancelled.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
