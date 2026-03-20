export const DashboardMockup = () => (
  <div className="bg-slate-900 rounded-2xl shadow-2xl p-4 border border-slate-700">
    <div className="flex gap-2 mb-4">
      <div className="w-3 h-3 rounded-full bg-red-500" />
      <div className="w-3 h-3 rounded-full bg-yellow-500" />
      <div className="w-3 h-3 rounded-full bg-green-500" />
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-slate-700 rounded w-3/4" />
      <div className="grid grid-cols-3 gap-2">
        <div className="h-20 bg-slate-800 rounded-lg" />
        <div className="h-20 bg-slate-800 rounded-lg" />
        <div className="h-20 bg-slate-800 rounded-lg" />
      </div>
      <div className="h-32 bg-slate-800 rounded-lg" />
    </div>
  </div>
);
