export const readShopMetafield = async (admin:any, namespace:string, key:string) => {
    try {

      const readQuery = `
        query {
          shop {
            id
            metafield(namespace: "delivery_date_management", key: "settings") {
              value
            }
          }
        }
      `;
  
      const response = await admin.graphql(readQuery)

      const responseData = await response.json();
      
      if (!response.ok) {
        return { error: responseData.errors || "Failed to retrieve metafield" };
      }
      
      // {"data":{"shop":{"id":"gid://shopify/Shop/86353183015","metafield":null}}
      console.log("retrieving")
      console.log(responseData)
      const shop_id = responseData?.data?.shop?.id
      const settings = responseData?.data?.shop?.metafield?.value
      
      return {shop_id, settings} 
      
    } catch (error) {
      return { error: "Error retrieving settings" };
    }
  };