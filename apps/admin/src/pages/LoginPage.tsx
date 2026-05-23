export function LoginPage() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-xl font-semibold">Admin sign-in</h1>
        <p className="mt-2 text-sm text-slate-400">
          Wire Supabase Auth with <code className="text-brand-saffron">app_metadata.role = admin</code>{" "}
          before production. This scaffold is UI-only.
        </p>
      </div>
    </div>
  );
}
