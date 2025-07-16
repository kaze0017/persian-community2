'use client';
import React from 'react';
import SubscribeComponent from '@/app/components/SubscribeComponent';
export default function page() {
  return (
    <div className='page-container'>
      <h1>Donate with Checkout</h1>
      <p>Donate to our project 💖</p>
      <SubscribeComponent
        priceId='price_1Rj8JCDIS4dvpSxZclPCgr9i'
        price='$10.00'
        description='Support our project with a one-time donation'
      />
    </div>
  );
}
