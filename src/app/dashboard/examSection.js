const statusBadge = {
  Active: "text-emerald-200 bg-emerald-500/10 border border-emerald-500/30",
  Upcoming: "text-amber-200 bg-amber-500/10 border border-amber-500/30",
  Previous: "text-slate-300 bg-slate-500/10 border border-slate-600/40",
};

const formatDate = (value) => {
  if (!value) return "-";
  const dateValue = value.seconds ? new Date(value.seconds * 1000) : new Date(value);
  return dateValue.toLocaleString();
};

const ExamSection = ({ title, exams = [], renderAction }) => {
  const emptyState = (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-400 shadow-inner shadow-black/30">
      No {title.toLowerCase()} exams
    </div>
  );

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg font-semibold text-white">{title}</h4>
        <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
          {exams.length} {exams.length === 1 ? "exam" : "exams"}
        </div>
      </div>
      {exams.length === 0 ? (
        emptyState
      ) : (
        <div className="grid gap-4">
          {exams.map((exam) => {
            const start = formatDate(exam.date);
            const end = formatDate(exam.endDate);
            const badge =
              title.toLowerCase() === "current"
                ? statusBadge.Active
                : title.toLowerCase() === "upcoming"
                ? statusBadge.Upcoming
                : statusBadge.Previous;

            return (
              <div
                key={exam.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/30 transition hover:translate-y-[-2px] hover:border-indigo-500/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-100">
                        {exam.name?.slice(0, 2)?.toUpperCase() || "EX"}
                      </div>
                      <div>
                        <div className="text-base font-semibold text-white">{exam.name}</div>
                        <div className="text-xs text-slate-400">ID: {exam.id}</div>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-1 text-sm text-slate-300">
                      <div>
                        <span className="text-slate-500">Start:</span> {start}
                      </div>
                      <div>
                        <span className="text-slate-500">End:</span> {end}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge}`}>
                      {title}
                    </span>
                    {renderAction && (
                      <div className="w-full md:w-auto">{renderAction(exam)}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExamSection;
