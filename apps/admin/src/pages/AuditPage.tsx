export function AuditPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Audit log</h1>
      <p className="mt-2 text-slate-400">
        Surface <code className="text-brand-saffron">public.audit_log</code> entries including AI parse
        events from <code className="text-brand-saffron">parse-earning</code>.
      </p>
    </div>
  );
}
