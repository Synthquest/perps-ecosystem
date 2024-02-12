import {
  Flex,
  Heading,
  Box,
  Tabs,
  TabPanels,
  TabPanel,
  Text,
  Table,
  Tbody,
  TableContainer,
} from '@chakra-ui/react';
import React, { useMemo, useRef, useState } from 'react';
import { PositionsTable } from '../Positions';
import { ClosedPositionsTable } from './ClosedPositions';
import { AccountActionsTable } from '../Actions';
import { useSearchParams } from 'react-router-dom';
import TabHeader, { TabHeaderItemProps } from '../Tab';
import useTabHandler from '../../hooks/helpers/useTabHandler';
import { LiquidatedPositionsTable } from './LiquidatedPositions';
import OpenPositionItem from './OpenPositionItem';
import PositionItem from './PositionItem';

interface TraderAccountStatsProps {
  kwentaAccount?: string;
  polynomialAccount?: string;
}

enum TabKeyEnum {
  OPENING = 'opening',
  CLOSED = 'closed',
  LIQUIDATED = 'liquidated',
}

export const TraderAccountStats = ({
  kwentaAccount,
  polynomialAccount,
}: TraderAccountStatsProps) => {
  const actionsRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [actionFilter, setActionFilter] = useState<boolean>(false);
  const [currentPosition, setCurrentPosition] = useState<any | undefined>();

  const updateTradeId = (
    tradeId: string,
    timestampOpen: string,
    market: string,
    timestampClose?: string
  ) => {
    setActionFilter(true);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('tradeId', tradeId.toString());
    newParams.set('openTimestamp', timestampOpen.toString());
    newParams.set('markets', market.toString());
    timestampClose
      ? newParams.set('closeTimestamp', timestampClose.toString())
      : newParams.delete('closeTimestamp');
    setSearchParams(newParams);

    actionsRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const onSelectPosition = (position: any) => {
    setCurrentPosition(position);
    setActionFilter(true);
  };

  const resetActionFilters = () => {
    const newParams = new URLSearchParams();
    setSearchParams(newParams);
    setActionFilter(false);
    setCurrentPosition(undefined);
  };

  const { tab, handleTab } = useTabHandler(TabKeyEnum.OPENING, false);
  const tabHeaders = useMemo(() => {
    return [
      { tabKey: TabKeyEnum.OPENING, title: 'Opening', badgeNumber: 5 },
      { tabKey: TabKeyEnum.CLOSED, title: 'Closed', badgeNumber: 6 },
      { tabKey: TabKeyEnum.LIQUIDATED, title: 'Liquidated', badgeNumber: 7 },
    ] as TabHeaderItemProps[];
  }, []);

  const onTabChange = (tab: string) => {
    handleTab(tab);
    resetActionFilters();
    setCurrentPosition(undefined);
  };

  return (
    <>
      <Text mb="10px" fontSize="18px" fontWeight="700">
        Positions
      </Text>
      <Tabs variant="soft-rounded" colorScheme="blue.900">
        <TabHeader tabs={tabHeaders} activeTab={tab} onTabChange={onTabChange} />
        <TabPanels>
          <TabPanel p={0}>
            {tab === TabKeyEnum.OPENING && (
              <Box>
                <PositionsTable
                  kwentaAccount={kwentaAccount ?? ''}
                  polynomialAccount={polynomialAccount ?? ''}
                  actionsRef={actionsRef}
                  actionFilter={actionFilter}
                  resetActionFilters={resetActionFilters}
                  updateTradeId={updateTradeId}
                  onSelectPosition={onSelectPosition}
                  currentPosition={currentPosition}
                />
              </Box>
            )}
          </TabPanel>
          <TabPanel p={0}>
            {tab === TabKeyEnum.CLOSED && (
              <Box>
                <ClosedPositionsTable
                  actionsRef={actionsRef}
                  actionFilter={actionFilter}
                  resetActionFilters={resetActionFilters}
                  updateTradeId={updateTradeId}
                  onSelectPosition={onSelectPosition}
                  currentPosition={currentPosition}
                />
              </Box>
            )}
          </TabPanel>
          <TabPanel p={0}>
            {tab === TabKeyEnum.LIQUIDATED && (
              <Box>
                <LiquidatedPositionsTable
                  actionsRef={actionsRef}
                  actionFilter={actionFilter}
                  resetActionFilters={resetActionFilters}
                  updateTradeId={updateTradeId}
                  onSelectPosition={onSelectPosition}
                  currentPosition={currentPosition}
                />
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Actions Section */}
      <Box mt={6} ref={actionsRef}>
        <Flex mb="10px" justifyContent={'space-between'}>
          <Heading fontSize="18px" lineHeight="28px">
            Actions
          </Heading>
        </Flex>
        {actionFilter && currentPosition && (
          <TableContainer
            maxW="100%"
            borderColor="gray.900"
            borderWidth="1px"
            borderRadius="5px"
            sx={{
              borderCollapse: 'separate !important',
              borderSpacing: 0,
            }}
          >
            <Table bg="navy.700">
              <Tbody>
                {currentPosition.closeTimestamp ? (
                  <PositionItem
                    isSelected
                    hasClear
                    position={currentPosition}
                    onSelect={() => {
                      resetActionFilters();
                      setCurrentPosition(undefined);
                    }}
                  />
                ) : (
                  <OpenPositionItem
                    isSelected
                    hasClear
                    position={currentPosition}
                    onSelect={() => {
                      resetActionFilters();
                      setCurrentPosition(undefined);
                    }}
                  />
                )}
              </Tbody>
            </Table>
          </TableContainer>
        )}

        <AccountActionsTable />
      </Box>
    </>
  );
};
