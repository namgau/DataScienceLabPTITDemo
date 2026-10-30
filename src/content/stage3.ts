import { py, type Week } from './types';

export const week9: Week = {
  n: 9,
  title: 'Mạng nơ-ron & Backpropagation',
  stage: 3,
  summary: 'Perceptron, MLP, hàm kích hoạt, lan truyền xuôi, đồ thị tính toán và lan truyền ngược bằng chain rule.',
  topics: ['Perceptron, MLP', 'Sigmoid, tanh, ReLU', 'Forward pass', 'Computational graph', 'Backpropagation'],
  practice: 'Tự viết mạng 2 lớp bằng NumPy và huấn luyện giải bài XOR.',
  gate: 'pass',
  quiz: {
    questions: [
      {
        id: 'w9q1', kind: 'single',
        prompt: 'Vì sao mạng nơ-ron cần hàm kích hoạt phi tuyến?',
        options: [
          'Không có nó, nhiều lớp tuyến tính chồng lên nhau vẫn chỉ là một phép biến đổi tuyến tính',
          'Để mạng chạy nhanh hơn',
          'Để giảm số tham số',
          'Để gradient luôn bằng 1',
        ], answer: 0,
        explain: 'W₂(W₁x) = (W₂W₁)x — vẫn tuyến tính.',
      },
      {
        id: 'w9q2', kind: 'single',
        prompt: 'Ưu điểm chính của ReLU so với sigmoid ở các lớp ẩn là:',
        options: ['Gradient không bão hoà khi x > 0, giảm vanishing gradient', 'Đầu ra luôn nằm trong (0, 1)', 'Khả vi tại mọi điểm', 'Không bao giờ có neuron "chết"'], answer: 0,
        explain: 'ReLU có đạo hàm bằng 1 với x > 0; nhưng neuron có thể "chết" khi luôn âm.',
      },
      {
        id: 'w9q3', kind: 'single',
        prompt: 'Backpropagation dựa trên nguyên lý toán học nào?',
        options: ['Chain rule (quy tắc đạo hàm hàm hợp)', 'Định lý Bayes', 'Khai triển Fourier', 'Phương pháp Monte Carlo'], answer: 0,
        explain: 'Gradient được nhân dồn qua các nút của đồ thị tính toán, từ output về input.',
      },
      {
        id: 'w9q4', kind: 'numeric',
        prompt: 'Một MLP có kiến trúc 4 → 5 → 3 (fully connected, có bias). Tổng số tham số là bao nhiêu?',
        answer: 43, tolerance: 1e-6,
        explain: '(4·5 + 5) + (5·3 + 3) = 25 + 18 = 43.',
      },
      {
        id: 'w9q5', kind: 'numeric',
        prompt: "Đạo hàm của sigmoid tại 0, tức σ'(0), bằng:",
        answer: 0.25, tolerance: 1e-6,
        explain: "σ'(z) = σ(z)(1 − σ(z)) = 0.5·0.5.",
      },
      {
        id: 'w9q6', kind: 'single',
        prompt: 'Nếu khởi tạo mọi trọng số của một lớp ẩn bằng 0 thì:',
        options: ['Các neuron trong lớp nhận gradient giống nhau và học giống hệt nhau mãi mãi', 'Mạng hội tụ nhanh hơn', 'Mạng chắc chắn tránh được overfitting', 'Không có ảnh hưởng gì'], answer: 0,
        explain: 'Cần khởi tạo ngẫu nhiên để phá vỡ tính đối xứng.',
      },
      {
        id: 'w9q7', kind: 'multi',
        prompt: 'Về bài toán XOR, chọn tất cả phát biểu đúng.',
        options: [
          'Một perceptron đơn không giải được XOR',
          'XOR là bài toán tách được tuyến tính',
          'MLP một lớp ẩn với kích hoạt phi tuyến giải được XOR',
          'Hai lớp tuyến tính chồng nhau (không kích hoạt) giải được XOR',
        ], answer: [0, 2],
        explain: 'XOR không tách được tuyến tính; cần ít nhất một lớp ẩn phi tuyến.',
      },
    ],
  },
  lab: {
    title: 'Mạng 2 lớp giải XOR',
    intro: 'Quy ước: mỗi hàng của X là một mẫu. Kiến trúc: X → Linear → tanh → Linear → sigmoid. Hàm `sigmoid` đã có sẵn. Loss là binary cross-entropy.',
    setup: py`import numpy as np
np.set_printoptions(precision=4, suppress=True)

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

X_xor = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
y_xor = np.array([[0], [1], [1], [0]], dtype=float)`,
    packages: ['numpy'],
    exercises: [
      {
        id: 'init', title: 'Khởi tạo tham số', points: 20,
        instructions: `Viết \`initialize_parameters(n_x, n_h, n_y, seed)\` trả về dict với:

\`\`\`
rng = np.random.default_rng(seed)
W1 = rng.standard_normal((n_x, n_h)) * 0.5   # gọi trước
b1 = zeros (1, n_h)
W2 = rng.standard_normal((n_h, n_y)) * 0.5   # gọi sau
b2 = zeros (1, n_y)
\`\`\`

Thứ tự gọi \`rng\` phải đúng như trên để kết quả khớp grader.`,
        starter: py`# GRADED FUNCTION: initialize_parameters
def initialize_parameters(n_x, n_h, n_y, seed=1):
    rng = np.random.default_rng(seed)
    ### START CODE HERE ### (≈ 4 dòng)
    W1 = b1 = W2 = b2 = None
    ### END CODE HERE ###
    return {"W1": W1, "b1": b1, "W2": W2, "b2": b2}

p = initialize_parameters(2, 4, 1)
print({k: v.shape for k, v in p.items()})`,
        solution: py`def initialize_parameters(n_x, n_h, n_y, seed=1):
    rng = np.random.default_rng(seed)
    W1 = rng.standard_normal((n_x, n_h)) * 0.5
    b1 = np.zeros((1, n_h))
    W2 = rng.standard_normal((n_h, n_y)) * 0.5
    b2 = np.zeros((1, n_y))
    return {"W1": W1, "b1": b1, "W2": W2, "b2": b2}`,
        tests: [
          { name: 'Kích thước', code: py`p = initialize_parameters(2, 4, 1)
shapes = {k: np.shape(v) for k, v in p.items()}
assert shapes == {"W1": (2, 4), "b1": (1, 4), "W2": (4, 1), "b2": (1, 1)}, f"Nhận {shapes}"` },
        ],
        hidden: [
          { name: 'Giá trị theo seed', code: py`p = initialize_parameters(3, 5, 2, seed=7)
rng = np.random.default_rng(7)
assert close(p["W1"], rng.standard_normal((3, 5)) * 0.5), "W1 sai — kiểm tra thứ tự và hệ số 0.5"
assert close(p["W2"], rng.standard_normal((5, 2)) * 0.5), "W2 sai"
assert close(p["b1"], np.zeros((1, 5))) and close(p["b2"], np.zeros((1, 2))), "bias phải bằng 0"` },
        ],
      },
      {
        id: 'forward', title: 'Lan truyền xuôi', points: 25,
        instructions: `\`\`\`
Z1 = X @ W1 + b1     A1 = tanh(Z1)
Z2 = A1 @ W2 + b2    A2 = sigmoid(Z2)
\`\`\`

Viết \`forward(X, params)\` trả về \`(A2, cache)\` với \`cache = {"A1": A1, "A2": A2}\`.`,
        starter: py`# GRADED FUNCTION: forward
def forward(X, params):
    W1, b1, W2, b2 = params["W1"], params["b1"], params["W2"], params["b2"]
    ### START CODE HERE ### (≈ 4 dòng)
    A1 = A2 = None
    ### END CODE HERE ###
    return A2, {"A1": A1, "A2": A2}

A2, cache = forward(X_xor, initialize_parameters(2, 4, 1))
print(A2)`,
        solution: py`def forward(X, params):
    W1, b1, W2, b2 = params["W1"], params["b1"], params["W2"], params["b2"]
    A1 = np.tanh(X @ W1 + b1)
    A2 = sigmoid(A1 @ W2 + b2)
    return A2, {"A1": A1, "A2": A2}`,
        tests: [
          { name: 'Kích thước đầu ra', code: py`A2, cache = forward(X_xor, initialize_parameters(2, 4, 1))
assert np.shape(A2) == (4, 1) and np.shape(cache["A1"]) == (4, 4), f"A2 {np.shape(A2)}, A1 {np.shape(cache['A1'])}"` },
        ],
        hidden: [
          { name: 'Giá trị', code: py`p = {"W1": np.array([[1.0, -1.0], [0.5, 2.0]]), "b1": np.array([[0.1, -0.2]]), "W2": np.array([[1.5], [-0.5]]), "b2": np.array([[0.3]])}
A1 = np.tanh(X_xor @ p["W1"] + p["b1"])
A2, cache = forward(X_xor, p)
assert close(cache["A1"], A1), "A1 sai — dùng tanh"
assert close(A2, 1 / (1 + np.exp(-(A1 @ p["W2"] + p["b2"])))), "A2 sai"` },
        ],
      },
      {
        id: 'backward', title: 'Lan truyền ngược', points: 35,
        instructions: `Với m mẫu và binary cross-entropy trung bình:

\`\`\`
dZ2 = A2 − y
dW2 = A1ᵀ @ dZ2 / m          db2 = Σ_hàng dZ2 / m   (giữ shape (1, n_y))
dZ1 = (dZ2 @ W2ᵀ) * (1 − A1²)
dW1 = Xᵀ @ dZ1 / m           db1 = Σ_hàng dZ1 / m   (giữ shape (1, n_h))
\`\`\`

Viết \`backward(X, y, params, cache)\` trả về dict \`{"dW1", "db1", "dW2", "db2"}\`.`,
        starter: py`# GRADED FUNCTION: backward
def backward(X, y, params, cache):
    m = X.shape[0]
    W2 = params["W2"]
    A1, A2 = cache["A1"], cache["A2"]
    ### START CODE HERE ### (≈ 6 dòng)
    dW1 = db1 = dW2 = db2 = None
    ### END CODE HERE ###
    return {"dW1": dW1, "db1": db1, "dW2": dW2, "db2": db2}`,
        solution: py`def backward(X, y, params, cache):
    m = X.shape[0]
    W2 = params["W2"]
    A1, A2 = cache["A1"], cache["A2"]
    dZ2 = A2 - y
    dW2 = A1.T @ dZ2 / m
    db2 = dZ2.sum(axis=0, keepdims=True) / m
    dZ1 = (dZ2 @ W2.T) * (1 - A1 ** 2)
    dW1 = X.T @ dZ1 / m
    db1 = dZ1.sum(axis=0, keepdims=True) / m
    return {"dW1": dW1, "db1": db1, "dW2": dW2, "db2": db2}`,
        tests: [
          { name: 'Kích thước gradient', code: py`p = initialize_parameters(2, 4, 1)
A2, cache = forward(X_xor, p)
g = backward(X_xor, y_xor, p, cache)
for k in ["W1", "b1", "W2", "b2"]:
    assert np.shape(g["d" + k]) == np.shape(p[k]), f"d{k} có shape {np.shape(g['d' + k])}, cần {np.shape(p[k])}"` },
        ],
        hidden: [
          { name: 'Gradient check', code: py`p = initialize_parameters(2, 3, 1, seed=3)
def loss(pp):
    A2, _ = forward(X_xor, pp)
    return -np.mean(y_xor * np.log(A2) + (1 - y_xor) * np.log(1 - A2))
A2, cache = forward(X_xor, p)
g = backward(X_xor, y_xor, p, cache)
h = 1e-6
for k in ["W1", "b1", "W2", "b2"]:
    num = np.zeros_like(p[k])
    for idx in np.ndindex(p[k].shape):
        pp = {kk: vv.copy() for kk, vv in p.items()}; pp[k][idx] += h; lp = loss(pp)
        pp[k][idx] -= 2 * h; lm = loss(pp)
        num[idx] = (lp - lm) / (2 * h)
    assert close(g["d" + k], num, 1e-5), f"d{k} không khớp gradient số"` },
        ],
      },
      {
        id: 'train', title: 'Huấn luyện XOR', points: 20,
        instructions: `Viết \`train(X, y, n_h, lr, n_iters, seed)\`: khởi tạo bằng \`initialize_parameters\`, rồi lặp \`n_iters\` lần: forward → backward → cập nhật \`P ← P − lr · dP\` cho cả 4 tham số. Trả về params.

Mạng của bạn phải phân loại đúng cả 4 điểm XOR với \`n_h=4, lr=1.0, n_iters=3000, seed=1\`.`,
        starter: py`# GRADED FUNCTION: train
def train(X, y, n_h=4, lr=1.0, n_iters=3000, seed=1):
    params = initialize_parameters(X.shape[1], n_h, y.shape[1], seed)
    ### START CODE HERE ###

    ### END CODE HERE ###
    return params

params = train(X_xor, y_xor)
print(forward(X_xor, params)[0].round(3))`,
        solution: py`def train(X, y, n_h=4, lr=1.0, n_iters=3000, seed=1):
    params = initialize_parameters(X.shape[1], n_h, y.shape[1], seed)
    for _ in range(n_iters):
        A2, cache = forward(X, params)
        g = backward(X, y, params, cache)
        for k in ["W1", "b1", "W2", "b2"]:
            params[k] = params[k] - lr * g["d" + k]
    return params`,
        tests: [
          { name: 'Giải được XOR', code: py`p = train(X_xor, y_xor, 4, 1.0, 3000, 1)
pred = (forward(X_xor, p)[0] > 0.5).astype(int)
assert (pred == y_xor).all(), f"Dự đoán {pred.ravel()}, cần [0 1 1 0]"` },
        ],
        hidden: [
          { name: 'Một bước cập nhật', code: py`p0 = initialize_parameters(2, 3, 1, seed=5)
A2, cache = forward(X_xor, p0)
g = backward(X_xor, y_xor, p0, cache)
p1 = train(X_xor, y_xor, 3, 0.5, 1, 5)
for k in ["W1", "b1", "W2", "b2"]:
    assert close(p1[k], p0[k] - 0.5 * g["d" + k]), f"Cập nhật {k} sau 1 bước chưa đúng"` },
          { name: 'Seed khác', code: py`p = train(X_xor, y_xor, 4, 1.0, 3000, 2)
assert ((forward(X_xor, p)[0] > 0.5).astype(int) == y_xor).all(), "Không giải được XOR với seed = 2"` },
        ],
      },
    ],
  },
};

