export interface Character {
  id: string;
  name: string;
  description: string;
  image: string;
  previewVideo?: string;
  category: 'trending' | 'christmas' | 'roast';
}