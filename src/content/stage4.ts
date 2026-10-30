import { py, type Week } from './types';

export const week13: Week = {
  n: 13,
  title: 'LLM, mô hình sinh & đọc paper',
  stage: 4,
  summary: 'BERT và GPT, pretraining và fine-tuning, Hugging Face, LoRA; VAE, GAN, Diffusion; phương pháp đọc paper khoa học.',
  topics: ['BERT vs GPT', 'Pretraining & fine-tuning', 'Hugging Face', 'LoRA', 'VAE, GAN, Diffusion', 'Đọc paper'],
  practice: 'Fine-tune một mô hình nhỏ với LoRA (Colab) và tóm tắt 3 paper. Bài chấm tự động: các thành phần sinh văn bản và LoRA bằng NumPy.',
  gate: 'pass',
  quiz: {
    questions: [
      {
        id: 'w13q1', kind: 'single',
        prompt: 'Khác biệt cốt lõi giữa BERT và GPT là:',
        options: [
          'BERT là encoder học hai chiều bằng masked LM; GPT là decoder sinh tuần tự từ trái sang phải',
          'BERT dùng RNN, GPT dùng Transformer',
          'GPT không cần pretraining',
          'BERT chỉ dùng cho ảnh',
        ], answer: 0,
        explain: 'Mục tiêu tiền huấn luyện và kiểu attention mask khác nhau.',
      },
      {
        id: 'w13q2', kind: 'single',
        prompt: 'LoRA fine-tune mô hình lớn bằng cách:',
        options: ['Đóng băng W gốc, chỉ học ΔW = A·B có hạng thấp', 'Huấn luyện lại toàn bộ tham số với learning rate nhỏ', 'Cắt bớt các lớp cuối', 'Lượng tử hoá trọng số xuống 4 bit'], answer: 0,
        explain: 'Lượng tử hoá là QLoRA kết hợp thêm, không phải bản chất của LoRA.',
      },
      {
        id: 'w13q3', kind: 'numeric',
        prompt: 'Áp LoRA hạng r = 8 cho một ma trận 4096 × 4096. Số tham số cần học thêm là:',
        answer: 65536, tolerance: 1e-6,
        explain: 'r·(d_in + d_out) = 8·8192 = 65 536, so với 16.7 triệu của ma trận gốc.',
      },
      {
        id: 'w13q4', kind: 'single',
        prompt: 'Khi sinh văn bản, giảm temperature xuống dưới 1 sẽ:',
        options: ['Làm phân phối nhọn hơn, đầu ra ít ngẫu nhiên hơn', 'Làm phân phối phẳng hơn, đầu ra đa dạng hơn', 'Tăng độ dài câu trả lời', 'Không ảnh hưởng tới phân phối'], answer: 0,
        explain: 'softmax(z/T) với T → 0 tiến tới argmax.',
      },
      {
        id: 'w13q5', kind: 'single',
        prompt: 'Mô hình diffusion học điều gì?',
        options: ['Đảo ngược quá trình thêm nhiễu dần dần, khử nhiễu từng bước để sinh dữ liệu', 'Nén dữ liệu vào không gian ẩn rồi giải nén', 'Cho hai mạng đối kháng nhau', 'Dự đoán token tiếp theo'], answer: 0,
        explain: 'Nén/giải nén là VAE; đối kháng là GAN.',
      },
      {
        id: 'w13q6', kind: 'single',
        prompt: 'Trong GAN, discriminator được huấn luyện để:',
        options: ['Phân biệt dữ liệu thật với dữ liệu do generator sinh ra', 'Sinh dữ liệu giống thật', 'Mã hoá dữ liệu thành vector ẩn', 'Khử nhiễu ảnh'], answer: 0,
        explain: 'Generator và discriminator chơi trò chơi minimax.',
      },
      {
        id: 'w13q7', kind: 'single',
        prompt: 'Theo phương pháp đọc paper "3 lượt" (Keshav), lượt đọc đầu tiên nên:',
        options: ['Đọc tiêu đề, abstract, phần mở đầu, các tiêu đề mục, hình vẽ và kết luận để nắm ý chính', 'Đọc kỹ từng chứng minh', 'Cài đặt lại toàn bộ thí nghiệm', 'Đọc phần tài liệu tham khảo trước'], answer: 0,
        explain: 'Lượt 2 đọc kỹ phương pháp và kết quả; lượt 3 tái hiện và phản biện.',
      },
    ],
  },
  lab: {
    title: 'Sinh văn bản và LoRA',
    intro: 'Logits là điểm số chưa chuẩn hoá mà mô hình ngôn ngữ trả về cho mỗi token trong từ vựng. Bạn sẽ cài các bước biến logits thành phân phối lấy mẫu, phép tính của một lớp LoRA, và một bước của thuật toán BPE.',
    setup: py`import numpy as np
from collections import Counter
np.set_printoptions(precision=4, suppress=True)

def softmax(x):
    x = np.asarray(x, dtype=float)
    e = np.exp(x - np.max(x))
    return e / e.sum()

logits_demo = np.array([2.0, 1.0, 0.5, -1.0, 3.0])`,
    packages: ['numpy'],
    exercises: [
      {
        id: 'temperature', title: 'Temperature', points: 20,
        instructions: `Viết \`apply_temperature(logits, T)\` trả về phân phối xác suất \`softmax(logits / T)\`. Dùng hàm \`softmax\` đã có.`,
        starter: py`# GRADED FUNCTION: apply_temperature
def apply_temperature(logits, T):
    ### START CODE HERE ### (≈ 1 dòng)
    probs = None
    ### END CODE HERE ###
    return probs

for T in [0.5, 1.0, 2.0]:
    print(T, apply_temperature(logits_demo, T))`,
        solution: py`def apply_temperature(logits, T):
    return softmax(np.asarray(logits, dtype=float) / T)`,
        tests: [
          { name: 'T = 1 là softmax', code: py`assert close(apply_temperature(logits_demo, 1.0), softmax(logits_demo)), "T = 1 phải trùng softmax"` },
        ],
        hidden: [
          { name: 'T nhỏ nhọn hơn', code: py`p_lo = apply_temperature(logits_demo, 0.3); p_hi = apply_temperature(logits_demo, 3.0)
assert p_lo.max() > p_hi.max(), "T nhỏ phải cho phân phối nhọn hơn"
assert close(p_lo, softmax(logits_demo / 0.3)), "Sai giá trị với T = 0.3"` },
        ],
      },
      {
        id: 'topk', title: 'Top-k filtering', points: 25,
        instructions: `Viết \`top_k_filter(logits, k)\` trả về mảng cùng kích thước: giữ nguyên k logits lớn nhất, các vị trí còn lại đặt bằng \`-np.inf\` (để softmax cho xác suất 0).`,
        starter: py`# GRADED FUNCTION: top_k_filter
def top_k_filter(logits, k):
    logits = np.asarray(logits, dtype=float)
    ### START CODE HERE ### (≈ 3 dòng)
    out = None
    ### END CODE HERE ###
    return out

print(top_k_filter(logits_demo, 2))`,
        solution: py`def top_k_filter(logits, k):
    logits = np.asarray(logits, dtype=float)
    out = np.full_like(logits, -np.inf)
    idx = np.argsort(logits)[-k:]
    out[idx] = logits[idx]
    return out`,
        tests: [
          { name: 'k = 2', code: py`r = top_k_filter(logits_demo, 2)
assert list(np.isfinite(r)) == [True, False, False, False, True], f"Nhận {r}"
assert close(r[[0, 4]], [2.0, 3.0]), "Giá trị được giữ phải không đổi"` },
        ],
        hidden: [
          { name: 'k = độ dài', code: py`assert close(top_k_filter(logits_demo, 5), logits_demo), "k bằng số phần tử thì giữ nguyên"` },
          { name: 'Xác suất sau lọc', code: py`p = softmax(top_k_filter([0.1, 5.0, 0.2, 4.0, -3.0, 0.0], 3))
assert (p > 0).sum() == 3 and close(p.sum(), 1.0), "Chỉ 3 token có xác suất dương"` },
        ],
      },
      {
        id: 'lora', title: 'Lớp LoRA', points: 30,
        instructions: `Một lớp tuyến tính với trọng số đóng băng W (d_in × d_out) và hai ma trận học được A (d_in × r), B (r × d_out):

\`\`\`
h = x @ W + (alpha / r) · (x @ A @ B)
\`\`\`

Viết hai hàm:
- \`lora_forward(x, W, A, B, alpha)\` — r lấy từ \`A.shape[1]\`.
- \`lora_param_count(d_in, d_out, r)\` — số tham số học được của A và B.`,
        starter: py`# GRADED FUNCTION: lora_forward, lora_param_count
def lora_forward(x, W, A, B, alpha):
    ### START CODE HERE ### (≈ 2 dòng)
    h = None
    ### END CODE HERE ###
    return h

def lora_param_count(d_in, d_out, r):
    ### START CODE HERE ### (≈ 1 dòng)
    count = None
    ### END CODE HERE ###
    return count

print(lora_param_count(4096, 4096, 8))`,
        solution: py`def lora_forward(x, W, A, B, alpha):
    r = A.shape[1]
    return x @ W + (alpha / r) * (x @ A @ B)

def lora_param_count(d_in, d_out, r):
    return r * (d_in + d_out)`,
        tests: [
          { name: 'B = 0 thì giống lớp gốc', code: py`rng = np.random.default_rng(0)
x = rng.normal(size=(3, 6)); W = rng.normal(size=(6, 5)); A = rng.normal(size=(6, 2))
assert close(lora_forward(x, W, A, np.zeros((2, 5)), 16), x @ W), "Khởi tạo B = 0 phải cho đầu ra bằng lớp gốc"` },
        ],
        hidden: [
          { name: 'Giá trị', code: py`rng = np.random.default_rng(1)
x = rng.normal(size=(4, 8)); W = rng.normal(size=(8, 3)); A = rng.normal(size=(8, 4)); B = rng.normal(size=(4, 3))
assert close(lora_forward(x, W, A, B, 8), x @ W + 2.0 * (x @ A @ B)), "Sai hệ số alpha / r"` },
          { name: 'Đếm tham số', code: py`assert lora_param_count(4096, 4096, 8) == 65536 and lora_param_count(768, 3072, 4) == 15360, "Sai số tham số"` },
        ],
      },
      {
        id: 'bpe', title: 'Một bước BPE', points: 25,
        instructions: `\`words\` là list các từ, mỗi từ là list token (ban đầu là từng ký tự). Viết \`most_frequent_pair(words)\` trả về tuple hai token liền kề xuất hiện nhiều nhất trên toàn bộ \`words\`. Nếu hoà, trả về cặp **nhỏ nhất theo thứ tự từ điển**.`,
        starter: py`# GRADED FUNCTION: most_frequent_pair
def most_frequent_pair(words):
    counts = Counter()
    ### START CODE HERE ###
    pair = None
    ### END CODE HERE ###
    return pair

words = [list("low"), list("lower"), list("newest"), list("widest")]
print(most_frequent_pair(words))`,
        solution: py`def most_frequent_pair(words):
    counts = Counter()
    for w in words:
        for a, b in zip(w, w[1:]):
            counts[(a, b)] += 1
    best = max(counts.values())
    return min(p for p, c in counts.items() if c == best)`,
        tests: [
          { name: 'Ví dụ trong đề', code: py`r = most_frequent_pair([list("low"), list("lower"), list("newest"), list("widest")])
assert tuple(r) == ("e", "s"), f"Nhận {r}"` },
        ],
        hidden: [
          { name: 'Hoà phiếu', code: py`r = most_frequent_pair([list("ab"), list("cd"), list("ab"), list("cd")])
assert tuple(r) == ("a", "b"), f"Hoà thì chọn cặp nhỏ nhất, nhận {r}"` },
          { name: 'Token nhiều ký tự', code: py`r = most_frequent_pair([["th", "e"], ["th", "e", "n"], ["e", "n"], ["e", "n", "d"]])
assert tuple(r) == ("e", "n"), f"Nhận {r}"` },
        ],
      },
    ],
  },
};

