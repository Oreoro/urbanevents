import {useParams} from "react-router-dom";
import {useDisclosure} from "@mantine/hooks";
import {Button} from "@mantine/core";
import {IconTicket} from "@tabler/icons-react";
import {PageTitle} from "../../common/PageTitle";
import {PageBody} from "../../common/PageBody";
import {CreateTicketModal} from "../../modals/CreateTicketModal";
import {TicketsTable} from "../../common/TicketsTable";
import {SearchBarWrapper} from "../../common/SearchBar";
import {ToolBar} from "../../common/ToolBar";
import {useFilterQueryParamSync} from "../../../hooks/useFilterQueryParamSync.ts";
import {QueryFilters} from "../../../types.ts";
import {useGetTickets} from "../../../queries/useGetTickets.ts";
import {TableSkeleton} from "../../common/TableSkeleton";
import {Pagination} from "../../common/Pagination";
import {t} from "@lingui/macro";
import {useUrlHash} from "../../../hooks/useUrlHash.ts";
import { useGetEvent } from "../../../queries/useGetEvent.ts";

export const Tickets = () => {
    const [searchParams, setSearchParams] = useFilterQueryParamSync();
    const [createModalOpen, {open: openCreateModal, close: closeCreateModal}] = useDisclosure(false);
    const {eventId} = useParams();
    const {data: event} = useGetEvent(eventId);
    const ticketsQuery = useGetTickets(eventId, searchParams as QueryFilters);
    const pagination = ticketsQuery?.data?.meta;
    const tickets = ticketsQuery?.data?.data;
    const enableSorting =
        (Object.keys(searchParams).length === 0) ||
        (
            (searchParams.sortBy === 'order' || searchParams.sortBy === undefined) &&
            (searchParams.query === '' || searchParams.query === undefined)
        );

    useUrlHash('create-ticket', () => openCreateModal());

    return (
        <PageBody>
            <PageTitle>{t`Tickets`}</PageTitle>

            <ToolBar searchComponent={() => (
                <SearchBarWrapper
                    placeholder={t`Search by ticket name...`}
                    setSearchParams={setSearchParams}
                    searchParams={searchParams}
                    pagination={pagination}
                />
            )}>
                <Button color={'black'} size={'sm'} onClick={openCreateModal} rightSection={<IconTicket/>}>
                    {t`Create Ticket`}
                </Button>
            </ToolBar>

            <TableSkeleton isVisible={!tickets || ticketsQuery.isFetching || !event}/>

            {(tickets && event)
                && (<TicketsTable
                        openCreateModal={openCreateModal}
                        enableSorting={enableSorting}
                        tickets={tickets}
                        event={event}
                    />
                )}

            {!!tickets?.length && (
                <Pagination value={searchParams.pageNumber}
                            onChange={(value) => setSearchParams({pageNumber: value})}
                            total={Number(pagination?.last_page)}
                />
            )}

            {createModalOpen && <CreateTicketModal onClose={closeCreateModal} isOpen={createModalOpen}/>}
        </PageBody>
    );
};

export default Tickets;
