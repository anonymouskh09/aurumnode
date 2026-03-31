<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reset your password</title>
</head>
<body style="margin:0;background:#0f1322;padding:24px;font-family:Arial,sans-serif;">
<div style="max-width:640px;margin:0 auto;background:#1a1f31;border:1px solid #303650;border-radius:14px;padding:24px;color:#f8fafc;">
    <img
        src="{{ rtrim(config('app.url'), '/') . '/images/brand/emailLogo.jpeg' }}"
        alt="AurumNode"
        style="width:100%;max-width:592px;height:auto;display:block;border-radius:10px;margin:0 0 18px;"
    >
    <h1 style="margin:0 0 14px;font-size:22px;line-height:1.3;color:#f8fafc;">Reset your password</h1>
    <p style="margin:0 0 12px;color:#cbd5e1;">Hi {{ $user->name ?? 'Member' }},</p>
    <p style="margin:0 0 14px;color:#cbd5e1;line-height:1.7;">
        We received a request to reset your account password. Click the button below to continue.
    </p>
    <p style="margin:0 0 14px;">
        <a href="{{ $resetUrl }}" style="display:inline-block;background:#f59e0b;color:#111827;padding:10px 16px;border-radius:10px;text-decoration:none;font-weight:600;">
            Reset Password
        </a>
    </p>
    <p style="margin:0;color:#94a3b8;font-size:13px;">
        If you did not request a password reset, no further action is required.
    </p>

    @include('emails.partials.brand-footer')
</div>
</body>
</html>

