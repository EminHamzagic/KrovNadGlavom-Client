export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page Not Found</p>
      <a
        href="/"
        className="mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark-light transition"
      >
        Go Home
      </a>
    </div>
  );
}
