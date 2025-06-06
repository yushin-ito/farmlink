import React, { Dispatch, SetStateAction, memo } from "react";

import { Actionsheet, Text, Radio, Box, useColorModeValue } from "native-base";
import { useTranslation } from "react-i18next";

import { Category } from "../../types";

type CategoryActionSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  categoryIndex: number;
  setCategoryIndex: Dispatch<SetStateAction<number>>;
};

const categories = [
  "all",
  "joining",
  "veggie",
  "fruit",
  "compost",
  "ill",
] as Category[];

const CategoryActionSheet = memo(
  ({
    isOpen,
    onClose,
    categoryIndex,
    setCategoryIndex,
  }: CategoryActionSheetProps) => {
    const { t } = useTranslation("community");

    const textColor = useColorModeValue("muted.600", "muted.200");

    return (
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Radio.Group
            name="categories"
            onChange={(value) => {
              setCategoryIndex(Number(value));
            }}
            value={categoryIndex.toString()}
          >
            {categories.map((category, index) => (
              <Radio
                key={index}
                value={index.toString()}
                ml="20"
                my="2"
                colorScheme="brand"
              >
                <Box ml="1" w="100%">
                  <Text color={textColor} bold>
                    {t(category)}
                  </Text>
                </Box>
              </Radio>
            ))}
          </Radio.Group>
        </Actionsheet.Content>
      </Actionsheet>
    );
  }
);

export default CategoryActionSheet;
