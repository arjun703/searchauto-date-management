import { useEffect, useState } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json,  useLoaderData } from "@remix-run/react";

import {  TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

import { readShopMetafield } from "app/utils/read_shop_metafield";

import DaysAndDatesSettings from "app/components/select-days-and-dates";

import {SaveBar} from '@shopify/app-bridge-react';
import { Button, Page } from "@shopify/polaris";
import { BlockedDateRangeType, SettingsType } from "app/components/types";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  
  const { admin } = await authenticate.admin(request);
  
  try{

    const {shop_id, settings} = await readShopMetafield(admin, 'delivery_date_management', 'settings') 

    return json({success:true, shop_id, settings });

  }catch(error){

    return json({success:false, settings: null, shop_id: null });

  }


}

export default function Index() {

  const shopify = useAppBridge()

  const {success, settings, shop_id} = useLoaderData<typeof loader>();

  if(!success){
    return(
      <>
      An Error occured
      </>
    )
  }

  let originalSettingsTemp = settings 

  if(!settings || settings === null || settings === undefined){
    originalSettingsTemp = {blockedDays: [], blockedDateRanges: []}
  }else{
    originalSettingsTemp = JSON.parse(originalSettingsTemp)

    if(typeof originalSettingsTemp.blockedDays === 'undefined' || originalSettingsTemp.blockedDays == null){
      originalSettingsTemp.blockedDays = [];
    }

    if(typeof originalSettingsTemp.blockedDateRanges === 'undefined' || originalSettingsTemp.blockedDateRanges == null){
      originalSettingsTemp.blockedDateRanges = [];
    }

    originalSettingsTemp.blockedDateRanges = originalSettingsTemp.blockedDateRanges
    .map(({start, end}:any) => ({start: new Date(start), end: new Date(end)}))

  }

  const [isSaving, setIsSaving] = useState(false)

  const [originalSettings, setOriginalSettings] = useState<SettingsType>(originalSettingsTemp)

  const [editedSettings, setEditedSettings] = useState<SettingsType>(originalSettingsTemp) 

  console.log(editedSettings, "editedSettings")

  const saveSettings = async () => {
    
    const formData = new FormData()
    
    formData.append('new_settings', JSON.stringify(editedSettings))
    
    formData.append('shop_id', shop_id)
    
    setIsSaving(true)

    const filtersSaveResponse = await fetch('/api/settings', {
      method: 'POST',
      body: formData
    })

    setOriginalSettings(editedSettings)

    setIsSaving(false)

    shopify.toast.show('Settings saved')

  }



  const hasSettingsChanged = (): boolean => {

    // Check if the number of blockedDays is different
    if (originalSettings.blockedDays.length !== editedSettings.blockedDays.length) {
      return true;
    }
  
    // Check if the blockedDays values are different
    const originalDaysSorted = [...originalSettings.blockedDays].sort();
    const editedDaysSorted = [...editedSettings.blockedDays].sort();
    for (let i = 0; i < originalDaysSorted.length; i++) {
      if (originalDaysSorted[i] !== editedDaysSorted[i]) {
        return true;
      }
    }
  
    // Check if the number of blockedDateRanges is different
    if (
      originalSettings.blockedDateRanges.length !==
      editedSettings.blockedDateRanges.length
    ) {
      return true;
    }
  
    // Check if the blockedDateRanges values are different
    for (let i = 0; i < originalSettings.blockedDateRanges.length; i++) {
      const originalRange = originalSettings.blockedDateRanges[i];
      const editedRange = editedSettings.blockedDateRanges[i];
      if (
        originalRange.start !== editedRange.start ||
        originalRange.end !== editedRange.end
      ) {
        return true;
      }
    }
  
    // If no differences were found
    return false;
  };



  useEffect(() => {


    if(hasSettingsChanged()){
      shopify.saveBar.show('my-save-bar');
    }else{
      shopify.saveBar.hide('my-save-bar');
    }

  }, [originalSettings, editedSettings])


  const handleSave = () => {
    console.log('Saving');
    shopify.saveBar.hide('my-save-bar');
  };

  const handleDiscard = () => {
    setEditedSettings(originalSettings)
    shopify.saveBar.hide('my-save-bar');
  };

  const handleChangeInDays = (blockedDays: number[]) => {
    setEditedSettings((prevSettings: SettingsType) => ({
      ...prevSettings,
      blockedDays: blockedDays 
    }));
  };

  function handleChangeInDateRanges(blockedDateRanges: BlockedDateRangeType[])  {
    setEditedSettings((prevSettings: SettingsType) => ({
      ...prevSettings,
      blockedDateRanges: blockedDateRanges 
    }));  
  }

  return (
    <Page title="Dashboard">
      <SaveBar id="my-save-bar">
        <button disabled={isSaving}  variant="primary" onClick={saveSettings}>Save</button>
        <button disabled={isSaving} onClick={handleDiscard}>Discard</button>
      </SaveBar>
      
      <DaysAndDatesSettings 
        settings={editedSettings}
        daysChangeHandler={handleChangeInDays}
        dateRangesChangeHandler={handleChangeInDateRanges}
      />

    </Page>
  );
}