export const week14: Week = {
  n: 14,
  title: 'Phương pháp thực nghiệm & viết báo cáo',
  stage: 4,
  summary: 'Baseline, ablation study, cố định seed và tái lập; báo cáo kết quả có thống kê; LaTeX/Overleaf; đạo đức AI và liêm chính học thuật.',
  topics: ['Baseline & ablation', 'Random seed, reproducibility', 'Báo cáo mean ± std', 'LaTeX / Overleaf', 'Đạo đức AI, liêm chính học thuật'],
  practice: 'Viết kế hoạch thí nghiệm, reproduce một kết quả paper, viết nháp báo cáo. Bài chấm tự động: các công cụ thống kê để báo cáo kết quả.',
  gate: 'pass',
  quiz: {
    questions: [
      {
        id: 'w14q1', kind: 'single',
        prompt: 'Ablation study là:',
        options: ['Lần lượt bỏ hoặc thay từng thành phần của phương pháp để đo đóng góp của nó', 'So sánh với nhiều mô hình khác', 'Tăng kích thước mô hình đến khi hết cải thiện', 'Đánh giá trên nhiều tập dữ liệu'], answer: 0,
        explain: 'Ablation trả lời câu hỏi: thành phần này có thực sự cần thiết không?',
      },
      {
        id: 'w14q2', kind: 'single',
        prompt: 'Vì sao cần cố định random seed khi báo cáo thí nghiệm?',
        options: ['Để người khác chạy lại được đúng kết quả', 'Để mô hình chính xác hơn', 'Để huấn luyện nhanh hơn', 'Vì Python bắt buộc'], answer: 0,
        explain: 'Cố định seed giúp tái lập; nhưng vẫn nên chạy nhiều seed để thấy độ biến thiên.',
      },
      {
        id: 'w14q3', kind: 'single',
        prompt: '"Accuracy 92.3 ± 0.5" (5 seed) thường có nghĩa là:',
        options: ['Trung bình 92.3% qua 5 lần chạy, độ lệch chuẩn 0.5', 'Accuracy chắc chắn nằm trong [91.8, 92.8]', 'Mô hình sai 0.5%', 'Dùng 0.5% dữ liệu để kiểm tra'], answer: 0,
        explain: 'Đây là thống kê mô tả, không phải khoảng tin cậy.',
      },
      {
        id: 'w14q4', kind: 'single',
        prompt: 'Baseline trong một bài báo là:',
        options: ['Phương pháp tham chiếu (thường đơn giản hoặc là SOTA hiện có) để so sánh', 'Phiên bản đầu tiên của mô hình đề xuất', 'Tập dữ liệu dùng để huấn luyện', 'Kết quả tốt nhất từng đạt được'], answer: 0,
        explain: 'Không có baseline mạnh thì cải thiện không có ý nghĩa.',
      },
      {
        id: 'w14q5', kind: 'single',
        prompt: 'Mô hình A đạt 85.2 ± 1.5, mô hình B đạt 85.6 ± 1.8 (mỗi cái 3 seed). Kết luận hợp lý là:',
        options: ['Chưa đủ bằng chứng B tốt hơn; cần thêm lần chạy hoặc kiểm định thống kê', 'B tốt hơn A rõ rệt', 'A tốt hơn vì độ lệch chuẩn nhỏ hơn', 'Hai mô hình giống hệt nhau'], answer: 0,
        explain: 'Chênh lệch 0.4 nhỏ hơn nhiều so với độ biến thiên.',
      },
      {
        id: 'w14q6', kind: 'multi',
        prompt: 'Hành vi nào đúng chuẩn liêm chính học thuật?',
        options: ['Ghi rõ nguồn code và tài liệu sử dụng lại', 'Chỉ báo cáo seed cho kết quả tốt nhất', 'Công bố code và cấu hình để người khác tái lập', 'Chỉnh hyperparameter dựa trên tập test'], answer: [0, 2],
        explain: 'Chọn seed đẹp và tune trên test đều làm sai lệch kết quả.',
      },
      {
        id: 'w14q7', kind: 'single',
        prompt: 'Trong LaTeX, cách chuẩn để quản lý tài liệu tham khảo là:',
        options: ['File .bib với BibTeX/BibLaTeX và lệnh \\cite{}', 'Gõ tay danh sách cuối bài', 'Chèn link URL vào chân trang', 'Dùng \\ref{} cho mọi tài liệu'], answer: 0,
        explain: '\\ref dùng cho tham chiếu nội bộ (hình, bảng, mục).',
      },
    ],
  },
  lab: {
    title: 'Thống kê cho báo cáo thí nghiệm',
    intro: 'Bạn có điểm của baseline và phương pháp đề xuất trên 10 seed (`scores_base`, `scores_new`, ghép cặp theo seed). Hãy viết các công cụ để báo cáo kết quả một cách trung thực.',
    setup: py`import numpy as np
scores_base = np.array([84.1, 85.0, 83.7, 84.9, 85.3, 84.4, 83.9, 84.8, 85.1, 84.6])
scores_new  = np.array([85.0, 85.4, 84.9, 85.2, 86.1, 85.0, 84.3, 85.9, 85.6, 85.3])`,
    packages: ['numpy'],
    exercises: [
      {
        id: 'meanstd', title: 'Mean và std mẫu', points: 25,
        instructions: `Viết \`mean_std(scores)\` trả về \`(mean, std)\` với std là **độ lệch chuẩn mẫu** (\`ddof=1\`).`,
        starter: py`# GRADED FUNCTION: mean_std
def mean_std(scores):
    scores = np.asarray(scores, dtype=float)
    ### START CODE HERE ### (≈ 2 dòng)
    mean = std = None
    ### END CODE HERE ###
    return mean, std

print(mean_std(scores_base))`,
        solution: py`def mean_std(scores):
    scores = np.asarray(scores, dtype=float)
    return scores.mean(), scores.std(ddof=1)`,
        tests: [
          { name: 'Ví dụ nhỏ', code: py`m, s = mean_std([1, 2, 3, 4])
assert close(m, 2.5) and close(s, 1.2909944487358056), f"Nhận ({m}, {s}) — std phải dùng ddof=1"` },
        ],
        hidden: [
          { name: 'Dữ liệu thí nghiệm', code: py`m, s = mean_std(scores_new)
assert close(m, scores_new.mean()) and close(s, scores_new.std(ddof=1)), "Sai trên scores_new"` },
        ],
      },
      {
        id: 'format', title: 'Định dạng kết quả', points: 25,
        instructions: `Viết \`format_result(scores, decimals=2)\` trả về chuỗi dạng \`"85.20 ± 1.50"\` (ký tự ± có dấu cách hai bên), dùng \`mean_std\` ở trên.`,
        starter: py`# GRADED FUNCTION: format_result
def format_result(scores, decimals=2):
    ### START CODE HERE ### (≈ 2 dòng)
    text = None
    ### END CODE HERE ###
    return text

print(format_result(scores_base), "|", format_result(scores_new))`,
        solution: py`def format_result(scores, decimals=2):
    m, s = mean_std(scores)
    return f"{m:.{decimals}f} ± {s:.{decimals}f}"`,
        tests: [
          { name: 'Ví dụ', code: py`r = format_result([1, 2, 3, 4])
assert r == "2.50 ± 1.29", f"Nhận {r!r}"` },
        ],
        hidden: [
          { name: 'Số chữ số thập phân', code: py`r = format_result([10, 10, 13], decimals=1)
assert r == "11.0 ± 1.7", f"Nhận {r!r}"` },
        ],
      },
      {
        id: 'bootstrap', title: 'Khoảng tin cậy bootstrap', points: 50,
        instructions: `Ước lượng khoảng tin cậy cho chênh lệch trung bình ghép cặp \`d = b − a\` bằng bootstrap:

\`\`\`
rng   = np.random.default_rng(seed)
d     = b − a
idx   = rng.integers(0, n, size=(n_boot, n))
means = d[idx].mean(axis=1)
lo, hi = np.percentile(means, [100·alpha/2, 100·(1 − alpha/2)])
\`\`\`

Viết \`bootstrap_ci(a, b, n_boot=2000, seed=0, alpha=0.05)\` trả về \`(lo, hi)\`. Làm đúng thứ tự trên để kết quả khớp grader. Nếu cả khoảng nằm trên 0, ta có bằng chứng phương pháp mới tốt hơn.`,
        starter: py`# GRADED FUNCTION: bootstrap_ci
def bootstrap_ci(a, b, n_boot=2000, seed=0, alpha=0.05):
    a = np.asarray(a, dtype=float); b = np.asarray(b, dtype=float)
    n = len(a)
    ### START CODE HERE ### (≈ 5 dòng)
    lo = hi = None
    ### END CODE HERE ###
    return lo, hi

print(bootstrap_ci(scores_base, scores_new))`,
        solution: py`def bootstrap_ci(a, b, n_boot=2000, seed=0, alpha=0.05):
    a = np.asarray(a, dtype=float); b = np.asarray(b, dtype=float)
    n = len(a)
    rng = np.random.default_rng(seed)
    d = b - a
    idx = rng.integers(0, n, size=(n_boot, n))
    means = d[idx].mean(axis=1)
    lo, hi = np.percentile(means, [100 * alpha / 2, 100 * (1 - alpha / 2)])
    return lo, hi`,
        tests: [
          { name: 'Khoảng chứa trung bình chênh lệch', code: py`lo, hi = bootstrap_ci(scores_base, scores_new)
d = (scores_new - scores_base).mean()
assert lo < d < hi, f"Khoảng ({lo:.3f}, {hi:.3f}) phải chứa {d:.3f}"
assert lo > 0, "Với dữ liệu này, khoảng tin cậy phải nằm trên 0"` },
        ],
        hidden: [
          { name: 'Khớp theo seed', code: py`a = np.array([1.0, 2.0, 3.0, 4.0, 5.0]); b = a + np.array([0.5, -0.2, 0.1, 0.8, 0.0])
rng = np.random.default_rng(7); d = b - a
m = d[rng.integers(0, 5, size=(500, 5))].mean(axis=1)
exp = np.percentile(m, [5.0, 95.0])
assert close(bootstrap_ci(a, b, n_boot=500, seed=7, alpha=0.1), exp), "Không khớp — kiểm tra thứ tự gọi rng và alpha"` },
        ],
      },
    ],
  },
};

