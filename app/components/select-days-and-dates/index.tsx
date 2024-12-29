import { Grid, LegacyCard} from '@shopify/polaris';
import SelectDaysToBeBlocked from './select-days';
import SelectDatesToBeBlocked from './select-dates';

function DaysAndDatesSettings({dateRangesChangeHandler, daysChangeHandler, settings}:any) {
  
return (
    <Grid>
        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
            <LegacyCard  sectioned>
                <h3  style={{fontWeight:'bold', marginBottom: '7px'}}>By Days</h3>
                <p>
                    Edit the days of the week you’d like to enable or disable in the calendar               
                </p>
                <hr style={{opacity: 0, margin: '7px 0'}}></hr>
                <SelectDaysToBeBlocked 
                    currentValue={settings.blockedDays} 
                    changeHandler={daysChangeHandler}
                />
            </LegacyCard>
        </Grid.Cell>
        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
            <LegacyCard  sectioned>
                <SelectDatesToBeBlocked 
                    currentValue={settings.blockedDateRanges} 
                    changeHandler={dateRangesChangeHandler}
                />
            </LegacyCard>
        </Grid.Cell>
    </Grid>
  );
}

export default DaysAndDatesSettings