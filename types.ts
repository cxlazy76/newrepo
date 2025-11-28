export interface Character {
  id: string;
  name: string;
  description: string;
  image: string;
  color: string;
  category: 'trending' | 'christmas' | 'roast';
}