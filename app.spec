# app.spec
# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['app.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('frontend/**/*', 'frontend'),
        ('modelsW/**/*', 'modelsW'),
        ('ffmpeg/**/*', 'ffmpeg'),
        ('.cache/whisper/base.pt', '.cache/whisper'),
        ('.cache/whisper/medium.pt', '.cache/whisper'),
        ('.cache/whisper/large-v2.pt', '.cache/whisper')
    ],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='mopAi',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,  # если не нужна консоль - поменяй на False
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=None
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='mopAi',
)

app = BUNDLE(
    coll,
    name='mopAi',
    icon=None,
    bundle_identifier=None
)
