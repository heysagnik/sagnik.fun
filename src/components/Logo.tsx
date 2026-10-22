export default function Logo({ className = "size-16" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/apple-touch-icon.png"
      alt="Sagnik Sahoo"
      width={180}
      height={180}
      className={`${className} rounded-[22%] object-cover shadow-[0_1px_2px_rgba(20,20,20,0.12),0_8px_20px_-10px_rgba(20,20,20,0.4)] outline outline-1 -outline-offset-1 outline-black/10 transition-transform duration-200 ease-out hover:-rotate-6 hover:scale-105 active:scale-[0.96]`}
    />
  );
}
