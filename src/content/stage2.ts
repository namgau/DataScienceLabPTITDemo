import { py, type Week } from './types';

export const week4: Week = {
  n: 4,
  title: 'Hồi quy tuyến tính & logistic',
  stage: 2,
  summary: 'Linear regression với MSE, Gradient Descent theo batch/mini-batch; logistic regression với sigmoid và cross-entropy; softmax cho nhiều lớp.',
  topics: ['Linear Regression', 'MSE loss', 'SGD / Mini-batch GD', 'Logistic Regression', 'Sigmoid, cross-entropy', 'Softmax'],
  practice: 'Tự cài hàm chi phí và gradient cho hồi quy tuyến tính và logistic, kiểm chứng với scikit-learn.',
  gate: 'pass',
  quiz: {
    questions: [
      {
        id: 'w4q1', kind: 'single',
        prompt: 'Với f(x) = w·x + b và J(w, b) = (1/2m) Σ (f(xᵢ) − yᵢ)², đạo hàm ∂J/∂w bằng:',
        options: ['(1/m) Σ (f(xᵢ) − yᵢ)·xᵢ', '(1/m) Σ (f(xᵢ) − yᵢ)', '(1/2m) Σ (f(xᵢ) − yᵢ)²·xᵢ', '(1/m) Σ (yᵢ − f(xᵢ))·w'], answer: 0,
        explain: 'Đạo hàm của bình phương mang hệ số 2 triệt tiêu với 1/2, nhân thêm ∂f/∂w = x.',
      },
      {
        id: 'w4q2', kind: 'numeric',
        prompt: 'Giá trị của hàm sigmoid σ(0) là:',
        answer: 0.5, tolerance: 1e-6,
        explain: 'σ(0) = 1 / (1 + e⁰) = 1/2.',
      },
      {
        id: 'w4q3', kind: 'single',
        prompt: 'Đầu ra σ(w·x + b) của logistic regression được hiểu là:',
        options: ['Xác suất P(y = 1 | x)', 'Nhãn dự đoán 0 hoặc 1', 'Khoảng cách tới đường biên quyết định', 'Giá trị loss của mẫu x'], answer: 0,
        explain: 'Sigmoid đưa điểm số về (0, 1) và được diễn giải là xác suất lớp dương.',
      },
      {
        id: 'w4q4', kind: 'single',
        prompt: 'Vì sao logistic regression dùng cross-entropy thay vì MSE?',
        options: [
          'MSE kết hợp với sigmoid tạo hàm mất mát không lồi, dễ kẹt; cross-entropy lồi theo w, b',
          'MSE không tính được với nhãn 0/1',
          'Cross-entropy luôn cho accuracy cao hơn',
          'MSE chỉ dùng được khi có ít dữ liệu',
        ], answer: 0,
        explain: 'Với sigmoid, MSE không lồi; log-loss lồi và cho gradient gọn: (a − y)·x.',
      },
      {
        id: 'w4q5', kind: 'single',
        prompt: 'Stochastic / mini-batch Gradient Descent khác batch GD ở chỗ:',
        options: [
          'Mỗi bước cập nhật chỉ dùng một mẫu hoặc một nhóm nhỏ, rẻ hơn mỗi bước nhưng nhiễu hơn',
          'Dùng toàn bộ dữ liệu cho mỗi bước cập nhật',
          'Không cần learning rate',
          'Chỉ áp dụng cho logistic regression',
        ], answer: 0,
        explain: 'Mini-batch đánh đổi độ chính xác của gradient lấy tốc độ cập nhật.',
      },
      {
        id: 'w4q6', kind: 'numeric',
        prompt: 'Một mẫu có nhãn y = 1 và mô hình dự đoán p = 0.8. Binary cross-entropy (log tự nhiên) của mẫu này là bao nhiêu? (3 chữ số thập phân)',
        answer: 0.2231, tolerance: 2e-3,
        explain: 'L = −ln(0.8) ≈ 0.223.',
      },
      {
        id: 'w4q7', kind: 'single',
        prompt: 'softmax([1, 1, 1]) bằng:',
        options: ['[1/3, 1/3, 1/3]', '[1, 1, 1]', '[0.73, 0.73, 0.73]', '[e, e, e]'], answer: 0,
        explain: 'Các logit bằng nhau cho xác suất bằng nhau.',
      },
    ],
  },
  lab: {
    title: 'Hàm chi phí và gradient',
    intro: 'Giống bài lab kinh điển của khoá Machine Learning Specialization: bạn tự viết hàm chi phí và gradient — nền móng của mọi thuật toán huấn luyện. Quy ước: X kích thước (m, n), y kích thước (m,), w kích thước (n,), b là số thực.',
    setup: py`import numpy as np
np.set_printoptions(precision=5, suppress=True)

X_demo = np.array([[1.0, 2.0], [2.0, 0.5], [3.0, 1.5], [4.0, 3.0]])
y_demo = np.array([5.0, 4.0, 8.0, 12.0])
w_demo = np.array([1.5, 1.0])
b_demo = 0.5`,
    packages: ['numpy', 'scikit-learn'],
    exercises: [
      {
        id: 'cost', title: 'compute_cost', points: 25,
        instructions: `\`\`\`
J(w, b) = (1 / 2m) · Σᵢ ( w·x⁽ⁱ⁾ + b − y⁽ⁱ⁾ )²
\`\`\`

Viết \`compute_cost(X, y, w, b)\`, vector hoá bằng \`X @ w\`.`,
        starter: py`# GRADED FUNCTION: compute_cost
def compute_cost(X, y, w, b):
    m = X.shape[0]
    ### START CODE HERE ### (≈ 2 dòng)
    cost = None
    ### END CODE HERE ###
    return cost

print(compute_cost(X_demo, y_demo, w_demo, b_demo))`,
        solution: py`def compute_cost(X, y, w, b):
    m = X.shape[0]
    err = X @ w + b - y
    return (err ** 2).sum() / (2 * m)`,
        tests: [
          { name: 'Dữ liệu demo', code: py`exp = sum((X_demo[i] @ w_demo + b_demo - y_demo[i]) ** 2 for i in range(4)) / 8
r = compute_cost(X_demo, y_demo, w_demo, b_demo)
assert close(r, exp), f"Kỳ vọng {exp}, nhận {r}"` },
        ],
        hidden: [
          { name: 'Khớp hoàn toàn', code: py`X = np.array([[1.0], [2.0], [3.0]])
assert close(compute_cost(X, 2 * X[:, 0] + 1, np.array([2.0]), 1.0), 0.0), "Mô hình khớp hoàn toàn phải có cost 0"` },
          { name: 'Ngẫu nhiên', code: py`rng = np.random.default_rng(4)
X = rng.normal(size=(30, 3)); y = rng.normal(size=30); w = rng.normal(size=3)
exp = np.mean((X @ w - 0.7 - y) ** 2) / 2
assert close(compute_cost(X, y, w, -0.7), exp), "Sai trên dữ liệu ngẫu nhiên"` },
        ],
      },
      {
        id: 'gradient', title: 'compute_gradient', points: 25,
        instructions: `\`\`\`
∂J/∂w = (1/m) · Xᵀ (Xw + b − y)
∂J/∂b = (1/m) · Σ (Xw + b − y)
\`\`\`

Viết \`compute_gradient(X, y, w, b)\` trả về tuple \`(dj_dw, dj_db)\`.`,
        starter: py`# GRADED FUNCTION: compute_gradient
def compute_gradient(X, y, w, b):
    m = X.shape[0]
    ### START CODE HERE ### (≈ 3 dòng)
    dj_dw = None
    dj_db = None
    ### END CODE HERE ###
    return dj_dw, dj_db

print(compute_gradient(X_demo, y_demo, w_demo, b_demo))`,
        solution: py`def compute_gradient(X, y, w, b):
    m = X.shape[0]
    err = X @ w + b - y
    return X.T @ err / m, err.sum() / m`,
        tests: [
          { name: 'Dữ liệu demo', code: py`err = X_demo @ w_demo + b_demo - y_demo
dw, db = compute_gradient(X_demo, y_demo, w_demo, b_demo)
assert close(dw, X_demo.T @ err / 4), f"dj_dw sai: {dw}"
assert close(db, err.mean()), f"dj_db sai: {db}"` },
        ],
        hidden: [
          { name: 'Kiểm tra bằng gradient số', code: py`rng = np.random.default_rng(8)
X = rng.normal(size=(20, 3)); y = rng.normal(size=20); w = rng.normal(size=3); b = 0.3
J = lambda w_, b_: np.mean((X @ w_ + b_ - y) ** 2) / 2
h = 1e-6
num_w = np.array([(J(w + h * e, b) - J(w - h * e, b)) / (2 * h) for e in np.eye(3)])
num_b = (J(w, b + h) - J(w, b - h)) / (2 * h)
dw, db = compute_gradient(X, y, w, b)
assert close(dw, num_w, 1e-5) and close(db, num_b, 1e-5), "Gradient không khớp gradient số"` },
        ],
      },
      {
        id: 'sigmoid', title: 'sigmoid', points: 20,
        instructions: `Viết \`sigmoid(z)\` = 1 / (1 + e⁻ᶻ), hoạt động với cả số thực và mảng NumPy.`,
        starter: py`# GRADED FUNCTION: sigmoid
def sigmoid(z):
    ### START CODE HERE ### (≈ 1 dòng)
    g = None
    ### END CODE HERE ###
    return g

print(sigmoid(np.array([-1, 0, 1])))`,
        solution: py`def sigmoid(z):
    return 1 / (1 + np.exp(-np.asarray(z, dtype=float)))`,
        tests: [
          { name: 'Giá trị cơ bản', code: py`assert close(sigmoid(0), 0.5), "σ(0) phải bằng 0.5"
assert close(sigmoid(np.array([-1, 1])), [0.26894142, 0.73105858]), "Sai với [−1, 1]"` },
        ],
        hidden: [
          { name: 'Mảng 2 chiều', code: py`z = np.array([[0.0, 2.0], [-3.0, 10.0]])
assert close(sigmoid(z), 1 / (1 + np.exp(-z))), "Sai với mảng 2 chiều"` },
          { name: 'Tính đối xứng', code: py`z = np.linspace(-5, 5, 11)
assert close(sigmoid(z) + sigmoid(-z), np.ones(11)), "σ(z) + σ(−z) phải bằng 1"` },
        ],
      },
      {
        id: 'log_cost', title: 'Cross-entropy cho logistic regression', points: 30,
        instructions: `\`\`\`
aᵢ = σ(w·x⁽ⁱ⁾ + b)
J = −(1/m) Σ [ yᵢ·log(aᵢ) + (1 − yᵢ)·log(1 − aᵢ) ]
\`\`\`

Viết \`logistic_cost(X, y, w, b)\` dùng hàm \`sigmoid\` ở trên.`,
        starter: py`# GRADED FUNCTION: logistic_cost
def logistic_cost(X, y, w, b):
    m = X.shape[0]
    ### START CODE HERE ### (≈ 2 dòng)
    cost = None
    ### END CODE HERE ###
    return cost

Xl = np.array([[0.5, 1.5], [1, 1], [1.5, 0.5], [3, 0.5], [2, 2], [1, 2.5]])
yl = np.array([0, 0, 0, 1, 1, 1])
print(logistic_cost(Xl, yl, np.array([1.0, 1.0]), -3.0))  # ≈ 0.3669`,
        solution: py`def logistic_cost(X, y, w, b):
    m = X.shape[0]
    a = sigmoid(X @ w + b)
    return -np.mean(y * np.log(a) + (1 - y) * np.log(1 - a))`,
        tests: [
          { name: 'Ví dụ trong đề', code: py`Xl = np.array([[0.5, 1.5], [1, 1], [1.5, 0.5], [3, 0.5], [2, 2], [1, 2.5]])
yl = np.array([0, 0, 0, 1, 1, 1])
r = logistic_cost(Xl, yl, np.array([1.0, 1.0]), -3.0)
assert close(r, 0.36686678640551745, 1e-6), f"Nhận {r}"` },
        ],
        hidden: [
          { name: 'w = 0 cho ln 2', code: py`X = np.random.default_rng(2).normal(size=(10, 4)); y = np.array([0, 1] * 5)
assert close(logistic_cost(X, y, np.zeros(4), 0.0), np.log(2)), "Khi w = 0, b = 0 cost phải là ln 2"` },
          { name: 'So với sklearn log_loss', code: py`from sklearn.metrics import log_loss
rng = np.random.default_rng(6)
X = rng.normal(size=(40, 3)); y = (rng.random(40) > 0.5).astype(int); w = rng.normal(size=3)
p = 1 / (1 + np.exp(-(X @ w + 0.2)))
assert close(logistic_cost(X, y, w, 0.2), log_loss(y, p), 1e-6), "Không khớp log_loss của sklearn"` },
        ],
      },
    ],
  },
};

