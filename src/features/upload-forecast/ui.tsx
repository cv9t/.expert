import { Group, Text, useMantineTheme, rem } from "@mantine/core";
import { Dropzone as MantineDropzone, MIME_TYPES } from "@mantine/dropzone";
import { useUnit } from "effector-react";
import { __DEV__ } from "~/shared/config/env";
import { Icon } from "~/shared/ui";
import { $file, fileChanged } from "./model";

export const UploadForecast = () => {
  const theme = useMantineTheme();
  const file = useUnit($file);

  return (
    <MantineDropzone
      accept={[MIME_TYPES.csv]}
      maxFiles={1}
      onDrop={(files) => {
        fileChanged(files[0]);
      }}
      onReject={(files) => {
        if (__DEV__) {
          console.log("rejected files", files);
        }
      }}
      radius="lg"
    >
      <Group
        position="center"
        sx={{ minHeight: rem(220), pointerEvents: "none" }}
      >
        <MantineDropzone.Accept>
          <Icon
            type="upload"
            size="lg"
            color={theme.colors[theme.primaryColor][6]}
          />
        </MantineDropzone.Accept>
        <MantineDropzone.Reject>
          <Icon
            type="x"
            size="lg"
            color={theme.colors[theme.primaryColor][6]}
          />
        </MantineDropzone.Reject>
        <MantineDropzone.Idle>
          <Icon type="file" size="lg" />
        </MantineDropzone.Idle>
        {file ? (
          <Text size="xl">{file.name}</Text>
        ) : (
          <div>
            <Text inline size="xl">
              Перетащите файл с прогнозами сюда или нажмите, чтобы выбрать из
              файлов
            </Text>
            <Text inline color="dimmed" mt={8}>
              Принимаем только .csv
            </Text>
          </div>
        )}
      </Group>
    </MantineDropzone>
  );
};
