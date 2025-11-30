"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: { monthly: 19, annual: 15 },
      description: "Perfect for individuals getting started",
      features: [
        "100MB Cloud storage",
        "100+ prompt templates",
        "5 projects",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: { monthly: 49, annual: 39 },
      description: "Most popular for growing businesses",
      features: [
        "Everything in Starter",
        "1TB Cloud storage",
        "Unlimited projects",
        "Priority support",
        "Advanced analytics",
        "Custom templates"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: { monthly: 99, annual: 79 },
      description: "For teams and large organizations",
      features: [
        "Everything in Professional",
        "10TB Cloud storage",
        "Team collaboration",
        "24/7 phone support",
        "Custom integrations",
        "Dedicated account manager"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Simple, transparent pricing
          </h1>
          <p className=" text-muted-foreground mb-8 max-w-lg mx-auto">
            Choose the perfect plan for your needs. All plans include our core features with no hidden fees.
          </p>
          
          {/* Pricing Toggle */}
          <div className="inline-flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                !isAnnual
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isAnnual
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
            </button>
          </div>
          
          {isAnnual && (
            <p className="text-sm text-green-600 mt-4 font-medium">
              Save up to 20% with annual billing
            </p>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const currentPrice = isAnnual ? plan.price.annual : plan.price.monthly;
            
            return (
              <div
                key={plan.name}
                className={`relative bg-card border rounded-xl p-8 ${
                  plan.popular 
                    ? "border-primary ring-2 ring-primary/20 shadow-lg" 
                    : "border-border hover:border-primary/50"
                } transition-all duration-200`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Name */}
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mt-2">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-foreground">
                      ${currentPrice}
                    </span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-green-600 mt-2 font-medium">
                      ${plan.price.monthly - currentPrice} off monthly
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  asChild
                  className={`w-full h-12 ${
                    plan.popular 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                      : "bg-background hover:bg-muted text-foreground border border-border"
                  }`}
                >
                  <Link href="/register">
                    {plan.popular ? "Get Started" : "Choose Plan"}
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>

        
      </div>
    </div>
  );
}
