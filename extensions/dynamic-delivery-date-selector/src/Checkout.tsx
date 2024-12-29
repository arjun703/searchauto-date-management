import {
  reactExtension,
  Banner,
  DateField,
  useApplyAttributeChange,
  useShop,
  useAppMetafields,
} from "@shopify/ui-extensions-react/checkout";
import { DisabledDate } from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";


function Extension() {

  const deliveryDateManagementSettings = useAppMetafields({type:'shop'})


  let tempSettings = {blockedDays: [], blockedDateRanges: []}

  if( deliveryDateManagementSettings &&  
      typeof deliveryDateManagementSettings !== "undefined" && 
      tempSettings !== null &&
      deliveryDateManagementSettings.length
  ){
    
    let blockedTimes = deliveryDateManagementSettings[0]?.metafield

    if(blockedTimes !== undefined){

      let valueString =  blockedTimes.value.toString()

      let setting = JSON.parse(valueString)

      if(
        setting?.blockedDays != undefined && 
        setting?.blockedDays != null && 
        Array.isArray(setting.blockedDays) 
      ){
        tempSettings.blockedDays = setting.blockedDays
      }

      if(
        setting?.blockedDateRanges != undefined && 
        setting?.blockedDateRanges != null && 
        Array.isArray(setting.blockedDateRanges) 
      ){
        tempSettings.blockedDateRanges = setting.blockedDateRanges
      }

    }

  }

  const today = new Date();

  // Subtract one day to get yesterday
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const formattedYesterdayDate = yesterday.toISOString().split('T')[0];
  const formattedTodayDate = today.toISOString().split('T')[0];


  const applyAttributeChange = useApplyAttributeChange();
  
  const disabledDates: DisabledDate[] = [
    {start: "1990-01-01", end:formattedYesterdayDate}, 
  ]

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  tempSettings.blockedDays.forEach(day => {
    if(days[day] !== undefined) disabledDates.push(days[day])
  })

  tempSettings.blockedDateRanges.forEach(({start, end}) => {
    disabledDates.push(
      {
        start: new Date(start).toLocaleDateString('en-CA'), 
        end:  new Date(end).toLocaleDateString('en-CA')
      }
    ) 
  })


  const isDateValid = (date: Date): boolean => {
  
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return false; // Invalid date
    }

    const dayIndex = new Date(date).getDay(); // Get day index (0 = Sunday, 1 = Monday, etc.)
    // console.log("pramila")
    // console.log({date, dayIndex, disabledDates,  blockedDays:tempSettings.blockedDays} )

    // Check if the date falls within any disabled ranges
    for (const range of disabledDates) {
      if (typeof range === "object") {
        const start = new Date(range.start);
        const end = new Date(range.end);
        const current = new Date(date);
  
        // Normalize to midnight (set hours, minutes, seconds, and ms to 0)
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999); // Inclusive range up to the end of the day

        // console.log({start, end, current})

        if (current >= start && current <= end) {
          return false; // Date is in the disabled range
        }
      }
    }
  
    // Check if the day is disabled
    for (const blockedDay of tempSettings.blockedDays) {
      if (dayIndex === blockedDay) {
        return false; // Day is blocked
      }
    }
  
    // console.log( date , " is valid okkkkkkkkkkk")
    return true; // Date is valid
  };

  const maxIterations = 90

  const findFirstValidDate = (): string => {

    const today = new Date(); // Start from today
    
    let currentDate = today;
      // Iterate until a valid date is found
    let iterations = 0
    let isValid = isDateValid(currentDate)

    // console.log("finding first astha date")
    // console.log({currentDate, isValid})

    while (!isValid) {
      // console.log({currentDate, isValid})
      iterations++
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      // Safeguard to prevent infinite loop
      if (iterations > maxIterations) {
        // console.log("returning null")
        return null; // Return null if no valid date is found
      }
      isValid = isDateValid(currentDate)
      // console.log("prachanda", {isValid, currentDate})
    }

    // console.log("after loop", {isValid, currentDate})

    // Return the first valid date in 'YYYY-MM-DD' format
    return currentDate.toISOString().split("T")[0];
  }

  let firstValidDateTemp = findFirstValidDate()
  let unavailable =false 
  if(!firstValidDateTemp){
    unavailable = true
    // console.log("first valid date not found, defaulting to today", formattedTodayDate)
    firstValidDateTemp = formattedTodayDate
  }

  console.log(firstValidDateTemp, "firstValidDateTemp")

  const [selectedDate, setSelectedDate] = useState<string>(firstValidDateTemp);
  console.log("applying attribute change")
  applyAttributeChange({
    key: "desired_delivery_date",
    type: "updateAttribute",
    value: selectedDate,
  });
  // Avoid redundant state updates by comparing the current state
  useEffect(() => {
    if (selectedDate !== firstValidDateTemp) {
      setSelectedDate(firstValidDateTemp);
      applyAttributeChange({
        key: "desired_delivery_date",
        type: "updateAttribute",
        value: firstValidDateTemp,
      });
      console.log("inside useEffect")
    }
  }, [firstValidDateTemp]);

  // const disabledDates: DisabledDate[] = [
  //   {start: "1990-01-01", end:formattedTodayDate},
  //   { start: "2024-12-25", end: "2024-12-28" }, // Block range 1
  //   "Tuesday", // Disable Wednesdays
  //   "Saturday",  // Disable Saturdays
  // ];

  const handleDateChange = (date:string) => {
    setSelectedDate(date)
    console.log("applying attribute change")
    applyAttributeChange({
      key: "desired_delivery_date",
      type: "updateAttribute",
      value: date,
    });
  }

  return (
    <>
      <Banner status={'info'}>
        Earliest delivery date: {!unavailable ?  findFirstValidDate(): 'Unavailable'}
      </Banner>

      <DateField 
        value={selectedDate} 
        label="Choose your desired delivery date"
        onChange={(date) => handleDateChange(date)}
        disabled={disabledDates} 
      />
      {
        !isDateValid(new Date(selectedDate)) && (
          <Banner status={'warning'}>
            Invalid Delivery Date Selected
          </Banner>
        )
      }
    </>

  )
}

// 1. Choose an extension target
export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));
