# Web Mô Phỏng Thuật Toán Dijkstra (Dijkstra Algorithm Simulator)

[![Status](https://img.shields.io/badge/Status-Complete-green.svg)]()

Ứng dụng web tương tác trực quan hóa thuật toán Dijkstra tìm đường đi ngắn nhất trên đồ thị có trọng số không âm. Đây là dự án thuộc Bài tập lớn môn **Kỹ thuật ra quyết định** tại Trường Đại học Bách Khoa - ĐHQG TP.HCM.

## 🔗 Liên kết quan trọng

* **🌐 Live Demo:** [nduytuyen.github.io/dijkstra-simulator/](https://nduytuyen.github.io/dijkstra-simulator/) — Trải nghiệm trực tiếp ứng dụng trên trình duyệt.
* **📺 Video Demo:** [YouTube Link](https://youtu.be/kYgtpJHZENY) — Hướng dẫn thao tác và giải thích quy trình vận hành.
* **💻 Source Code:** [GitHub Repository](https://github.com/nduytuyen/dijkstra-simulator) — Kho lưu trữ mã nguồn dự án.

## ✨ Tính năng nổi bật

* **Xây dựng đồ thị linh hoạt:** Thêm/xóa nút và cạnh bằng thao tác chuột đơn giản. Hỗ trợ cả đồ thị có hướng và vô hướng.
* **Tùy chỉnh trọng số:** Thay đổi trọng số cạnh thời gian thực để quan sát sự thay đổi của lộ trình ngắn nhất.
* **Mô phỏng trực quan (Visualization):** * Sử dụng màu sắc để phân biệt trạng thái nút (Nguồn: Xanh lá, Đích: Đỏ, Đã duyệt: Xanh dương).
    * Highlight đường đi ngắn nhất bằng màu hồng nổi bật sau khi tính toán.
* **Nhật ký giải thuật (Academic Logs):** Xuất bảng nhãn $P(k)$ chi tiết cho từng bước lặp, bao gồm cả quá trình truy vết (tracing) giúp người học đối chiếu dễ dàng với bài tập giải tay.
* **Tạo đồ thị ngẫu nhiên:** Tính năng hữu ích để thử nghiệm thuật toán trên các cấu trúc đồ thị phức tạp chỉ với một nút bấm.

## 🛠️ Công nghệ sử dụng

* **Frontend:** HTML5, CSS3 (Giao diện tối chuyên nghiệp theo phong cách Catppuccin).
* **Core Logic:** JavaScript ES6+ (Xử lý thuật toán hoàn toàn tại Client-side, không cần server).
* **Library:** [Vis.js Network](https://visjs.github.io/vis-network/docs/network/) — Xử lý vẽ đồ thị và tương tác vật lý (kéo thả, zoom).

## 📂 Cấu trúc mã nguồn

```text
.
├── index.html       # Cấu trúc giao diện Dashboard
├── style.css       # Định dạng thẩm mỹ và các hiệu ứng animation
├── script.js      # Algorithm Engine (Dijkstra) và xử lý sự kiện
└── README.md      # Tài liệu hướng dẫn dự án
