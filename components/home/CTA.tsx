import Link from "next/link";

const CTA = () => {
  return (
    <section className="cta">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Ready to Start Your Journey?
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
          Click the button below to launch the app and generate your first
          lesson. No sign-up required.
        </p>
        <div className="mt-8">
          <Link href="/dashboard" className="cta-link">
            Launch PolyLingo AI
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
