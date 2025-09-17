import { StudentState } from "@/redux_files/user/AllStudentSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  Input,
  Paper,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

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
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});

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
  const handleRemarksChange = (key: string, value: string | null) => {
    if (value !== null) {
      setRemarks((prev) => ({ ...prev, [key]: value }));
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      {assignments.length == 0 && <Typography>No data found</Typography>}
      {assignments.map((assignment) => {
        const submissions = assignment.filteredSubmittedStudents || [];
        return (
          <Container key={assignment.name} sx={{ padding: 3, marginBottom: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {assignment.name} — <em>{assignment.dueDate}</em>
            </Typography>

            {/* Missing Submissions Accordion */}
            {showMissingStudents && (
              <Accordion sx={{ marginBottom: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">
                    Missing Submissions ({assignment.missingStudents?.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {assignment.missingStudents?.length === 0 ? (
                    <Typography variant="body2" color="success.main">
                      ✅ All students have submitted this assignment.
                    </Typography>
                  ) : (
                    <Stack spacing={1}>
                      {assignment.missingStudents.map((student: any) => (
                        <Paper
                          key={student.email}
                          variant="outlined"
                          sx={{ padding: 1 }}
                        >
                          <Typography variant="body2">
                            <strong>{student.name}</strong> —{" "}
                            <em>{student.email}</em>
                          </Typography>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </AccordionDetails>
              </Accordion>
            )}

            {/* Submitted Assignments Accordion */}

            {!showMissingStudents &&
              submissions.length > 0 &&
              submissions.map((submission: any, index: any) => {
                const isGraded = submission.grade != null;
                const studentName = getStudentName(submission.student);
                const key = getKey(assignment.name, submission.student);
                const currentRating = ratings[key] ?? submission.grade ?? 0;
                const currentRemarks = remarks[key] ?? submission.remarks ?? "";

                return (
                  <Accordion
                    key={`${assignment.name}-${submission.student}-${index}`}
                    sx={{ marginBottom: 2 }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>
                        {studentName} ({submission.student})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Paper elevation={1} sx={{ padding: 2 }}>
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
                          <>
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
                              <input
                                type="hidden"
                                name="remarks"
                                value={currentRemarks}
                              />
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 5,
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Rating
                                    name={`rating-${key}`}
                                    precision={0.5}
                                    value={currentRating}
                                    onChange={(event, newValue) =>
                                      handleRatingChange(key, newValue)
                                    }
                                    sx={{ py: 2, mr: 1 }}
                                  />
                                  {currentRating > 0 ? (
                                    <Button
                                      onClick={() => handleRatingChange(key, 0)}
                                    >
                                      Clear
                                    </Button>
                                  ) : null}
                                </div>
                                <TextField
                                  label="Remarks"
                                  value={remarks[key] ?? ""}
                                  onChange={(event) =>
                                    handleRemarksChange(key, event.target.value)
                                  }
                                  required
                                />
                              </div>

                              <Button
                                sx={{ mt: 2 }}
                                onClick={() => {
                                  rateAction({
                                    assignmentName: assignment.name,
                                    studentName: submission.student,
                                    rating: currentRating,
                                    remarks: currentRemarks,
                                    teacher: assignment.teacher,
                                  });
                                }}
                                disabled={ratePending}
                                variant="contained"
                              >
                                Submit Grade
                              </Button>
                            </form>
                          </>
                        ) : (
                          <>
                            <Typography sx={{ mt: 2 }}>
                              <strong>Grade:</strong>
                            </Typography>
                            <Rating value={submission.grade} readOnly />
                            <Typography sx={{ mt: 2 }}>
                              <strong>Remarks:</strong>
                            </Typography>
                            <Input
                              type="text"
                              value={submission.remarks}
                              readOnly
                            />
                          </>
                        )}
                      </Paper>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
          </Container>
        );
      })}
    </div>
  );
}
