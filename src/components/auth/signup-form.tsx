'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { register } from '@/actions/auth';
import { login } from '@/actions/auth';
import { registerSchema } from '@/schemas/auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';
import * as z from 'zod';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { useRegisterForm } from '@/schemas/auth';
import { useRouter } from 'next/navigation';

type FormSchema = z.infer<typeof registerSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [serverError, setServerError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const form = useRegisterForm();
  const router = useRouter();

  const onSubmit = async (values: FormSchema) => {
    setErrorMessage('');

    const result = await register(values);

    if (result?.error) {
      setErrorMessage(result.error);
    } else {
      router.replace('/auth/verify-email');
    }
  };
  return (
    <div
      className={cn(
        'flex min-h-screen w-full items-center justify-center p-4',
        className,
      )}
      {...props}
    >
      <Card className='grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl shadow-2xl md:grid-cols-2'>
        {/* Left: Signup Form */}
        <div className='flex flex-col justify-center p-8'>
          <CardHeader className='text-center'>
            <CardTitle className='text-3xl font-bold'>
              Create an Account
            </CardTitle>
            <CardDescription className='mt-1 text-muted-foreground'>
              Join us today
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-5'
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder='John Doe' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='you@example.com'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='••••••••'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='••••••••'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Server error */}
                {serverError && (
                  <p className='text-center text-sm text-red-500'>
                    {serverError}
                  </p>
                )}

                <Button
                  type='submit'
                  className='w-full'
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? 'Creating account...'
                    : 'Sign Up'}
                </Button>

                <p className='text-center text-sm text-muted-foreground'>
                  Already have an account?{' '}
                  <Link
                    href='/auth/login'
                    className='font-medium text-primary underline-offset-2 hover:underline'
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </Form>
          </CardContent>
        </div>

        {/* Right: Product Info - Using primary color */}
        <div className='flex flex-col justify-center bg-primary p-8 text-center text-primary-foreground'>
          <h2 className='mb-2 text-3xl font-semibold'>QuickRef</h2>
          <p className='text-sm text-primary-foreground/90'>
            Your personal snippet manager
            <br />
            save, search, and organize code effortlessly.
          </p>
        </div>
      </Card>
    </div>
  );
}
