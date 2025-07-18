'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { resetPasswordSchema, ResetPasswordFormSchema } from '@/schemas/auth';

export function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const accessToken = searchParams.get('access_token');
  const supabase = createSupabaseBrowserClient();

  const form = useForm<ResetPasswordFormSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: ResetPasswordFormSchema) => {
    if (!accessToken) {
      toast.error('Invalid or missing token');
      return;
    }

    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password updated!');
        router.push('/auth/login');
      }
    });
  };

  return (
    <div className='flex min-h-screen w-full items-center justify-center p-4'>
      <Card className='w-full max-w-md rounded-2xl shadow-2xl'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>Reset Password</CardTitle>
          <CardDescription>Enter and confirm your new password</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
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
              <Button type='submit' className='w-full' disabled={isPending}>
                {isPending ? 'Updating...' : 'Set New Password'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
