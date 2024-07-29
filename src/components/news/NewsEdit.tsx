import { Box, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { FC, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { JEditor } from "../editor/JoditEditor";
import { SEditor } from "../editor/SunEditor";

enum EditorType {
  Jodit = 'Jodit',
  SunEditor = 'SunEditor'
}

export const NewsEdit: FC = () => {
  const [ editorType, setEditorType ] = useState(EditorType.Jodit);

  const onEditorToggle = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: EditorType,
  ) => {
    setEditorType(newAlignment)
  } 

  return (
    <DashboardLayout>
      <ToggleButtonGroup
        color="primary"
        value={editorType}
        exclusive
        onChange={onEditorToggle}
        aria-label="Platform"
        sx={{
          p: 2,
        }}
      >
        <ToggleButton value={EditorType.Jodit}>Jodit</ToggleButton>
        <ToggleButton value={EditorType.SunEditor}>SunEditor</ToggleButton>
      </ToggleButtonGroup> 
      <Box sx={{ pr: 2, pl: 2 }}>
        {
          (() => {
            switch(editorType) {
              case EditorType.Jodit:
                return <Box><JEditor placeholder={'Hello, world!'} /></Box>
              case EditorType.SunEditor:
                return <Box><SEditor onSave={() => {}} /></Box>
            }
          })()
        }
      </Box>
    </DashboardLayout>
  );
}
