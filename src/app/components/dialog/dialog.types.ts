export interface DialogProps {
  open: boolean;
  title: string;
  content?: string | React.ReactNode;
  confirmButtonLabel?: string;
  footerVisible?: boolean;
  footer?: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  onClose: () => void;
  onConfirm: () => void;
}
