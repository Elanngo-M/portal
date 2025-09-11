import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Paper,
  Rating,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";
import { assignment } from "../types";
import { StudentState } from "@/redux_files/user/AllStudentSlice";

type Props = {
  assignments: any[];
  rateAction?: any;
  ratePending?: boolean;
  students: StudentState[];
  showMissingStudents?: boolean;
};

export default function TeacherAssignmentList({
  assignments,
  rateAction,
  ratePending = false,
  students,
  showMissingStudents = false,
}: Props) {
  // Local rating state per submission
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});

  // Helper to get student name from email
  const getStudentName = (email: string) => {
    const student = students.find((s) => s.email === email);
    return student?.data?.name || "Unknown Student";
  };

  // Unique key for each submission
  const getKey = (assignmentName: string, studentEmail: string) =>
    `${assignmentName}-${studentEmail}`;

  // Handle rating change
  const handleRatingChange = (key: string, value: number | null) => {
    if (value !== null) {
      setRatings((prev) => ({ ...prev, [key]: value }));
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      {assignments.map((assignment) => {
        const submissions = assignment.submitted || [];

        return (
          <div key={assignment.name} style={{ marginBottom: "2rem" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {assignment.name} ({assignment.dueDate})
            </Typography>

            {/* Show missing students if enabled */}
            {showMissingStudents && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  <strong>Missing Submissions:</strong>
                </Typography>
                {assignment.missingStudents?.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    All students have submitted this assignment.
                  </Typography>
                ) : (
                  <List dense>
                    {assignment.missingStudents.map((email: string) => (
                      <ListItem key={email}>
                        <ListItemText
                          primary={`${getStudentName(email)} (${email})`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </>
            )}

            {/* Show submitted assignments */}
            {!showMissingStudents &&  submissions.length > 0 &&
              submissions.map((submission:any, index:any) => {
                const isGraded = submission.grade != null;
                const studentName = getStudentName(submission.student);
                const key = getKey(assignment.name, submission.student);
                const currentRating =
                  ratings[key] ?? submission.grade ?? 0;

                return (
                  <Accordion
                    key={`${assignment.name}-${submission.student}-${index}`}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>
                        {studentName} ({submission.student})
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Paper elevation={2} sx={{ p: 2 }}>
                        <Typography variant="body2">
                          <strong>Due Date:</strong> {assignment.dueDate}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          <strong>Answer:</strong>
                        </Typography>
                        <Typography sx={{ mt: 1 }}>
                          {submission.answer}
                        </Typography>

                        {!isGraded ? (
                          <form action={rateAction}>
                            <input
                              type="hidden"
                              name="assignmentName"
                              value={assignment.name}
                            />
                            <input
                              type="hidden"
                              name="studentName"
                              value={submission.student}
                            />
                            <input
                              type="hidden"
                              name="rating"
                              value={currentRating}
                            />
                            <input
                              type="hidden"
                              name="teacher"
                              value={assignment.teacher}
                            />

                            <Rating
                              name={`rating-${key}`}
                              precision={0.5}
                              value={currentRating}
                              onChange={(event, newValue) =>
                                handleRatingChange(key, newValue)
                              }
                              sx={{ mt: 2 }}
                            />

                            <Button
                              sx={{ mt: 2 }}
                              type="submit"
                              disabled={ratePending}
                              variant="contained"
                            >
                              Submit Grade
                            </Button>
                          </form>
                        ) : (
                          <>
                            <Typography sx={{ mt: 2 }}>
                              <strong>Grade:</strong>
                            </Typography>
                            <Rating value={submission.grade} readOnly />
                          </>
                        )}
                      </Paper>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}
