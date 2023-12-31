import React, { Dispatch, SetStateAction, memo } from "react";

import { Actionsheet, Text, Radio, Box, useColorModeValue } from "native-base";
import { useTranslation } from "react-i18next";

import { Rate } from "../../types";

type RateActionSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  rate: Rate;
  setRate: Dispatch<SetStateAction<Rate>>;
};

const rates = ["year", "month", "week", "day", "once"] as Rate[];

const RateActionSheet = memo(
  ({ isOpen, onClose, rate, setRate }: RateActionSheetProps) => {
    const { t } = useTranslation("setting");

    const textColor = useColorModeValue("muted.600", "muted.200");

    return (
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Radio.Group
            name="rates"
            defaultValue="0"
            onChange={(value) => {
              setRate(value as Rate);
              onClose();
            }}
            value={rate.toString()}
          >
            {rates.map((rate, index) => (
              <Radio
                key={index}
                value={rate}
                ml="20"
                my="2"
                colorScheme="brand"
              >
                <Box ml="1" w="100%">
                  <Text color={textColor} bold>
                    {t(rate)}
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

export default RateActionSheet;
