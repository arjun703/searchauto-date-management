import {
    IndexTable,
    LegacyCard,
    useIndexResourceState,
  } from '@shopify/polaris';
  import {DeleteIcon} from '@shopify/polaris-icons';
  import  { useEffect, useState } from 'react';
  import { BlockedDateRangeType } from 'app/components/types';
  import DateModal from "./date_modal";


  export default function DatesTable({ blockedDates, changeHandler }: {  blockedDates: BlockedDateRangeType[], changeHandler: any }) {

    const [blockedDatesState, setBlockedDatesState] = useState(blockedDates) 

    useEffect(() => {
      setBlockedDatesState(blockedDates)
    }, [blockedDates])

    const orders = blockedDatesState.map((bd, index) => (
      {
        id: index.toString(), 
        date: bd.start < bd.end || bd.start > bd.end  
          ? bd.start.toLocaleDateString('en-GB') + ' - ' + bd.end.toLocaleDateString('en-GB')
          :  bd.start.toLocaleDateString('en-GB')
      }
    )) 
    
    const resourceName = {
      singular: 'date',
      plural: 'dates',
    };
    
    const {selectedResources, allResourcesSelected, handleSelectionChange} =
      useIndexResourceState(orders);
  
    const rowMarkup = orders.map(
      (
        {id, date,},
        index,
      ) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>{date}</IndexTable.Cell>
        </IndexTable.Row>
      ),
    );
  
    const promotedBulkActions = selectedResources.length == 1 ? [
      {
        content: 'Edit Date',
        onAction: () => handleOpen(),
      },
    ]: [];

    const handleDelete = () => {
      const finalArr = blockedDatesState.filter((pd,index) => !selectedResources.includes(index.toString()))
      setBlockedDatesState(finalArr)
      handleSelectionChange("all", false, [])
      changeHandler(finalArr)

    }

    const bulkActions = [
      {
        icon: DeleteIcon,
        destructive: true,
        content: 'Delete Date(s)',
        onAction: () => {handleDelete()},
      },
    ];



    const [isModalOpen, setIsModalOpen] = useState(false) 
    const handleOpen = () => setIsModalOpen(true) 
    const handleClose = () => setIsModalOpen(false)
    
    const handleEditDate = (date: BlockedDateRangeType) => {
      
      const finalArr = blockedDatesState.map((item, index) => 
        index.toString() === selectedResources[0] ? { ...item, start: date.start, end: date.end } : item
      )

      setBlockedDatesState(finalArr)

      handleSelectionChange("all", false); // Adjust 'all' based on your SelectionType
      changeHandler(finalArr)
      handleClose();

  };

    return (
      <>
        <LegacyCard>
          <IndexTable
            resourceName={resourceName}
            itemCount={orders.length}
            selectedItemsCount={
              allResourcesSelected ? 'All' : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              {title: 'Blocked Dates'},
            ]}
            bulkActions={bulkActions}
            promotedBulkActions={promotedBulkActions}
          >
            {rowMarkup}
          </IndexTable>
        </LegacyCard>
        {
            isModalOpen && (
                <DateModal 
                    blockedDates={[]}
                    closeHandler={handleClose} 
                    applyHandler={handleEditDate}
                    defaultValue={blockedDates[parseInt(selectedResources[0])]}
                />
            ) || ''
        }
      </>
    );
  }