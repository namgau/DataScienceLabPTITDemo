import { py, type Week } from './types';

export const week0: Week = {
  n: 0,
  title: 'Test đầu vào',
  stage: 0,
  summary: 'Đánh giá nền tảng toán THPT, toán đại học, đọc hiểu code và hiểu biết chung về AI/ML để giảng viên xếp lộ trình phù hợp.',
  topics: ['Toán THPT', 'Toán đại học', 'Đọc hiểu code Python', 'Hiểu biết AI/ML'],
  practice: 'Làm một lần duy nhất trong 120 phút. Điểm không chặn lộ trình, nhưng phải nộp cả trắc nghiệm và bài code để mở Tuần 1.',
  gate: 'complete',
  exam: true,
  quiz: {
    timeLimitMin: 120,
    questions: [
      {
        id: 'w0q1', kind: 'numeric',
        prompt: 'Cho hàm số f(x) = x³ − 3x + 2. Giá trị cực tiểu của hàm số bằng bao nhiêu?',
        answer: 0, tolerance: 1e-6,
        explain: "f'(x) = 3x² − 3 = 0 ⇒ x = ±1. f''(1) = 6 > 0 nên x = 1 là điểm cực tiểu, f(1) = 0.",
      },
      {
        id: 'w0q2', kind: 'single',
        prompt: 'log₂8 + log₂(1/4) bằng:',
        options: ['1', '2', '−1', '5'], answer: 0,
        explain: 'log₂8 = 3, log₂(1/4) = −2, tổng bằng 1.',
      },
      {
        id: 'w0q3', kind: 'numeric',
        prompt: 'Tung hai đồng xu cân đối. Xác suất có ít nhất một mặt ngửa là bao nhiêu? (nhập số thập phân)',
        answer: 0.75, tolerance: 1e-3,
        explain: 'P = 1 − P(cả hai sấp) = 1 − 1/4 = 0.75.',
      },
      {
        id: 'w0q4', kind: 'numeric',
        prompt: 'Tích vô hướng của a = (1, 2, 3) và b = (4, −1, 2) bằng:',
        answer: 8, tolerance: 1e-6,
        explain: '1·4 + 2·(−1) + 3·2 = 4 − 2 + 6 = 8.',
      },
      {
        id: 'w0q5', kind: 'single',
        prompt: 'Ma trận A có kích thước 3×4, B có kích thước 4×2. Tích AB có kích thước:',
        options: ['3×2', '4×4', '2×3', 'Không nhân được'], answer: 0,
        explain: 'Số cột của A bằng số hàng của B (4), kết quả lấy số hàng của A và số cột của B.',
      },
      {
        id: 'w0q6', kind: 'numeric',
        prompt: 'Cho f(x, y) = x²y + 3y. Tính ∂f/∂x tại điểm (2, 1).',
        answer: 4, tolerance: 1e-6,
        explain: '∂f/∂x = 2xy, tại (2, 1) bằng 4.',
      },
      {
        id: 'w0q7', kind: 'numeric',
        prompt: 'Định thức của ma trận [[2, 1], [4, 3]] bằng:',
        answer: 2, tolerance: 1e-6,
        explain: 'det = 2·3 − 1·4 = 2.',
      },
      {
        id: 'w0q8', kind: 'single',
        prompt: 'Đoạn code sau in ra gì?',
        code: 'import numpy as np\na = np.array([1, 2, 3, 4, 5])\nprint(a[a > 3].sum())',
        options: ['9', '12', '2', '[4 5]'], answer: 0,
        explain: 'a > 3 chọn ra [4, 5], tổng bằng 9.',
      },
      {
        id: 'w0q9', kind: 'single',
        prompt: 'Đoạn code sau in ra gì?',
        code: 'def f(xs):\n    out = []\n    for x in xs:\n        if x % 2 == 0:\n            out.append(x * x)\n    return out\n\nprint(f([1, 2, 3, 4]))',
        options: ['[4, 16]', '[1, 9]', '[1, 4, 9, 16]', '[2, 4]'], answer: 0,
        explain: 'Chỉ giữ số chẵn (2, 4) rồi bình phương.',
      },
      {
        id: 'w0q10', kind: 'single',
        prompt: 'Đoạn code sau in ra gì?',
        code: 'd = {"a": 1}\nd["b"] = d.get("b", 0) + 2\nd["a"] += 1\nprint(sorted(d.items()))',
        options: ["[('a', 2), ('b', 2)]", "[('a', 1), ('b', 2)]", "[('a', 2), ('b', 0)]", 'KeyError'], answer: 0,
        explain: 'd.get("b", 0) trả về 0 vì chưa có khoá "b", nên d["b"] = 2; d["a"] tăng lên 2.',
      },
      {
        id: 'w0q11', kind: 'single',
        prompt: 'Vì sao không nên đánh giá mô hình trên chính dữ liệu đã dùng để huấn luyện?',
        options: [
          'Điểm số sẽ lạc quan quá mức, không phản ánh khả năng dự đoán trên dữ liệu mới',
          'Việc tính metric sẽ làm thay đổi trọng số của mô hình',
          'Dữ liệu huấn luyện thường quá nhỏ để tính được metric',
          'Metric trên tập huấn luyện luôn bằng 100%',
        ], answer: 0,
        explain: 'Mô hình đã "thấy" dữ liệu huấn luyện, nên cần một tập riêng để đo khả năng tổng quát hoá.',
      },
      {
        id: 'w0q12', kind: 'multi',
        prompt: 'Những bài toán nào thuộc học có giám sát (supervised learning)?',
        options: [
          'Dự đoán giá nhà từ diện tích, khi có dữ liệu giá các căn đã bán',
          'Chia khách hàng thành các nhóm khi chưa có nhãn nhóm',
          'Phân loại email spam từ tập email đã được gắn nhãn',
          'Robot học đi bằng thử–sai và nhận phần thưởng',
        ], answer: [0, 2],
        explain: 'Học có giám sát cần cặp (đầu vào, nhãn đúng). Phân nhóm là học không giám sát; robot thử–sai là học tăng cường.',
      },
    ],
  },
  lab: {
    title: 'Python cơ bản',
    intro: 'Hai bài nhỏ kiểm tra khả năng viết hàm Python thuần, chưa dùng thư viện. Viết code trong vùng `### START CODE HERE ###`, bấm **Chạy** để thử và **Kiểm tra** để chạy test mẫu.',
    setup: py`# Ô thiết lập — không cần sửa
import math`,
    packages: [],
    exercises: [
      {
        id: 'mean_std', title: 'Trung bình và độ lệch chuẩn', points: 50,
        instructions: `Viết hàm \`mean_and_std(xs)\` nhận một list số và trả về tuple \`(mean, std)\`, trong đó std là **độ lệch chuẩn tổng thể**:

\`\`\`
std = sqrt( Σ (x − mean)² / n )
\`\`\`

Không dùng numpy hay statistics.`,
        starter: py`# GRADED FUNCTION: mean_and_std
def mean_and_std(xs):
    ### START CODE HERE ###
    mean = None
    std = None
    ### END CODE HERE ###
    return mean, std

print(mean_and_std([2, 4, 4, 4, 5, 5, 7, 9]))  # kỳ vọng (5.0, 2.0)`,
        solution: py`def mean_and_std(xs):
    n = len(xs)
    mean = sum(xs) / n
    std = math.sqrt(sum((x - mean) ** 2 for x in xs) / n)
    return mean, std`,
        tests: [
          { name: 'Ví dụ trong đề', code: py`m, s = mean_and_std([2, 4, 4, 4, 5, 5, 7, 9])
assert close(m, 5.0) and close(s, 2.0), f"Kỳ vọng (5.0, 2.0), nhận ({m}, {s})"` },
        ],
        hidden: [
          { name: 'Một phần tử', code: py`m, s = mean_and_std([3.5])
assert close(m, 3.5) and close(s, 0.0), "Một phần tử thì std = 0"` },
          { name: 'Số thực', code: py`m, s = mean_and_std([1, 2, 3, 4])
assert close(m, 2.5) and close(s, 1.118033988749895), f"Nhận ({m}, {s})"` },
          { name: 'Số âm', code: py`m, s = mean_and_std([-1, -3, 4])
assert close(m, 0.0) and close(s, math.sqrt(26/3)), f"Nhận ({m}, {s})"` },
        ],
      },
      {
        id: 'word_count', title: 'Đếm từ', points: 50,
        instructions: `Viết hàm \`word_count(text)\` trả về dict ánh xạ mỗi từ (viết thường) tới số lần xuất hiện.

- Tách từ theo khoảng trắng.
- Bỏ các dấu \`. , ! ?\` ở đầu và cuối mỗi từ.
- Bỏ qua chuỗi rỗng sau khi làm sạch.`,
        starter: py`# GRADED FUNCTION: word_count
def word_count(text):
    counts = {}
    ### START CODE HERE ###

    ### END CODE HERE ###
    return counts

print(word_count("Data science, data lab!"))`,
        solution: py`def word_count(text):
    counts = {}
    for w in text.split():
        w = w.strip('.,!?').lower()
        if w:
            counts[w] = counts.get(w, 0) + 1
    return counts`,
        tests: [
          { name: 'Ví dụ trong đề', code: py`r = word_count("Data science, data lab!")
assert r == {'data': 2, 'science': 1, 'lab': 1}, f"Nhận {r}"` },
        ],
        hidden: [
          { name: 'Chuỗi rỗng', code: py`assert word_count("") == {}, "Chuỗi rỗng phải trả về {}"` },
          { name: 'Hoa thường và dấu câu', code: py`r = word_count("A a A. ?! a,")
assert r == {'a': 4}, f"Nhận {r}"` },
          { name: 'Nhiều khoảng trắng', code: py`r = word_count("  ml   dl\tml\n")
assert r == {'ml': 2, 'dl': 1}, f"Nhận {r}"` },
        ],
      },
    ],
  },
};

