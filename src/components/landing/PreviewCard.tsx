import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function PreviewCard() {
  return (
    <section className='px-4 pb-24'>
      <div className='mx-auto max-w-4xl'>
        <Card className='group relative grid w-full overflow-hidden rounded-2xl border border-[hsl(var(--terminal-container-border))] bg-[hsl(var(--terminal-container-bg))] shadow-2xl backdrop-blur-md transition-shadow hover:shadow-[0_0_30px_hsl(var(--terminal-shadow))]'>
          <CardHeader className='flex items-center justify-between pb-4'>
            <div className='flex space-x-2'>
              <span className='h-3 w-3 rounded-full bg-[hsl(var(--destructive)/0.7)]' />
              <span className='h-3 w-3 rounded-full bg-[hsl(var(--terminal-yellow)/0.7)]' />
              <span className='h-3 w-3 rounded-full bg-[hsl(var(--terminal-green)/0.7)]' />
            </div>
          </CardHeader>

          <CardContent className='pt-0'>
            <div className='relative overflow-hidden rounded-xl bg-gradient-to-br from-[hsl(var(--terminal-gradient-start))] to-[hsl(var(--terminal-gradient-end))] p-6 font-mono text-sm text-[hsl(var(--code-white))] shadow-inner'>
              <p className='mb-3 text-[hsl(var(--muted-foreground))]'>
                // Custom React Hook for API calls
              </p>

              <div className='grid grid-cols-[2rem_1fr] gap-x-4'>
                <div className='select-none text-right text-[hsl(var(--muted-foreground))]'>
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className='leading-relaxed'>
                      {i + 1}
                    </div>
                  ))}
                </div>

                <div className='space-y-1'>
                  <div>
                    <span className='text-[hsl(var(--code-purple))]'>
                      const
                    </span>{' '}
                    <span className='text-[hsl(var(--code-white))]'>
                      useApi
                    </span>{' '}
                    ={' '}
                    <span className='text-[hsl(var(--code-purple))]'>
                      (url) =&gt; {'{'}
                    </span>
                  </div>
                  <div className='ml-4'>
                    <span className='text-[hsl(var(--code-purple))]'>
                      const
                    </span>{' '}
                    <span className='text-[hsl(var(--code-white))]'>
                      [data, setData]
                    </span>{' '}
                    ={' '}
                    <span className='text-[hsl(var(--code-purple))]'>
                      useState(null);
                    </span>
                  </div>
                  <div className='ml-4'>
                    <span className='text-[hsl(var(--code-purple))]'>
                      const
                    </span>{' '}
                    <span className='text-[hsl(var(--code-white))]'>
                      [loading, setLoading]
                    </span>{' '}
                    ={' '}
                    <span className='text-[hsl(var(--code-purple))]'>
                      useState(true);
                    </span>
                  </div>
                  <div className='ml-4 text-[hsl(var(--muted-foreground))]'>
                    // Add your fetch logic here
                  </div>
                  <div>
                    <span className='text-[hsl(var(--code-purple))]'>
                      {'}'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
