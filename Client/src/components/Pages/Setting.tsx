import { useEffect, useState } from "react"
import axios from "../../BaseUrl"
import Swal from "sweetalert2"

export default function Setting() {

    const [employee, setEmployee] = useState({
        name: "",
        rate: ""
    })

    const fetchEmployee = async () => {
        try {
            const { data } = await axios({
                url: "/employee",
                headers: {
                    Authorization: `Bearer ${localStorage.access_token}`
                }
            })

            setEmployee(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdate = async (e) => {
        try {
            e.preventDefault()
            const { data } = await axios({
                method: "put",
                url: "/employee",
                data: employee,
                headers: {
                    Authorization: `Bearer ${localStorage.access_token}`
                }
            })

            Swal.fire(data.message, "", "success")
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchEmployee()
    }, [])

    return (
        <div className="flex items-center justify-center min-h-[74vh] bg-gray-100">
            <div className="bg-white p-10 w-[500px] h-[300px] rounded-xl shadow-md">
                <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm mb-2">Employee Name</label>
                        <input type="text" id="name" name="name" value={employee.name} onChange={(e) => setEmployee({ ...employee, name: e.target.value })} placeholder="" className="shadow appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="rate" className="block text-gray-700 text-sm mb-2">Rate</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-black">Rp.</span>
                            <input
                                type="number"
                                id="rate"
                                name="rate"
                                value={employee.rate}
                                onChange={(e) => setEmployee({ ...employee, rate: e.target.value })}
                                className="shadow appearance-none border rounded-lg w-full py-3 pl-10 pr-16 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">/Hour</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <button type="button" className="bg-gray-200 text-[#2775EC] font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline mr-2 flex-1">Cancel</button>
                        <button type="submit" className="bg-[#2775EC] hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline flex-1">Save</button>
                    </div>
                </form>
            </div>
        </div>

    )
}