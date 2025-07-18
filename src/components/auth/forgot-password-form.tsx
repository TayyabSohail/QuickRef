'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { resetPassword } from '@/actions/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(email);

    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
    }

    setLoading(false);
  };

  return (
    <div className='flex min-h-screen w-full items-center justify-center p-4'>
      <Card className='w-full max-w-md rounded-2xl shadow-xl'>
        <CardHeader className='text-center'>
          <CardTitle className='text-3xl font-bold'>
            {sent ? 'Link Sent' : 'Forgot Password'}
          </CardTitle>
          <CardDescription className='mt-1 text-muted-foreground'>
            {sent
              ? 'Check your email inbox for the reset link.'
              : 'Enter your email to receive a reset link'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {sent ? (
            <div className='text-center text-sm text-muted-foreground'>
              Didn’t get the email? Check your spam folder or{' '}
              <button
                onClick={() => setSent(false)}
                className='text-primary hover:underline'
              >
                try again
              </button>
              .
            </div>
          ) : (
            <form onSubmit={handleReset} className='space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium text-foreground'>
                  Email Address
                </label>
                <Input
                  type='email'
                  placeholder='you@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
