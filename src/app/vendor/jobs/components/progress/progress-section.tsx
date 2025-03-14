import { Button, Paper, Stack } from "@mui/material";
import ProgressDisplay from "./progress-display";
import { IPercentage, ProgressSectionProps } from "../../jobs.types";
import { useContext } from "react";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import useSWR from "swr";

async function fetchPercentage(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as IPercentage;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({
  onCalendarOpen,
}) => {
  const { account } = useContext(AuthContext);

  const { data: summary } = useSWR(
    account?.user.vendors?.id &&
      `/api/vendors/${account?.user.vendors?.id}/jobs/summary`,
    fetchPercentage
  );

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "space-between" }}
      >
        <ProgressDisplay
          percentage={
            summary?.completion_percentage ? +summary.completion_percentage : 0
          }
        />
        <Button variant="contained" size="small" onClick={onCalendarOpen}>
          View My Calendar
        </Button>
      </Stack>
    </Paper>
  );
};

export default ProgressSection;
