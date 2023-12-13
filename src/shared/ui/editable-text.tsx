import { Box, Sx, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { useClickOutside } from "@mantine/hooks";

type EditableTextProps = {
  value: string;
  onEdit: (value: string) => void;
  styles?: {
    text?: Sx;
  };
};

export const EditableText = ({ value, onEdit, styles }: EditableTextProps) => {
  const [editing, setEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const ref = useClickOutside<HTMLInputElement>(() => {
    setEditing(false);

    const trimmedValue = editedValue.trim();
    const tempEditedValue = trimmedValue.length > 0 ? trimmedValue : value;
    onEdit(tempEditedValue);
    setEditedValue(tempEditedValue);
  });

  return (
    <Box sx={{ width: "100%" }}>
      {editing ? (
        <TextInput
          ref={ref}
          value={editedValue}
          onChange={(e) => {
            setEditedValue(e.target.value);
          }}
        />
      ) : (
        <Text
          onClick={() => {
            setEditing(true);
            // TODO: Использовать FocusTrap
            setTimeout(() => {
              ref.current.focus();
            }, 0);
          }}
          sx={{ cursor: "pointer", ...styles?.text }}
        >
          {value}
        </Text>
      )}
    </Box>
  );
};
