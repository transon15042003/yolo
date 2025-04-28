export function getHumidityAlert(humidity) {
    // Đảm bảo humidity là số và làm tròn 2 chữ số thập phân
    const humidValue = parseFloat(humidity).toFixed(2);

    // Khởi tạo object trả về
    let alert = {
        level: "",
        message: "",
        advice: "",
        color: "text-gray-100", // Màu mặc định cho văn bản
    };

    // Phân loại mức độ ẩm và đưa ra cảnh báo, lời khuyên
    if (humidValue <= 20) {
        alert.level = "Rất khô";
        alert.message = "Độ ẩm cực kỳ thấp, có thể gây khó chịu.";
        alert.advice =
            "Sử dụng máy tạo ẩm để tăng độ ẩm. Uống đủ nước để tránh khô da.";
        alert.color = "text-red-400"; // Màu đỏ nhạt cho cảnh báo nghiêm trọng
    } else if (humidValue > 20 && humidValue <= 40) {
        alert.level = "Khô";
        alert.message = "Độ ẩm thấp, có thể gây khô da hoặc tĩnh điện.";
        alert.advice =
            "Cân nhắc sử dụng máy tạo ẩm trong phòng. Giữ da đủ ẩm bằng kem dưỡng.";
        alert.color = "text-orange-400"; // Màu cam cho mức trung bình
    } else if (humidValue > 40 && humidValue <= 60) {
        alert.level = "Thoải mái";
        alert.message = "Độ ẩm ở mức lý tưởng, tốt cho sức khỏe.";
        alert.advice = "Duy trì mức độ ẩm này để đảm bảo sự thoải mái.";
        alert.color = "text-green-400"; // Màu xanh lá cho mức tốt
    } else if (humidValue > 60 && humidValue <= 80) {
        alert.level = "Ẩm";
        alert.message = "Độ ẩm cao, có thể gây cảm giác khó chịu.";
        alert.advice =
            "Sử dụng máy hút ẩm để giảm độ ẩm. Đảm bảo thông gió tốt.";
        alert.color = "text-yellow-400"; // Màu vàng cho mức cảnh báo nhẹ
    } else if (humidValue > 80) {
        alert.level = "Rất ẩm";
        alert.message = "Độ ẩm quá cao, nguy cơ nấm mốc và hỏng thiết bị tăng.";
        alert.advice =
            "Bật máy hút ẩm và kiểm tra hệ thống thông gió. Tránh để đồ đạc ẩm ướt.";
        alert.color = "text-red-400"; // Màu đỏ nhạt cho cảnh báo nghiêm trọng
    } else {
        alert.level = "Không xác định";
        alert.message = "Không thể xác định mức độ ẩm.";
        alert.advice = "Kiểm tra cảm biến độ ẩm.";
        alert.color = "text-gray-400"; // Màu xám cho lỗi
    }

    return alert;
}

