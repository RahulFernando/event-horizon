import { useState } from "react";

const useDialog = () => {
  const [open, setOpen] = useState(false);

  const clickOpenHandler = () => setOpen(true);

  const clickCloseHandler = () => setOpen(false);

  return {
    open,
    clickOpenHandler,
    clickCloseHandler,
  };
};

export default useDialog;
