export interface DialogProps {
  open: boolean;
  title: string;
  content?: string | React.ReactNode;
  confirmButtonLabel?: string;
  footerVisible?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  onClose: () => void;
  onConfirm: () => void;
}