export const week5: Week = {
  n: 5,
  title: 'Đánh giá mô hình',
  stage: 2,
  summary: 'Chia train/validation/test, cross-validation; MAE, MSE, RMSE, R²; accuracy, precision, recall, F1, ROC-AUC.',
  topics: ['Train / validation / test', 'Cross-validation', 'Confusion matrix', 'Precision, recall, F1', 'ROC-AUC, PR-AUC'],
  practice: 'Tính metrics bằng tay rồi đối chiếu với sklearn.metrics; tự cài chia K-fold.',
  gate: 'pass',
  quiz: {
    questions: [
      {
        id: 'w5q1', kind: 'single',
        prompt: 'Dữ liệu có 95% lớp 0 và 5% lớp 1. Một mô hình luôn dự đoán lớp 0. Phát biểu nào đúng?',
        options: [
          'Accuracy đạt 95% nhưng recall lớp 1 bằng 0 — accuracy gây hiểu lầm',
          'Accuracy đạt 5%',
          'Precision lớp 1 bằng 100%',
          'Đây là mô hình tốt vì accuracy cao',
        ], answer: 0,
        explain: 'Với dữ liệu lệch, nên xem precision/recall/F1 hoặc PR-AUC cho lớp hiếm.',
      },
      {
        id: 'w5q2', kind: 'numeric',
        prompt: 'TP = 40, FP = 10, FN = 20. Precision bằng:',
        answer: 0.8, tolerance: 1e-3,
        explain: 'Precision = TP / (TP + FP) = 40 / 50.',
      },
      {
        id: 'w5q3', kind: 'numeric',
        prompt: 'Với cùng số liệu (TP = 40, FP = 10, FN = 20), recall bằng: (3 chữ số thập phân)',
        answer: 0.6667, tolerance: 2e-3,
        explain: 'Recall = TP / (TP + FN) = 40 / 60.',
      },
      {
        id: 'w5q4', kind: 'numeric',
        prompt: 'F1-score tương ứng (precision 0.8, recall 2/3) bằng: (3 chữ số thập phân)',
        answer: 0.7273, tolerance: 2e-3,
        explain: 'F1 = 2PR / (P + R) = 2·0.8·0.667 / 1.467 ≈ 0.727.',
      },
      {
        id: 'w5q5', kind: 'single',
        prompt: 'ROC-AUC = 0.5 nghĩa là:',
        options: ['Mô hình xếp hạng không tốt hơn đoán ngẫu nhiên', 'Mô hình đúng một nửa số mẫu', 'Precision bằng recall', 'Ngưỡng phân loại tối ưu là 0.5'], answer: 0,
        explain: 'AUC là xác suất một mẫu dương được chấm điểm cao hơn một mẫu âm ngẫu nhiên.',
      },
      {
        id: 'w5q6', kind: 'single',
        prompt: 'Với 5-fold cross-validation, phát biểu nào đúng?',
        options: [
          'Huấn luyện 5 mô hình, mỗi mô hình dùng 80% dữ liệu và đánh giá trên 20% còn lại',
          'Huấn luyện 1 mô hình trên 5 lần dữ liệu',
          'Mỗi mẫu được dùng để đánh giá 5 lần',
          'Tập test cuối cùng được chia làm 5 phần',
        ], answer: 0,
        explain: 'Mỗi mẫu nằm trong tập validation đúng một lần.',
      },
      {
        id: 'w5q7', kind: 'multi',
        prompt: 'Đâu là cách làm đúng khi chọn hyperparameter?',
        options: [
          'Dùng tập validation để chọn, chỉ dùng tập test để đánh giá một lần cuối',
          'Chọn bộ tham số cho điểm cao nhất trên tập test',
          'Dùng cross-validation trên tập train',
          'Báo cáo điểm validation tốt nhất như kết quả cuối cùng',
        ], answer: [0, 2],
        explain: 'Chọn theo tập test hay báo cáo điểm validation tốt nhất đều làm kết quả lạc quan quá mức.',
      },
    ],
  },
  lab: {
    title: 'Tự cài metrics và K-fold',
    intro: 'Nhãn là mảng 0/1, lớp 1 là lớp dương. Sau khi viết xong, so sánh kết quả của bạn với `sklearn.metrics` trong ô nháp.',
    setup: py`import numpy as np
from sklearn import metrics

y_true_demo = np.array([1, 0, 1, 1, 0, 1, 0, 0, 1, 1])
y_pred_demo = np.array([1, 0, 0, 1, 0, 1, 1, 0, 1, 0])`,
    packages: ['numpy', 'scikit-learn'],
    exercises: [
      {
        id: 'confusion', title: 'Confusion counts', points: 30,
        instructions: `Viết \`confusion_counts(y_true, y_pred)\` trả về tuple \`(tp, fp, fn, tn)\` dạng số nguyên.`,
        starter: py`# GRADED FUNCTION: confusion_counts
def confusion_counts(y_true, y_pred):
    y_true = np.asarray(y_true); y_pred = np.asarray(y_pred)
    ### START CODE HERE ### (≈ 4 dòng)
    tp = fp = fn = tn = None
    ### END CODE HERE ###
    return tp, fp, fn, tn

print(confusion_counts(y_true_demo, y_pred_demo))`,
        solution: py`def confusion_counts(y_true, y_pred):
    y_true = np.asarray(y_true); y_pred = np.asarray(y_pred)
    tp = int(((y_true == 1) & (y_pred == 1)).sum())
    fp = int(((y_true == 0) & (y_pred == 1)).sum())
    fn = int(((y_true == 1) & (y_pred == 0)).sum())
    tn = int(((y_true == 0) & (y_pred == 0)).sum())
    return tp, fp, fn, tn`,
        tests: [
          { name: 'Dữ liệu demo', code: py`r = tuple(int(v) for v in confusion_counts(y_true_demo, y_pred_demo))
assert r == (4, 1, 2, 3), f"Kỳ vọng (4, 1, 2, 3), nhận {r}"` },
        ],
        hidden: [
          { name: 'Khớp sklearn', code: py`rng = np.random.default_rng(10)
yt = rng.integers(0, 2, 200); yp = rng.integers(0, 2, 200)
tn, fp, fn, tp = metrics.confusion_matrix(yt, yp).ravel()
r = tuple(int(v) for v in confusion_counts(yt, yp))
assert r == (tp, fp, fn, tn), f"Kỳ vọng {(tp, fp, fn, tn)}, nhận {r}"` },
        ],
      },
      {
        id: 'prf', title: 'Precision, recall, F1', points: 35,
        instructions: `Viết \`precision_recall_f1(y_true, y_pred)\` trả về tuple \`(precision, recall, f1)\`. Nếu mẫu số bằng 0, trả về 0.0 cho đại lượng đó (giống \`zero_division=0\` của sklearn).`,
        starter: py`# GRADED FUNCTION: precision_recall_f1
def precision_recall_f1(y_true, y_pred):
    tp, fp, fn, tn = confusion_counts(y_true, y_pred)
    ### START CODE HERE ###
    precision = recall = f1 = None
    ### END CODE HERE ###
    return precision, recall, f1

print(precision_recall_f1(y_true_demo, y_pred_demo))`,
        solution: py`def precision_recall_f1(y_true, y_pred):
    tp, fp, fn, tn = confusion_counts(y_true, y_pred)
    precision = tp / (tp + fp) if tp + fp else 0.0
    recall = tp / (tp + fn) if tp + fn else 0.0
    f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0
    return precision, recall, f1`,
        tests: [
          { name: 'Dữ liệu demo', code: py`p, r, f = precision_recall_f1(y_true_demo, y_pred_demo)
assert close([p, r, f], [0.8, 4 / 6, 2 * 0.8 * (4 / 6) / (0.8 + 4 / 6)]), f"Nhận {(p, r, f)}"` },
        ],
        hidden: [
          { name: 'Khớp sklearn', code: py`rng = np.random.default_rng(11)
yt = rng.integers(0, 2, 300); yp = (rng.random(300) < 0.3).astype(int)
exp = [metrics.precision_score(yt, yp), metrics.recall_score(yt, yp), metrics.f1_score(yt, yp)]
assert close(precision_recall_f1(yt, yp), exp), "Không khớp sklearn"` },
          { name: 'Không có dự đoán dương', code: py`p, r, f = precision_recall_f1([1, 1, 0], [0, 0, 0])
assert close([p, r, f], [0, 0, 0]), f"Phải trả về (0, 0, 0), nhận {(p, r, f)}"` },
        ],
      },
      {
        id: 'kfold', title: 'Chia K-fold', points: 35,
        instructions: `Viết \`k_fold_indices(n, k)\` trả về list gồm k tuple \`(train_idx, val_idx)\` (mảng NumPy số nguyên).

- Chia các chỉ số 0…n−1 **theo thứ tự** thành k phần liên tiếp, kích thước như \`np.array_split\` (các phần đầu dư 1 phần tử nếu không chia hết).
- Fold thứ i dùng phần thứ i làm validation, các phần còn lại làm train.`,
        starter: py`# GRADED FUNCTION: k_fold_indices
def k_fold_indices(n, k):
    folds = []
    ### START CODE HERE ###

    ### END CODE HERE ###
    return folds

for tr, va in k_fold_indices(10, 3):
    print(va)`,
        solution: py`def k_fold_indices(n, k):
    parts = np.array_split(np.arange(n), k)
    folds = []
    for i in range(k):
        train = np.concatenate([parts[j] for j in range(k) if j != i])
        folds.append((train, parts[i]))
    return folds`,
        tests: [
          { name: 'n = 10, k = 3', code: py`f = k_fold_indices(10, 3)
assert len(f) == 3, "Phải có 3 fold"
assert [list(v) for _, v in f] == [[0, 1, 2, 3], [4, 5, 6], [7, 8, 9]], f"Validation sai: {[list(v) for _, v in f]}"` },
        ],
        hidden: [
          { name: 'Phủ kín và không giao nhau', code: py`for n, k in [(23, 5), (7, 7), (100, 4)]:
    f = k_fold_indices(n, k)
    vals = np.concatenate([v for _, v in f])
    assert sorted(vals.tolist()) == list(range(n)), f"Validation chưa phủ đủ khi n={n}, k={k}"
    for tr, va in f:
        assert len(set(tr.tolist()) & set(va.tolist())) == 0, "Train và validation giao nhau"
        assert len(tr) + len(va) == n, "Train + validation phải bằng n"` },
          { name: 'Khớp sklearn KFold', code: py`from sklearn.model_selection import KFold
for (tr, va), (tr2, va2) in zip(k_fold_indices(17, 4), KFold(4).split(np.zeros(17))):
    assert list(va) == list(va2) and sorted(tr) == list(tr2), "Không khớp KFold(shuffle=False)"` },
        ],
      },
    ],
  },
};