export const week1: Week = {
  n: 1,
  title: 'AI là gì? Python cho ML',
  stage: 1,
  summary: 'Phân biệt AI, ML, DL; các kiểu học; khái niệm feature, label, model. Làm quen NumPy, Pandas trên tập Iris.',
  topics: ['AI vs ML vs DL', 'Supervised / Unsupervised / Reinforcement', 'Feature, label, model', 'NumPy, Pandas', 'Google Colab'],
  practice: 'Khám phá tập dữ liệu Iris: chuẩn hoá đặc trưng, thống kê theo loài, lọc dữ liệu.',
  gate: 'pass',
  quiz: {
    questions: [
      {
        id: 'w1q1', kind: 'single',
        prompt: 'Quan hệ đúng giữa AI, Machine Learning (ML) và Deep Learning (DL) là:',
        options: ['DL ⊂ ML ⊂ AI', 'ML ⊂ DL ⊂ AI', 'AI ⊂ ML ⊂ DL', 'Ba lĩnh vực độc lập, không giao nhau'], answer: 0,
        explain: 'DL là một nhánh của ML (dùng mạng nơ-ron nhiều lớp); ML là một nhánh của AI.',
      },
      {
        id: 'w1q2', kind: 'single',
        prompt: 'Trong bài toán phân loại email spam, đâu là label (nhãn)?',
        options: ['Email đó có phải spam hay không', 'Số từ trong email', 'Địa chỉ người gửi', 'Thuật toán dùng để phân loại'], answer: 0,
        explain: 'Label là đại lượng cần dự đoán. Số từ, người gửi là feature.',
      },
      {
        id: 'w1q3', kind: 'multi',
        prompt: 'Để dự đoán giá nhà, những cột nào có thể dùng làm feature?',
        options: ['Diện tích', 'Số phòng ngủ', 'Giá bán', 'Khoảng cách tới trung tâm'], answer: [0, 1, 3],
        explain: 'Giá bán chính là label, đưa nó vào feature là rò rỉ đáp án.',
      },
      {
        id: 'w1q4', kind: 'single',
        prompt: 'Reinforcement Learning khác Supervised Learning ở điểm nào?',
        options: [
          'Tác tử học từ phần thưởng/phạt khi tương tác với môi trường, không có nhãn đúng cho từng bước',
          'Không cần dữ liệu đầu vào',
          'Chỉ dùng được với mạng nơ-ron',
          'Luôn cho kết quả chính xác hơn',
        ], answer: 0,
        explain: 'RL tối ưu tổng phần thưởng qua thử–sai thay vì học từ cặp (x, y) có sẵn.',
      },
      {
        id: 'w1q5', kind: 'single',
        prompt: 'Đoạn code sau in ra gì?',
        code: 'import numpy as np\nA = np.arange(6).reshape(2, 3)\nprint(A[:, 1])',
        options: ['[1 4]', '[3 4 5]', '[0 1 2]', '[2 5]'], answer: 0,
        explain: 'A = [[0,1,2],[3,4,5]]; A[:, 1] lấy cột thứ 2: [1, 4].',
      },
      {
        id: 'w1q6', kind: 'numeric',
        prompt: 'Đoạn code sau in ra số nào?',
        code: 'import pandas as pd\ndf = pd.DataFrame({"A": [1, 2, 3], "B": [4, 5, 6]})\nprint(df[df.B > 4].A.sum())',
        answer: 5, tolerance: 1e-6,
        explain: 'Các hàng có B > 4 là hàng 2 và 3, tổng cột A = 2 + 3 = 5.',
      },
      {
        id: 'w1q7', kind: 'numeric',
        prompt: 'Đoạn code sau in ra số nào?',
        code: 'import numpy as np\nM = np.array([[1, 2], [3, 4]])\nprint(M.mean(axis=0)[1])',
        answer: 3, tolerance: 1e-6,
        explain: 'axis=0 lấy trung bình theo cột: [2, 3]; phần tử thứ 2 là 3.',
      },
    ],
  },
  lab: {
    title: 'Khám phá tập dữ liệu Iris',
    intro: 'Tập Iris gồm 150 bông hoa thuộc 3 loài, mỗi bông có 4 đặc trưng đo bằng cm. DataFrame `df` đã được nạp sẵn với cột `species`. Bạn có thể dùng ô nháp ở cuối để vẽ biểu đồ bằng matplotlib.',
    setup: py`import numpy as np
import pandas as pd
from sklearn.datasets import load_iris

iris = load_iris(as_frame=True)
df = iris.frame.copy()
df["species"] = df["target"].map(dict(enumerate(iris.target_names)))
df = df.drop(columns="target")
FEATURES = list(iris.feature_names)
print(df.head())`,
    packages: ['numpy', 'pandas', 'scikit-learn'],
    exercises: [
      {
        id: 'minmax', title: 'Chuẩn hoá Min–Max', points: 30,
        instructions: `Viết hàm \`min_max_normalize(X)\` nhận mảng 2 chiều \`X\` (n mẫu × d đặc trưng) và đưa **từng cột** về đoạn [0, 1]:

\`\`\`
X_norm = (X − min_cột) / (max_cột − min_cột)
\`\`\`

Dùng phép toán vector hoá của NumPy (\`axis=0\`), không dùng vòng lặp.`,
        starter: py`# GRADED FUNCTION: min_max_normalize
def min_max_normalize(X):
    X = np.asarray(X, dtype=float)
    ### START CODE HERE ### (≈ 3 dòng)
    X_norm = None
    ### END CODE HERE ###
    return X_norm

print(min_max_normalize([[1, 10], [2, 20], [3, 30]]))`,
        solution: py`def min_max_normalize(X):
    X = np.asarray(X, dtype=float)
    mn = X.min(axis=0)
    mx = X.max(axis=0)
    return (X - mn) / (mx - mn)`,
        tests: [
          { name: 'Ma trận nhỏ', code: py`r = min_max_normalize([[1, 10], [2, 20], [3, 30]])
assert close(r, [[0, 0], [0.5, 0.5], [1, 1]]), f"Nhận {r}"` },
        ],
        hidden: [
          { name: 'Dữ liệu Iris', code: py`r = min_max_normalize(df[FEATURES].values)
assert r.shape == (150, 4), "Sai kích thước"
assert close(r.min(axis=0), np.zeros(4)) and close(r.max(axis=0), np.ones(4)), "Mỗi cột phải có min 0, max 1"` },
          { name: 'Ma trận ngẫu nhiên', code: py`rng = np.random.default_rng(3)
X = rng.normal(5, 2, size=(20, 3))
exp = (X - X.min(0)) / (X.max(0) - X.min(0))
assert close(min_max_normalize(X), exp), "Sai trên ma trận ngẫu nhiên"` },
        ],
      },
      {
        id: 'class_means', title: 'Trung bình theo loài', points: 35,
        instructions: `Viết hàm \`class_means(df)\` trả về DataFrame có **index là tên loài** và **4 cột đặc trưng**, mỗi ô là giá trị trung bình của đặc trưng đó trong loài.

Gợi ý: \`groupby\`.`,
        starter: py`# GRADED FUNCTION: class_means
def class_means(df):
    ### START CODE HERE ### (≈ 1 dòng)
    means = None
    ### END CODE HERE ###
    return means

class_means(df)`,
        solution: py`def class_means(df):
    return df.groupby("species")[FEATURES].mean()`,
        tests: [
          { name: 'Setosa — chiều dài cánh hoa', code: py`r = class_means(df)
assert close(r.loc["setosa", "petal length (cm)"], 1.462), f"Nhận {r.loc['setosa', 'petal length (cm)']}"` },
        ],
        hidden: [
          { name: 'Kích thước kết quả', code: py`r = class_means(df)
assert r.shape == (3, 4), f"Kỳ vọng (3, 4), nhận {r.shape}"
assert sorted(r.index) == ["setosa", "versicolor", "virginica"], "Index phải là tên loài"` },
          { name: 'Toàn bộ giá trị', code: py`r = class_means(df)
for sp in iris.target_names:
    exp = df[df.species == sp][FEATURES].values.mean(axis=0)
    assert close(r.loc[sp, FEATURES].values, exp), f"Sai ở loài {sp}"` },
        ],
      },
      {
        id: 'count_above', title: 'Đếm theo ngưỡng', points: 35,
        instructions: `Viết hàm \`count_above(df, feature, threshold)\` trả về **dict** \`{tên loài: số bông có feature > threshold}\`. Loài nào không có bông nào vượt ngưỡng vẫn phải có mặt với giá trị 0.`,
        starter: py`# GRADED FUNCTION: count_above
def count_above(df, feature, threshold):
    ### START CODE HERE ###
    result = None
    ### END CODE HERE ###
    return result

print(count_above(df, "petal length (cm)", 5.0))`,
        solution: py`def count_above(df, feature, threshold):
    result = {}
    for sp in sorted(df["species"].unique()):
        result[sp] = int((df.loc[df["species"] == sp, feature] > threshold).sum())
    return result`,
        tests: [
          { name: 'Chiều dài cánh hoa > 5', code: py`r = count_above(df, "petal length (cm)", 5.0)
exp = {sp: int(sum(1 for v, s in zip(df["petal length (cm)"], df.species) if s == sp and v > 5.0)) for sp in iris.target_names}
assert {k: int(v) for k, v in dict(r).items()} == exp, f"Kỳ vọng {exp}, nhận {r}"` },
        ],
        hidden: [
          { name: 'Có loài bằng 0', code: py`r = count_above(df, "sepal width (cm)", 4.0)
r = {k: int(v) for k, v in dict(r).items()}
assert set(r) == set(iris.target_names), "Phải có đủ 3 loài kể cả khi bằng 0"
assert r["versicolor"] == 0 and r["virginica"] == 0 and r["setosa"] == 3, f"Nhận {r}"` },
          { name: 'Ngưỡng rất nhỏ', code: py`r = {k: int(v) for k, v in dict(count_above(df, "sepal length (cm)", 0)).items()}
assert r == {"setosa": 50, "versicolor": 50, "virginica": 50}, f"Nhận {r}"` },
        ],
      },
    ],
  },
};

