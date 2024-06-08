import { useEffect, useState } from 'react'
import { LuListFilter } from "react-icons/lu"
import { IoIosSearch } from "react-icons/io"
import { FiPlusCircle, FiEdit } from "react-icons/fi"
import { BsTrash } from "react-icons/bs"
import { FaFileImport, FaFileExport } from "react-icons/fa6"
import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useEditableState } from '@chakra-ui/react'
import useModalStore from '../../store/modalStore'
import FormAddEditActivity from '../modals/AddEditActivity.js'
import TableRow from '../TableRow'
import axios from "../../BaseUrl"
import { ActivityList } from '../../Interfaces/interface'
import Swal from 'sweetalert2'
import formatIDR from "../../utilities/formatIDR.js"
import ModalFilter from '../modals/ModalFilter.js'
import { useDebounce } from 'use-debounce'
import { useSelector, useDispatch } from 'react-redux'
import { fetchActivities, fetchProjects } from "../../store/features/fetchActivities.js"

interface Props {
    name: string
    rate: number
}

const ActionButton = ({ icon: Icon, label, onClick, className }) => (
    <button className={`flex justify-center items-center gap-2 text-white font-semibold rounded-lg py-3 px-5 ${className}`} onClick={onClick}>
        <Icon size={24} />
        {label}
    </button>
)

