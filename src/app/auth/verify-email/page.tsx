export default function VerifyEmailPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background p-4 text-foreground'>
      <div className='w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-lg'>
        <h1 className='mb-4 text-center text-2xl font-bold'>
          Verify Your Email
        </h1>
        <p className='text-center text-muted-foreground'>
          Your account has been created. Please check your email inbox (and spam
          folder) to verify your email address before logging in.
        </p>
      </div>
    </div>
  );
}
