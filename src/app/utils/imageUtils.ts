const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const getImageUrl = (photoProfile: string | null | undefined): string => {
  if (!photoProfile) return '/avatar.png';
  
  if (photoProfile.startsWith('http')) return photoProfile;
  
  if (photoProfile.startsWith('/uploads/')) {
    return `${API_URL.replace('/api', '')}${photoProfile}`;
  }
  
  return photoProfile;
};