export interface DialogProps {
  open: boolean;
  title: string;
  content?: string | React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}