export const week6: Week = {
  n: 6,
  title: 'Overfitting & Regularization',
  stage: 2,
  summary: 'Underfitting / overfitting, bias–variance, learning curve, chính quy hoá L1/L2, feature engineering và data leakage.',
  topics: ['Underfitting vs overfitting', 'Bias–variance tradeoff', 'L1 (Lasso), L2 (Ridge)', 'Learning curve', 'Data leakage'],
  practice: 'Hồi quy đa thức với Ridge; chuẩn hoá dữ liệu đúng cách để tránh rò rỉ.',
  gate: 'pass',
  quiz: {
    questions: [
      {
        id: 'w6q1', kind: 'single',
        prompt: 'Accuracy trên train là 99%, trên validation là 70%. Mô hình nhiều khả năng đang:',
        options: ['Overfitting (variance cao)', 'Underfitting (bias cao)', 'Bị data leakage', 'Hoạt động tốt'], answer: 0,
        explain: 'Khoảng cách lớn giữa train và validation là dấu hiệu điển hình của overfitting.',
      },
      {
        id: 'w6q2', kind: 'single',
        prompt: 'Bạn muốn mô hình tuyến tính tự đưa trọng số của các đặc trưng không quan trọng về đúng 0. Nên dùng:',
        options: ['L1 (Lasso)', 'L2 (Ridge)', 'Tăng learning rate', 'Bỏ hệ số chặn'], answer: 0,
        explain: 'Phạt |w| tạo nghiệm thưa; L2 chỉ làm trọng số nhỏ lại, hiếm khi bằng 0.',
      },
      {
        id: 'w6q3', kind: 'single',
        prompt: 'Thao tác nào gây data leakage?',
        options: [
          'Fit StandardScaler trên toàn bộ dữ liệu rồi mới chia train/test',
          'Fit StandardScaler trên train, transform cả train và test',
          'Dùng cross-validation trên tập train',
          'Cố định random seed khi chia dữ liệu',
        ], answer: 0,
        explain: 'Thống kê của tập test đã lọt vào bước tiền xử lý.',
      },
      {
        id: 'w6q4', kind: 'single',
        prompt: 'Bias cao, variance thấp tương ứng với:',
        options: ['Underfitting', 'Overfitting', 'Mô hình lý tưởng', 'Data leakage'], answer: 0,
        explain: 'Mô hình quá đơn giản, sai đều trên cả train và validation.',
      },
      {
        id: 'w6q5', kind: 'single',
        prompt: 'Tăng hệ số λ trong Ridge regression sẽ:',
        options: ['Làm trọng số nhỏ lại: bias tăng, variance giảm', 'Làm trọng số lớn hơn: bias giảm, variance tăng', 'Không ảnh hưởng trọng số', 'Đưa mọi trọng số về đúng 0 ngay lập tức'], answer: 0,
        explain: 'λ lớn ép mô hình đơn giản hơn.',
      },
      {
        id: 'w6q6', kind: 'multi',
        prompt: 'Cách nào thường giúp giảm overfitting?',
        options: ['Thu thập thêm dữ liệu', 'Thêm regularization', 'Tăng bậc của đa thức', 'Early stopping'], answer: [0, 1, 3],
        explain: 'Tăng bậc đa thức làm mô hình phức tạp hơn, dễ overfit hơn.',
      },
      {
        id: 'w6q7', kind: 'single',
        prompt: 'Learning curve cho thấy lỗi train và lỗi validation đều cao và gần nhau. Thêm dữ liệu có giúp nhiều không?',
        options: ['Không nhiều — mô hình đang underfit, cần mô hình mạnh hơn hoặc đặc trưng tốt hơn', 'Có — luôn giúp', 'Có — vì mô hình đang overfit', 'Không — cần tăng regularization'], answer: 0,
        explain: 'Khi bias cao, thêm dữ liệu không thu hẹp được lỗi.',
      },
    ],
  },
  lab: {
    title: 'Hồi quy đa thức và Ridge',
    intro: 'Dữ liệu một chiều có dạng hình sin cộng nhiễu (`x`, `y` đã có sẵn). Bạn sẽ tạo đặc trưng đa thức, giải Ridge dạng đóng và chuẩn hoá dữ liệu đúng cách.',
    setup: py`import numpy as np
rng = np.random.default_rng(42)
x = np.sort(rng.uniform(-3, 3, 40))
y = np.sin(x) + rng.normal(scale=0.2, size=40)`,
    packages: ['numpy', 'scikit-learn'],
    exercises: [
      {
        id: 'poly', title: 'Đặc trưng đa thức', points: 30,
        instructions: `Viết \`polynomial_features(x, degree)\` nhận vector x độ dài m, trả về ma trận (m, degree) với cột thứ j là \`x ** (j+1)\`: [x, x², …, xᵈ]. Không thêm cột hằng số.`,
        starter: py`# GRADED FUNCTION: polynomial_features
def polynomial_features(x, degree):
    x = np.asarray(x, dtype=float)
    ### START CODE HERE ### (≈ 1 dòng)
    P = None
    ### END CODE HERE ###
    return P

print(polynomial_features([1, 2, 3], 3))`,
        solution: py`def polynomial_features(x, degree):
    x = np.asarray(x, dtype=float)
    return np.column_stack([x ** d for d in range(1, degree + 1)])`,
        tests: [
          { name: 'Bậc 3', code: py`r = polynomial_features([1, 2, 3], 3)
assert close(r, [[1, 1, 1], [2, 4, 8], [3, 9, 27]]), f"Nhận\n{r}"` },
        ],
        hidden: [
          { name: 'Bậc 1', code: py`r = polynomial_features([0.5, -2.0], 1)
assert close(r, [[0.5], [-2.0]]), f"Bậc 1 phải có kích thước (m, 1), nhận {np.shape(r)}"` },
          { name: 'Khớp sklearn', code: py`from sklearn.preprocessing import PolynomialFeatures
exp = PolynomialFeatures(5, include_bias=False).fit_transform(x[:, None])
assert close(polynomial_features(x, 5), exp), "Không khớp PolynomialFeatures"` },
        ],
      },
      {
        id: 'ridge', title: 'Ridge dạng đóng', points: 35,
        instructions: `Với dữ liệu đã được căn giữa (không có hệ số chặn), nghiệm Ridge là:

\`\`\`
w = (XᵀX + λI)⁻¹ Xᵀy
\`\`\`

Viết \`ridge_fit(X, y, lam)\`. Dùng \`np.linalg.solve\`.`,
        starter: py`# GRADED FUNCTION: ridge_fit
def ridge_fit(X, y, lam):
    X = np.asarray(X, dtype=float); y = np.asarray(y, dtype=float)
    ### START CODE HERE ### (≈ 2 dòng)
    w = None
    ### END CODE HERE ###
    return w

P = polynomial_features(x, 9)
print(ridge_fit(P, y, 1.0))`,
        solution: py`def ridge_fit(X, y, lam):
    X = np.asarray(X, dtype=float); y = np.asarray(y, dtype=float)
    d = X.shape[1]
    return np.linalg.solve(X.T @ X + lam * np.eye(d), X.T @ y)`,
        tests: [
          { name: 'λ = 0 trùng bình phương tối thiểu', code: py`X = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]]); t = np.array([1.0, 2.0, 3.0])
assert close(ridge_fit(X, t, 0.0), np.linalg.lstsq(X, t, rcond=None)[0]), "λ = 0 phải trùng nghiệm bình phương tối thiểu"` },
        ],
        hidden: [
          { name: 'Khớp sklearn Ridge', code: py`from sklearn.linear_model import Ridge
P = polynomial_features(x, 6)
for lam in [0.1, 3.0, 50.0]:
    exp = Ridge(alpha=lam, fit_intercept=False, solver='cholesky').fit(P, y).coef_
    assert close(ridge_fit(P, y, lam), exp, 1e-5), f"Sai khi λ = {lam}"` },
          { name: 'λ lớn làm w nhỏ lại', code: py`P = polynomial_features(x, 6)
assert np.linalg.norm(ridge_fit(P, y, 1000.0)) < np.linalg.norm(ridge_fit(P, y, 0.01)), "‖w‖ phải giảm khi λ tăng"` },
        ],
      },
      {
        id: 'leak', title: 'Chuẩn hoá không rò rỉ', points: 35,
        instructions: `Viết \`scale_without_leakage(X_train, X_test)\` trả về \`(X_train_s, X_test_s)\`:

- Tính mean và độ lệch chuẩn (\`ddof=0\`) **theo cột, chỉ trên X_train**.
- Áp dụng cùng phép biến đổi \`(X − mean) / std\` cho cả hai tập.`,
        starter: py`# GRADED FUNCTION: scale_without_leakage
def scale_without_leakage(X_train, X_test):
    X_train = np.asarray(X_train, dtype=float); X_test = np.asarray(X_test, dtype=float)
    ### START CODE HERE ### (≈ 4 dòng)
    X_train_s = None
    X_test_s = None
    ### END CODE HERE ###
    return X_train_s, X_test_s`,
        solution: py`def scale_without_leakage(X_train, X_test):
    X_train = np.asarray(X_train, dtype=float); X_test = np.asarray(X_test, dtype=float)
    mu = X_train.mean(axis=0)
    sd = X_train.std(axis=0)
    return (X_train - mu) / sd, (X_test - mu) / sd`,
        tests: [
          { name: 'Ví dụ nhỏ', code: py`a, b = scale_without_leakage([[0.0], [2.0]], [[4.0]])
assert close(a, [[-1], [1]]) and close(b, [[3]]), f"Nhận train={a.ravel()}, test={b.ravel()}"` },
        ],
        hidden: [
          { name: 'Khớp StandardScaler', code: py`from sklearn.preprocessing import StandardScaler
rng = np.random.default_rng(12)
Xtr = rng.normal(3, 2, size=(50, 4)); Xte = rng.normal(5, 1, size=(20, 4))
sc = StandardScaler().fit(Xtr)
a, b = scale_without_leakage(Xtr, Xte)
assert close(a, sc.transform(Xtr)) and close(b, sc.transform(Xte)), "Không khớp StandardScaler fit trên train"` },
          { name: 'Test không bị chuẩn hoá theo chính nó', code: py`a, b = scale_without_leakage(np.arange(10.0)[:, None], np.arange(100.0, 110.0)[:, None])
assert b.mean() > 10, "Tập test đang được chuẩn hoá bằng thống kê của chính nó — đó là rò rỉ"` },
        ],
      },
    ],
  },
};

