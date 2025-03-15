import { Card, CardActionArea, CardContent, Skeleton } from "@mui/material";
import React from "react";

const ProviderCardSkeleton = () => {
  return (
    <Card variant="elevation" elevation={2}>
      <Skeleton variant="rectangular" width="100%" height="140px" />
      <CardContent>
        <Skeleton variant="text" width="80%" />
      </CardContent>
      <CardActionArea>
        <Skeleton variant="rectangular" width={50} height={25} />
      </CardActionArea>
    </Card>
  );
};

export default ProviderCardSkeleton;
