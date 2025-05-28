export default function TestTailwind() {
    return (
        <div className="min-h-screen bg-red-500 flex items-center justify-center">
            <div className="bg-blue-500 text-white p-8 rounded-lg">
                <h1 className="text-4xl font-bold mb-4">Tailwind CSS Test</h1>
                <p className="text-xl">If you can see this styled properly, Tailwind is working!</p>
                <div className="mt-4 space-x-4">
                    <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">Green Button</button>
                    <button className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded">Yellow Button</button>
                </div>
            </div>
        </div>
    );
}