export const week7: Week = {
  n: 7,
  title: 'Thuật toán kinh điển & học không giám sát',
  stage: 2,
  summary: 'KNN, Naive Bayes, Decision Tree, Random Forest, SVM, XGBoost; phân cụm K-means và giảm chiều PCA.',
  topics: ['KNN', 'Decision Tree / Random Forest', 'SVM', 'XGBoost', 'K-means', 'PCA'],
  practice: 'Tự cài KNN, hai bước của K-means và PCA bằng SVD.',
  gate: 'pass',
  quiz: {
    questions: [
      {
        id: 'w7q1', kind: 'single',
        prompt: 'Random Forest giảm variance so với một cây quyết định nhờ:',
        options: [
          'Huấn luyện nhiều cây trên mẫu bootstrap và tập con đặc trưng ngẫu nhiên, rồi bỏ phiếu/trung bình',
          'Dùng một cây duy nhất nhưng sâu hơn',
          'Cắt tỉa cây theo thứ tự đặc trưng',
          'Huấn luyện các cây nối tiếp, cây sau sửa lỗi cây trước',
        ], answer: 0,
        explain: 'Cây nối tiếp sửa lỗi là boosting (XGBoost), không phải Random Forest.',
      },
      {
        id: 'w7q2', kind: 'single',
        prompt: 'KNN với K = 1 thường:',
        options: ['Overfit, rất nhạy với nhiễu', 'Underfit', 'Cho biên quyết định trơn nhất', 'Không phụ thuộc thang đo đặc trưng'], answer: 0,
        explain: 'Mỗi điểm chỉ theo một láng giềng, biên quyết định rất gồ ghề.',
      },
      {
        id: 'w7q3', kind: 'single',
        prompt: 'Vì sao cần chuẩn hoá đặc trưng trước khi dùng KNN?',
        options: ['KNN dựa trên khoảng cách, đặc trưng có thang đo lớn sẽ lấn át', 'Để KNN huấn luyện nhanh hơn', 'Vì KNN yêu cầu dữ liệu phân phối chuẩn', 'Không cần thiết'], answer: 0,
        explain: 'Ví dụ thu nhập (triệu) sẽ lấn át tuổi (chục) trong khoảng cách Euclid.',
      },
      {
        id: 'w7q4', kind: 'numeric',
        prompt: 'PCA trên dữ liệu 2 chiều cho hai trị riêng của ma trận hiệp phương sai là 4 và 1. Tỉ lệ phương sai giải thích bởi thành phần chính thứ nhất là:',
        answer: 0.8, tolerance: 1e-3,
        explain: '4 / (4 + 1) = 0.8.',
      },
      {
        id: 'w7q5', kind: 'single',
        prompt: 'SVM tuyến tính chọn siêu phẳng phân tách sao cho:',
        options: ['Lề (margin) tới các điểm gần nhất là lớn nhất', 'Đi qua trung bình của mỗi lớp', 'Tổng khoảng cách tới mọi điểm nhỏ nhất', 'Có nhiều support vector nhất'], answer: 0,
        explain: 'Max-margin là ý tưởng cốt lõi của SVM.',
      },
      {
        id: 'w7q6', kind: 'single',
        prompt: 'K-means cần chọn trước:',
        options: ['Số cụm K', 'Nhãn của từng cụm', 'Kích thước mỗi cụm', 'Số đặc trưng'], answer: 0,
        explain: 'Có thể dùng elbow method hoặc silhouette score để chọn K.',
      },
      {
        id: 'w7q7', kind: 'multi',
        prompt: 'Thuật toán nào là học không giám sát?',
        options: ['K-means', 'PCA', 'Logistic Regression', 'DBSCAN'], answer: [0, 1, 3],
        explain: 'Logistic Regression cần nhãn.',
      },
    ],
  },
  lab: {
    title: 'KNN, K-means và PCA',
    intro: 'Ba thuật toán kinh điển, cài bằng NumPy. Bài K-means đi theo đúng cấu trúc lab của khoá Unsupervised Learning: tách thành bước gán cụm và bước cập nhật tâm.',
    setup: py`import numpy as np
from sklearn.datasets import make_blobs
X_blobs, y_blobs = make_blobs(n_samples=120, centers=3, random_state=0)
init_centroids = X_blobs[[0, 40, 80]]`,
    packages: ['numpy', 'scikit-learn'],
    exercises: [
      {
        id: 'knn', title: 'KNN predict', points: 25,
        instructions: `Viết \`knn_predict(X_train, y_train, X_test, k)\` trả về mảng nhãn dự đoán cho từng hàng của X_test bằng bỏ phiếu đa số trong k láng giềng gần nhất (khoảng cách Euclid).

Nhãn là số nguyên không âm. Khi hoà phiếu, chọn nhãn nhỏ hơn — \`np.bincount(...).argmax()\` làm đúng điều này.`,
        starter: py`# GRADED FUNCTION: knn_predict
def knn_predict(X_train, y_train, X_test, k):
    X_train = np.asarray(X_train, float); X_test = np.asarray(X_test, float)
    y_train = np.asarray(y_train)
    preds = []
    ### START CODE HERE ###

    ### END CODE HERE ###
    return np.array(preds)

print(knn_predict(X_blobs[:100], y_blobs[:100], X_blobs[100:105], 5), y_blobs[100:105])`,
        solution: py`def knn_predict(X_train, y_train, X_test, k):
    X_train = np.asarray(X_train, float); X_test = np.asarray(X_test, float)
    y_train = np.asarray(y_train)
    preds = []
    for x in X_test:
        d = np.sqrt(((X_train - x) ** 2).sum(axis=1))
        nn = np.argsort(d, kind='stable')[:k]
        preds.append(np.bincount(y_train[nn]).argmax())
    return np.array(preds)`,
        tests: [
          { name: 'Ví dụ 1 chiều', code: py`r = knn_predict([[0], [1], [2], [10], [11]], [0, 0, 0, 1, 1], [[0.5], [10.4], [6.5]], 3)
assert list(r) == [0, 1, 1], f"Nhận {list(r)}"` },
        ],
        hidden: [
          { name: 'Khớp sklearn', code: py`from sklearn.neighbors import KNeighborsClassifier
rng = np.random.default_rng(13)
Xtr = rng.normal(size=(80, 3)); ytr = rng.integers(0, 3, 80); Xte = rng.normal(size=(25, 3))
exp = KNeighborsClassifier(n_neighbors=5).fit(Xtr, ytr).predict(Xte)
assert (knn_predict(Xtr, ytr, Xte, 5) == exp).mean() >= 0.96, "Khác quá nhiều so với KNeighborsClassifier"` },
          { name: 'K = 1 trên chính tập train', code: py`assert (knn_predict(X_blobs, y_blobs, X_blobs, 1) == y_blobs).all(), "K = 1 trên tập train phải đúng 100%"` },
        ],
      },
      {
        id: 'closest', title: 'find_closest_centroids', points: 25,
        instructions: `Viết \`find_closest_centroids(X, centroids)\` trả về mảng \`idx\` độ dài m, với \`idx[i]\` là chỉ số tâm gần X[i] nhất.`,
        starter: py`# GRADED FUNCTION: find_closest_centroids
def find_closest_centroids(X, centroids):
    ### START CODE HERE ### (≈ 2 dòng)
    idx = None
    ### END CODE HERE ###
    return idx

print(find_closest_centroids(X_blobs[:6], init_centroids))`,
        solution: py`def find_closest_centroids(X, centroids):
    d = ((X[:, None, :] - centroids[None, :, :]) ** 2).sum(axis=-1)
    return d.argmin(axis=1)`,
        tests: [
          { name: 'Ví dụ nhỏ', code: py`r = find_closest_centroids(np.array([[0, 0], [9, 9], [1, 0], [5, 6]]), np.array([[0, 0], [10, 10]]))
assert list(r) == [0, 1, 0, 1], f"Nhận {list(r)}"` },
        ],
        hidden: [
          { name: 'So với vòng lặp', code: py`exp = [int(np.argmin([np.sum((x - c) ** 2) for c in init_centroids])) for x in X_blobs]
assert list(find_closest_centroids(X_blobs, init_centroids)) == exp, "Sai trên dữ liệu blobs"` },
        ],
      },
      {
        id: 'centroids', title: 'compute_centroids', points: 25,
        instructions: `Viết \`compute_centroids(X, idx, K)\` trả về mảng (K, n), hàng k là trung bình các điểm có \`idx == k\`. Giả sử cụm nào cũng có ít nhất một điểm.`,
        starter: py`# GRADED FUNCTION: compute_centroids
def compute_centroids(X, idx, K):
    centroids = np.zeros((K, X.shape[1]))
    ### START CODE HERE ### (≈ 2 dòng)

    ### END CODE HERE ###
    return centroids

# Chạy thử 10 vòng K-means
c = init_centroids.copy()
for _ in range(10):
    c = compute_centroids(X_blobs, find_closest_centroids(X_blobs, c), 3)
print(c)`,
        solution: py`def compute_centroids(X, idx, K):
    centroids = np.zeros((K, X.shape[1]))
    for k in range(K):
        centroids[k] = X[idx == k].mean(axis=0)
    return centroids`,
        tests: [
          { name: 'Ví dụ nhỏ', code: py`r = compute_centroids(np.array([[0., 0], [2, 2], [10, 10], [12, 12]]), np.array([0, 0, 1, 1]), 2)
assert close(r, [[1, 1], [11, 11]]), f"Nhận\n{r}"` },
        ],
        hidden: [
          { name: 'Hội tụ như sklearn KMeans', code: py`from sklearn.cluster import KMeans
c = init_centroids.copy()
for _ in range(50):
    c = compute_centroids(X_blobs, find_closest_centroids(X_blobs, c), 3)
ref = KMeans(3, init=init_centroids, n_init=1).fit(X_blobs).cluster_centers_
assert close(np.sort(c, axis=0), np.sort(ref, axis=0), 1e-4), "Tâm cụm sau khi hội tụ không khớp KMeans"` },
        ],
      },
      {
        id: 'pca', title: 'PCA bằng SVD', points: 25,
        instructions: `Viết \`pca_project(X, n_components)\`:

1. Căn giữa X theo cột.
2. Tính SVD: \`U, S, Vt = np.linalg.svd(Xc, full_matrices=False)\`.
3. Trả về \`Xc @ Vt[:n_components].T\`, kích thước (m, n_components).

Dấu của mỗi thành phần có thể khác thư viện — test chỉ so sánh trị tuyệt đối.`,
        starter: py`# GRADED FUNCTION: pca_project
def pca_project(X, n_components):
    X = np.asarray(X, dtype=float)
    ### START CODE HERE ### (≈ 3 dòng)
    Z = None
    ### END CODE HERE ###
    return Z

print(pca_project(X_blobs, 1)[:5])`,
        solution: py`def pca_project(X, n_components):
    X = np.asarray(X, dtype=float)
    Xc = X - X.mean(axis=0)
    U, S, Vt = np.linalg.svd(Xc, full_matrices=False)
    return Xc @ Vt[:n_components].T`,
        tests: [
          { name: 'Kích thước', code: py`assert np.shape(pca_project(X_blobs, 1)) == (120, 1), "Phải trả về (m, n_components)"` },
        ],
        hidden: [
          { name: 'Khớp sklearn PCA', code: py`from sklearn.decomposition import PCA
rng = np.random.default_rng(14)
X = rng.normal(size=(60, 5)) @ rng.normal(size=(5, 5))
exp = PCA(3).fit_transform(X)
assert close(np.abs(pca_project(X, 3)), np.abs(exp), 1e-6), "Không khớp PCA (so sánh trị tuyệt đối)"` },
        ],
      },
    ],
  },
};