export const week10: Week = {
  n: 10,
  title: 'PyTorch & huấn luyện mạng sâu',
  stage: 3,
  summary: 'Tensor, autograd, nn.Module, DataLoader, optimizer; kỹ thuật huấn luyện: BatchNorm, Dropout, Momentum, Adam, learning rate schedule.',
  topics: ['Tensor & autograd', 'nn.Module, DataLoader', 'SGD, Momentum, Adam', 'BatchNorm, Dropout', 'Learning rate schedule'],
  practice: 'Phân loại MNIST bằng PyTorch trên Colab. Bài chấm tự động: tự cài Dropout, BatchNorm, Momentum và Adam bằng NumPy để hiểu điều PyTorch làm bên trong.',
  gate: 'pass',
  quiz: {
    questions: [
      {
        id: 'w10q1', kind: 'single',
        prompt: 'Trong PyTorch, lệnh loss.backward() làm gì?',
        options: ['Tính gradient của loss theo các tensor requires_grad=True và cộng dồn vào .grad', 'Cập nhật trọng số mô hình', 'Đặt gradient về 0', 'Chạy lại forward pass'], answer: 0,
        explain: 'Cập nhật trọng số là việc của optimizer.step().',
      },
      {
        id: 'w10q2', kind: 'single',
        prompt: 'Vì sao phải gọi optimizer.zero_grad() trong mỗi vòng lặp huấn luyện?',
        options: ['Gradient được cộng dồn mặc định, không xoá sẽ cộng gradient của các batch trước', 'Để giải phóng bộ nhớ GPU', 'Để khởi tạo lại trọng số', 'Để tắt dropout'], answer: 0,
        explain: 'PyTorch cộng dồn vào .grad để hỗ trợ gradient accumulation.',
      },
      {
        id: 'w10q3', kind: 'single',
        prompt: 'model.eval() có tác dụng gì?',
        options: ['Tắt dropout và cho BatchNorm dùng thống kê running mean/var', 'Tắt việc tính gradient', 'Đánh giá accuracy trên tập test', 'Đóng băng toàn bộ trọng số'], answer: 0,
        explain: 'Tắt tính gradient là torch.no_grad(), một việc khác.',
      },
      {
        id: 'w10q4', kind: 'single',
        prompt: 'Adam kết hợp ý tưởng của:',
        options: ['Momentum và RMSProp', 'L1 và L2 regularization', 'Dropout và BatchNorm', 'SGD và Newton'], answer: 0,
        explain: 'Moment bậc 1 (momentum) và moment bậc 2 (RMSProp), kèm hiệu chỉnh bias.',
      },
      {
        id: 'w10q5', kind: 'numeric',
        prompt: 'Inverted dropout với keep_prob = 0.8: các activation được giữ lại bị nhân với hệ số bao nhiêu?',
        answer: 1.25, tolerance: 1e-6,
        explain: '1 / 0.8 = 1.25, để kỳ vọng activation không đổi.',
      },
      {
        id: 'w10q6', kind: 'single',
        prompt: 'Đoạn code sau in ra gì?',
        code: 'import torch\nx = torch.tensor(2.0, requires_grad=True)\ny = x**3 + 2*x\ny.backward()\nprint(x.grad)',
        options: ['tensor(14.)', 'tensor(12.)', 'tensor(8.)', 'None'], answer: 0,
        explain: 'dy/dx = 3x² + 2 = 14 tại x = 2.',
      },
      {
        id: 'w10q7', kind: 'multi',
        prompt: 'Về torch.utils.data.DataLoader, chọn tất cả phát biểu đúng.',
        options: ['shuffle=True thường dùng cho tập train', 'batch_size quy định số mẫu mỗi bước', 'DataLoader tự tính gradient', 'num_workers cho phép nạp dữ liệu song song'], answer: [0, 1, 3],
        explain: 'DataLoader chỉ lo việc chia batch và nạp dữ liệu.',
      },
    ],
  },
  lab: {
    title: 'Bên trong optimizer và các lớp chuẩn hoá',
    intro: 'Bài chấm chạy trên trình duyệt nên không có PyTorch. Bạn sẽ tự cài những gì `nn.Dropout`, `nn.BatchNorm1d`, `optim.SGD(momentum=…)` và `optim.Adam` làm bên trong — giống lab Optimization Methods của khoá Deep Learning Specialization.',
    setup: py`import numpy as np
np.set_printoptions(precision=5, suppress=True)`,
    packages: ['numpy'],
    exercises: [
      {
        id: 'dropout', title: 'Inverted dropout', points: 25,
        instructions: `Viết \`dropout_forward(A, keep_prob, rng)\`:

\`\`\`
mask = rng.random(A.shape) < keep_prob
out  = A * mask / keep_prob
\`\`\`

Trả về \`(out, mask)\`.`,
        starter: py`# GRADED FUNCTION: dropout_forward
def dropout_forward(A, keep_prob, rng):
    ### START CODE HERE ### (≈ 2 dòng)
    mask = None
    out = None
    ### END CODE HERE ###
    return out, mask

out, mask = dropout_forward(np.ones((2, 5)), 0.8, np.random.default_rng(0))
print(out)`,
        solution: py`def dropout_forward(A, keep_prob, rng):
    mask = rng.random(A.shape) < keep_prob
    return A * mask / keep_prob, mask`,
        tests: [
          { name: 'Theo seed', code: py`out, mask = dropout_forward(np.ones((2, 5)), 0.8, np.random.default_rng(0))
exp_mask = np.random.default_rng(0).random((2, 5)) < 0.8
assert (np.asarray(mask) == exp_mask).all(), "mask sai"
assert close(out, exp_mask / 0.8), "out sai — nhớ chia cho keep_prob"` },
        ],
        hidden: [
          { name: 'Giữ nguyên kỳ vọng', code: py`out, _ = dropout_forward(np.full((400, 400), 3.0), 0.6, np.random.default_rng(1))
assert abs(out.mean() - 3.0) < 0.05, f"Trung bình sau dropout = {out.mean():.3f}, phải xấp xỉ 3"` },
        ],
      },
      {
        id: 'batchnorm', title: 'BatchNorm forward', points: 25,
        instructions: `Viết \`batchnorm_forward(X, gamma, beta, eps=1e-5)\` cho X kích thước (batch, features):

\`\`\`
μ = mean theo batch    σ² = var theo batch (ddof=0)
X̂ = (X − μ) / sqrt(σ² + eps)
out = gamma * X̂ + beta
\`\`\``,
        starter: py`# GRADED FUNCTION: batchnorm_forward
def batchnorm_forward(X, gamma, beta, eps=1e-5):
    ### START CODE HERE ### (≈ 4 dòng)
    out = None
    ### END CODE HERE ###
    return out`,
        solution: py`def batchnorm_forward(X, gamma, beta, eps=1e-5):
    mu = X.mean(axis=0)
    var = X.var(axis=0)
    return gamma * (X - mu) / np.sqrt(var + eps) + beta`,
        tests: [
          { name: 'Chuẩn hoá về mean 0, std 1', code: py`X = np.random.default_rng(2).normal(5, 3, size=(64, 4))
out = batchnorm_forward(X, np.ones(4), np.zeros(4))
assert close(out.mean(axis=0), np.zeros(4), 1e-6) and close(out.std(axis=0), np.ones(4), 1e-4), "Mỗi cột phải có mean 0, std 1"` },
        ],
        hidden: [
          { name: 'gamma, beta', code: py`X = np.random.default_rng(3).normal(size=(32, 3))
g = np.array([2.0, 0.5, 1.0]); b = np.array([1.0, -1.0, 0.0])
exp = g * (X - X.mean(0)) / np.sqrt(X.var(0) + 1e-5) + b
assert close(batchnorm_forward(X, g, b), exp), "Sai khi có gamma, beta"` },
        ],
      },
      {
        id: 'momentum', title: 'SGD với momentum', points: 20,
        instructions: `\`\`\`
v ← β·v + (1 − β)·dw
w ← w − lr·v
\`\`\`

Viết \`momentum_update(w, dw, v, lr, beta=0.9)\` trả về \`(w, v)\` mới.`,
        starter: py`# GRADED FUNCTION: momentum_update
def momentum_update(w, dw, v, lr, beta=0.9):
    ### START CODE HERE ### (≈ 2 dòng)

    ### END CODE HERE ###
    return w, v`,
        solution: py`def momentum_update(w, dw, v, lr, beta=0.9):
    v = beta * v + (1 - beta) * dw
    w = w - lr * v
    return w, v`,
        tests: [
          { name: 'Một bước', code: py`w, v = momentum_update(np.array([1.0, 2.0]), np.array([0.5, -1.0]), np.zeros(2), 0.1)
assert close(v, [0.05, -0.1]) and close(w, [0.995, 2.01]), f"Nhận w={w}, v={v}"` },
        ],
        hidden: [
          { name: 'Nhiều bước', code: py`w = np.array([3.0]); v = np.zeros(1)
for _ in range(3):
    w, v = momentum_update(w, 2 * w, v, 0.1, 0.5)
ww = np.array([3.0]); vv = np.zeros(1)
for _ in range(3):
    vv = 0.5 * vv + 0.5 * 2 * ww; ww = ww - 0.1 * vv
assert close(w, ww) and close(v, vv), "Sai sau nhiều bước"` },
        ],
      },
      {
        id: 'adam', title: 'Adam', points: 30,
        instructions: `\`\`\`
m ← β₁·m + (1 − β₁)·dw
v ← β₂·v + (1 − β₂)·dw²
m̂ = m / (1 − β₁ᵗ)        v̂ = v / (1 − β₂ᵗ)
w ← w − lr · m̂ / (sqrt(v̂) + eps)
\`\`\`

Viết \`adam_update(w, dw, m, v, t, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8)\` trả về \`(w, m, v)\`. t bắt đầu từ 1.`,
        starter: py`# GRADED FUNCTION: adam_update
def adam_update(w, dw, m, v, t, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8):
    ### START CODE HERE ### (≈ 5 dòng)

    ### END CODE HERE ###
    return w, m, v`,
        solution: py`def adam_update(w, dw, m, v, t, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8):
    m = beta1 * m + (1 - beta1) * dw
    v = beta2 * v + (1 - beta2) * dw ** 2
    m_hat = m / (1 - beta1 ** t)
    v_hat = v / (1 - beta2 ** t)
    w = w - lr * m_hat / (np.sqrt(v_hat) + eps)
    return w, m, v`,
        tests: [
          { name: 'Bước đầu tiên ≈ lr·sign(dw)', code: py`w, m, v = adam_update(np.zeros(3), np.array([0.3, -5.0, 0.001]), np.zeros(3), np.zeros(3), 1, lr=0.01)
assert close(w, [-0.01, 0.01, -0.01], 1e-4), f"Ở bước 1, Adam dịch mỗi tham số ≈ lr ngược dấu gradient. Nhận {w}"` },
        ],
        hidden: [
          { name: 'Nhiều bước', code: py`w = np.array([1.0, -2.0]); m = np.zeros(2); v = np.zeros(2)
ww, mm, vv = w.copy(), m.copy(), v.copy()
for t in range(1, 6):
    w, m, v = adam_update(w, 2 * w, m, v, t, lr=0.1)
    g = 2 * ww
    mm = 0.9 * mm + 0.1 * g; vv = 0.999 * vv + 0.001 * g ** 2
    ww = ww - 0.1 * (mm / (1 - 0.9 ** t)) / (np.sqrt(vv / (1 - 0.999 ** t)) + 1e-8)
assert close(w, ww) and close(m, mm) and close(v, vv), "Sai sau 5 bước — kiểm tra hiệu chỉnh bias"` },
        ],
      },
    ],
  },
};

