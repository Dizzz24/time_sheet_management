const calculateOvertime = (activities) => {
    if (!activities.length) return { totalOvertimeDuration: 0, totalOvertimeEarnings: 0 }
    let totalOvertimeDuration = 0
    let totalOvertimeEarnings = 0
    const rate = activities[0].Employee.rate

    activities.forEach(activity => {
        const startTime = new Date(`1970-01-01T${activity.startTime}`)
        const endTime = new Date(`1970-01-01T${activity.endTime}`)
        const durationInMinutes = (endTime - startTime) / (1000 * 60)

        console.log({ startTime, endTime, durationInMinutes })

        // Validation of work duration: More than 8 hours & outside regular hours
        if (durationInMinutes > 480 && (startTime.getHours() < 9 || endTime.getHours() > 17)) {
            const overtimeDuration = durationInMinutes - 480
            totalOvertimeDuration += overtimeDuration
        }
    })

    // Reformat date
    const hours = Math.floor(totalOvertimeDuration / 60)
    const minutes = totalOvertimeDuration % 60
    console.log({ hours, minutes })
    const formattedOvertimeDuration = `${hours} hour ${minutes} minute`

    totalOvertimeEarnings = (totalOvertimeDuration / 60) * rate * 0.3

    return { totalOvertimeDuration: formattedOvertimeDuration, totalOvertimeEarnings }
}

module.exports = calculateOvertime