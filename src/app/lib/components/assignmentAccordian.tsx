import { Delete, ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Popover, Rating, TextField, Tooltip, Typography } from "@mui/material";
import { assignment } from "../types";
import React, { useEffect, useRef, useState } from "react";

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
  onSubmit?: (name: string, subject: string, teacher: string, minCount: number , setLocalAlert:any) => void;
  notSubmittedStudents?: string[];
}) {
  const submission = assignment.submitted?.find((s) => s.student === studentEmail);
  const dueDate = new Date(assignment.dueDate);
  const todayDate = new Date();
  const daysLeft = Math.ceil((dueDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
  const [localAlert, setLocalAlert] = useState<{ type: "success" | "error" | "warning", message: string } | null>(null);
  
const textFieldRef = useRef(null);
const [anchorEl, setAnchorEl] = useState(null);

useEffect(() => {
  if (localAlert && textFieldRef.current) {
    setAnchorEl(textFieldRef.current); 
  }
}, [localAlert]);


const open = Boolean(anchorEl);
const id = open ? 'simple-popover' : undefined;


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
<Dialog
        open={localAlert?.type==="warning" ?true:false}
        onClose={()=>setLocalAlert(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText color="error" id="alert-dialog-description">
            {localAlert?.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={()=>setLocalAlert(null)}>
                Close
            </Button>
        </DialogActions>
      </Dialog>

              
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
  inputRef={textFieldRef}
/>

              <Button
  variant="contained"
  sx={{ mt: 2 }}
  onClick={() =>
    onSubmit?.(
      assignment.name,
      assignment.subject,
      assignment.teacher,
      Number(assignment.minCount) || 0,
      setLocalAlert
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
