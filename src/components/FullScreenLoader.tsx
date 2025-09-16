export default function FullScreenLoader() {
  return (
    <div className="absolute opacity-65 inset-0 flex items-center justify-center bg-white z-50">
      <div className="relative w-24 h-24">
        <div
          className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "#c7671e", borderTopColor: "transparent" }}
        >
        </div>

        <img
          src="/favicon.png"
          alt="Loading"
          className="absolute inset-0 m-auto w-12 h-12"
        />
      </div>
    </div>
  );
}
