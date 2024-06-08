import React, { useState, ChangeEvent, useEffect } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    HStack,
    VStack,
    Divider,
    Tag,
    TagLabel
} from '@chakra-ui/react'
import Swal from 'sweetalert2'
import axios from "../../BaseUrl"
import { TbExclamationCircle } from "react-icons/tb"
import { fetchActivities } from "../../store/features/fetchActivities.js"
import { useSelector, useDispatch } from 'react-redux'
import { fetchProjects } from "../../store/features/fetchActivities.js"

interface FormData {
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    name: string
    ProjectId: string
}

function FormAddEditActivity({ isModalOpen, closeModal, idActivity }): React.FC {
    const dispatch = useDispatch()
    const [formData, setFormData] = useState<FormData>({
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        name: '',
        ProjectId: ''
    })
    const projects = useSelector(state => state.projects)

    const [errorMessage, setErrorMessage] = useState<string[]>([])

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        console.log({ name, value })
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const resetForm = () => {
        setFormData({
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            name: '',
            ProjectId: ''
        })
    }

    const handleModalClose = async (isSubmit?: boolean) => {
        if (isSubmit) {
            try {
                let method = "post"
                let url = "/activities"

                if (idActivity) {
                    method = "put"
                    url += `/${idActivity}`
                }

                const { data } = await axios({
                    method,
                    url,
                    data: formData,
                    headers: {
                        Authorization: `Bearer ${localStorage.access_token}`
                    }
                })

                Swal.fire(data.message, "", "success")
                resetForm()
                closeModal()
                setErrorMessage([])
                dispatch(fetchActivities())
            } catch (error) {
                console.log(error?.response?.data, "< +==")
                const errors = error?.response?.data?.message
                if (Array.isArray(errors)) {
                    setErrorMessage(errors)
                }
            }
        } else {
            resetForm()
            closeModal()
            setErrorMessage([])
        }
    }

    const fetchDetail = async () => {
        try {
            const { data } = await axios({
                url: `/activities/${idActivity}`,
                headers: {
                    Authorization: `Bearer ${localStorage.access_token}`
                }
            })

            setFormData(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        dispatch(fetchProjects())
        if (idActivity) {
            fetchDetail()
        }
    }, [])

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => handleModalClose()} size="5xl" isCentered closeOnOverlayClick={false}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader marginY={2} fontWeight={700} >{idActivity ? "Edit Activity" : "Add New Activity"}</ModalHeader>
                    <ModalCloseButton marginY={2} marginRight={2} />
                    <Divider />
                    <ModalBody>
                        <VStack spacing={6}>
                            {errorMessage?.length > 0 && <h1 className="text-2xl font-bold">Please correct the message below!</h1>}
                            <div className='flex flex-wrap gap-2'>
                                {errorMessage?.length > 0 && errorMessage?.map((option) => (
                                    <Tag
                                        size="lg"
                                        key={option}
                                        borderRadius="full"
                                        variant="solid"
                                        colorScheme='red'
                                        py={2}
                                        gap={1}
                                    >
                                        <TbExclamationCircle size={24} />
                                        <TagLabel>{option}</TagLabel>
                                    </Tag>
                                ))}
                            </div>
                            <HStack spacing={4} marginTop={2} w="100%" gap={4}>
                                <FormControl isRequired>
                                    <FormLabel>Start Date</FormLabel>
                                    <Input
                                        size="lg"
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>End Date</FormLabel>
                                    <Input
                                        size="lg"
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Start Time</FormLabel>
                                    <Input
                                        size="lg"
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>End Time</FormLabel>
                                    <Input
                                        size="lg"
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </HStack>
                            <FormControl isRequired w="100%">
                                <FormLabel>Activity Title</FormLabel>
                                <Input
                                    size="lg"
                                    type="text"
                                    name="name"
                                    placeholder="Type some..."
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </FormControl>
                            <FormControl isRequired w="100%" marginBottom={2}>
                                <FormLabel>Project Name</FormLabel>
                                <Select
                                    size="lg"
                                    name="ProjectId"
                                    value={formData.ProjectId}
                                    onChange={handleChange}>
                                    <option disabled={true} selected={true}>
                                        Choose one
                                    </option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <Divider />
                    <ModalFooter>
                        <Button background={"none"} color={"#F15858"} size="lg" mr={3} onClick={() => handleModalClose()}>
                            Cancel
                        </Button>
                        <Button colorScheme="red" size="lg" onClick={() => {
                            // handle form submission
                            console.log(formData)
                            handleModalClose(true)
                        }}>Submit</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default FormAddEditActivity