export const week11: Week = {
  n: 11,
  title: 'CNN & thị giác máy tính',
  stage: 3,
  summary: 'Phép tích chập, padding, stride, pooling; các kiến trúc LeNet, VGG, ResNet; transfer learning và data augmentation.',
  topics: ['Convolution', 'Padding, stride, pooling', 'LeNet, VGG', 'ResNet & skip connection', 'Transfer learning', 'Data augmentation'],
  practice: 'Fine-tune ResNet trên CIFAR-10 (Colab). Bài chấm tự động: tự cài lớp tích chập và max pooling bằng NumPy.',
  gate: 'pass',
  quiz: {
    questions: [
      {
        id: 'w11q1', kind: 'numeric',
        prompt: 'Ảnh vào 7×7, kernel 3×3, padding 1, stride 2. Kích thước không gian đầu ra (một chiều) là:',
        answer: 4, tolerance: 1e-6,
        explain: '⌊(7 + 2·1 − 3) / 2⌋ + 1 = ⌊6/2⌋ + 1 = 4.',
      },
      {
        id: 'w11q2', kind: 'numeric',
        prompt: 'Một lớp conv có 16 bộ lọc 3×3 áp lên đầu vào 3 kênh, có bias. Số tham số là:',
        answer: 448, tolerance: 1e-6,
        explain: '3·3·3·16 + 16 = 432 + 16 = 448.',
      },
      {
        id: 'w11q3', kind: 'single',
        prompt: 'Lớp max pooling có bao nhiêu tham số học được?',
        options: ['0', 'f × f', 'f × f × số kênh', 'Bằng số kênh'], answer: 0,
        explain: 'Pooling chỉ có hyperparameter (f, stride), không có trọng số.',
      },
      {
        id: 'w11q4', kind: 'single',
        prompt: 'Skip connection y = F(x) + x trong ResNet giúp gì?',
        options: ['Gradient có đường đi tắt, cho phép huấn luyện mạng rất sâu', 'Giảm số tham số một nửa', 'Tăng độ phân giải ảnh', 'Thay thế hoàn toàn BatchNorm'], answer: 0,
        explain: 'Khối dư chỉ cần học phần sai khác F(x); học hàm đồng nhất trở nên dễ.',
      },
      {
        id: 'w11q5', kind: 'single',
        prompt: 'Bạn có 500 ảnh X-quang có nhãn. Chiến lược hợp lý nhất là:',
        options: ['Dùng backbone tiền huấn luyện trên ImageNet, đóng băng phần lớn và huấn luyện lại phần đầu ra', 'Huấn luyện ResNet-152 từ đầu', 'Dùng KNN trên điểm ảnh thô', 'Tăng số lớp để mô hình mạnh hơn'], answer: 0,
        explain: 'Transfer learning tận dụng đặc trưng đã học khi dữ liệu ít.',
      },
      {
        id: 'w11q6', kind: 'numeric',
        prompt: 'Với kernel 5×5, stride 1, cần padding bao nhiêu để giữ nguyên kích thước ("same")?',
        answer: 2, tolerance: 1e-6,
        explain: 'p = (f − 1) / 2 = 2.',
      },
      {
        id: 'w11q7', kind: 'multi',
        prompt: 'Phép tăng cường dữ liệu nào hợp lý cho ảnh chữ số viết tay (MNIST)?',
        options: ['Xoay nhẹ ±10°', 'Lật ngang ảnh', 'Dịch chuyển vài pixel', 'Thêm nhiễu nhẹ'], answer: [0, 2, 3],
        explain: 'Lật ngang làm thay đổi hình dạng chữ số (ví dụ 2, 5, 7).',
      },
    ],
  },
  lab: {
    title: 'Tích chập từng bước',
    intro: 'Theo lab "Convolutional Model: step by step" của khoá DL Specialization. Quy ước kích thước: A có shape (m, n_H, n_W, n_C); bộ lọc W có shape (f, f, n_C_prev, n_C); bias b có shape (1, 1, 1, n_C).',
    setup: py`import numpy as np
np.set_printoptions(precision=4, suppress=True)
rng = np.random.default_rng(1)
A_demo = rng.standard_normal((2, 5, 7, 4))
W_demo = rng.standard_normal((3, 3, 4, 8))
b_demo = rng.standard_normal((1, 1, 1, 8))`,
    packages: ['numpy'],
    exercises: [
      {
        id: 'pad', title: 'zero_pad', points: 15,
        instructions: `Viết \`zero_pad(X, pad)\` thêm \`pad\` hàng/cột số 0 quanh chiều cao và chiều rộng của mỗi ảnh (không pad chiều m và chiều kênh). Gợi ý: \`np.pad\`.`,
        starter: py`# GRADED FUNCTION: zero_pad
def zero_pad(X, pad):
    ### START CODE HERE ### (≈ 1 dòng)
    X_pad = None
    ### END CODE HERE ###
    return X_pad

print(zero_pad(A_demo, 2).shape)  # (2, 9, 11, 4)`,
        solution: py`def zero_pad(X, pad):
    return np.pad(X, ((0, 0), (pad, pad), (pad, pad), (0, 0)))`,
        tests: [
          { name: 'Kích thước', code: py`assert np.shape(zero_pad(A_demo, 2)) == (2, 9, 11, 4), f"Nhận {np.shape(zero_pad(A_demo, 2))}"` },
        ],
        hidden: [
          { name: 'Viền bằng 0, lõi giữ nguyên', code: py`P = zero_pad(A_demo, 1)
assert close(P[:, 1:-1, 1:-1, :], A_demo), "Phần lõi bị thay đổi"
assert close(P[:, 0, :, :], 0 * P[:, 0, :, :]) and close(P[:, :, -1, :], 0 * P[:, :, -1, :]), "Viền phải bằng 0"` },
        ],
      },
      {
        id: 'single', title: 'conv_single_step', points: 15,
        instructions: `Viết \`conv_single_step(a_slice, W, b)\`: nhân từng phần tử giữa lát cắt (f, f, n_C_prev) và một bộ lọc cùng kích thước, cộng tất cả lại và cộng bias. Trả về **số thực**.`,
        starter: py`# GRADED FUNCTION: conv_single_step
def conv_single_step(a_slice, W, b):
    ### START CODE HERE ### (≈ 2 dòng)
    Z = None
    ### END CODE HERE ###
    return Z`,
        solution: py`def conv_single_step(a_slice, W, b):
    return float(np.sum(a_slice * W) + np.sum(b))`,
        tests: [
          { name: 'Giá trị', code: py`a = A_demo[0, :3, :3, :]; W = W_demo[..., 0]; b = b_demo[..., 0]
r = conv_single_step(a, W, b)
assert close(r, (a * W).sum() + b.sum()), f"Nhận {r}"` },
        ],
        hidden: [
          { name: 'Trả về số thực', code: py`r = conv_single_step(np.ones((2, 2, 3)), np.ones((2, 2, 3)), np.array([[[0.5]]]))
assert close(float(r), 12.5) and np.ndim(r) == 0, f"Phải trả về một số thực 12.5, nhận {r!r}"` },
        ],
      },
      {
        id: 'conv', title: 'conv_forward', points: 40,
        instructions: `Viết \`conv_forward(A_prev, W, b, stride, pad)\`:

\`\`\`
n_H = (n_H_prev − f + 2·pad) // stride + 1
n_W = (n_W_prev − f + 2·pad) // stride + 1
Z[i, h, w, c] = conv_single_step(A_pad[i, vs:vs+f, hs:hs+f, :], W[..., c], b[..., c])
với vs = h·stride, hs = w·stride
\`\`\`

Vòng lặp lồng nhau là chấp nhận được.`,
        starter: py`# GRADED FUNCTION: conv_forward
def conv_forward(A_prev, W, b, stride, pad):
    m, n_H_prev, n_W_prev, n_C_prev = A_prev.shape
    f, f, n_C_prev, n_C = W.shape
    ### START CODE HERE ###
    Z = None
    ### END CODE HERE ###
    return Z

Z = conv_forward(A_demo, W_demo, b_demo, stride=2, pad=1)
print(Z.shape, Z.mean())`,
        solution: py`def conv_forward(A_prev, W, b, stride, pad):
    m, n_H_prev, n_W_prev, n_C_prev = A_prev.shape
    f, f, n_C_prev, n_C = W.shape
    n_H = (n_H_prev - f + 2 * pad) // stride + 1
    n_W = (n_W_prev - f + 2 * pad) // stride + 1
    A_pad = zero_pad(A_prev, pad)
    Z = np.zeros((m, n_H, n_W, n_C))
    for i in range(m):
        for h in range(n_H):
            for w in range(n_W):
                vs, hs = h * stride, w * stride
                for c in range(n_C):
                    Z[i, h, w, c] = conv_single_step(A_pad[i, vs:vs + f, hs:hs + f, :], W[..., c], b[..., c])
    return Z`,
        tests: [
          { name: 'Kích thước (stride 2, pad 1)', code: py`assert np.shape(conv_forward(A_demo, W_demo, b_demo, 2, 1)) == (2, 3, 4, 8), "Kỳ vọng (2, 3, 4, 8)"` },
        ],
        hidden: [
          { name: 'Giá trị', code: py`from numpy.lib.stride_tricks import sliding_window_view as swv
def ref(A, W, b, s, p):
    Ap = np.pad(A, ((0, 0), (p, p), (p, p), (0, 0)))
    win = swv(Ap, W.shape[:2], axis=(1, 2))[:, ::s, ::s]
    return np.einsum('mhwcij,ijcn->mhwn', win, W) + b
for s, p in [(1, 0), (2, 1), (1, 2)]:
    assert close(conv_forward(A_demo, W_demo, b_demo, s, p), ref(A_demo, W_demo, b_demo, s, p)), f"Sai với stride={s}, pad={p}"` },
        ],
      },
      {
        id: 'pool', title: 'max_pool_forward', points: 30,
        instructions: `Viết \`max_pool_forward(A_prev, f, stride)\` (không padding), mỗi kênh pool độc lập:

\`\`\`
n_H = (n_H_prev − f) // stride + 1
A[i, h, w, c] = max của A_prev[i, vs:vs+f, hs:hs+f, c]
\`\`\``,
        starter: py`# GRADED FUNCTION: max_pool_forward
def max_pool_forward(A_prev, f, stride):
    m, n_H_prev, n_W_prev, n_C = A_prev.shape
    ### START CODE HERE ###
    A = None
    ### END CODE HERE ###
    return A

print(max_pool_forward(A_demo, 2, 2).shape)`,
        solution: py`def max_pool_forward(A_prev, f, stride):
    m, n_H_prev, n_W_prev, n_C = A_prev.shape
    n_H = (n_H_prev - f) // stride + 1
    n_W = (n_W_prev - f) // stride + 1
    A = np.zeros((m, n_H, n_W, n_C))
    for h in range(n_H):
        for w in range(n_W):
            vs, hs = h * stride, w * stride
            A[:, h, w, :] = A_prev[:, vs:vs + f, hs:hs + f, :].max(axis=(1, 2))
    return A`,
        tests: [
          { name: 'Kích thước', code: py`assert np.shape(max_pool_forward(A_demo, 2, 2)) == (2, 2, 3, 4), f"Nhận {np.shape(max_pool_forward(A_demo, 2, 2))}"` },
        ],
        hidden: [
          { name: 'Giá trị', code: py`from numpy.lib.stride_tricks import sliding_window_view as swv
for f, s in [(2, 2), (3, 1), (3, 2)]:
    exp = swv(A_demo, (f, f), axis=(1, 2))[:, ::s, ::s].max(axis=(-1, -2))
    assert close(max_pool_forward(A_demo, f, s), exp), f"Sai với f={f}, stride={s}"` },
        ],
      },
    ],
  },
};

