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
    metaRobotsNofollow: string;
    metaRobotsNoindex: string;
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
    uri?: string;
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
                metaRobotsNofollow
                metaRobotsNoindex
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

export interface GetPagesResponse {
    pages: {
        nodes: Page[];
    };
}

export const getPages = gql`
    query getPages {
        pages {
            nodes {
                uri
                slug
            }
        }
    }
`;

export interface MediaItem {
    id: string;
    altText: string;
    filePath: string;
    sourceUrl: string;
    slug: string;
    sizes: string;
    srcSet: string;
    title: string;
    uri?: string;
    description?: string;
    caption?: string;
}

export interface GetMediaItemsResponse {
    mediaItems: {
        nodes: MediaItem[];
    };
}

export const getMediaItems = gql`
    query getMediaItems($categoryName: String!) {
        mediaItems(where: { categoryName: $categoryName }) {
            nodes {
                id
                altText
                filePath
                sourceUrl
                slug
                sizes
                srcSet
                title
                uri
                description
                caption
            }
        }
    }
`;

export interface Post {
    title: string;
    slug: string;
    content?: string;
    date: string;
    excerpt: string;
    seo: SeoItem;
    featuredImage?: {
        node: {
            altText: string;
            filePath: string;
        };
    };
}

export interface GetPostResponse {
    post: Post;
}

export interface GetPostsResponse {
    posts: {
        nodes: Post[];
    };
}

export const getPost = gql`
    query getPost($id: ID!) {
        post(id: $id, idType: URI) {
            title
            content
            slug
            date
            excerpt
            featuredImage {
                node {
                    altText
                    filePath
                }
            }
            seo {
                title
                metaDesc
                metaRobotsNofollow
                metaRobotsNoindex
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

export const getPosts = gql`
    query getPosts($last: Int = 10) {
        posts(last: $last) {
            nodes {
                title
                slug
                date
                excerpt
                featuredImage {
                    node {
                        altText
                        filePath
                    }
                }
            }
        }
    }
`;
