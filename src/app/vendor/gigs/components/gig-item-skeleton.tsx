import { Card, CardContent, CardHeader, Skeleton, Stack } from "@mui/material";
import React from "react";

const GigItemSkeleton = () => (
  <Card>
    <CardHeader
      title={<Skeleton variant="text" width={160} height={10} />}
      subheader={<Skeleton variant="text" width={50} height={10} />}
      action={<Skeleton variant="rounded" width={15} height={15} />}
    />
    <CardContent>
      <Skeleton variant="text" width={260} height={10} />
      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: "flex-start",
          alignItems: "center",
          mt: 2,
        }}
      >
        {[
          [1, 2, 3].map((eventType) => (
            <Skeleton
              key={eventType}
              variant="rounded"
              width={50}
              height={20}
            />
          )),
        ]}
      </Stack>
    </CardContent>
  </Card>
);

export default GigItemSkeleton;
