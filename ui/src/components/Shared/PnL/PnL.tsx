import { Fade, Td, Text } from '@chakra-ui/react';
import { stringToDecimal, formatNumberToUsd } from '../../../utils';

interface PnLProps {
  amount: string;
  entryPrice: string;
  lastPrice: string;
}

export const PnL = ({ amount, entryPrice, lastPrice }: PnLProps) => {
  const pnl = stringToDecimal(amount);

  const entry = parseInt(entryPrice) / 1e18;
  const last = parseInt(lastPrice) / 1e18;

  const percentageDiff = (100 * (last - entry)) / entry;
  return (
    <Td border="none">
      <Fade in>
        <Text
          fontFamily="heading"
          fontWeight={500}
          fontSize="14px"
          lineHeight="20px"
          color={pnl >= 0 ? 'green.500' : 'red.500'}
        >
          {`${pnl >= 0 ? '+' : ''}${formatNumberToUsd(stringToDecimal(amount))}`}
        </Text>
        <Text color="gray.500" fontSize="12px" lineHeight="16px" fontFamily="heading">
          {pnl >= 0 ? '+' : '-'}
          {percentageDiff.toFixed(2)}%
        </Text>
      </Fade>
    </Td>
  );
};