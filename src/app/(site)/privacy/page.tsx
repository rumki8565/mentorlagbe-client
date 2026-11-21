import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | MentorLagbe",
  description: "How MentorLagbe collects, uses and protects your information.",
};

const SECTIONS: { title: string; text: string }[] = [
  {
    title: "Information we collect",
    text: "When you sign up or sign in, we collect your name, email address and profile picture. If you use Google sign-in, Google shares these basic details with us. You may also add a phone number and a short bio to your profile.",
  },
  {
    title: "How we use your information",
    text: "We use your information to create and manage your account, show your profile to tutors or students you interact with, process tuition applications, and provide Pro plan features. We do not sell your personal information.",
  },
  {
    title: "Payments",
    text: "Pro plan payments are handled by Stripe. We never see or store your card details. We only keep a record of the transaction, such as the plan, amount and transaction ID.",
  },
  {
    title: "Images",
    text: "Profile pictures and tuition banners you upload are stored with our image host, ImgBB.",
  },
  {
    title: "Cookies",
    text: "We use a secure session cookie to keep you signed in. We do not use advertising cookies.",
  },
  {
    title: "Your choices",
    text: "You can update your name, phone, bio and picture at any time from your dashboard. To delete your account or data, contact us at the email below.",
  },
  {
    title: "Contact",
    text: "Questions about this policy? Email support@mentorlagbe.com.",
  },
];

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-slate-500">Last updated: November 2026</p>
      <p className="mt-6 leading-7 text-slate-600">
        MentorLagbe is a tuition and mentorship platform. This page explains
        what information we collect and how we use it.
      </p>
      <div className="mt-8 space-y-8">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-semibold text-slate-900">
              {section.title}
            </h2>
            <p className="mt-2 leading-7 text-slate-600">{section.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