export const week15: Week = {
  n: 15,
  title: 'Hoàn thiện đồ án & kiểm tra cuối kỳ',
  stage: 4,
  summary: 'Ôn tập toàn khoá, nộp đồ án reproduce paper, thi viết và thuyết trình vấn đáp.',
  topics: ['Ôn tập tổng hợp', 'Đồ án reproduce paper', 'Thuyết trình vấn đáp'],
  practice: 'Bài cuối kỳ: tự cài logistic regression có L2 từ đầu đến cuối, đạt accuracy ≥ 85% trên tập test ẩn.',
  gate: 'pass',
  exam: true,
  quiz: {
    timeLimitMin: 120,
    questions: [
      {
        id: 'w15q1', kind: 'single',
        prompt: 'Trong một dự án ML thực tế, công đoạn thường tốn nhiều thời gian nhất là:',
        options: ['Thu thập, làm sạch và chuẩn bị dữ liệu', 'Chọn kiến trúc mô hình', 'Huấn luyện mô hình', 'Viết báo cáo'], answer: 0,
        explain: '"Garbage in, garbage out".',
      },
      {
        id: 'w15q2', kind: 'numeric',
        prompt: 'Ảnh vào 64×64, kernel 3×3, padding 1, stride 2. Kích thước không gian đầu ra (một chiều) là:',
        answer: 32, tolerance: 1e-6,
        explain: '⌊(64 + 2 − 3) / 2⌋ + 1 = 31 + 1 = 32.',
      },
      {
        id: 'w15q3', kind: 'single',
        prompt: 'Độ phức tạp tính toán của self-attention theo độ dài chuỗi n là:',
        options: ['O(n²)', 'O(n)', 'O(log n)', 'O(n³)'], answer: 0,
        explain: 'Ma trận điểm số có kích thước n × n.',
      },
      {
        id: 'w15q4', kind: 'single',
        prompt: 'Khi suy luận (inference), BatchNorm chuẩn hoá bằng:',
        options: ['Running mean và running variance tích luỹ trong lúc huấn luyện', 'Mean và variance của batch hiện tại', 'Mean 0 và variance 1 cố định', 'Không chuẩn hoá'], answer: 0,
        explain: 'Để dự đoán cho một mẫu đơn lẻ không phụ thuộc vào batch.',
      },
      {
        id: 'w15q5', kind: 'numeric',
        prompt: 'TP = 45, FP = 5. Precision bằng:',
        answer: 0.9, tolerance: 1e-3,
        explain: '45 / 50 = 0.9.',
      },
      {
        id: 'w15q6', kind: 'single',
        prompt: 'Regularization nào có xu hướng tạo trọng số thưa (nhiều trọng số bằng 0)?',
        options: ['L1', 'L2', 'Dropout', 'BatchNorm'], answer: 0,
        explain: 'Phạt |w| có góc nhọn tại 0.',
      },
      {
        id: 'w15q7', kind: 'single',
        prompt: 'Mạng 20 lớp dùng sigmoid ở mọi lớp ẩn, các lớp đầu gần như không học. Nguyên nhân khả dĩ nhất là:',
        options: ['Vanishing gradient', 'Exploding gradient', 'Learning rate quá lớn', 'Dữ liệu quá nhiều'], answer: 0,
        explain: "σ' ≤ 0.25, nhân qua nhiều lớp làm gradient tiến về 0.",
      },
      {
        id: 'w15q8', kind: 'multi',
        prompt: 'Một repo đồ án "reproducible" cần có gì?',
        options: ['File môi trường (requirements.txt / environment.yml)', 'Seed cố định và cấu hình thí nghiệm', 'Chỉ file trọng số cuối cùng, không cần code', 'README với lệnh chạy lại kết quả'], answer: [0, 1, 3],
        explain: 'Không có code thì không ai tái lập được.',
      },
      {
        id: 'w15q9', kind: 'single',
        prompt: 'Bạn cần fine-tune một LLM 7B trên một GPU 24GB. Lựa chọn phù hợp nhất là:',
        options: ['Phương pháp PEFT như LoRA/QLoRA', 'Full fine-tuning với batch size lớn', 'Huấn luyện từ đầu', 'Tăng số lớp của mô hình'], answer: 0,
        explain: 'Full fine-tuning 7B cần bộ nhớ gấp nhiều lần cho optimizer state.',
      },
      {
        id: 'w15q10', kind: 'numeric',
        prompt: 'softmax([0, ln 3]) có thành phần thứ hai bằng:',
        answer: 0.75, tolerance: 1e-3,
        explain: 'e^{ln 3} / (1 + 3) = 3/4.',
      },
      {
        id: 'w15q11', kind: 'single',
        prompt: 'K-means tối thiểu hoá:',
        options: ['Tổng bình phương khoảng cách từ mỗi điểm tới tâm cụm của nó', 'Số lượng cụm', 'Khoảng cách giữa các tâm cụm', 'Log-likelihood của dữ liệu'], answer: 0,
        explain: 'Within-cluster sum of squares (inertia).',
      },
      {
        id: 'w15q12', kind: 'single',
        prompt: 'Khi reproduce một paper và kết quả của bạn thấp hơn công bố 3 điểm, việc đúng đắn là:',
        options: ['Kiểm tra lại chi tiết cài đặt, liên hệ tác giả nếu cần, và báo cáo trung thực chênh lệch', 'Chỉnh hyperparameter trên tập test cho bằng', 'Chỉ báo cáo số của paper gốc', 'Bỏ qua và không nhắc tới'], answer: 0,
        explain: 'Chênh lệch được ghi nhận minh bạch cũng là một đóng góp.',
      },
    ],
  },
  lab: {
    title: 'Cuối kỳ: logistic regression từ đầu',
    intro: 'Bài tổng hợp: chuẩn hoá, huấn luyện bằng Gradient Descent có L2, dự đoán. Không được dùng mô hình của scikit-learn. Grader sẽ huấn luyện mô hình của bạn và đánh giá trên một tập test **ẩn**.',
    setup: py`import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split

X_all, y_all = make_classification(n_samples=800, n_features=6, n_informative=4, n_redundant=1, class_sep=1.2, random_state=7)
X_train, X_val, y_train, y_val = train_test_split(X_all, y_all, test_size=0.25, random_state=0)

def sigmoid(z):
    return 1 / (1 + np.exp(-z))`,
    packages: ['numpy', 'scikit-learn'],
    exercises: [
      {
        id: 'standardize', title: 'Chuẩn hoá', points: 20,
        instructions: `Viết hai hàm:
- \`standardize_fit(X)\` trả về \`(mu, sigma)\` theo cột (\`ddof=0\`).
- \`standardize_apply(X, mu, sigma)\` trả về \`(X − mu) / sigma\`.`,
        starter: py`# GRADED FUNCTION: standardize_fit, standardize_apply
def standardize_fit(X):
    ### START CODE HERE ### (≈ 1 dòng)
    mu = sigma = None
    ### END CODE HERE ###
    return mu, sigma

def standardize_apply(X, mu, sigma):
    ### START CODE HERE ### (≈ 1 dòng)
    Xs = None
    ### END CODE HERE ###
    return Xs`,
        solution: py`def standardize_fit(X):
    return X.mean(axis=0), X.std(axis=0)

def standardize_apply(X, mu, sigma):
    return (X - mu) / sigma`,
        tests: [
          { name: 'Train sau chuẩn hoá', code: py`mu, sd = standardize_fit(X_train)
Z = standardize_apply(X_train, mu, sd)
assert close(Z.mean(0), np.zeros(6), 1e-6) and close(Z.std(0), np.ones(6), 1e-6), "Train phải có mean 0, std 1"` },
        ],
        hidden: [
          { name: 'Dùng thống kê train cho val', code: py`mu, sd = standardize_fit(X_train)
assert close(standardize_apply(X_val, mu, sd), (X_val - X_train.mean(0)) / X_train.std(0)), "Sai khi áp dụng cho tập val"` },
        ],
      },
      {
        id: 'train', title: 'Huấn luyện có L2', points: 50,
        instructions: `Viết \`train_logreg(X, y, lr=0.1, n_iters=1000, lam=0.0)\` khởi tạo \`w = 0\`, \`b = 0\`, rồi lặp:

\`\`\`
a  = sigmoid(X @ w + b)
dw = Xᵀ(a − y) / m + (lam / m) · w
db = mean(a − y)
w ← w − lr·dw ;  b ← b − lr·db
\`\`\`

Trả về \`(w, b)\`.`,
        starter: py`# GRADED FUNCTION: train_logreg
def train_logreg(X, y, lr=0.1, n_iters=1000, lam=0.0):
    m, n = X.shape
    w = np.zeros(n); b = 0.0
    ### START CODE HERE ###

    ### END CODE HERE ###
    return w, b`,
        solution: py`def train_logreg(X, y, lr=0.1, n_iters=1000, lam=0.0):
    m, n = X.shape
    w = np.zeros(n); b = 0.0
    for _ in range(n_iters):
        a = sigmoid(X @ w + b)
        dw = X.T @ (a - y) / m + (lam / m) * w
        db = np.mean(a - y)
        w = w - lr * dw
        b = b - lr * db
    return w, b`,
        tests: [
          { name: 'Một bước từ 0', code: py`X = np.array([[1.0, 2.0], [-1.0, 0.5], [0.0, -1.0]]); y = np.array([1.0, 0.0, 1.0])
w, b = train_logreg(X, y, lr=0.5, n_iters=1)
assert close(w, -0.5 * X.T @ (0.5 - y) / 3) and close(b, -0.5 * np.mean(0.5 - y)), f"Nhận w={w}, b={b}"` },
        ],
        hidden: [
          { name: 'Có L2', code: py`rng = np.random.default_rng(3)
X = rng.normal(size=(30, 3)); y = (rng.random(30) > 0.4).astype(float)
w = np.zeros(3); b = 0.0
for _ in range(25):
    a = 1 / (1 + np.exp(-(X @ w + b)))
    w, b = w - 0.2 * (X.T @ (a - y) / 30 + (2.0 / 30) * w), b - 0.2 * np.mean(a - y)
ww, bb = train_logreg(X, y, lr=0.2, n_iters=25, lam=2.0)
assert close(ww, w) and close(bb, b), "Sai khi lam > 0"` },
        ],
      },
      {
        id: 'predict', title: 'Dự đoán', points: 30,
        instructions: `Viết \`predict(X, w, b, threshold=0.5)\` trả về mảng số nguyên 0/1: 1 khi \`sigmoid(X @ w + b) ≥ threshold\`.

Sau đó thử toàn bộ quy trình ở ô nháp: chuẩn hoá → huấn luyện → đo accuracy trên \`X_val\`. Grader yêu cầu accuracy ≥ 0.85 trên tập test ẩn với cấu hình mặc định.`,
        starter: py`# GRADED FUNCTION: predict
def predict(X, w, b, threshold=0.5):
    ### START CODE HERE ### (≈ 1 dòng)
    y_hat = None
    ### END CODE HERE ###
    return y_hat

mu, sd = standardize_fit(X_train)
w, b = train_logreg(standardize_apply(X_train, mu, sd), y_train)
print("val acc:", (predict(standardize_apply(X_val, mu, sd), w, b) == y_val).mean())`,
        solution: py`def predict(X, w, b, threshold=0.5):
    return (sigmoid(X @ w + b) >= threshold).astype(int)`,
        tests: [
          { name: 'Ngưỡng', code: py`r = predict(np.array([[1.0], [-1.0], [0.0]]), np.array([2.0]), 0.0)
assert list(np.asarray(r).astype(int)) == [1, 0, 1], f"Nhận {r} — tại xác suất đúng 0.5 phải trả về 1"` },
        ],
        hidden: [
          { name: 'Accuracy trên test ẩn ≥ 0.85', code: py`Xa, Xb, ya, yb = train_test_split(X_all, y_all, test_size=0.3, random_state=99)
mu, sd = standardize_fit(Xa)
w, b = train_logreg(standardize_apply(Xa, mu, sd), ya)
acc = (predict(standardize_apply(Xb, mu, sd), w, b) == yb).mean()
assert acc >= 0.85, f"Accuracy trên test ẩn = {acc:.4f} < 0.85"` },
        ],
      },
    ],
  },
};