export const week2: Week = {
  n: 2,
  title: 'Đại số tuyến tính cho ML',
  stage: 1,
  summary: 'Vector, ma trận, tích vô hướng, chuẩn, chuyển vị, nghịch đảo, hệ phương trình tuyến tính; dữ liệu nhìn dưới dạng ma trận.',
  topics: ['Vector và ma trận', 'Tích vô hướng, chuẩn', 'Chuyển vị, nghịch đảo', 'Hệ phương trình tuyến tính', 'Dữ liệu dạng ma trận'],
  practice: 'Cài đặt cosine similarity, ma trận khoảng cách và nghiệm phương trình chuẩn bằng NumPy.',
  gate: 'pass',
  quiz: {
    questions: [
      {
        id: 'w2q1', kind: 'single',
        prompt: 'Cho A có kích thước 2×3 và B có kích thước 2×3. Phép nào hợp lệ?',
        options: ['A @ B.T, cho kết quả 2×2', 'A @ B, cho kết quả 2×3', 'B @ A, cho kết quả 3×3', 'A.T @ B.T, cho kết quả 3×3'], answer: 0,
        explain: 'A (2×3) nhân B.T (3×2) được 2×2. Các phép còn lại sai kích thước.',
      },
      {
        id: 'w2q2', kind: 'numeric',
        prompt: 'Chuẩn L2 của vector v = [3, 4] bằng:',
        answer: 5, tolerance: 1e-6,
        explain: '‖v‖₂ = √(9 + 16) = 5.',
      },
      {
        id: 'w2q3', kind: 'numeric',
        prompt: 'Cosine similarity giữa a = [1, 0] và b = [1, 1] bằng bao nhiêu? (làm tròn 3 chữ số)',
        answer: 0.7071, tolerance: 2e-3,
        explain: 'cos = a·b / (‖a‖‖b‖) = 1 / √2 ≈ 0.707.',
      },
      {
        id: 'w2q4', kind: 'single',
        prompt: '(AB)ᵀ bằng:',
        options: ['BᵀAᵀ', 'AᵀBᵀ', 'BA', '(BA)ᵀ'], answer: 0,
        explain: 'Chuyển vị của tích đảo thứ tự: (AB)ᵀ = BᵀAᵀ.',
      },
      {
        id: 'w2q5', kind: 'single',
        prompt: 'Với ma trận dữ liệu X có kích thước (n, d) theo quy ước thông dụng trong ML, mỗi hàng biểu diễn:',
        options: ['Một mẫu dữ liệu', 'Một đặc trưng', 'Một nhãn', 'Một tham số mô hình'], answer: 0,
        explain: 'n hàng là n mẫu, d cột là d đặc trưng.',
      },
      {
        id: 'w2q6', kind: 'multi',
        prompt: 'Ma trận vuông A khả nghịch khi nào?',
        options: ['det(A) ≠ 0', 'Các cột của A độc lập tuyến tính', 'A có một hàng toàn số 0', 'Ax = 0 chỉ có nghiệm x = 0'], answer: [0, 1, 3],
        explain: 'Một hàng toàn 0 làm det(A) = 0 nên A suy biến.',
      },
      {
        id: 'w2q7', kind: 'single',
        prompt: 'Đoạn code sau in ra gì?',
        code: 'import numpy as np\nX = np.ones((5, 3))\nw = np.array([1, 2, 3])\nprint((X @ w).shape)',
        options: ['(5,)', '(3,)', '(5, 3)', '(1, 5)'], answer: 0,
        explain: '(5×3) nhân vector độ dài 3 được vector độ dài 5.',
      },
    ],
  },
  lab: {
    title: 'Vector hoá với NumPy',
    intro: 'Các phép toán trên ma trận là ngôn ngữ chung của ML. Hãy viết code vector hoá, tránh vòng lặp Python khi có thể.',
    setup: py`import numpy as np
np.set_printoptions(precision=4, suppress=True)`,
    packages: ['numpy'],
    exercises: [
      {
        id: 'cosine', title: 'Cosine similarity', points: 30,
        instructions: `Viết hàm \`cosine_similarity(a, b)\` trả về cos góc giữa hai vector:

\`\`\`
cos(a, b) = a·b / (‖a‖ · ‖b‖)
\`\`\``,
        starter: py`# GRADED FUNCTION: cosine_similarity
def cosine_similarity(a, b):
    a = np.asarray(a, dtype=float)
    b = np.asarray(b, dtype=float)
    ### START CODE HERE ### (≈ 1 dòng)
    cos = None
    ### END CODE HERE ###
    return cos

print(cosine_similarity([1, 0], [1, 1]))  # ≈ 0.7071`,
        solution: py`def cosine_similarity(a, b):
    a = np.asarray(a, dtype=float)
    b = np.asarray(b, dtype=float)
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))`,
        tests: [
          { name: 'Góc 45°', code: py`r = cosine_similarity([1, 0], [1, 1])
assert close(r, 1 / np.sqrt(2)), f"Nhận {r}"` },
        ],
        hidden: [
          { name: 'Ngược chiều', code: py`assert close(cosine_similarity([1, 2, 3], [-2, -4, -6]), -1.0), "Hai vector ngược chiều phải cho −1"` },
          { name: 'Vuông góc', code: py`assert close(cosine_similarity([1, 1, 0], [-1, 1, 5]), 0.0), "Hai vector vuông góc phải cho 0"` },
          { name: 'Không phụ thuộc độ dài', code: py`a = np.array([0.3, -1.2, 2.0]); b = np.array([1.5, 0.4, 0.9])
assert close(cosine_similarity(a, b), cosine_similarity(10 * a, 0.1 * b)), "Cosine không được thay đổi khi nhân vector với hằng số dương"` },
        ],
      },
      {
        id: 'pairwise', title: 'Ma trận khoảng cách', points: 35,
        instructions: `Viết hàm \`pairwise_distances(X)\` nhận X kích thước (n, d), trả về ma trận D kích thước (n, n) với \`D[i, j] = ‖X[i] − X[j]‖₂\`.

Gợi ý vector hoá: ‖a − b‖² = ‖a‖² + ‖b‖² − 2a·b, hoặc dùng broadcasting \`X[:, None, :] − X[None, :, :]\`. Chú ý sai số làm tròn có thể làm giá trị dưới căn hơi âm.`,
        starter: py`# GRADED FUNCTION: pairwise_distances
def pairwise_distances(X):
    X = np.asarray(X, dtype=float)
    ### START CODE HERE ### (≈ 2–3 dòng)
    D = None
    ### END CODE HERE ###
    return D

print(pairwise_distances([[0, 0], [3, 4], [6, 8]]))`,
        solution: py`def pairwise_distances(X):
    X = np.asarray(X, dtype=float)
    diff = X[:, None, :] - X[None, :, :]
    return np.sqrt((diff ** 2).sum(axis=-1))`,
        tests: [
          { name: 'Ba điểm thẳng hàng', code: py`r = pairwise_distances([[0, 0], [3, 4], [6, 8]])
assert close(r, [[0, 5, 10], [5, 0, 5], [10, 5, 0]]), f"Nhận\n{r}"` },
        ],
        hidden: [
          { name: 'So với vòng lặp', code: py`rng = np.random.default_rng(0)
X = rng.normal(size=(15, 4))
exp = np.array([[np.sqrt(((X[i] - X[j]) ** 2).sum()) for j in range(15)] for i in range(15)])
assert close(pairwise_distances(X), exp, 1e-6), "Sai so với cách tính bằng vòng lặp"` },
          { name: 'Đối xứng, đường chéo 0', code: py`rng = np.random.default_rng(1)
D = pairwise_distances(rng.normal(size=(8, 3)) * 100)
assert close(D, D.T), "D phải đối xứng"
assert close(np.diag(D), np.zeros(8), 1e-5), "Đường chéo phải bằng 0"
assert not np.isnan(D).any(), "Có NaN — kiểm tra giá trị âm dưới căn"` },
        ],
      },
      {
        id: 'normal_eq', title: 'Phương trình chuẩn', points: 35,
        instructions: `Hồi quy tuyến tính không hệ số chặn có nghiệm đóng (normal equation):

\`\`\`
w = (XᵀX)⁻¹ Xᵀ y
\`\`\`

Viết \`solve_normal_equation(X, y)\`. Nên dùng \`np.linalg.solve(XᵀX, Xᵀy)\` thay vì tính nghịch đảo trực tiếp — ổn định số học hơn.`,
        starter: py`# GRADED FUNCTION: solve_normal_equation
def solve_normal_equation(X, y):
    X = np.asarray(X, dtype=float)
    y = np.asarray(y, dtype=float)
    ### START CODE HERE ### (≈ 1–2 dòng)
    w = None
    ### END CODE HERE ###
    return w

X = np.array([[1, 1], [1, 2], [1, 3]])
y = np.array([3, 5, 7])
print(solve_normal_equation(X, y))  # ≈ [1, 2]`,
        solution: py`def solve_normal_equation(X, y):
    X = np.asarray(X, dtype=float)
    y = np.asarray(y, dtype=float)
    return np.linalg.solve(X.T @ X, X.T @ y)`,
        tests: [
          { name: 'Đường thẳng y = 1 + 2x', code: py`r = solve_normal_equation([[1, 1], [1, 2], [1, 3]], [3, 5, 7])
assert close(r, [1, 2]), f"Nhận {r}"` },
        ],
        hidden: [
          { name: 'Có nhiễu', code: py`rng = np.random.default_rng(5)
X = np.c_[np.ones(50), rng.normal(size=(50, 3))]
y = X @ np.array([0.5, -1.0, 2.0, 3.0]) + rng.normal(scale=0.1, size=50)
exp = np.linalg.lstsq(X, y, rcond=None)[0]
assert close(solve_normal_equation(X, y), exp, 1e-6), "Sai so với nghiệm bình phương tối thiểu"` },
          { name: 'Kích thước', code: py`r = solve_normal_equation(np.eye(4), np.arange(4.0))
assert np.shape(r) == (4,), f"w phải có kích thước (4,), nhận {np.shape(r)}"` },
        ],
      },
    ],
  },
};

