export type Profile = {
  companyWebsite: string;
  twitter: string;
  linkedin: string;
  github: string;
  status: string;
};

const KEY = "founderduel.profile";

export function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Profile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: Profile) {
  localStorage.setItem(KEY, JSON.stringify(profile));
}
