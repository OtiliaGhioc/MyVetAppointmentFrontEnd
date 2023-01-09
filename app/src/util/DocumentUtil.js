import { APP_NAME } from "../env"

const pagesWithoutSideDrawer = [
    '/login',
    '/register'
]

export const getDocumentName = (page) => {
    return `${page} | ${APP_NAME}`
}

export const pageHasSideDrawer = (path) => {
    return !(pagesWithoutSideDrawer.includes(path));
}