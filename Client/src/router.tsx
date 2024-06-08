import { createBrowserRouter, redirect } from "react-router-dom"
import Home from "./components/Pages/Home"
import Setting from "./components/Pages/Setting"
import MainLayout from "./components/Pages/MainLayout"

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        // loader: validateUser,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "/setting",
                element: <Setting />
            }
        ]
    }
])

export default router