export const week12: Week = {
  n: 12,
  title: 'Dữ liệu chuỗi, Attention & Transformer',
  stage: 3,
  summary: 'Tokenization, embedding, RNN/LSTM; cơ chế attention, self-attention, multi-head, positional encoding và kiến trúc Transformer.',
  topics: ['Tokenization', 'Word embedding', 'RNN, LSTM', 'Attention', 'Self-attention, multi-head', 'Positional encoding', 'Transformer'],
  practice: 'Cài một Transformer nhỏ sinh văn bản theo ký tự (Colab). Bài chấm tự động: các khối cốt lõi của Transformer bằng NumPy.',
  gate: 'pass',
  quiz: {
    questions: [
      {
        id: 'w12q1', kind: 'single',
        prompt: 'Self-attention tính toán điều gì?',
        options: ['Mức độ liên quan giữa mỗi vị trí với mọi vị trí khác trong chuỗi, rồi lấy tổng có trọng số các value', 'Chỉ quan hệ giữa hai token liền kề', 'Tần suất xuất hiện của mỗi token', 'Embedding của từng token một cách độc lập'], answer: 0,
        explain: 'softmax(QKᵀ/√d)·V.',
      },
      {
        id: 'w12q2', kind: 'single',
        prompt: 'Vì sao Transformer cần positional encoding?',
        options: ['Self-attention bất biến với hoán vị, không tự biết thứ tự token', 'Để giảm số tham số', 'Để mã hoá nghĩa của từ', 'Để thay thế lớp embedding'], answer: 0,
        explain: 'Không có thông tin vị trí, "chó cắn người" và "người cắn chó" như nhau.',
      },
      {
        id: 'w12q3', kind: 'single',
        prompt: 'Vì sao chia QKᵀ cho √d_k?',
        options: ['Giữ phương sai của điểm số ổn định, tránh softmax bão hoà khi d_k lớn', 'Để kết quả luôn dương', 'Để tiết kiệm bộ nhớ', 'Để chuẩn hoá V'], answer: 0,
        explain: 'Tích vô hướng của vector d chiều có phương sai tỉ lệ với d.',
      },
      {
        id: 'w12q4', kind: 'single',
        prompt: 'Causal mask trong decoder dùng để:',
        options: ['Ngăn mỗi vị trí nhìn thấy các token phía sau nó', 'Bỏ qua token padding', 'Tăng tốc huấn luyện', 'Chọn ngẫu nhiên token để che như BERT'], answer: 0,
        explain: 'Mô hình sinh không được nhìn trước đáp án.',
      },
      {
        id: 'w12q5', kind: 'numeric',
        prompt: 'Multi-head attention với d_model = 512 và 8 head. Kích thước d_k của mỗi head (theo thiết kế chuẩn) là:',
        answer: 64, tolerance: 1e-6,
        explain: '512 / 8 = 64.',
      },
      {
        id: 'w12q6', kind: 'single',
        prompt: 'LSTM cải thiện RNN thường bằng cách:',
        options: ['Thêm cell state và các cổng (forget, input, output) điều tiết dòng thông tin', 'Bỏ hidden state', 'Dùng nhiều lớp hơn', 'Xử lý cả chuỗi song song như Transformer'], answer: 0,
        explain: 'Cell state giúp gradient lan truyền xa hơn.',
      },
      {
        id: 'w12q7', kind: 'multi',
        prompt: 'Về tokenization theo subword (ví dụ BPE), chọn tất cả phát biểu đúng.',
        options: ['Xử lý được từ hiếm bằng cách tách thành các mảnh nhỏ hơn', 'Luôn tách đúng theo khoảng trắng', 'Kích thước từ vựng là một hyperparameter', 'Mỗi từ luôn ứng với đúng một token'], answer: [0, 2],
        explain: 'Một từ có thể thành nhiều token.',
      },
    ],
  },
  lab: {
    title: 'Các khối của Transformer',
    intro: 'Bám theo lab Transformer của khoá Sequence Models. Quy ước mask: giá trị **True/1 nghĩa là được phép nhìn**, False/0 là bị che.',
    setup: py`import numpy as np
np.set_printoptions(precision=4, suppress=True)
rng = np.random.default_rng(0)
Q_demo = rng.standard_normal((4, 8))
K_demo = rng.standard_normal((4, 8))
V_demo = rng.standard_normal((4, 6))`,
    packages: ['numpy'],
    exercises: [
      {
        id: 'softmax', title: 'Softmax ổn định số học', points: 20,
        instructions: `Viết \`softmax(x, axis=-1)\`. Trừ giá trị lớn nhất theo trục trước khi lấy exp để tránh tràn số:

\`\`\`
softmax(x) = exp(x − max x) / Σ exp(x − max x)
\`\`\``,
        starter: py`# GRADED FUNCTION: softmax
def softmax(x, axis=-1):
    x = np.asarray(x, dtype=float)
    ### START CODE HERE ### (≈ 2 dòng)
    s = None
    ### END CODE HERE ###
    return s

print(softmax([1.0, 2.0, 3.0]))`,
        solution: py`def softmax(x, axis=-1):
    x = np.asarray(x, dtype=float)
    e = np.exp(x - x.max(axis=axis, keepdims=True))
    return e / e.sum(axis=axis, keepdims=True)`,
        tests: [
          { name: 'Vector', code: py`assert close(softmax([1.0, 2.0, 3.0]), [0.09003057, 0.24472847, 0.66524096]), "Sai với [1, 2, 3]"` },
        ],
        hidden: [
          { name: 'Số rất lớn', code: py`r = softmax([1000.0, 1000.0])
assert not np.isnan(r).any() and close(r, [0.5, 0.5]), "Tràn số với đầu vào lớn — hãy trừ max"` },
          { name: 'Theo trục', code: py`x = rng.standard_normal((3, 5))
assert close(softmax(x, axis=0).sum(axis=0), np.ones(5)), "Sai khi axis=0"
assert close(softmax(x).sum(axis=-1), np.ones(3)), "Sai khi axis=-1"` },
        ],
      },
      {
        id: 'attention', title: 'Scaled dot-product attention', points: 35,
        instructions: `\`\`\`
scores  = Q @ Kᵀ / sqrt(d_k)
scores  = where(mask, scores, −1e9)    # nếu có mask
weights = softmax(scores, axis=-1)
output  = weights @ V
\`\`\`

Viết \`scaled_dot_product_attention(Q, K, V, mask=None)\` trả về \`(output, weights)\`. Q, K có shape (n, d_k), V có shape (n, d_v).`,
        starter: py`# GRADED FUNCTION: scaled_dot_product_attention
def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.shape[-1]
    ### START CODE HERE ### (≈ 5 dòng)
    output = weights = None
    ### END CODE HERE ###
    return output, weights

out, w = scaled_dot_product_attention(Q_demo, K_demo, V_demo)
print(w.sum(axis=-1))`,
        solution: py`def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.shape[-1]
    scores = Q @ np.swapaxes(K, -1, -2) / np.sqrt(d_k)
    if mask is not None:
        scores = np.where(mask, scores, -1e9)
    weights = softmax(scores, axis=-1)
    return weights @ V, weights`,
        tests: [
          { name: 'Kích thước và tổng trọng số', code: py`out, w = scaled_dot_product_attention(Q_demo, K_demo, V_demo)
assert np.shape(out) == (4, 6) and np.shape(w) == (4, 4), f"out {np.shape(out)}, weights {np.shape(w)}"
assert close(w.sum(axis=-1), np.ones(4)), "Mỗi hàng trọng số phải có tổng 1"` },
        ],
        hidden: [
          { name: 'Giá trị không mask', code: py`s = Q_demo @ K_demo.T / np.sqrt(8)
e = np.exp(s - s.max(1, keepdims=True)); w = e / e.sum(1, keepdims=True)
out, ww = scaled_dot_product_attention(Q_demo, K_demo, V_demo)
assert close(ww, w) and close(out, w @ V_demo), "Sai giá trị — nhớ chia cho √d_k"` },
          { name: 'Có mask', code: py`mask = np.array([[1, 0, 0, 0], [1, 1, 0, 0], [1, 1, 1, 0], [1, 1, 1, 1]], dtype=bool)
out, w = scaled_dot_product_attention(Q_demo, K_demo, V_demo, mask)
assert close(w[~mask], np.zeros((~mask).sum())), "Vị trí bị che phải có trọng số 0"
assert close(out[0], V_demo[0]), "Hàng đầu chỉ được nhìn chính nó"` },
        ],
      },
      {
        id: 'causal', title: 'Causal mask', points: 15,
        instructions: `Viết \`causal_mask(n)\` trả về ma trận bool (n, n), \`True\` ở đường chéo và phía dưới (vị trí i được nhìn j khi j ≤ i).`,
        starter: py`# GRADED FUNCTION: causal_mask
def causal_mask(n):
    ### START CODE HERE ### (≈ 1 dòng)
    mask = None
    ### END CODE HERE ###
    return mask

print(causal_mask(4).astype(int))`,
        solution: py`def causal_mask(n):
    return np.tril(np.ones((n, n), dtype=bool))`,
        tests: [
          { name: 'n = 3', code: py`assert (np.asarray(causal_mask(3)) == np.array([[1, 0, 0], [1, 1, 0], [1, 1, 1]], dtype=bool)).all(), "Sai với n = 3"` },
        ],
        hidden: [
          { name: 'Kiểu bool', code: py`m = causal_mask(6)
assert np.asarray(m).dtype == bool and np.shape(m) == (6, 6), "Phải là mảng bool (n, n)"
assert np.asarray(m).sum() == 21, "Số vị trí True phải là n(n+1)/2"` },
        ],
      },
      {
        id: 'posenc', title: 'Positional encoding', points: 30,
        instructions: `Viết \`positional_encoding(max_len, d_model)\` trả về ma trận (max_len, d_model):

\`\`\`
PE[pos, 2i]   = sin(pos / 10000^(2i / d_model))
PE[pos, 2i+1] = cos(pos / 10000^(2i / d_model))
\`\`\``,
        starter: py`# GRADED FUNCTION: positional_encoding
def positional_encoding(max_len, d_model):
    ### START CODE HERE ### (≈ 5 dòng)
    PE = None
    ### END CODE HERE ###
    return PE

print(positional_encoding(3, 4))`,
        solution: py`def positional_encoding(max_len, d_model):
    pos = np.arange(max_len)[:, None]
    i = np.arange(d_model)[None, :]
    angle = pos / np.power(10000, (2 * (i // 2)) / d_model)
    return np.where(i % 2 == 0, np.sin(angle), np.cos(angle))`,
        tests: [
          { name: 'Vị trí 0 và 1', code: py`PE = positional_encoding(3, 4)
assert np.shape(PE) == (3, 4), "Sai kích thước"
assert close(PE[0], [0, 1, 0, 1]), f"PE[0] phải là [0, 1, 0, 1], nhận {PE[0]}"
assert close(PE[1, :2], [np.sin(1), np.cos(1)]), "PE[1] sai"` },
        ],
        hidden: [
          { name: 'Toàn bộ', code: py`L, d = 20, 16
exp = np.zeros((L, d))
for p in range(L):
    for k in range(0, d, 2):
        a = p / 10000 ** (k / d)
        exp[p, k] = np.sin(a); exp[p, k + 1] = np.cos(a)
assert close(positional_encoding(L, d), exp), "Sai so với công thức"` },
        ],
      },
    ],
  },
};
