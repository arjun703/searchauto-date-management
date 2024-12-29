import { useEffect, useState } from "react";
import { Badge, Icon } from "@shopify/polaris";



export default function SelectDaysToBeBlocked({currentValue, changeHandler}:any){
    const [blockedDays, setBlockedDays] = useState<number[]>(currentValue)

    useEffect(() => {
        setBlockedDays(currentValue)
    }, [currentValue])

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    const toggleOffIcon = <svg style={{ verticalAlign:'middle'}}  viewBox="0 0 20 20" width="30px"><path d="M8 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path><path fill-rule="evenodd" d="M8 4.5a5.5 5.5 0 1 0 0 11h4a5.5 5.5 0 1 0 0-11h-4Zm-4 5.5a4 4 0 0 1 4-4h4a4 4 0 0 1 0 8h-4a4 4 0 0 1-4-4Z"></path></svg>
    const toggleOnIcon = <svg style={{fill:'green', verticalAlign:'middle'}} viewBox="0 0 20 20" width="30px"><path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path><path fill-rule="evenodd" d="M8 4.5a5.5 5.5 0 1 0 0 11h4a5.5 5.5 0 1 0 0-11h-4Zm-4 5.5a4 4 0 0 1 4-4h4a4 4 0 0 1 0 8h-4a4 4 0 0 1-4-4Z"></path></svg>

    const handleChange = (day: number) => {
        setBlockedDays((prevState) => {
          const updatedBlockedDays = prevState.includes(day)
            ? prevState.filter((blockedDay) => blockedDay !== day) // Remove the day
            : [...prevState, day]; // Add the day
      
          // Call changeHandler with the updated state
          changeHandler(updatedBlockedDays);
      
          return updatedBlockedDays; // Update the state
        });
    };

    return(
        <div>
            {
                days.map((day, index) => {
                    const disabled = blockedDays?.includes(index)
                    return(
                        <div key={index}>
                        <div style={{display:'flex', padding:'5px 10px', alignItems:'center', cursor:'pointer', borderRadius:'20px',marginBottom:'15px',  background: 'rgba(0,0,0, 0.05)', width:'100%', justifyContent:'space-between'}} onClick={() => handleChange(index) }>
                            <div style={{display:'flex', gap:'5px'}}>
                                <div>
                                    {day}
                                </div>
                                {disabled && (<Badge tone={'warning'}>blocked</Badge>)}
                            </div>
                            <div>
                                {disabled ? toggleOffIcon  :  toggleOnIcon }
                            </div>
                        </div>
                    </div>
                )})
            }
      </div>
    )

}