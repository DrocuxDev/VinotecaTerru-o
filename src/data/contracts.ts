export type ImageAsset = { src: string; alt: string; width: number; height: number };
export type Wine = {
  id: string; slug: string; name: string; vintage: number; region: string; varieties: string[];
  description: string; priceCents: number; images: ImageAsset[];
  technical: Record<string, string>; available: boolean; type: 'Tinto' | 'Blanco' | 'Rosado';
  edition: string; tone: string;
};
export type Tasting = {
  id: string; title: string; region: string; date: string; priceCents: number;
  location: string; images: ImageAsset[]; status: 'available' | 'full' | 'waitlist'; capacity: number; description: string;
};
export type ClubPlan = { id: string; name: string; priceCents: number; frequency: string; benefits: string[] };
export type CartItem = { productId: string; quantity: number };
export type TransitionContext = { from: string; to: string; productId?: string; navigation: 'POP' | 'PUSH' | 'REPLACE' };
