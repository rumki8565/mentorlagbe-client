import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="text-2xl font-bold tracking-tight text-indigo-600"
    >
      Mentor<span className="text-slate-900">Lagbe</span>
    </Link>
  );
}
