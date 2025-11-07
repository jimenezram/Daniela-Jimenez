
export interface Plan {
  title: string;
  subtitle: string;
  isPopular: boolean;
  isPremium: boolean;
  features: Record<string, string[]>;
  price: string[];
  cta: string;
}

export interface ParsedCsvData {
  features: string[];
  plans: Plan[];
}
