export default function JournalArea({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-white/30 tracking-widest uppercase">Journal</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Write freely. This stays on your device."
        rows={6}
        className="w-full resize-none bg-white/5 border border-white/10 rounded-xl p-4 text-white/80 placeholder:text-white/20 text-sm leading-relaxed focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all"
        style={{ fontFamily: 'inherit' }}
      />
      <p className="text-xs text-white/20 text-right">{value.length} chars</p>
    </div>
  );
}