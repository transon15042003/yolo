export default function PowerCard({
    title,
    value,
    changes,
    unit,
    color,
    bgColor,
    borderColor,
    timeRange,
}) {
    const formatChange = (change) => {
        const sign = change >= 0 ? "+" : "";
        return `${sign}${change.toFixed(1)}%`;
    };

    const getChangeColor = (change) =>
        change >= 0 ? "text-red-400" : "text-green-400";

    let changeText = "";
    let changeValue = 0;
    if (timeRange === "day") {
        changeText = `So với giờ trước: ${formatChange(changes.hourChange)}`;
        changeValue = changes.hourChange;
    } else if (timeRange === "month") {
        changeText = `So với ngày trước: ${formatChange(changes.dayChange)}`;
        changeValue = changes.dayChange;
    } else if (timeRange === "year") {
        changeText = `So với tháng trước: ${formatChange(changes.monthChange)}`;
        changeValue = changes.monthChange;
    }

    return (
        <div className={`p-4 rounded-lg ${bgColor} border ${borderColor}`}>
            <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
            <p className="text-2xl font-bold" style={{ color }}>
                {value !== undefined ? value.toFixed(2) : "0.00"} {unit}
            </p>
            <div className="mt-2 text-sm">
                <p className={getChangeColor(changeValue)}>{changeText}</p>
            </div>
        </div>
    );
}
