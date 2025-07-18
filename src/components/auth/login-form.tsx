'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/schemas/auth';
import { login } from '@/actions/auth';
import * as z from 'zod';

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    startTransition(async () => {
      const result = await login(values);

      if (result?.error) {
        toast.error(result.error);
        return;
      }
      router.replace('/dashboard');
    });
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
        {/* Left: Login Form */}
        <div className='flex flex-col justify-center p-8'>
          <CardHeader className='text-center'>
            <CardTitle className='text-3xl font-bold'>Welcome Back</CardTitle>
            <CardDescription className='mt-1'>
              Sign in to your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-5'
              >
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='you@example.com'
                          type='email'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-center justify-between'>
                        <FormLabel>Password</FormLabel>
                        <a
                          href='#'
                          className='text-sm font-medium text-muted-foreground hover:text-primary'
                        >
                          Forgot password?
                        </a>
                      </div>
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
                <Button type='submit' className='w-full' disabled={isPending}>
                  {isPending ? 'Signing in...' : 'Sign In'}
                </Button>
                <p className='text-center text-sm text-muted-foreground'>
                  Don't have an account?{' '}
                  <Link href='/auth/signup' passHref>
                    <button
                      type='button'
                      className='font-medium text-primary hover:underline'
                    >
                      Sign up
                    </button>
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
