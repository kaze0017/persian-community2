'use client';

import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { Workshop } from '@/types/workshop';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef, FormEvent } from 'react';

export default function WorkshopRegisterPage() {
  const params = useParams();
  const router = useRouter();
  const workshopId = params.id as string;

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!workshopId) {
      router.push('/not-found');
      return;
    }

    const fetchWorkshop = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'workshops', workshopId));
        if (!docSnap.exists()) {
          router.push('/not-found');
          return;
        }
        setWorkshop(docSnap.data() as Workshop);
      } catch (error) {
        console.error('Error fetching workshop:', error);
        router.push('/not-found');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshop();
  }, [workshopId, router]);

  if (loading) {
    return <div className='text-center py-10'>Loading...</div>;
  }

  if (!workshop) {
    return null;
  }

  const isPaid = workshop.price > 0;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (isPaid) {
      // Disable submission for paid workshops for now
      setError('Paid registration is under construction.');
      return;
    }

    const form = formRef.current;
    if (!form) {
      setError('Form not found');
      return;
    }

    const formData = new FormData(form);
    const email = formData.get('email')?.toString().trim();
    if (!email) {
      setError('Email is required.');
      return;
    }

    setCheckingEmail(true);
    try {
      const registrationsRef = collection(
        db,
        `workshops/${workshopId}/registrations`
      );
      const q = query(registrationsRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError('This email is already registered for this workshop.');
        setCheckingEmail(false);
        return;
      }
    } catch (err) {
      console.error('Error checking email existence:', err);
      setError('Failed to check email, please try again later.');
      setCheckingEmail(false);
      return;
    }
    setCheckingEmail(false);

    // Submit form programmatically
    form.submit();
  }

  return (
    <div className='max-w-lg mx-auto space-y-6'>
      <h1 className='text-2xl font-bold'>{workshop.title}</h1>

      <div className='w-full h-48 rounded-md overflow-hidden bg-muted'>
        {workshop.bannerUrl ? (
          <Image
            src={workshop.bannerUrl}
            alt='Workshop Banner'
            width={800}
            height={192}
            className='object-cover w-full h-full'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-xs text-muted-foreground'>
            No Image
          </div>
        )}
      </div>

      <p className='text-sm text-muted-foreground'>{workshop.description}</p>

      <div className='text-sm space-y-1 text-muted-foreground'>
        <div>
          <strong>Instructor:</strong> {workshop.instructor?.name ?? 'N/A'}
        </div>
        <div>
          <strong>Price:</strong> {isPaid ? `$${workshop.price}` : 'Free'}
        </div>
        <div>
          <strong>Start:</strong> {format(parseISO(workshop.startDate), 'PPP')}
        </div>
        <div>
          <strong>End:</strong> {format(parseISO(workshop.endDate), 'PPP')}
        </div>
      </div>

      <form
        ref={formRef}
        action={
          isPaid
            ? '/api/workshops/create-checkout-session'
            : '/api/workshops/register-free'
        }
        method='POST'
        className='space-y-4'
        onSubmit={handleSubmit}
      >
        <input type='hidden' name='workshopId' value={workshopId} />

        <div>
          <label className='block mb-1 text-sm font-medium'>Full Name</label>
          <input
            type='text'
            name='name'
            required
            className='w-full border border-gray-300 rounded px-3 py-2'
            placeholder='Your full name'
          />
        </div>

        <div>
          <label className='block mb-1 text-sm font-medium'>Email</label>
          <input
            type='email'
            name='email'
            required
            className='w-full border border-gray-300 rounded px-3 py-2'
            placeholder='you@example.com'
          />
        </div>

        <div>
          <label className='block mb-1 text-sm font-medium'>Phone Number</label>
          <input
            type='tel'
            name='phone'
            required
            className='w-full border border-gray-300 rounded px-3 py-2'
            placeholder='+1 555 123 4567'
          />
        </div>

        {error && <p className='text-red-600 text-sm'>{error}</p>}

        <Button
          type='submit'
          disabled={checkingEmail || isPaid}
          className='w-full'
        >
          {checkingEmail
            ? 'Checking email...'
            : isPaid
              ? 'Under Construction'
              : 'Confirm Free Registration'}
        </Button>
      </form>
    </div>
  );
}
