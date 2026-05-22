export interface ProviderCardProps {
  id: number;
  title: string;
  src: string;
  ratings: number;
  onClick: (id: number) => void;
}
