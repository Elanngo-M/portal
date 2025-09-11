import { Tabs, Tab, Stack, Typography } from "@mui/material";
import AssignmentAccordion from "./assignmentAccordian";
import { assignment } from "../types";

export default function AssignmentTabs({
  tabIndex,
  setTabIndex,
  pendingAssignments,
  submittedAssignments,
  gradedAssignments,
  studentEmail,
  answers,
  setAnswers,
  onSubmit,
}:any) {
  return (
    <>
      <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
        <Tab label={`Pending Assignments (${pendingAssignments.length})`} />
        <Tab label={`Submitted Assignments (${submittedAssignments.length})`} />
        <Tab label={`Graded Assignments (${gradedAssignments.length})`} />
      </Tabs>

      <Stack spacing={2} sx={{ mt: 2 }}>
        {tabIndex === 0 &&
          (pendingAssignments.length === 0 ? (
            <Typography>No pending assignments</Typography>
          ) : (
            pendingAssignments.map((assignment:assignment) => (
              <AssignmentAccordion
                key={`${assignment.name}${assignment.teacher}`}
                assignment={assignment}
                studentEmail={studentEmail}
                type="pending"
                answer={answers[assignment.name]}
                setAnswers={setAnswers}
                onSubmit={onSubmit}
              />
            ))
          ))}

        {tabIndex === 1 &&
          (submittedAssignments.length === 0 ? (
            <Typography>No non graded submissions yet.</Typography>
          ) : (
            submittedAssignments.map((assignment:assignment) => (
              <AssignmentAccordion
                key={`${assignment.name}${assignment.teacher}`}
                assignment={assignment}
                studentEmail={studentEmail}
                type="submitted"
              />
            ))
          ))}

        {tabIndex === 2 &&
          (gradedAssignments.length === 0 ? (
            <Typography>No graded assignments yet.</Typography>
          ) : (
            gradedAssignments.map((assignment:assignment) => (
              <AssignmentAccordion
                key={`${assignment.name}${assignment.teacher}`}
                assignment={assignment}
                studentEmail={studentEmail}
                type="graded"
              />
            ))
          ))}
      </Stack>
    </>
  );
}
