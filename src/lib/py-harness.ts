// Python harness shared by the browser worker (public tests, interactive runs)
// and the server grader (hidden tests). Kept in one place so a student's
// "Kiểm tra" result in the browser matches what the grader computes.

export const PY_HARNESS = String.raw`
import json as _json, io as _io, sys as _sys, traceback as _tb, contextlib as _cl, base64 as _b64, os as _os
_os.environ.setdefault('MPLBACKEND', 'Agg')

_MAX_OUT = 6000

def _short_error(e, prefix='<cell'):
    line = None
    tb = e.__traceback__
    while tb is not None:
        if tb.tb_frame.f_code.co_filename.startswith(prefix):
            line = tb.tb_lineno
        tb = tb.tb_next
    if isinstance(e, SyntaxError) and e.lineno:
        line = e.lineno
    msg = ''.join(_tb.format_exception_only(type(e), e)).strip()
    return (f"Dòng {line}: " if line else "") + msg

def _make_close():
    try:
        import numpy as _np
        _allclose, _asarray = _np.allclose, _np.asarray
    except Exception:
        _np = None
    def close(a, b, tol=1e-6):
        if _np is None:
            return abs(a - b) <= tol
        try:
            a_ = _asarray(a, dtype=float)
            b_ = _asarray(b, dtype=float)
        except Exception:
            return False
        return a_.shape == b_.shape and bool(_allclose(a_, b_, atol=tol, rtol=tol))
    return close

def _run(code, ns, filename):
    buf = _io.StringIO()
    err = None
    try:
        with _cl.redirect_stdout(buf), _cl.redirect_stderr(buf):
            exec(compile(code, filename, 'exec'), ns)
    except BaseException as e:
        if isinstance(e, KeyboardInterrupt):
            raise
        err = _short_error(e)
    out = buf.getvalue()
    if len(out) > _MAX_OUT:
        out = out[:_MAX_OUT] + '\n… (đã cắt bớt output)'
    return err, out

def __dslab_grade(payload_json):
    p = _json.loads(payload_json)
    close = _make_close()
    ns = {'__name__': '__main__'}
    res = {'setupError': None, 'cells': {}, 'tests': []}
    err, _ = _run(p['setup'], ns, '<setup>')
    if err:
        res['setupError'] = err
    for cell in p['cells']:
        err, out = _run(cell['code'], ns, '<cell ' + cell['id'] + '>')
        res['cells'][cell['id']] = {'error': err, 'stdout': out}
    for t in p['tests']:
        cell = res['cells'].get(t['exercise'])
        r = {'exercise': t['exercise'], 'name': t['name'], 'passed': False, 'message': ''}
        if cell is None:
            r['message'] = 'Chưa có code cho bài này.'
        elif cell['error']:
            r['message'] = 'Ô code đang lỗi: ' + cell['error']
        else:
            env = dict(ns)
            env['close'] = close
            buf = _io.StringIO()
            try:
                with _cl.redirect_stdout(buf), _cl.redirect_stderr(buf):
                    exec(compile(t['code'], '<test>', 'exec'), env)
                r['passed'] = True
            except AssertionError as e:
                r['message'] = str(e) or 'Kết quả chưa đúng.'
            except BaseException as e:
                if isinstance(e, KeyboardInterrupt):
                    raise
                r['message'] = _short_error(e, '<test')
        res['tests'].append(r)
    return _json.dumps(res, ensure_ascii=False)

__dslab_kernel = {'__name__': '__main__'}

def __dslab_reset(setup):
    global __dslab_kernel
    __dslab_kernel = {'__name__': '__main__'}
    err, out = _run(setup, __dslab_kernel, '<setup>')
    return _json.dumps({'error': err, 'stdout': out}, ensure_ascii=False)

def __dslab_exec(code, cell_id):
    err, out = _run(code, __dslab_kernel, '<cell ' + cell_id + '>')
    figs = []
    mpl = _sys.modules.get('matplotlib.pyplot')
    if mpl is not None:
        for num in mpl.get_fignums()[:4]:
            fig = mpl.figure(num)
            b = _io.BytesIO()
            fig.savefig(b, format='png', dpi=110, bbox_inches='tight')
            figs.append(_b64.b64encode(b.getvalue()).decode())
        mpl.close('all')
    return _json.dumps({'error': err, 'stdout': out, 'figures': figs}, ensure_ascii=False)
`;
