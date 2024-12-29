import { useEffect, useState } from "react";
import {
    ToggleOnIcon, ToggleOffIcon
  } from '@shopify/polaris-icons';
import { Badge, Button, Icon, Text } from "@shopify/polaris";
import DateModal from "./date_modal";
import DatesTable from "./date_table";
import { BlockedDateRangeType } from "app/components/types";

export default function SelectDatesToBeBlocked({currentValue, changeHandler}:any){

    const [blockedDates, setBlockedDates] = useState<BlockedDateRangeType[]>(currentValue)

    useEffect(() => {
        setBlockedDates(currentValue)
    }, [currentValue])

    
    const [isModalOpen, setIsModalOpen] = useState(false) 
    const handleOpen = () => setIsModalOpen(true) 
    const handleClose = () => setIsModalOpen(false)
    
    const handleAddDate = (date: BlockedDateRangeType) => {
        const finalArr = [...blockedDates, date]
        setBlockedDates(finalArr);
        changeHandler(finalArr)
        handleClose()
    }
    

    return(
        <div>
            <div style={{position:'relative'}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <div>
                        <h3 style={{fontWeight:'bold', marginBottom: '7px'}}>By Dates</h3>
                        <p>Pick the dates you’d like to disable in the calendar</p>
                    </div>
                    <div style={{minWidth:'100px', display:'flex', justifyContent:'end'}}>
                        <Button  onClick={handleOpen}>Add Date</Button>
                    </div>
                </div>

                <hr style={{opacity: 0, margin: '7px 0'}}></hr>
                <DatesTable 
                    blockedDates = {blockedDates}
                    changeHandler={(a:any) => changeHandler(a)}
                />
                {
                    isModalOpen && (
                        <DateModal 
                            closeHandler={handleClose} 
                            blockedDates={blockedDates}
                            applyHandler={handleAddDate}
                            defaultValue={{start: new Date(), end: new Date()}}
                        />
                    )|| ''
                }
            </div>
      </div>
    )

}