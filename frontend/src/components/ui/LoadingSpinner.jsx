export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-10 h-10 border-4 border-white/10 border-t-[#e94560] rounded-full animate-spin" />
    </div>
  );
}
