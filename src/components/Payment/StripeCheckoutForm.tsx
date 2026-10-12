/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/CustomStripeForm.tsx
'use client'

import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'
import { useState } from 'react'

interface CustomStripeFormProps {
  amount?: number
  onPaymentSuccess?: (paymentIntent: any) => void
  onPaymentError?: (error: string) => void
}

export default function CustomStripeForm({ amount, onPaymentSuccess, onPaymentError }: CustomStripeFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [cardholderName, setCardholderName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    // CRITICAL: Prevent all form submission behaviors
    event.preventDefault()
    event.stopPropagation()

    if (!stripe || !elements) {
      setError("Payment system is not ready. Please try again.")
      return
    }

    setIsLoading(true)
    setError(null)

    // Validation
    if (!cardholderName.trim()) {
      setError("Cardholder name is required")
      setIsLoading(false)
      return
    }

    const cardNumber = elements.getElement(CardNumberElement)

    if (!cardNumber) {
      setError("Card elements not found")
      setIsLoading(false)
      return
    }

    try {
      // SIMPLIFIED: Create payment method and confirm payment in one step
      const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumber,
        billing_details: {
          name: cardholderName,
        },
      })

      if (paymentError) {
        setError(paymentError.message || "Payment failed")
        onPaymentError?.(paymentError.message || "Payment failed")
        setIsLoading(false)
        return
      }

      // For demonstration, we'll simulate a successful payment
      // In a real app, you'd typically:
      // 1. Send payment method to your server
      // 2. Create payment intent on server
      // 3. Return client secret to frontend
      // 4. Confirm payment with client secret

      // MOCK SUCCESS - Replace with your actual payment processing
      const mockPaymentIntent = {
        id: paymentMethod.id,
        status: 'succeeded',
        amount: amount ? Math.round(amount * 100) : 36000,
        currency: 'usd',
        payment_method: paymentMethod.id,
        created: Math.floor(Date.now() / 1000),
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      onPaymentSuccess?.(mockPaymentIntent)

    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred"
      setError(errorMessage)
      onPaymentError?.(errorMessage)
    }

    setIsLoading(false)
  }

  const elementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '12px 0',
      },
    },
  }

  return (
    <div className="w-full">
      {/* IMPORTANT: This form should NOT be nested inside another form */}
      <div className="space-y-6">
        {/* Cardholder Name */}
        <div>
          <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
            Card holder name
          </label>
          <input
            id="cardholderName"
            type="text"
            placeholder="John Doe"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-[12px] outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            required
            disabled={isLoading}
          />
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card number
          </label>
          <div className="border border-gray-300 rounded-[12px] px-4 py-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-colors">
            <CardNumberElement options={elementOptions} />
          </div>
        </div>

        {/* Expiration and CVC - Side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiration Date
            </label>
            <div className="border border-gray-300 rounded-[12px] px-4 py-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-colors">
              <CardExpiryElement options={elementOptions} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVC
            </label>
            <div className="border border-gray-300 rounded-[12px] px-4 py-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-colors">
              <CardCvcElement options={elementOptions} />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-[12px] border border-red-200">
            {error}
          </div>
        )}

        {/* Submit Button - NOT inside a form to prevent reload */}
        <div className="pt-4">
          <button
            type="button" // IMPORTANT: type="button" prevents form submission
            onClick={handleSubmit} // Use onClick instead of form onSubmit
            disabled={!stripe || isLoading}
            className="w-full bg-primary text-white font-medium py-4 px-6 rounded-[100px] hover:bg-primary/90 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </>
            ) : (
              `Pay Now`
            )}
          </button>
        </div>

        {/* Security Notice */}
        <div className="text-center text-sm text-gray-500 pt-2">
          <p>Your payment is secure and encrypted</p>
        </div>
      </div>
    </div>
  )
}