export function getTemperatureAlert(temperature) {
    // Đảm bảo temperature là số và làm tròn 2 chữ số thập phân
    const tempValue = parseFloat(temperature).toFixed(2);

    // Khởi tạo object trả về
    let alert = {
        level: "",
        message: "",
        advice: "",
        color: "text-gray-100", // Màu mặc định cho văn bản
    };

    // Phân loại mức nhiệt độ và đưa ra cảnh báo, lời khuyên
    if (tempValue < 16) {
        alert.level = "Rất lạnh";
        alert.message =
            "Nhiệt độ rất thấp, có thể gây khó chịu hoặc nguy hiểm.";
        alert.advice = "Sử dụng máy sưởi và mặc ấm để giữ cơ thể ấm áp.";
        alert.color = "text-blue-400"; // Màu xanh dương cho lạnh
    } else if (tempValue >= 16 && tempValue <= 22) {
        alert.level = "Lạnh";
        alert.message = "Nhiệt độ thấp, có thể cần thêm lớp áo.";
        alert.advice = "Cân nhắc bật máy sưởi hoặc mặc áo ấm.";
        alert.color = "text-cyan-400"; // Màu xanh lam nhạt
    } else if (tempValue > 22 && tempValue <= 28) {
        alert.level = "Thoải mái";
        alert.message = "Nhiệt độ lý tưởng, phù hợp cho các hoạt động.";
        alert.advice = "Duy trì nhiệt độ này để đảm bảo sự thoải mái.";
        alert.color = "text-green-400"; // Màu xanh lá cho mức tốt
    } else if (tempValue > 28 && tempValue <= 32) {
        alert.level = "Nóng";
        alert.message = "Nhiệt độ cao, có thể gây khó chịu.";
        alert.advice = "Bật điều hòa hoặc quạt để làm mát không gian.";
        alert.color = "text-orange-400"; // Màu cam cho mức nóng
    } else if (tempValue > 32) {
        alert.level = "Rất nóng";
        alert.message = "Nhiệt độ rất cao, nguy cơ say nắng hoặc kiệt sức.";
        alert.advice = "Sử dụng điều hòa, uống nhiều nước và tránh ra ngoài.";
        alert.color = "text-red-400"; // Màu đỏ nhạt cho cảnh báo nghiêm trọng
    } else {
        alert.level = "Không xác định";
        alert.message = "Không thể xác định mức nhiệt độ.";
        alert.advice = "Kiểm tra cảm biến nhiệt độ.";
        alert.color = "text-gray-400"; // Màu xám cho lỗi
    }

    return alert;
}

export function getLightAlert(light) {
    // Đảm bảo light là số và làm tròn 2 chữ số thập phân
    const lightValue = parseFloat(light).toFixed(2);

    // Khởi tạo object trả về
    let alert = {
        level: "",
        message: "",
        advice: "",
        color: "text-gray-100", // Màu mặc định cho văn bản
    };

    // Phân loại mức ánh sáng và đưa ra cảnh báo, lời khuyên
    if (lightValue < 100) {
        alert.level = "Rất tối";
        alert.message = "Mức ánh sáng rất thấp, khó thực hiện các hoạt động.";
        alert.advice = "Bật đèn hoặc sử dụng đèn chiếu sáng bổ sung.";
        alert.color = "text-gray-400"; // Màu xám nhạt cho tối
    } else if (lightValue >= 100 && lightValue <= 500) {
        alert.level = "Tối";
        alert.message = "Mức ánh sáng thấp, có thể gây mỏi mắt.";
        alert.advice = "Tăng cường ánh sáng bằng đèn bàn hoặc đèn phòng.";
        alert.color = "text-blue-400"; // Màu xanh dương nhạt
    } else if (lightValue > 500 && lightValue <= 2000) {
        alert.level = "Bình thường";
        alert.message = "Mức ánh sáng phù hợp cho các hoạt động thông thường.";
        alert.advice = "Duy trì mức ánh sáng này để thoải mái.";
        alert.color = "text-green-400"; // Màu xanh lá cho mức tốt
    } else if (lightValue > 2000 && lightValue <= 10000) {
        alert.level = "Sáng";
        alert.message = "Mức ánh sáng cao, tốt cho các hoạt động chi tiết.";
        alert.advice = "Đảm bảo không gây chói mắt khi làm việc lâu dài.";
        alert.color = "text-yellow-400"; // Màu vàng cho mức sáng
    } else if (lightValue > 10000) {
        alert.level = "Rất sáng";
        alert.message = "Mức ánh sáng rất cao, có thể gây chói hoặc khó chịu.";
        alert.advice = "Giảm ánh sáng hoặc sử dụng rèm che để điều chỉnh.";
        alert.color = "text-orange-400"; // Màu cam cho mức rất sáng
    } else {
        alert.level = "Không xác định";
        alert.message = "Không thể xác định mức ánh sáng.";
        alert.advice = "Kiểm tra cảm biến ánh sáng.";
        alert.color = "text-gray-400"; // Màu xám cho lỗi
    }

    return alert;
}
