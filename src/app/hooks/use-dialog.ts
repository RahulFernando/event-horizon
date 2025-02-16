import { useState } from "react";
import { DialogInfo } from "../types";

const useDialog = () => {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState<DialogInfo | null>(null);

  const clickOpenHandler = (optionalInfo: DialogInfo | null) => {
    setOpen(true);
    setInfo(optionalInfo);
  };

  const clickCloseHandler = () => {
    setOpen(false);
    setInfo(null);
  };

  return {
    open,
    info,
    clickOpenHandler,
    clickCloseHandler,
  };
};

export default useDialog;
