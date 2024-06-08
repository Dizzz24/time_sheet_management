import { useState, useEffect, ChangeEvent } from 'react'
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
    Tag,
    TagLabel,
    TagCloseButton,
    useDisclosure,
    Divider,
} from '@chakra-ui/react'
import { IoMdCloseCircle } from "react-icons/io"
import axios from '../../BaseUrl'
import { fetchActivities } from "../../store/features/fetchActivities.js"
import { useDispatch } from 'react-redux'

export default function ModalFilter({ isModalOpen, closeModal }) {
    const dispatch = useDispatch()
    const [name, setName] = useState("")
    const [selectedProject, setSelectedProject] = useState<string[]>([])
    const [projects, setProjects] = useState<{ id: number, name: string }[]>([])

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        if (!selectedProject.includes(value)) {
            setSelectedProject([...selectedProject, value])
        }
    }

    const handleRemoveOption = (optionToRemove: string) => {
        setSelectedProject(selectedProject.filter((option) => option !== optionToRemove))
    }

    const fetchProject = async () => {
        try {
            const { data } = await axios({
                url: "/projects",
                headers: {
                    Authorization: `Bearer ${localStorage.access_token}`
                }
            })

            setProjects(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async () => {
        try {
            dispatch(fetchActivities("", selectedProject))
            closeModal()
        } catch (error) {
            console.log(error, "< ==")
        }
    }

    useEffect(() => {
        fetchProject()
    }, [])


    return (
        <>
            <Modal isOpen={isModalOpen} onClose={closeModal} size="3xl" isCentered closeOnOverlayClick={false}>
                <ModalOverlay />
                <ModalContent borderRadius="lg" p={4}>
                    <ModalHeader fontWeight={700} >Filter</ModalHeader>
                    <ModalCloseButton marginY={2} marginRight={2} />
                    <Divider />
                    <ModalBody p={2}>
                        <FormControl my={4} isRequired>
                            <FormLabel>Project</FormLabel>
                            <Select size="lg" onChange={handleSelectChange}>
                                <option disabled={true}>Choose multiple filters</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </Select>
                            <div className='flex flex-wrap gap-2 mt-2'>
                                {selectedProject.sort((a, b) => a.length - b.length).map((option) => (
                                    <Tag
                                        size="lg"
                                        key={option}
                                        borderRadius="full"
                                        variant="solid"
                                        py={2}
                                        gap={1}
                                    >
                                        <IoMdCloseCircle className='cursor-pointer' onClick={() => handleRemoveOption(option)} size={24} />
                                        <TagLabel>{projects.find(project => project.id === parseInt(option))?.name}</TagLabel>
                                    </Tag>
                                ))}
                            </div>
                        </FormControl>
                    </ModalBody>
                    <Divider />
                    <ModalFooter>
                        <Button onClick={() => setSelectedProject([])} size="lg" mr={3} colorScheme="gray" background={"none"} color={"#F15858"}>
                            Delete Filter
                        </Button>
                        <Button colorScheme='red' size="lg" onClick={handleSubmit}>
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal >
        </>
    )
}
