import Link from "next/link";
import { ReactNode } from "react";
import Logo from "@/components/shared/logo";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerHref: string;
}

export default function AuthShell({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerHref,
}: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-center text-2xl font-semibold text-slate-900">
          {title}
        </h1>
        <p className="mt-1 mb-6 text-center text-sm text-slate-500">
          {subtitle}
        </p>
        {children}
        <p className="mt-6 text-center text-sm text-slate-600">
          {footerText}{" "}
          <Link
            href={footerHref}
            className="font-medium text-indigo-600 hover:underline"
          >
            {footerLinkText}
          </Link>
        </p>
      </div>
    </main>
  );
}
