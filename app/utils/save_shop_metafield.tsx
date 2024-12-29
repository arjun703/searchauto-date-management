export async function saveShopMetafield(
    admin: any,
    shopId: string,
    namespace: string,
    key: string,
    value: any,
  ) {
    const updateQuery = `
      mutation UpdateShopMetafield($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
            type
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
  
    const response = await admin.graphql(updateQuery, {
      variables: {
        metafields: [
          {
            ownerId: shopId,
            namespace,
            key,
            value: value,
            type: "json",
          },
        ],
      },
    });
  
    return (await response.json()).data.metafieldsSet.metafields;
  }