import logo from "/KrovNadGlavomLogo.png";

export default function Header() {
  return (
    <div className="col-span-2 bg-white text-black p-4 shadow-[4px_0_10px_rgba(0,0,0,0.1)]">
      <img src={logo} alt="KrovNad Glavom" className="mx-auto h-auto w-full" />
    </div>

  );
}
