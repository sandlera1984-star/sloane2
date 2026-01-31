export const TERMS_COOKIE = "termsAccepted";
export const AGE_COOKIE = "ageConfirmed";

export function hasTermsConsent() {
  if (typeof document === "undefined") {
    return false;
  }
  const cookie = document.cookie;
  return cookie.includes(`${TERMS_COOKIE}=true`) && cookie.includes(`${AGE_COOKIE}=true`);
}
