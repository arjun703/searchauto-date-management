import { useAppBridge } from "@shopify/app-bridge-react"
import { Button, DatePicker } from "@shopify/polaris"
import { BlockedDateRangeType } from "app/components/types"
import { useCallback, useState } from "react"

export default function DateModal({closeHandler, applyHandler, defaultValue, blockedDates}:{blockedDates:any,defaultValue: BlockedDateRangeType,  applyHandler:any, closeHandler:any}){
    
    const handleClose = () => closeHandler()

    const [selectedDate, setSelectedDate] = useState(defaultValue)

    return(
        <>
          <div 
            className="modal-background" 
            style={{position:'fixed', zIndex: 999,background:'rgba(0,0,0, 0.4)', top: 0, left: 0, width: '100%', height: '100%'}}
          >

          </div>
          <div 
            style={{
                position:'fixed', 
                background:'white',
                maxWidth: '282px', 
                padding: '18px', 
                borderRadius: '20px',
                minHeight: '300px',
                top: '50%',
                zIndex: 1000, 
                left: '50%', 
                transform: "translate(-50%, -50%)"
            }} 
            className="modal-content"
          >
            <div>
              <DatePickerComp blockedDates={blockedDates}  handleClose={handleClose} applyHandler={applyHandler} defaultValue={selectedDate} />
            </div>
          </div>
        </>
    )
}



function DatePickerComp({handleClose, blockedDates, applyHandler, defaultValue}:any){

  const dyear = defaultValue.start.getUTCFullYear()
  const dmonth = defaultValue.start.getUTCMonth() 

  const [{month, year}, setDate] = useState({month: dmonth, year: dyear});

  const [selectedDates, setSelectedDates] = useState(defaultValue);

  const handleMonthChange = useCallback(
    (month: number, year: number) => setDate({month, year}),
    [],
  );

  const handleApply =() => applyHandler(selectedDates)

  let allDates: Date[] = [];


  function generateDateRange(start:Date, end:Date) {

    const result = [];
    
    let currentDate = new Date(start); // Convert to Date object
    
    const endDate = new Date(end); // Convert to Date object

    while (currentDate <= endDate) {
        result.push(new Date(currentDate));
        // Increment by 1 day (you can change this to hours, minutes, etc.)
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }

  blockedDates.forEach( (date:any) => {
    allDates = [...allDates, ...generateDateRange(date.start, date.end)]
  })
  const today = new Date();
  today.setDate(today.getDate() - 1) 

  return(
    <>
      <DatePicker
        month={month}
        year={year}
        onChange={setSelectedDates}
        onMonthChange={handleMonthChange}
        selected={selectedDates}
        disableSpecificDates={allDates}
        disableDatesBefore={today}
        allowRange
      />
      <div style={{display:'flex', marginTop: '16px', justifyContent:'end'}}>
        <div style={{display:'flex', gap: '5px'}}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleApply} variant="primary">Apply</Button>
        </div>
      </div>
    </>
  )
}