export const week3: Week = {
  n: 3,
  title: 'Giải tích, xác suất & Gradient Descent',
  stage: 1,
  summary: 'Đạo hàm riêng, gradient, chain rule; xác suất có điều kiện và định lý Bayes; hàm mất mát và thuật toán Gradient Descent.',
  topics: ['Đạo hàm riêng, gradient', 'Chain rule', 'Xác suất có điều kiện, Bayes', 'Hàm mất mát', 'Gradient Descent, learning rate'],
  practice: 'Tự viết gradient số và Gradient Descent tìm cực tiểu hàm nhiều biến; tính xác suất hậu nghiệm.',
  gate: 'pass',
  quiz: {
    questions: [
      {
        id: 'w3q1', kind: 'single',
        prompt: 'Gradient của f(x, y) = x² + 3xy + y² tại điểm (1, 1) là:',
        options: ['(5, 5)', '(2, 2)', '(5, 3)', '(4, 5)'], answer: 0,
        explain: '∂f/∂x = 2x + 3y = 5; ∂f/∂y = 3x + 2y = 5.',
      },
      {
        id: 'w3q2', kind: 'single',
        prompt: 'Trong Gradient Descent, learning rate quá lớn thường dẫn đến:',
        options: ['Loss dao động hoặc phân kỳ, không hội tụ', 'Hội tụ chậm nhưng chắc chắn', 'Mô hình bị underfitting', 'Gradient bằng 0 ngay từ đầu'], answer: 0,
        explain: 'Bước nhảy quá dài vượt qua điểm cực tiểu, loss có thể tăng dần.',
      },
      {
        id: 'w3q3', kind: 'numeric',
        prompt: 'Một bệnh có tỉ lệ mắc 1%. Xét nghiệm cho kết quả dương tính đúng 99% với người bệnh và dương tính giả 5% với người khoẻ. Một người có kết quả dương tính; xác suất người đó thực sự mắc bệnh là bao nhiêu? (số thập phân, 3 chữ số)',
        answer: 0.1667, tolerance: 5e-3,
        explain: 'P = 0.99·0.01 / (0.99·0.01 + 0.05·0.99) = 0.0099 / 0.0594 ≈ 0.167.',
      },
      {
        id: 'w3q4', kind: 'single',
        prompt: 'Đạo hàm của sin(x²) theo x là:',
        options: ['2x·cos(x²)', 'cos(x²)', '2x·sin(x²)', 'cos(2x)'], answer: 0,
        explain: 'Chain rule: cos(x²)·(x²)′ = 2x·cos(x²).',
      },
      {
        id: 'w3q5', kind: 'numeric',
        prompt: 'Thực hiện một bước Gradient Descent cho f(x) = x² với x₀ = 3 và learning rate 0.1. Giá trị x₁ là:',
        answer: 2.4, tolerance: 1e-6,
        explain: "f'(3) = 6, x₁ = 3 − 0.1·6 = 2.4.",
      },
      {
        id: 'w3q6', kind: 'single',
        prompt: 'Tại một điểm cực tiểu địa phương nằm bên trong miền xác định của hàm khả vi, gradient bằng:',
        options: ['Vector 0', 'Vector toàn số 1', 'Giá trị nhỏ nhất của hàm', 'Không xác định'], answer: 0,
        explain: 'Điều kiện cần của cực trị là ∇f = 0.',
      },
      {
        id: 'w3q7', kind: 'multi',
        prompt: 'So sánh MSE và MAE. Chọn tất cả phát biểu đúng.',
        options: ['MSE phạt lỗi lớn nặng hơn MAE', 'MAE khả vi tại mọi điểm', 'MSE nhạy với outlier hơn MAE', 'Cả hai luôn không âm'], answer: [0, 2, 3],
        explain: 'MAE dùng |e| nên không khả vi tại e = 0.',
      },
    ],
  },
  lab: {
    title: 'Gradient Descent từ con số 0',
    intro: 'Trước khi dùng thư viện, ta tự cài gradient số và Gradient Descent để hiểu rõ cơ chế tối ưu đằng sau mọi mô hình ML.',
    setup: py`import numpy as np
np.set_printoptions(precision=5, suppress=True)`,
    packages: ['numpy'],
    exercises: [
      {
        id: 'num_grad', title: 'Gradient số (central difference)', points: 30,
        instructions: `Viết \`numerical_gradient(f, x, h=1e-5)\` xấp xỉ gradient của hàm vô hướng f tại vector x bằng sai phân trung tâm:

\`\`\`
∂f/∂xᵢ ≈ ( f(x + h·eᵢ) − f(x − h·eᵢ) ) / (2h)
\`\`\`

với eᵢ là vector đơn vị thứ i. Không được sửa trực tiếp mảng x truyền vào.`,
        starter: py`# GRADED FUNCTION: numerical_gradient
def numerical_gradient(f, x, h=1e-5):
    x = np.asarray(x, dtype=float)
    grad = np.zeros_like(x)
    ### START CODE HERE ###

    ### END CODE HERE ###
    return grad

f = lambda v: np.sum(v ** 2)
print(numerical_gradient(f, [1.0, 2.0, 3.0]))  # ≈ [2, 4, 6]`,
        solution: py`def numerical_gradient(f, x, h=1e-5):
    x = np.asarray(x, dtype=float)
    grad = np.zeros_like(x)
    for i in range(x.size):
        e = np.zeros_like(x)
        e[i] = h
        grad[i] = (f(x + e) - f(x - e)) / (2 * h)
    return grad`,
        tests: [
          { name: 'Tổng bình phương', code: py`r = numerical_gradient(lambda v: np.sum(v ** 2), [1.0, 2.0, 3.0])
assert close(r, [2, 4, 6], 1e-4), f"Nhận {r}"` },
        ],
        hidden: [
          { name: 'Hàm có tích chéo', code: py`f = lambda v: v[0] ** 2 + 3 * v[0] * v[1] + v[1] ** 2
assert close(numerical_gradient(f, [1.0, 1.0]), [5, 5], 1e-4), "Sai với f = x² + 3xy + y²"` },
          { name: 'Không sửa x', code: py`x = np.array([0.5, -0.2])
_ = numerical_gradient(lambda v: np.sin(v).sum(), x)
assert close(x, [0.5, -0.2]), "Hàm đã làm thay đổi x đầu vào"
assert close(numerical_gradient(lambda v: np.sin(v).sum(), x), np.cos(x), 1e-6), "Sai với f = Σ sin(x)"` },
        ],
      },
      {
        id: 'gd', title: 'Gradient Descent', points: 40,
        instructions: `Viết \`gradient_descent(grad_f, x0, lr, n_iters)\` thực hiện đúng \`n_iters\` bước cập nhật:

\`\`\`
x ← x − lr · grad_f(x)
\`\`\`

Trả về x cuối cùng (mảng NumPy).`,
        starter: py`# GRADED FUNCTION: gradient_descent
def gradient_descent(grad_f, x0, lr, n_iters):
    x = np.array(x0, dtype=float)
    ### START CODE HERE ### (≈ 2 dòng)

    ### END CODE HERE ###
    return x

# f(x, y) = (x − 3)² + (y + 1)² có cực tiểu tại (3, −1)
grad = lambda v: np.array([2 * (v[0] - 3), 2 * (v[1] + 1)])
print(gradient_descent(grad, [0.0, 0.0], lr=0.1, n_iters=200))`,
        solution: py`def gradient_descent(grad_f, x0, lr, n_iters):
    x = np.array(x0, dtype=float)
    for _ in range(n_iters):
        x = x - lr * grad_f(x)
    return x`,
        tests: [
          { name: 'Hội tụ về (3, −1)', code: py`grad = lambda v: np.array([2 * (v[0] - 3), 2 * (v[1] + 1)])
r = gradient_descent(grad, [0.0, 0.0], lr=0.1, n_iters=200)
assert close(r, [3, -1], 1e-4), f"Nhận {r}"` },
        ],
        hidden: [
          { name: 'Đúng số bước', code: py`g = lambda v: 2 * v
assert close(gradient_descent(g, [1.0], 0.25, 1), [0.5]), "Sau 1 bước phải được 0.5"
assert close(gradient_descent(g, [1.0], 0.25, 3), [0.125]), "Sau 3 bước phải được 0.125"` },
          { name: 'Không sửa x0', code: py`x0 = np.array([4.0, 4.0])
gradient_descent(lambda v: v, x0, 0.5, 10)
assert close(x0, [4, 4]), "Hàm đã làm thay đổi x0"` },
        ],
      },
      {
        id: 'bayes', title: 'Định lý Bayes', points: 30,
        instructions: `Viết \`bayes_posterior(prior, sensitivity, false_positive_rate)\` trả về P(bệnh | dương tính):

\`\`\`
P(B|+) = P(+|B)·P(B) / [ P(+|B)·P(B) + P(+|¬B)·P(¬B) ]
\`\`\``,
        starter: py`# GRADED FUNCTION: bayes_posterior
def bayes_posterior(prior, sensitivity, false_positive_rate):
    ### START CODE HERE ### (≈ 2 dòng)
    posterior = None
    ### END CODE HERE ###
    return posterior

print(bayes_posterior(0.01, 0.99, 0.05))  # ≈ 0.1667`,
        solution: py`def bayes_posterior(prior, sensitivity, false_positive_rate):
    num = sensitivity * prior
    return num / (num + false_positive_rate * (1 - prior))`,
        tests: [
          { name: 'Ví dụ xét nghiệm', code: py`assert close(bayes_posterior(0.01, 0.99, 0.05), 0.0099 / 0.0594), "Sai ví dụ trong đề"` },
        ],
        hidden: [
          { name: 'Prior 50%', code: py`assert close(bayes_posterior(0.5, 0.9, 0.1), 0.9), "Sai khi prior = 0.5"` },
          { name: 'Không dương tính giả', code: py`assert close(bayes_posterior(0.2, 0.7, 0.0), 1.0), "Khi FPR = 0, dương tính chắc chắn là bệnh"` },
        ],
      },
    ],
  },
};
