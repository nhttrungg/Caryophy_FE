export const convertTimestampToReadableFormat = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
        timeZone: 'UTC',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

export const formatLastAccess = (lastAccess) => {
    const now = new Date();
    const lastAccessDate = new Date(lastAccess);
    const diffInMinutes = Math.floor((now - lastAccessDate) / 60000);

    if (diffInMinutes < 60) {
        return `Hoạt động ${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 1440) {
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `Hoạt động ${diffInHours} giờ trước`;
    } else {
        return "Không hoạt động gần đây";
    }
};
