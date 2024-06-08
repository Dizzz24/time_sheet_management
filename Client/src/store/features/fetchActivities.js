import axios from "../../BaseUrl"
import { createSlice } from "@reduxjs/toolkit"

const activitySlice = createSlice({
    name: "activities",
    initialState: {
        activities: [],
        projects: [],
        filter: "",
    },
    reducers: {
        setActivities: (state, action) => {
            state.activities = action.payload
        },
        setProjects: (state, action) => {
            state.projects = action.payload
        },
        setFilter: (state, action) => {
            state.filter = action.payload
        }
    }
})

export const fetchActivities = (search, filter) => async (dispatch) => {
    try {
        if (filter) {
            filter = filter && filter.join(", ")
            dispatch(setFilter(filter))
        }
        const { data } = await axios({
            url: `/activities?search=${search || ""}&filter=${filter}`,
            headers: {
                Authorization: `Bearer ${localStorage.access_token}`,
            }
        })

        dispatch(setActivities(data))
    } catch (error) {
        console.log(error)
    }
}

export const fetchProjects = () => async (dispatch) => {
    try {
        const { data } = await axios({
            url: "/projects",
            headers: {
                Authorization: `Bearer ${localStorage.access_token}`
            }
        })

        dispatch(setProjects(data))
    } catch (error) {
        console.log(error)
    }
}

export const { setActivities, setProjects, setFilter } = activitySlice.actions

export default activitySlice.reducer