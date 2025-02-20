import React, { useRef, useState } from "react";
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  DialogActions,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { DialogFooterProps } from "../jobs.types";
import { JobStatus } from "@prisma/client";

const options = [
  { value: JobStatus.ACCEPTED, label: "Accept" },
  { value: JobStatus.REJECTED, label: "Reject" },
];

const DialogFooter: React.FC<DialogFooterProps> = ({
  isLoading = false,
  onSubmit,
  onClose,
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const toggleHandler = () => setOpen((prev) => !prev);

  const closeHandler = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const menuItemClickHandler = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  return (
    <>
      <DialogActions>
        <Button variant="outlined" size="small" onClick={onClose}>
          Cancel
        </Button>
        <ButtonGroup
          ref={anchorRef}
          disabled={isLoading}
          variant="contained"
          size="small"
        >
          <Button onClick={onSubmit.bind(null, options[selectedIndex].value)}>
            {!isLoading && options[selectedIndex].label}
            {isLoading && "Please wait..."}
          </Button>
          <Button onClick={toggleHandler}>
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
      </DialogActions>
      <Popper
        sx={{ zIndex: 1 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={closeHandler}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option.value}
                      disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={(event) => menuItemClickHandler(event, index)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default DialogFooter;
