import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "app/shopify.server";
import { saveShopMetafield } from "app/utils/save_shop_metafield";
export async function action({
  request,
}: ActionFunctionArgs) {
    
  try{

    const { session, admin } = await authenticate.admin(request);

    var { shop, accessToken } = session;

    const data:any = await request.formData();

    let new_settings = data.get('new_settings')

    let shop_id = data.get('shop_id')
    console.log("saving...")
    const saveResponse = await saveShopMetafield(admin, shop_id, 'delivery_date_management', 'settings', new_settings)
    console.log(saveResponse)
    return json({success: true});

  }catch(error:any){

    return json({success: false,  message: error.message });

  }

}