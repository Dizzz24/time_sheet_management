import { FiEdit } from "react-icons/fi"
import { BsTrash } from "react-icons/bs"
import { Activity } from "../Interfaces/interface"
import axios from "../BaseUrl.ts"
import Swal from "sweetalert2"
import FormAddEditActivity from "./modals/AddEditActivity.tsx"
import { useState } from "react"
import { fetchActivities } from "../store/features/fetchActivities.js"
import { useDispatch } from 'react-redux'

export default function TableRow({ activity }: { activity: Activity }) {
    const dispatch = useDispatch()

    const parts = activity.duration.split(" ")
    let formatedDuration = activity.duration

    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)


    if (!parseInt(parts[0])) {
        formatedDuration = parts.slice(2).join(" ")
    } else if (!parseInt(parts[2])) {
        formatedDuration = parts.slice(0, 2).join(" ")
    }

    const handleDelete = async () => {
        try {
            const result = await Swal.fire({
                title: "Do you want to delete it?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes",
                reverseButtons: true,
            })

            if (result.isConfirmed) {
                const { data } = await axios({
                    method: "delete",
                    url: `/activities/${activity.id}`,
                    headers: {
                        Authorization: `Bearer ${localStorage.access_token}`
                    }
                })

                Swal.fire({
                    title: data.message,
                    icon: "success"
                }).then(() => dispatch(fetchActivities()))
            }

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <tr>
                <td className="py-3 px-4 border">{activity.name}</td>
                <td className="py-3 px-4 border">{activity.Project.name}</td>
                <td className="py-3 px-4 border">{activity.startDate}</td>
                <td className="py-3 px-4 border">{activity.endDate}</td>
                <td className="py-3 px-4 border">{activity.startTime}</td>
                <td className="py-3 px-4 border">{activity.endTime}</td>
                <td className="py-3 px-4 border">{formatedDuration}</td>
                <td className="py-3 px-2 border">
                    <div className="flex justify-center items-center gap-2">
                        <button className="outline outline-2 outline-yellow-400 p-2 rounded-lg hover:outline-black" onClick={openModal}><FiEdit size={18} /></button>
                        <button className="outline outline-2 outline-red-500 p-2 rounded-lg hover:outline-black" onClick={handleDelete}><BsTrash size={18} /></button>
                    </div>
                </td>
            </tr>
            <FormAddEditActivity isModalOpen={isModalOpen} closeModal={closeModal} idActivity={activity.id} />
        </>
    )
}