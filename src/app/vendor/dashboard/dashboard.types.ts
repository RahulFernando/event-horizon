import { SvgIconComponent } from "@mui/icons-material";

export interface MenuItemProps {
  icon: SvgIconComponent;
  text: string;
  href: string;
}

export interface IGigPerformance {
  id: string;
  title: string;
  totalJobs: number;
  completedJobs: number;
  completionRate: string;
  earnings: number;
}
