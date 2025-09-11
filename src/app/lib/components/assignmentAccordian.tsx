import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Button, Paper, Rating, TextField, Typography } from "@mui/material";
import { assignment } from "../types";

export default function AssignmentAccordion({
  assignment,
  studentEmail,
  type,
  answer,
  setAnswers,
  onSubmit,
  notSubmittedStudents = [],
}: {
  assignment: assignment;
  studentEmail: string;
  type: "pending" | "submitted" | "graded";
  answer?: string;
  setAnswers?: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  onSubmit?: (name: string, subject: string, teacher: string, minCount: number) => void;
  notSubmittedStudents?: string[];
}) {
  const submission = assignment.submitted?.find((s) => s.student === studentEmail);
  const dueDate = new Date(assignment.dueDate);
  const todayDate = new Date();
  const daysLeft = Math.ceil((dueDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Accordion key={assignment.name}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{assignment.name}</Typography>
        <Typography mx={5}>({assignment.subject})</Typography>
        {type === "pending" && (
          <Typography mx={5}>
            {daysLeft >= 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
          </Typography>
        )}
      </AccordionSummary>
      <AccordionDetails>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="body2">Subject: {assignment.subject}</Typography>
          <Typography variant="body2">Teacher: {assignment.teacher}</Typography>
          <Typography variant="body2">Due: {assignment.dueDate}</Typography>
          <Typography variant="body2">Min Words: {assignment.minCount}</Typography>

          {type === "pending" && studentEmail && (
            <>
              <TextField
                label="Your Answer"
                multiline
                fullWidth
                rows={4}
                value={answer || ""}
                onChange={(e) =>
                  setAnswers?.((prev) => ({ ...prev, [assignment.name]: e.target.value }))
                }
                sx={{ mt: 2 }}
              />
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() =>
                  onSubmit?.(
                    assignment.name,
                    assignment.subject,
                    assignment.teacher,
                    Number(assignment.minCount) || 0
                  )
                }
              >
                Submit
              </Button>
            </>
          )}

          {type === "pending" && notSubmittedStudents.length > 0 && (
            <>
              <Typography sx={{ mt: 2 }} variant="subtitle2">
                Students who haven't submitted:
              </Typography>
              <ul>
                {notSubmittedStudents.map((email) => (
                  <li key={email}>{email}</li>
                ))}
              </ul>
            </>
          )}

          {type !== "pending" && (
            <>
              <Typography sx={{ mt: 1 }}>Your Answer:</Typography>
              <Typography>{submission?.answer}</Typography>
              <Typography sx={{ mt: 2 }}>Grade:</Typography>
              <Rating value={submission?.grade} precision={0.5} readOnly />
            </>
          )}
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
