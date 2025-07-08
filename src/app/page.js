import Link from 'next/link';
import { Button } from '@/components/ui';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Wellness Tracker</h1>
            <div className="space-x-4">
              <Link href="/auth/signin">
                <Button variant="secondary">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </nav>

        <main className="py-20">
          <div className="text-center">
            <h2 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Track Your Wellness Journey</span>
              <span className="block text-blue-600">One Day at a Time</span>
            </h2>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Monitor your daily water intake, sleep patterns, exercise routines, and mood.
              Get insights into your wellness habits and make informed decisions about your health.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/auth/signup">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Water Tracking',
                description: 'Monitor your daily water intake and stay hydrated.'
              },
              {
                title: 'Sleep Insights',
                description: 'Track your sleep patterns and improve your rest.'
              },
              {
                title: 'Exercise Logging',
                description: 'Record your workouts and stay active.'
              },
              {
                title: 'Mood Journal',
                description: 'Keep track of your emotional well-being.'
              }
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
