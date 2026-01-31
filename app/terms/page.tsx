"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AGE_COOKIE, TERMS_COOKIE } from "@/lib/terms";

const TERMS_TEXT = `
Welcome to SloaneX. This platform distributes adult, erotic, and sexually explicit content intended
solely for consenting adults. By continuing, you agree to the terms below:

1. Age and consent: You confirm you are at least 18 years old (or the legal age of majority in your
jurisdiction) and that all content you view or access depicts consenting adults.
2. Personal responsibility: You are responsible for how you access, view, and use the content.
3. No unlawful use: You will not use the site in violation of any laws or regulations, including
those related to obscenity, privacy, or intellectual property.
4. License: Content is licensed for personal, non-commercial viewing only. You may not download,
distribute, sell, or reproduce content without written permission.
5. Privacy: We collect limited account and usage data to operate the service. Do not share your
credentials. You are responsible for account security.
6. Health disclaimer: Content is provided for entertainment purposes only. We do not provide
medical, legal, or professional advice.
7. No warranties: The service is provided “as is” and “as available” without warranties of any
kind, express or implied, including merchantability, fitness for a particular purpose, or
non-infringement.
8. Limitation of liability: To the fullest extent permitted by law, we are not liable for any
indirect, incidental, special, consequential, or punitive damages arising from your use of the
service.
9. Indemnification: You agree to indemnify and hold us harmless from claims, losses, or damages
arising out of your violation of these terms or misuse of the service.
10. Content removal: We may remove or restrict content and access at our discretion for compliance
or safety reasons.
11. Jurisdiction: These terms are governed by the laws applicable in our operating jurisdiction.
12. Updates: We may update these terms at any time, and continued use constitutes acceptance of
the updated terms.
`;

export default function TermsPage() {
  const router = useRouter();
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  const paragraphs = useMemo(() => TERMS_TEXT.trim().split("\n"), []);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const bottomReached = target.scrollTop + target.clientHeight >= target.scrollHeight - 8;
    if (bottomReached) {
      setScrolledToBottom(true);
    }
  };

  const handleAgree = () => {
    setAgreed(true);
  };

  const handleAgeConfirm = () => {
    setAgeConfirmed(true);
    if (agreed) {
      document.cookie = `${TERMS_COOKIE}=true; path=/; max-age=31536000`;
      document.cookie = `${AGE_COOKIE}=true; path=/; max-age=31536000`;
      router.push("/");
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="card p-10">
        <h1 className="text-3xl font-semibold">Terms of Agreement</h1>
        <p className="mt-2 text-sm text-night/60">
          Please read the full terms below. You must agree and confirm your age to continue.
        </p>
        <div
          className="mt-6 max-h-[320px] overflow-y-auto rounded-3xl border border-rose/40 bg-white/70 p-6 text-sm text-night/80"
          onScroll={handleScroll}
        >
          <div className="space-y-4">
            {paragraphs.map((line, index) => (
              <p key={`${line}-${index}`}>{line}</p>
            ))}
          </div>
          {scrolledToBottom && (
            <div className="mt-6 flex justify-center">
              <button type="button" className="button-primary" onClick={handleAgree}>
                I agree
              </button>
            </div>
          )}
        </div>
        <div className="mt-6 flex flex-col items-center gap-4">
          <button
            type="button"
            className="button-secondary"
            onClick={handleAgeConfirm}
            disabled={!agreed}
          >
            I am over 18 years of age
          </button>
          {!agreed && (
            <p className="text-xs text-night/60">
              Scroll to the bottom of the terms and click “I agree” before confirming your age.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
