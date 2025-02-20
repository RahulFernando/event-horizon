"use client";
import { LinearProgress, linearProgressClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

const JobProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.secondary.main,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.secondary.main,
    }),
  },
}));

export default JobProgressBar;
