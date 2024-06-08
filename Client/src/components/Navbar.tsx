import { NavLink, useNavigate } from "react-router-dom"
import { TbHomeMove } from "react-icons/tb"
import Swal from "sweetalert2"

export default function Navbar() {
    const navigate = useNavigate()

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Are you sure for logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes",
            reverseButtons: true,
        })

        if (result.isConfirmed) {
            localStorage.clear()
            Swal.fire({
                title: "Done!",
                text: `Logout Success`,
                icon: "success"
            }).then(() => {
                navigate("/")
                window.location.reload()
            })

        }
    }

    return (
        <nav className="p-3 m-3 mb-0 relative">
            <div className="flex justify-between border-b-4 border-gray-300 pb-2 mb-4 pl-4">
                <div className="flex flex-col items-start text-xl font-semibold text-red-600">
                    Timesheet
                    <span className="text-lg">Management</span>
                </div>
                <button className="flex justify-center items-center cursor-pointer mt-3 w-10 h-10 mr-3 rounded-t-xl outline outline-3 outline-gray-300 text-[#2775EC] hover:text-[#F15858]" onClick={handleLogout}>
                    <TbHomeMove size={24} />
                </button>
            </div>
            <h1 className="text-4xl font-bold text-red-600 border-gray-300 pb-2 my-6">HH Timesheet</h1>
            <div className="flex space-x-4 mt-2 pt-2 ml-8 absolute bottom-0">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive
                            ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                            : "text-blue-600 font-semibold"
                    }
                    activeClassName="text-blue-600 border-b-2 border-blue-600 font-semibold"
                >
                    List Activities
                </NavLink>
                <NavLink
                    to="/setting"
                    className={({ isActive }) =>
                        isActive
                            ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                            : "text-blue-600 font-semibold"
                    }
                    activeClassName="text-blue-600 border-b-2 border-blue-600 font-semibold"
                >
                    Setting
                </NavLink>
            </div>
        </nav>
    )
}
