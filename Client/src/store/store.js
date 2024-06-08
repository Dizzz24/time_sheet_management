import { configureStore } from "@reduxjs/toolkit";
import activitySlice from "./features/fetchActivities"

const store = configureStore({
    reducer: activitySlice
})

export default store