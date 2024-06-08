import { useEffect } from "react"
import Navbar from "../Navbar"
import { Outlet, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import axios from "../../BaseUrl"

export default function MainLayout() {
    const navigate = useNavigate()

    useEffect(() => {
        const showWelcomeAlert = async () => {
            const accessToken = localStorage.getItem('access_token')

            if (!accessToken) {
                const result = await Swal.fire({
                    title: 'HH Timesheet-Management',
                    text: 'Please enter your name',
                    input: 'text',
                    inputPlaceholder: 'Your name',
                    allowOutsideClick: false,
                    showCancelButton: false,
                    confirmButtonText: 'Enter',
                    backdrop: `
                        rgba(0,0,0,0.4)
                        center center
                        no-repeat
                    `,
                    inputValidator: (value) => {
                        if (!value) {
                            return 'You need to enter your name!'
                        }
                    }
                })

                if (result.isConfirmed && result.value) {
                    try {
                        const { data } = await axios.post("/employee", { name: result.value })
                        localStorage.setItem('access_token', data.access_token)
                        Swal.fire(data.message, "", "success").then(() => window.location.reload())

                    } catch (error) {
                        Swal.fire("Failed to save name", error.message, "error")
                    }
                }
            }
        }

        showWelcomeAlert()
    }, [navigate])

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}