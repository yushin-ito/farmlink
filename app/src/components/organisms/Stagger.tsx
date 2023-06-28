import { Stagger as NativeBaseStagger, IconButton, Icon } from "native-base";
import { Feather } from "@expo/vector-icons";
import React, { memo } from "react";

type StaggerProps = {
  isOpen: boolean;
  pickImageByCamera: () => void;
  pickImageByLibrary: () => void;
};

const Stagger = memo(
  ({ isOpen, pickImageByCamera, pickImageByLibrary }: StaggerProps) => {
    return (
      <NativeBaseStagger
        visible={isOpen}
        initial={{
          opacity: 0,
          scale: 0,
          translateY: 34,
        }}
        animate={{
          translateY: 0,
          scale: 1,
          opacity: 1,
          transition: {
            type: "spring",
            mass: 0.8,
            stagger: {
              offset: 30,
              reverse: true,
            },
          },
        }}
        exit={{
          translateY: 34,
          scale: 0.5,
          opacity: 0,
          transition: {
            duration: 100,
            stagger: {
              offset: 30,
              reverse: true,
            },
          },
        }}
      >
        <IconButton
          mb="4"
          variant="solid"
          colorScheme="brand"
          rounded="full"
          icon={<Icon as={<Feather />} size="5" name="camera" />}
          onPress={pickImageByCamera}
        />
        <IconButton
          mb="4"
          variant="solid"
          colorScheme="brand"
          rounded="full"
          icon={<Icon as={<Feather />} size="5" name="image" />}
          onPress={pickImageByLibrary}
        />
      </NativeBaseStagger>
    );
  }
);

export default Stagger;
