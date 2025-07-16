'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { CheckCircle } from 'lucide-react'; // icon from lucide-react (shadcn default)
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-muted p-4'>
      <Card className='max-w-md w-full text-center'>
        <CardHeader>
          <CheckCircle className='mx-auto mb-4 h-12 w-12 text-green-600' />
          <CardTitle>Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            Thank you for your payment. Your seat has been successfully
            reserved. You will receive a confirmation email shortly.
          </p>
        </CardContent>
        <CardFooter className='justify-center'>
          <Link href='/events'>
            <Button variant='default'>Back to Events</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
