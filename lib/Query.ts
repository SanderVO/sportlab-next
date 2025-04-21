import gql from "graphql-tag";

export interface MenuItem {
    id: string;
    label: string;
    uri: string;
    parentId?: string;
    childItems: {
        nodes: MenuItem[];
    };
    menu: {
        node: {
            name: string;
            locations: string[];
            slug: string;
        };
    };
}

export interface GetMenuItemsResponse {
    menuItems: {
        __typename: string;
        nodes: MenuItem[];
    };
}

export const getMenuItems = gql`
    query getMenuItems($location: MenuLocationEnum) {
        menuItems(where: { location: $location }, first: 20) {
            nodes {
                id
                label
                uri
                parentId
                childItems {
                    nodes {
                        id
                        label
                        uri
                    }
                }
            }
        }
    }
`;

export interface MenuItem {
    id: string;
    label: string;
    uri: string;
    parentId?: string;
    childItems: {
        nodes: MenuItem[];
    };
    menu: {
        node: {
            name: string;
            locations: string[];
            slug: string;
        };
    };
}

export interface SeoItem {
    title: string;
    metaDesc: string;
    canonical: string;
    opengraphTitle: string;
    opengraphDescription: string;
    twitterTitle: string;
    twitterDescription: string;
    schema: {
        articleType: string;
        pageType: string;
        raw: string;
    };
    breadcrumbs: {
        text: string;
        url: string;
    }[];
}

export interface Page {
    __typename: string;
    title: string;
    slug: string;
    seo: SeoItem;
}

export interface GetPageResponse {
    page: Page;
}

export const getPage = gql`
    query getPage($id: ID!) {
        page(id: $id, idType: URI) {
            title
            slug
            seo {
                title
                metaDesc
                canonical
                opengraphTitle
                opengraphDescription
                twitterTitle
                twitterDescription
                schema {
                    articleType
                    pageType
                    raw
                }
                breadcrumbs {
                    text
                    url
                }
            }
        }
    }
`;
