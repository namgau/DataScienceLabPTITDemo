# DSLab PTIT — Kiểm tra hằng tuần

Web kiểm tra sau mỗi tuần học của Data Science Lab (Khoa CNTT – PTIT). Lộ trình 16 tuần (tuần 0 đến tuần 15), mỗi tuần có:

- **Trắc nghiệm** kiểu Coursera: chọn một đáp án, chọn nhiều đáp án, điền số. Đề xáo trộn mỗi lượt, cần đạt ≥ 80%. Tuần thường được làm 3 lượt mỗi 8 giờ. Tuần thi (0, 8, 15) chỉ làm 1 lần và có giới hạn thời gian.
- **Bài lập trình** dạng notebook giống ML/DL Specialization (`### START CODE HERE ###`). Python chạy ngay trên trình duyệt (Pyodide) để chạy thử và chạy test công khai. Khi nộp, server chấm lại bằng **test ẩn** trong sandbox. Cần ≥ 80%.
- **Mở khoá tuần tự**: phải đạt cả hai thì tuần sau mới mở. Riêng tuần 0 (test đầu vào) chỉ cần nộp đủ, điểm dùng để xếp lộ trình.

Trang **Giảng viên** (`/admin`) cho xem tiến độ cả lớp, xem code học viên đã nộp và cho phép làm lại trắc nghiệm.

## Chạy

Yêu cầu Node.js ≥ 22 (cần permission model cho sandbox chấm bài) và có Internet (để tải Pyodide và các package Python lần đầu).

```bash
npm install
npm run dev          # http://localhost:3000
# hoặc production
npm run build && npm start
```

Tài khoản giảng viên mặc định được tạo khi chạy lần đầu: **admin / dslab@2026**. Mã lớp để học viên đăng ký: **DSLAB-PTIT**.

### Biến môi trường

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `ADMIN_USERNAME` | `admin` | Tên tài khoản giảng viên tạo lúc khởi tạo DB |
| `ADMIN_PASSWORD` | `dslab@2026` | Mật khẩu giảng viên — **đổi trước khi triển khai** |
| `CLASS_CODE` | `DSLAB-PTIT` | Mã lớp bắt buộc khi đăng ký |
| `INSECURE_COOKIES` | – | Đặt `1` nếu chạy production qua HTTP (không HTTPS) |

Dữ liệu lưu ở `data/dslab.sqlite`. Wheel Python cho grader được cache ở `.pyodide-cache/`.

## Cấu trúc

```
src/content/        Đề 16 tuần: câu hỏi, đáp án, bài code, lời giải mẫu, test ẩn (chỉ server đọc)
src/lib/            auth, DB, tiến độ / mở khoá, chấm trắc nghiệm, chấm code
src/lib/py-harness  Harness Python dùng chung cho trình duyệt và grader
grader/runner.mjs   Tiến trình chấm bài chạy trong sandbox
public/py-worker.js Kernel Python trên trình duyệt (Web Worker)
scripts/verify-content.mjs  Kiểm chứng đề
```

### Sandbox chấm bài

Mỗi bài nộp chạy trong một tiến trình Node riêng với `--permission`: chỉ được đọc thư mục Pyodide và cache wheel, không ghi file, không tạo tiến trình con, không có biến môi trường của server. Bài chấm quá 120 giây thì bị huỷ. Luôn có sẵn một sandbox đã khởi động để học viên không phải chờ nạp Python.

### Sửa đề

Mỗi tuần là một object `Week` trong `src/content/stage*.ts`. Mỗi bài code có `starter`, `solution`, `tests` (công khai) và `hidden` (ẩn). Sau khi sửa, chạy:

```bash
node scripts/verify-content.mjs        # tất cả các tuần
node scripts/verify-content.mjs 4 5    # chỉ tuần 4 và 5
```

Script kiểm tra: lời giải mẫu phải đạt mọi test (cả test ẩn) trong sandbox, code khởi đầu không được tự đạt, đáp án trắc nghiệm không vượt phạm vi.
