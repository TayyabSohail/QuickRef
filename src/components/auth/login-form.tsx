'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
    <div className={cn('relative min-h-screen w-full', className)} {...props}>
      <div className='container flex min-h-screen items-center justify-center p-4'>
        <Card className='w-full max-w-md border bg-card/80 shadow-xl backdrop-blur-md'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl font-bold text-card-foreground'>
              Welcome Back
            </CardTitle>
            <CardDescription className='mt-2 text-muted-foreground'>
              Sign in to your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-5'
              >
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='your@email.com'
                          type='email'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-center justify-between'>
                        <FormLabel>Password</FormLabel>
                        <a
                          href='#'
                          className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
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

                {/* Submit Button */}
                <Button
                  type='submit'
                  className='w-full'
                  disabled={isPending || form.formState.isSubmitting}
                >
                  {isPending ? 'Signing in...' : 'Sign In'}
                </Button>

                {/* Sign Up Link */}
                <p className='text-center text-sm text-muted-foreground'>
                  Don&apos;t have an account?{' '}
                  <button
                    type='button'
                    onClick={() => router.push('/auth/signup')}
                    className='font-medium text-primary underline-offset-2 hover:underline'
                  >
                    Sign up
                  </button>
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