export default function Home() {
    const activities = useSelector(state => state.activities)
    const filter = useSelector(state => state.filter)
    const dispatch = useDispatch()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSecModalOpen, setIsSecModalOpen] = useState(false)

    const [tempSearch, setTempSearch] = useState("")
    const [search] = useDebounce(tempSearch, 1500)

    // const [activities, setActivities] = useState<ActivityList[]>([])

    const [employee, setEmployee] = useState<Props>({
        name: "",
        rate: ""
    })

    const [fileExcel, setFileExcel] = useState<File | null>(null)

    const openFModal = () => setIsModalOpen(true)
    const closeFModal = () => setIsModalOpen(false)

    const openSModal = () => setIsSecModalOpen(true)
    const closeSModal = () => setIsSecModalOpen(false)

    const handleSubmit = () => {
        document.getElementById("fileInput")?.click()
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0]
            setFileExcel(selectedFile)
        }
    }

    const fetchEmployee = async () => {
        try {
            const { data } = await axios({
                url: "/employee",
                headers: {
                    Authorization: `Bearer ${localStorage.access_token}`
                }
            })

            console.log(data, "< == data bo")

            setEmployee(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleImportExport = async (type: string) => {
        try {
            const method = type === "import" ? "post" : "get"
            const url = `/${type}`

            const formData = new FormData()
            formData.append("file", fileExcel)

            await axios({
                method,
                url,
                data: type === "import" ? formData : null,
                headers: {
                    Authorization: `Bearer ${localStorage.access_token}`,
                    "Content-Type": type === "import" ? "multipart/form-data" : null
                }
            })

            Swal.fire(`Success to ${type} data`, "", "success")
            dispatch(fetchActivities())
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddProject = () => {
        Swal.fire({
            title: 'Add New Project',
            html: `<input id="swal-input1" class="swal2-input" placeholder="Project Name">`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Save',
            showLoaderOnConfirm: true,
            reverseButtons: true,
            preConfirm: () => {
                const projectName = (document.getElementById('swal-input1') as HTMLInputElement).value
                return projectName
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then(async (result) => {
            if (result.isConfirmed) {
                const name = result.value
                try {
                    await axios({
                        method: "post",
                        url: "/projects",
                        data: { name },
                        headers: {
                            Authorization: `Bearer ${localStorage.access_token}`
                        }
                    })

                    Swal.fire('Saved!', `Project "${name}" has been added.`, 'success')
                    dispatch(fetchProjects())
                } catch (error) {
                    Swal.fire('Error!', 'An error occurred while adding the project.', 'error')
                }
            }
        })
    }

    useEffect(() => {
        dispatch(fetchActivities())
        fetchEmployee()
    }, [])


    useEffect(() => {
        if (fileExcel) {
            handleImportExport("import")
        } else {
            dispatch(fetchActivities(search))
        }
    }, [fileExcel, search])

    return (
        <>
            <div className='flex-1 p-6 bg-[#F7F8FB]'>
                <div className="mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <div className="flex justify-between pb-4 border-b-2">
                        <div className="flex items-center gap-12">
                            <div>
                                <p className="font-semibold">Employee Name</p>
                                <p className="text-gray-700">{employee?.name}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Rate</p>
                                <p className="text-gray-700">Rp{employee?.rate}/hour</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="">
                                <input
                                    type="file"
                                    id="fileInput"
                                    style={{ display: "none" }}
                                    accept=".xlsx, .xls, .csv"
                                    onChange={handleFileInputChange}
                                />
                                <ActionButton icon={FaFileImport} label="Import Report" className="bg-blue-500" onClick={handleSubmit} />
                            </div>
                            <ActionButton icon={FaFileExport} label="Export Report" className="bg-red-500" onClick={() => handleImportExport("export")} />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center my-8">
                            <div className="flex items-center justify-center gap-4">
                                <h2 className="text-lg font-semibold">Activity List</h2>
                                <button className="flex items-center justify-center gap-1 bg-[#F0F6FF] text-[#2775EC] px-4 py-2 font-semibold rounded" onClick={openFModal}><FiPlusCircle />Add New Activity</button>
                            </div>
                            <div className="flex items-center justify-center gap-4">
                                <label className="input input-bordered flex items-center gap-2 outline outline-gray-400 p-2 rounded">
                                    <button><IoIosSearch size={24} onClick={() => console.log(tempSearch)} color='#9ca3af' /></button>
                                    <input type="text" className="grow outline-none" value={tempSearch} onChange={(e) => setTempSearch(e.target.value)} placeholder="Search" />
                                </label>
                                <button className="outline outline-gray-400 p-2 rounded" onClick={openSModal}><LuListFilter color='#9ca3af' size={24} /></button>
                            </div>
                        </div>
                        <table className="min-w-full bg-white p-2 rounded-xl border-separate border-spacing-0">
                            <thead className="rounded-t-lg">
                                <tr>
                                    <th className="py-4 px-4 border text-start rounded-tl-lg">Activity Title</th>
                                    <th className="py-4 px-4 border text-start">Project Name</th>
                                    <th className="py-4 px-4 border text-start">Start Date</th>
                                    <th className="py-4 px-4 border text-start">End Date</th>
                                    <th className="py-4 px-4 border text-start">Start Time</th>
                                    <th className="py-4 px-4 border text-start">End Time</th>
                                    <th className="py-4 px-4 border text-start">Duration</th>
                                    <th className="py-4 px-4 border text-start rounded-tr-lg">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 px-4 text-center text-gray-500 border-x">{search || filter ? "Data not found" : "No activity yet"}</td>
                                    </tr>
                                ) : (
                                    activities?.data?.map((el, index) => (
                                        <TableRow key={index} activity={el} />
                                    ))
                                )}
                            </tbody>
                            <tfoot className="bg-blue-100 rounded-b-lg">
                                <tr>
                                    <td colSpan={4} className="pt-4 px-4 text-start text-[#2775EC]">Total Duration</td>
                                    <td colSpan={4} className="pt-4 px-4 text-end text-[#2775EC]">{activities?.totalOvertimeDuration || "-"}</td>
                                </tr>
                                <tr>
                                    <td colSpan={4} className="pb-4 px-4 text-lg font-semibold text-[#2775EC] rounded-bl-lg">Total Income</td>
                                    <td colSpan={4} className="pb-4 px-4 text-end text-lg font-semibold text-[#2775EC] rounded-br-lg">Rp{formatIDR(activities?.totalOvertimeEarnings || "-")}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div className="fixed bottom-8 right-8 cursor-pointer" onClick={handleAddProject}>
                    <div className="group">
                        <div className="bg-[#2775EC] h-14 w-14 flex justify-center items-center rounded-full transition-all duration-500 ease-out transform group-hover:w-40 group-hover:rounded-full border-2 border-white">
                            <span className="flex justify-center items-center text-white font-bold transition-all duration-500 ease-out w-full h-full">
                                <span className="group-hover:hidden text-2xl mb-1">+</span>
                                <span className="hidden group-hover:inline opacity-0 group-hover:opacity-100 transition-opacity duration-100 ease-out">Add Project</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <FormAddEditActivity isModalOpen={isModalOpen} closeModal={closeFModal} />
            <ModalFilter isModalOpen={isSecModalOpen} closeModal={closeSModal} />
        </>
    )
}