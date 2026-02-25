const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 bottom-0 w-full">
      <div className="container mx-auto py-6 px-4 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>
          &copy; {new Date().getFullYear()} PolyLingo AI. All rights reserved.
        </p>
        <p className="mt-1">Developed by Mozammil</p>
      </div>
    </footer>
  );
};

export default Footer;
