import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Welcome to AmzymDrive</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Map Features</h2>
            <p className="text-gray-600">View and navigate through locations with our interactive map.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Chat Features</h2>
            <p className="text-gray-600">Connect and communicate with other users in real-time.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
