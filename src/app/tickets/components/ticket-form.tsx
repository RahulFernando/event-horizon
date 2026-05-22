import React, { useContext, useEffect } from "react";
import { Box, Button, Grid2, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import {
  TicketCommentFormInput,
  TicketFormInput,
  TicketFormProps,
} from "../tickets.types";
import { AuthContext } from "@/app/contexts/auth/auth-context";
import { SnackbarContext } from "@/app/contexts/snackbar/snackbar-context";
import { ActionKind } from "@/app/contexts/snackbar/snackbar.types";
import { useRouter } from "next/navigation";
import { TicketComment } from "@prisma/client";
import useSWR from "swr";
import Comment from "./comment";

async function createTicket(
  url: string,
  token: string,
  { args }: { args: TicketFormInput },
) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(args),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return await response.json();
}

async function updateTicket(
  url: string,
  token: string,
  { args }: { args: TicketFormInput },
) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(args),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return await response.json();
}

async function fetchComments(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return (await response.json()) as { count: number; items: TicketComment[] };
}

async function createComment(
  url: string,
  token: string,
  { args }: { args: TicketCommentFormInput },
) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(args),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return await response.json();
}

async function deleteComment(
  url: string,
  token: string,
  { args }: { args: { id: string } },
) {
  const response = await fetch(`${url}/${args.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Something went wrong");
  }

  return await response.json();
}

const TicketForm: React.FC<TicketFormProps> = ({ ticket }) => {
  const { token } = useContext(AuthContext);
  const { snackbarToggle } = useContext(SnackbarContext);

  const router = useRouter();

  const { register, reset, handleSubmit } = useForm<TicketFormInput>({
    defaultValues: { title: "", description: "" },
  });

  const { register: commentRegister, handleSubmit: commentHandleSubmit } =
    useForm<TicketCommentFormInput>();

  const {
    data: commentResult = { count: 0, items: [] },
    mutate: refetchComments,
  } = useSWR(ticket && `/api/tickets/${ticket.id}/comments`, fetchComments);

  const { isMutating: isCreating, trigger: createNewTicket } = useSWRMutation(
    "/api/tickets",
    (url: string, { arg }: { arg: TicketFormInput }) =>
      createTicket(url, token as string, { args: arg }),
    {
      onSuccess: () => {
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: "Ticket created successfully",
          severity: "success",
        });
        router.replace("/tickets");
      },
      onError: (err) => {
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: err.message,
          severity: "error",
        });
      },
    },
  );

  const { isMutating: isUpdating, trigger: updateTicketInfo } = useSWRMutation(
    ticket && `/api/tickets/${ticket.id}`,
    (url: string, { arg }: { arg: TicketFormInput }) =>
      updateTicket(url, token as string, { args: arg }),
    {
      onSuccess: () => {
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: "Ticket details updated successfully",
          severity: "success",
        });
        router.replace("/tickets");
      },
      onError: (err) => {
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: err.message,
          severity: "error",
        });
      },
    },
  );

  const {
    isMutating: isCreatingComment,
    reset: resetComment,
    trigger: createNewComment,
  } = useSWRMutation(
    ticket && `/api/tickets/${ticket.id}/comments`,
    (url: string, { arg }: { arg: TicketCommentFormInput }) =>
      createComment(url, token as string, { args: arg }),
    {
      onSuccess: () => {
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: "Comment saved successfully",
          severity: "success",
        });
        refetchComments();
        resetComment();
      },
      onError: (err) => {
        snackbarToggle(ActionKind.OPEN, {
          open: true,
          message: err.message,
          severity: "error",
        });
      },
    },
  );

  const { isMutating: isDeletingComment, trigger: removeComment } =
    useSWRMutation(
      ticket && `/api/tickets/${ticket.id}/comments`,
      (url: string, { arg }: { arg: { id: string } }) =>
        deleteComment(url, token as string, { args: arg }),
      {
        onSuccess: () => {
          snackbarToggle(ActionKind.OPEN, {
            open: true,
            message: "Comment deleted successfully",
            severity: "success",
          });
          refetchComments();
        },
        onError: (err) => {
          snackbarToggle(ActionKind.OPEN, {
            open: true,
            message: err.message,
            severity: "error",
          });
        },
      },
    );

  const { items: comments = [] } = commentResult;

  const isMutating = isCreating || isUpdating;

  const btnLabel = ticket ? "Update" : "Submit";

  useEffect(() => {
    if (ticket) {
      reset({ title: ticket.title, description: ticket.description ?? "" });
    }
  }, [reset, ticket]);

  useEffect(() => {
    if (isDeletingComment) {
      snackbarToggle(ActionKind.OPEN, {
        open: true,
        message: "Please wait...",
        severity: "info",
      });
    }
  }, [isDeletingComment, snackbarToggle]);

  const submitHandler = (values: TicketFormInput) => {
    if (!ticket) {
      createNewTicket(values);
      return;
    }

    updateTicketInfo(values);
  };

  const commentSubmitHandler = (values: TicketCommentFormInput) =>
    createNewComment(values);

  const deleteCommentHandler = (id: string) => removeComment({ id });

  return (
    <>
      <form noValidate onSubmit={handleSubmit(submitHandler)}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              size="small"
              fullWidth
              label="Title"
              required
              {...register("title", { required: "Title is required" })}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              size="small"
              fullWidth
              label="Description"
              multiline
              rows={3}
              {...register("description", {
                required: "Description is required",
              })}
            />
          </Grid2>
        </Grid2>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "flex-end",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Button variant="outlined" size="small" onClick={() => reset()}>
            Reset
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={isMutating || (ticket && ticket.status !== "OPEN")}
          >
            {!isMutating && btnLabel}
            {isMutating && "Please wait..."}
          </Button>
        </Stack>
      </form>
      <Box
        component="form"
        noValidate
        sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 2 }}
        onSubmit={commentHandleSubmit(commentSubmitHandler)}
      >
        {comments.map(({ id, body, created_by, created_at }) => (
          <Comment
            key={id}
            id={id}
            body={body}
            createdAt={created_at}
            createdBy={created_by}
            onDeleteClick={deleteCommentHandler}
          />
        ))}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            size="small"
            multiline
            rows={2}
            fullWidth
            label="Comment"
            required
            {...commentRegister("body", { required: "Comment is required" })}
          />
          <Button
            variant="contained"
            size="small"
            type="submit"
            disabled={isCreatingComment}
          >
            {!isCreatingComment && "Save"}
            {isCreatingComment && "Please wait..."}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default TicketForm;