export const week8: Week = {
  n: 8,
  title: 'Dự án ML & kiểm tra giữa kỳ',
  stage: 2,
  summary: 'Quy trình ML end-to-end: hiểu bài toán → EDA → đặc trưng → huấn luyện → tinh chỉnh → đánh giá. Kiểm tra tổng hợp tuần 1–7.',
  topics: ['ML pipeline', 'EDA', 'Feature engineering', 'Hyperparameter tuning', 'sklearn Pipeline'],
  practice: 'Mini project chẩn đoán ung thư vú (Breast Cancer Wisconsin) với sklearn Pipeline, đạt accuracy ≥ 95% trên tập test ẩn.',
  gate: 'pass',
  exam: true,
  quiz: {
    timeLimitMin: 90,
    questions: [
      {
        id: 'w8q1', kind: 'single',
        prompt: 'Trước khi chọn mô hình cho một bài toán mới, bước nên làm đầu tiên là:',
        options: ['Hiểu bài toán, metric cần tối ưu và khám phá dữ liệu (EDA)', 'Huấn luyện ngay một mạng nơ-ron sâu', 'Tinh chỉnh hyperparameter', 'Chọn mô hình có nhiều tham số nhất'], answer: 0,
        explain: 'Hiểu dữ liệu và mục tiêu quyết định mọi lựa chọn phía sau.',
      },
      {
        id: 'w8q2', kind: 'single',
        prompt: 'Lợi ích chính của sklearn Pipeline khi kết hợp với cross-validation là:',
        options: [
          'Tiền xử lý được fit lại trên từng fold train, tránh rò rỉ sang fold validation',
          'Tự động chọn mô hình tốt nhất',
          'Tăng tốc bằng GPU',
          'Không cần chia train/test nữa',
        ], answer: 0,
        explain: 'Pipeline đóng gói các bước để cross_val_score fit đúng thứ tự trong từng fold.',
      },
      {
        id: 'w8q3', kind: 'single',
        prompt: 'GridSearchCV làm gì?',
        options: ['Thử mọi tổ hợp hyperparameter trong lưới, đánh giá mỗi tổ hợp bằng cross-validation', 'Lấy mẫu ngẫu nhiên các tổ hợp hyperparameter', 'Tối ưu hyperparameter bằng gradient', 'Chia dữ liệu thành lưới ô vuông'], answer: 0,
        explain: 'Lấy mẫu ngẫu nhiên là RandomizedSearchCV.',
      },
      {
        id: 'w8q4', kind: 'numeric',
        prompt: 'TP = 30, FP = 20, FN = 10. F1-score bằng: (3 chữ số thập phân)',
        answer: 0.6667, tolerance: 2e-3,
        explain: 'P = 0.6, R = 0.75, F1 = 2·0.6·0.75 / 1.35 ≈ 0.667.',
      },
      {
        id: 'w8q5', kind: 'numeric',
        prompt: 'Dữ liệu 1000 mẫu, dùng 5-fold CV. Mỗi fold validation có bao nhiêu mẫu?',
        answer: 200, tolerance: 1e-6,
        explain: '1000 / 5 = 200.',
      },
      {
        id: 'w8q6', kind: 'single',
        prompt: 'Biến "thành phố" (Hà Nội, Đà Nẵng, TP.HCM) nên được mã hoá như thế nào cho hồi quy tuyến tính?',
        options: ['One-hot encoding', 'Gán 1, 2, 3 theo thứ tự bảng chữ cái', 'Bỏ đi vì không phải số', 'Chuẩn hoá Min–Max'], answer: 0,
        explain: 'Gán số thứ tự tạo ra quan hệ thứ bậc không có thật.',
      },
      {
        id: 'w8q7', kind: 'single',
        prompt: 'Cột "thu nhập" có 8% giá trị thiếu và phân phối lệch phải. Cách xử lý hợp lý là:',
        options: ['Điền bằng median tính trên tập train', 'Điền bằng mean tính trên toàn bộ dữ liệu', 'Xoá cả cột', 'Điền bằng 0'], answer: 0,
        explain: 'Median bền với lệch; tính trên train để tránh rò rỉ.',
      },
      {
        id: 'w8q8', kind: 'numeric',
        prompt: 'f(w) = (w − 5)², w₀ = 1, learning rate 0.25. Sau một bước Gradient Descent, w₁ bằng:',
        answer: 3, tolerance: 1e-6,
        explain: "f'(1) = 2(1 − 5) = −8, w₁ = 1 + 0.25·8 = 3.",
      },
      {
        id: 'w8q9', kind: 'single',
        prompt: 'Biên quyết định của logistic regression (không dùng đặc trưng đa thức) là:',
        options: ['Một siêu phẳng tuyến tính theo các đặc trưng', 'Một đường cong bậc hai', 'Một hình cầu', 'Tùy thuộc learning rate'], answer: 0,
        explain: 'σ(w·x + b) = 0.5 ⇔ w·x + b = 0.',
      },
      {
        id: 'w8q10', kind: 'multi',
        prompt: 'Dấu hiệu nào gợi ý có data leakage?',
        options: [
          'Có đặc trưng chỉ được ghi nhận sau thời điểm cần dự đoán',
          'Điểm test cao bất thường so với các nghiên cứu tương tự',
          'Dùng cross-validation 5-fold',
          'Mã khách hàng tương quan mạnh với nhãn do cách thu thập dữ liệu',
        ], answer: [0, 1, 3],
        explain: 'Cross-validation là kỹ thuật đánh giá đúng đắn, không phải dấu hiệu rò rỉ.',
      },
      {
        id: 'w8q11', kind: 'single',
        prompt: 'Chuẩn hoá z-score cho tập test cần dùng:',
        options: ['μ và σ tính trên tập train', 'μ và σ tính trên tập test', 'μ và σ tính trên train + test', 'μ = 0, σ = 1 cố định'], answer: 0,
        explain: 'Tập test phải được xử lý như dữ liệu chưa từng thấy.',
      },
      {
        id: 'w8q12', kind: 'single',
        prompt: 'So với một cây quyết định sâu, Random Forest thường có:',
        options: ['Variance thấp hơn, tổng quát hoá tốt hơn', 'Bias thấp hơn hẳn và variance cao hơn', 'Tốc độ dự đoán nhanh hơn', 'Khả năng diễn giải tốt hơn'], answer: 0,
        explain: 'Trung bình nhiều cây ít tương quan làm giảm variance.',
      },
    ],
  },
  lab: {
    title: 'Mini project: chẩn đoán ung thư vú',
    intro: 'Tập Breast Cancer Wisconsin: 569 mẫu, 30 đặc trưng, nhãn 1 = lành tính. Dữ liệu đã chia sẵn `X_train, X_test, y_train, y_test`. Grader sẽ đánh giá pipeline của bạn trên một tập test **ẩn** khác.',
    setup: py`import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn import metrics

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)
print(X_train.shape, X_test.shape)`,
    packages: ['numpy', 'scikit-learn'],
    exercises: [
      {
        id: 'pipeline', title: 'Xây dựng pipeline', points: 40,
        instructions: `Viết \`build_pipeline()\` trả về một sklearn \`Pipeline\` **chưa huấn luyện** gồm bước chuẩn hoá và một bộ phân loại tuỳ chọn.

Yêu cầu: accuracy 5-fold CV trên \`X_train\` ≥ 0.95 và accuracy trên tập test ẩn ≥ 0.95.`,
        starter: py`# GRADED FUNCTION: build_pipeline
def build_pipeline():
    ### START CODE HERE ###
    pipe = None
    ### END CODE HERE ###
    return pipe

pipe = build_pipeline()
print(cross_val_score(pipe, X_train, y_train, cv=5).mean())`,
        solution: py`def build_pipeline():
    return make_pipeline(StandardScaler(), LogisticRegression(C=1.0, max_iter=5000))`,
        tests: [
          { name: 'Là Pipeline và đạt CV ≥ 0.95', code: py`from sklearn.base import clone
pipe = build_pipeline()
assert isinstance(pipe, Pipeline), "Phải trả về sklearn Pipeline"
s = cross_val_score(clone(pipe), X_train, y_train, cv=5).mean()
assert s >= 0.95, f"CV accuracy = {s:.4f} < 0.95"` },
        ],
        hidden: [
          { name: 'Tập test ẩn ≥ 0.95', code: py`from sklearn.base import clone
Xa, Xb, ya, yb = train_test_split(X, y, test_size=0.3, random_state=2024, stratify=y)
acc = clone(build_pipeline()).fit(Xa, ya).score(Xb, yb)
assert acc >= 0.95, f"Accuracy trên test ẩn = {acc:.4f} < 0.95"` },
        ],
      },
      {
        id: 'tune', title: 'Chọn hệ số C', points: 30,
        instructions: `Viết \`tune_C(X, y, Cs)\` trả về giá trị C trong danh sách \`Cs\` cho accuracy trung bình 5-fold (\`cross_val_score(..., cv=5)\`) cao nhất, với mô hình:

\`\`\`
make_pipeline(StandardScaler(), LogisticRegression(C=c, max_iter=5000))
\`\`\`

Nếu hoà, chọn C xuất hiện trước trong danh sách.`,
        starter: py`# GRADED FUNCTION: tune_C
def tune_C(X, y, Cs):
    ### START CODE HERE ###
    best_C = None
    ### END CODE HERE ###
    return best_C

print(tune_C(X_train, y_train, [0.01, 0.1, 1, 10]))`,
        solution: py`def tune_C(X, y, Cs):
    scores = [cross_val_score(make_pipeline(StandardScaler(), LogisticRegression(C=c, max_iter=5000)), X, y, cv=5).mean() for c in Cs]
    return Cs[int(np.argmax(scores))]`,
        tests: [
          { name: 'Trả về một phần tử của Cs', code: py`r = tune_C(X_train, y_train, [0.01, 1])
assert r in [0.01, 1], f"Kết quả {r} không nằm trong Cs"` },
        ],
        hidden: [
          { name: 'Khớp GridSearchCV', code: py`from sklearn.model_selection import GridSearchCV
Cs = [0.001, 0.03, 0.3, 3, 30]
gs = GridSearchCV(make_pipeline(StandardScaler(), LogisticRegression(max_iter=5000)), {'logisticregression__C': Cs}, cv=5).fit(X_train, y_train)
r = tune_C(X_train, y_train, Cs)
assert r == gs.best_params_['logisticregression__C'], f"GridSearchCV chọn {gs.best_params_['logisticregression__C']}, bạn chọn {r}"` },
        ],
      },
      {
        id: 'evaluate', title: 'Báo cáo kết quả', points: 30,
        instructions: `Viết \`evaluate(model, X_test, y_test)\` nhận mô hình **đã huấn luyện**, trả về dict có đúng 4 khoá \`'accuracy', 'precision', 'recall', 'f1'\` (dùng \`sklearn.metrics\`, lớp dương là 1).`,
        starter: py`# GRADED FUNCTION: evaluate
def evaluate(model, X_test, y_test):
    ### START CODE HERE ###
    report = None
    ### END CODE HERE ###
    return report

model = build_pipeline().fit(X_train, y_train)
print(evaluate(model, X_test, y_test))`,
        solution: py`def evaluate(model, X_test, y_test):
    p = model.predict(X_test)
    return {'accuracy': metrics.accuracy_score(y_test, p), 'precision': metrics.precision_score(y_test, p),
            'recall': metrics.recall_score(y_test, p), 'f1': metrics.f1_score(y_test, p)}`,
        tests: [
          { name: 'Đủ 4 khoá', code: py`m = build_pipeline().fit(X_train, y_train)
r = evaluate(m, X_test, y_test)
assert set(r) == {'accuracy', 'precision', 'recall', 'f1'}, f"Khoá hiện có: {set(r)}"` },
        ],
        hidden: [
          { name: 'Giá trị đúng', code: py`from sklearn.dummy import DummyClassifier
m = make_pipeline(StandardScaler(), LogisticRegression(C=0.05, max_iter=5000)).fit(X_train, y_train)
p = m.predict(X_test)
r = evaluate(m, X_test, y_test)
exp = [metrics.accuracy_score(y_test, p), metrics.precision_score(y_test, p), metrics.recall_score(y_test, p), metrics.f1_score(y_test, p)]
assert close([r['accuracy'], r['precision'], r['recall'], r['f1']], exp), "Giá trị metrics chưa đúng"` },
        ],
      },
    ],
  },
};
