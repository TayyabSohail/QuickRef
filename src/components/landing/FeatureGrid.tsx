import { Card, CardContent } from '@/components/ui/card';
import { Code2, Zap, Shield, Eye, FolderOpen, Users } from 'lucide-react';

const features = [
  {
    icon: <Code2 className='h-6 w-6' />,
    title: 'Syntax Highlighting',
    description: 'Beautiful syntax highlighting for all popular languages',
  },
  {
    icon: <Zap className='h-6 w-6' />,
    title: 'Lightning Fast',
    description: 'Instant search and quick access to your code snippets',
  },
  {
    icon: <Shield className='h-6 w-6' />,
    title: 'Secure & Private',
    description: 'Your snippets are encrypted and accessible only to you',
  },
  {
    icon: <Users className='h-6 w-6' />,
    title: 'Role-Based Access',
    description:
      'Owners can add, update, and delete their notes. Viewers can only view others’ public notes.',
  },
  {
    icon: <Eye className='h-6 w-6' />,
    title: 'Note Visibility',
    description:
      'Choose to keep notes private or share them publicly with others.',
  },
  {
    icon: <FolderOpen className='h-6 w-6' />,
    title: 'Organized',
    description: 'Organize with tags and categories for easy management',
  },
];

export function FeatureGrid() {
  return (
    <section className='px-4 py-16'>
      <div className='mb-12 text-center'>
        <h2 className='text-4xl font-bold'>
          Everything you need to manage code snippets
        </h2>
        <p className='mt-2 text-xl text-muted-foreground'>
          Built for developers who value speed, simplicity, and organization
        </p>
      </div>
      <div className='mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3'>
        {features.map((feature, index) => (
          <Card
            key={index}
            className='group border border-border bg-card/60 backdrop-blur-sm transition hover:bg-card/80'
          >
            <CardContent className='p-6'>
              <div className='mb-4 flex items-center space-x-3'>
                <div className='rounded-lg bg-primary/10 p-2 text-primary group-hover:bg-primary/20'>
                  {feature.icon}
                </div>
                <h4 className='text-lg font-semibold'>{feature.title}</h4>
              </div>
              <p className='text-muted-foreground'>{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
