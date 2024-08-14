import {gql} from '@apollo/client';

export const PRODUCTS_QUERY = gql`
            query ProductsQuery {
                products {
                    id
                    price
                    title
                    avg_rating
                    total_sales
                }
            }
        `;
export const MESSAGE_SUBSCRIPTION = gql`
subscription ProductInfoUpdated {
    productInfoUpdated {
        id
        title
        price
        avg_rating
        total_sales
    }
}
`;