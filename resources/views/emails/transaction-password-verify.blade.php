<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Verify transaction password</title></head>
<body style="font-family:sans-serif;padding:20px;">
<h1>Verify your transaction password</h1>
<p>Hi {{ $user->name }},</p>
<p>You requested to set or update your transaction password. Click the link below to confirm. This link expires in 60 minutes.</p>
<p><a href="{{ $verifyUrl }}" style="display:inline-block;padding:10px 20px;background:#0d9488;color:#fff;text-decoration:none;border-radius:8px;">Verify and set transaction password</a></p>
<p>If you did not request this, you can ignore this email.</p>
<p>— Aurum Node</p>
</body>
</html>
