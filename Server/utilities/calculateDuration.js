const calculateDuration = (activity) => {
    const start = new Date(`${activity.startDate}T${activity.startTime}`);
    const end = new Date(`${activity.endDate}T${activity.endTime}`);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours} hour ${diffMinutes} minute`;
};

module.exports = calculateDuration;